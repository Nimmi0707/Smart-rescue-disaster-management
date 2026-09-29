import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Incident, IncidentStatus, ResponseTeam } from '../types';
import { MapComponent } from '../components/common/MapComponent';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/StatusBadge';
import {
  Flame,
  Shield,
  Activity,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Send,
  Radio,
  SlidersHorizontal,
  PhoneCall,
  Boxes,
  Truck,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ResponseTeamDashboard: React.FC = () => {
  const {
    currentUser,
    incidents,
    updateIncidentStatus,
    addIncidentNote,
    responseTeams,
    updateTeamStatus,
    resources,
  } = useApp();

  // Find this user's team or default to team-01 (Rapid Water Rescue Unit Alpha)
  const currentTeam = responseTeams[0];

  // Incidents assigned to this team or high priority in city
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [selectedIncident, setSelectedIncident] = useState<Incident>(
    incidents.find(i => i.assignedTeamId === currentTeam.id) || incidents[0]
  );

  // Status update modal / form state
  const [newStatus, setNewStatus] = useState<IncidentStatus>(selectedIncident.status);
  const [statusNote, setStatusNote] = useState('');
  const [fieldNoteText, setFieldNoteText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const teamIncidents = incidents.filter(i => {
    if (filterSeverity === 'All') return true;
    if (filterSeverity === 'Assigned') return i.assignedTeamId === currentTeam.id;
    return i.severity === filterSeverity;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    updateIncidentStatus(selectedIncident.id, newStatus, statusNote || `Status updated to ${newStatus} by field team.`);
    setStatusNote('');
    setSuccessToast(`Incident ${selectedIncident.id} updated to "${newStatus}"!`);
    setTimeout(() => setSuccessToast(null), 3500);

    // Refresh selected incident in view
    const updated = incidents.find(i => i.id === selectedIncident.id);
    if (updated) setSelectedIncident({ ...updated, status: newStatus });
  };

  const handleAddFieldNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldNoteText.trim() || !selectedIncident) return;

    addIncidentNote(selectedIncident.id, fieldNoteText);
    setFieldNoteText('');
    setSuccessToast('Field response observation saved to telemetry log.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleTeamReadinessChange = (status: ResponseTeam['status']) => {
    updateTeamStatus(currentTeam.id, status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Response Team Header & Telemetry Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Response Task Force Dispatch Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>{currentTeam.name}</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Lead Officer: <strong className="text-white">{currentTeam.leadName}</strong> • Specialization: <strong className="text-slate-200">{currentTeam.specialization}</strong> • Crew: <strong className="text-white">{currentTeam.membersCount} Specialists</strong>
            </p>
          </div>

          {/* Operational Readiness Selector */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
              Team Readiness Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(['Available', 'En Route', 'Deployed', 'Standby'] as ResponseTeam['status'][]).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleTeamReadinessChange(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentTeam.status === st
                      ? st === 'Deployed'
                        ? 'bg-red-600 text-white shadow'
                        : st === 'En Route'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Grid: Assigned Incidents Queue (Left) & Incident Action Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Triage Incident Queue */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Assigned Emergencies ({teamIncidents.length})
            </h2>

            {/* Filter Pills */}
            <div className="flex gap-1 text-[11px]">
              {['All', 'Assigned', 'Critical', 'High'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterSeverity(f)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    filterSeverity === f
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {teamIncidents.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setNewStatus(inc.status);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-red-500 shadow-xl ring-1 ring-red-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-red-400">{inc.id}</span>
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge severity={inc.severity} size="sm" />
                      <IncidentStatusBadge status={inc.status} size="sm" />
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{inc.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-2">{inc.description}</p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="truncate">📍 {inc.location.address}</span>
                    <span className="text-slate-300 font-semibold shrink-0">👥 {inc.peopleAffected} Affected</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assigned Equipment Checklist Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Unit Vehicle & Equipment Inventory</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {currentTeam.equipment.map((eq, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{eq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Detailed Incident Action Console */}
        <div className="lg:col-span-7 space-y-6">
          {selectedIncident ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Incident Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-black text-red-400">
                      {selectedIncident.id}
                    </span>
                    <SeverityBadge severity={selectedIncident.severity} />
                    <IncidentStatusBadge status={selectedIncident.status} />
                  </div>
                  <h2 className="text-2xl font-black text-white">{selectedIncident.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {selectedIncident.location.address} • Landmark: {selectedIncident.location.landmark || 'N/A'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedIncident.reportedBy.phone}`}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Citizen</span>
                  </a>
                </div>
              </div>

              {/* Status Progression Action Card */}
              <form onSubmit={handleUpdateStatus} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  Advance Emergency Response Status
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Reported', 'Under Review', 'Assigned', 'Response In Progress', 'Resolved'] as IncidentStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        newStatus === st
                          ? 'bg-red-600 text-white border-red-500 shadow-md ring-2 ring-red-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Field Progression Note (Broadcast to Citizen & EOC)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    placeholder="e.g. Unit Alpha deployed 2 rescue boats on scene. Extraction commenced."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>COMMIT STATUS & TIMELINE UPDATE</span>
                </button>
              </form>

              {/* Tactical Map Location */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Tactical Incident Coordinates
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-700 shadow-md">
                  <MapComponent
                    incidents={[selectedIncident]}
                    highlightIncidentId={selectedIncident.id}
                    center={[selectedIncident.location.lat, selectedIncident.location.lng]}
                    height="240px"
                    zoom={15}
                    showFilters={false}
                  />
                </div>
              </div>

              {/* On-Scene Field Notes Log & Append Form */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Field Response Telemetry Notes ({selectedIncident.notes.length})
                </h3>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedIncident.notes.map(note => (
                    <div
                      key={note.id}
                      className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{note.author} ({note.role})</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddFieldNote} className="flex gap-2">
                  <input
                    type="text"
                    value={fieldNoteText}
                    onChange={e => setFieldNoteText(e.target.value)}
                    placeholder="Log tactical observation (e.g. 'Water level stabilized at 3.5 ft')..."
                    className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Add Log
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
              Select an incident from the triage queue to take operational action.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
