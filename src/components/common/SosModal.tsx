import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, X, ShieldAlert, PhoneCall, MapPin, Radio, Check } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, triggerQuickSos } = useApp();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
    isLive: boolean;
  }>({
    lat: 12.8230,
    lng: 80.0450,
    label: currentUser.address || 'Near SRM IST KTR Campus, Chengalpattu, Chennai',
    isLive: false,
  });

  // Try to acquire device live GPS when SOS opens
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: `Live GPS Beacon: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`,
            isLive: true,
          });
        },
        () => {
          // If denied, keep default SRM KTR Chengalpattu Chennai
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isOpen && autoDispatch && countdown > 0 && !dispatchedId) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isOpen && autoDispatch && countdown === 0 && !dispatchedId) {
      handleConfirmDispatch();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, autoDispatch, dispatchedId]);

  if (!isOpen) return null;

  const handleConfirmDispatch = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      const incId = triggerQuickSos(
        gpsLocation.lat,
        gpsLocation.lng,
        gpsLocation.label || currentUser.address || 'Near SRM IST KTR Campus, Potheri, Chengalpattu, Chennai'
      );
      setIsTransmitting(false);
      setDispatchedId(incId);
    }, 1200);
  };

  const handleViewTracker = () => {
    if (dispatchedId) {
      onClose();
      navigate(`/report?track=${dispatchedId}`);
    }
  };

  const handleResetAndClose = () => {
    setCountdown(5);
    setAutoDispatch(true);
    setIsTransmitting(false);
    setDispatchedId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/80 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.35)] overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {dispatchedId ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Distress Signal Transmitted!</h3>
            <p className="text-slate-300 text-sm mb-4">
              Nearest first responder units have been notified. Incident ID:{' '}
              <span className="font-mono text-red-400 font-bold">{dispatchedId}</span>
            </p>
            <div className="bg-slate-800/80 rounded-xl p-4 text-left border border-slate-700 mb-6 space-y-1.5 text-xs text-slate-300">
              <p>🚨 Priority: <b className="text-red-400">CRITICAL PRIORITY 1</b></p>
              <p>📍 Location: <b>{currentUser.address || 'GPS Geolocation Broadcast'}</b></p>
              <p>👤 Caller: <b>{currentUser.name} ({currentUser.phone})</b></p>
              <p>🩸 Medical: <b>{currentUser.bloodGroup || 'O+'} - {currentUser.medicalConditions || 'No conditions logged'}</b></p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleViewTracker}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                Track Responder En Route →
              </button>
              <button
                onClick={handleResetAndClose}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600/30 border border-red-500 rounded-2xl flex items-center justify-center text-red-500 animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  EMERGENCY SOS BEACON
                </h3>
                <p className="text-xs text-red-400 font-medium tracking-wide">
                  State Emergency Operations Center Direct Link
                </p>
              </div>
            </div>

            <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 mb-5 text-sm text-red-200">
              <p className="font-semibold text-red-300 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Immediate Life Safety Distress Warning
              </p>
              This will instantly alert Police, Fire Rescue, and Emergency Medical Services to your location.
            </div>

            {/* Transmit Details Preview */}
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80 mb-6 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="truncate">
                  Transmitting Coordinates:{' '}
                  <strong className="text-white">
                    {gpsLocation.lat.toFixed(4)}° N, {gpsLocation.lng.toFixed(4)}° E
                  </strong>{' '}
                  <span className="text-[10px] text-emerald-400">
                    ({gpsLocation.isLive ? 'Live GPS Detected' : 'Chengalpattu near SRM KTR, Chennai'})
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>Contact: <strong className="text-white">{currentUser.name} ({currentUser.phone})</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Telemetry: Automatic GPS Distress Ping + Next-of-Kin SMS</span>
              </div>
            </div>

            {/* Countdown / Dispatch Buttons */}
            {autoDispatch && countdown > 0 && !isTransmitting && (
              <div className="mb-5 text-center bg-slate-800/40 p-3 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Auto-broadcasting distress signal in</p>
                <div className="text-3xl font-black text-red-500 font-mono tracking-tight animate-bounce">
                  00:0{countdown}
                </div>
                <button
                  onClick={() => setAutoDispatch(false)}
                  className="mt-2 text-[11px] text-slate-400 hover:text-white underline"
                >
                  Pause countdown and review manually
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDispatch}
                disabled={isTransmitting}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isTransmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Broadcasting Beacon...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5" />
                    DISPATCH RESCUE NOW
                  </>
                )}
              </button>
              <button
                onClick={handleResetAndClose}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
