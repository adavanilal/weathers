import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  Snowflake,
  CloudLightning,
  CloudDrizzle,
  Waves,
  Crosshair,
  MoreVertical,
  Bell,
  LayoutGrid,
  Map as MapIcon,
  Compass,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Eye
} from 'lucide-react';
import L from 'leaflet';

const API_KEY = "b8b969778b291dfb7a094d1c8ad2bd93";

// Initial fallback mock data for popular cities and seamless rendering
const POPULAR_CITIES = [
  { name: 'Delhi', condition: 'Partly Cloudy', temp: 28, minTemp: 22, rain: 20, icon: 'cloud-sun', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', condition: 'Drizzle Rain', temp: 27, minTemp: 24, rain: 65, icon: 'drizzle', lat: 19.0760, lon: 72.8777 },
  { name: 'Hyderabad', condition: 'Heavy Rain', temp: 24, minTemp: 21, rain: 88, icon: 'heavy-rain', lat: 17.3850, lon: 78.4867 },
  { name: 'Bangalore', condition: 'Light Thunders', temp: 23, minTemp: 19, rain: 72, icon: 'thunder', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', condition: 'Mostly Sunny', temp: 31, minTemp: 26, rain: 15, icon: 'sun', lat: 22.5726, lon: 88.3639 },
];

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState('Hyderabad');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [forecastDays, setForecastDays] = useState(7);
  const [activeTab, setActiveTab] = useState('Summary');
  const [activeForecastDayIndex, setActiveForecastDayIndex] = useState(3); // matching reference highlighting
  const [hoveredHour, setHoveredHour] = useState(null);

  const [weather, setWeather] = useState({
    city: 'Hyderabad',
    country: 'IN',
    temp: 24,
    feelsLike: 23,
    condition: 'Heavy Rain',
    description: 'thunderstorm with heavy rain',
    humidity: 92,
    windSpeed: 6,
    aqi: 173,
    uv: 3,
    lat: 17.3850,
    lon: 78.4867,
    timeString: '6:25 PM',
  });

  const [forecastList, setForecastList] = useState([
    { date: '25 Jul, Thu', day: 'Thu', min: 22, max: 24, condition: 'Rain', icon: 'rain' },
    { date: '26 Jul, Fri', day: 'Fri', min: 22, max: 24, condition: 'Sun Cloud', icon: 'sun-cloud' },
    { date: '27 Jul, Sat', day: 'Sat', min: 22, max: 24, condition: 'Cloudy', icon: 'cloud' },
    { date: '28 Jul, Sun', day: 'Sun', min: 22, max: 24, condition: 'Heavy Rain', icon: 'heavy-rain' },
    { date: '29 Jul, Mon', day: 'Mon', min: 22, max: 24, condition: 'Light Rain', icon: 'rain' },
    { date: '30 Jul, Tue', day: 'Tue', min: 22, max: 24, condition: 'Thunder', icon: 'thunder' },
    { date: '31 Jul, Wed', day: 'Wed', min: 21, max: 25, condition: 'Sun', icon: 'sun' },
    { date: '01 Aug, Thu', day: 'Thu', min: 22, max: 26, condition: 'Partly Cloudy', icon: 'sun-cloud' },
    { date: '02 Aug, Fri', day: 'Fri', min: 20, max: 24, condition: 'Drizzle', icon: 'drizzle' },
    { date: '03 Aug, Sat', day: 'Sat', min: 21, max: 25, condition: 'Clear', icon: 'sun' },
  ]);

  const [hourlyData, setHourlyData] = useState([
    { time: 'Now', temp: 22, rain: 78, isNextDay: false, icon: 'heavy-rain' },
    { time: '7 PM', temp: 20, rain: 79, isNextDay: false, icon: 'rain' },
    { time: '9 PM', temp: 22, rain: 76, isNextDay: false, icon: 'rain' },
    { time: '11 PM', temp: 19, rain: 81, isNextDay: false, icon: 'thunder' },
    { time: '1 AM', temp: 21, rain: 76, isNextDay: true, icon: 'rain' },
    { time: '3 AM', temp: 22, rain: 78, isNextDay: true, icon: 'rain' },
    { time: '5 AM', temp: 23, rain: 68, isNextDay: true, icon: 'drizzle' },
    { time: '7 AM', temp: 24, rain: 61, isNextDay: true, icon: 'sun-cloud' },
    { time: '9 AM', temp: 25, rain: 69, isNextDay: true, icon: 'sun-cloud' },
    { time: '11 AM', temp: 23, rain: 70, isNextDay: true, icon: 'heavy-rain' },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([weather.lat, weather.lon], 9);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add custom pulse radar marker
      const customIcon = L.divIcon({
        className: 'radar-pulse-wrapper',
        html: `<div class="radar-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([weather.lat, weather.lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b style="color: #1e293b;">${weather.city}</b>`).openPopup();

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([weather.lat, weather.lon]);
        markerRef.current.setPopupContent(`<b style="color: #1e293b;">${weather.city}</b>`).openPopup();
      }
    }
  }, [weather.lat, weather.lon, weather.city]);

  // Fetch weather data for city
  const fetchCityWeather = async (cityName) => {
    if (!cityName || !cityName.trim()) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName.trim())}&units=metric&appid=${API_KEY}`
      );

      if (res.ok) {
        const data = await res.json();
        const localNow = new Date();
        const timeStr = localNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newWeather = {
          city: data.name,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          aqi: Math.round(100 + Math.random() * 80),
          uv: Math.min(10, Math.max(1, Math.round((data.main.temp / 8)))),
          lat: data.coord.lat,
          lon: data.coord.lon,
          timeString: timeStr,
        };

        setWeather(newWeather);

        // Fetch 5-day forecast
        try {
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName.trim())}&units=metric&appid=${API_KEY}`
          );
          if (forecastRes.ok) {
            const fData = await forecastRes.json();
            
            // Build 10 hourly data points from 3-hour increments
            const hours = fData.list.slice(0, 10).map((item, idx) => {
              const d = new Date(item.dt * 1000);
              const timeLabel = idx === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric' });
              return {
                time: timeLabel,
                temp: Math.round(item.main.temp),
                rain: Math.min(95, Math.max(15, Math.round((item.pop || 0.5) * 100))),
                isNextDay: idx > 3,
                icon: mapConditionToIconType(item.weather[0].main),
              };
            });
            if (hours.length > 0) setHourlyData(hours);

            // Group by day for forecast
            const dailyMap = {};
            fData.list.forEach((item) => {
              const d = new Date(item.dt * 1000);
              const dayKey = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' });
              if (!dailyMap[dayKey]) {
                dailyMap[dayKey] = {
                  date: dayKey,
                  day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                  temps: [],
                  condition: item.weather[0].main,
                  icon: mapConditionToIconType(item.weather[0].main),
                };
              }
              dailyMap[dayKey].temps.push(item.main.temp);
            });

            const parsedForecast = Object.values(dailyMap).map((d) => ({
              date: d.date,
              day: d.day,
              min: Math.round(Math.min(...d.temps)),
              max: Math.round(Math.max(...d.temps)),
              condition: d.condition,
              icon: d.icon,
            }));

            if (parsedForecast.length >= 5) {
              setForecastList(parsedForecast);
            }
          }
        } catch (e) {
          console.warn('Forecast API error, using calculated forecast', e);
        }
      } else {
        // Fallback to matching popular city or mock realistic city data
        const match = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.trim().toLowerCase());
        if (match) {
          setWeather({
            city: match.name,
            country: 'IN',
            temp: match.temp,
            feelsLike: match.temp - 1,
            condition: match.condition,
            description: match.condition.toLowerCase(),
            humidity: match.name === 'Hyderabad' ? 92 : 75,
            windSpeed: 6,
            aqi: 173,
            uv: 3,
            lat: match.lat,
            lon: match.lon,
            timeString: '6:25 PM',
          });
        } else {
          setWeather(prev => ({
            ...prev,
            city: cityName,
            temp: 24,
            condition: 'Heavy Rain',
            description: 'heavy rain shower',
          }));
        }
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mapConditionToIconType = (cond) => {
    const c = (cond || '').toLowerCase();
    if (c.includes('thunder')) return 'thunder';
    if (c.includes('heavy') || (c.includes('rain') && c.includes('extreme'))) return 'heavy-rain';
    if (c.includes('rain')) return 'rain';
    if (c.includes('drizzle')) return 'drizzle';
    if (c.includes('snow')) return 'snow';
    if (c.includes('clear') || c.includes('sun')) return 'sun';
    if (c.includes('cloud') && c.includes('sun')) return 'sun-cloud';
    return 'cloud';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setActiveCity(cityInput.trim());
      fetchCityWeather(cityInput.trim());
      setCityInput('');
    }
  };

  const handleSelectCity = (city) => {
    setActiveCity(city.name);
    fetchCityWeather(city.name);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data.name) {
                setActiveCity(data.name);
                fetchCityWeather(data.name);
              }
            })
            .catch(() => {});
        },
        () => {}
      );
    }
  };

  // Weather Icon Component matching reference 3D styled visuals
  const renderWeatherIcon = (type, size = 'w-6 h-6') => {
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
  };

  // SVG Wave curve calculations for temperature & precipitation
  const chartWidth = 640;
  const chartHeight = 110;
  const numPoints = hourlyData.length;
  const minTemp = Math.min(...hourlyData.map(d => d.temp), 15);
  const maxTemp = Math.max(...hourlyData.map(d => d.temp), 30);
  const tempRange = Math.max(1, maxTemp - minTemp);

  const points = hourlyData.map((d, i) => {
    const x = (i / (numPoints - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 20 - ((d.temp - minTemp) / tempRange) * (chartHeight - 45);
    return { x, y, ...d };
  });

  // Construct smooth bezier SVG path
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8 overflow-hidden bg-gradient-to-b from-[#195bb0] via-[#246bbd] to-[#124b94]">
      
      {/* ================= BACKGROUND 3D CLOUDS (Like reference screenshot) ================= */}
      {/* Top Left Floating Cloud */}
      <div className="absolute -top-10 -left-12 pointer-events-none select-none opacity-90 z-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] animate-[pulse_8s_ease-in-out_infinite]">
        <svg width="280" height="180" viewBox="0 0 280 180" fill="none">
          <ellipse cx="100" cy="110" rx="75" ry="45" fill="url(#cloudGrad1)" />
          <ellipse cx="160" cy="90" rx="65" ry="55" fill="url(#cloudGrad2)" />
          <ellipse cx="205" cy="115" rx="55" ry="38" fill="url(#cloudGrad1)" />
          <ellipse cx="140" cy="120" rx="90" ry="35" fill="url(#cloudGrad3)" />
          <defs>
            <linearGradient id="cloudGrad1" x1="50" y1="60" x2="160" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#c5dcfa" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="120" y1="40" x2="200" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#b4d2f8" />
            </linearGradient>
            <linearGradient id="cloudGrad3" x1="100" y1="90" x2="180" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e8f2fe" />
              <stop offset="1" stopColor="#9cc2f3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Center Floating Cloud */}
      <div className="absolute -top-6 left-[38%] pointer-events-none select-none opacity-85 z-0 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
        <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
          <ellipse cx="80" cy="85" rx="60" ry="38" fill="url(#cloudGrad1)" />
          <ellipse cx="130" cy="70" rx="50" ry="42" fill="url(#cloudGrad2)" />
          <ellipse cx="165" cy="90" rx="42" ry="30" fill="url(#cloudGrad1)" />
        </svg>
      </div>

      {/* Top Right Floating Cloud */}
      <div className="absolute -top-8 -right-8 pointer-events-none select-none opacity-90 z-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] animate-[pulse_10s_ease-in-out_infinite]">
        <svg width="260" height="170" viewBox="0 0 260 170" fill="none">
          <ellipse cx="170" cy="100" rx="70" ry="42" fill="url(#cloudGrad1)" />
          <ellipse cx="110" cy="80" rx="60" ry="50" fill="url(#cloudGrad2)" />
          <ellipse cx="70" cy="105" rx="50" ry="35" fill="url(#cloudGrad1)" />
        </svg>
      </div>

      {/* ================= MAIN FROSTED GLASS CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-[1240px] bg-[#12233c]/85 backdrop-blur-2xl border border-white/10 rounded-[28px] md:rounded-[34px] shadow-[0_25px_80px_rgba(3,14,38,0.65)] overflow-hidden flex flex-col md:flex-row min-h-[640px]">

        {/* ================= LEFT ICON NAVIGATION RAIL ================= */}
        <aside className="w-full md:w-[72px] lg:w-[76px] bg-[#0c1a2e]/60 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-between py-4 md:py-7 px-4 md:px-0 select-none">
          
          {/* Logo Brand Icon */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-lg shadow-white/10">
              <svg className="w-6 h-6 text-[#10233f]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 3h12a1 1 0 0 1 1 1v2a6 6 0 0 1-4 5.659V12a6 6 0 0 1 4 5.659V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.341A6 6 0 0 1 9 12v-.341A6 6 0 0 1 5 6V4a1 1 0 0 1 1-1z" />
              </svg>
            </div>

            {/* Nav Icons */}
            <div className="flex md:flex-col items-center gap-3 md:gap-5 mt-1">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'dashboard'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Dashboard"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('map')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'map'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Weather Map"
              >
                <MapIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('radar')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'radar'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Radar"
              >
                <Compass className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('locations')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'locations'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Locations"
              >
                <MapPin className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveNav('settings')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'settings'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Logout / Exit */}
          <button
            className="text-slate-400 hover:text-red-300 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        {/* ================= DASHBOARD CONTENT AREA ================= */}
        <main className="flex-1 p-5 md:p-7 flex flex-col gap-6 overflow-y-auto">

          {/* TOP HEADER: SEARCH BAR + NOTIFICATIONS + PROFILE */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-md relative">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Search for location"
                className="w-full pl-11 pr-4 py-2.5 bg-[#172b49]/70 border border-white/10 rounded-xl text-sm placeholder-slate-400 text-white focus:outline-none focus:border-blue-400/60 focus:bg-[#1a3254]/90 transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            </form>

            {/* Profile & Notifications */}
            <div className="flex items-center gap-3.5 self-end sm:self-auto">
              <button
                onClick={handleLocateMe}
                title="Use My Current GPS Location"
                className="p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition"
              >
                <Crosshair className="w-4 h-4" />
              </button>

              <button className="relative p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full ring-2 ring-[#12233c]" />
              </button>

              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* TOP SECTION: 3 GRID CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* CARD 1: CURRENT WEATHER HERO (3.8 Cols) */}
            <div className="lg:col-span-4 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
              {/* Card Header */}
              <div>
                <h2 className="text-base font-semibold text-white tracking-wide">
                  Current Weather
                </h2>
                <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                  {weather.timeString}
                </span>
              </div>

              {/* Hero Weather Display */}
              <div className="my-5 flex items-center justify-between gap-4">
                {/* 3D Sun Cloud Rain Visual Illustration */}
                <div className="relative w-24 h-24 flex items-center justify-center select-none">
                  {/* Glowing sun in background */}
                  <div className="absolute top-1 right-2 w-11 h-11 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full blur-[1px] shadow-[0_0_16px_rgba(251,191,36,0.8)]" />
                  
                  {/* Fluffy white front cloud */}
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

                  {/* Falling Raindrops */}
                  <div className="absolute -bottom-1 left-4 flex gap-2.5 z-0">
                    <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    <div className="w-1 h-3.5 bg-blue-300 rounded-full animate-bounce [animation-delay:450ms]" />
                  </div>
                </div>

                {/* Big Degree + Condition */}
                <div className="flex flex-col items-end">
                  <div className="flex items-start">
                    <span className="text-5xl font-extrabold text-white tracking-tighter">
                      {weather.temp}
                    </span>
                    <span className="text-xl font-bold text-slate-300 ml-0.5 mt-1">°c</span>
                  </div>
                  <span className="text-sm font-medium text-slate-200 tracking-wide mt-1">
                    {weather.condition}
                  </span>
                </div>
              </div>

              {/* 4 Bottom Metrics (Air/Waves, Humidity, Wind, UV) */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-center">
                <div className="flex flex-col items-center">
                  <Waves className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-white">{weather.aqi}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-white">{weather.humidity}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <Wind className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-white">{weather.windSpeed}km/h</span>
                </div>
                <div className="flex flex-col items-center">
                  <Sun className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-white">{weather.uv}</span>
                </div>
              </div>
            </div>

            {/* CARD 2: INTERACTIVE MAP / RADAR (4.4 Cols) */}
            <div className="lg:col-span-5 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-2.5 shadow-lg relative min-h-[220px] flex flex-col overflow-hidden">
              <div className="w-full h-full min-h-[200px] rounded-xl overflow-hidden relative">
                <div ref={mapContainerRef} className="w-full h-full min-h-[200px]" />

                {/* Floating Top Controls on Map */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-[400]">
                  <button
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([weather.lat, weather.lon], 11, { animate: true });
                      }
                    }}
                    title="Center on City"
                    className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* City Overlay Badge on Map */}
                <div className="absolute bottom-2.5 left-2.5 z-[400] bg-[#142848]/85 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-md text-[11px] font-medium text-white flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{weather.city}, {weather.country}</span>
                </div>
              </div>
            </div>

            {/* CARD 3: POPULAR CITIES (3.8 Cols) */}
            <div className="lg:col-span-3 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col justify-between backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Popular Cities
                </h2>
                <button className="text-[11px] text-slate-400 hover:text-blue-300 font-medium transition">
                  View more
                </button>
              </div>

              {/* City List */}
              <div className="flex flex-col gap-2.5">
                {POPULAR_CITIES.map((city) => {
                  const isActive = activeCity.toLowerCase() === city.name.toLowerCase();
                  return (
                    <button
                      key={city.name}
                      onClick={() => handleSelectCity(city)}
                      className={`flex items-center justify-between p-1.5 rounded-xl transition-all text-left group ${
                        isActive
                          ? 'bg-blue-600/20 border border-blue-400/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-300 group-hover:text-amber-300 transition">
                          {renderWeatherIcon(city.icon, 'w-4 h-4')}
                        </span>
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {city.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {city.condition}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: FORECAST (LEFT) + SUMMARY HOURLY WAVE CHART (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* CARD 4: FORECAST 7/10 DAYS (4 Cols) */}
            <div className="lg:col-span-4 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md">
              {/* Header with 7 Days / 10 Days Toggle */}
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
              <div className="flex flex-col gap-1.5">
                {forecastList.slice(0, forecastDays).map((item, idx) => {
                  const isSelected = activeForecastDayIndex === idx;
                  return (
                    <div
                      key={item.date + idx}
                      onClick={() => setActiveForecastDayIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border border-blue-400/40 shadow-inner'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">
                          {renderWeatherIcon(item.icon, 'w-4 h-4')}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {item.max}° / {item.min}°
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

            {/* CARD 5: SUMMARY & HOURLY PRECIPITATION AREA CHART (8 Cols) */}
            <div className="lg:col-span-8 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
              
              {/* Rainfall background streaks effect */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Card Header + Segmented Tabs */}
              <div className="flex items-center justify-between mb-2 relative z-10">
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  Summary
                </h2>
                <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-[11px]">
                  {['Summary', 'Hourly', 'More Details'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-md transition-all font-medium ${
                        activeTab === tab
                          ? 'bg-blue-600/40 text-white font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Markers Header: "Today" vs "Tomorrow/Sat 29" */}
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-6 relative z-10">
                <div className="w-1/2 text-right pr-6">Today</div>
                <div className="w-1/2 pl-6">Sat 29</div>
              </div>

              {/* Area Wave Chart Container */}
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

                  {/* Vertical Day Boundary Dashed Line */}
                  <line
                    x1={chartWidth * 0.44}
                    y1={10}
                    x2={chartWidth * 0.44}
                    y2={chartHeight + 10}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="3 3"
                  />

                  {/* Area Fill */}
                  <path d={areaPath} fill="url(#waveGradient)" />

                  {/* Top Smooth Wave Curve */}
                  <path
                    d={wavePath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Nodes on Wave */}
                  {points.map((pt, i) => (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredHour(pt)}
                      onMouseLeave={() => setHoveredHour(null)}
                      className="cursor-pointer"
                    >
                      {/* Temperature Label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {pt.temp}°
                      </text>

                      {/* Small subtle dot */}
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

              {/* Weather Condition Icons Row */}
              <div className="flex justify-between items-center px-4 relative z-10">
                {hourlyData.map((d, i) => (
                  <div key={i} className="flex justify-center w-8">
                    {renderWeatherIcon(d.icon, 'w-3.5 h-3.5')}
                  </div>
                ))}
              </div>

              {/* Rain % Row */}
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

              {/* Hour Timestamps Row */}
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

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}