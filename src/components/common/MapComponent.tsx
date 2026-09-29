import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, EmergencyService } from '../../types';
import { AlertTriangle, Hospital, Flame, Shield, Home, MapPin, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';

interface MapComponentProps {
  incidents?: Incident[];
  services?: EmergencyService[];
  selectedLocation?: { lat: number; lng: number };
  onSelectLocation?: (coords: { lat: number; lng: number }) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
  interactive?: boolean;
  highlightIncidentId?: string;
  showFilters?: boolean;
  showCitySwitcher?: boolean;
}

const INDIAN_CITIES = [
  { name: 'SRM KTR / Chengalpattu', coords: [12.8230, 80.0450] as [number, number], label: '📍 SRM KTR' },
  { name: 'Chennai Central', coords: [13.0827, 80.2707] as [number, number], label: '🌊 Chennai' },
  { name: 'Tambaram', coords: [12.9249, 80.1465] as [number, number], label: '🚉 Tambaram' },
  { name: 'New Delhi', coords: [28.6139, 77.2090] as [number, number], label: '🏛️ Delhi' },
  { name: 'Mumbai', coords: [19.0760, 72.8777] as [number, number], label: '🏙️ Mumbai' },
  { name: 'Bengaluru', coords: [12.9716, 77.5946] as [number, number], label: '🌳 Bengaluru' },
];

export const MapComponent: React.FC<MapComponentProps> = ({
  incidents = [],
  services = [],
  selectedLocation,
  onSelectLocation,
  height = '460px',
  zoom = 13,
  center = [12.8230, 80.0450], // Default center: SRM KTR Campus, Chengalpattu, Chennai
  interactive = true,
  highlightIncidentId,
  showFilters = true,
  showCitySwitcher = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>('SRM KTR');
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    hospitals: true,
    shelters: true,
    firePolice: true,
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
      });

      // Official OpenStreetMap tile layer (100% Free & Open, No API key required)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click for coordinate selection
      if (onSelectLocation) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onSelectLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center if props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update Selection Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectionMarkerRef.current) {
      selectionMarkerRef.current.remove();
      selectionMarkerRef.current = null;
    }

    if (selectedLocation) {
      const pinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75"></span>
            <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold text-xs">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: pinIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<div class="p-2 text-slate-800 text-xs font-semibold">
            <b>Selected Incident Location</b><br/>
            Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}
          </div>`
        );

      selectionMarkerRef.current = marker;
      mapInstanceRef.current.panTo([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  // Re-render markers whenever data or layer toggles change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Incidents markers
    if (activeLayers.incidents) {
      incidents.forEach(inc => {
        const isHighlighted = highlightIncidentId === inc.id;
        const colorClass =
          inc.severity === 'Critical'
            ? 'bg-red-600 border-red-300'
            : inc.severity === 'High'
            ? 'bg-amber-600 border-amber-300'
            : inc.severity === 'Medium'
            ? 'bg-yellow-500 border-yellow-200'
            : 'bg-blue-500 border-blue-200';

        const incidentIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div class="relative cursor-pointer group">
              ${inc.severity === 'Critical' ? '<span class="animate-ping absolute -top-1 -left-1 inline-flex h-9 w-9 rounded-full bg-red-500 opacity-60"></span>' : ''}
              <div class="w-8 h-8 rounded-full ${colorClass} ${isHighlighted ? 'ring-4 ring-white scale-125' : ''} border-2 border-white flex items-center justify-center shadow-xl text-white transition-all transform hover:scale-110">
                <span class="text-xs font-bold">${inc.disasterType === 'Fire' ? '🔥' : inc.disasterType === 'Flood' ? '🌊' : inc.disasterType === 'Earthquake' ? '🌋' : '⚠️'}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const statusColor =
          inc.status === 'Resolved'
            ? 'text-emerald-400'
            : inc.status === 'Response In Progress'
            ? 'text-blue-400'
            : 'text-amber-400';

        const popupContent = `
          <div style="min-width: 220px;" class="p-1">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
              <span class="font-mono text-xs font-bold text-red-400 tracking-wider">${inc.id}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 ${statusColor}">${inc.status}</span>
            </div>
            <h4 class="font-semibold text-white text-sm mb-1 leading-snug">${inc.title}</h4>
            <div class="text-xs text-slate-300 mb-2">
              <p>📍 ${inc.location.address}</p>
              <p>👥 Affected: <strong class="text-white">${inc.peopleAffected}</strong> | Severity: <span class="font-bold text-red-300">${inc.severity}</span></p>
              ${inc.assignedTeamName ? `<p class="mt-1 text-sky-300">🚒 ${inc.assignedTeamName}</p>` : ''}
            </div>
            <a href="/report?track=${inc.id}" class="inline-block w-full text-center py-1 px-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded transition-colors">
              Track Live Response →
            </a>
          </div>
        `;

        const marker = L.marker([inc.location.lat, inc.location.lng], { icon: incidentIcon });
        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);

        if (isHighlighted) {
          marker.openPopup();
        }
      });
    }

    // 2. Emergency Services markers
    services.forEach(srv => {
      let iconEmoji = '🏥';
      let bgColor = 'bg-emerald-600';
      let shouldShow = false;

      if (srv.type === 'Hospital' && activeLayers.hospitals) {
        iconEmoji = '🏥';
        bgColor = 'bg-emerald-600';
        shouldShow = true;
      } else if (srv.type === 'Disaster Shelter' && activeLayers.shelters) {
        iconEmoji = '⛺';
        bgColor = 'bg-indigo-600';
        shouldShow = true;
      } else if (srv.type === 'Fire Station' && activeLayers.firePolice) {
        iconEmoji = '🚒';
        bgColor = 'bg-orange-600';
        shouldShow = true;
      } else if (srv.type === 'Police' && activeLayers.firePolice) {
        iconEmoji = '🚓';
        bgColor = 'bg-blue-600';
        shouldShow = true;
      } else if (srv.type === 'Blood Bank' && activeLayers.hospitals) {
        iconEmoji = '🩸';
        bgColor = 'bg-rose-600';
        shouldShow = true;
      }

      if (shouldShow) {
        const serviceIcon = L.divIcon({
          className: 'custom-service-marker',
          html: `
            <div class="w-7 h-7 rounded-lg ${bgColor} border border-white flex items-center justify-center shadow-md text-white text-xs hover:scale-110 transition-transform">
              ${iconEmoji}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const srvPopup = `
          <div style="min-width: 200px;" class="p-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${srv.type}</span>
            <h4 class="font-bold text-white text-sm mt-0.5 leading-snug">${srv.name}</h4>
            <p class="text-xs text-slate-300 mt-1">📍 ${srv.address}</p>
            <p class="text-xs text-emerald-400 font-medium mt-1">📞 ${srv.phone}</p>
            ${srv.capacity ? `<p class="text-[11px] text-slate-400 mt-1">Capacity: <span class="text-white font-semibold">${srv.capacity.available}/${srv.capacity.total} ${srv.capacity.unit}</span></p>` : ''}
            <a href="tel:${srv.phone}" class="mt-2 inline-block w-full text-center py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors">
              Call Hotline
            </a>
          </div>
        `;

        const marker = L.marker([srv.lat, srv.lng], { icon: serviceIcon });
        marker.bindPopup(srvPopup);
        markersLayerRef.current?.addLayer(marker);
      }
    });
  }, [incidents, services, activeLayers, highlightIncidentId]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => {
    setSelectedCityName('Default');
    mapInstanceRef.current?.setView(center, zoom);
  };

  const handleJumpCity = (cityName: string, coords: [number, number]) => {
    setSelectedCityName(cityName);
    mapInstanceRef.current?.flyTo(coords, 13, { duration: 1.2 });
    if (onSelectLocation) {
      onSelectLocation({ lat: coords[0], lng: coords[1] });
    }
  };

  const handleLiveGps = () => {
    if (navigator.geolocation) {
      setGpsNotification('Acquiring real-time device GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        pos => {
          setSelectedCityName('Live GPS');
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setGpsNotification(`Live GPS Acquired: ${coords[0].toFixed(4)}° N, ${coords[1].toFixed(4)}° E`);
          setTimeout(() => setGpsNotification(null), 5000);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(coords, 15, { duration: 1.2 });

            if (userGpsMarkerRef.current) {
              userGpsMarkerRef.current.remove();
            }

            const liveIcon = L.divIcon({
              className: 'live-gps-marker',
              html: `
                <div class="relative flex items-center justify-center">
                  <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-80"></span>
                  <div class="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xl text-white font-bold text-xs">
                    🛰️
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            userGpsMarkerRef.current = L.marker(coords, { icon: liveIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(
                `<div class="p-2 text-slate-800 text-xs font-semibold">
                  <b class="text-emerald-700">📍 Your Live GPS Location</b><br/>
                  Lat: ${coords[0].toFixed(5)}, Lng: ${coords[1].toFixed(5)}<br/>
                  <span class="text-[10px] text-slate-500">Live Device Geolocation</span>
                </div>`
              )
              .openPopup();
          }

          if (onSelectLocation) {
            onSelectLocation({ lat: coords[0], lng: coords[1] });
          }
        },
        err => {
          console.warn('Geolocation error:', err);
          setGpsNotification('Live GPS unavailable or denied. Centered to SRM KTR Campus, Chengalpattu, Chennai');
          setTimeout(() => setGpsNotification(null), 5000);
          handleJumpCity('SRM KTR / Chengalpattu', [12.8230, 80.0450]);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsNotification('Geolocation not supported by browser. Centered to SRM KTR Campus, Chengalpattu, Chennai');
      setTimeout(() => setGpsNotification(null), 5000);
      handleJumpCity('SRM KTR / Chengalpattu', [12.8230, 80.0450]);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 group">
      {/* City Jump Bar */}
      {showCitySwitcher && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            Quick City:
          </span>
          {INDIAN_CITIES.map(city => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleJumpCity(city.name, city.coords)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                selectedCityName === city.name
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {city.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLiveGps}
            title="Locate my real device GPS position"
            className="px-2 py-1 rounded-lg font-semibold text-[11px] bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">My Live GPS</span>
          </button>
        </div>
      )}

      {/* Map Filter Controls Bar */}
      {showFilters && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveLayers(p => ({ ...p, incidents: !p.incidents }))}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeLayers.incidents
                ? 'bg-red-600/90 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Incidents ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveLayers(p => ({ ...p, hospitals: !p.hospitals }))}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeLayers.hospitals
                ? 'bg-emerald-600/90 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            Hospitals
          </button>
          <button
            type="button"
            onClick={() => setActiveLayers(p => ({ ...p, shelters: !p.shelters }))}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeLayers.shelters
                ? 'bg-indigo-600/90 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Shelters
          </button>
          <button
            type="button"
            onClick={() => setActiveLayers(p => ({ ...p, firePolice: !p.firePolice }))}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeLayers.firePolice
                ? 'bg-orange-600/90 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Fire & Police
          </button>
        </div>
      )}

      {/* Map Control Buttons */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom in on map"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom out on map"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          title="Recenter Map"
          aria-label="Recenter map to default view"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border-t border-slate-800"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Coordinate Picker Guide Banner if interactive selection mode is active */}
      {onSelectLocation && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 shadow-lg">
          <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>Click anywhere on the map to pin incident coordinates</span>
        </div>
      )}

      {/* Live GPS Feedback Toast */}
      {gpsNotification && (
        <div className="absolute top-14 right-3 z-[1000] bg-emerald-950/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold">{gpsNotification}</span>
        </div>
      )}

      {/* Actual Map Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />
    </div>
  );
};
