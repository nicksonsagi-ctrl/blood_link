import { pgTable, text, boolean, integer, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  uid: text('uid').unique(),
  email: text('email').notNull(),
  passwordHash: text('password_hash'),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('DONOR'),
  status: text('status').notNull().default('ACTIVE'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const donorProfiles = pgTable('donor_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  bloodGroup: text('blood_group').notNull(),
  dob: text('dob'),
  province: text('province').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  address: text('address'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  lastDonationDate: text('last_donation_date'),
  isAvailable: boolean('is_available').default(true),
  contactPreferences: text('contact_preferences').default('EMAIL_AND_PHONE'),
  consentGiven: boolean('consent_given').default(true),
  verifiedAt: text('verified_at'),
  verifiedBy: text('verified_by'),
});

export const requesterProfiles = pgTable('requester_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  province: text('province').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  organizationName: text('organization_name'),
});

export const bloodRequests = pgTable('blood_requests', {
  id: text('id').primaryKey(),
  patientReference: text('patient_reference'),
  requesterId: text('requester_id'),
  requesterName: text('requester_name'),
  contactPhone: text('contact_phone'),
  bloodGroup: text('blood_group').notNull(),
  unitsRequired: integer('units_required').notNull().default(1),
  hospital: text('hospital').notNull(),
  province: text('province').notNull(),
  district: text('district').notNull(),
  city: text('city').notNull(),
  requiredDate: text('required_date').notNull(),
  urgency: text('urgency').notNull().default('STANDARD'),
  additionalNotes: text('additional_notes'),
  status: text('status').notNull().default('PENDING_VERIFICATION'),
  verifiedAt: text('verified_at'),
  verifiedBy: text('verified_by'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const donorContactRequests = pgTable('donor_contact_requests', {
  id: text('id').primaryKey(),
  requesterId: text('requester_id').notNull(),
  requesterName: text('requester_name').notNull(),
  requesterPhone: text('requester_phone'),
  donorId: text('donor_id').notNull(),
  bloodRequestId: text('blood_request_id'),
  message: text('message').notNull(),
  status: text('status').notNull().default('PENDING'),
  responseNote: text('response_note'),
  respondedAt: text('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const donationAppointments = pgTable('donation_appointments', {
  id: text('id').primaryKey(),
  requesterId: text('requester_id').notNull(),
  requesterName: text('requester_name').notNull(),
  donorId: text('donor_id').notNull(),
  hospitalName: text('hospital_name').notNull(),
  scheduledAt: text('scheduled_at').notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('REQUESTED'),
  rescheduleNotes: text('reschedule_notes'),
  completedAt: text('completed_at'),
  completedNotes: text('completed_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const donationHistory = pgTable('donation_history', {
  id: text('id').primaryKey(),
  donorId: text('donor_id').notNull(),
  donorName: text('donor_name').notNull(),
  donationDate: text('donation_date').notNull(),
  hospitalName: text('hospital_name').notNull(),
  unitsDonated: integer('units_donated').default(1),
  certificateUrl: text('certificate_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  organizer: text('organizer').notNull(),
  location: text('location').notNull(),
  district: text('district').notNull(),
  province: text('province').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  targetUnits: integer('target_units').notNull(),
  collectedUnits: integer('collected_units').default(0),
  bannerUrl: text('banner_url'),
  status: text('status').notNull().default('UPCOMING'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const campaignRegistrations = pgTable('campaign_registrations', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').notNull(),
  userId: text('user_id'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  bloodGroup: text('blood_group').notNull(),
  registeredAt: timestamp('registered_at').defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  isResolved: boolean('is_resolved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').notNull(),
  actorEmail: text('actor_email').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  metadata: text('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  donorProfile: one(donorProfiles, {
    fields: [users.id],
    references: [donorProfiles.userId],
  }),
  requesterProfile: one(requesterProfiles, {
    fields: [users.id],
    references: [requesterProfiles.userId],
  }),
  campaignRegistrations: many(campaignRegistrations),
}));

export const donorProfilesRelations = relations(donorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [donorProfiles.userId],
    references: [users.id],
  }),
}));

export const requesterProfilesRelations = relations(requesterProfiles, ({ one }) => ({
  user: one(users, {
    fields: [requesterProfiles.userId],
    references: [users.id],
  }),
}));
