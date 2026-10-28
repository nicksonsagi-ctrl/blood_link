import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import { WifiOff, PhoneCall, HeartHandshake } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 bg-neutral-900/95 text-white p-3.5 rounded-xl shadow-2xl border border-neutral-700/80 backdrop-blur-md animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">Offline Mode Active</h4>
          </div>
          <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
            Cached hospital hotlines, offline donor guide, and emergency blood numbers remain fully accessible.
          </p>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
            <a
              href="tel:1923"
              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
            >
              <PhoneCall className="w-3 h-3" />
              NBTS: 1923
            </a>
            <span>·</span>
            <a
              href="tel:1990"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <HeartHandshake className="w-3 h-3" />
              Ambulance: 1990
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
