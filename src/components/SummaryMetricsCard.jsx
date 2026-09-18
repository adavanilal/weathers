import React from 'react';
import WeatherIcon from './WeatherIcon';
import {
  Sunrise,
  Eye,
  Sliders,
  Droplets,
  Wind,
  Sun,
} from 'lucide-react';

export default function SummaryMetricsCard({
  activeTab,
  setActiveTab,
  forecastList,
  activeForecastDayIndex,
  hourlyData,
  weather,
  hoveredHour,
  setHoveredHour,
  formatTemp,
  tempSymbol,
  formatWind,
}) {
  // SVG Wave calculations
  const chartWidth = 640;
  const chartHeight = 110;
  const numPoints = hourlyData.length;
  const minT = Math.min(...hourlyData.map(d => formatTemp(d.temp)));
  const maxT = Math.max(...hourlyData.map(d => formatTemp(d.temp)));
  const tempRange = Math.max(1, maxT - minT);

  const points = hourlyData.map((d, i) => {
    const currentT = formatTemp(d.temp);
    const x = (i / (numPoints - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 20 - ((currentT - minT) / tempRange) * (chartHeight - 45);
    return { x, y, currentT, ...d };
  });

  const wavePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${wavePath} L ${points[points.length - 1].x},${chartHeight + 20} L ${points[0].x},${chartHeight + 20} Z`;

  return (
    <div className="lg:col-span-8 apple-glass-card rounded-[28px] p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Specular Liquid Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

      {/* Segmented Tabs */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h2 className="text-sm font-bold text-white tracking-wide">
          {activeTab === 'Summary'
            ? 'Summary & Precipitation Wave'
            : activeTab === 'Hourly'
            ? 'Hourly Forecast Timeline'
            : 'Meteorological Conditions'}
        </h2>

        {/* Apple Segmented Pill */}
        <div className="bg-black/25 p-1 rounded-full border border-white/15 flex items-center text-[11px] backdrop-blur-md">
          {['Summary', 'Hourly', 'More Details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1 rounded-full transition-all font-semibold ${
                activeTab === tab
                  ? 'bg-white/20 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SUMMARY (SVG Wave Graph) */}
      {activeTab === 'Summary' && (
        <>
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-6 relative z-10">
            <div className="w-1/2 text-right pr-6">Today</div>
            <div className="w-1/2 pl-6">{forecastList[activeForecastDayIndex]?.date || 'Upcoming'}</div>
          </div>

          {/* Area Wave Chart */}
          <div className="w-full relative h-[140px] my-1 z-10 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <line
                x1={chartWidth * 0.44}
                y1={10}
                x2={chartWidth * 0.44}
                y2={chartHeight + 10}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="3 3"
              />

              <path d={areaPath} fill="url(#waveGradient)" />
              <path
                d={wavePath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {points.map((pt, i) => (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredHour(pt)}
                  onMouseLeave={() => setHoveredHour(null)}
                  className="cursor-pointer"
                >
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {pt.currentT}°
                  </text>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredHour?.time === pt.time ? '5' : '3.5'}
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="2"
                    className="transition-all"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Weather Icons Row */}
          <div className="flex justify-between items-center px-4 relative z-10">
            {hourlyData.map((d, i) => (
              <div key={i} className="flex justify-center w-8">
                <WeatherIcon type={d.icon} size="w-3.5 h-3.5" />
              </div>
            ))}
          </div>

          {/* Rain Probability Row */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium px-2 pt-2 border-t border-white/5 relative z-10">
            <span className="text-slate-400 font-semibold text-[10px] w-12">Rain %</span>
            <div className="flex-1 flex justify-between items-center pl-2">
              {hourlyData.map((d, i) => (
                <span key={i} className="text-center w-8 text-slate-300 text-[11px]">
                  {d.rain}%
                </span>
              ))}
            </div>
          </div>

          {/* Timestamps Row */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2 pt-1 relative z-10">
            <span className="w-12" />
            <div className="flex-1 flex justify-between items-center pl-2">
              {hourlyData.map((d, i) => (
                <span key={i} className="text-center w-8 text-slate-400 text-[10px]">
                  {d.time}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: HOURLY CAROUSEL CARDS */}
      {activeTab === 'Hourly' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-2 z-10">
          {hourlyData.map((item, idx) => (
            <div
              key={idx}
              className="apple-glass-capsule rounded-2xl p-3.5 flex flex-col items-center justify-between gap-1.5 hover:border-sky-400/50 hover:bg-white/[0.1] transition-all group"
            >
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white">{item.time}</span>
              <div className="my-1.5 group-hover:scale-110 transition-transform">
                <WeatherIcon type={item.icon} size="w-7 h-7" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {formatTemp(item.temp)}{tempSymbol}
              </span>
              <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full"
                  style={{ width: `${item.rain}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-sky-300">{item.rain}% Rain</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MORE DETAILS / METRICS */}
      {activeTab === 'More Details' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 py-2 z-10">
          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Sunrise & Sunset</span>
            </div>
            <div className="mt-2 text-xs text-white">
              <div className="flex justify-between">
                <span className="text-slate-400">Dawn:</span>
                <span className="font-bold">{weather.sunrise}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-400">Dusk:</span>
                <span className="font-bold">{weather.sunset}</span>
              </div>
            </div>
          </div>

          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Visibility</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">{weather.visibility} km</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Clear visibility across city</p>
            </div>
          </div>

          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Air Pressure</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">{weather.pressure} hPa</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Normal atmospheric levels</p>
            </div>
          </div>

          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Dew Point</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">{formatTemp(weather.dewPoint)}{tempSymbol}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">High condensation expected</p>
            </div>
          </div>

          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Wind className="w-4 h-4 text-blue-400" />
              <span>Wind & Gusts</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">{formatWind(weather.windSpeed)}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Direction: West-Northwest</p>
            </div>
          </div>

          <div className="apple-glass-capsule rounded-2xl p-4 flex flex-col justify-between hover:border-sky-400/40 transition">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>UV Level</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white tracking-tight">{weather.uv} / 10</span>
              <p className="text-[10px] text-emerald-400 mt-0.5">Moderate exposure risk</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
