import React from 'react';
import {
  LayoutGrid,
  Map as MapIcon,
  Compass,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react';

export default function NavigationRail({
  activeNav,
  setActiveNav,
  onOpenLogout,
  profileAvatar,
  profileName,
  onOpenEditProfile,
}) {
  return (
    <aside className="w-full md:w-[76px] lg:w-[80px] bg-white/[0.03] backdrop-blur-3xl border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col items-center justify-between py-4 md:py-7 px-4 md:px-0 select-none">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Button */}
        <button
          onClick={() => setActiveNav('dashboard')}
          title="Aether Weather"
          className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white via-sky-100 to-blue-200 flex items-center justify-center shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all border border-white/40"
        >
          <svg className="w-6 h-6 text-[#0c1a2e]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 3h12a1 1 0 0 1 1 1v2a6 6 0 0 1-4 5.659V12a6 6 0 0 1 4 5.659V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.341A6 6 0 0 1 9 12v-.341A6 6 0 0 1 5 6V4a1 1 0 0 1 1-1z" />
          </svg>
        </button>

        {/* Nav Action Buttons */}
        <div className="flex md:flex-col items-center gap-3 md:gap-5 mt-1">
          <button
            onClick={() => setActiveNav('dashboard')}
            className={`p-2.5 rounded-2xl transition-all ${
              activeNav === 'dashboard'
                ? 'bg-white/20 text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Dashboard Overview"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('map')}
            className={`p-2.5 rounded-2xl transition-all ${
              activeNav === 'map'
                ? 'bg-white/20 text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Full Weather Map"
          >
            <MapIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('radar')}
            className={`p-2.5 rounded-2xl transition-all ${
              activeNav === 'radar'
                ? 'bg-white/20 text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Doppler Rain Radar"
          >
            <Compass className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('locations')}
            className={`p-2.5 rounded-2xl transition-all ${
              activeNav === 'locations'
                ? 'bg-white/20 text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Saved Locations"
          >
            <MapPin className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveNav('settings')}
            className={`p-2.5 rounded-2xl transition-all ${
              activeNav === 'settings'
                ? 'bg-white/20 text-white border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.25)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Preferences & Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Profile Avatar & Logout Button */}
      <div className="flex md:flex-col items-center gap-2.5">
        {profileAvatar && (
          <button
            onClick={onOpenEditProfile}
            title={`${profileName || 'User'} - Edit Profile`}
            className="w-8 h-8 rounded-xl overflow-hidden border border-white/20 hover:border-sky-400 hover:ring-2 hover:ring-sky-400/30 transition p-0.5 bg-[#162744] flex items-center justify-center"
          >
            <img
              src={profileAvatar}
              alt={profileName || 'Avatar'}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        )}
        <button
          onClick={onOpenLogout}
          className="text-slate-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/10 transition-colors"
          title="Reset / Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
