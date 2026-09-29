import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';
import {
  User,
  Bell,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  PlusCircle,
  PhoneCall,
  Mail,
  MapPin,
  Check,
  Sliders,
  Volume2,
  Radio,
  Users,
  Flame,
} from 'lucide-react';

export const ProfileNotifications: React.FC = () => {
  const {
    currentUser,
    switchRole,
    updateProfile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useApp();

  // Notification Filter Tab
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'critical'>('all');

  // Edit Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup || 'O+');
  const [medicalConditions, setMedicalConditions] = useState(currentUser.medicalConditions || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Emergency Contact Form
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Alert preferences
  const [alertSettings, setAlertSettings] = useState({
    smsAlerts: true,
    pushAlerts: true,
    sirenSounds: true,
    weatherWarnings: true,
  });

  const filteredNotifications = notifications.filter(n => {
    if (notifFilter === 'unread') return !n.read;
    if (notifFilter === 'critical') return n.priority === 'Critical';
    return true;
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      address,
      bloodGroup,
      medicalConditions,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newContact = {
      id: `ec-${Date.now()}`,
      name: newContactName,
      relationship: newContactRelation || 'Family',
      phone: newContactPhone,
    };

    updateProfile({
      emergencyContacts: [...currentUser.emergencyContacts, newContact],
    });

    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  const handleDeleteContact = (contactId: string) => {
    updateProfile({
      emergencyContacts: currentUser.emergencyContacts.filter(c => c.id !== contactId),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Identity & Communication Preferences
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Profile & Emergency Notifications</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Configure emergency medical telemetry, next-of-kin contacts, role permissions, and active alert channels.
          </p>
        </div>

        {/* Current Active Role Badge */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Role</div>
            <div className="text-sm font-bold text-white uppercase">{currentUser.role.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            Switch Active User Role Mode
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Instantly simulate permissions across all three crisis user types.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Citizen */}
          <button
            type="button"
            onClick={() => switchRole('citizen')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currentUser.role === 'citizen'
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Citizen Mode
              </span>
              {currentUser.role === 'citizen' && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report emergencies, drop GPS pin, track 5-step response lifecycle, view medical shelters, and broadcast safe check-in.
            </p>
          </button>

          {/* Responder */}
          <button
            type="button"
            onClick={() => switchRole('response_team')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currentUser.role === 'response_team'
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Response Team Mode
              </span>
              {currentUser.role === 'response_team' && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              View dispatched incidents, change status progression, add tactical observation notes, and review equipment loadouts.
            </p>
          </button>

          {/* Admin */}
          <button
            type="button"
            onClick={() => switchRole('admin')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currentUser.role === 'admin'
                ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400" />
                Admin EOC Mode
              </span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full control room access: assign teams to tickets, manage fleet & supplies, broadcast emergency alerts, and view analytics.
            </p>
          </button>
        </div>
      </div>

      {/* Main Grid: Profile & Contacts (Left) and Notification Center (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile & Medical Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-5 h-5 text-red-500" />
              Responder Medical & Contact Card
            </h2>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Profile particulars saved successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Emergency Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Blood Group (Critical for Triage)</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O- Universal)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">Home Evacuation Address / Location</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async pos => {
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=18&addressdetails=1`);
                              if (res.ok) {
                                const data = await res.json();
                                if (data && data.display_name) {
                                  setAddress(data.display_name.split(',').slice(0, 4).join(','));
                                  return;
                                }
                              }
                            } catch (e) {
                              console.warn(e);
                            }
                            setAddress(`Live GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
                          },
                          () => {
                            setAddress('Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai');
                          }
                        );
                      }
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
                  >
                    <MapPin className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Detect Live GPS</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                  <span className="text-slate-500">Quick set:</span>
                  <button
                    type="button"
                    onClick={() => setAddress('Near SRM IST (KTR Campus), Potheri, Kattankulathur, Chengalpattu - 603203, Chennai')}
                    className="text-sky-400 hover:underline"
                  >
                    📍 SRM KTR Campus, Chengalpattu
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => setAddress('Marina Beach Road, Triplicane, Chennai - 600005')}
                    className="text-sky-400 hover:underline"
                  >
                    🌊 Chennai Central
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Chronic Medical Conditions, Allergies & Medications
                </label>
                <textarea
                  rows={2}
                  value={medicalConditions}
                  onChange={e => setMedicalConditions(e.target.value)}
                  placeholder="e.g. Severe Penicillin allergy, Asthma (Albuterol inhaler required), Diabetic..."
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-600/20"
              >
                Save Emergency Profile
              </button>
            </form>
          </div>

          {/* Emergency Contacts Next-of-Kin Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Emergency Next-of-Kin Contacts
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isAddingContact ? 'Cancel' : 'Add Contact'}</span>
              </button>
            </div>

            {/* Add Contact Form */}
            {isAddingContact && (
              <form onSubmit={handleAddEmergencyContact} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3 text-xs animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newContactName}
                      onChange={e => setNewContactName(e.target.value)}
                      placeholder="e.g. Robert Jenkins"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={newContactRelation}
                      onChange={e => setNewContactRelation(e.target.value)}
                      placeholder="e.g. Spouse / Brother"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={newContactPhone}
                      onChange={e => setNewContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  Save Next-of-Kin
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {currentUser.emergencyContacts.map(contact => (
                <div
                  key={contact.id}
                  className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{contact.name}</h4>
                    <span className="text-[11px] text-slate-400">{contact.relationship} • {contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="Direct call"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notification Center & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Center */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-400" />
                <h2 className="text-base font-bold text-white">Emergency Alerts & Logs</h2>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setNotifFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  notifFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter('unread')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  notifFilter === 'unread' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter('critical')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  notifFilter === 'critical' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Critical
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No alerts match your filter.
                </div>
              ) : (
                filteredNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      !n.read
                        ? 'bg-red-950/20 border-red-500/50'
                        : 'bg-slate-800/60 border-slate-750 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-bold ${
                          n.priority === 'Critical'
                            ? 'text-red-400'
                            : n.priority === 'High'
                            ? 'text-amber-400'
                            : 'text-white'
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{n.message}</p>

                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-[11px] text-sky-400 hover:underline font-semibold"
                      >
                        Open Incident Tracker →
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Alert Broadcast Channels Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-slate-400" />
              Disaster Siren & Telemetry Channels
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-750">
                <span className="text-slate-300">Automated SMS Distress Relays</span>
                <input
                  type="checkbox"
                  checked={alertSettings.smsAlerts}
                  onChange={e => setAlertSettings(p => ({ ...p, smsAlerts: e.target.checked }))}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-750">
                <span className="text-slate-300">High-Decibel Siren on Critical SOS</span>
                <input
                  type="checkbox"
                  checked={alertSettings.sirenSounds}
                  onChange={e => setAlertSettings(p => ({ ...p, sirenSounds: e.target.checked }))}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-750">
                <span className="text-slate-300">NOAA Flash Flood & Storm Warnings</span>
                <input
                  type="checkbox"
                  checked={alertSettings.weatherWarnings}
                  onChange={e => setAlertSettings(p => ({ ...p, weatherWarnings: e.target.checked }))}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500 h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
