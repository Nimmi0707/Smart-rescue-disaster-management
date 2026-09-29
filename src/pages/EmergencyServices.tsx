import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmergencyService, ServiceType } from '../types';
import { MapComponent } from '../components/common/MapComponent';
import {
  Hospital,
  Flame,
  Shield,
  Home,
  HeartPulse,
  Search,
  PhoneCall,
  MapPin,
  Clock,
  Compass,
  AlertCircle,
  CheckCircle2,
  Navigation,
  SlidersHorizontal,
} from 'lucide-react';

export const EmergencyServices: React.FC = () => {
  const { services } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [only24x7, setOnly24x7] = useState(false);
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const filterTypes = ['All', 'Hospital', 'Fire Station', 'Police', 'Disaster Shelter', 'Blood Bank'];

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || service.type === selectedType;
      const matches24x7 = !only24x7 || service.available24x7;

      return matchesSearch && matchesType && matches24x7;
    });
  }, [services, searchQuery, selectedType, only24x7]);

  const handleRequestAssistance = (srv: EmergencyService) => {
    setSelectedService(srv);
    setActionSuccessMessage(`Direct inquiry dispatched to ${srv.name}. Emergency dispatch notified.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'Hospital':
        return <Hospital className="w-5 h-5 text-emerald-400" />;
      case 'Fire Station':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Police':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Disaster Shelter':
        return <Home className="w-5 h-5 text-indigo-400" />;
      case 'Blood Bank':
        return <HeartPulse className="w-5 h-5 text-rose-400" />;
      default:
        return <Compass className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: EmergencyService['operationalStatus']) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        );
      case 'Limited':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Limited Capacity
          </span>
        );
      case 'Full':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            Full
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Critical Infrastructure Directory
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Emergency Services & Relief Hubs</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time status, bed/resource availability, and direct contact dispatch for hospitals, disaster shelters, fire stations, and emergency blood banks.
          </p>
        </div>

        {/* Quick Hotline Badge */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">All-India Emergency Helpline</div>
            <div className="text-sm font-black text-white">Dial 112 / 108 (Toll Free)</div>
          </div>
        </div>
      </div>

      {/* Alert toast if action dispatched */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-850 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, address, or landmark..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 24/7 Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnly24x7(!only24x7)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
              only24x7
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>24/7 Operations Only</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filterTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map of Facilities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            Geographic Facility Distribution ({filteredServices.length} Results)
          </h2>
          <span className="text-xs text-slate-500">Interactive OpenStreetMap View</span>
        </div>
        <MapComponent
          services={filteredServices}
          height="380px"
          zoom={13}
          showFilters={true}
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-slate-850 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {getServiceIcon(service.type)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(service.operationalStatus)}
                  {service.distanceKm && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {service.distanceKm} km away
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {service.type}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                {service.name}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{service.address}, {service.city}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{service.available24x7 ? 'Open 24 Hours / 7 Days' : 'Standard Emergency Hours'}</span>
                </p>
              </div>

              {/* Capacity Progress Bar if present */}
              {service.capacity && (
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-750 border-slate-700/60 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{service.capacity.unit}:</span>
                    <span className="font-bold text-white">
                      {service.capacity.available} <span className="text-slate-400 font-normal">/ {service.capacity.total} available</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        service.capacity.available / service.capacity.total > 0.3
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (service.capacity.available / service.capacity.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <a
                href={`tel:${service.phone}`}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hotline</span>
              </a>
              <button
                type="button"
                onClick={() => handleRequestAssistance(service)}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
                title="Send notification ping to facility"
              >
                Request Help
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm">No emergency services found matching your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
              setOnly24x7(false);
            }}
            className="mt-3 text-xs text-sky-400 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
