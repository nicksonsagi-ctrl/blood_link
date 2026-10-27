import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Search,
  Heart,
  Info,
  Activity,
  Layers,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { BLOOD_GROUPS, BloodGroup } from '../data/sriLankaData.js';

interface CompatibilityData {
  giveRBC: BloodGroup[];
  receiveRBC: BloodGroup[];
  givePlasma: BloodGroup[];
  receivePlasma: BloodGroup[];
  populationSriLanka: string;
  badge?: string;
  badgeColor?: string;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  clinicalNote: string;
  tamilNote: string;
}

export const EXTENDED_COMPATIBILITY: Record<BloodGroup, CompatibilityData> = {
  'O-': {
    giveRBC: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receiveRBC: ['O-'],
    givePlasma: ['O-'],
    receivePlasma: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    populationSriLanka: '~1.5% (Extremely Rare)',
    badge: 'Universal Red Cell Donor',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    urgencyLevel: 'CRITICAL',
    clinicalNote: 'Universal Red Blood Cell donor. Can be transfused to any patient in emergency trauma when blood typing is unavailable.',
    tamilNote: 'அனைத்து இரத்த வகையினருக்கும் அவசர விபத்துப் பிரிவுகளில் உடனடியாக ஏற்றக்கூடிய உலகளாவிய கொடையாளர்.'
  },
  'O+': {
    giveRBC: ['O+', 'A+', 'B+', 'AB+'],
    receiveRBC: ['O+', 'O-'],
    givePlasma: ['O+', 'O-'],
    receivePlasma: ['O+', 'A+', 'B+', 'AB+'],
    populationSriLanka: '~44% (Most Common)',
    badge: 'High Community Demand',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    urgencyLevel: 'HIGH',
    clinicalNote: 'Most transfused blood type across Sri Lankan surgical and pediatric wards.',
    tamilNote: 'இலங்கையில் மிக அதிக நோயாளிகளுக்குத் தேவைப்படும் முதன்மையான இரத்த வகை.'
  },
  'A-': {
    giveRBC: ['A-', 'A+', 'AB-', 'AB+'],
    receiveRBC: ['A-', 'O-'],
    givePlasma: ['A-', 'O-'],
    receivePlasma: ['A-', 'A+', 'AB-', 'AB+'],
    populationSriLanka: '~1.8% (Rare)',
    badge: 'Rare Rh-Negative Group',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    urgencyLevel: 'HIGH',
    clinicalNote: 'Crucial for Rh-negative surgeries and platelet transfusions.',
    tamilNote: 'அரிய Rh-Negative வகை; பிரசவம் மற்றும் அவசர சிகிச்சைகளுக்கு மிகவும் அத்தியாவசியமானது.'
  },
  'A+': {
    giveRBC: ['A+', 'AB+'],
    receiveRBC: ['A+', 'A-', 'O+', 'O-'],
    givePlasma: ['A+', 'A-'],
    receivePlasma: ['A+', 'AB+'],
    populationSriLanka: '~21% (Widely Needed)',
    badge: 'Platelet & RBC Asset',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    urgencyLevel: 'MODERATE',
    clinicalNote: 'High demand for cancer therapies and regular scheduled inpatient surgeries.',
    tamilNote: 'புற்றுநோய் சிகிச்சை மற்றும் திட்டமிடப்பட்ட சத்திரசிகிச்சைகளுக்கு பெரும் அளவில் தேவைப்படுகிறது.'
  },
  'B-': {
    giveRBC: ['B-', 'B+', 'AB-', 'AB+'],
    receiveRBC: ['B-', 'O-'],
    givePlasma: ['B-', 'O-'],
    receivePlasma: ['B-', 'B+', 'AB-', 'AB+'],
    populationSriLanka: '~1.7% (Rare)',
    badge: 'Rare Rh-Negative Group',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    urgencyLevel: 'HIGH',
    clinicalNote: 'Frequently requested for emergency obstetric and orthopedic surgeries in Northern hospitals.',
    tamilNote: 'வடக்கு மாகாண வைத்தியசாலைகளில் அவசர எலும்பு முறிவு மற்றும் மகப்பேறு பிரிவுகளில் அடிக்கடி தேவைப்படும் அரிய வகை.'
  },
  'B+': {
    giveRBC: ['B+', 'AB+'],
    receiveRBC: ['B+', 'B-', 'O+', 'O-'],
    givePlasma: ['B+', 'B-'],
    receivePlasma: ['B+', 'AB+'],
    populationSriLanka: '~28% (Second Most Common)',
    badge: 'Core Lifeline',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    urgencyLevel: 'HIGH',
    clinicalNote: 'Second most common group in Jaffna and island-wide. Constantly required for thalassemia patients.',
    tamilNote: 'யாழ்ப்பாணம் மற்றும் நாடெங்கிலும் தலசீமியா நோயாளிகளுக்கு தொடர்ந்து தேவைப்படும் முக்கிய இரத்த வகை.'
  },
  'AB-': {
    giveRBC: ['AB-', 'AB+'],
    receiveRBC: ['AB-', 'A-', 'B-', 'O-'],
    givePlasma: ['AB-', 'A-', 'B-', 'O-'],
    receivePlasma: ['AB-'],
    populationSriLanka: '~0.5% (Rarest in Sri Lanka)',
    badge: 'Universal Plasma Donor',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    urgencyLevel: 'CRITICAL',
    clinicalNote: 'Rarest blood group in Sri Lanka. AB plasma contains no antibodies and can be given to anyone.',
    tamilNote: 'இலங்கையிலேயே மிக அரிதான இரத்த வகை (0.5%). இதன் பிளாஸ்மாவை எவருக்கும் வழங்க முடியும்.'
  },
  'AB+': {
    giveRBC: ['AB+'],
    receiveRBC: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    givePlasma: ['AB+'],
    receivePlasma: ['AB+'],
    populationSriLanka: '~5.5%',
    badge: 'Universal Red Cell Recipient',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    urgencyLevel: 'MODERATE',
    clinicalNote: 'Universal Recipient for red blood cells; can receive blood from all 8 blood groups.',
    tamilNote: 'அனைத்து 8 இரத்த வகைகளிடமிருந்தும் இரத்தத்தைப் பெறக்கூடிய உலகளாவிய ஏற்பாளர் (Universal Recipient).'
  }
};

interface BloodCompatibilityVisualizerProps {
  onRequestBlood?: () => void;
}

export const BloodCompatibilityVisualizer: React.FC<BloodCompatibilityVisualizerProps> = ({
  onRequestBlood
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [transfusionType, setTransfusionType] = useState<'RBC' | 'PLASMA'>('RBC');
  const navigate = useNavigate();

  const data = EXTENDED_COMPATIBILITY[selectedGroup];

  const canGiveList = transfusionType === 'RBC' ? data.giveRBC : data.givePlasma;
  const canReceiveList = transfusionType === 'RBC' ? data.receiveRBC : data.receivePlasma;

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      {/* Visualizer Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-[#2A0509] text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Interactive Clinical Compatibility Matrix &middot; Sri Lanka NBTS Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Blood Compatibility Visualizer
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Select any blood group to see who you can save and who can save you. Understand ABO & Rh compatibility rules across Sri Lankan hospitals.
            </p>
          </div>

          {/* Mode Switch: RBC vs Plasma */}
          <div className="flex items-center bg-white/10 p-1.5 rounded-xl border border-white/10 self-start md:self-center shrink-0">
            <button
              onClick={() => setTransfusionType('RBC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                transfusionType === 'RBC'
                  ? 'bg-[#DC0A20] text-white shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Whole Blood & RBC</span>
            </button>
            <button
              onClick={() => setTransfusionType('PLASMA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                transfusionType === 'PLASMA'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Plasma & Platelets</span>
            </button>
          </div>
        </div>

        {/* Blood Group Selectors */}
        <div className="mt-8">
          <p className="text-xs font-medium text-neutral-400 mb-2.5 uppercase tracking-wider">
            Choose Blood Group to inspect (இரத்தக் குழுவைத் தேர்ந்தெடுக்கவும்):
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => {
              const isSelected = bg === selectedGroup;
              const isRare = bg.includes('-');
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`relative py-3.5 px-2 rounded-2xl font-extrabold text-base transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-neutral-950 border-white shadow-lg scale-105 ring-4 ring-[#DC0A20]/40'
                      : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="leading-none">{bg}</span>
                  {isRare && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                      Rh-
                    </span>
                  )}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC0A20] absolute bottom-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Compatibility Breakdown */}
      <div className="p-6 sm:p-8 space-y-8 bg-[#FAFAFA]">
        
        {/* Selected Group Summary Banner */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DC0A20] to-[#990014] text-white flex flex-col items-center justify-center font-black text-2xl shadow-md shrink-0">
              <span>{selectedGroup}</span>
              <span className="text-[10px] font-medium tracking-wider opacity-90">BLOOD</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-neutral-900">
                  Blood Group {selectedGroup} Profile
                </h3>
                {data.badge && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${data.badgeColor}`}>
                    {data.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                {data.clinicalNote}
              </p>
              <p className="text-xs text-[#DC0A20] font-medium mt-0.5">
                {data.tamilNote}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <div className="px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <span className="block text-[10px] font-semibold text-neutral-500 uppercase">Sri Lanka Frequency</span>
              <span className="text-sm font-bold text-neutral-900">{data.populationSriLanka}</span>
            </div>

            <button
              onClick={() => navigate(`/find-donors?bg=${encodeURIComponent(selectedGroup)}`)}
              className="px-4 py-2.5 bg-[#DC0A20] hover:bg-[#B80020] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Find {selectedGroup} Donors</span>
            </button>
          </div>
        </div>

        {/* 2-Way Flow Columns: GIVING vs RECEIVING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: CAN GIVE TO */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Can Give {transfusionType === 'RBC' ? 'Red Blood' : 'Plasma'} To
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    இவர்கள் உங்கள் இரத்தத்தைப் பெற்று பயன்பெறலாம்
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                {canGiveList.length} of 8 Groups
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {BLOOD_GROUPS.map((bg) => {
                const isMatch = canGiveList.includes(bg);
                return (
                  <div
                    key={'give-' + bg}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isMatch
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs ring-1 ring-emerald-400/30'
                        : 'bg-neutral-50/50 border-neutral-200 text-neutral-400 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base font-extrabold">{bg}</span>
                      {isMatch ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] font-semibold mt-1">
                      {isMatch ? 'Compatible' : 'Incompatible'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                Donating 1 unit of {selectedGroup} {transfusionType === 'RBC' ? 'blood' : 'plasma'} can directly sustain up to 3 surgical or trauma patients in critical care.
              </span>
            </div>
          </div>

          {/* Column 2: CAN RECEIVE FROM */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Can Receive {transfusionType === 'RBC' ? 'Red Blood' : 'Plasma'} From
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    இவர்களிடம் இருந்து நீங்கள் இரத்தம் பெற முடியும்
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
                {canReceiveList.length} of 8 Groups
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {BLOOD_GROUPS.map((bg) => {
                const isMatch = canReceiveList.includes(bg);
                return (
                  <div
                    key={'receive-' + bg}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isMatch
                        ? 'bg-blue-50/70 border-blue-300 text-blue-950 shadow-xs ring-1 ring-blue-400/30'
                        : 'bg-neutral-50/50 border-neutral-200 text-neutral-400 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base font-extrabold">{bg}</span>
                      {isMatch ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] font-semibold mt-1">
                      {isMatch ? 'Can Receive' : 'Incompatible'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <span>
                Sri Lankan hospitals always conduct laboratory cross-matching before transfusion to verify secondary Rh antigens (C, c, E, e, Kell).
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Note Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Emergency Cross-Match Protocol (NBTS Jaffna)
              </h5>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                In acute hemorrhagic shock, <strong>O-Negative</strong> whole blood is the universal uncrossmatched lifeline. Always register voluntary donors before emergency situations arise.
              </p>
            </div>
          </div>

          {onRequestBlood && (
            <button
              onClick={onRequestBlood}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Request Emergency Blood Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
