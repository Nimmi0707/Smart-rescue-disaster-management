import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Incident, IncidentStatus, SeverityLevel, DisasterType, ResponseTeam } from '../types';
import { SeverityBadge, IncidentStatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Users,
  Radio,
  Boxes,
  Truck,
  PlusCircle,
  Search,
  CheckCircle2,
  Trash2,
  Send,
  SlidersHorizontal,
  Bell,
  Check,
  ChevronDown,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    incidents,
    updateIncidentStatus,
    assignTeamToIncident,
    responseTeams,
    updateTeamStatus,
    resources,
    updateResourceQuantity,
    announcements,
    addAnnouncement,
    toggleAnnouncementActive,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incidents' | 'teams' | 'resources' | 'broadcast'>('incidents');

  // Search & Filter for Incidents
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Assignment Modal
  const [assigningIncidentId, setAssigningIncidentId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annType, setAnnType] = useState<'Evacuation' | 'Weather Warning' | 'Safety Advisory' | 'Resource Update'>('Weather Warning');
  const [annPriority, setAnnPriority] = useState<'Critical' | 'High' | 'Normal'>('Critical');
  const [annMessage, setAnnMessage] = useState('');
  const [annAreas, setAnnAreas] = useState('Marina Sector 4, Riverfront Ave');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Filtered Incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || inc.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const deployedTeamsCount = responseTeams.filter(t => t.status === 'Deployed').length;
  const totalStranded = incidents
    .filter(i => i.status !== 'Resolved')
    .reduce((sum, i) => sum + i.peopleAffected, 0);

  const handleOpenAssignModal = (incId: string) => {
    setAssigningIncidentId(incId);
    setSelectedTeamId(responseTeams[0]?.id || '');
  };

  const handleConfirmAssignment = () => {
    if (assigningIncidentId && selectedTeamId) {
      assignTeamToIncident(assigningIncidentId, selectedTeamId);
      setAssigningIncidentId(null);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;

    addAnnouncement({
      title: annTitle,
      type: annType,
      priority: annPriority,
      message: annMessage,
      affectedAreas: annAreas.split(',').map(s => s.trim()),
      issuedBy: 'State Emergency Operations Center (SEOC)',
      active: true,
    });

    setAnnTitle('');
    setAnnMessage('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            State Emergency Operations Center (SEOC)
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Admin Command & Control Hub</h1>
          <p className="text-sm text-slate-400 mt-1">
            Global emergency oversight, response team dispatching, resource supply chains, and emergency broadcasts.
          </p>
        </div>

        {/* EOC Readiness Badge */}
        <div className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/30 border border-purple-400 text-purple-300 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Command Status</div>
            <div className="text-sm font-black text-white">DEFCON 2 • Active Triage</div>
          </div>
        </div>
      </div>

      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Total Reported Incidents</span>
          <span className="text-3xl font-black text-white">{incidents.length}</span>
          <span className="text-[11px] text-sky-400 block mt-1">
            {incidents.filter(i => i.status === 'Resolved').length} Resolved
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Critical Alarms Active</span>
          <span className="text-3xl font-black text-red-500">{criticalCount}</span>
          <span className="text-[11px] text-red-400 font-semibold block mt-1 animate-pulse">
            Immediate Dispatch Req.
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Field Squads Deployed</span>
          <span className="text-3xl font-black text-amber-400">{deployedTeamsCount}</span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Of {responseTeams.length} Total Units
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Citizens Stranded / In Hazard</span>
          <span className="text-3xl font-black text-purple-400">{totalStranded}</span>
          <span className="text-[11px] text-purple-300 block mt-1">Across Active Sectors</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'incidents'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          Master Incidents Table ({incidents.length})
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'teams'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-400" />
          Response Teams ({responseTeams.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4 text-emerald-400" />
          Logistics & Resources ({resources.length})
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'broadcast'
              ? 'border-purple-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4 text-red-400" />
          Public Broadcasts ({announcements.length})
        </button>
      </div>

      {/* TAB 1: MASTER INCIDENTS TABLE */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search incidents by ID, keyword, address..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="Response In Progress">Response In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-4">Incident Title</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned Team</th>
                    <th className="py-3.5 px-4">Stranded</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-400">
                        {inc.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-white truncate">{inc.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">📍 {inc.location.address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{inc.disasterType}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <SeverityBadge severity={inc.severity} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <IncidentStatusBadge status={inc.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        {inc.assignedTeamName ? (
                          <span className="text-sky-300 font-medium">{inc.assignedTeamName}</span>
                        ) : (
                          <span className="text-amber-400 font-semibold text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {inc.peopleAffected}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(inc.id)}
                          className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 hover:text-white text-purple-300 font-semibold rounded-lg border border-purple-500/40 text-[11px] transition-colors"
                        >
                          Dispatch Team
                        </button>
                        {inc.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => updateIncidentStatus(inc.id, 'Resolved', 'Marked resolved by Admin Director')}
                            className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600 hover:text-white text-emerald-300 font-semibold rounded-lg border border-emerald-500/40 text-[11px] transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredIncidents.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No incidents match your filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RESPONSE TEAMS MANAGEMENT */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responseTeams.map(team => (
            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🚒
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      team.status === 'Deployed'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : team.status === 'En Route'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{team.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{team.specialization}</p>

                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                  <p>👤 Lead: <strong className="text-white">{team.leadName}</strong></p>
                  <p>👥 Active Crew: <strong className="text-white">{team.membersCount} Specialists</strong></p>
                  <p>📍 Base: <strong className="text-slate-300">{team.baseLocation}</strong></p>
                  {team.currentIncidentId && (
                    <p className="text-red-400 font-semibold">
                      🚨 Assigned: Ticket {team.currentIncidentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Switcher Buttons */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                  Change Unit Readiness
                </span>
                <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
                  {(['Available', 'Standby', 'Deployed'] as ResponseTeam['status'][]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateTeamStatus(team.id, st)}
                      className={`py-1 rounded-lg border transition-colors ${
                        team.status === st
                          ? 'bg-slate-700 text-white border-slate-500'
                          : 'bg-slate-800 text-slate-400 border-slate-750 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LOGISTICS & RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Resource Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Total Stock</th>
                    <th className="py-3.5 px-4">Deployed</th>
                    <th className="py-3.5 px-4">Available</th>
                    <th className="py-3.5 px-4">Depot Location</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {resources.map(res => {
                    const available = res.totalQuantity - res.deployedQuantity;
                    return (
                      <tr key={res.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{res.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{res.category}</td>
                        <td className="py-3.5 px-4 font-mono">{res.totalQuantity} {res.unit}</td>
                        <td className="py-3.5 px-4 font-mono text-amber-400 font-semibold">{res.deployedQuantity}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{available}</td>
                        <td className="py-3.5 px-4 text-slate-400">{res.location}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              res.status === 'Critical'
                                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                : res.status === 'Low'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => updateResourceQuantity(res.id, 1)}
                            disabled={available <= 0}
                            className="px-2 py-1 bg-amber-600/30 hover:bg-amber-600 hover:text-white text-amber-300 font-semibold rounded text-[11px] disabled:opacity-30"
                            title="Deploy 1 unit to field"
                          >
                            + Deploy 1
                          </button>
                          <button
                            type="button"
                            onClick={() => updateResourceQuantity(res.id, -1)}
                            disabled={res.deployedQuantity <= 0}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-[11px] disabled:opacity-30"
                            title="Recall 1 unit to depot"
                          >
                            - Return 1
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY ANNOUNCEMENTS & BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Create Announcement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                <Send className="w-4 h-4 text-red-400" />
                Broadcast Emergency Public Alert
              </h3>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Alert broadcasted across platform and sent to notifications!</span>
                </div>
              )}

              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Alert Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    placeholder="e.g. Flash Flood Evacuation Notice - Sector 4"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Alert Type</label>
                    <select
                      value={annType}
                      onChange={e => setAnnType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                    >
                      <option value="Evacuation">Evacuation</option>
                      <option value="Weather Warning">Weather Warning</option>
                      <option value="Safety Advisory">Safety Advisory</option>
                      <option value="Resource Update">Resource Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                    <select
                      value={annPriority}
                      onChange={e => setAnnPriority(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                    >
                      <option value="Critical">Critical Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Normal">Normal Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Affected Sectors / Corridors
                  </label>
                  <input
                    type="text"
                    value={annAreas}
                    onChange={e => setAnnAreas(e.target.value)}
                    placeholder="e.g. Marina Blvd, River Valley, Sector 3"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Detailed Emergency Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={annMessage}
                    onChange={e => setAnnMessage(e.target.value)}
                    placeholder="Explain mandatory instructions, evacuation shelters, road closures, and boil water notices..."
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>TRANSMIT STATEWIDE BROADCAST</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Existing Announcements */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-white text-base">Published Emergency Bulletins</h3>
            <div className="space-y-3">
              {announcements.map(ann => (
                <div
                  key={ann.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-3 transition-colors ${
                    ann.active
                      ? ann.priority === 'Critical'
                        ? 'border-red-500/60 bg-red-950/20'
                        : 'border-amber-500/50 bg-amber-950/15'
                      : 'border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ann.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                        {ann.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAnnouncementActive(ann.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        ann.active
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ann.active ? 'Active (Live)' : 'Archived'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Issued By: <strong className="text-white">{ann.issuedBy}</strong></span>
                    <span>Areas: <strong className="text-slate-200">{ann.affectedAreas.join(', ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Assignment Modal */}
      {assigningIncidentId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-white text-base">
              Dispatch Task Force to {assigningIncidentId}
            </h3>
            <p className="text-xs text-slate-400">
              Select an available rapid response crew from the tactical roster.
            </p>

            <div className="space-y-2">
              {responseTeams.map(t => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none text-xs transition-colors ${
                    selectedTeamId === t.id
                      ? 'bg-purple-950/40 border-purple-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="selectedTeam"
                      checked={selectedTeamId === t.id}
                      onChange={() => setSelectedTeamId(t.id)}
                      className="text-purple-600"
                    />
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.specialization}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{t.status}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Confirm Dispatch
              </button>
              <button
                type="button"
                onClick={() => setAssigningIncidentId(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
