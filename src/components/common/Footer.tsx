import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, Radio, HeartPulse, LifeBuoy, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Emergency Hotline Bar */}
      <div className="bg-red-950/40 border-b border-red-900/40 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
            <span>24/7 National Emergency Hotlines:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold">
            <a href="tel:112" className="bg-red-600/30 hover:bg-red-600/50 text-red-200 px-3 py-1.5 rounded-lg border border-red-500/40 transition-colors">
              🚨 All India Emergency: <strong>112</strong>
            </a>
            <a href="tel:108" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              🚑 Ambulance (CATS): <strong>108 / 102</strong>
            </a>
            <a href="tel:101" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              🚒 Fire Rescue: <strong>101</strong>
            </a>
            <a href="tel:1078" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
              🌐 NDMA Disaster Helpline: <strong>1078</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                SMART<span className="text-red-500">RESCUE</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Integrated real-time disaster management and emergency response network. Connecting affected citizens, rapid response task forces, and emergency operations commands.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                Operational Telemetry Active (All Systems Ready)
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Citizens</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="hover:text-white transition-colors">Report Emergency</Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-white transition-colors">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Find Hospitals & Shelters</Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">Disaster Survival Guides</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Emergency Contacts</Link>
              </li>
            </ul>
          </div>

          {/* Response Teams */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Response Units</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/response-team" className="hover:text-white transition-colors">Responder Dispatch Queue</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">Live Incident Tracker</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Command Resource Hub</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Incident Intelligence</Link>
              </li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Administration</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">EOC Master Control</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Triage Analytics & Trends</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Role Switcher / Sign In</Link>
              </li>
              <li>
                <a href="#demo-terms" onClick={(e) => { e.preventDefault(); alert("SmartRescue Demo Platform: Active demo version for emergency management prototyping."); }} className="hover:text-white transition-colors">
                  Protocol Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 SmartRescue Disaster Management System. For real emergencies always dial 112 immediately.</p>
          <div className="flex gap-4">
            <span>High-Availability Network</span>
            <span>•</span>
            <span>OpenStreetMap Telemetry</span>
            <span>•</span>
            <span>Encrypted Citizen Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
