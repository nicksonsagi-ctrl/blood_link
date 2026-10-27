import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Phone,
  Building2,
  Heart,
  Shield,
  Compass,
  Crosshair,
  ExternalLink,
  Layers,
  Filter,
  CheckCircle2,
  ArrowRight,
  Route,
  Clock,
  Sparkles
} from 'lucide-react';
import { SRI_LANKA_HOSPITALS, HospitalRecord, SRI_LANKA_DISTRICTS, BLOOD_GROUPS, calculateDistanceKm } from '../data/sriLankaData.js';
import { DonorSearchResult } from '../types/index.js';

interface InteractiveMapNavProps {
  initialMode?: 'all' | 'donors' | 'hospitals';
  initialDistrict?: string;
  onSelectDonor?: (donor: DonorSearchResult) => void;
  className?: string;
}

export const InteractiveMapNav: React.FC<InteractiveMapNavProps> = ({
  initialMode = 'all',
  initialDistrict = 'All',
  onSelectDonor,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // States
  const [viewMode, setViewMode] = useState<'all' | 'donors' | 'hospitals'>(initialMode);
  const [hospitalSectorFilter, setHospitalSectorFilter] = useState<'ALL' | 'GOVERNMENT' | 'PRIVATE'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);

  // Data
  const [donors, setDonors] = useState<DonorSearchResult[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState<boolean>(true);

  // Geolocation & Navigation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationName, setUserLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  // Selected Target for navigation
  const [selectedHospital, setSelectedHospital] = useState<HospitalRecord | null>(null);
  const [selectedDonorTarget, setSelectedDonorTarget] = useState<DonorSearchResult | null>(null);
  const [navigationTarget, setNavigationTarget] = useState<{
    name: string;
    type: 'hospital' | 'donor';
    lat: number;
    lng: number;
    phone?: string;
    details?: string;
  } | null>(null);

  // Load donors from API
  const fetchDonors = async () => {
    setIsLoadingDonors(true);
    try {
      const params = new URLSearchParams({
        ...(selectedBloodGroup ? { bloodGroup: selectedBloodGroup } : {}),
        ...(selectedDistrict !== 'All' ? { district: selectedDistrict } : {}),
        ...(availableOnly ? { availableOnly: 'true' } : {})
      });
      const res = await fetch(`/api/donors/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDonors(data.donors);
      }
    } catch (err) {
      console.error('Error loading donors for map:', err);
    } finally {
      setIsLoadingDonors(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [selectedBloodGroup, selectedDistrict, availableOnly]);

  // Set manual user location (from city button or map click)
  const handleSetManualLocation = (cityName: string, lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setUserLocationName(cityName);
    setLocationError(null);
    setLocationFeedback(`📍 Location set to ${cityName}! Distances re-calculated.`);
    setTimeout(() => setLocationFeedback(null), 4000);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.2 });
    }
  };

  // Request browser location
  const handleRequestUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Browser GPS blocked in preview iframe. Click any town below to set your location.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setUserLocationName('GPS Location');
        setIsLocating(false);
        setLocationFeedback('📍 GPS Location detected successfully!');
        setTimeout(() => setLocationFeedback(null), 4000);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationError('Browser blocked automatic GPS in preview iframe (Permission Denied). Select your town below or click anywhere on the map to set your location.');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around Northern Province / Sri Lanka
      const defaultCenter: [number, number] = [9.6615, 80.0255]; // Jaffna
      const defaultZoom = 11;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add high quality tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom top-right zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('LifeLink &bull; Sri Lanka Healthcare Map')
        .addTo(map);

      // Map Click: allow user to click anywhere on map to set their location pin!
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setUserLocation({ lat, lng });
        setUserLocationName('Pinned Location');
        setLocationError(null);
        setLocationFeedback(`📍 Location set at map coordinates (${lat.toFixed(3)}, ${lng.toFixed(3)})!`);
        setTimeout(() => setLocationFeedback(null), 4000);
      });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter Hospitals
  const filteredHospitals = SRI_LANKA_HOSPITALS.filter((hosp) => {
    if (selectedDistrict !== 'All' && hosp.district !== selectedDistrict) return false;
    const isPrivate = hosp.sector === 'PRIVATE' || hosp.type === 'Private Hospital';
    if (hospitalSectorFilter === 'GOVERNMENT' && isPrivate) return false;
    if (hospitalSectorFilter === 'PRIVATE' && !isPrivate) return false;
    return true;
  });

  const privateHospitalsCount = SRI_LANKA_HOSPITALS.filter(h => (selectedDistrict === 'All' || h.district === selectedDistrict) && (h.sector === 'PRIVATE' || h.type === 'Private Hospital')).length;
  const govtHospitalsCount = SRI_LANKA_HOSPITALS.filter(h => (selectedDistrict === 'All' || h.district === selectedDistrict) && !(h.sector === 'PRIVATE' || h.type === 'Private Hospital')).length;

  // Calculate distance for all items
  const originLat = userLocation?.lat ?? (selectedDistrict !== 'All' && SRI_LANKA_DISTRICTS[selectedDistrict] ? SRI_LANKA_DISTRICTS[selectedDistrict].lat : 9.6615);
  const originLng = userLocation?.lng ?? (selectedDistrict !== 'All' && SRI_LANKA_DISTRICTS[selectedDistrict] ? SRI_LANKA_DISTRICTS[selectedDistrict].lng : 80.0255);

  const hospitalsWithDistance = filteredHospitals.map(h => ({
    ...h,
    distanceKm: calculateDistanceKm(originLat, originLng, h.lat, h.lng)
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const donorsWithDistance = donors.map(d => ({
    ...d,
    distanceKm: d.lat && d.lng ? calculateDistanceKm(originLat, originLng, d.lat, d.lng) : 999
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  // Render Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. User Location Marker (if available)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
            <span class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div class="p-2 text-center text-xs">
          <strong class="text-blue-700 block font-bold">📍 Your Current Location</strong>
          <span class="text-neutral-500 text-[11px]">Distances are calculated in real-time from here</span>
        </div>
      `);
      markersLayer.addLayer(userMarker);
    }

    // 2. Hospital Markers (if viewMode === 'all' || 'hospitals')
    if (viewMode === 'all' || viewMode === 'hospitals') {
      filteredHospitals.forEach((hosp) => {
        const isPrivate = hosp.sector === 'PRIVATE' || hosp.type === 'Private Hospital';
        const dist = calculateDistanceKm(originLat, originLng, hosp.lat, hosp.lng);
        const hospIcon = L.divIcon({
          className: 'custom-hosp-marker',
          html: isPrivate ? `
            <div class="group relative flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
              <div class="w-8 h-8 rounded-xl bg-purple-700 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
              </div>
              <div class="bg-purple-900 text-purple-100 font-bold text-[8.5px] px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap hidden sm:block border border-purple-400/40">
                🏢 Private &bull; ${hosp.district}
              </div>
            </div>
          ` : `
            <div class="group relative flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
              <div class="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-emerald-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12m-6-6h12"/></svg>
              </div>
              <div class="bg-neutral-900/90 text-white font-medium text-[9px] px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap hidden sm:block">
                🏛️ ${hosp.district}
              </div>
            </div>
          `,
          iconSize: [32, 44],
          iconAnchor: [16, 22]
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon });
        
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 min-w-[230px] font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2 mb-2">
            <span class="text-[10px] uppercase font-bold tracking-wider ${isPrivate ? 'text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200'}">
              ${isPrivate ? '🏢 Private Hospital & Clinic' : '🏛️ Govt Blood Bank & Hospital'}
            </span>
            <span class="text-[10px] font-semibold text-neutral-500 font-mono">${dist} km away</span>
          </div>
          <h4 class="font-bold text-neutral-900 text-xs leading-snug">${hosp.name}</h4>
          ${hosp.address ? `<p class="text-[11px] text-neutral-600 mt-1">📍 ${hosp.address}</p>` : ''}
          <p class="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
            🗺️ ${hosp.district}, ${hosp.province}
          </p>
          <p class="text-[11px] text-neutral-700 font-mono mt-1 font-semibold">
            📞 ${hosp.phone}
          </p>
          <div class="mt-3 pt-2 border-t border-neutral-100 flex flex-col gap-1.5">
            <button id="btn-route-${hosp.id}" class="w-full py-1.5 px-2 ${isPrivate ? 'bg-purple-700 hover:bg-purple-800' : 'bg-[#DC0A20] hover:bg-[#B80020]'} text-white rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 cursor-pointer">
              🧭 Get Route Directions
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}" target="_blank" rel="noopener noreferrer" class="w-full py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[11px] font-semibold text-center transition-colors flex items-center justify-center gap-1">
              🗺️ Open in Google Maps
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Bind interactive button inside popup
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-route-${hosp.id}`);
          if (btn) {
            btn.onclick = () => {
              handleSelectNavigationTarget({
                name: hosp.name,
                type: 'hospital',
                lat: hosp.lat,
                lng: hosp.lng,
                phone: hosp.phone,
                details: isPrivate ? 'Private Hospital & Emergency Care' : `${hosp.type} &middot; Blood Bank Unit Active 24/7`
              });
              setSelectedHospital(hosp);
              marker.closePopup();
            };
          }
        });

        markersLayer.addLayer(marker);
      });
    }

    // 3. Donor Markers (if viewMode === 'all' || 'donors')
    if (viewMode === 'all' || viewMode === 'donors') {
      donors.forEach((donor) => {
        if (!donor.lat || !donor.lng) return;
        const dist = calculateDistanceKm(originLat, originLng, donor.lat, donor.lng);

        const donorIcon = L.divIcon({
          className: 'custom-donor-marker',
          html: `
            <div class="group relative flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform">
              <div class="w-8 h-8 rounded-full bg-[#DC0A20] border-2 border-white shadow-md flex items-center justify-center text-white font-extrabold text-[10px]">
                ${donor.bloodGroup}
              </div>
              <div class="bg-white/95 text-neutral-800 border border-neutral-200 font-semibold text-[9px] px-1.5 py-0.2 rounded shadow mt-0.5 whitespace-nowrap">
                ${donor.city || donor.district}
              </div>
            </div>
          `,
          iconSize: [32, 44],
          iconAnchor: [16, 22]
        });

        const marker = L.marker([donor.lat, donor.lng], { icon: donorIcon });

        const isAlreadyDonated = donor.hasActiveCommitment || donor.isRecentlyDonated || donor.commitmentStatus === 'ALREADY_DONATED' || donor.commitmentStatus === 'COMMITTED_TO_PATIENT';

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 min-w-[220px] font-sans';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2 mb-2">
            <span class="text-[10px] uppercase font-bold text-[#DC0A20] tracking-wider">🩸 Voluntary Donor</span>
            <span class="text-[10px] font-semibold text-neutral-500 font-mono">${dist} km away</span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-bold text-neutral-900 text-xs">${donor.displayName}</h4>
            <span class="px-2 py-0.5 bg-[#FFF0F2] text-[#DC0A20] font-extrabold text-xs rounded border border-[#DC0A20]/20">
              ${donor.bloodGroup}
            </span>
          </div>
          <p class="text-[11px] text-neutral-700 mt-1 flex items-start gap-1 font-medium">
            📍 ${donor.address || `${donor.city}, ${donor.district}`}
          </p>
          <div class="mt-2 text-[10px] ${isAlreadyDonated ? 'text-indigo-800' : donor.isAvailable ? 'text-emerald-700' : 'text-neutral-500'} font-medium flex items-center gap-1">
            <span>${isAlreadyDonated ? '✅ Already Donated Blood' : donor.isAvailable ? '🛡️ Verified Lifesaver &middot; Ready to Donate' : 'Unavailable'}</span>
          </div>
          ${donor.lastDonationDate ? `
            <div class="mt-1 text-[10px] text-neutral-600 flex items-center justify-between">
              <span>Donated Date:</span>
              <span class="font-mono font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">${donor.lastDonationDate}</span>
            </div>
          ` : ''}
          <div class="mt-3 pt-2 border-t border-neutral-100 flex flex-col gap-1.5">
            ${isAlreadyDonated ? `
              <button disabled class="w-full py-1.5 px-2 bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold text-center cursor-not-allowed opacity-90">
                Already Donated
              </button>
            ` : `
              <button id="btn-contact-${donor.id}" class="w-full py-1.5 px-2 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg text-xs font-semibold text-center transition-colors">
                Request Blood Contact
              </button>
            `}
            <button id="btn-route-donor-${donor.id}" class="w-full py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-[11px] font-semibold text-center transition-colors">
              🧭 View Distance & Directions
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btnContact = document.getElementById(`btn-contact-${donor.id}`);
          if (btnContact && onSelectDonor) {
            btnContact.onclick = () => {
              onSelectDonor(donor);
              marker.closePopup();
            };
          }

          const btnRoute = document.getElementById(`btn-route-donor-${donor.id}`);
          if (btnRoute) {
            btnRoute.onclick = () => {
              handleSelectNavigationTarget({
                name: `${donor.displayName} (${donor.bloodGroup})`,
                type: 'donor',
                lat: donor.lat!,
                lng: donor.lng!,
                details: `Location: ${donor.city}, ${donor.district}`
              });
              setSelectedDonorTarget(donor);
              marker.closePopup();
            };
          }
        });

        markersLayer.addLayer(marker);
      });
    }
  }, [viewMode, filteredHospitals, donors, userLocation, originLat, originLng]);

  // Handle Target Navigation Selection & Draw Route Trajectory
  const handleSelectNavigationTarget = (target: {
    name: string;
    type: 'hospital' | 'donor';
    lat: number;
    lng: number;
    phone?: string;
    details?: string;
  }) => {
    setNavigationTarget(target);

    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous route line if any
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Draw connecting navigation trajectory polyline
    const startPoint: [number, number] = [originLat, originLng];
    const endPoint: [number, number] = [target.lat, target.lng];

    const polyline = L.polyline([startPoint, endPoint], {
      color: target.type === 'hospital' ? '#10B981' : '#DC0A20',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.85
    }).addTo(map);

    routeLayerRef.current = polyline;

    // Fit map bounds to show both start and destination comfortably
    map.fitBounds(L.latLngBounds([startPoint, endPoint]), {
      padding: [60, 60],
      maxZoom: 14
    });
  };

  // Quick zoom to a district
  const handleQuickJumpDistrict = (districtName: string) => {
    setSelectedDistrict(districtName);
    const info = SRI_LANKA_DISTRICTS[districtName];
    if (info && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([info.lat, info.lng], 12, { duration: 1.2 });
    }
  };

  const navDistanceKm = navigationTarget
    ? calculateDistanceKm(originLat, originLng, navigationTarget.lat, navigationTarget.lng)
    : 0;
  const navEstimatedMinutes = Math.max(3, Math.round((navDistanceKm / 35) * 60)); // ~35km/h avg speed

  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm ${className}`}>
      {/* Top Navigation Control Bar */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-red-50/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC0A20] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#DC0A20]">
                Live Sri Lanka Healthcare Navigation
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 mt-0.5">
              Interactive Blood Donor & Hospital Map
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5">
              Requesters can locate nearby voluntary donors &bull; Donors can navigate to the nearest certified blood bank.
            </p>
          </div>

          {/* Quick Actions (Locate Me + Manual Town Picker + View Mode Filter) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRequestUserLocation}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                userLocation
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
              <span>{isLocating ? 'Locating...' : userLocation ? (userLocationName ? `📍 ${userLocationName}` : 'GPS Located') : 'Use GPS'}</span>
            </button>

            {/* Manual Location Quick Picker */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
              >
                <span>📍</span>
                <span>Set My City</span>
                <span className="text-[10px] text-neutral-400">&blacktriangledown;</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-30 hidden group-hover:block divide-y divide-neutral-100 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400">Northern Province</div>
                {[
                  { name: 'Jaffna Town', lat: 9.6615, lng: 80.0255 },
                  { name: 'Point Pedro', lat: 9.8242, lng: 80.2341 },
                  { name: 'Chavakachcheri', lat: 9.6582, lng: 80.1558 },
                  { name: 'Tellippalai', lat: 9.7712, lng: 80.0384 },
                  { name: 'Kilinochchi', lat: 9.3803, lng: 80.3770 },
                  { name: 'Vavuniya', lat: 8.7514, lng: 80.4971 }
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSetManualLocation(c.name, c.lat, c.lng)}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-800 transition-colors"
                  >
                    📍 {c.name}
                  </button>
                ))}
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400">Other Districts</div>
                {[
                  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
                  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
                  { name: 'Galle', lat: 6.0535, lng: 80.2210 },
                  { name: 'Batticaloa', lat: 7.7310, lng: 81.6747 }
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSetManualLocation(c.name, c.lat, c.lng)}
                    className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-800 transition-colors"
                  >
                    📍 {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-medium">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'all'
                    ? 'bg-white text-neutral-900 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Network
              </button>
              <button
                onClick={() => setViewMode('donors')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'donors'
                    ? 'bg-[#DC0A20] text-white font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>Donors ({donors.length})</span>
              </button>
              <button
                onClick={() => setViewMode('hospitals')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'hospitals'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Hospitals ({filteredHospitals.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Quick District Jumps */}
        <div className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* District Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => handleQuickJumpDistrict(e.target.value)}
                className="bg-transparent font-medium text-neutral-800 focus:outline-hidden"
              >
                <option value="All">All Districts (Island-wide)</option>
                <option value="Jaffna">Jaffna District</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Anuradhapura">Anuradhapura</option>
              </select>
            </div>

            {/* Hospital Sector Filter (Govt vs Private) */}
            {(viewMode === 'all' || viewMode === 'hospitals') && (
              <div className="flex items-center bg-white border border-neutral-300 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setHospitalSectorFilter('ALL')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    hospitalSectorFilter === 'ALL'
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Facilities
                </button>
                <button
                  type="button"
                  onClick={() => setHospitalSectorFilter('GOVERNMENT')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    hospitalSectorFilter === 'GOVERNMENT'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title="Government Teaching & Base Hospitals with Certified Blood Banks"
                >
                  <span>🏛️ Govt ({govtHospitalsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHospitalSectorFilter('PRIVATE')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    hospitalSectorFilter === 'PRIVATE'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                  title="Private Hospitals & Medical Centres in Sri Lanka"
                >
                  <span>🏢 Private ({privateHospitalsCount})</span>
                </button>
              </div>
            )}

            {/* Blood Group Filter (if viewMode !== 'hospitals') */}
            {viewMode !== 'hospitals' && (
              <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5">
                <span className="font-bold text-[#DC0A20]">🩸</span>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value)}
                  className="bg-transparent font-medium text-neutral-800 focus:outline-hidden"
                >
                  <option value="">Any Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability */}
            {viewMode !== 'hospitals' && (
              <label className="flex items-center gap-1.5 text-neutral-700 bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded border-neutral-300 text-[#DC0A20] focus:ring-[#DC0A20]"
                />
                <span className="font-medium">Ready now</span>
              </label>
            )}
          </div>

          {/* Quick jump pills */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-400">Jump:</span>
            {['Jaffna', 'Kilinochchi', 'Vavuniya', 'Colombo', 'Kandy', 'Batticaloa'].map((dist) => (
              <button
                key={dist}
                onClick={() => handleQuickJumpDistrict(dist)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedDistrict === dist
                    ? 'bg-[#DC0A20] text-white font-bold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {locationFeedback && (
          <div className="mt-3 text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center justify-between font-semibold">
            <span>{locationFeedback}</span>
            <span className="text-[10px] text-emerald-600 font-mono">Haversine metric active</span>
          </div>
        )}

        {locationError && (
          <div className="mt-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>⚠️</span> Browser GPS Restricted in Preview Iframe (Permission Denied)
              </span>
              <span className="text-[11px] text-amber-700 font-medium">Click any town or click the map to set your pin</span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
              Google AI Studio and web previews restrict automated GPS. Simply click on your city below or click directly anywhere on the map to set your location pin and compute real distances:
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {[
                { name: 'Jaffna Town', lat: 9.6615, lng: 80.0255 },
                { name: 'Point Pedro', lat: 9.8242, lng: 80.2341 },
                { name: 'Chavakachcheri', lat: 9.6582, lng: 80.1558 },
                { name: 'Kilinochchi', lat: 9.3803, lng: 80.3770 },
                { name: 'Vavuniya', lat: 8.7514, lng: 80.4971 },
                { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
                { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
                { name: 'Galle', lat: 6.0535, lng: 80.2210 },
                { name: 'Batticaloa', lat: 7.7310, lng: 81.6747 }
              ].map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSetManualLocation(loc.name, loc.lat, loc.lng)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-neutral-800 rounded-lg border border-amber-300 font-semibold text-[11px] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>📍</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map + Side Navigation Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative bg-neutral-100 min-h-[420px] lg:min-h-full">
          <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10" />

          {/* Navigation floating banner if target is selected */}
          {navigationTarget && (
            <div className="absolute top-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    navigationTarget.type === 'hospital' ? 'bg-emerald-600' : 'bg-[#DC0A20]'
                  }`}
                >
                  {navigationTarget.type === 'hospital' ? <Building2 className="w-5 h-5" /> : <Heart className="w-5 h-5 fill-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Destination Selected
                    </span>
                    <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200">
                      ~{navEstimatedMinutes} mins drive ({navDistanceKm} km)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-0.5">{navigationTarget.name}</h4>
                  {navigationTarget.details && (
                    <p className="text-[11px] text-neutral-500">{navigationTarget.details}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {navigationTarget.phone && (
                  <a
                    href={`tel:${navigationTarget.phone}`}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Call Facility</span>
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${navigationTarget.lat},${navigationTarget.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#DC0A20] hover:bg-[#B80020] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start GPS Navigation</span>
                </a>
                <button
                  onClick={() => {
                    setNavigationTarget(null);
                    if (routeLayerRef.current) {
                      routeLayerRef.current.remove();
                      routeLayerRef.current = null;
                    }
                  }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-xl px-3 py-2 text-[10px] font-semibold text-neutral-700 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#DC0A20] inline-block"></span>
              <span>Voluntary Donor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block"></span>
              <span>🏛️ Govt Blood Bank</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-700 inline-block"></span>
              <span>🏢 Private Hospital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white inline-block"></span>
              <span>You</span>
            </div>
          </div>
        </div>

        {/* Side Directory & Nearby Facility Navigator */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-200 bg-neutral-50/50 flex flex-col justify-between max-h-[640px]">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#DC0A20]" />
                Nearby Facilities & Donors
              </h4>
              <span className="text-[10px] text-neutral-500 font-mono">
                Sorted by distance
              </span>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-200/60 p-3 space-y-2">
            {/* Hospitals Section */}
            {(viewMode === 'all' || viewMode === 'hospitals') && (
              <div>
                <div className="text-[11px] font-bold text-neutral-700 px-1 py-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Healthcare Facilities ({hospitalsWithDistance.length})</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setHospitalSectorFilter('ALL')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        hospitalSectorFilter === 'ALL' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setHospitalSectorFilter('GOVERNMENT')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        hospitalSectorFilter === 'GOVERNMENT' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      Govt
                    </button>
                    <button
                      type="button"
                      onClick={() => setHospitalSectorFilter('PRIVATE')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        hospitalSectorFilter === 'PRIVATE' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 mt-1.5">
                  {hospitalsWithDistance.slice(0, 10).map((hosp) => {
                    const isPrivate = hosp.sector === 'PRIVATE' || hosp.type === 'Private Hospital';
                    return (
                      <div
                        key={hosp.id}
                        onClick={() => {
                          handleSelectNavigationTarget({
                            name: hosp.name,
                            type: 'hospital',
                            lat: hosp.lat,
                            lng: hosp.lng,
                            phone: hosp.phone,
                            details: isPrivate ? 'Private Hospital & Emergency Unit' : `${hosp.type} &middot; ${hosp.district}`
                          });
                          setSelectedHospital(hosp);
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([hosp.lat, hosp.lng], 14, { duration: 1.2 });
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          navigationTarget?.name === hosp.name
                            ? isPrivate
                              ? 'bg-purple-50/80 border-purple-400 shadow-xs ring-1 ring-purple-300'
                              : 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                            : isPrivate
                            ? 'bg-white border-neutral-200 hover:border-purple-300 hover:shadow-xs'
                            : 'bg-white border-neutral-200 hover:border-emerald-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-900 leading-snug">{hosp.name}</span>
                            <span className="mt-0.5">
                              {isPrivate ? (
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                  🏢 Private Hospital
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  🏛️ Govt Blood Bank
                                </span>
                              )}
                            </span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 font-mono ${
                            isPrivate ? 'text-purple-800 bg-purple-50 border-purple-200' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                          }`}>
                            {hosp.distanceKm} km
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          {hosp.district} &middot; {hosp.address || hosp.province}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-600 font-mono font-medium">{hosp.phone}</span>
                          <span className={`font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform ${
                            isPrivate ? 'text-purple-700' : 'text-[#DC0A20]'
                          }`}>
                            Directions <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Donors Section */}
            {(viewMode === 'all' || viewMode === 'donors') && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-neutral-600 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Voluntary Donors Nearby ({donorsWithDistance.length})</span>
                  <span className="text-[10px] text-[#DC0A20] font-semibold">Privacy-Verified</span>
                </div>
                {isLoadingDonors ? (
                  <div className="p-4 text-center text-xs text-neutral-500">Loading donor locations...</div>
                ) : donorsWithDistance.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500 bg-white rounded-xl border border-neutral-200">
                    No donors matching the current filter.
                  </div>
                ) : (
                  <div className="space-y-1.5 mt-1">
                    {donorsWithDistance.slice(0, 8).map((donor) => (
                      <div
                        key={donor.id}
                        onClick={() => {
                          if (donor.lat && donor.lng) {
                            handleSelectNavigationTarget({
                              name: `${donor.displayName} (${donor.bloodGroup})`,
                              type: 'donor',
                              lat: donor.lat,
                              lng: donor.lng,
                              details: `Donor in ${donor.city}, ${donor.district}`
                            });
                            setSelectedDonorTarget(donor);
                            if (mapInstanceRef.current) {
                              mapInstanceRef.current.flyTo([donor.lat, donor.lng], 14, { duration: 1.2 });
                            }
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          navigationTarget?.name.includes(donor.displayName)
                            ? 'bg-red-50 border-red-300 shadow-xs'
                            : 'bg-white border-neutral-200 hover:border-red-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-neutral-900 leading-snug">{donor.displayName}</span>
                            <p className="text-[11px] text-neutral-600 mt-0.5 leading-tight">
                              {donor.address || `${donor.city}, ${donor.district}`}
                            </p>
                            {donor.lastDonationDate && (
                              <p className="text-[10px] text-indigo-900 mt-1 font-mono font-medium">
                                Donated: {donor.lastDonationDate}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-extrabold text-[#DC0A20] bg-[#FFF0F2] px-2 py-0.5 rounded-md border border-[#DC0A20]/20">
                              {donor.bloodGroup}
                            </span>
                            {donor.distanceKm < 900 && (
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {donor.distanceKm} km
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                          {donor.hasActiveCommitment || donor.isRecentlyDonated || donor.commitmentStatus === 'ALREADY_DONATED' || donor.commitmentStatus === 'COMMITTED_TO_PATIENT' ? (
                            <span className="text-indigo-900 bg-indigo-100 border border-indigo-200 px-1.5 py-0.2 rounded font-semibold text-[9.5px]">
                              ✅ Already Donated
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium flex items-center gap-1 text-[10px]">
                              <Shield className="w-2.5 h-2.5" />
                              {donor.isAvailable ? 'Ready to Donate' : 'Unavailable'}
                            </span>
                          )}

                          {onSelectDonor && (
                            donor.hasActiveCommitment || donor.isRecentlyDonated || donor.commitmentStatus === 'ALREADY_DONATED' || donor.commitmentStatus === 'COMMITTED_TO_PATIENT' ? (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 border border-indigo-300 text-[9.5px] font-semibold rounded cursor-not-allowed">
                                Already Donated
                              </span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectDonor(donor);
                                }}
                                className="px-2 py-1 bg-[#DC0A20] hover:bg-[#B80020] text-white text-[10px] font-semibold rounded transition-colors"
                              >
                                Request Contact
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Footer Emergency Hotlines */}
          <div className="p-3 border-t border-neutral-200 bg-white text-xs">
            <div className="flex items-center justify-between text-[11px] text-neutral-600">
              <span>National Blood Center:</span>
              <a href="tel:1923" className="font-bold text-[#DC0A20] font-mono hover:underline">
                1923
              </a>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-600 mt-1">
              <span>Suwa Seriya Ambulance:</span>
              <a href="tel:1990" className="font-bold text-neutral-900 font-mono hover:underline">
                1990
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
