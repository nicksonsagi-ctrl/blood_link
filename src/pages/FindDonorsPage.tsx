import React, { useState, useEffect } from 'react';
import { Search, MapPin, Shield, Heart, Filter, UserCheck, Navigation, Bot, Sparkles } from 'lucide-react';
import { BLOOD_GROUPS, SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS } from '../data/sriLankaData.js';
import { DonorSearchResult } from '../types/index.js';
import { ContactDonorModal } from '../components/ContactDonorModal.js';
import { InteractiveMapNav } from '../components/InteractiveMapNav.js';
import { AiAssistantChat } from '../components/AiAssistantChat.js';
import { useAuth } from '../context/AuthContext.js';

interface FindDonorsPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const FindDonorsPage: React.FC<FindDonorsPageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [pageMode, setPageMode] = useState<'list' | 'map'>('list');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('Jaffna');
  const [city, setCity] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);
  const [showEmbeddedAi, setShowEmbeddedAi] = useState<boolean>(false);

  const [donors, setDonors] = useState<DonorSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDonor, setSelectedDonor] = useState<DonorSearchResult | null>(null);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...(bloodGroup ? { bloodGroup } : {}),
        ...(province ? { province } : {}),
        ...(district ? { district } : {}),
        ...(city ? { city } : {}),
        ...(availableOnly ? { availableOnly: 'true' } : {})
      });
      const res = await fetch(`/api/donors/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDonors(data.donors);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup, province, district, city, availableOnly]);

  const availableCities = district ? SRI_LANKA_DISTRICTS[district]?.cities || [] : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DC0A20] uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-[#DC0A20]" />
            <span>Sri Lanka Donor Registry</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <h1 className="text-3xl font-extrabold text-neutral-900">Find Voluntary Blood Donors</h1>
            
            {/* View Mode & AI Assistant Switcher */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-300 shadow-2xs text-xs font-semibold">
                <button
                  onClick={() => setPageMode('list')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    pageMode === 'list'
                      ? 'bg-[#DC0A20] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>📋 List View</span>
                </button>
                <button
                  onClick={() => setPageMode('map')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    pageMode === 'map'
                      ? 'bg-[#DC0A20] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>🗺️ Live Map Navigation</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setShowEmbeddedAi(prev => !prev);
                  setAiChatOpen(true);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer border ${
                  showEmbeddedAi
                    ? 'bg-neutral-900 text-white border-neutral-800'
                    : 'bg-white text-neutral-850 border-neutral-300 hover:border-[#DC0A20] hover:text-[#DC0A20]'
                }`}
                title="Toggle LifeLink 24/7 AI Assistant Companion"
              >
                <Bot className="w-4 h-4 text-[#DC0A20]" />
                <span>{showEmbeddedAi ? 'Hide AI Companion' : '🤖 AI Assistant Chat'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-1">
            Search verified donors across Jaffna and island-wide districts. In compliance with privacy standards, only consenting donors appear with masked identity until you send a verified request.
          </p>
        </div>

        {/* Embedded AI Assistant Panel */}
        {showEmbeddedAi && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2">
              <AiAssistantChat embedded={true} />
            </div>
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-850 to-neutral-900 text-white p-6 rounded-2xl border border-neutral-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DC0A20]/20 text-[#DC0A20] text-[11px] font-semibold rounded-lg mb-3 border border-[#DC0A20]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>24/7 Sri Lanka Blood Companion</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">LifeLink AI Assistant</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Ask questions about blood group compatibility, mandatory 90-day donation interval recovery, Jaffna Teaching Hospital emergency hotlines, or donor eligibility criteria in English, தமிழ் (Tamil), or Tanglish.
                </p>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="p-2.5 bg-neutral-800/80 rounded-xl border border-neutral-700/60">
                    <span className="font-semibold text-rose-400 block mb-0.5">📞 Emergency Blood Bank Hotline:</span>
                    <span>NBTS: <strong>1923</strong> &middot; Teaching Hospital Jaffna: <strong>021-222-2261</strong></span>
                  </div>
                  <div className="p-2.5 bg-neutral-800/80 rounded-xl border border-neutral-700/60">
                    <span className="font-semibold text-emerald-400 block mb-0.5">⏱️ 90-Day Recovery Rule:</span>
                    <span>Donors who recently donated are marked <strong>Already Donated</strong> to honor safe recovery intervals.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400">
                LifeLink AI assists voluntary donation coordination island-wide.
              </div>
            </div>
          </div>
        )}

        {pageMode === 'map' ? (
          <div className="mb-12">
            <InteractiveMapNav
              initialMode="donors"
              initialDistrict={district}
              onSelectDonor={(d) => {
                if (!user) onOpenAuth('login');
                else setSelectedDonor(d);
              }}
            />
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 font-medium"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 font-medium"
              >
                <option value="">All Provinces</option>
                {SRI_LANKA_PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 font-medium"
              >
                <option value="">All Districts</option>
                {Object.keys(SRI_LANKA_DISTRICTS).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">City / Town</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-neutral-50 font-medium"
              >
                <option value="">All Towns</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="availOnly"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-neutral-300 text-[#DC0A20] focus:ring-[#DC0A20]"
              />
              <label htmlFor="availOnly" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                Available to donate now
              </label>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            Querying verified donor registry...
          </div>
        ) : donors.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
            <UserCheck className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-neutral-800">No Verified Donors Found for Selected Filter</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Pending donors must first be approved by medical administration before they appear in public search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:border-[#DC0A20]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{donor.displayName}</h4>
                      <p className="text-xs text-neutral-600 mt-1 flex items-start gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#DC0A20] shrink-0 mt-0.5" />
                        <span>{donor.address || `${donor.city}, ${donor.district}`}</span>
                      </p>
                    </div>
                    <span className="text-lg font-extrabold text-[#DC0A20] bg-[#FFF0F2] px-3 py-1 rounded-xl border border-[#DC0A20]/20">
                      {donor.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Verification Status:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified Donor
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-600">Status:</span>
                      {donor.hasActiveCommitment || donor.isRecentlyDonated || donor.commitmentStatus === 'ALREADY_DONATED' || donor.commitmentStatus === 'COMMITTED_TO_PATIENT' ? (
                        <span className="text-indigo-900 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1">
                          <span>✅ Already Donated Blood</span>
                        </span>
                      ) : donor.isAvailable ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          Ready to Donate
                        </span>
                      ) : (
                        <span className="text-neutral-500">Unavailable</span>
                      )}
                    </div>
                    {(donor.lastDonationDate || donor.hasActiveCommitment || donor.isRecentlyDonated) && (
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>Donation Date:</span>
                        <span className="font-mono font-semibold text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {donor.lastDonationDate || new Date().toISOString().split('T')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  {donor.hasActiveCommitment || donor.isRecentlyDonated || donor.commitmentStatus === 'ALREADY_DONATED' || donor.commitmentStatus === 'COMMITTED_TO_PATIENT' ? (
                    <button
                      disabled
                      className="w-full py-2 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-semibold cursor-not-allowed opacity-90 shadow-2xs"
                      title="This donor has already accepted a request and donated blood for a patient."
                    >
                      Already Donated
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) onOpenAuth('login');
                        else setSelectedDonor(donor);
                      }}
                      className="w-full py-2 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      Request Contact
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </>
      )}
      </div>

      <ContactDonorModal
        donor={selectedDonor}
        isOpen={Boolean(selectedDonor)}
        onClose={() => setSelectedDonor(null)}
        onPromptAuth={() => onOpenAuth('login')}
      />

      {/* Floating AI Assistant Chat Dialog */}
      <AiAssistantChat
        isOpen={aiChatOpen && !showEmbeddedAi}
        onClose={() => setAiChatOpen(false)}
      />

      {/* Floating Trigger Button for AI Assistant */}
      {!showEmbeddedAi && !aiChatOpen && (
        <button
          onClick={() => setAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#DC0A20] via-rose-600 to-[#DC0A20] hover:from-[#B80020] hover:to-rose-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 text-xs font-bold cursor-pointer group hover:scale-105"
          title="Open LifeLink 24/7 AI Medical & Donor Assistant"
        >
          <Bot className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Ask AI Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>
      )}
    </div>
  );
};
