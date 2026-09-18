import React from 'react';
import WeatherIcon from './WeatherIcon';

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
    <div className="lg:col-span-4 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Forecast
        </h2>
        <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-[11px]">
          <button
            onClick={() => setForecastDays(7)}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              forecastDays === 7 ? 'bg-blue-600/40 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setForecastDays(10)}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              forecastDays === 10 ? 'bg-blue-600/40 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Days
          </button>
        </div>
      </div>

      {/* Day-by-Day Forecast Rows */}
      <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
        {forecastList.slice(0, forecastDays).map((item, idx) => {
          const isSelected = activeForecastDayIndex === idx;
          return (
            <div
              key={item.date + idx}
              onClick={() => {
                setActiveForecastDayIndex(idx);
                triggerToast(`Showing detailed preview for ${item.date}`);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-500/20 border border-blue-400/40 shadow-inner'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-300">
                  <WeatherIcon type={item.icon} size="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-white">
                  {formatTemp(item.max)}° / {formatTemp(item.min)}°
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-300">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
