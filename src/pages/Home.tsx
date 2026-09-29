import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapComponent } from '../components/common/MapComponent';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/StatusBadge';
import { SosModal } from '../components/common/SosModal';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Waves,
  HeartPulse,
  Radio,
  Clock,
  ArrowRight,
  Hospital,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  PhoneCall,
  Activity,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { incidents, services, announcements, switchRole } = useApp();
  const [isSosOpen, setIsSosOpen] = useState(false);
  const navigate = useNavigate();

  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const recentIncidents = incidents.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>STATE EMERGENCY DISPATCH NETWORK ACTIVE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Rapid Disaster Response. <br />
                <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  Every Second Counts.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                SmartRescue synchronizes affected citizens, emergency field rescue squads, and state operations command in real time. Report hazards, track rescue deployments, and access critical survival facilities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSosOpen(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-red-600/30 transition-all flex items-center gap-2.5 active:scale-95 animate-pulse"
                >
                  <AlertTriangle className="w-5 h-5" />
                  EMERGENCY SOS (1-CLICK)
                </button>

                <Link
                  to="/report"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2 hover:border-slate-600"
                >
                  Report an Incident
                  <ArrowRight className="w-4 h-4 text-red-400" />
                </Link>

                <Link
                  to="/services"
                  className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm rounded-xl border border-slate-800 transition-colors flex items-center gap-2"
                >
                  <Hospital className="w-4 h-4 text-emerald-400" />
                  Find Shelters & Care
                </Link>
              </div>

              {/* Quick hotline reminder */}
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>Life-threatening emergency in India? Direct dial </span>
                <a href="tel:112" className="font-bold text-red-400 hover:underline">
                  112
                </a>
                <span>or Ambulance </span>
                <a href="tel:108" className="font-bold text-red-400 hover:underline">
                  108 / 102
                </a>
              </div>
            </div>

            {/* Right Hero Live Metric Banner */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-bold text-white text-sm">Live Operations Status</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    UTC {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Active Incidents</span>
                    <span className="text-3xl font-black text-white">{activeIncidents.length}</span>
                    <span className="text-[10px] text-amber-400 font-medium block mt-1">
                      {criticalCount} Critical Priority
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Rescue Teams Deployed</span>
                    <span className="text-3xl font-black text-sky-400">4</span>
                    <span className="text-[10px] text-sky-300 font-medium block mt-1">
                      12 Tasks in Progress
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Avg Response Dispatch</span>
                    <span className="text-3xl font-black text-emerald-400">6.4m</span>
                    <span className="text-[10px] text-emerald-300 font-medium block mt-1">
                      Target under 8 mins
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Available Shelter Beds</span>
                    <span className="text-3xl font-black text-purple-400">960</span>
                    <span className="text-[10px] text-purple-300 font-medium block mt-1">
                      Across 2 Centers
                    </span>
                  </div>
                </div>

                {/* Priority Alert Box */}
                {announcements.length > 0 && announcements[0].active && (
                  <div className="mt-5 p-3.5 bg-red-950/60 border border-red-800/60 rounded-xl text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-red-300 block mb-0.5">
                        {announcements[0].title}
                      </span>
                      <p className="text-slate-300 line-clamp-2">{announcements[0].message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map & Real-time Incidents Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Real-Time Geospatial Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Live Incident & Emergency Infrastructure Map
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Interactive map visualizing reported hazards, assigned rescue crews, and nearest medical shelters.
            </p>
          </div>
          <Link
            to="/report"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Track specific incident by ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Map Component */}
        <MapComponent
          incidents={incidents}
          services={services}
          height="480px"
          zoom={13}
          showFilters={true}
        />
      </section>

      {/* Active Incidents Triage Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              Active Incident Response Feed
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live progress tracker from triage review to on-site mitigation.
            </p>
          </div>
          <Link
            to="/report"
            className="text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            View All Reports →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentIncidents.map(inc => (
            <div
              key={inc.id}
              className="bg-slate-800/80 border border-slate-700 hover:border-slate-600 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-red-400">{inc.id}</span>
                  <SeverityBadge severity={inc.severity} size="sm" />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
                  {inc.title}
                </h3>
                <p className="text-slate-300 text-xs line-clamp-2 mb-3 leading-relaxed">
                  {inc.description}
                </p>
                <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                  <p className="truncate">📍 {inc.location.address}</p>
                  <p>👥 Affected: <strong className="text-slate-200">{inc.peopleAffected}</strong></p>
                  {inc.assignedTeamName && (
                    <p className="text-sky-300 font-medium truncate">🚒 {inc.assignedTeamName}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <IncidentStatusBadge status={inc.status} size="sm" />
                <Link
                  to={`/report?track=${inc.id}`}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  Track →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400">
            Multi-Stakeholder Coordination
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Tailored Portals for Every Crisis Role
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Switch between demo user roles anytime to test workflow handoffs between citizens, rescue teams, and admin commanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citizen Card */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Role 1</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">Citizen Portal</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Instantly report life-threatening incidents with GPS location, upload hazard details, track response progression live, and broadcast "I am Safe" check-ins.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  1-Click GPS SOS Beacon
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Live 5-step status timeline tracker
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Hospital and shelter directory
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('citizen');
                navigate('/citizen');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Enter as Citizen (Priya) →
            </button>
          </div>

          {/* Response Team Card */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Role 2</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">Response Team Desk</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Specialized console for rapid task forces (NDRF swiftwater squads, Delhi Fire Service, CATS trauma medics). Update operational triage status and log field reports.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  View assigned high-priority incidents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Advance status: Assigned → En Route → Resolved
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Add official on-scene timestamps & notes
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('response_team');
                navigate('/response-team');
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Enter as Responder (Insp. Rajesh) →
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Role 3</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">Admin Command EOC</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                National Disaster Management Authority (NDMA) master dashboard. Oversee all incidents, assign NDRF/SDRF units, manage critical resources, and publish public advisories.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Master triage & unit dispatch control
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Fleet, ambulance & inventory logistics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Broadcast public evacuation alerts
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('admin');
                navigate('/admin');
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Enter as Admin (Dr. Anita Verma) →
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Preparedness Guidelines Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Civilian Readiness & Survival Guide</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Are You Prepared For The Next 72 Hours?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Check our official step-by-step guides for earthquakes, flash floods, building fires, and severe storm surges. Build your interactive emergency survival kit and review critical do’s and don’ts before disaster strikes.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Link
                to="/guidelines"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                Open Survival Guidelines
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
};
