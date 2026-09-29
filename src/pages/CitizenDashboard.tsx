import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/StatusBadge';
import { SosModal } from '../components/common/SosModal';
import {
  ShieldAlert,
  AlertTriangle,
  PlusCircle,
  FileText,
  Hospital,
  Bell,
  CheckCircle2,
  XCircle,
  PhoneCall,
  MapPin,
  Clock,
  ArrowRight,
  UserCheck,
  Heart,
  ExternalLink,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { currentUser, incidents, announcements, toggleSafetyStatus, notifications, updateProfile } = useApp();
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [liveGpsStatus, setLiveGpsStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDetectLiveLocation = () => {
    if (navigator.geolocation) {
      setLiveGpsStatus('Detecting live GPS coordinates...');
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            if (res.ok) {
              const data = await res.json();
              if (data && data.display_name) {
                const fullAddr = data.display_name.split(',').slice(0, 4).join(',');
                updateProfile({ address: fullAddr });
                setLiveGpsStatus(`Updated to Live GPS: ${fullAddr}`);
                setTimeout(() => setLiveGpsStatus(null), 5000);
                return;
              }
            }
          } catch (e) {
            console.warn(e);
          }
          const coordAddr = `Live GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
          updateProfile({ address: coordAddr });
          setLiveGpsStatus(`Updated to ${coordAddr}`);
          setTimeout(() => setLiveGpsStatus(null), 5000);
        },
        () => {
          setLiveGpsStatus('GPS permission denied. Retained registered location (Chengalpattu near SRM KTR, Chennai)');
          setTimeout(() => setLiveGpsStatus(null), 5000);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLiveGpsStatus('Geolocation not supported by browser.');
      setTimeout(() => setLiveGpsStatus(null), 4000);
    }
  };

  // Incidents reported by this citizen (or matching user email/id)
  const myIncidents = incidents.filter(
    i => i.reportedBy.id === currentUser.id || i.reportedBy.name === currentUser.name
  );

  const activeAdvisories = announcements.filter(a => a.active);

  const handleSafetyToggle = () => {
    toggleSafetyStatus(!currentUser.isSafe);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Citizen Welcome & Safety Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Citizen Portal • {currentUser.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Emergency Safety Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              📍 Registered Address: <strong className="text-slate-200">{currentUser.address || 'Near SRM IST (KTR Campus), Potheri, Chengalpattu - 603203, Chennai'}</strong>
              <br />
              Emergency dispatch network has your medical notes & emergency contacts synchronized.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDetectLiveLocation}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-500/40 px-3 py-1.5 rounded-xl transition-colors hover:bg-emerald-900/50"
              >
                <MapPin className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
                <span>📍 Sync My Live Device Location</span>
              </button>
              {liveGpsStatus && (
                <p className="text-[11px] text-emerald-300 font-medium animate-pulse mt-1.5">
                  {liveGpsStatus}
                </p>
              )}
            </div>
          </div>

          {/* Big Safety Status Broadcast Toggle */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                Your Public Safety Status
              </span>
              <span
                className={`text-sm font-black flex items-center gap-1.5 justify-center sm:justify-start ${
                  currentUser.isSafe ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {currentUser.isSafe ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Marked SAFE & ACCOUNTED FOR
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                    NEED RESCUE ASSISTANCE
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSafetyToggle}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                currentUser.isSafe
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {currentUser.isSafe ? 'Switch to: Need Assistance' : "Mark 'I am Safe'"}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: 1-Click SOS */}
        <button
          type="button"
          onClick={() => setIsSosOpen(true)}
          className="p-5 bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-2xl shadow-xl shadow-red-600/25 flex flex-col justify-between text-left transition-all active:scale-95 group animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded">
              Immediate
            </span>
          </div>
          <div>
            <h3 className="text-lg font-black leading-tight">Instant SOS Beacon</h3>
            <p className="text-white/80 text-xs mt-1">
              Broadcast GPS location to Police & Fire Rescue in 5 seconds
            </p>
          </div>
        </button>

        {/* Action 2: Report Hazard / Emergency */}
        <Link
          to="/report"
          className="p-5 bg-slate-850 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-xl flex flex-col justify-between text-left transition-all hover:shadow-2xl group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-xs text-sky-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Report Emergency
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Log fire, flood, landslide, or medical hazard with photos & pin map
            </p>
          </div>
        </Link>

        {/* Action 3: Find Nearest Shelter/Hospital */}
        <Link
          to="/services"
          className="p-5 bg-slate-850 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-xl flex flex-col justify-between text-left transition-all hover:shadow-2xl group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Hospital className="w-6 h-6" />
            </div>
            <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              Find Services & Care
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Locate 24/7 trauma hospitals, fire stations, and emergency shelters
            </p>
          </div>
        </Link>

        {/* Action 4: Survival Guidelines */}
        <Link
          to="/guidelines"
          className="p-5 bg-slate-850 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-xl flex flex-col justify-between text-left transition-all hover:shadow-2xl group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              Survival Guidelines
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Official protocols, 72-hour Go-Bag checklist, and trauma first aid
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: My Reported Incidents (Left) & Active Advisories (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Reported Incidents */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                My Reported Emergencies & Live Tracking
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Incidents registered from your account with 5-phase status progression
              </p>
            </div>
            <Link
              to="/report"
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>+ New Incident Report</span>
            </Link>
          </div>

          {myIncidents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">No active incidents filed by you</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                If you encounter a flood, wildfire, collapse, or medical emergency, file an instant report with exact coordinates.
              </p>
              <Link
                to="/report"
                className="inline-block py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                File Emergency Report Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myIncidents.map(inc => {
                // Workflow step calculations
                const steps = ['Reported', 'Under Review', 'Assigned', 'Response In Progress', 'Resolved'];
                const currentIdx = steps.indexOf(inc.status);

                return (
                  <div
                    key={inc.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-red-400">{inc.id}</span>
                          <span className="text-xs font-semibold text-slate-300">• {inc.disasterType}</span>
                        </div>
                        <h3 className="text-base font-bold text-white">{inc.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{inc.location.address}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="text-[11px] text-slate-500">
                          {new Date(inc.reportedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Visual 5-step Workflow Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                        <span>Workflow Status:</span>
                        <span className="text-white font-bold">{inc.status}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {steps.map((st, idx) => {
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          return (
                            <div key={st} className="flex flex-col gap-1">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone
                                    ? isCurrent
                                      ? 'bg-red-500 animate-pulse'
                                      : 'bg-emerald-500'
                                    : 'bg-slate-800'
                                }`}
                              />
                              <span
                                className={`text-[10px] hidden sm:block truncate text-center ${
                                  isCurrent ? 'text-red-400 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-600'
                                }`}
                              >
                                {st}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Responder Assignment Notice */}
                    {inc.assignedTeamName && (
                      <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚒</span>
                          <span>
                            Assigned to: <strong className="text-white">{inc.assignedTeamName}</strong>
                          </span>
                        </div>
                        <span className="text-[11px] text-sky-400 font-semibold">En Route / On Scene</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400">
                        {inc.notes.length} dispatch log notes recorded
                      </p>
                      <Link
                        to={`/report?track=${inc.id}`}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <span>View Live GPS Tracking Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Advisories, Emergency Contacts & Safe Check-In */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Advisories Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-400" />
                Active Public Warnings
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {activeAdvisories.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {activeAdvisories.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No active severe weather warnings.</p>
              ) : (
                activeAdvisories.map(ann => (
                  <div
                    key={ann.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      ann.priority === 'Critical'
                        ? 'bg-red-950/40 border-red-800/60 text-red-200'
                        : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{ann.title}</span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/30">
                        {ann.type}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{ann.message}</p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Affected: <strong>{ann.affectedAreas.join(', ')}</strong>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Emergency Next-of-Kin Contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                My Emergency Contacts
              </h3>
              <Link to="/profile" className="text-[11px] text-sky-400 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {currentUser.emergencyContacts.map(contact => (
                <div
                  key={contact.id}
                  className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white">{contact.name}</h4>
                    <span className="text-[10px] text-slate-400">{contact.relationship}</span>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 font-semibold text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
};
