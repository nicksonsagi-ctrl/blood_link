import React, { useState, useEffect } from 'react';
import {
  Heart,
  LayoutDashboard,
  User,
  ToggleLeft,
  ToggleRight,
  Droplets,
  MessageSquare,
  Calendar,
  History,
  Flag,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  AlertCircle,
  Navigation,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { authFetch } from '../services/api.js';
import { DonorContactRequest, DonationAppointment, DonationHistory, BloodRequest, Campaign } from '../types/index.js';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankaData.js';
import { InteractiveMapNav } from '../components/InteractiveMapNav.js';

export const DonorDashboard: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'availability' | 'requests' | 'contacts' | 'appointments' | 'history' | 'campaigns' | 'hospitalMap' | 'notifications' | 'settings'
  >('overview');

  const donorProfile = user?.donorProfile;

  // Local state for profile and availability
  const [isAvailable, setIsAvailable] = useState<boolean>(donorProfile?.isAvailable ?? true);
  const [city, setCity] = useState(donorProfile?.city || 'Jaffna Town');
  const [district, setDistrict] = useState(donorProfile?.district || 'Jaffna');
  const [address, setAddress] = useState(donorProfile?.address || '');
  const [contactPrefs, setContactPrefs] = useState(donorProfile?.contactPreferences || 'CALL_AND_SMS');
  const [lastDonationDate, setLastDonationDate] = useState(donorProfile?.lastDonationDate || '');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Data loaded from server
  const [contactRequests, setContactRequests] = useState<DonorContactRequest[]>([]);
  const [appointments, setAppointments] = useState<DonationAppointment[]>([]);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Response notes modal/input state
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const loadData = async () => {
    try {
      const [resC, resA, resH, resR, resCamp] = await Promise.all([
        authFetch('/api/contact-requests').then(r => r.json()),
        authFetch('/api/appointments').then(r => r.json()),
        authFetch('/api/donation-history').then(r => r.json()),
        authFetch('/api/requests').then(r => r.json()),
        authFetch('/api/campaigns').then(r => r.json())
      ]);

      if (resC.success) setContactRequests(resC.requests);
      if (resA.success) setAppointments(resA.appointments);
      if (resH.success) setDonationHistory(resH.history);
      if (resR.success) setBloodRequests(resR.requests);
      if (resCamp.success) setCampaigns(resCamp.campaigns);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = async (newVal: boolean) => {
    setIsAvailable(newVal);
    try {
      const res = await authFetch('/api/donors/profile', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: newVal })
      });
      if (res.ok) {
        setSaveSuccess('Availability updated successfully.');
        refreshUser();
      }
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(null);
    try {
      const res = await authFetch('/api/donors/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          city,
          district,
          address,
          contactPreferences: contactPrefs,
          lastDonationDate: lastDonationDate || null
        })
      });
      if (res.ok) {
        setSaveSuccess('Profile preferences saved to database.');
        refreshUser();
      }
    } catch {
      // ignore
    }
  };

  const handleRespondContact = async (id: string, status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED', noteOverride?: string) => {
    try {
      const finalNote = noteOverride !== undefined ? noteOverride : responseNote;
      const res = await authFetch(`/api/contact-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, responseNote: finalNote })
      });
      if (res.ok) {
        setActiveContactId(null);
        setResponseNote('');
        if (status === 'ACCEPTED') {
          setSaveSuccess('You accepted the donation request! Requester has been notified.');
        } else if (status === 'COMPLETED') {
          setSaveSuccess('🎉 Blood donation marked as completed! Thank you for saving a life. (ரத்தம் வெற்றிகரமாக வழங்கப்பட்டது)');
        } else {
          setSaveSuccess('You declined the donation request. Requester has been notified.');
        }
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const handleClearContact = async (id: string) => {
    try {
      const res = await authFetch(`/api/contact-requests/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSaveSuccess('Contact request cleared from your active list.');
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const handleClearAllInactive = async () => {
    try {
      const res = await authFetch('/api/contact-requests/clear-all/inactive', {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(data.message || 'Cleared inactive contact requests.');
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const handleRespondAppointment = async (id: string, status: 'ACCEPTED' | 'DECLINED' | 'RESCHEDULE_REQUESTED', note?: string) => {
    try {
      const res = await authFetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rescheduleNotes: note })
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      // ignore
    }
  };

  const pendingContacts = contactRequests.filter(r => r.status === 'PENDING');
  const upcomingAppointments = appointments.filter(a => ['REQUESTED', 'ACCEPTED'].includes(a.status));

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex">
      
      {/* Dark Red Sidebar (as specified: Dark red sidebar) */}
      <aside className="w-64 bg-[#7A0012] text-white flex flex-col shrink-0 shadow-xl">
        
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-[#7A0012] flex items-center justify-center font-bold">
            <Heart className="w-4 h-4 fill-[#7A0012]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">LifeLink</span>
            <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Donor Portal</span>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-black/20 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate">{user?.fullName}</span>
            <span className="text-xs font-extrabold text-white bg-[#DC0A20] px-2 py-0.5 rounded">
              {donorProfile?.bloodGroup || 'O+'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{user?.isVerified ? 'Verified Active Donor' : 'Pending Verification'}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto text-xs font-medium">
          {[
            { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
            { id: 'hospitalMap', label: '2. Nearest Blood Banks & Map', icon: Navigation },
            { id: 'profile', label: '3. My Profile', icon: User },
            { id: 'availability', label: '4. My Availability', icon: isAvailable ? ToggleRight : ToggleLeft },
            { id: 'requests', label: '5. Nearby Blood Requests', icon: Droplets, badge: bloodRequests.length },
            { id: 'contacts', label: '6. Contact Requests', icon: MessageSquare, badge: pendingContacts.length },
            { id: 'appointments', label: '7. My Appointments', icon: Calendar, badge: upcomingAppointments.length },
            { id: 'history', label: '8. Donation History', icon: History },
            { id: 'campaigns', label: '9. Campaigns', icon: Flag },
            { id: 'notifications', label: '10. Notifications', icon: Bell },
            { id: 'settings', label: '11. Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-white text-[#7A0012] font-bold shadow-xs'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#7A0012] text-white' : 'bg-white text-[#7A0012]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>11. Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccess}</span>
            </div>
            <button onClick={() => setSaveSuccess(null)} className="text-emerald-900 font-bold">×</button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-neutral-900">Welcome, {user?.fullName}</h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Voluntary Blood Donor &middot; {donorProfile?.city}, {donorProfile?.district} &middot; Northern Province
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-neutral-600">Donation Availability:</span>
                <button
                  onClick={() => handleToggleAvailability(!isAvailable)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-600' : 'bg-neutral-500'}`} />
                  {isAvailable ? 'Available Now' : 'Paused / Unavailable'}
                </button>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Blood Group</span>
                <span className="text-2xl font-extrabold text-[#DC0A20] font-mono mt-1 block">
                  {donorProfile?.bloodGroup || 'O+'}
                </span>
                <span className="text-[11px] text-neutral-400">Recorded on registration</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Verification Badge</span>
                <span className={`text-base font-bold mt-1 block ${user?.isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {user?.isVerified ? 'Verified Donor' : 'Pending Review'}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {user?.isVerified ? 'Visible in public search' : 'Reviewing with hospital'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Pending Contact Inquiries</span>
                <span className="text-2xl font-extrabold text-neutral-900 font-mono mt-1 block">
                  {pendingContacts.length}
                </span>
                <span className="text-[11px] text-neutral-400">Awaiting your reply</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200">
                <span className="text-xs text-neutral-500 block">Verified Completed Donations</span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 block">
                  {donationHistory.length}
                </span>
                <span className="text-[11px] text-neutral-400">Hospital certified</span>
              </div>
            </div>

            {/* Ready to Donate & Map Navigation Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold mb-2 border border-emerald-500/30">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Geo Navigation Enabled</span>
                </div>
                <h3 className="text-base font-bold">Ready to Donate? Find Your Nearest Blood Bank</h3>
                <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                  Calculate real-time driving distance from your current location and launch turn-by-turn Google Maps directions directly to Teaching Hospital Jaffna, Tellippalai Cancer Hospital, or regional district facilities.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('hospitalMap')}
                className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm flex items-center gap-1.5 group cursor-pointer"
              >
                <span>Open Map & Directions</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Pending Contact Requests Widget */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-900">Incoming Contact Requests</h3>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="text-xs text-[#DC0A20] font-semibold hover:underline"
                >
                  View All ({contactRequests.length})
                </button>
              </div>

              {pendingContacts.length === 0 ? (
                <p className="text-xs text-neutral-500 py-4 text-center">No pending contact inquiries right now.</p>
              ) : (
                <div className="space-y-3">
                  {pendingContacts.map((cr) => (
                    <div key={cr.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-neutral-900 block">{cr.requesterName}</span>
                        <p className="text-neutral-600 mt-1 italic">"{cr.message}"</p>
                        <span className="text-[10px] text-neutral-400 mt-1 block font-mono">
                          Received: {new Date(cr.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRespondContact(cr.id, 'ACCEPTED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondContact(cr.id, 'DECLINED')}
                          className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: NEAREST BLOOD BANKS & HOSPITAL MAP */}
        {activeTab === 'hospitalMap' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <Navigation className="w-4 h-4" />
                <span>Sri Lanka Certified Healthcare Facilities</span>
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">Nearest Blood Banks & Navigation</h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl">
                Locate your nearest hospital transfusion center in Jaffna or island-wide. Click "Use My Location" to compute distance, inspect 24/7 blood bank contact lines, and launch GPS directions.
              </p>
            </div>

            <InteractiveMapNav
              initialMode="hospitals"
              initialDistrict={district || 'Jaffna'}
            />
          </div>
        )}

        {/* TAB 2: MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">My Donor Profile</h2>
              <p className="text-xs text-neutral-500 mt-1">Manage your regional location and notification preferences.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ''}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    disabled
                    value={donorProfile?.bloodGroup || 'O+'}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Last Whole Blood Donation</label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white"
                  >
                    {Object.keys(SRI_LANKA_DISTRICTS).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Street Address / Area (முழு முகவரி / பகுதி)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. No. 45, Temple Road, Nallur"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg"
                />
                <span className="text-[11px] text-neutral-400 mt-0.5 block">
                  Requesters will see this real address location when searching for donors.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Contact Preferences</label>
                <select
                  value={contactPrefs}
                  onChange={(e) => setContactPrefs(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="CALL_AND_SMS">Phone Call and SMS</option>
                  <option value="SMS_ONLY">SMS Only</option>
                  <option value="EMAIL_ONLY">Email Only</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: AVAILABILITY */}
        {activeTab === 'availability' && (
          <div className="max-w-xl bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Donation Availability Status</h2>
              <p className="text-xs text-neutral-500 mt-1">Control whether patients and requesters can find you in search.</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-neutral-900 block">
                  {isAvailable ? 'You are Available to Donate' : 'You are Temporarily Unavailable'}
                </span>
                <span className="text-xs text-neutral-500 mt-0.5 block">
                  {isAvailable
                    ? 'Eligible to receive direct contact requests from verified requesters.'
                    : 'Hidden from active donor search queries.'}
                </span>
              </div>

              <button
                onClick={() => handleToggleAvailability(!isAvailable)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isAvailable
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-300 text-neutral-700'
                }`}
              >
                {isAvailable ? 'Toggle Pause' : 'Toggle Available'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: NEARBY BLOOD REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Hospital Blood Requests</h2>
              <p className="text-xs text-neutral-500 mt-1">Active verified requests matching medical demand in Sri Lanka.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bloodRequests.map((req) => (
                <div key={req.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                        {req.urgency}
                      </span>
                      <span className="text-base font-extrabold text-[#DC0A20] font-mono">{req.bloodGroup}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900">{req.hospital}</h3>
                    <p className="text-xs text-neutral-500">{req.district} &middot; {req.unitsRequired} units needed</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <span className="text-[11px] text-neutral-400 block">Required by: {new Date(req.requiredDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT REQUESTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Patient Contact Inquiries</h2>
                <p className="text-xs text-neutral-500 mt-1">Direct inquiries sent by patients or their relatives.</p>
              </div>

              {contactRequests.some(c => c.status !== 'PENDING') && (
                <button
                  onClick={handleClearAllInactive}
                  className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Clear All Responded / Inactive</span>
                </button>
              )}
            </div>

            {contactRequests.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                No contact requests in your inbox.
              </div>
            ) : (
              <div className="space-y-4">
                {contactRequests.map((cr) => (
                  <div key={cr.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900">{cr.requesterName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cr.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                            cr.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cr.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-700 italic">"{cr.message}"</p>
                        <span className="text-[10px] text-neutral-400 font-mono block">
                          Received: {new Date(cr.createdAt).toLocaleString()}
                        </span>
                        {cr.responseNote && (
                          <div className="mt-2 p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-[11px] text-neutral-600">
                            <strong>Your note:</strong> {cr.responseNote}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-start">
                        {cr.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleRespondContact(cr.id, 'ACCEPTED')}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                if (activeContactId === cr.id) {
                                  setActiveContactId(null);
                                } else {
                                  setActiveContactId(cr.id);
                                  setResponseNote('Currently unable to donate due to medical eligibility / personal schedule');
                                }
                              }}
                              className="px-4 py-1.5 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 border border-neutral-200 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Decline...
                            </button>
                          </>
                        )}

                        {cr.status === 'ACCEPTED' && (
                          <button
                            onClick={() => handleRespondContact(cr.id, 'COMPLETED', 'Blood successfully donated at certified hospital transfusion center')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs flex items-center gap-1.5"
                            title="Confirm you completed blood donation for this patient"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Mark Blood Donated (ரத்தம் வழங்கப்பட்டது)</span>
                          </button>
                        )}

                        {cr.status !== 'PENDING' && (
                          <button
                            onClick={() => handleClearContact(cr.id)}
                            title="Clear / Delete this request from your inbox"
                            className="px-3 py-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear / Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inline Decline Note Input */}
                    {cr.status === 'PENDING' && activeContactId === cr.id && (
                      <div className="mt-3 p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-3 text-xs animate-fadeIn">
                        <div className="font-semibold text-red-900">
                          Decline Request & Notify Requester:
                        </div>
                        <p className="text-[11px] text-red-700">
                          Please provide a brief reason so the patient understands and can find another matching donor:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Recently donated blood (< 3 months)',
                            'Medical reasons / Currently unwell',
                            'Traveling outside district',
                            'Schedule conflict at work'
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setResponseNote(preset)}
                              className={`px-2.5 py-1 rounded-full text-[11px] border cursor-pointer ${
                                responseNote === preset
                                  ? 'bg-red-600 text-white border-red-600'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={responseNote}
                          onChange={(e) => setResponseNote(e.target.value)}
                          placeholder="Or type a custom reason..."
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-xs"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveContactId(null)}
                            className="px-3 py-1.5 border border-neutral-300 text-neutral-600 hover:bg-white rounded-lg text-xs font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRespondContact(cr.id, 'DECLINED', responseNote)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Confirm Decline & Notify
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Donation Appointments</h2>
              <p className="text-xs text-neutral-500 mt-1">Proposed hospital donation appointments.</p>
            </div>

            {appointments.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                No appointments scheduled currently.
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900">{apt.hospitalName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Scheduled: <strong className="font-mono">{new Date(apt.scheduledAt).toLocaleString()}</strong>
                      </p>
                      {apt.notes && <p className="text-xs text-neutral-500 italic">"{apt.notes}"</p>}
                    </div>

                    {apt.status === 'REQUESTED' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRespondAppointment(apt.id, 'ACCEPTED')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRespondAppointment(apt.id, 'DECLINED')}
                          className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: DONATION HISTORY (HOSPITAL CERTIFIED) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Verified Donation History</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Hospital-confirmed donations recorded by medical administrators.
              </p>
            </div>

            {donationHistory.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                No hospital-recorded donations yet. When an appointment is medically confirmed at the blood bank, your certificate will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {donationHistory.map((dh) => (
                  <div key={dh.id} className="p-5 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block">{dh.hospitalName}</span>
                      <span className="text-xs text-neutral-500 font-mono">Date: {new Date(dh.donationDate).toLocaleDateString()}</span>
                      <span className="text-[11px] text-emerald-700 block mt-1 font-semibold">
                        Certificate: {dh.certificateNumber || 'NBTS-VERIFIED'}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg">
                      {dh.unitsDonated} Pint Donated
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Upcoming Blood Drives</h2>
              <p className="text-xs text-neutral-500 mt-1">Community collection camps organized in Jaffna and nearby districts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#DC0A20] uppercase">{camp.district} District</span>
                  <h3 className="text-sm font-bold text-neutral-900">{camp.title}</h3>
                  <p className="text-xs text-neutral-600">{camp.location}</p>
                  <p className="text-xs text-neutral-500 font-mono">{new Date(camp.startDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Notifications</h2>
            <div className="p-4 bg-neutral-50 rounded-xl text-xs text-neutral-600">
              You will receive push notifications and emails when hospital requests in {donorProfile?.district} match your {donorProfile?.bloodGroup} blood group.
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-white p-6 rounded-2xl border border-neutral-200 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Account Security</h2>
            <p className="text-xs text-neutral-600">
              LifeLink account secured with bcrypt 10-round salted password hashing and secure HTTP-only cookies.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
