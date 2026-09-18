import React from 'react';
import WeatherIcon from './WeatherIcon';
import { POPULAR_CITIES, EXPANDED_CITIES } from '../constants/cities';

export default function PopularCitiesCard({
  citiesList,
  viewMoreCities,
  setViewMoreCities,
  activeCity,
  handleSelectCity,
  formatTemp,
  tempSymbol,
}) {
  const source = citiesList || EXPANDED_CITIES;
  const displayCities = viewMoreCities ? source : source.slice(0, 5);

  return (
    <div className="lg:col-span-3 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col justify-between backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Popular Cities
        </h2>
        {/* View more toggle button */}
        <button
          onClick={() => setViewMoreCities(!viewMoreCities)}
          className="text-[11px] text-sky-400 hover:text-sky-200 font-semibold transition"
        >
          {viewMoreCities ? 'Show less' : 'View more'}
        </button>
      </div>

      {/* City List */}
      <div className="flex flex-col gap-2 max-h-[190px] overflow-y-auto pr-1">
        {displayCities.map((city) => {
          const isActive = activeCity.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => handleSelectCity(city)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all text-left group ${
                isActive
                  ? 'bg-blue-600/30 border border-blue-400/40 shadow-inner'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-slate-300 group-hover:text-amber-300 transition">
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
