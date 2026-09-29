# 🚨 Smart Rescue – Disaster Management & Emergency Response Platform

**A modern web-based platform for disaster management, emergency reporting, response tracking, and emergency assistance.**

[🌐 Live Demo](https://smart-rescue-disaster-management.vercel.app/) &nbsp; | &nbsp; [📂 GitHub Repository](https://github.com/Nimmi0707/Smart-rescue-disaster-management)

---

## 📌 Overview

**Smart Rescue** is a multi-page disaster management and emergency response platform designed to provide a centralized system for citizens, emergency response teams, and administrators.

The platform enables citizens to report emergency incidents, track their reports, access emergency services and safety guidelines, while response teams and administrators can monitor incidents, manage response activities, and view analytics.

The project focuses on making emergency reporting and disaster response more organized, accessible, and efficient through a modern and user-friendly web interface.

---

## ✨ Key Features

### 👤 Citizen Dashboard

- Report emergency incidents
- Track reported emergencies
- View emergency status
- Access emergency services
- View emergency safety guidelines
- SOS emergency assistance
- Manage profile and notifications

### 🚑 Response Team Dashboard

- View reported emergency incidents
- Monitor assigned incidents
- Track response activities
- Update incident status
- Manage emergency response operations

### 🛡️ Admin Dashboard

- Monitor emergency incidents
- Manage emergency response activities
- View operational information
- Monitor system data
- Access analytics and reports

### 📊 Analytics & Reports

- Emergency incident statistics
- Response activity analysis
- Data visualization
- Operational insights
- Graphical reports and charts

### 🗺️ Interactive Emergency Map

- Visualize emergency locations
- Location-based incident information
- Interactive map interface
- Emergency location tracking

### 📖 Emergency Guidelines

- Emergency preparedness information
- Disaster safety guidelines
- Quick access to emergency instructions

---

## 🛠️ Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS

### Libraries & Tools

- React Router
- Leaflet
- Recharts
- Lucide React

### Deployment & Version Control

- Git
- GitHub
- Vercel

---

## 🏗️ Application Modules

The application contains multiple modules for different types of users and emergency management activities:

| Module | Description |
|---|---|
| Home | Introduction and emergency overview |
| Emergency Services | Access to available emergency services |
| Emergency Guidelines | Disaster safety and preparedness information |
| Report & Track | Report and track emergency incidents |
| Citizen Dashboard | Citizen emergency management interface |
| Response Team | Emergency response monitoring |
| Admin Dashboard | Administrative management |
| Analytics | Emergency statistics and reports |
| Profile | User profile and notifications |

---

## 📂 Project Structure

```text
Smart-rescue-disaster-management/
│
├── src/
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── MapComponent.tsx
│   │   ├── Navbar.tsx
│   │   ├── SosModal.tsx
│   │   └── StatusBadge.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── AnalyticsReports.tsx
│   │   ├── CitizenDashboard.tsx
│   │   ├── EmergencyGuidelines.tsx
│   │   ├── EmergencyServices.tsx
│   │   ├── Home.tsx
│   │   ├── LoginRegister.tsx
│   │   ├── ProfileNotifications.tsx
│   │   ├── ReportTrackEmergency.tsx
│   │   └── ResponseTeamDashboard.tsx
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
