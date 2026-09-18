import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Waves,
  Droplets,
  Wind,
  Sun,
} from 'lucide-react';

export default function CurrentWeatherCard({
  weather,
  isCityFavorite,
  toggleFavoriteCurrentCity,
  fetchCityWeather,
  loading,
  formatTemp,
  tempSymbol,
  setUnit,
  unit,
  formatWind,
}) {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    setIsManualRefreshing(true);
    try {
      if (fetchCityWeather) {
        await fetchCityWeather(weather.city);
      }
    } finally {
      setTimeout(() => {
        setIsManualRefreshing(false);
      }, 700);
    }
  };

  return (
    <div className="lg:col-span-4 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
      {/* Card Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-wide">
              Current Weather
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Live API
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium mt-0.5 block">
            {weather.city}, {weather.country} • Updated: {weather.timeString}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Add to Favorites Toggle */}
          <button
            onClick={toggleFavoriteCurrentCity}
            title={isCityFavorite(weather.city) ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-1.5 rounded-lg border transition ${
              isCityFavorite(weather.city)
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>

          {/* Refresh Weather Button */}
          <button
            onClick={handleRefreshClick}
            title="Refresh live data"
            disabled={isManualRefreshing}
            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Weather Display */}
      <div className="my-5 flex items-center justify-between gap-4">
        {/* Visual Illustration */}
        <div className="relative w-24 h-24 flex items-center justify-center select-none">
          <div className="absolute top-1 right-2 w-11 h-11 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full blur-[1px] shadow-[0_0_16px_rgba(251,191,36,0.8)]" />

          <div className="absolute top-4 left-1 z-10">
            <svg width="84" height="52" viewBox="0 0 84 52" fill="none">
              <ellipse cx="28" cy="32" rx="24" ry="16" fill="url(#heroCloud1)" />
              <ellipse cx="50" cy="24" rx="22" ry="18" fill="url(#heroCloud2)" />
              <ellipse cx="64" cy="34" rx="18" ry="14" fill="url(#heroCloud1)" />
              <ellipse cx="44" cy="38" rx="32" ry="12" fill="url(#heroCloud1)" />
              <defs>
                <linearGradient id="heroCloud1" x1="10" y1="15" x2="60" y2="45" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#d5e5fa" />
                </linearGradient>
                <linearGradient id="heroCloud2" x1="30" y1="5" x2="65" y2="35" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#c3dcfe" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute -bottom-1 left-4 flex gap-2.5 z-0">
            <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:300ms]" />
            <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:450ms]" />
          </div>
        </div>

        {/* Degree & Clickable Unit Toggle */}
        <div className="flex flex-col items-end">
          <div className="flex items-start">
            <span className="text-5xl font-extrabold text-white tracking-tighter">
              {formatTemp(weather.temp)}
            </span>
            <button
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              title="Click to toggle °C / °F"
              className="text-xl font-bold text-sky-300 ml-1 mt-1 hover:text-white transition cursor-pointer hover:underline"
            >
              {tempSymbol}
            </button>
          </div>
          <span className="text-sm font-medium text-slate-200 tracking-wide mt-1 capitalize">
            {weather.condition}
          </span>
          <span className="text-[11px] text-slate-400">
            Feels like {formatTemp(weather.feelsLike)}{tempSymbol}
          </span>
        </div>
      </div>

      {/* 4 Bottom Metrics */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-center">
        <div className="flex flex-col items-center">
          <Waves className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-white">{weather.aqi} AQI</span>
          {weather.aqiStatus && (
            <span className="text-[9px] text-emerald-300 font-medium">{weather.aqiStatus}</span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-white">{weather.humidity}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-white">{formatWind(weather.windSpeed)}</span>
        </div>
        <div className="flex flex-col items-center">
          <Sun className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-xs font-semibold text-white">{weather.uv} UV</span>
        </div>
      </div>
    </div>
  );
}
