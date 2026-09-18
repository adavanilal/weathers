import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

import { API_KEY, DEFAULT_POPULAR_CITIES, mapConditionToIconType } from './constants/cities';

import NavigationRail from './components/NavigationRail';
import Header from './components/Header';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import MiniMapCard from './components/MiniMapCard';
import PopularCitiesCard from './components/PopularCitiesCard';
import ForecastCard from './components/ForecastCard';
import SummaryMetricsCard from './components/SummaryMetricsCard';
import FullWeatherMap from './components/FullWeatherMap';
import DopplerRadar from './components/DopplerRadar';
import SavedLocations from './components/SavedLocations';
import SettingsView from './components/SettingsView';
import LogoutModal from './components/LogoutModal';
import ProfileEditModal from './components/ProfileEditModal';

export default function App() {
  // Navigation & View States
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeCity, setActiveCity] = useState('Patna');
  const [cityInput, setCityInput] = useState('');
  const [forecastDays, setForecastDays] = useState(7);
  const [activeTab, setActiveTab] = useState('Summary');
  const [activeForecastDayIndex, setActiveForecastDayIndex] = useState(3);
  const [hoveredHour, setHoveredHour] = useState(null);
  const [viewMoreCities, setViewMoreCities] = useState(false);
  const [popularCitiesList, setPopularCitiesList] = useState([]);

  // User Profile State (persisted in localStorage)
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('aether_profile_name') || 'Amit Lal';
  });
  const [profileAvatar, setProfileAvatar] = useState(() => {
    return localStorage.getItem('aether_profile_avatar') || 'https://api.dicebear.com/7.x/bottts/svg?seed=AetherSky';
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Search Suggestions & History State
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestionIndex, setSearchSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(['Patna', 'Delhi', 'Mumbai', 'London', 'Tokyo']);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchContainerRef = useRef(null);

  // Settings & Preferences
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [windUnit, setWindUnit] = useState('km/h'); // 'km/h' or 'mph'
  const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'
  const [mapLayer, setMapLayer] = useState('dark'); // 'dark', 'streets', 'satellite'

  // Popups & Modals State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMapMenu, setShowMapMenu] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Saved / Favorite Locations
  const [favorites, setFavorites] = useState([
    { name: 'Patna', temp: 28, condition: 'Clear', country: 'IN', lat: 25.5941, lon: 85.1376 },
    { name: 'Bangalore', temp: 23, condition: 'Light Thunders', country: 'IN', lat: 12.9716, lon: 77.5946 },
    { name: 'London', temp: 18, condition: 'Drizzle', country: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', temp: 26, condition: 'Clear', country: 'JP', lat: 35.6762, lon: 139.6503 }
  ]);
  const [newFavoriteInput, setNewFavoriteInput] = useState('');

  // Notifications List
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Heavy Rainfall Warning', desc: 'Precipitation exceeding 35mm expected this evening.', time: '10m ago', unread: true, severity: 'warning' },
    { id: 2, title: 'Air Quality Advisory', desc: 'AQI index is currently 173 (Unhealthy for sensitive groups).', time: '1h ago', unread: true, severity: 'caution' },
    { id: 3, title: 'Sudden Wind Gusts', desc: 'Winds up to 24 km/h expected in the next 2 hours.', time: '3h ago', unread: false, severity: 'info' }
  ]);

  // Radar Interactive Timeline State
  const [radarPlaying, setRadarPlaying] = useState(false);
  const [radarFrame, setRadarFrame] = useState(2); // 0 to 4 (-2h, -1h, now, +1h, +2h)
  const [radarSpeed, setRadarSpeed] = useState(1);
  const radarTimelineLabels = ['-2 Hours', '-1 Hour', 'Live Radar', '+1 Hour Proj', '+2 Hours Proj'];

  // Current Weather State
  const [weather, setWeather] = useState({
    city: 'Patna',
    country: 'IN',
    temp: 28,
    feelsLike: 29,
    condition: 'Clear',
    description: 'clear sky',
    humidity: 68,
    windSpeed: 7,
    aqi: 142,
    uv: 4,
    pressure: 1011,
    visibility: 9.0,
    dewPoint: 21,
    sunrise: '05:38 AM',
    sunset: '05:52 PM',
    lat: 25.5941,
    lon: 85.1376,
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
    { time: 'Now', temp: 22, rain: 78, isNextDay: false, icon: 'heavy-rain', wind: 6, humidity: 92 },
    { time: '7 PM', temp: 20, rain: 79, isNextDay: false, icon: 'rain', wind: 7, humidity: 90 },
    { time: '9 PM', temp: 22, rain: 76, isNextDay: false, icon: 'rain', wind: 5, humidity: 88 },
    { time: '11 PM', temp: 19, rain: 81, isNextDay: false, icon: 'thunder', wind: 8, humidity: 94 },
    { time: '1 AM', temp: 21, rain: 76, isNextDay: true, icon: 'rain', wind: 6, humidity: 95 },
    { time: '3 AM', temp: 22, rain: 78, isNextDay: true, icon: 'rain', wind: 5, humidity: 95 },
    { time: '5 AM', temp: 23, rain: 68, isNextDay: true, icon: 'drizzle', wind: 4, humidity: 91 },
    { time: '7 AM', temp: 24, rain: 61, isNextDay: true, icon: 'sun-cloud', wind: 5, humidity: 82 },
    { time: '9 AM', temp: 25, rain: 69, isNextDay: true, icon: 'sun-cloud', wind: 7, humidity: 76 },
    { time: '11 AM', temp: 23, rain: 70, isNextDay: true, icon: 'heavy-rain', wind: 9, humidity: 85 },
  ]);

  const [loading, setLoading] = useState(false);


  // Show quick toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Temperature unit conversion
  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const tempSymbol = unit === 'F' ? '°F' : '°C';

  // Wind speed conversion
  const formatWind = (kmh) => {
    if (windUnit === 'mph') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };


  // Radar Timeline Auto-Play Loop
  useEffect(() => {
    let interval = null;
    if (radarPlaying) {
      interval = setInterval(() => {
        setRadarFrame((prev) => (prev + 1) % 5);
      }, 1500 / radarSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [radarPlaying, radarSpeed]);

  // Fetch weather and air quality data for city from OpenWeatherMap API
  const fetchCityWeather = async (cityName, lat = null, lon = null) => {
    if (!cityName && (lat == null || lon == null)) return;
    setLoading(true);

    try {
      // 1. Fetch live current weather by coordinates or city name
      let queryUrl = (lat != null && lon != null)
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        : `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName.trim())}&units=metric&appid=${API_KEY}`;

      let res = await fetch(queryUrl);

      // Fallback: if query with comma or state failed, try just the city name part
      if (!res.ok && cityName && cityName.includes(',')) {
        const cleanName = cityName.split(',')[0].trim();
        res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanName)}&units=metric&appid=${API_KEY}`
        );
      }

      if (res.ok) {
        const data = await res.json();
        const localNow = new Date();
        const timeStr = localNow.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: timeFormat === '12h',
        });

        const sunriseDate = new Date(data.sys.sunrise * 1000);
        const sunsetDate = new Date(data.sys.sunset * 1000);

        // 2. Fetch live Air Pollution API for real AQI & PM2.5 levels
        let realAqi = 48;
        let aqiStatus = 'Good';
        try {
          const airRes = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`
          );
          if (airRes.ok) {
            const airData = await airRes.json();
            if (airData.list && airData.list.length > 0) {
              const air = airData.list[0];
              const pm25 = air.components.pm2_5 || 10;
              realAqi = Math.round(pm25 * 3.8);
              if (air.main.aqi === 1) aqiStatus = 'Good';
              else if (air.main.aqi === 2) aqiStatus = 'Fair';
              else if (air.main.aqi === 3) aqiStatus = 'Moderate';
              else if (air.main.aqi === 4) aqiStatus = 'Poor';
              else aqiStatus = 'Very Poor';
            }
          }
        } catch (airErr) {
          console.warn('Air pollution API failed, using standard calculation:', airErr);
        }

        const newWeather = {
          city: data.name,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          aqi: realAqi,
          aqiStatus: aqiStatus,
          uv: Math.min(10, Math.max(1, Math.round(data.main.temp / 8))),
          pressure: data.main.pressure || 1012,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
          dewPoint: Math.round(data.main.temp - (100 - data.main.humidity) / 5),
          sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          lat: data.coord.lat,
          lon: data.coord.lon,
          timeString: timeStr,
          isLiveApi: true,
        };

        setWeather(newWeather);
        setActiveCity(data.name);
        triggerToast(`Live API: Updated weather for ${data.name}`);

        // Update real dynamic notifications based on live API metrics
        const liveAlerts = [];
        if (data.weather[0].main.toLowerCase().includes('rain') || data.weather[0].main.toLowerCase().includes('thunder')) {
          liveAlerts.push({
            id: 1,
            title: `Precipitation Warning: ${data.weather[0].main}`,
            desc: `Live radar reports ${data.weather[0].description} across ${data.name} with ${data.main.humidity}% humidity.`,
            time: 'Live',
            unread: true,
            severity: 'warning'
          });
        }
        if (data.wind.speed * 3.6 > 15) {
          liveAlerts.push({
            id: 2,
            title: `High Wind Alert: ${Math.round(data.wind.speed * 3.6)} km/h`,
            desc: `Wind gusts active in ${data.name}.`,
            time: 'Live',
            unread: true,
            severity: 'info'
          });
        }
        if (realAqi > 100) {
          liveAlerts.push({
            id: 3,
            title: `Air Quality Advisory: AQI ${realAqi} (${aqiStatus})`,
            desc: `Elevated particulate matter detected in ${data.name}. Sensitive individuals should limit outdoor exertion.`,
            time: 'Live',
            unread: true,
            severity: 'caution'
          });
        }
        if (liveAlerts.length > 0) {
          setNotifications(liveAlerts);
        }

        // 3. Fetch 5-day / 3-hour live forecast directly by coordinates
        try {
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${API_KEY}`
          );
          if (forecastRes.ok) {
            const fData = await forecastRes.json();
            const hours = fData.list.slice(0, 10).map((item, idx) => {
              const d = new Date(item.dt * 1000);
              const timeLabel = idx === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: timeFormat === '12h' });
              return {
                time: timeLabel,
                temp: Math.round(item.main.temp),
                rain: Math.min(95, Math.max(10, Math.round((item.pop || 0.3) * 100))),
                isNextDay: idx > 3,
                icon: mapConditionToIconType(item.weather[0].main),
                wind: Math.round((item.wind?.speed || 2) * 3.6),
                humidity: item.main.humidity || 75,
              };
            });
            if (hours.length > 0) setHourlyData(hours);

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

            if (parsedForecast.length >= 4) {
              setForecastList(parsedForecast);
            }
          }
        } catch (e) {
          console.warn('Forecast API error, using calculated forecast', e);
        }
      } else {
        triggerToast(`City "${cityName}" not found on OpenWeather`);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
      triggerToast('Unable to connect to OpenWeather service');
    } finally {
      setLoading(false);
    }
  };

  // Fetch live weather for popular cities from API
  const fetchPopularCitiesWeather = async () => {
    try {
      const topCities = DEFAULT_POPULAR_CITIES;
      const results = await Promise.all(
        topCities.map(async (name) => {
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${API_KEY}`
            );
            if (res.ok) {
              const d = await res.json();
              return {
                name: d.name,
                country: d.sys.country,
                code: d.sys.country,
                temp: Math.round(d.main.temp),
                condition: d.weather[0].main,
                icon: mapConditionToIconType(d.weather[0].main),
                lat: d.coord.lat,
                lon: d.coord.lon,
              };
            }
          } catch (e) {}
          return null;
        })
      );
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setPopularCitiesList(valid);
      }
    } catch (e) {
      console.warn('Error fetching popular cities weather:', e);
    }
  };

  // Automatically fetch live weather from API on initial mount
  useEffect(() => {
    fetchCityWeather(activeCity);
    fetchPopularCitiesWeather();
  }, []);

  // Search Helpers & History
  const addRecentSearch = (name) => {
    if (!name || !name.trim()) return;
    const clean = name.trim();
    setRecentSearches((prev) => [clean, ...prev.filter((c) => c.toLowerCase() !== clean.toLowerCase())].slice(0, 6));
  };

  const removeRecentSearch = (term) => {
    setRecentSearches((prev) => prev.filter((c) => c.toLowerCase() !== term.toLowerCase()));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    triggerToast('Recent searches cleared');
  };

  // Live OpenWeather Direct Geocoding API for global cities worldwide
  useEffect(() => {
    if (!cityInput || !cityInput.trim() || cityInput.trim().length < 2) {
      setApiSuggestions([]);
      setSearchLoading(false);
      return;
    }

    const query = cityInput.trim();
    setSearchLoading(true);

    const timer = setTimeout(async () => {
      try {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=7&appid=${API_KEY}`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const mapped = geoData.map((item) => ({
            name: item.name,
            state: item.state || '',
            country: item.country || '',
            code: item.country || 'GL',
            lat: item.lat,
            lon: item.lon,
            temp: null, // live weather will be loaded upon selection
            isApiResult: true,
          }));
          setApiSuggestions(mapped);
        } else {
          setApiSuggestions([]);
        }
      } catch (err) {
        console.warn('Geocoding search error:', err);
        setApiSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [cityInput]);

  const handleSelectSuggestion = (cityOrName) => {
    const cityName = typeof cityOrName === 'string' ? cityOrName : cityOrName.name;
    const lat = typeof cityOrName === 'object' && cityOrName !== null ? cityOrName.lat : null;
    const lon = typeof cityOrName === 'object' && cityOrName !== null ? cityOrName.lon : null;
    setActiveCity(cityName);
    fetchCityWeather(cityName, lat, lon);
    addRecentSearch(cityName);
    setCityInput('');
    setApiSuggestions([]);
    setSearchFocused(false);
    setSearchSuggestionIndex(-1);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchSuggestionIndex >= 0 && filteredSuggestions[searchSuggestionIndex]) {
      handleSelectSuggestion(filteredSuggestions[searchSuggestionIndex]);
      return;
    }
    if (cityInput.trim()) {
      const q = cityInput.trim();
      fetchCityWeather(q);
      addRecentSearch(q);
      setCityInput('');
      setApiSuggestions([]);
      setSearchFocused(false);
      setSearchSuggestionIndex(-1);
    }
  };

  // 100% Live OpenWeather Direct Geocoding API suggestions
  const filteredSuggestions = apiSuggestions;

  const handleSearchKeyDown = (e) => {
    if (!searchFocused) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (searchSuggestionIndex >= 0 && filteredSuggestions[searchSuggestionIndex]) {
        e.preventDefault();
        handleSelectSuggestion(filteredSuggestions[searchSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSearchSuggestionIndex(-1);
    }
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
        setSearchSuggestionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    const cityName = typeof city === 'string' ? city : city.name;
    const lat = typeof city === 'object' && city !== null ? city.lat : null;
    const lon = typeof city === 'object' && city !== null ? city.lon : null;
    setActiveCity(cityName);
    fetchCityWeather(cityName, lat, lon);
    addRecentSearch(cityName);
  };

  // GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      triggerToast('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    triggerToast('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
          .then(res => res.json())
          .then(data => {
            if (data.name) {
              fetchCityWeather(data.name);
            }
          })
          .catch(() => {
            triggerToast('Failed to identify location from coordinates');
          })
          .finally(() => {
            setLocating(false);
          });
      },
      () => {
        setLocating(false);
        triggerToast('Location permission denied or unavailable');
      },
      { timeout: 8000 }
    );
  };

  // Favorites
  const isCityFavorite = (cityName) => {
    return favorites.some(f => f.name.toLowerCase() === cityName.toLowerCase());
  };

  const toggleFavoriteCurrentCity = () => {
    if (isCityFavorite(weather.city)) {
      setFavorites(prev => prev.filter(f => f.name.toLowerCase() !== weather.city.toLowerCase()));
      triggerToast(`Removed ${weather.city} from saved places`);
    } else {
      setFavorites(prev => [
        ...prev,
        {
          name: weather.city,
          temp: weather.temp,
          condition: weather.condition,
          country: weather.country,
          lat: weather.lat,
          lon: weather.lon,
        }
      ]);
      triggerToast(`Added ${weather.city} to saved places`);
    }
  };

  const handleAddFavoriteCustom = (e) => {
    e.preventDefault();
    if (!newFavoriteInput.trim()) return;
    const name = newFavoriteInput.trim();
    if (isCityFavorite(name)) {
      triggerToast(`${name} is already in favorites`);
      setNewFavoriteInput('');
      return;
    }
    setFavorites(prev => [
      ...prev,
      { name, temp: 24, condition: 'Partly Cloudy', country: 'Global', lat: 20, lon: 77 }
    ]);
    triggerToast(`Added ${name} to locations`);
    setNewFavoriteInput('');
  };

  const handleRemoveFavorite = (name) => {
    setFavorites(prev => prev.filter(f => f.name.toLowerCase() !== name.toLowerCase()));
    triggerToast(`Removed ${name}`);
  };

  // Notifications
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    triggerToast('Notifications cleared');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8 overflow-hidden bg-[#071326] text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-[#0f223f]/90 border border-sky-400/40 text-sky-100 text-xs font-semibold px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl flex items-center gap-2 animate-fade-in apple-glass-pill">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Apple Liquid Glass Atmospheric Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Ambient Liquid Orbs */}
        <div
          className={`absolute -top-36 -left-36 w-[600px] h-[600px] rounded-full blur-[110px] opacity-70 animate-liquid-1 transition-all duration-1000 ${
            (weather.condition || '').toLowerCase().includes('rain') || (weather.condition || '').toLowerCase().includes('thunder')
              ? 'bg-gradient-to-tr from-cyan-500 via-blue-700 to-indigo-950'
              : (weather.condition || '').toLowerCase().includes('clear')
              ? 'bg-gradient-to-tr from-amber-500 via-yellow-500 to-blue-700'
              : 'bg-gradient-to-tr from-sky-400 via-indigo-600 to-slate-900'
          }`}
        />
        <div
          className={`absolute top-[18%] -right-36 w-[650px] h-[650px] rounded-full blur-[130px] opacity-60 animate-liquid-2 transition-all duration-1000 ${
            (weather.condition || '').toLowerCase().includes('rain') || (weather.condition || '').toLowerCase().includes('thunder')
              ? 'bg-gradient-to-bl from-purple-800 via-indigo-900 to-cyan-900'
              : (weather.condition || '').toLowerCase().includes('clear')
              ? 'bg-gradient-to-bl from-amber-400 via-sky-600 to-indigo-900'
              : 'bg-gradient-to-bl from-indigo-700 via-cyan-800 to-slate-900'
          }`}
        />
        <div
          className="absolute -bottom-48 left-[22%] w-[700px] h-[550px] rounded-full blur-[140px] opacity-50 bg-gradient-to-t from-blue-600 via-indigo-900 to-cyan-800 animate-liquid-3 pointer-events-none"
        />

        {/* Specular Liquid Wave Highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08)_0%,_transparent_65%)]" />
      </div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-[1260px] apple-liquid-shell rounded-[34px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row min-h-[660px]">
        {/* Navigation Rail */}
        <NavigationRail
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenLogout={() => setShowLogoutModal(true)}
          profileAvatar={profileAvatar}
          profileName={profileName}
          onOpenEditProfile={() => setShowProfileEditModal(true)}
        />

        {/* Main Body */}
        <main className="flex-1 p-5 md:p-7 flex flex-col gap-6 overflow-y-auto no-scrollbar relative">
          {/* Header */}
          <Header
            cityInput={cityInput}
            setCityInput={setCityInput}
            handleSearchSubmit={handleSearchSubmit}
            handleSearchKeyDown={handleSearchKeyDown}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            searchSuggestionIndex={searchSuggestionIndex}
            setSearchSuggestionIndex={setSearchSuggestionIndex}
            filteredSuggestions={filteredSuggestions}
            searchLoading={searchLoading}
            handleSelectSuggestion={handleSelectSuggestion}
            recentSearches={recentSearches}
            removeRecentSearch={removeRecentSearch}
            clearRecentSearches={clearRecentSearches}
            searchContainerRef={searchContainerRef}
            unit={unit}
            setUnit={setUnit}
            handleLocateMe={handleLocateMe}
            locating={locating}
            notifications={notifications}
            unreadCount={unreadCount}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            markAllNotificationsAsRead={markAllNotificationsAsRead}
            clearAllNotifications={clearAllNotifications}
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal}
            profileName={profileName}
            setProfileName={setProfileName}
            profileAvatar={profileAvatar}
            setProfileAvatar={setProfileAvatar}
            onOpenEditProfile={() => setShowProfileEditModal(true)}
            favoritesCount={favorites.length}
            setActiveNav={setActiveNav}
            onOpenLogout={() => setShowLogoutModal(true)}
            formatTemp={formatTemp}
            tempSymbol={tempSymbol}
            triggerToast={triggerToast}
          />

          {/* 1. Dashboard View */}
          {activeNav === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
                <CurrentWeatherCard
                  weather={weather}
                  isCityFavorite={isCityFavorite}
                  toggleFavoriteCurrentCity={toggleFavoriteCurrentCity}
                  fetchCityWeather={fetchCityWeather}
                  loading={loading}
                  formatTemp={formatTemp}
                  tempSymbol={tempSymbol}
                  setUnit={setUnit}
                  unit={unit}
                  formatWind={formatWind}
                />

                <MiniMapCard
                  weather={weather}
                  showMapMenu={showMapMenu}
                  setShowMapMenu={setShowMapMenu}
                  mapLayer={mapLayer}
                  setMapLayer={setMapLayer}
                  setActiveNav={setActiveNav}
                />

                <PopularCitiesCard
                  citiesList={popularCitiesList}
                  viewMoreCities={viewMoreCities}
                  setViewMoreCities={setViewMoreCities}
                  activeCity={activeCity}
                  handleSelectCity={handleSelectCity}
                  formatTemp={formatTemp}
                  tempSymbol={tempSymbol}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <ForecastCard
                  forecastDays={forecastDays}
                  setForecastDays={setForecastDays}
                  forecastList={forecastList}
                  activeForecastDayIndex={activeForecastDayIndex}
                  setActiveForecastDayIndex={setActiveForecastDayIndex}
                  formatTemp={formatTemp}
                  triggerToast={triggerToast}
                />

                <SummaryMetricsCard
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  forecastList={forecastList}
                  activeForecastDayIndex={activeForecastDayIndex}
                  hourlyData={hourlyData}
                  weather={weather}
                  hoveredHour={hoveredHour}
                  setHoveredHour={setHoveredHour}
                  formatTemp={formatTemp}
                  tempSymbol={tempSymbol}
                  formatWind={formatWind}
                />
              </div>
            </>
          )}

          {/* 2. Full Weather Map View */}
          {activeNav === 'map' && (
            <FullWeatherMap
              weather={weather}
              popularCities={popularCitiesList}
              mapLayer={mapLayer}
              setMapLayer={setMapLayer}
              formatTemp={formatTemp}
              tempSymbol={tempSymbol}
              handleSelectCity={handleSelectCity}
            />
          )}

          {/* 3. Doppler Radar View */}
          {activeNav === 'radar' && (
            <DopplerRadar
              radarPlaying={radarPlaying}
              setRadarPlaying={setRadarPlaying}
              radarFrame={radarFrame}
              setRadarFrame={setRadarFrame}
              radarSpeed={radarSpeed}
              setRadarSpeed={setRadarSpeed}
              radarTimelineLabels={radarTimelineLabels}
              weather={weather}
            />
          )}

          {/* 4. Saved Locations View */}
          {activeNav === 'locations' && (
            <SavedLocations
              favorites={favorites}
              weather={weather}
              newFavoriteInput={newFavoriteInput}
              setNewFavoriteInput={setNewFavoriteInput}
              handleAddFavoriteCustom={handleAddFavoriteCustom}
              handleRemoveFavorite={handleRemoveFavorite}
              handleSelectCity={handleSelectCity}
              setActiveNav={setActiveNav}
              formatTemp={formatTemp}
              tempSymbol={tempSymbol}
            />
          )}

          {/* 5. Settings View */}
          {activeNav === 'settings' && (
            <SettingsView
              unit={unit}
              setUnit={setUnit}
              windUnit={windUnit}
              setWindUnit={setWindUnit}
              timeFormat={timeFormat}
              setTimeFormat={setTimeFormat}
              mapLayer={mapLayer}
              setMapLayer={setMapLayer}
              profileName={profileName}
              profileAvatar={profileAvatar}
              onOpenEditProfile={() => setShowProfileEditModal(true)}
              onResetDefaults={() => {
                setUnit('C');
                setWindUnit('km/h');
                setTimeFormat('12h');
                setMapLayer('dark');
                triggerToast('Preferences reset to default values');
              }}
            />
          )}
        </main>
      </div>

      {/* Profile Name & Cool Avatar Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        profileName={profileName}
        setProfileName={setProfileName}
        profileAvatar={profileAvatar}
        setProfileAvatar={setProfileAvatar}
        triggerToast={triggerToast}
      />

      {/* Logout / Session Reset Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          setActiveCity('Patna');
          fetchCityWeather('Patna');
          setActiveNav('dashboard');
          setUnit('C');
          triggerToast('Session reset to Patna');
        }}
      />
    </div>
  );
}