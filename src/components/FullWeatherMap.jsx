import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  Crosshair,
} from 'lucide-react';
import { getTileUrl } from '../constants/cities';

export default function FullWeatherMap({
  weather,
  popularCities = [],
  mapLayer,
  setMapLayer,
  formatTemp,
  tempSymbol,
  handleSelectCity,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Initialize and mount Full Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([weather.lat || 17.3850, weather.lon || 78.4867], 9);

    const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'radar-pulse-wrapper',
      html: `<div class="radar-pulse"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker([weather.lat || 17.3850, weather.lon || 78.4867], { icon: customIcon }).addTo(map);
    marker.bindPopup(
      `<div style="color: #f8fafc; text-align: center; font-family: sans-serif;"><b>${weather.city}</b><br/><span style="color: #94a3b8; font-size: 11px;">${formatTemp(weather.temp)}${tempSymbol} • ${weather.condition}</span></div>`
    ).openPopup();

    // Key City Markers
    (popularCities || []).slice(0, 15).forEach((c) => {
      if (c.lat && c.lon && c.name && c.name.toLowerCase() !== (weather.city || '').toLowerCase()) {
        const cityMarker = L.circleMarker([c.lat, c.lon], {
          radius: 7,
          fillColor: '#38bdf8',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        cityMarker.bindPopup(`
          <div style="color: #f8fafc; font-family: sans-serif; padding: 2px;">
            <b style="font-size: 13px;">${c.name}</b><br/>
            <span style="font-size: 11px; color: #94a3b8;">${formatTemp(c.temp)}${tempSymbol} • ${c.condition}</span><br/>
            <button id="btn-switch-${c.name}" style="margin-top: 6px; background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; cursor: pointer; font-weight: 600;">
              Switch Location
            </button>
          </div>
        `);

        cityMarker.on('popupopen', () => {
          const btn = document.getElementById(`btn-switch-${c.name}`);
          if (btn && handleSelectCity) {
            btn.onclick = () => {
              handleSelectCity(c);
            };
          }
        });
      }
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    tileLayerRef.current = tileLayer;

    const t1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    const t2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Update active marker & view on city change
  useEffect(() => {
    if (mapInstanceRef.current && weather.lat && weather.lon) {
      mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([weather.lat, weather.lon]);
        markerRef.current.setPopupContent(
          `<div style="color: #1e293b; text-align: center;"><b>${weather.city}</b><br/>${formatTemp(weather.temp)}${tempSymbol} • ${weather.condition}</div>`
        ).openPopup();
      }
    }
  }, [weather.lat, weather.lon, weather.city]);

  // Update tile layer on layer style switch
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [mapLayer]);

  return (
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
        <div
          ref={mapContainerRef}
          className={`w-full h-full min-h-[420px] transition-all ${mapLayer === 'dark' ? 'pitch-dark-map' : ''}`}
        />

        {/* Floating Map Zoom Tools */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
            }}
            title="Zoom In"
            className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
            }}
            title="Zoom Out"
            className="p-2 bg-[#101e33]/90 hover:bg-[#182e4e] text-white rounded-xl shadow-lg border border-white/20 backdrop-blur-md"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
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
            <span>Active: {weather.city} ({formatTemp(weather.temp)}{tempSymbol})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Key Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
