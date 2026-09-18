import React from 'react';
import WeatherIcon from './WeatherIcon';
import { Globe } from 'lucide-react';

export default function PopularCitiesCard({
  citiesList,
  viewMoreCities,
  setViewMoreCities,
  activeCity,
  handleSelectCity,
  formatTemp,
  tempSymbol,
}) {
  const source = citiesList || [];
  const displayCities = viewMoreCities ? source : source.slice(0, 5);

  return (
    <div className="lg:col-span-3 apple-glass-card rounded-[28px] p-5 shadow-xl flex flex-col justify-between relative overflow-hidden select-none">
      {/* Specular Liquid Border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-white/10 text-sky-300">
            <Globe className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Global Hubs
          </h2>
        </div>
        {/* View more toggle button */}
        <button
          onClick={() => setViewMoreCities(!viewMoreCities)}
          className="text-[11px] text-sky-400 hover:text-sky-200 font-semibold transition px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
        >
          {viewMoreCities ? 'Less' : 'More'}
        </button>
      </div>

      {/* City List */}
      <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto no-scrollbar relative z-10">
        {displayCities.map((city) => {
          const isActive = activeCity.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => handleSelectCity(city)}
              className={`flex items-center justify-between p-2.5 rounded-2xl transition-all text-left group ${
                isActive
                  ? 'bg-sky-500/25 border border-sky-400/45 shadow-inner'
                  : 'hover:bg-white/[0.07] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-300 group-hover:text-amber-300 transition p-1 rounded-lg bg-white/5">
                  <WeatherIcon type={city.icon} size="w-4 h-4" />
                </span>
                <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {city.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {formatTemp(city.temp)}{tempSymbol}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {city.condition}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
