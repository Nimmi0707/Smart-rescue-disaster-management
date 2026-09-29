import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './pages/Home';
import { EmergencyServices } from './pages/EmergencyServices';
import { EmergencyGuidelines } from './pages/EmergencyGuidelines';
import { LoginRegister } from './pages/LoginRegister';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportTrackEmergency } from './pages/ReportTrackEmergency';
import { ResponseTeamDashboard } from './pages/ResponseTeamDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AnalyticsReports } from './pages/AnalyticsReports';
import { ProfileNotifications } from './pages/ProfileNotifications';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white">
          {/* Universal Sticky Navbar */}
          <Navbar />

          {/* Main App Content Area */}
          <main className="flex-1">
            <Routes>
              {/* 1. Home Landing Page */}
              <Route path="/" element={<Home />} />

              {/* 2. Emergency Services Directory */}
              <Route path="/services" element={<EmergencyServices />} />

              {/* 3. Emergency Guidelines & Survival Kit */}
              <Route path="/guidelines" element={<EmergencyGuidelines />} />

              {/* 4. Login & Registration Portal */}
              <Route path="/login" element={<LoginRegister />} />

              {/* 5. Citizen Dashboard */}
              <Route path="/citizen" element={<CitizenDashboard />} />

              {/* 6. Report & Track Emergency */}
              <Route path="/report" element={<ReportTrackEmergency />} />

              {/* 7. Response Team Dashboard */}
              <Route path="/response-team" element={<ResponseTeamDashboard />} />

              {/* 8. Admin Operations Dashboard */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* 9. Analytics & Reporting Hub */}
              <Route path="/analytics" element={<AnalyticsReports />} />

              {/* 10. Profile & Notifications Center */}
              <Route path="/profile" element={<ProfileNotifications />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Universal Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
