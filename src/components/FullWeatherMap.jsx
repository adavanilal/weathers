import React from 'react';
import {
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Crosshair,
} from 'lucide-react';

export default function FullWeatherMap({
  fullMapContainerRef,
  fullMapInstanceRef,
  weather,
  mapLayer,
  setMapLayer,
  formatTemp,
  tempSymbol,
}) {
  return (
    <div className="flex flex-col gap-4 flex-1 h-full min-h-[480px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-sky-400" />
            Interactive Weather Map
          </h2>
          <p className="text-xs text-slate-400">Pan, zoom, and select cities across the globe</p>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-2 bg-[#12233c] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setMapLayer('dark')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mapLayer === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setMapLayer('streets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mapLayer === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => setMapLayer('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Full Map Canvas */}
      <div className="w-full flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
        <div ref={fullMapContainerRef} className="w-full h-full min-h-[420px]" />

        {/* Floating Map Zoom Tools */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
          <button
            onClick={() => {
              if (fullMapInstanceRef.current) fullMapInstanceRef.current.zoomIn();
            }}
            title="Zoom In"
            className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (fullMapInstanceRef.current) fullMapInstanceRef.current.zoomOut();
            }}
            title="Zoom Out"
            className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (fullMapInstanceRef.current) {
                fullMapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
              }
            }}
            title="Center Active City"
            className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-sky-300 rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Legend at bottom */}
        <div className="absolute bottom-4 left-4 z-[400] bg-[#101e33]/90 border border-white/20 px-3.5 py-2 rounded-xl backdrop-blur-md text-xs text-white shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Active: {weather.city} ({formatTemp(weather.temp)}{tempSymbol})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Key Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
