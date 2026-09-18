import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Waves,
  Droplets,
  Wind,
  Sun,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';

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

  const cond = (weather.condition || '').toLowerCase();
  const isRain = cond.includes('rain') || cond.includes('drizzle');
  const isThunder = cond.includes('thunder');
  const isClear = cond.includes('clear') || cond.includes('sun');

  return (
    <div className="lg:col-span-4 apple-glass-card rounded-[28px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group select-none">
      {/* Dynamic Specular Liquid Sheen and Radial Glow */}
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40 ${
          isThunder
            ? 'bg-purple-600/40'
            : isRain
            ? 'bg-cyan-500/40'
            : isClear
            ? 'bg-amber-400/35'
            : 'bg-blue-400/30'
        }`}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Header & Badges */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/10 text-sky-300 border border-white/15 shadow-sm">
              <MapPin className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight drop-shadow-sm flex items-center gap-2">
              <span>{weather.city}</span>
              {weather.country && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono font-bold border border-white/15">
                  {weather.country}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-0.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live API
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Updated {weather.timeString}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFavoriteCurrentCity}
            title={isCityFavorite(weather.city) ? 'Remove from Favorites' : 'Save to Favorites'}
            className={`p-2 rounded-xl border transition-all ${
              isCityFavorite(weather.city)
                ? 'bg-amber-400/20 border-amber-300/50 text-amber-300 shadow-md shadow-amber-500/20 scale-105'
                : 'bg-white/5 border-white/15 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRefreshClick}
            title="Refresh live data"
            disabled={isManualRefreshing}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-slate-300 hover:text-white transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isManualRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Apple Weather Display */}
      <div className="my-6 flex items-center justify-between gap-4 relative z-10">
        {/* Left Side: Giant Liquid Temperature */}
        <div className="flex flex-col">
          <div className="flex items-start">
            <span className="text-6xl sm:text-7xl font-extralight text-white tracking-tighter drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
              {formatTemp(weather.temp)}
            </span>
            <button
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              title="Toggle °C / °F"
              className="text-2xl font-light text-sky-300 ml-1.5 mt-1 hover:text-white transition cursor-pointer hover:scale-110 active:scale-95"
            >
              °{unit}
            </button>
          </div>

          {/* Condition Title & High/Low / Feels like */}
          <div className="mt-1 flex flex-col gap-0.5">
            <span className="text-base font-semibold text-white/95 tracking-wide capitalize flex items-center gap-1.5">
              <span>{weather.condition}</span>
            </span>
            <span className="text-xs text-slate-300/80 font-medium">
              Feels like {formatTemp(weather.feelsLike)}{tempSymbol}
            </span>
          </div>
        </div>

        {/* Right Side: Visual Liquid Glass Weather Art */}
        <div className="relative w-28 h-28 flex items-center justify-center select-none shrink-0">
          {/* Ambient Liquid Backlight Glow */}
          <div
            className={`absolute inset-2 rounded-full blur-xl transition-all duration-500 opacity-60 ${
              isThunder
                ? 'bg-purple-500'
                : isRain
                ? 'bg-sky-400'
                : isClear
                ? 'bg-amber-400'
                : 'bg-blue-400'
            }`}
          />

          {/* 3D-styled SVG Weather Elements with Liquid Specular Sheen */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
            {isClear ? (
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.85)] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 opacity-90 blur-[0.5px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full border border-amber-300/40 animate-ping [animation-duration:3s]" />
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Glowing celestial element peek */}
                <div className="absolute -top-2 -right-1 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 blur-[1px] shadow-[0_0_18px_rgba(251,191,36,0.7)]" />

                {/* Cloud SVGs with liquid glass gradient */}
                <svg width="92" height="58" viewBox="0 0 84 52" fill="none" className="drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)]">
                  <ellipse cx="28" cy="32" rx="24" ry="16" fill="url(#liquidCloud1)" />
                  <ellipse cx="50" cy="24" rx="22" ry="18" fill="url(#liquidCloud2)" />
                  <ellipse cx="64" cy="34" rx="18" ry="14" fill="url(#liquidCloud1)" />
                  <ellipse cx="44" cy="38" rx="32" ry="12" fill="url(#liquidCloud1)" />
                  <defs>
                    <linearGradient id="liquidCloud1" x1="10" y1="15" x2="60" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffffff" />
                      <stop offset="1" stopColor="#b4d4f8" />
                    </linearGradient>
                    <linearGradient id="liquidCloud2" x1="30" y1="5" x2="65" y2="35" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffffff" />
                      <stop offset="1" stopColor="#9fc6f5" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Animated Liquid Raindrops */}
                {(isRain || isThunder) && (
                  <div className="absolute -bottom-2 left-3 flex gap-2.5">
                    <div className="w-1 h-4 bg-sky-300/90 rounded-full animate-bounce [animation-delay:0ms] shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                    <div className="w-1 h-4 bg-sky-300/90 rounded-full animate-bounce [animation-delay:150ms] shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                    <div className="w-1 h-4 bg-sky-300/90 rounded-full animate-bounce [animation-delay:300ms] shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                    <div className="w-1 h-4 bg-sky-300/90 rounded-full animate-bounce [animation-delay:450ms] shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Apple-Style Frosted Liquid Metric Capsules */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/15 relative z-10">
        {/* AQI */}
        <div className="apple-glass-capsule p-2.5 rounded-2xl flex flex-col items-center justify-center text-center group/cap hover:border-sky-400/40 transition">
          <Waves className="w-4 h-4 text-sky-300 mb-1 group-hover/cap:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white tracking-tight">{weather.aqi} AQI</span>
          <span className="text-[9px] font-semibold text-emerald-300 mt-0.5 truncate max-w-full">
            {weather.aqiStatus || 'Good'}
          </span>
        </div>

        {/* Humidity */}
        <div className="apple-glass-capsule p-2.5 rounded-2xl flex flex-col items-center justify-center text-center group/cap hover:border-sky-400/40 transition">
          <Droplets className="w-4 h-4 text-cyan-300 mb-1 group-hover/cap:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white tracking-tight">{weather.humidity}%</span>
          <span className="text-[9px] font-medium text-slate-400 mt-0.5">Humidity</span>
        </div>

        {/* Wind Speed */}
        <div className="apple-glass-capsule p-2.5 rounded-2xl flex flex-col items-center justify-center text-center group/cap hover:border-sky-400/40 transition">
          <Wind className="w-4 h-4 text-indigo-300 mb-1 group-hover/cap:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white tracking-tight">{formatWind(weather.windSpeed)}</span>
          <span className="text-[9px] font-medium text-slate-400 mt-0.5">Wind</span>
        </div>

        {/* UV Index */}
        <div className="apple-glass-capsule p-2.5 rounded-2xl flex flex-col items-center justify-center text-center group/cap hover:border-sky-400/40 transition">
          <Sun className="w-4 h-4 text-amber-300 mb-1 group-hover/cap:scale-110 transition-transform" />
          <span className="text-xs font-bold text-white tracking-tight">{weather.uv} UV</span>
          <span className="text-[9px] font-medium text-slate-400 mt-0.5">
            {weather.uv > 7 ? 'Very High' : weather.uv > 4 ? 'Moderate' : 'Low'}
          </span>
        </div>
      </div>
    </div>
  );
}
