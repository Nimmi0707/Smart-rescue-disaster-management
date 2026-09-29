import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DisasterType, SeverityLevel, Incident } from '../types';
import { MapComponent } from '../components/common/MapComponent';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Clock,
  Send,
  Camera,
  CheckCircle2,
  Users,
  Search,
  MessageSquare,
  Navigation,
  FileCheck,
  PhoneCall,
  Activity,
  ArrowRight,
  Flame,
  Waves,
  Radio,
  Sparkles,
} from 'lucide-react';

const DISASTER_TYPES: DisasterType[] = [
  'Flood',
  'Fire',
  'Earthquake',
  'Cyclone',
  'Medical Emergency',
  'Landslide',
  'Building Collapse',
  'Chemical Hazard',
  'Severe Heatwave',
];

const HAZARD_OPTIONS = [
  'Live Electrical Cables',
  'Rapid Water Flow',
  'Dense Toxic Smoke',
  'Structural Masonry Crack',
  'Flammable Gas Odor',
  'Trapped Children/Elderly',
  'Road Blocked / Inaccessible',
];

export const ReportTrackEmergency: React.FC = () => {
  const { incidents, addIncident, currentUser, addIncidentNote } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab: 'report' or 'track'
  const initialTrackId = searchParams.get('track');
  const [activeTab, setActiveTab] = useState<'report' | 'track'>(initialTrackId ? 'track' : 'report');

  // Report Form State
  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('Flood');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 12.8230, lng: 80.0450 }); // Default to SRM KTR Campus, Chengalpattu, Chennai
  const [address, setAddress] = useState('Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai');
  const [landmark, setLandmark] = useState('Opposite SRM Medical College Hospital & Potheri Station');
  const [city, setCity] = useState('Chengalpattu / Chennai');
  const [description, setDescription] = useState('');
  const [peopleAffected, setPeopleAffected] = useState<number>(3);
  const [selectedHazards, setSelectedHazards] = useState<string[]>(['Rapid Water Flow']);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [submitSuccessId, setSubmitSuccessId] = useState<string | null>(null);

  // Track State
  const [searchTrackId, setSearchTrackId] = useState(initialTrackId || (incidents[0] ? incidents[0].id : 'INC-8830'));
  const [citizenNoteText, setCitizenNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

  useEffect(() => {
    if (initialTrackId) {
      setSearchTrackId(initialTrackId);
      setActiveTab('track');
    }
  }, [initialTrackId]);

  const trackedIncident = incidents.find(
    i => i.id.toLowerCase() === searchTrackId.trim().toLowerCase()
  ) || incidents[0];

  const handleHazardToggle = (hazard: string) => {
    setSelectedHazards(prev =>
      prev.includes(hazard) ? prev.filter(h => h !== hazard) : [...prev, hazard]
    );
  };

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const parts: string[] = [];
          if (data.address.road) parts.push(data.address.road);
          if (data.address.suburb || data.address.neighbourhood) {
            parts.push(data.address.suburb || data.address.neighbourhood);
          }
          if (data.address.city || data.address.town || data.address.state_district) {
            parts.push(data.address.city || data.address.town || data.address.state_district);
          }
          const formattedAddress = parts.length > 0 ? parts.join(', ') : data.display_name.split(',').slice(0, 3).join(',');
          setAddress(formattedAddress);

          const detectedCity = data.address.city || data.address.town || data.address.state_district || (lat < 13.5 && lat > 12.8 ? 'Chennai' : 'New Delhi');
          setCity(detectedCity);

          if (data.address.suburb || data.address.neighbourhood) {
            setLandmark(`Near ${data.address.suburb || data.address.neighbourhood}`);
          }
          setIsGeocoding(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Reverse geocode fallback:', e);
    }

    // Friendly fallback
    if (lat > 12.8 && lat < 13.3 && lng > 80.0 && lng < 80.4) {
      setCity('Chennai');
      setAddress(`Chennai Urban Area (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`);
    } else {
      setAddress(`Pinned Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
    }
    setIsGeocoding(false);
  };

  const handleMapPinSelected = (newCoords: { lat: number; lng: number }) => {
    setCoords(newCoords);
    fetchAddressFromCoords(newCoords.lat, newCoords.lng);
  };

  const handleSelectCityPreset = (cityName: string, targetCoords: { lat: number; lng: number }, defaultAddr: string, defaultLandmark: string) => {
    setCoords(targetCoords);
    setCity(cityName);
    setAddress(defaultAddr);
    setLandmark(defaultLandmark);
    fetchAddressFromCoords(targetCoords.lat, targetCoords.lng);
  };

  const handleUseCurrentGPS = () => {
    setIsGeocoding(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(newCoords);
          fetchAddressFromCoords(newCoords.lat, newCoords.lng);
        },
        err => {
          console.warn('Geolocation denied or failed, fallback to SRM KTR Chengalpattu:', err);
          handleSelectCityPreset(
            'Chengalpattu / Chennai',
            { lat: 12.8230, lng: 80.0450 },
            'Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai',
            'Opposite SRM Medical College Hospital & Potheri Station'
          );
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      handleSelectCityPreset(
        'Chengalpattu / Chennai',
        { lat: 12.8230, lng: 80.0450 },
        'Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai',
        'Opposite SRM Medical College Hospital & Potheri Station'
      );
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = addIncident({
        title,
        disasterType,
        severity,
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address,
          landmark,
          city,
        },
        description,
        peopleAffected,
        hazardsPresent: selectedHazards,
        imageUrl: imageUrl || undefined,
      });

      setIsSubmitting(false);
      setSubmitSuccessId(generatedId);
      setSearchTrackId(generatedId);
      setSearchParams({ track: generatedId });
      setActiveTab('track');
    }, 900);
  };

  const handleAddCitizenNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenNoteText.trim() || !trackedIncident) return;

    addIncidentNote(trackedIncident.id, citizenNoteText);
    setCitizenNoteText('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  // Workflow steps
  const workflowSteps: Incident['status'][] = [
    'Reported',
    'Under Review',
    'Assigned',
    'Response In Progress',
    'Resolved',
  ];
  const currentStepIdx = trackedIncident ? workflowSteps.indexOf(trackedIncident.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Crisis Response Central
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            Report Incident & Live Emergency Tracking
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit real-time disaster reports or follow live rescue response status step-by-step.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-900 border border-slate-700 p-1.5 rounded-2xl flex items-center gap-1 shadow-lg self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Report New Emergency
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Live Incident Tracker
          </button>
        </div>
      </div>

      {/* Success Notification if newly reported */}
      {submitSuccessId && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-sm text-white">Emergency Incident Dispatched!</span>
              <p className="text-emerald-300">
                Ticket <strong className="font-mono text-white underline">{submitSuccessId}</strong> has been created and transmitted to the State Emergency Operations Center.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSubmitSuccessId(null)}
            className="text-slate-400 hover:text-white px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: REPORT EMERGENCY FORM */}
      {activeTab === 'report' && (
        <form onSubmit={handleSubmitReport} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Disaster details & Map coordinate picker */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Emergency Incident Particulars
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Brief Incident Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Floodwater breaching residential ground floor duplex"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Disaster Type Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Disaster Classification *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DISASTER_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDisasterType(type)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all truncate ${
                        disasterType === type
                          ? 'bg-red-600/30 border-red-500 text-white font-bold ring-1 ring-red-500'
                          : 'bg-slate-800/80 border-slate-750 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Emergency Severity Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Low', 'Medium', 'High', 'Critical'] as SeverityLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        severity === lvl
                          ? lvl === 'Critical'
                            ? 'bg-red-600 text-white font-bold border-red-400 shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                            : lvl === 'High'
                            ? 'bg-amber-600 text-white font-bold border-amber-400 shadow-lg ring-2 ring-amber-400'
                            : lvl === 'Medium'
                            ? 'bg-yellow-600 text-white font-bold border-yellow-400'
                            : 'bg-blue-600 text-white font-bold border-blue-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl}</div>
                      <div className="text-[10px] opacity-80">
                        {lvl === 'Critical' ? 'Life Threat' : lvl === 'High' ? 'Urgent Risk' : 'Moderate'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Casualties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Estimated People Stranded / Affected
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={peopleAffected}
                    onChange={e => setPeopleAffected(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Caller Contact Phone
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.phone}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Situation Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specify immediate dangers, building floors affected, water level, presence of children, elders, or injured individuals..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Hazards Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Immediate Environmental Hazards Present
                </label>
                <div className="flex flex-wrap gap-2">
                  {HAZARD_OPTIONS.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHazardToggle(h)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedHazards.includes(h)
                          ? 'bg-red-500/20 text-red-300 border-red-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {selectedHazards.includes(h) ? '✓ ' : '+ '} {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Location Map & Coordinates Picker */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  Pinpoint Incident Coordinates
                </h3>
                <button
                  type="button"
                  onClick={handleUseCurrentGPS}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 animate-pulse" />
                  <span>Use Live Device GPS</span>
                </button>
              </div>

              {/* Quick Indian City Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Quick City:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectCityPreset(
                      'Chengalpattu / Chennai',
                      { lat: 12.8230, lng: 80.0450 },
                      'Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai',
                      'Opposite SRM Medical College Hospital & Potheri Station'
                    )
                  }
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    address.toLowerCase().includes('srm') || city.toLowerCase().includes('chengalpattu')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  📍 SRM KTR / Chengalpattu
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Chennai', { lat: 13.0827, lng: 80.2707 }, 'Marina Beach Road, Triplicane, Chennai', 'Near Marina Lighthouse')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    city.toLowerCase().includes('chennai') && !address.toLowerCase().includes('srm')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🌊 Chennai Central
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Tambaram', { lat: 12.9249, lng: 80.1465 }, 'GST Road, Tambaram Sanatorium, Chennai', 'Near MEPZ & Tambaram Station')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    address.toLowerCase().includes('tambaram')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🚉 Tambaram
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('New Delhi', { lat: 28.6139, lng: 77.2090 }, 'Connaught Place Central, New Delhi', 'Near Rajiv Chowk')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    city.toLowerCase().includes('delhi')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🏛️ Delhi
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Mumbai', { lat: 19.0760, lng: 72.8777 }, 'Marine Drive & Dadar West, Mumbai', 'Near Dadar Station')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    city.toLowerCase().includes('mumbai')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🏙️ Mumbai
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectCityPreset('Bengaluru', { lat: 12.9716, lng: 77.5946 }, 'MG Road, Ashok Nagar, Bengaluru', 'Near Trinity Metro')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    city.toLowerCase().includes('bengaluru')
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🌳 Bengaluru
                </button>
              </div>

              {isGeocoding && (
                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5 animate-pulse bg-amber-950/40 border border-amber-500/30 p-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Reverse geocoding location via OpenStreetMap India...</span>
                </div>
              )}

              {/* Interactive OpenStreetMap Coordinate Picker */}
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-md">
                <MapComponent
                  selectedLocation={coords}
                  onSelectLocation={handleMapPinSelected}
                  height="260px"
                  zoom={14}
                  center={[coords.lat, coords.lng]}
                  showFilters={false}
                />
              </div>

              {/* Address inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Street Address / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. 450 Marina Boulevard"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Prominent Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      placeholder="e.g. Near Pier 7"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City / Sector
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Metro City"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                  📍 Latitude: <strong className="text-white">{coords.lat.toFixed(6)}</strong> | Longitude:{' '}
                  <strong className="text-white">{coords.lng.toFixed(6)}</strong>
                </div>
              </div>

              {/* Photo Simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Simulated On-Scene Photo</span>
                  <span className="text-[10px] text-slate-500">Optional Evidence</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        disasterType === 'Fire'
                          ? 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs text-slate-300"
                    title="Insert realistic demo photo"
                  >
                    Sample Photo
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Distress Data to EOC...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMIT EMERGENCY REPORT →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: LIVE INCIDENT TRACKER */}
      {activeTab === 'track' && (
        <div className="space-y-8">
          {/* Ticket Search Bar & Quick Demo Tickets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTrackId}
                  onChange={e => setSearchTrackId(e.target.value)}
                  placeholder="Enter Incident Ticket Number (e.g. INC-8902, INC-8894)..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchParams({ track: searchTrackId })}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                Track Ticket
              </button>
            </div>

            {/* Quick Demo Incident Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Quick Select Demo Tickets:</span>
              {incidents.slice(0, 4).map(inc => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => {
                    setSearchTrackId(inc.id);
                    setSearchParams({ track: inc.id });
                  }}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-xs transition-colors ${
                    trackedIncident && trackedIncident.id === inc.id
                      ? 'bg-red-600/30 text-red-300 border-red-500 font-bold'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {inc.id} ({inc.disasterType})
                </button>
              ))}
            </div>
          </div>

          {/* Incident Tracking Detail View */}
          {trackedIncident ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Workflow Progress Bar & Official Timeline */}
              <div className="lg:col-span-8 space-y-6">
                {/* Header Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-base font-black text-red-400">
                          {trackedIncident.id}
                        </span>
                        <SeverityBadge severity={trackedIncident.severity} size="sm" />
                        <IncidentStatusBadge status={trackedIncident.status} size="sm" />
                      </div>
                      <h2 className="text-2xl font-black text-white">{trackedIncident.title}</h2>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{trackedIncident.location.address}, {trackedIncident.location.city}</span>
                      </p>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      <div>Reported: <strong>{new Date(trackedIncident.reportedAt).toLocaleTimeString()}</strong></div>
                      <div>Updated: <strong>{new Date(trackedIncident.updatedAt).toLocaleTimeString()}</strong></div>
                    </div>
                  </div>

                  {/* 5-Step Workflow Progression Visualizer */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      Incident Workflow Lifecycle Status
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {workflowSteps.map((st, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={st} className="flex flex-col items-center text-center gap-2">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isCurrent
                                  ? 'bg-red-600 text-white ring-4 ring-red-500/30 shadow-lg shadow-red-600/50 animate-pulse'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-600 border border-slate-700'
                              }`}
                            >
                              {isDone && !isCurrent ? '✓' : `0${idx + 1}`}
                            </div>
                            <span
                              className={`text-[11px] font-semibold ${
                                isCurrent ? 'text-red-400 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Incident Summary Info */}
                  <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-2 text-xs text-slate-300">
                    <p className="leading-relaxed">{trackedIncident.description}</p>
                    <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-400 border-t border-slate-700/60">
                      <span>👥 Affected: <strong className="text-white">{trackedIncident.peopleAffected}</strong></span>
                      <span>🚨 Hazards: <strong className="text-red-300">{trackedIncident.hazardsPresent?.join(', ') || 'None logged'}</strong></span>
                      <span>📞 Reporter: <strong className="text-white">{trackedIncident.reportedBy.name} ({trackedIncident.reportedBy.phone})</strong></span>
                    </div>
                  </div>
                </div>

                {/* Official Response Timeline */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Clock className="w-5 h-5 text-sky-400" />
                    Response Dispatch Timeline
                  </h3>

                  <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {trackedIncident.timeline.map((event, idx) => (
                      <div key={idx} className="relative flex items-start gap-4 pl-8">
                        <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-red-500 ring-4 ring-slate-900" />
                        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 flex-1 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">{event.status}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {new Date(event.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{event.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citizen Communication & Dispatch Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    Field Communications & Responder Notes ({trackedIncident.notes.length})
                  </h3>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {trackedIncident.notes.map(note => (
                      <div
                        key={note.id}
                        className="bg-slate-800/70 p-3 rounded-xl border border-slate-750 border-slate-700/70 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {note.author}
                            <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-700">
                              {note.role}
                            </span>
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(note.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Citizen Update Form */}
                  <form onSubmit={handleAddCitizenNote} className="pt-2 border-t border-slate-800 space-y-2">
                    {noteSuccess && (
                      <div className="text-emerald-400 text-xs font-semibold">
                        ✓ Note logged into emergency dispatch log.
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={citizenNoteText}
                        onChange={e => setCitizenNoteText(e.target.value)}
                        placeholder="Provide additional update to responders (e.g. 'We moved to 2nd floor balcony')..."
                        className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors shrink-0"
                      >
                        Send Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Assigned Team Details & Live Map Pin */}
              <div className="lg:col-span-4 space-y-6">
                {/* Assigned Task Force Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                    <span>Assigned Rescue Task Force</span>
                  </h3>

                  {trackedIncident.assignedTeamName ? (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl font-bold">
                          🚒
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{trackedIncident.assignedTeamName}</h4>
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Deployed & Actively Responding
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1.5 text-slate-300">
                        <p>👤 Incident Lead: <strong>Capt. David Miller</strong></p>
                        <p>📍 Base Depot: <strong>Harbor Emergency Station Pier 7</strong></p>
                        <p>🚤 Equipment: <strong>2x Zodiac Rescue Boats, Thermal Drones</strong></p>
                      </div>

                      <a
                        href="tel:+15553456789"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Direct Responder Hotline</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                      <p>Triage review currently underway at State EOC.</p>
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full font-semibold text-[11px]">
                        Pending Unit Assignment
                      </span>
                    </div>
                  )}
                </div>

                {/* Geographic Map Location */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                    Geospatial Incident Target
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-slate-700">
                    <MapComponent
                      incidents={[trackedIncident]}
                      highlightIncidentId={trackedIncident.id}
                      center={[trackedIncident.location.lat, trackedIncident.location.lng]}
                      height="260px"
                      zoom={14}
                      showFilters={false}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Coordinates: {trackedIncident.location.lat.toFixed(4)}, {trackedIncident.location.lng.toFixed(4)}
                  </p>
                </div>

                {/* Evidence Photo if present */}
                {trackedIncident.imageUrl && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-slate-400" />
                      <span>On-Scene Incident Imagery</span>
                    </h3>
                    <img
                      src={trackedIncident.imageUrl}
                      alt={trackedIncident.title}
                      className="w-full h-44 object-cover rounded-xl border border-slate-700"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm">No incident found matching ticket "{searchTrackId}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
