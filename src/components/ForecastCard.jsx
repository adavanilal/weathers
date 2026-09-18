import React from 'react';
import WeatherIcon from './WeatherIcon';
import { Calendar } from 'lucide-react';

export default function ForecastCard({
  forecastDays,
  setForecastDays,
  forecastList,
  activeForecastDayIndex,
  setActiveForecastDayIndex,
  formatTemp,
  triggerToast,
}) {
  return (
    <div className="lg:col-span-4 apple-glass-card rounded-[28px] p-5 shadow-xl flex flex-col justify-between relative overflow-hidden select-none">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-white/10 text-sky-300">
            <Calendar className="w-3.5 h-3.5" />
          </span>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Forecast
          </h2>
        </div>

        {/* Apple Segmented Pill */}
        <div className="bg-black/25 p-1 rounded-full border border-white/15 flex items-center text-[11px] backdrop-blur-md">
          <button
            onClick={() => setForecastDays(7)}
            className={`px-3 py-1 rounded-full transition-all font-semibold ${
              forecastDays === 7 ? 'bg-white/20 text-white shadow-sm border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setForecastDays(10)}
            className={`px-3 py-1 rounded-full transition-all font-semibold ${
              forecastDays === 10 ? 'bg-white/20 text-white shadow-sm border border-white/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Days
          </button>
        </div>
      </div>

      {/* Day-by-Day Forecast Rows */}
      <div className="flex flex-col gap-1.5 max-h-[230px] overflow-y-auto no-scrollbar relative z-10">
        {forecastList.slice(0, forecastDays).map((item, idx) => {
          const isSelected = activeForecastDayIndex === idx;
          return (
            <div
              key={item.date + idx}
              onClick={() => {
                setActiveForecastDayIndex(idx);
                triggerToast(`Showing detailed preview for ${item.date}`);
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sky-500/25 border border-sky-400/40 shadow-inner'
                  : 'hover:bg-white/[0.07] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-300 p-1 rounded-lg bg-white/5">
                  <WeatherIcon type={item.icon} size="w-4 h-4" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    {formatTemp(item.max)}° <span className="text-slate-400 font-normal">/ {formatTemp(item.min)}°</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {item.condition}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {item.date.split(',')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

