import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  MoreVertical,
  Check,
  Map as MapIcon,
} from 'lucide-react';
import { getTileUrl } from '../constants/cities';

export default function MiniMapCard({
  weather,
  showMapMenu,
  setShowMapMenu,
  mapLayer,
  setMapLayer,
  setActiveNav,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Initialize and mount Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safety cleanup in case of previous container binding
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
    marker.bindPopup(`<b style="color: #f8fafc; font-size: 13px;">${weather.city}</b>`).openPopup();

    mapInstanceRef.current = map;
    markerRef.current = marker;
    tileLayerRef.current = tileLayer;

    // Invalidate size to ensure tiles fill the container completely
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

  // Update position and marker when active city coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && weather.lat && weather.lon) {
      mapInstanceRef.current.setView([weather.lat, weather.lon], 9, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng([weather.lat, weather.lon]);
        markerRef.current.setPopupContent(`<b style="color: #f8fafc; font-size: 13px;">${weather.city}</b>`).openPopup();
      }
    }
  }, [weather.lat, weather.lon, weather.city]);

  // Update tile layer when style is toggled (dark / streets / satellite)
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
    <div className="lg:col-span-5 bg-[#182c4b]/80 border border-white/10 rounded-2xl p-2.5 shadow-lg relative min-h-[220px] flex flex-col overflow-hidden">
      <div className="w-full h-full min-h-[200px] rounded-xl overflow-hidden relative">
        <div
          ref={mapContainerRef}
          className={`w-full h-full min-h-[200px] transition-all ${mapLayer === 'dark' ? 'pitch-dark-map' : ''}`}
        />

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
  );
}
