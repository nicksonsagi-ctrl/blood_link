import React, { useState } from 'react';
import { generateQRCodeSVG } from '../utils/qrCode.ts';
import { 
  ShieldCheck, 
  Download, 
  RotateCw, 
  Share2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Heart,
  Droplet,
  PhoneCall
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DigitalDonorCardProps {
  donor: {
    id: string;
    userId: string;
    fullName: string;
    bloodGroup: string;
    district: string;
    province: string;
    city: string;
    lastDonationDate: string | null;
    isVerified: boolean;
    isAvailable: boolean;
    verifiedAt?: string | null;
    phone?: string;
  };
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({ donor }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate 90-day recovery status
  let isEligible = true;
  let daysRemaining = 0;
  let nextDateStr = '';

  if (donor.lastDonationDate) {
    const lastDate = new Date(donor.lastDonationDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 90) {
      isEligible = false;
      daysRemaining = 90 - diffDays;
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 90);
      nextDateStr = nextDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  const donorDisplayId = `LL-LK-${donor.bloodGroup.replace('+', 'P').replace('-', 'N')}-${(donor.id || donor.userId).slice(-4).toUpperCase()}`;
  const verificationUrl = `${window.location.origin}/verify-donor/${donor.userId || donor.id}`;
  const qrSvg = generateQRCodeSVG(verificationUrl, 130);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `LifeLink Digital Donor Pass - ${donor.fullName}`,
          text: `Verified Blood Donor Pass (${donor.bloodGroup}) - LifeLink Sri Lanka. Donor ID: ${donorDisplayId}`,
          url: verificationUrl
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* CARD FLIP WRAPPER */}
      <div className="relative perspective-1000">
        {!isFlipped ? (
          /* FRONT OF CARD */
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#121214] via-[#1a1a1f] to-[#0f0f12] text-white border border-neutral-700/60 p-6 sm:p-7 select-none">
            {/* Top Security & Branding Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-900/40">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-500">LifeLink</span>
                    <span className="text-[10px] text-neutral-400">· Sri Lanka NBTS</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    Digital Blood Donor Pass
                  </h3>
                </div>
              </div>

              {/* Verified Hologram Emblem */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Donor</span>
              </div>
            </div>

            {/* Main Details Body */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Column: Donor Info */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Donor Name (கொடையாளர் பெயர்)
                  </span>
                  <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                    {donor.fullName}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                      Donor ID
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-200">
                      {donorDisplayId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block">
                      Location
                    </span>
                    <span className="text-xs font-medium text-neutral-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {donor.district}, {donor.province.replace(' Province', '')}
                    </span>
                  </div>
                </div>

                {/* Clinical Donation Status */}
                <div className="pt-1">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block mb-1">
                    Clinical Donation Status (NBTS 90-Day Standard)
                  </span>
                  {isEligible ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Ready & Eligible to Donate</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>In Recovery · {daysRemaining} days left (Next: {nextDateStr})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Blood Group & QR Code */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
                {/* Blood Group Large Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex flex-col items-center justify-center shadow-lg shadow-red-950/60 mb-2">
                  <span className="text-xl font-black leading-none">{donor.bloodGroup}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">Type</span>
                </div>

                {/* Verifiable QR Code Container */}
                <div 
                  className="w-24 h-24 p-1.5 bg-white rounded-xl shadow-inner flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <span className="text-[10px] text-neutral-400 mt-1 font-mono tracking-tight text-center">
                  Scan to Verify
                </span>
              </div>
            </div>

            {/* Bottom Security Watermark & Date */}
            <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-1 text-neutral-500 font-mono text-[10px]">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                <span>LifeLink National Registry ID Verification</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                {donor.lastDonationDate ? `Last: ${donor.lastDonationDate}` : 'First-Time Donor'}
              </div>
            </div>
          </div>
        ) : (
          /* BACK OF CARD: Compatibility Guide & Hospital Hotlines */
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 text-white border border-neutral-700/60 p-6 sm:p-7 select-none">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                  Donor Guidelines & Emergency Transfusion
                </h4>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Back of Pass</span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-neutral-300">
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1.5">
                <h5 className="font-bold text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5 text-red-400">
                  <Droplet className="w-3.5 h-3.5" />
                  Your Blood Compatibility ({donor.bloodGroup})
                </h5>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {donor.bloodGroup === 'O-' ? 'Universal Red Cell Donor: You can donate red cells to ALL blood groups in emergency surgeries.' :
                   donor.bloodGroup === 'AB+' ? 'Universal Recipient: Can receive red blood cells from any group; universal plasma donor.' :
                   donor.bloodGroup.includes('+') ? `Can give red cells to ${donor.bloodGroup} and AB+ recipients.` :
                   `Can donate to Rh-negative compatible recipients.`}
                </p>
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-1">
                <h5 className="font-bold text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5 text-emerald-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  24/7 Sri Lanka Blood Bank Hotlines
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">National Hotline:</span>
                    <strong className="text-white">1923 (NBTS Toll-Free)</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Jaffna Blood Bank:</span>
                    <strong className="text-white">+94 21 222 2261</strong>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 leading-normal p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                ⚠️ Present this digital card or QR code at Teaching Hospital Jaffna, Colombo National Blood Center, or any certified camp to facilitate rapid pre-transfusion triage.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTION TOOLBAR UNDER CARD */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'Flip Card Info'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/verify-donor/${donor.userId || donor.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Verify Live</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-300 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
            <span>{copied ? 'Link Copied!' : 'Share Pass'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
