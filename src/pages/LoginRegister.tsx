import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldAlert,
  User,
  Users,
  Flame,
  Radio,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const { switchRole, updateProfile, currentUser } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('priya.sharma@example.in');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    setSuccessMsg(`Logged in successfully as ${role.toUpperCase()}`);
    setTimeout(() => {
      if (role === 'admin') navigate('/admin');
      else if (role === 'response_team') navigate('/response-team');
      else navigate('/citizen');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'signin') {
      if (!email) {
        setErrorMsg('Please enter an authorized email address.');
        return;
      }
      // Infer or match role
      let targetRole: UserRole = 'citizen';
      if (email.includes('ndrf') || email.includes('resp')) targetRole = 'response_team';
      else if (email.includes('ndma') || email.includes('admin')) targetRole = 'admin';

      switchRole(targetRole);
      setSuccessMsg(`Welcome back! Routing to ${targetRole} console...`);
      setTimeout(() => {
        if (targetRole === 'admin') navigate('/admin');
        else if (targetRole === 'response_team') navigate('/response-team');
        else navigate('/citizen');
      }, 700);
    } else {
      if (!name || !email || !phone) {
        setErrorMsg('Please complete all required fields for citizen registration.');
        return;
      }

      switchRole(selectedRole);
      updateProfile({
        name,
        email,
        phone,
        role: selectedRole,
      });

      setSuccessMsg('Account registered successfully! Loading workspace...');
      setTimeout(() => {
        if (selectedRole === 'admin') navigate('/admin');
        else if (selectedRole === 'response_team') navigate('/response-team');
        else navigate('/citizen');
      }, 700);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 items-center justify-center text-white shadow-xl shadow-red-600/30 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            SmartRescue Identity Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Emergency operations access for Citizens, Field Teams, and Command Officers
          </p>
        </div>

        {/* Demo Fast-Switch Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Instant Demo Role Switcher</span>
            <span className="text-[10px] text-red-400 font-semibold">1-Click Fast Preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen')}
              className="p-3 bg-slate-800/90 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Citizen</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Priya Sharma</p>
              <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Report & Track →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('response_team')}
              className="p-3 bg-slate-800/90 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Responder</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Insp. Rajesh (NDRF)</p>
              <span className="text-[10px] text-amber-400 font-medium mt-1 block">Dispatch Queue →</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-3 bg-slate-800/90 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">Admin EOC</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Dr. Anita Verma (NDMA)</p>
              <span className="text-[10px] text-purple-400 font-medium mt-1 block">Master Triage →</span>
            </button>
          </div>
        </div>

        {/* Tabbed Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors ${
                activeTab === 'signin'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In to Existing Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors ${
                activeTab === 'register'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New Profile
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('citizen')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedRole === 'citizen'
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Citizen
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('response_team')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedRole === 'response_team'
                          ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Responder
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedRole === 'admin'
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Emergency Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-8901"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 pt-3"
            >
              <span>{activeTab === 'signin' ? 'Sign In & Enter Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FIPS 140-3 Compliant Emergency Data Exchange Simulation</span>
        </div>
      </div>
    </div>
  );
};
