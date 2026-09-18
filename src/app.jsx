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
  Eye,
  RefreshCw,
  X,
  Check,
  Play,
  Pause,
  Layers,
  ZoomIn,
  ZoomOut,
  Plus,
  Trash2,
  Sunrise,
  Sunset,
  ShieldAlert,
  Sliders,
  Clock,
  History,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import L from 'leaflet';

const API_KEY = "b8b969778b291dfb7a094d1c8ad2bd93";

// Comprehensive City Database for instant suggestions
const CITY_DATABASE = [
  // India Metros & Cities
  { name: 'Hyderabad', state: 'Telangana', country: 'India', code: 'IN', condition: 'Heavy Rain', temp: 24, icon: 'heavy-rain', lat: 17.3850, lon: 78.4867 },
  { name: 'Delhi', state: 'Delhi', country: 'India', code: 'IN', condition: 'Partly Cloudy', temp: 28, icon: 'cloud-sun', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Drizzle Rain', temp: 27, icon: 'drizzle', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', code: 'IN', condition: 'Light Thunders', temp: 23, icon: 'thunder', lat: 12.9716, lon: 77.5946 },
  { name: 'Bangalore', state: 'Karnataka', country: 'India', code: 'IN', condition: 'Light Thunders', temp: 23, icon: 'thunder', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', code: 'IN', condition: 'Mostly Sunny', temp: 31, icon: 'sun', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', code: 'IN', condition: 'Humid & Sunny', temp: 32, icon: 'sun', lat: 13.0827, lon: 80.2707 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Cloudy', temp: 26, icon: 'cloud', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', code: 'IN', condition: 'Hot & Clear', temp: 34, icon: 'sun', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', code: 'IN', condition: 'Sunny', temp: 33, icon: 'sun', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', code: 'IN', condition: 'Hazy Sun', temp: 30, icon: 'cloud-sun', lat: 26.8467, lon: 80.9462 },
  { name: 'Chandigarh', state: 'Punjab', country: 'India', code: 'IN', condition: 'Clear', temp: 29, icon: 'sun', lat: 30.7333, lon: 76.7794 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', code: 'IN', condition: 'Partly Cloudy', temp: 28, icon: 'cloud-sun', lat: 23.2599, lon: 77.4126 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', code: 'IN', condition: 'Clear', temp: 27, icon: 'sun', lat: 22.7196, lon: 75.8577 },
  { name: 'Kochi', state: 'Kerala', country: 'India', code: 'IN', condition: 'Rain Showers', temp: 28, icon: 'rain', lat: 9.9312, lon: 76.2673 },
  { name: 'Goa', state: 'Goa', country: 'India', code: 'IN', condition: 'Tropical Rain', temp: 28, icon: 'heavy-rain', lat: 15.2993, lon: 74.1240 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', code: 'IN', condition: 'Coastal Breeze', temp: 29, icon: 'cloud-sun', lat: 17.6868, lon: 83.2185 },
  { name: 'Patna', state: 'Bihar', country: 'India', code: 'IN', condition: 'Warm', temp: 31, icon: 'sun', lat: 25.5941, lon: 85.1376 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', code: 'IN', condition: 'Clear Skies', temp: 30, icon: 'sun', lat: 21.1458, lon: 79.0882 },
  { name: 'Bhubaneswar', state: 'Odisha', country: 'India', code: 'IN', condition: 'Thunderstorm', temp: 29, icon: 'thunder', lat: 20.2961, lon: 85.8245 },
  { name: 'Shimla', state: 'Himachal Pradesh', country: 'India', code: 'IN', condition: 'Chilly & Misty', temp: 16, icon: 'cloud', lat: 31.1048, lon: 77.1734 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', code: 'IN', condition: 'Cool Breeze', temp: 18, icon: 'cloud-sun', lat: 34.0837, lon: 74.7973 },

  // International Cities
  { name: 'London', state: 'England', country: 'United Kingdom', code: 'GB', condition: 'Drizzle', temp: 18, icon: 'drizzle', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', state: 'NY', country: 'United States', code: 'US', condition: 'Partly Cloudy', temp: 22, icon: 'cloud-sun', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', state: 'Kanto', country: 'Japan', code: 'JP', condition: 'Clear', temp: 26, icon: 'sun', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', code: 'AE', condition: 'Sunny & Hot', temp: 38, icon: 'sun', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', state: 'Central', country: 'Singapore', code: 'SG', condition: 'Thunderstorm', temp: 29, icon: 'thunder', lat: 1.3521, lon: 103.8198 },
  { name: 'Paris', state: 'Île-de-France', country: 'France', code: 'FR', condition: 'Cloudy', temp: 20, icon: 'cloud', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', state: 'NSW', country: 'Australia', code: 'AU', condition: 'Sunny', temp: 21, icon: 'sun', lat: -33.8688, lon: 151.2093 },
  { name: 'Toronto', state: 'Ontario', country: 'Canada', code: 'CA', condition: 'Mild', temp: 19, icon: 'cloud-sun', lat: 43.6532, lon: -79.3832 },
  { name: 'San Francisco', state: 'CA', country: 'United States', code: 'US', condition: 'Foggy', temp: 17, icon: 'cloud', lat: 37.7749, lon: -122.4194 },
  { name: 'Berlin', state: 'Berlin', country: 'Germany', code: 'DE', condition: 'Showers', temp: 19, icon: 'rain', lat: 52.5200, lon: 13.4050 },
  { name: 'Rome', state: 'Lazio', country: 'Italy', code: 'IT', condition: 'Sunny', temp: 27, icon: 'sun', lat: 41.9028, lon: 12.4964 },
  { name: 'Amsterdam', state: 'North Holland', country: 'Netherlands', code: 'NL', condition: 'Light Rain', temp: 17, icon: 'drizzle', lat: 52.3676, lon: 4.9041 },
  { name: 'Bangkok', state: 'Bangkok', country: 'Thailand', code: 'TH', condition: 'Scattered Storms', temp: 31, icon: 'thunder', lat: 13.7563, lon: 100.5018 },
  { name: 'Seoul', state: 'Seoul', country: 'South Korea', code: 'KR', condition: 'Clear', temp: 23, icon: 'sun', lat: 37.5665, lon: 126.9780 },
];

const POPULAR_CITIES = CITY_DATABASE.slice(0, 5);
const EXPANDED_CITIES = CITY_DATABASE;

export default function App() {
  // Navigation & View States
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeCity, setActiveCity] = useState('Hyderabad');
  const [cityInput, setCityInput] = useState('');
  const [forecastDays, setForecastDays] = useState(7);
  const [activeTab, setActiveTab] = useState('Summary');
  const [activeForecastDayIndex, setActiveForecastDayIndex] = useState(3);
  const [hoveredHour, setHoveredHour] = useState(null);
  const [viewMoreCities, setViewMoreCities] = useState(false);

  // Search Suggestions & History State
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestionIndex, setSearchSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(['Hyderabad', 'Mumbai', 'London', 'Tokyo', 'Delhi']);
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
    { name: 'Hyderabad', temp: 24, condition: 'Heavy Rain', country: 'IN', lat: 17.3850, lon: 78.4867 },
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

  // Current Weather State
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
    pressure: 1012,
    visibility: 8.5,
    dewPoint: 21,
    sunrise: '06:05 AM',
    sunset: '06:42 PM',
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
  const [errorMessage, setErrorMessage] = useState(null);

  // Map refs
  const mapContainerRef = useRef(null);
  const fullMapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const fullMapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const fullMarkerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const fullTileLayerRef = useRef(null);

  // Show quick toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert and format temperatures based on unit
  const formatTemp = (celsius) => {
    if (celsius === undefined || celsius === null) return '--';
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const tempSymbol = unit === 'F' ? '°F' : '°C';

  // Format wind speed based on windUnit
  const formatWind = (kmh) => {
    if (windUnit === 'mph') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  // Map Tile URLs
  const getTileUrl = (layerType) => {
    switch (layerType) {
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'streets':
      default:
        return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Setup Dashboard Mini Map
  useEffect(() => {
    if (activeNav !== 'dashboard' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([weather.lat, weather.lon], 9);

      const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

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
      tileLayerRef.current = tileLayer;
    } else {
      mapInstanceRef.current.invalidateSize();
      mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([weather.lat, weather.lon]);
        markerRef.current.setPopupContent(`<b style="color: #1e293b;">${weather.city}</b>`).openPopup();
      }
    }
  }, [weather.lat, weather.lon, weather.city, activeNav]);

  // Update Mini Map Tile Layer on style change
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [mapLayer]);

  // Setup Dedicated Full Weather Map view
  useEffect(() => {
    if (activeNav !== 'map' || !fullMapContainerRef.current) return;

    if (!fullMapInstanceRef.current) {
      const map = L.map(fullMapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([weather.lat, weather.lon], 9);

      const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Current City Marker
      const customIcon = L.divIcon({
        className: 'radar-pulse-wrapper',
        html: `<div class="radar-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([weather.lat, weather.lon], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<div style="color: #1e293b; text-align: center;"><b>${weather.city}</b><br/>${formatTemp(weather.temp)}${tempSymbol} • ${weather.condition}</div>`).openPopup();

      // Markers for Popular Cities
      POPULAR_CITIES.forEach((c) => {
        if (c.name.toLowerCase() !== weather.city.toLowerCase()) {
          const cityMarker = L.circleMarker([c.lat, c.lon], {
            radius: 8,
            fillColor: '#38bdf8',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85,
          }).addTo(map);

          cityMarker.bindPopup(`
            <div style="color: #0f172a; font-family: sans-serif; padding: 2px;">
              <b style="font-size: 13px;">${c.name}</b><br/>
              <span style="font-size: 11px; color: #475569;">${formatTemp(c.temp)}${tempSymbol} • ${c.condition}</span><br/>
              <button id="btn-switch-${c.name}" style="margin-top: 6px; background: #2563eb; color: #fff; border: none; border-radius: 4px; padding: 3px 8px; font-size: 10px; cursor: pointer;">
                Switch Location
              </button>
            </div>
          `);

          cityMarker.on('popupopen', () => {
            const btn = document.getElementById(`btn-switch-${c.name}`);
            if (btn) {
              btn.onclick = () => {
                handleSelectCity(c);
              };
            }
          });
        }
      });

      fullMapInstanceRef.current = map;
      fullMarkerRef.current = marker;
      fullTileLayerRef.current = tileLayer;
    } else {
      fullMapInstanceRef.current.invalidateSize();
      fullMapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
      if (fullMarkerRef.current) {
        fullMarkerRef.current.setLatLng([weather.lat, weather.lon]);
        fullMarkerRef.current.setPopupContent(`<div style="color: #1e293b; text-align: center;"><b>${weather.city}</b><br/>${formatTemp(weather.temp)}${tempSymbol} • ${weather.condition}</div>`).openPopup();
      }
    }
  }, [weather.lat, weather.lon, weather.city, activeNav, mapLayer, unit]);

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
        const timeStr = localNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12h' });

        const sunriseDate = new Date(data.sys.sunrise * 1000);
        const sunsetDate = new Date(data.sys.sunset * 1000);

        const newWeather = {
          city: data.name,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          aqi: Math.round(80 + Math.random() * 95),
          uv: Math.min(10, Math.max(1, Math.round(data.main.temp / 8))),
          pressure: data.main.pressure || 1012,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
          dewPoint: Math.round(data.main.temp - (100 - data.main.humidity) / 5),
          sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          lat: data.coord.lat,
          lon: data.coord.lon,
          timeString: timeStr,
        };

        setWeather(newWeather);
        setActiveCity(data.name);
        triggerToast(`Updated weather for ${data.name}`);

        // Fetch 5-day forecast
        try {
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName.trim())}&units=metric&appid=${API_KEY}`
          );
          if (forecastRes.ok) {
            const fData = await forecastRes.json();
            
            const hours = fData.list.slice(0, 10).map((item, idx) => {
              const d = new Date(item.dt * 1000);
              const timeLabel = idx === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: timeFormat === '12h' });
              return {
                time: timeLabel,
                temp: Math.round(item.main.temp),
                rain: Math.min(95, Math.max(15, Math.round((item.pop || 0.5) * 100))),
                isNextDay: idx > 3,
                icon: mapConditionToIconType(item.weather[0].main),
                wind: Math.round((item.wind?.speed || 2) * 3.6),
                humidity: item.main.humidity || 75
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

            if (parsedForecast.length >= 5) {
              setForecastList(parsedForecast);
            }
          }
        } catch (e) {
          console.warn('Forecast API error, using calculated forecast', e);
        }
      } else {
        // Match from mock cities
        const match = EXPANDED_CITIES.find(c => c.name.toLowerCase() === cityName.trim().toLowerCase());
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
            pressure: 1012,
            visibility: 9,
            dewPoint: match.temp - 3,
            sunrise: '06:05 AM',
            sunset: '06:42 PM',
            lat: match.lat,
            lon: match.lon,
            timeString: '6:25 PM',
          });
          setActiveCity(match.name);
          triggerToast(`Loaded data for ${match.name}`);
        } else {
          triggerToast(`City "${cityName}" not found`);
        }
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
      triggerToast('Unable to connect to weather service');
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

  // Add to recent search terms
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

  // Select city from suggestions, trending, or recent searches
  const handleSelectSuggestion = (cityOrName) => {
    const cityName = typeof cityOrName === 'string' ? cityOrName : cityOrName.name;
    setActiveCity(cityName);
    fetchCityWeather(cityName);
    addRecentSearch(cityName);
    setCityInput('');
    setSearchFocused(false);
    setSearchSuggestionIndex(-1);
  };

  // Search Submission
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
      setSearchFocused(false);
      setSearchSuggestionIndex(-1);
    }
  };

  // Filter suggestions from CITY_DATABASE matching name, state, country, or code
  const filteredSuggestions = cityInput.trim()
    ? CITY_DATABASE.filter((c) => {
        const q = cityInput.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.state && c.state.toLowerCase().includes(q)) ||
          c.country.toLowerCase().includes(q) ||
          c.code.toLowerCase() === q
        );
      }).slice(0, 8)
    : [];

  // Keyboard navigation for suggestions
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

  // City selection from Popular or Saved
  const handleSelectCity = (city) => {
    setActiveCity(city.name);
    fetchCityWeather(city.name);
    addRecentSearch(city.name);
  };

  // GPS Locate Me with feedback
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
      (error) => {
        setLocating(false);
        triggerToast('Location permission denied or unavailable');
      },
      { timeout: 8000 }
    );
  };

  // Add / Remove Favorite Cities
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

  // Notification management
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    triggerToast('Notifications cleared');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Render 3D-styled weather icon
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

  // Radar frames label mapping
  const radarTimelineLabels = ['-2 Hours', '-1 Hour', 'Live Radar', '+1 Hour Proj', '+2 Hours Proj'];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8 overflow-hidden bg-gradient-to-b from-[#195bb0] via-[#246bbd] to-[#124b94]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-[#0f223f]/95 border border-sky-400/40 text-sky-100 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      {/* Floating Background Clouds */}
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

      <div className="absolute -top-6 left-[38%] pointer-events-none select-none opacity-85 z-0 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
        <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
          <ellipse cx="80" cy="85" rx="60" ry="38" fill="url(#cloudGrad1)" />
          <ellipse cx="130" cy="70" rx="50" ry="42" fill="url(#cloudGrad2)" />
          <ellipse cx="165" cy="90" rx="42" ry="30" fill="url(#cloudGrad1)" />
        </svg>
      </div>

      <div className="absolute -top-8 -right-8 pointer-events-none select-none opacity-90 z-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] animate-[pulse_10s_ease-in-out_infinite]">
        <svg width="260" height="170" viewBox="0 0 260 170" fill="none">
          <ellipse cx="170" cy="100" rx="70" ry="42" fill="url(#cloudGrad1)" />
          <ellipse cx="110" cy="80" rx="60" ry="50" fill="url(#cloudGrad2)" />
          <ellipse cx="70" cy="105" rx="50" ry="35" fill="url(#cloudGrad1)" />
        </svg>
      </div>

      {/* Main Glass Container */}
      <div className="relative z-10 w-full max-w-[1240px] bg-[#12233c]/85 backdrop-blur-2xl border border-white/10 rounded-[28px] md:rounded-[34px] shadow-[0_25px_80px_rgba(3,14,38,0.65)] overflow-hidden flex flex-col md:flex-row min-h-[640px]">

        {/* LEFT ICON NAVIGATION RAIL */}
        <aside className="w-full md:w-[72px] lg:w-[76px] bg-[#0c1a2e]/60 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-between py-4 md:py-7 px-4 md:px-0 select-none">
          
          <div className="flex flex-col items-center gap-6">
            {/* Logo Button */}
            <button
              onClick={() => setActiveNav('dashboard')}
              title="Aether Weather"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-blue-200 flex items-center justify-center shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-transform"
            >
              <svg className="w-6 h-6 text-[#10233f]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 3h12a1 1 0 0 1 1 1v2a6 6 0 0 1-4 5.659V12a6 6 0 0 1 4 5.659V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.341A6 6 0 0 1 9 12v-.341A6 6 0 0 1 5 6V4a1 1 0 0 1 1-1z" />
              </svg>
            </button>

            {/* Nav Action Buttons */}
            <div className="flex md:flex-col items-center gap-3 md:gap-5 mt-1">
              <button
                onClick={() => setActiveNav('dashboard')}
                className={`p-2.5 rounded-xl transition-all ${
                  activeNav === 'dashboard'
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-400/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Dashboard Overview"
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
                title="Full Weather Map"
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
                title="Doppler Rain Radar"
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
                title="Saved Locations"
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
                title="Preferences & Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-slate-400 hover:text-red-300 p-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
            title="Reset / Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-5 md:p-7 flex flex-col gap-6 overflow-y-auto relative">

          {/* TOP HEADER */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-30">
            {/* Search Input with Auto-Suggestions & History */}
            <div ref={searchContainerRef} className="w-full sm:max-w-md relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={cityInput}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    setSearchFocused(true);
                    setSearchSuggestionIndex(-1);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search city (e.g. Mumbai, Tokyo, London)..."
                  className="w-full pl-11 pr-10 py-2.5 bg-[#172b49]/70 border border-white/10 rounded-xl text-sm placeholder-slate-400 text-white focus:outline-none focus:border-blue-400/60 focus:bg-[#1a3254]/90 transition shadow-inner"
                />
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                {cityInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setCityInput('');
                      setSearchSuggestionIndex(-1);
                    }}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Suggestions Dropdown */}
              {searchFocused && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0f213a]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden text-xs divide-y divide-white/5 animate-fade-in">
                  {cityInput.trim().length > 0 ? (
                    // Matching Suggestions when typing
                    <div className="p-2">
                      <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between">
                        <span>Matching Cities</span>
                        <span>{filteredSuggestions.length} found</span>
                      </div>

                      {filteredSuggestions.length > 0 ? (
                        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
                          {filteredSuggestions.map((city, idx) => {
                            const isHighlighted = searchSuggestionIndex === idx;
                            return (
                              <button
                                key={city.name + city.country}
                                type="button"
                                onClick={() => handleSelectSuggestion(city)}
                                onMouseEnter={() => setSearchSuggestionIndex(idx)}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                  isHighlighted
                                    ? 'bg-blue-600/35 border border-blue-400/40 text-white'
                                    : 'hover:bg-white/5 border border-transparent text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="p-1 rounded-lg bg-white/5 text-sky-300">
                                    <MapPin className="w-3.5 h-3.5" />
                                  </span>
                                  <div>
                                    <span className="font-semibold text-white">{city.name}</span>
                                    <span className="text-[11px] text-slate-400 ml-1.5">
                                      {city.state ? `${city.state}, ` : ''}{city.country}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-sky-200 font-mono font-bold">
                                    {city.code}
                                  </span>
                                  <span className="text-xs font-bold text-white">
                                    {formatTemp(city.temp)}{tempSymbol}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-4 px-3 text-center">
                          <p className="text-xs text-slate-300">
                            No predefined match for "<span className="text-sky-300">{cityInput}</span>"
                          </p>
                          <button
                            type="button"
                            onClick={() => handleSearchSubmit()}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
                          >
                            <Search className="w-3 h-3" />
                            <span>Search global weather for "{cityInput}"</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Default State: Recent Searches + Popular/Trending Cities
                    <div className="p-3 flex flex-col gap-3">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                            <span className="flex items-center gap-1.5">
                              <History className="w-3.5 h-3.5 text-sky-400" />
                              Recent Searches
                            </span>
                            <button
                              type="button"
                              onClick={clearRecentSearches}
                              className="text-[10px] text-slate-400 hover:text-red-300 transition"
                            >
                              Clear All
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {recentSearches.map((term) => (
                              <div
                                key={term}
                                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs text-slate-200 transition group"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectSuggestion(term)}
                                  className="hover:text-sky-300 text-left"
                                >
                                  {term}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeRecentSearch(term);
                                  }}
                                  className="text-slate-400 hover:text-red-300 p-0.5 ml-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending & Popular Cities */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                          <span>Popular Indian & Global Hubs</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {['Hyderabad', 'Delhi', 'Mumbai', 'Bengaluru', 'London', 'Tokyo', 'New York', 'Dubai'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => handleSelectSuggestion(c)}
                              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/5 hover:border-blue-400/30 text-left text-xs font-medium text-slate-200 hover:text-white transition flex items-center justify-between"
                            >
                              <span>{c}</span>
                              <ChevronRight className="w-3 h-3 text-slate-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3.5 self-end sm:self-auto relative">
              
              {/* Unit Quick Toggle Button (°C / °F) */}
              <button
                onClick={() => {
                  const nextUnit = unit === 'C' ? 'F' : 'C';
                  setUnit(nextUnit);
                  triggerToast(`Switched to °${nextUnit}`);
                }}
                title="Toggle Temperature Unit"
                className="px-3 py-2 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-xs font-bold text-sky-200 transition flex items-center gap-1 shadow-md"
              >
                <span>°{unit}</span>
                <span className="text-[10px] text-slate-400 font-normal">switch</span>
              </button>

              {/* GPS Locate Me Button */}
              <button
                onClick={handleLocateMe}
                disabled={locating}
                title="Detect GPS Current Location"
                className={`p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition ${
                  locating ? 'animate-spin text-sky-400' : ''
                }`}
              >
                <Crosshair className="w-4 h-4" />
              </button>

              {/* Notification Bell Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="Weather Alerts"
                  className="relative p-2.5 bg-[#172b49]/70 hover:bg-[#203a62] border border-white/10 rounded-xl text-slate-300 hover:text-white transition"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#12233c]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-[#101e33] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-50">
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Weather Alerts</span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center">No active alerts right now.</p>
                    ) : (
                      <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border transition ${
                              n.unread
                                ? 'bg-sky-500/10 border-sky-400/30'
                                : 'bg-white/5 border-white/5 opacity-70'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-sky-200">{n.title}</span>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px]">
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sky-300 hover:text-sky-100 font-medium"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-red-300 hover:text-red-200 font-medium"
                      >
                        Clear alerts
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Button */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileModal(!showProfileModal)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-md hover:ring-2 hover:ring-blue-400/50 transition cursor-pointer"
                  title="Profile & Preferences"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Popup */}
                {showProfileModal && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#101e33] border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-50">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Amit Lal</h4>
                        <p className="text-[11px] text-slate-400">Personal Station</p>
                      </div>
                    </div>

                    <div className="py-2.5 flex flex-col gap-1.5 text-xs">
                      <button
                        onClick={() => {
                          setActiveNav('locations');
                          setShowProfileModal(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200"
                      >
                        <span>Saved Locations</span>
                        <span className="text-[10px] bg-blue-500/30 px-2 py-0.5 rounded-full text-blue-200">
                          {favorites.length}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveNav('settings');
                          setShowProfileModal(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-slate-200"
                      >
                        <span>Preferences</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full mt-2 pt-2 border-t border-white/10 text-left text-xs text-red-300 hover:text-red-200 p-2 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* ================= CONDITIONALLY RENDER ACTIVE VIEW ================= */}

          {/* 1. DASHBOARD VIEW */}
          {activeNav === 'dashboard' && (
            <>
              {/* TOP SECTION: 3 GRID CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* CARD 1: CURRENT WEATHER HERO */}
                <div className="lg:col-span-4 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
                  
                  {/* Card Header & Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-white tracking-wide">
                        Current Weather
                      </h2>
                      <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                        {weather.city}, {weather.country} • {weather.timeString}
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
                        onClick={() => fetchCityWeather(weather.city)}
                        title="Refresh live data"
                        disabled={loading}
                        className={`p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 hover:text-white transition ${
                          loading ? 'animate-spin' : ''
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
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

                {/* CARD 2: INTERACTIVE MINI MAP */}
                <div className="lg:col-span-5 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-2.5 shadow-lg relative min-h-[220px] flex flex-col overflow-hidden">
                  <div className="w-full h-full min-h-[200px] rounded-xl overflow-hidden relative">
                    <div ref={mapContainerRef} className="w-full h-full min-h-[200px]" />

                    {/* Floating Map Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-[400]">
                      
                      {/* Zoom In */}
                      <button
                        onClick={() => {
                          if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
                        }}
                        title="Zoom In"
                        className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>

                      {/* Zoom Out */}
                      <button
                        onClick={() => {
                          if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
                        }}
                        title="Zoom Out"
                        className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>

                      {/* Center on City */}
                      <button
                        onClick={() => {
                          if (mapInstanceRef.current) {
                            mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
                          }
                        }}
                        title="Center on City"
                        className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>

                      {/* Map Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setShowMapMenu(!showMapMenu)}
                          title="Map Layer Options"
                          className="p-1.5 bg-[#142848]/85 hover:bg-[#1a345e] border border-white/20 text-white rounded-lg shadow-md backdrop-blur-sm transition"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {showMapMenu && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#0f213b] border border-white/20 rounded-xl p-2 shadow-2xl backdrop-blur-xl z-[500] text-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                              Map Style
                            </span>
                            <button
                              onClick={() => {
                                setMapLayer('dark');
                                setShowMapMenu(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg mb-1 flex items-center justify-between ${
                                mapLayer === 'dark' ? 'bg-blue-600/30 text-blue-200' : 'text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span>Dark Matter</span>
                              {mapLayer === 'dark' && <Check className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => {
                                setMapLayer('streets');
                                setShowMapMenu(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg mb-1 flex items-center justify-between ${
                                mapLayer === 'streets' ? 'bg-blue-600/30 text-blue-200' : 'text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span>Street View</span>
                              {mapLayer === 'streets' && <Check className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => {
                                setMapLayer('satellite');
                                setShowMapMenu(false);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg mb-2 flex items-center justify-between ${
                                mapLayer === 'satellite' ? 'bg-blue-600/30 text-blue-200' : 'text-slate-300 hover:bg-white/5'
                              }`}
                            >
                              <span>Satellite</span>
                              {mapLayer === 'satellite' && <Check className="w-3 h-3" />}
                            </button>

                            <button
                              onClick={() => {
                                setShowMapMenu(false);
                                setActiveNav('map');
                              }}
                              className="w-full text-left px-2 py-1.5 pt-2 border-t border-white/10 text-sky-300 hover:text-sky-100 font-semibold flex items-center gap-1.5"
                            >
                              <MapIcon className="w-3 h-3" />
                              <span>Open Full Map</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* City Badge Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 z-[400] bg-[#142848]/85 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-md text-[11px] font-medium text-white flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>{weather.city}, {weather.country}</span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: POPULAR CITIES */}
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
                    {(viewMoreCities ? EXPANDED_CITIES : POPULAR_CITIES).map((city) => {
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
                              {renderWeatherIcon(city.icon, 'w-4 h-4')}
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

              </div>

              {/* BOTTOM SECTION: FORECAST (LEFT) + SUMMARY/HOURLY TABS (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* CARD 4: FORECAST 7/10 DAYS */}
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
                              {renderWeatherIcon(item.icon, 'w-4 h-4')}
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

                {/* CARD 5: SUMMARY & HOURLY PRECIPITATION / DETAILS TABS */}
                <div className="lg:col-span-8 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
                  
                  {/* Subtle rainfall pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Segmented Tabs */}
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <h2 className="text-sm font-semibold text-white tracking-wide">
                      {activeTab === 'Summary' ? 'Summary & Precipitation' : activeTab === 'Hourly' ? 'Hourly Forecast' : 'Meteorological Metrics'}
                    </h2>
                    <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-[11px]">
                      {['Summary', 'Hourly', 'More Details'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 rounded-md transition-all font-medium ${
                            activeTab === tab
                              ? 'bg-blue-600/40 text-white font-semibold shadow-inner'
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
                            {renderWeatherIcon(d.icon, 'w-3.5 h-3.5')}
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
                          className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-between gap-1.5 hover:border-blue-400/40 transition"
                        >
                          <span className="text-xs font-semibold text-slate-300">{item.time}</span>
                          <div className="my-1">{renderWeatherIcon(item.icon, 'w-6 h-6')}</div>
                          <span className="text-base font-bold text-white">
                            {formatTemp(item.temp)}{tempSymbol}
                          </span>
                          <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-blue-400 h-full rounded-full"
                              style={{ width: `${item.rain}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-sky-300">{item.rain}% Rain</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: MORE DETAILS / METRICS */}
                  {activeTab === 'More Details' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 py-2 z-10">
                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
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

                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Eye className="w-4 h-4 text-sky-400" />
                          <span>Visibility</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">{weather.visibility} km</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Clear visibility across city</p>
                        </div>
                      </div>

                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Sliders className="w-4 h-4 text-emerald-400" />
                          <span>Air Pressure</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">{weather.pressure} hPa</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Normal atmospheric levels</p>
                        </div>
                      </div>

                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Droplets className="w-4 h-4 text-cyan-400" />
                          <span>Dew Point</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">{formatTemp(weather.dewPoint)}{tempSymbol}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">High condensation expected</p>
                        </div>
                      </div>

                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Wind className="w-4 h-4 text-blue-400" />
                          <span>Wind & Gusts</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">{formatWind(weather.windSpeed)}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Direction: West-Northwest</p>
                        </div>
                      </div>

                      <div className="bg-[#12233c]/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Sun className="w-4 h-4 text-yellow-400" />
                          <span>UV Level</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-white">{weather.uv} / 10</span>
                          <p className="text-[10px] text-emerald-400 mt-0.5">Moderate exposure risk</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </>
          )}

          {/* 2. FULL WEATHER MAP VIEW */}
          {activeNav === 'map' && (
            <div className="flex flex-col gap-4 flex-1 h-full min-h-[480px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-sky-400" />
                    Interactive Weather Map
                  </h2>
                  <p className="text-xs text-slate-400">Pan, zoom, and select cities across the globe</p>
                </div>

                {/* Map Control Buttons */}
                <div className="flex items-center gap-2 bg-[#12233c] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setMapLayer('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      mapLayer === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setMapLayer('streets')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      mapLayer === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Streets
                  </button>
                  <button
                    onClick={() => setMapLayer('satellite')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Full Map Canvas */}
              <div className="w-full flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                <div ref={fullMapContainerRef} className="w-full h-full min-h-[420px]" />

                {/* Floating Map Zoom Tools */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                  <button
                    onClick={() => {
                      if (fullMapInstanceRef.current) fullMapInstanceRef.current.zoomIn();
                    }}
                    title="Zoom In"
                    className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (fullMapInstanceRef.current) fullMapInstanceRef.current.zoomOut();
                    }}
                    title="Zoom Out"
                    className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (fullMapInstanceRef.current) {
                        fullMapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
                      }
                    }}
                    title="Center Active City"
                    className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-sky-300 rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>

                {/* Legend at bottom */}
                <div className="absolute bottom-4 left-4 z-[400] bg-[#101e33]/90 border border-white/20 px-3.5 py-2 rounded-xl backdrop-blur-md text-xs text-white shadow-xl flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>Active: {weather.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span>Key Cities</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. DOPPLER RADAR VIEW */}
          {activeNav === 'radar' && (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-sky-400" />
                    Precipitation & Doppler Radar
                  </h2>
                  <p className="text-xs text-slate-400">Live storm cloud tracking and radar sweep simulation</p>
                </div>

                {/* Radar Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRadarPlaying(!radarPlaying)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      radarPlaying
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    {radarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{radarPlaying ? 'Pause Radar' : 'Play Simulation'}</span>
                  </button>

                  <button
                    onClick={() => setRadarSpeed(radarSpeed === 1 ? 2 : 1)}
                    className="px-2.5 py-1.5 bg-[#12233c] hover:bg-[#1a345e] border border-white/10 rounded-xl text-xs font-bold text-sky-200 transition"
                  >
                    {radarSpeed}x Speed
                  </button>
                </div>
              </div>

              {/* Radar Display Visual */}
              <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-white/10 bg-[#0b1728] flex items-center justify-center shadow-2xl">
                {/* Radar Circles */}
                <div className="absolute w-[300px] h-[300px] rounded-full border border-sky-500/20" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-sky-500/25" />
                <div className="absolute w-[100px] h-[100px] rounded-full border border-sky-500/30" />
                <div className="absolute w-full h-[1px] bg-sky-500/20" />
                <div className="absolute h-full w-[1px] bg-sky-500/20" />

                {/* Rotating Radar Sweep Needle */}
                <div className="absolute w-[320px] h-[320px] rounded-full animate-[spin_4s_linear_infinite] pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/40 via-blue-500/10 to-transparent rounded-tl-full origin-bottom-right" />
                </div>

                {/* Simulated Storm Cells based on frame */}
                <div
                  className="absolute w-32 h-32 rounded-full bg-emerald-500/30 blur-xl transition-all duration-700"
                  style={{
                    transform: `translate(${radarFrame * 20 - 40}px, ${radarFrame * 10 - 20}px)`,
                  }}
                />
                <div
                  className="absolute w-20 h-20 rounded-full bg-amber-500/40 blur-lg transition-all duration-700"
                  style={{
                    transform: `translate(${radarFrame * 15 - 20}px, ${radarFrame * 8 - 10}px)`,
                  }}
                />
                <div
                  className="absolute w-10 h-10 rounded-full bg-red-500/50 blur-md transition-all duration-700"
                  style={{
                    transform: `translate(${radarFrame * 12 - 10}px, ${radarFrame * 6}px)`,
                  }}
                />

                {/* Center Station Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-400/30 animate-pulse" />
                  <span className="text-xs font-bold text-white mt-1.5 drop-shadow">{weather.city}</span>
                </div>

                {/* Timestamp watermark */}
                <div className="absolute top-4 left-4 bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-sky-200">
                  Frame: <b className="text-white">{radarTimelineLabels[radarFrame]}</b>
                </div>

                {/* Color Legend */}
                <div className="absolute bottom-4 right-4 bg-black/60 border border-white/10 p-2 rounded-xl text-[10px] flex flex-col gap-1 text-slate-200">
                  <span className="font-bold text-slate-400">Precipitation Rate</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-emerald-400 rounded-sm" /> <span>Light (1-5 mm)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-amber-400 rounded-sm" /> <span>Moderate (5-15 mm)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-red-500 rounded-sm" /> <span>Severe (15+ mm)</span>
                  </div>
                </div>
              </div>

              {/* Radar Timeline Slider */}
              <div className="bg-[#182c4b]/80 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-slate-300 font-semibold">
                  <span>Timeline Playback</span>
                  <span className="text-sky-300">{radarTimelineLabels[radarFrame]}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {radarTimelineLabels.map((lbl, idx) => (
                    <button
                      key={lbl}
                      onClick={() => setRadarFrame(idx)}
                      className={`py-2 rounded-lg text-xs font-semibold transition ${
                        radarFrame === idx
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. SAVED LOCATIONS VIEW */}
          {activeNav === 'locations' && (
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-400" />
                    Saved & Favorite Locations
                  </h2>
                  <p className="text-xs text-slate-400">Manage your pinned cities for quick monitoring</p>
                </div>

                {/* Add new place form */}
                <form onSubmit={handleAddFavoriteCustom} className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newFavoriteInput}
                    onChange={(e) => setNewFavoriteInput(e.target.value)}
                    placeholder="Add city name..."
                    className="px-3 py-1.5 bg-[#172b49] border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Grid of Saved Cities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((fav) => {
                  const isActive = fav.name.toLowerCase() === weather.city.toLowerCase();
                  return (
                    <div
                      key={fav.name}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-400/50 shadow-lg'
                          : 'bg-[#182c4b]/80 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">{fav.name}</h3>
                          <span className="text-xs text-slate-400">{fav.country || 'Global'}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(fav.name)}
                          title="Remove Location"
                          className="text-slate-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-white/5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="my-4 flex items-center justify-between">
                        <span className="text-3xl font-extrabold text-white">
                          {formatTemp(fav.temp)}{tempSymbol}
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                          {fav.condition}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectCity(fav);
                          setActiveNav('dashboard');
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-blue-600 text-white cursor-default'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isActive ? 'Current Active City' : 'Set as Current City'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. SETTINGS & PREFERENCES VIEW */}
          {activeNav === 'settings' && (
            <div className="flex flex-col gap-5 flex-1 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-sky-400" />
                  Preferences & Units
                </h2>
                <p className="text-xs text-slate-400">Customize how temperatures, wind, and time formats are displayed</p>
              </div>

              <div className="bg-[#182c4b]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                {/* Temperature Unit */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Temperature Unit</h4>
                    <p className="text-xs text-slate-400">Choose between Celsius and Fahrenheit</p>
                  </div>
                  <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
                    <button
                      onClick={() => setUnit('C')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        unit === 'C' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => setUnit('F')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        unit === 'F' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                {/* Wind Unit */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Wind Speed Unit</h4>
                    <p className="text-xs text-slate-400">Kilometers per hour or Miles per hour</p>
                  </div>
                  <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
                    <button
                      onClick={() => setWindUnit('km/h')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        windUnit === 'km/h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      km/h
                    </button>
                    <button
                      onClick={() => setWindUnit('mph')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        windUnit === 'mph' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      mph
                    </button>
                  </div>
                </div>

                {/* Time Format */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Time Display</h4>
                    <p className="text-xs text-slate-400">12-hour AM/PM or 24-hour military clock</p>
                  </div>
                  <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
                    <button
                      onClick={() => setTimeFormat('12h')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        timeFormat === '12h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      12 Hour
                    </button>
                    <button
                      onClick={() => setTimeFormat('24h')}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        timeFormat === '24h' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      24 Hour
                    </button>
                  </div>
                </div>

                {/* Default Map Layer */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Default Map Style</h4>
                    <p className="text-xs text-slate-400">Choose preferred tile provider</p>
                  </div>
                  <div className="bg-[#12233c] p-0.5 rounded-lg border border-white/10 flex items-center text-xs">
                    {['dark', 'streets', 'satellite'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMapLayer(m)}
                        className={`px-3 py-1.5 rounded-md font-semibold capitalize transition ${
                          mapLayer === m ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Defaults Button */}
              <button
                onClick={() => {
                  setUnit('C');
                  setWindUnit('km/h');
                  setTimeFormat('12h');
                  setMapLayer('dark');
                  triggerToast('Preferences reset to default values');
                }}
                className="self-start px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Reset All to Defaults
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Logout / Session Reset Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101f35] border border-white/20 rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-scale-up">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <LogOut className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Reset Session or Sign Out?</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              This will reset your currently active location and restore default preferences.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  setActiveCity('Hyderabad');
                  fetchCityWeather('Hyderabad');
                  setActiveNav('dashboard');
                  setUnit('C');
                  triggerToast('Session reset to Hyderabad');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg transition"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}