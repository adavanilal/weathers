import React from 'react';
import { Settings, Edit2, Sparkles } from 'lucide-react';

export default function SettingsView({
  unit,
  setUnit,
  windUnit,
  setWindUnit,
  timeFormat,
  setTimeFormat,
  mapLayer,
  setMapLayer,
  onResetDefaults,
  profileName = 'Amit Lal',
  profileAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=AetherSky',
  onOpenEditProfile,
}) {
  return (
    <div className="flex flex-col gap-5 flex-1 max-w-2xl">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" />
          Preferences & Profile
        </h2>
        <p className="text-xs text-slate-400">Customize your weather station identity, temperatures, wind, and time formats</p>
      </div>

      {/* Profile & Avatar Setting Card */}
      <div className="bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-sky-400/50 shadow-lg shadow-sky-500/20 bg-[#12233c] flex items-center justify-center">
              <img
                src={profileAvatar}
                alt={profileName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101e33]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{profileName}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/20 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Commander
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Active call sign & avatar</p>
          </div>
        </div>

        <button
          onClick={onOpenEditProfile}
          className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition flex items-center gap-2"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Change Name & Avatar</span>
        </button>
      </div>

      <div className="bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
        {/* Temperature Unit */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Temperature Unit</h4>
            <p className="text-xs text-slate-400">Choose between Celsius and Fahrenheit</p>
          </div>
          <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setUnit('C')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Wind Unit */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Wind Speed Unit</h4>
            <p className="text-xs text-slate-400">Kilometers per hour or Miles per hour</p>
          </div>
          <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setWindUnit('km/h')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                windUnit === 'km/h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              km/h
            </button>
            <button
              onClick={() => setWindUnit('mph')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                windUnit === 'mph' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              mph
            </button>
          </div>
        </div>

        {/* Time Format */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Time Display</h4>
            <p className="text-xs text-slate-400">12-hour AM/PM or 24-hour military clock</p>
          </div>
          <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
            <button
              onClick={() => setTimeFormat('12h')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                timeFormat === '12h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              12 Hour
            </button>
            <button
              onClick={() => setTimeFormat('24h')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                timeFormat === '24h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              24 Hour
            </button>
          </div>
        </div>

        {/* Default Map Layer */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Default Map Style</h4>
            <p className="text-xs text-slate-400">Choose preferred tile provider</p>
          </div>
          <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
            {['dark', 'streets', 'satellite'].map((m) => (
              <button
                key={m}
                onClick={() => setMapLayer(m)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition ${
                  mapLayer === m ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Defaults Button */}
      <button
        onClick={onResetDefaults}
        className="self-start px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
      >
        Reset All to Defaults
      </button>
    </div>
  );
}
