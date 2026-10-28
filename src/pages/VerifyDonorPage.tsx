import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Droplet, 
  MapPin, 
  Calendar, 
  Building2, 
  Award,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import type { DonorVerificationResult } from '../types/index.ts';

export const VerifyDonorPage: React.FC = () => {
  const { donorId } = useParams<{ donorId: string }>();
  const [searchId, setSearchId] = useState(donorId || 'usr-donor-01');
  const [verification, setVerification] = useState<DonorVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerification = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/donors/verify/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (data.success && data.verification) {
        setVerification(data.verification);
      } else {
        setVerification(null);
        setError(data.message || 'No registered donor found matching this verification code.');
      }
    } catch {
      setError('Unable to reach verification service. Check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (donorId) {
      setSearchId(donorId);
      fetchVerification(donorId);
    } else {
      fetchVerification('usr-donor-01');
    }
  }, [donorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVerification(searchId);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/find-donors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Find Donors</span>
          </Link>
          <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
            LifeLink Sri Lanka Public Verification Portal
          </span>
        </div>

        {/* Search Bar for manual lookup */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-neutral-200 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Donor ID, Pass Hash, or User ID (e.g. usr-donor-01, dp-donor-01)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify ID'}
            </button>
          </form>
        </div>

        {/* Verification Certificate Card */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900">Verification Unsuccessful</h3>
            <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {verification && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-200">
            {/* Top Certificate Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-emerald-100 text-[11px] font-bold tracking-widest uppercase">
                    Official LifeLink Registry Seal
                  </div>
                  <h1 className="text-lg font-extrabold text-white">
                    Verified Sri Lanka Blood Donor
                  </h1>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-3.5 py-1.5 text-right">
                <span className="text-[10px] text-emerald-100 block uppercase font-mono">Registry ID</span>
                <span className="font-mono text-xs font-bold text-white">{verification.digitalCardHash}</span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Donor Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                    Full Legal Name
                  </span>
                  <p className="text-base font-bold text-neutral-900 mt-0.5">
                    {verification.fullName}
                  </p>
                  <span className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {verification.city}, {verification.district} ({verification.province.replace(' Province', '')})
                  </span>
                </div>

                <div className="sm:border-l sm:border-neutral-200 sm:pl-4">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                    Verified Blood Group
                  </span>
                  <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-red-600 text-white rounded-xl shadow-xs">
                    <Droplet className="w-4 h-4 fill-white" />
                    <span className="text-lg font-black tracking-tight">{verification.bloodGroup}</span>
                  </div>
                </div>

                <div className="sm:border-l sm:border-neutral-200 sm:pl-4">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                    Clinical NBTS Status
                  </span>
                  <div className="mt-1">
                    {verification.clinicalStatus === 'ELIGIBLE_NOW' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Eligible to Donate Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        In Recovery ({verification.daysUntilEligible} days left)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Clinical Standard Verification Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Medical & Clinical Eligibility Records
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Last Whole Blood Donation:</span>
                      <strong className="text-neutral-900">
                        {verification.lastDonationDate || 'First-time registered donor'}
                      </strong>
                    </div>
                    <Calendar className="w-5 h-5 text-neutral-400" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Next Eligible Donation Date:</span>
                      <strong className="text-neutral-900">
                        {verification.nextEligibleDate
                          ? new Date(verification.nextEligibleDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Immediately Eligible'}
                      </strong>
                    </div>
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Verified Registry Record:</span>
                      <strong className="text-neutral-900">Teaching Hospital Jaffna / NBTS</strong>
                    </div>
                    <Building2 className="w-5 h-5 text-neutral-400" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">National Blood Hotline:</span>
                      <strong className="text-red-600 font-bold">1923 (Toll-Free 24/7)</strong>
                    </div>
                    <PhoneCall className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Medical Notice */}
              <div className="p-4 rounded-xl bg-neutral-100/80 border border-neutral-200 text-neutral-600 text-[11px] leading-relaxed">
                ℹ️ <strong>Hospital Authority Guidance:</strong> This digital verification confirms that the individual is a verified voluntary donor in the LifeLink Sri Lanka registry. Standard pre-transfusion rapid hemoglobin screening, temperature check, and blood pressure screening must be conducted by hospital medical staff prior to phlebotomy.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
