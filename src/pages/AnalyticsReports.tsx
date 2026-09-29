import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export const AnalyticsReports: React.FC = () => {
  const { incidents, responseTeams, resources } = useApp();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1yr'>('30d');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // 1. Incidents by Disaster Type
  const disasterTypeCounts: Record<string, number> = {};
  incidents.forEach(inc => {
    disasterTypeCounts[inc.disasterType] = (disasterTypeCounts[inc.disasterType] || 0) + 1;
  });
  const disasterData = Object.entries(disasterTypeCounts).map(([type, count]) => ({
    name: type,
    incidents: count,
  }));

  // 2. Severity Breakdown
  const severityCounts: Record<string, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };
  incidents.forEach(inc => {
    severityCounts[inc.severity] = (severityCounts[inc.severity] || 0) + 1;
  });
  const severityData = [
    { name: 'Critical', value: severityCounts.Critical, color: '#ef4444' },
    { name: 'High', value: severityCounts.High, color: '#f59e0b' },
    { name: 'Medium', value: severityCounts.Medium, color: '#eab308' },
    { name: 'Low', value: severityCounts.Low, color: '#3b82f6' },
  ];

  // 3. Status Funnel
  const statusCounts: Record<string, number> = {
    Reported: 0,
    'Under Review': 0,
    Assigned: 0,
    'Response In Progress': 0,
    Resolved: 0,
  };
  incidents.forEach(inc => {
    statusCounts[inc.status] = (statusCounts[inc.status] || 0) + 1;
  });
  const statusData = [
    { stage: 'Reported', count: statusCounts.Reported, fill: '#64748b' },
    { stage: 'Under Review', count: statusCounts['Under Review'], fill: '#eab308' },
    { stage: 'Assigned', count: statusCounts.Assigned, fill: '#38bdf8' },
    { stage: 'In Progress', count: statusCounts['Response In Progress'], fill: '#3b82f6' },
    { stage: 'Resolved', count: statusCounts.Resolved, fill: '#10b981' },
  ];

  // 4. Monthly Trend Data
  const monthlyTrends = [
    { month: 'Apr', flood: 12, fire: 8, medical: 25, tremor: 2 },
    { month: 'May', flood: 15, fire: 14, medical: 28, tremor: 1 },
    { month: 'Jun', flood: 22, fire: 29, medical: 31, tremor: 3 },
    { month: 'Jul', flood: 18, fire: 42, medical: 35, tremor: 4 },
    { month: 'Aug', flood: 34, fire: 38, medical: 32, tremor: 2 },
    { month: 'Sep', flood: 48, fire: 22, medical: 40, tremor: 5 },
  ];

  // 5. Resolution Times by Category (Average minutes)
  const resolutionTimes = [
    { category: 'Medical EMS', avgMinutes: 14, benchmark: 15 },
    { category: 'Fire Rescue', avgMinutes: 28, benchmark: 30 },
    { category: 'Swiftwater Flood', avgMinutes: 52, benchmark: 60 },
    { category: 'HAZMAT Spill', avgMinutes: 75, benchmark: 90 },
    { category: 'Landslide Removal', avgMinutes: 180, benchmark: 240 },
  ];

  const handleExport = (type: 'PDF' | 'CSV') => {
    setExportNotice(`Generating comprehensive ${type} Intelligence Briefing... Download starting.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            State Intelligence & Analytics
          </span>
          <h1 className="text-3xl font-black text-white mt-1">
            Emergency Analytics & Incident Reporting
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Triage telemetry, disaster distribution, resource efficiency, and historical trend modeling.
          </p>
        </div>

        {/* Export & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="bg-slate-900 border border-slate-700 p-1 rounded-xl flex items-center text-xs">
            {(['30d', '90d', '1yr'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  timeRange === r ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleExport('CSV')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Briefing PDF</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {exportNotice && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-sky-300 flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Executive Key Metric Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Average Response Dispatch</span>
          <span className="text-3xl font-black text-emerald-400">6m 24s</span>
          <span className="text-[10px] text-emerald-300 block mt-1">18% faster than 2025 avg</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Resolution Success Rate</span>
          <span className="text-3xl font-black text-white">88.4%</span>
          <span className="text-[10px] text-sky-400 block mt-1">324 Successful Interventions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Citizens Evacuated to Safety</span>
          <span className="text-3xl font-black text-purple-400">1,480</span>
          <span className="text-[10px] text-purple-300 block mt-1">Across 8 active shelters</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs text-slate-400 block mb-1">Fleet Operational Readiness</span>
          <span className="text-3xl font-black text-amber-400">94.2%</span>
          <span className="text-[10px] text-amber-300 block mt-1">Ambulances & Firecraft ready</span>
        </div>
      </div>

      {/* Chart Row 1: Disaster Types (Bar) & Severity Breakdown (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Disaster Type Distribution */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-500" />
              Incidents Categorized by Disaster Classification
            </h3>
            <span className="text-[11px] text-slate-500">Live dataset count</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disasterData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="incidents" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown Donut Chart */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              Emergency Severity Proportion
            </h3>
            <span className="text-[11px] text-slate-500">Triage level ratio</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(val: string) => <span className="text-slate-300 text-xs">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Monthly Trends & Status Lifecycle Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              6-Month Incident Surge & Seasonality Trends
            </h3>
            <span className="text-[11px] text-slate-500">Floods vs Wildfires</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="flood" name="Water Surges & Floods" stroke="#38bdf8" fillOpacity={1} fill="url(#floodGrad)" />
                <Area type="monotone" dataKey="fire" name="Structural & Wildfires" stroke="#ef4444" fillOpacity={1} fill="url(#fireGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Lifecycle Funnel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Incident Status Pipeline Funnel
            </h3>
            <span className="text-[11px] text-slate-500">Workflow volume</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Average Resolution Times by Disaster Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Field Resolution Response Times vs State Benchmark (Minutes)
          </h3>
          <span className="text-[11px] text-slate-500">Lower is better</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionTimes} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="avgMinutes" name="Actual Avg Time (Mins)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="State SLA Limit (Mins)" fill="#475569" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
