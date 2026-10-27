import React, { useState } from 'react';
import { InteractiveMapNav } from '../components/InteractiveMapNav.js';
import { ContactDonorModal } from '../components/ContactDonorModal.js';
import { DonorSearchResult } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import {
  MapPin,
  Navigation,
  Heart,
  Building2,
  ShieldCheck,
  PhoneCall,
  Clock,
  Compass,
  AlertTriangle
} from 'lucide-react';

interface MapNavigationPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const MapNavigationPage: React.FC<MapNavigationPageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<DonorSearchResult | null>(null);

  const handleSelectDonor = (donor: DonorSearchResult) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    setSelectedDonorForContact(donor);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F2] text-[#DC0A20] text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>
                {language === 'ta'
                  ? 'நேரடி வரைபடம் & வழிகாட்டி'
                  : language === 'si'
                  ? 'සජීවී සිතියම සහ මාර්ග'
                  : 'Sri Lanka Live Geo Navigation'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              {language === 'ta' ? (
                <>
                  கொடையாளர்களைக் காணவும், <span className="text-[#DC0A20]">அருகிலுள்ள இரத்த வங்கிக்குச் செல்லவும்</span>
                </>
              ) : language === 'si' ? (
                <>
                  ලේ පරිත්‍යාගශීලීන් සහ <span className="text-[#DC0A20]">ළඟම ඇති රෝහල් මාර්ග</span>
                </>
              ) : (
                <>
                  Locate Verified Donors & <span className="text-[#DC0A20]">Navigate to Nearby Blood Banks</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              {language === 'ta'
                ? 'அவசர தேவையின் போது உங்கள் மாவட்டத்திலுள்ள இரத்த கொடையாளர்களைக் கண்டறியுங்கள். கொடையாளர்கள் அருகிலுள்ள அரச வைத்தியசாலை மற்றும் இரத்த வங்கிகளுக்குச் செல்ல நேரடி வழிகாட்டலைப் பெறுங்கள்.'
                : language === 'si'
                ? 'හදිසි අවස්ථාවකදී ඔබේ දිස්ත්‍රික්කයේ සිටින රුධිර පරිත්‍යාගශීලීන් සොයා ගන්න. ළඟම ඇති රෝහල් රුධිර බැංකුව වෙත ළඟා වීමට නිවැරදි මාර්ග ලබා ගන්න.'
                : 'Connect with verified voluntary blood donors across Jaffna and island-wide districts. For active donors, get real-time distance calculations and GPS turn-by-turn navigation to certified healthcare facilities.'}
            </p>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px]">Govt & Private Facilities</span>
                <span className="text-lg font-bold text-neutral-900 font-mono">35+ Mapped</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Private Hospitals</span>
                <span className="text-lg font-bold text-purple-700">16+ Centers</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Emergency Hotline</span>
                <span className="text-lg font-bold text-neutral-900 font-mono">1923 (NBTS)</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Ambulance Direct</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">1990</span>
              </div>
            </div>
          </div>

          {/* Decorative Background Blob */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#FFF0F2] opacity-70 pointer-events-none blur-3xl" />
        </div>

        {/* Dual User Guide Cards (Requesters vs Donors) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F2] text-[#DC0A20] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-[#DC0A20]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                {language === 'ta' ? 'இரத்தம் தேவைப்படுபவர்களுக்கு (Requesters)' : 'For Requesters seeking Blood'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {language === 'ta'
                  ? 'வரைபடத்தில் இரத்த வகை அடிப்படையில் கொடையாளர்களைப் பார்க்கலாம். அவர்களின் இருப்பிடம் மற்றும் தகுதியை உறுதிசெய்து "Request Contact" பொத்தானை அழுத்தவும்.'
                  : 'Toggle to "Donors" on the map to filter verified volunteers by blood group and district. Tap any donor marker to initiate contact.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                {language === 'ta' ? 'இரத்தக் கொடையாளர்களுக்கு (Donors)' : 'For Voluntary Donors'}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {language === 'ta'
                  ? '"Use My Location" பொத்தானை அழுத்தி உங்களிடமிருந்து மிக அருகில் இருக்கும் வைத்தியசாலையைக் கண்டறியலாம். "Get Route Directions" மூலம் கூகுள் மேப்ஸ் வழியே செல்லலாம்.'
                  : 'Click "Use My Location" to automatically calculate distance in km to nearby hospitals. Select any blood bank to view contact numbers and start Google Maps navigation.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Interactive Map Component */}
        <InteractiveMapNav
          initialMode="all"
          initialDistrict="Jaffna"
          onSelectDonor={handleSelectDonor}
        />

        {/* Contact Donor Modal */}
        <ContactDonorModal
          donor={selectedDonorForContact}
          isOpen={Boolean(selectedDonorForContact)}
          onClose={() => setSelectedDonorForContact(null)}
          onPromptAuth={() => onOpenAuth('login')}
        />
      </div>
    </div>
  );
};
