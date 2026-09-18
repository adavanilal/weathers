import React from 'react';
import {
  Compass,
  Play,
  Pause,
} from 'lucide-react';

export default function DopplerRadar({
  radarPlaying,
  setRadarPlaying,
  radarFrame,
  setRadarFrame,
  radarSpeed,
  setRadarSpeed,
  radarTimelineLabels,
}) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            Precipitation & Doppler Radar
          </h2>
          <p className="text-xs text-slate-400">Live storm cloud tracking and radar sweep simulation</p>
        </div>

        {/* Radar Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRadarPlaying(!radarPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              radarPlaying
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
            }`}
          >
            {radarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{radarPlaying ? 'Pause Radar' : 'Play Simulation'}</span>
          </button>

          <button
            onClick={() => setRadarSpeed(radarSpeed === 1 ? 2 : 1)}
            className="px-2.5 py-1.5 bg-[#12233c] hover:bg-[#1a345e] border border-white/10 rounded-xl text-xs font-bold text-sky-200 transition"
          >
            {radarSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Radar Display Visual */}
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-[#0b1728] flex items-center justify-center shadow-2xl">
        {/* Radar Circles */}
        <div className="absolute w-[300px] h-[300px] rounded-full border border-sky-500/20" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-sky-500/25" />
        <div className="absolute w-[100px] h-[100px] rounded-full border border-sky-500/30" />
        <div className="absolute w-full h-[1px] bg-sky-500/20" />
        <div className="absolute h-full w-[1px] bg-sky-500/20" />

        {/* Rotating Radar Sweep Needle */}
        <div className="absolute w-[320px] h-[320px] rounded-full animate-[spin_4s_linear_infinite] pointer-events-none">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/40 via-blue-500/10 to-transparent rounded-tl-full origin-bottom-right" />
        </div>

        {/* Simulated Storm Cells based on frame */}
        <div
          className="absolute w-32 h-32 rounded-full bg-emerald-500/30 blur-xl transition-all duration-700"
          style={{
            transform: `translate(${radarFrame * 20 - 40}px, ${radarFrame * 10 - 20}px)`,
          }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-amber-500/40 blur-lg transition-all duration-700"
          style={{
            transform: `translate(${radarFrame * 15 - 20}px, ${radarFrame * 8 - 10}px)`,
          }}
        />
        <div
          className="absolute w-10 h-10 rounded-full bg-red-500/50 blur-md transition-all duration-700"
          style={{
            transform: `translate(${radarFrame * 12 - 10}px, ${radarFrame * 6}px)`,
          }}
        />

        {/* Center Station Pin */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-400/30 animate-pulse" />
          <span className="text-xs font-bold text-white mt-1.5 drop-shadow">{weather.city}</span>
        </div>

        {/* Timestamp watermark */}
        <div className="absolute top-4 left-4 bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-sky-200">
          Frame: <b className="text-white">{radarTimelineLabels[radarFrame]}</b>
        </div>

        {/* Color Legend */}
        <div className="absolute bottom-4 right-4 bg-black/60 border border-white/10 p-2 rounded-xl text-[10px] flex flex-col gap-1 text-slate-200">
          <span className="font-bold text-slate-400">Precipitation Rate</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-emerald-400 rounded-sm" /> <span>Light (1-5 mm)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-amber-400 rounded-sm" /> <span>Moderate (5-15 mm)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-red-500 rounded-sm" /> <span>Severe (15+ mm)</span>
          </div>
        </div>
      </div>

      {/* Radar Timeline Slider */}
      <div className="bg-[#182c4b]/80 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-semibold">
          <span>Timeline Playback</span>
          <span className="text-sky-300">{radarTimelineLabels[radarFrame]}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {radarTimelineLabels.map((lbl, idx) => (
            <button
              key={lbl}
              onClick={() => setRadarFrame(idx)}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                radarFrame === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
