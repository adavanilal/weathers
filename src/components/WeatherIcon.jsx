import React from 'react';
import {
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  Sun,
  CloudSun,
  Snowflake,
  Cloud,
} from 'lucide-react';

export default function WeatherIcon({ type, size = 'w-6 h-6' }) {
  switch (type) {
    case 'heavy-rain':
      return (
        <div className="relative flex items-center justify-center">
          <CloudRain className={`${size} text-blue-300 drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)]`} />
        </div>
      );
    case 'thunder':
      return (
        <div className="relative flex items-center justify-center">
          <CloudLightning className={`${size} text-amber-300 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]`} />
        </div>
      );
    case 'drizzle':
    case 'rain':
      return (
        <div className="relative flex items-center justify-center">
          <CloudDrizzle className={`${size} text-sky-300 drop-shadow-[0_4px_8px_rgba(56,189,248,0.5)]`} />
        </div>
      );
    case 'sun':
      return (
        <div className="relative flex items-center justify-center">
          <Sun className={`${size} text-amber-400 drop-shadow-[0_4px_14px_rgba(251,191,36,0.8)]`} />
        </div>
      );
    case 'sun-cloud':
      return (
        <div className="relative flex items-center justify-center">
          <CloudSun className={`${size} text-amber-300 drop-shadow-[0_4px_10px_rgba(251,191,36,0.5)]`} />
        </div>
      );
    case 'snow':
      return (
        <div className="relative flex items-center justify-center">
          <Snowflake className={`${size} text-cyan-200 drop-shadow-[0_4px_8px_rgba(165,243,252,0.6)]`} />
        </div>
      );
    default:
      return (
        <div className="relative flex items-center justify-center">
          <Cloud className={`${size} text-slate-300 drop-shadow-[0_4px_10px_rgba(203,213,225,0.4)]`} />
        </div>
      );
  }
}
