export type UserRole = 'citizen' | 'response_team' | 'admin';

export type DisasterType =
  | 'Flood'
  | 'Fire'
  | 'Earthquake'
  | 'Cyclone'
  | 'Medical Emergency'
  | 'Landslide'
  | 'Building Collapse'
  | 'Chemical Hazard'
  | 'Severe Heatwave';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus =
  | 'Reported'
  | 'Under Review'
  | 'Assigned'
  | 'Response In Progress'
  | 'Resolved';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city: string;
}

export interface IncidentNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  text: string;
}

export interface Incident {
  id: string;
  title: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  status: IncidentStatus;
  location: LocationCoords;
  reportedAt: string;
  updatedAt: string;
  reportedBy: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  assignedTeamId?: string;
  assignedTeamName?: string;
  description: string;
  peopleAffected: number;
  hazardsPresent?: string[];
  imageUrl?: string;
  notes: IncidentNote[];
  timeline: {
    status: IncidentStatus;
    timestamp: string;
    note: string;
  }[];
}

export type ServiceType =
  | 'Hospital'
  | 'Fire Station'
  | 'Police'
  | 'Disaster Shelter'
  | 'Blood Bank'
  | 'Rescue Operations Base';

export interface EmergencyService {
  id: string;
  name: string;
  type: ServiceType;
  phone: string;
  secondaryPhone?: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  available24x7: boolean;
  capacity?: {
    total: number;
    available: number;
    unit: string;
  };
  distanceKm?: number;
  operationalStatus: 'Operational' | 'Limited' | 'Full';
}

export interface ResponseTeam {
  id: string;
  name: string;
  specialization: string;
  leadName: string;
  contact: string;
  membersCount: number;
  status: 'Available' | 'Deployed' | 'Standby' | 'En Route';
  currentIncidentId?: string;
  equipment: string[];
  baseLocation: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Vehicles' | 'Medical' | 'Rescue Equipment' | 'Shelter & Food' | 'Communications';
  totalQuantity: number;
  deployedQuantity: number;
  unit: string;
  location: string;
  status: 'Adequate' | 'Low' | 'Critical';
}

export interface EmergencyAnnouncement {
  id: string;
  title: string;
  type: 'Evacuation' | 'Weather Warning' | 'Safety Advisory' | 'Resource Update';
  priority: 'Critical' | 'High' | 'Normal';
  message: string;
  affectedAreas: string[];
  issuedAt: string;
  issuedBy: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  timestamp: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Info';
  read: boolean;
  link?: string;
  incidentId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  badgeNumber?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  address?: string;
  isSafe?: boolean;
  emergencyContacts: {
    id: string;
    name: string;
    relationship: string;
    phone: string;
  }[];
}
