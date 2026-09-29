import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { SosModal } from './SosModal';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Bell,
  Menu,
  X,
  PhoneCall,
  User,
  Activity,
  FileText,
  BarChart3,
  Hospital,
  BookOpen,
  LifeBuoy,
  ChevronDown,
  CheckCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    activeAnnouncement,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'response_team':
        return '/response-team';
      case 'citizen':
      default:
        return '/citizen';
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'response_team':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'citizen':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin Command';
      case 'response_team':
        return 'Response Team';
      case 'citizen':
      default:
        return 'Citizen';
    }
  };

  const handleSelectRole = (newRole: UserRole) => {
    switchRole(newRole);
    setIsRoleDropdownOpen(false);
    navigate(getDashboardRoute(newRole));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services', icon: Hospital },
    { name: 'Guidelines', path: '/guidelines', icon: BookOpen },
    { name: 'Report & Track', path: '/report', icon: FileText },
    {
      name:
        currentUser.role === 'admin'
          ? 'Admin EOC'
          : currentUser.role === 'response_team'
          ? 'Response Desk'
          : 'Citizen Hub',
      path: getDashboardRoute(currentUser.role),
      icon: Activity,
      highlight: true,
    },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Emergency Advisory Ticker */}
      {activeAnnouncement && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 truncate max-w-5xl mx-auto">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="bg-black/25 uppercase font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wider">
              {activeAnnouncement.type}
            </span>
            <span className="font-semibold">{activeAnnouncement.title}:</span>
            <span className="truncate opacity-95">{activeAnnouncement.message}</span>
          </div>
          <Link
            to="/report"
            className="text-[11px] underline font-bold whitespace-nowrap ml-3 hover:text-red-100"
          >
            Report Incident →
          </Link>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-white leading-none flex items-center gap-1.5">
                    SMART<span className="text-red-500">RESCUE</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                    Disaster Ops Platform
                  </span>
                </div>
              </Link>

              {/* Role Switcher Pill */}
              <div className="relative ml-2 hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${getRoleBadgeStyle(
                    currentUser.role
                  )} hover:brightness-110`}
                  title="Switch current testing role"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{getRoleLabel(currentUser.role)}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-slate-850 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                      Switch Active Role
                    </div>
                    <button
                      onClick={() => handleSelectRole('citizen')}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                        currentUser.role === 'citizen'
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Citizen</span>
                      <span className="text-[10px] opacity-75">Priya Sharma</span>
                    </button>
                    <button
                      onClick={() => handleSelectRole('response_team')}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                        currentUser.role === 'response_team'
                          ? 'bg-amber-500/20 text-amber-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Response Team</span>
                      <span className="text-[10px] opacity-75">Insp. Rajesh (NDRF)</span>
                    </button>
                    <button
                      onClick={() => handleSelectRole('admin')}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Admin EOC</span>
                      <span className="text-[10px] opacity-75">Dr. Anita Verma</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      active
                        ? 'bg-slate-800 text-white border-b-2 border-red-500 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    } ${link.highlight && !active ? 'text-sky-300' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: SOS, Notifications, Profile, Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick SOS Trigger Button */}
              <button
                type="button"
                onClick={() => setIsSosOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="tracking-wider">SOS</span>
              </button>

              {/* Notification Center Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in">
                    <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-red-400" />
                        <span className="font-bold text-sm text-white">Emergency Alerts</span>
                        <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications at this time
                        </div>
                      ) : (
                        notifications.slice(0, 6).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) {
                                navigate(n.link);
                                setIsNotifOpen(false);
                              }
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-800/80 transition-colors ${
                              !n.read ? 'bg-red-950/20 border-l-2 border-red-500' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`font-semibold ${
                                  n.priority === 'Critical'
                                    ? 'text-red-400'
                                    : n.priority === 'High'
                                    ? 'text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              >
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(n.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-300 line-clamp-2 text-[11px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-slate-850 bg-slate-900 border-t border-slate-800 text-center">
                      <Link
                        to="/profile#notifications"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs text-slate-300 hover:text-white font-medium"
                      >
                        View All in Notification Center →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Shortcut */}
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors group"
                title="View Profile & Settings"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-red-500 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden md:block text-xs font-semibold text-slate-200">
                  {currentUser.name.split(' ')[0]}
                </span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Current Role Mode:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold border ${getRoleBadgeStyle(currentUser.role)}`}>
                {getRoleLabel(currentUser.role)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <button
                onClick={() => {
                  handleSelectRole('citizen');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentUser.role === 'citizen' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  handleSelectRole('response_team');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentUser.role === 'response_team' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Responder
              </button>
              <button
                onClick={() => {
                  handleSelectRole('admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentUser.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Admin EOC
              </button>
            </div>

            <div className="space-y-1 pt-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive(link.path)
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-red-400" />}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white"
              >
                <User className="w-4 h-4" />
                <span>Account Switch / Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </>
  );
};
