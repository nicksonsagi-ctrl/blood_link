import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  Search, 
  Filter, 
  RefreshCw, 
  MapPin, 
  ArrowRight,
  ShieldAlert,
  Heart,
  Activity,
  Calendar
} from 'lucide-react';
import type { HospitalBloodStock } from '../types/index.ts';

const BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const PROVINCES = [
  'All Provinces',
  'Northern Province',
  'Western Province',
  'Central Province',
  'Southern Province',
  'Eastern Province'
];

export const HospitalBloodStockPage: React.FC<{ onOpenAuth?: (tab: 'login' | 'register') => void }> = () => {
  const [stocks, setStocks] = useState<HospitalBloodStock[]>([]);
  const [summary, setSummary] = useState({
    totalUnits: 0,
    criticalAlerts: 0,
    hospitalsMonitored: 0,
    lastSync: ''
  });
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'SUFFICIENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchBloodStock = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blood-stock');
      const data = await res.json();
      if (data.success) {
        setStocks(data.stocks || []);
        if (data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load blood stock:', err);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchBloodStock();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchBloodStock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter stocks
  const filteredStocks = stocks.filter((stock) => {
    if (selectedProvince !== 'All Provinces' && stock.province !== selectedProvince) {
      return false;
    }
    if (statusFilter !== 'ALL' && stock.overallStatus !== statusFilter) {
      return false;
    }
    if (selectedBloodGroup !== 'All') {
      const groupData = stock.inventory[selectedBloodGroup];
      if (!groupData) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = stock.hospitalName.toLowerCase().includes(q);
      const matchDistrict = stock.district.toLowerCase().includes(q);
      return matchName || matchDistrict;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-600">
                Live Transfusion Network Sri Lanka
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Hospital Blood Bank Stock Tracker
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              நேரடி ரத்த இருப்பு நிலை போர்டு — Real-time inventory tracking for Teaching Hospital Jaffna, Colombo National Blood Center, Kandy, Galle, and regional blood banks across Sri Lanka.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchBloodStock}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-2xs transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-red-600' : 'text-neutral-500'}`} />
              <span>Refresh Stock</span>
            </button>

            <Link
              to="/request-blood"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>Request Blood</span>
            </Link>
          </div>
        </div>

        {/* TOP SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Units in Stock</span>
              <Activity className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-black text-neutral-900">{summary.totalUnits.toLocaleString()}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Whole blood & packed red cells</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-xs">
            <div className="flex items-center justify-between text-red-600 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Critical Low Alerts
              </span>
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-red-600">{summary.criticalAlerts}</div>
            <span className="text-[11px] text-red-600/80 mt-1 block">&lt; 8 units left (urgent donor response)</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Hospitals Monitored</span>
              <Building2 className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-black text-neutral-900">{summary.hospitalsMonitored}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Certified blood banks across 9 provinces</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Emergency Hotline</span>
              <PhoneCall className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-neutral-900">1923</div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">NBTS Sri Lanka 24/7 Toll-Free</span>
          </div>
        </div>

        {/* INTERACTIVE FILTER CONTROLS */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital or district (e.g. Jaffna, Chavakachcheri, Colombo)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            {/* Province Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-neutral-700 cursor-pointer"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Blood Group Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-500 mr-2">Highlight Blood Type:</span>
            <button
              onClick={() => setSelectedBloodGroup('All')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedBloodGroup === 'All'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Types
            </button>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  selectedBloodGroup === group
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* HOSPITAL INVENTORY CARDS GRID */}
        {filteredStocks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200">
            <Building2 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">No Hospitals Match Filter</h3>
            <p className="text-xs text-neutral-500 mt-1">Try selecting a different province or resetting filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStocks.map((hospital) => {
              const isUrgent = hospital.overallStatus === 'CRITICAL';
              return (
                <div
                  key={hospital.hospitalId}
                  className={`rounded-3xl bg-white border p-6 shadow-xs transition hover:shadow-md ${
                    isUrgent ? 'border-red-300 ring-1 ring-red-100' : 'border-neutral-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                          {hospital.type}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {hospital.district}, {hospital.province.replace(' Province', '')}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-neutral-900 mt-0.5">
                        {hospital.hospitalName}
                      </h3>
                      {hospital.address && (
                        <p className="text-[11px] text-neutral-500 mt-0.5">{hospital.address}</p>
                      )}
                    </div>

                    {/* Overall Status Badge */}
                    <div className="shrink-0">
                      {hospital.overallStatus === 'CRITICAL' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                          Critical Shortage
                        </span>
                      ) : hospital.overallStatus === 'MODERATE' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                          Sufficient Reserve
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 8 Blood Groups Inventory Grid */}
                  <div className="mt-5 grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {BLOOD_GROUPS.map((group) => {
                      const item = hospital.inventory[group] || { units: 0, status: 'CRITICAL' };
                      const isHighlighted = selectedBloodGroup === group;
                      const isCritical = item.status === 'CRITICAL';
                      const isLow = item.status === 'LOW';

                      let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                      let barColor = 'bg-emerald-500';

                      if (isCritical) {
                        badgeColor = 'bg-red-50 text-red-800 border-red-300';
                        barColor = 'bg-red-600';
                      } else if (isLow) {
                        badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                        barColor = 'bg-amber-500';
                      }

                      return (
                        <div
                          key={group}
                          className={`p-2 rounded-xl border text-center transition flex flex-col justify-between ${badgeColor} ${
                            isHighlighted ? 'ring-2 ring-neutral-900 shadow-xs' : ''
                          }`}
                        >
                          <div>
                            <span className="text-xs font-black block leading-none">{group}</span>
                            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                              {item.units} <span className="text-[9px]">units</span>
                            </span>
                          </div>

                          {/* Mini visual level bar */}
                          <div className="w-full h-1.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                            <div
                              className={`h-full ${barColor}`}
                              style={{ width: `${Math.min(100, (item.units / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Critical Warning if any */}
                  {hospital.criticalGroups.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-800">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        Urgent Need: {hospital.criticalGroups.join(', ')} blood donors required immediately.
                      </span>
                      <Link
                        to="/find-donors"
                        className="font-bold underline text-red-900 shrink-0 ml-2"
                      >
                        Find Donors &rarr;
                      </Link>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <a
                      href={`tel:${hospital.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 font-semibold"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{hospital.phone}</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/find-donors"
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-xl transition"
                      >
                        Donate to Hospital
                      </Link>
                      <Link
                        to="/request-blood"
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-2xs"
                      >
                        Request for Patient
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
