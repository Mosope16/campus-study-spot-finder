'use client';

import React, { useEffect, useRef } from 'react';
import { StudySpot } from '@/lib/types';
import { NOISE_LEVEL_META, BUSYNESS_META } from '@/lib/constants';

interface CampusMapProps {
  spots: StudySpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spot: StudySpot) => void;
  center?: [number, number];
  zoom?: number;
}

export default function CampusMap({
  spots,
  selectedSpotId,
  onSelectSpot,
  center = [37.8724, -122.2585],
  zoom = 15
}: CampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isMounted = true;

    // Dynamically load Leaflet on the client to avoid SSR issues
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false
      });

      // OpenStreetMap Humanitarian tiles — 100% free, zero watermark, zero API key required
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Re-position zoom controls to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      // Populate markers
      renderMarkers(L, map, spots, selectedSpotId);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when spots or selectedSpotId change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      renderMarkers(L, mapInstanceRef.current, spots, selectedSpotId);
    });
  }, [spots, selectedSpotId]);

  // Pan to selected spot if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSpotId) return;
    const selected = spots.find((s) => s.id === selectedSpotId);
    if (selected) {
      mapInstanceRef.current.flyTo([selected.lat, selected.lng], 17, {
        duration: 0.8,
        easeLinearity: 0.25
      });
      // Open popup if marker exists
      if (markersRef.current[selectedSpotId]) {
        markersRef.current[selectedSpotId].openPopup();
      }
    }
  }, [selectedSpotId]);

  const renderMarkers = (L: any, map: any, spotList: StudySpot[], activeId: string | null) => {
    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    spotList.forEach((spot) => {
      const isSelected = spot.id === activeId;
      const noiseMeta = NOISE_LEVEL_META[spot.noise_level];
      const busynessMeta = BUSYNESS_META[spot.busyness];

      // Custom HTML Pin icon
      const pinHtml = `
        <div class="custom-pin-container group" style="transform: ${isSelected ? 'scale(1.2) translateY(-4px)' : 'scale(1)'}">
          <div class="pulse-ring" style="background-color: ${busynessMeta.color};"></div>
          <div class="custom-pin-bubble" style="background-color: #0f172a; border-color: ${isSelected ? '#38bdf8' : busynessMeta.color};">
            <span style="display:inline-block; width:8px; height:8px; border-radius:9999px; background-color:${busynessMeta.color}"></span>
            <span style="color: #f8fafc; font-size: 11px; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis;">
              ${spot.building}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-leaflet-marker',
        iconSize: [120, 32],
        iconAnchor: [60, 16],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="width: 220px; font-family: system-ui, sans-serif; overflow: hidden; border-radius: 10px;">
          <div style="height: 90px; background-image: url('${spot.images[0]}'); background-size: cover; background-position: center; position: relative;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent);"></div>
            <div style="position: absolute; bottom: 8px; left: 10px; right: 10px; color: white;">
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #38bdf8;">${spot.building}</div>
              <div style="font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${spot.name}</div>
            </div>
          </div>
          <div style="padding: 10px 12px; background: #0f172a; color: #cbd5e1; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Vibe: <strong style="color: white;">${noiseMeta.label}</strong></span>
              <span style="color: ${busynessMeta.color}; font-weight: 700;">● ${busynessMeta.label}</span>
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">
              📍 ${spot.floor}
            </div>
            <button id="btn-view-${spot.id}" style="width: 100%; background: #2563eb; color: white; border: none; padding: 6px; border-radius: 6px; font-weight: 600; font-size: 11px; cursor: pointer;">
              Open Spot Profile
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${spot.id}`);
        if (btn) {
          btn.onclick = () => onSelectSpot(spot);
        }
      });

      marker.on('click', () => {
        onSelectSpot(spot);
      });

      markersRef.current[spot.id] = marker;
    });
  };

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-card bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Floating Legend */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-3 py-2 rounded-xl shadow-lg flex items-center gap-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Live Crowd:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-400">Empty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-400">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-600 dark:text-slate-400">Packed</span>
        </div>
      </div>
    </div>
  );
}
