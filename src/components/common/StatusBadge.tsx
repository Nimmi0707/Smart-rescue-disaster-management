import React from 'react';
import { SeverityLevel, IncidentStatus } from '../../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Activity, Radio } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  switch (severity) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full bg-red-500/20 text-red-400 border border-red-500/40 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping mr-0.5" />
          <AlertCircle className="w-3.5 h-3.5" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 ${sizeClasses}`}>
          <Activity className="w-3.5 h-3.5" />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          Low
        </span>
      );
  }
};

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'Reported':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-700/80 text-slate-200 border border-slate-600 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Reported
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 ${sizeClasses}`}>
          <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
          Under Review
        </span>
      );
    case 'Assigned':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 ${sizeClasses}`}>
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          Assigned
        </span>
      );
    case 'Response In Progress':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-blue-600/30 text-blue-200 border border-blue-400/50 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping mr-0.5" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Resolved
        </span>
      );
    default:
      return null;
  }
};
