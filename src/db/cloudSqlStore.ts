import { db } from './index.ts';
import * as schema from './schema.ts';
import { eq, ne } from 'drizzle-orm';
import { db as memoryStore } from '../../server/store.ts';
import type {
  User,
  DonorProfile,
  RequesterProfile,
  BloodRequest,
  DonorContactRequest,
  DonationAppointment,
  Campaign,
  CampaignRegistration,
  ContactMessage,
  AuditLog
} from '../../server/store.ts';

export function isCloudSqlAvailable(): boolean {
  return Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD && process.env.SQL_DB_NAME);
}

export async function initCloudSqlData() {
  if (!isCloudSqlAvailable()) {
    console.log('[Cloud SQL] SQL_HOST not detected. Running with in-memory persistence.');
    return;
  }

  try {
    console.log('[Cloud SQL] Initializing PostgreSQL database connection and data sync...');
    const existingUsers = await db.select().from(schema.users).limit(1);

    if (existingUsers.length === 0) {
      console.log('[Cloud SQL] Seeding initial LifeLink records into PostgreSQL database...');
      // Seed users from default memoryStore
      for (const user of memoryStore.users.values()) {
        await db.insert(schema.users).values({
          id: user.id,
          email: user.email,
          passwordHash: user.passwordHash,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
          status: user.status,
          isVerified: user.isVerified,
        }).onConflictDoNothing();
      }

      // Seed donor profiles
      for (const donor of memoryStore.donorProfiles.values()) {
        await db.insert(schema.donorProfiles).values({
          id: donor.id,
          userId: donor.userId,
          bloodGroup: donor.bloodGroup,
          dob: donor.dob,
          province: donor.province,
          district: donor.district,
          city: donor.city,
          address: donor.address || null,
          lat: donor.lat || null,
          lng: donor.lng || null,
          lastDonationDate: donor.lastDonationDate || null,
          isAvailable: donor.isAvailable,
          contactPreferences: donor.contactPreferences,
          consentGiven: donor.consentGiven,
          verifiedAt: donor.verifiedAt || null,
          verifiedBy: donor.verifiedBy || null,
        }).onConflictDoNothing();
      }

      // Seed requester profiles
      for (const req of memoryStore.requesterProfiles.values()) {
        await db.insert(schema.requesterProfiles).values({
          id: req.id,
          userId: req.userId,
          province: req.province,
          district: req.district,
          city: req.city,
          organizationName: req.organizationName || null,
        }).onConflictDoNothing();
      }

      // Seed campaigns
      for (const camp of memoryStore.campaigns.values()) {
        await db.insert(schema.campaigns).values({
          id: camp.id,
          title: camp.title,
          organizer: camp.organizer,
          location: camp.location,
          district: camp.district,
          province: camp.province,
          startDate: camp.startDate,
          endDate: camp.endDate,
          targetUnits: camp.targetUnits,
          collectedUnits: camp.collectedUnits,
          bannerUrl: camp.bannerUrl || null,
          status: camp.status,
          description: camp.description || null,
        }).onConflictDoNothing();
      }

      // Seed blood requests
      for (const br of memoryStore.bloodRequests.values()) {
        await db.insert(schema.bloodRequests).values({
          id: br.id,
          patientReference: br.patientReference || null,
          requesterId: br.requesterId || null,
          requesterName: br.requesterName || null,
          contactPhone: br.contactPhone || null,
          bloodGroup: br.bloodGroup,
          unitsRequired: br.unitsRequired,
          hospital: br.hospital,
          province: br.province,
          district: br.district,
          city: br.city,
          requiredDate: br.requiredDate,
          urgency: br.urgency,
          additionalNotes: br.additionalNotes || null,
          status: br.status,
          verifiedAt: br.verifiedAt || null,
          verifiedBy: br.verifiedBy || null,
        }).onConflictDoNothing();
      }

      console.log('[Cloud SQL] Default seed data committed successfully to PostgreSQL.');
    } else {
      console.log('[Cloud SQL] Fetching existing records from Cloud SQL into fast memory cache...');
      const usersList = await db.select().from(schema.users);
      for (const u of usersList) {
        memoryStore.users.set(u.id, {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash || '',
          fullName: u.fullName,
          phone: u.phone || '',
          role: u.role as any,
          status: u.status as any,
          isVerified: Boolean(u.isVerified),
          createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: u.updatedAt ? u.updatedAt.toISOString() : new Date().toISOString(),
        });
      }

      const donorsList = await db.select().from(schema.donorProfiles);
      for (const d of donorsList) {
        memoryStore.donorProfiles.set(d.userId, {
          id: d.id,
          userId: d.userId,
          bloodGroup: d.bloodGroup,
          dob: d.dob || '',
          province: d.province,
          district: d.district,
          city: d.city,
          address: d.address || undefined,
          lat: d.lat || undefined,
          lng: d.lng || undefined,
          lastDonationDate: d.lastDonationDate || null,
          isAvailable: Boolean(d.isAvailable),
          contactPreferences: d.contactPreferences || 'EMAIL_AND_PHONE',
          consentGiven: Boolean(d.consentGiven),
          verifiedAt: d.verifiedAt || null,
          verifiedBy: d.verifiedBy || null,
        });
      }

      const requestersList = await db.select().from(schema.requesterProfiles);
      for (const r of requestersList) {
        memoryStore.requesterProfiles.set(r.userId, {
          id: r.id,
          userId: r.userId,
          province: r.province,
          district: r.district,
          city: r.city,
          organizationName: r.organizationName || undefined,
        });
      }

      const bloodReqsList = await db.select().from(schema.bloodRequests);
      for (const br of bloodReqsList) {
        memoryStore.bloodRequests.set(br.id, {
          id: br.id,
          patientReference: br.patientReference || '',
          requesterId: br.requesterId || '',
          requesterName: br.requesterName || '',
          contactPhone: br.contactPhone || '',
          bloodGroup: br.bloodGroup,
          unitsRequired: br.unitsRequired,
          hospital: br.hospital,
          province: br.province,
          district: br.district,
          city: br.city,
          requiredDate: br.requiredDate,
          urgency: br.urgency as any,
          additionalNotes: br.additionalNotes || '',
          status: br.status as any,
          verifiedAt: br.verifiedAt || undefined,
          verifiedBy: br.verifiedBy || undefined,
          createdAt: br.createdAt ? br.createdAt.toISOString() : new Date().toISOString(),
        });
      }

      console.log(`[Cloud SQL] Successfully loaded ${usersList.length} users and ${donorsList.length} donors.`);
    }
  } catch (error) {
    console.error('[Cloud SQL] Database synchronization failed:', error);
  }
}

export async function saveUserToCloudSql(user: User): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.users).values({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
    }).onConflictDoUpdate({
      target: schema.users.id,
      set: {
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        updatedAt: new Date(),
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveUser error:', err);
  }
}

export async function saveDonorProfileToCloudSql(profile: DonorProfile): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.donorProfiles).values({
      id: profile.id,
      userId: profile.userId,
      bloodGroup: profile.bloodGroup,
      dob: profile.dob,
      province: profile.province,
      district: profile.district,
      city: profile.city,
      address: profile.address || null,
      lat: profile.lat || null,
      lng: profile.lng || null,
      lastDonationDate: profile.lastDonationDate,
      isAvailable: profile.isAvailable,
      contactPreferences: profile.contactPreferences,
      consentGiven: profile.consentGiven,
      verifiedAt: profile.verifiedAt,
      verifiedBy: profile.verifiedBy,
    }).onConflictDoUpdate({
      target: schema.donorProfiles.id,
      set: {
        bloodGroup: profile.bloodGroup,
        isAvailable: profile.isAvailable,
        lastDonationDate: profile.lastDonationDate,
        province: profile.province,
        district: profile.district,
        city: profile.city,
        verifiedAt: profile.verifiedAt,
        verifiedBy: profile.verifiedBy,
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveDonorProfile error:', err);
  }
}

export async function saveRequesterProfileToCloudSql(profile: RequesterProfile): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.requesterProfiles).values({
      id: profile.id,
      userId: profile.userId,
      province: profile.province,
      district: profile.district,
      city: profile.city,
      organizationName: profile.organizationName || null,
    }).onConflictDoUpdate({
      target: schema.requesterProfiles.id,
      set: {
        province: profile.province,
        district: profile.district,
        city: profile.city,
        organizationName: profile.organizationName || null,
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveRequesterProfile error:', err);
  }
}

export async function saveBloodRequestToCloudSql(req: BloodRequest): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.bloodRequests).values({
      id: req.id,
      patientReference: req.patientReference || null,
      requesterId: req.requesterId || null,
      requesterName: req.requesterName || null,
      contactPhone: req.contactPhone || null,
      bloodGroup: req.bloodGroup,
      unitsRequired: req.unitsRequired,
      hospital: req.hospital,
      province: req.province,
      district: req.district,
      city: req.city,
      requiredDate: req.requiredDate,
      urgency: req.urgency,
      additionalNotes: req.additionalNotes || null,
      status: req.status,
      verifiedAt: req.verifiedAt || null,
      verifiedBy: req.verifiedBy || null,
    }).onConflictDoUpdate({
      target: schema.bloodRequests.id,
      set: {
        status: req.status,
        verifiedAt: req.verifiedAt || null,
        verifiedBy: req.verifiedBy || null,
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveBloodRequest error:', err);
  }
}

export async function saveContactRequestToCloudSql(req: DonorContactRequest): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.donorContactRequests).values({
      id: req.id,
      requesterId: req.requesterId,
      requesterName: req.requesterName,
      requesterPhone: req.requesterPhone || null,
      donorId: req.donorId,
      bloodRequestId: req.bloodRequestId || null,
      message: req.message,
      status: req.status,
      responseNote: req.responseNote || null,
      respondedAt: req.respondedAt || null,
    }).onConflictDoUpdate({
      target: schema.donorContactRequests.id,
      set: {
        status: req.status,
        responseNote: req.responseNote || null,
        respondedAt: req.respondedAt || null,
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveContactRequest error:', err);
  }
}

export async function saveAppointmentToCloudSql(appt: DonationAppointment): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.donationAppointments).values({
      id: appt.id,
      requesterId: appt.requesterId,
      requesterName: appt.requesterName,
      donorId: appt.donorId,
      hospitalName: appt.hospitalName,
      scheduledAt: appt.scheduledAt,
      notes: appt.notes || null,
      status: appt.status,
      rescheduleNotes: appt.rescheduleNotes || null,
      completedAt: appt.completedAt || null,
      completedNotes: appt.completedNotes || null,
    }).onConflictDoUpdate({
      target: schema.donationAppointments.id,
      set: {
        status: appt.status,
        rescheduleNotes: appt.rescheduleNotes || null,
        completedAt: appt.completedAt || null,
        completedNotes: appt.completedNotes || null,
      }
    });
  } catch (err) {
    console.warn('[Cloud SQL] saveAppointment error:', err);
  }
}

export async function saveCampaignRegistrationToCloudSql(reg: CampaignRegistration): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.campaignRegistrations).values({
      id: reg.id,
      campaignId: reg.campaignId,
      userId: reg.userId || null,
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone || null,
      bloodGroup: reg.bloodGroup,
    }).onConflictDoNothing();
  } catch (err) {
    console.warn('[Cloud SQL] saveCampaignRegistration error:', err);
  }
}

export async function saveContactMessageToCloudSql(msg: ContactMessage): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.contactMessages).values({
      id: msg.id,
      fullName: msg.fullName,
      email: msg.email,
      phone: msg.phone || null,
      subject: msg.subject,
      message: msg.message,
      isRead: msg.isRead,
      isResolved: msg.isResolved,
    }).onConflictDoNothing();
  } catch (err) {
    console.warn('[Cloud SQL] saveContactMessage error:', err);
  }
}

export async function saveAuditLogToCloudSql(log: AuditLog): Promise<void> {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.insert(schema.auditLogs).values({
      id: log.id,
      actorId: log.actorId,
      actorEmail: log.actorEmail,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      metadata: log.metadata || null,
      ipAddress: log.ipAddress || null,
    }).onConflictDoNothing();
  } catch (err) {
    console.warn('[Cloud SQL] saveAuditLog error:', err);
  }
}

export async function getCloudSqlLiveTables() {
  if (!isCloudSqlAvailable()) return null;
  try {
    const rawUsers = await db.select({
      id: schema.users.id,
      email: schema.users.email,
      fullName: schema.users.fullName,
      phone: schema.users.phone,
      role: schema.users.role,
      status: schema.users.status,
      isVerified: schema.users.isVerified,
      createdAt: schema.users.createdAt,
    }).from(schema.users).limit(50);

    const rawDonors = await db.select().from(schema.donorProfiles).limit(50);
    const rawRequests = await db.select().from(schema.bloodRequests).limit(50);
    const rawCampaigns = await db.select().from(schema.campaigns).limit(50);

    return {
      connected: true,
      tables: {
        users: rawUsers,
        donorProfiles: rawDonors,
        bloodRequests: rawRequests,
        campaigns: rawCampaigns,
      },
      counts: {
        users: rawUsers.length,
        donors: rawDonors.length,
        bloodRequests: rawRequests.length,
        campaigns: rawCampaigns.length,
      }
    };
  } catch (err: any) {
    console.warn('[Cloud SQL] getCloudSqlLiveTables error:', err);
    return { connected: false, error: err.message };
  }
}

export async function deleteUserFromCloudSql(userId: string) {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.delete(schema.donorProfiles).where(eq(schema.donorProfiles.userId, userId));
    await db.delete(schema.requesterProfiles).where(eq(schema.requesterProfiles.userId, userId));
    await db.delete(schema.users).where(eq(schema.users.id, userId));
    console.log(`[Cloud SQL] Successfully deleted user: ${userId}`);
  } catch (err) {
    console.warn('[Cloud SQL] deleteUser error:', err);
  }
}

export async function deleteAllNonAdminUsersFromCloudSql(adminIdToKeep: string) {
  if (!isCloudSqlAvailable()) return;
  try {
    await db.delete(schema.donorProfiles).where(ne(schema.donorProfiles.userId, adminIdToKeep));
    await db.delete(schema.requesterProfiles).where(ne(schema.requesterProfiles.userId, adminIdToKeep));
    await db.delete(schema.users).where(ne(schema.users.id, adminIdToKeep));
    console.log(`[Cloud SQL] Successfully cleared non-admin users, kept admin: ${adminIdToKeep}`);
  } catch (err) {
    console.warn('[Cloud SQL] deleteAllNonAdminUsers error:', err);
  }
}


