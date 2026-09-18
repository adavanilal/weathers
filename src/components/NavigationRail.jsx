import React from 'react';
import {
  LayoutGrid,
  Map as MapIcon,
  Compass,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react';

export default function NavigationRail({ activeNav, setActiveNav, onOpenLogout }) {
  return (
    <aside className="w-full md:w-[72px] lg:w-[76px] bg-[#0c1a2e]/60 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-between py-4 md:py-7 px-4 md:px-0 select-none">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Button */}
        <button
          onClick={() => setActiveNav('dashboard')}
          title="Aether Weather"
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6 text-[#10233f]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 3h12a1 1 0 0 1 1 1v2a6 6 0 0 1-4 5.659V12a6 6 0 0 1 4 5.659V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.341A6 6 0 0 1 9 12v-.341A6 6 0 0 1 5 6V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>

        {/* Nav Action Buttons */}
        <div className="flex md:flex-col items-center gap-3 md:gap-5 mt-1">
          <button
            onClick={() => setActiveNav('dashboard')}
            className={`p-2.5 rounded-xl transition-all ${
              activeNav === 'dashboard'
                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Dashboard Overview"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('map')}
            className={`p-2.5 rounded-xl transition-all ${
              activeNav === 'map'
                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Full Weather Map"
          >
            <MapIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('radar')}
            className={`p-2.5 rounded-xl transition-all ${
              activeNav === 'radar'
                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Doppler Rain Radar"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('locations')}
            className={`p-2.5 rounded-xl transition-all ${
              activeNav === 'locations'
                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Saved Locations"
          >
            <MapPin className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('settings')}
            className={`p-2.5 rounded-xl transition-all ${
              activeNav === 'settings'
                ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Preferences & Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Logout Button */}
      <button
        onClick={onOpenLogout}
        className="text-slate-400 hover:text-red-300 p-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
        title="Reset / Log Out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
}
