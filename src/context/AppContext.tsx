import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Incident,
  EmergencyService,
  ResponseTeam,
  ResourceItem,
  EmergencyAnnouncement,
  AppNotification,
  IncidentStatus,
  DisasterType,
  SeverityLevel,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_INCIDENTS,
  EMERGENCY_SERVICES,
  RESPONSE_TEAMS,
  RESOURCE_ITEMS,
  ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  incidents: Incident[];
  addIncident: (data: {
    title: string;
    disasterType: DisasterType;
    severity: SeverityLevel;
    location: Incident['location'];
    description: string;
    peopleAffected: number;
    hazardsPresent?: string[];
    imageUrl?: string;
  }) => string;
  updateIncidentStatus: (incidentId: string, newStatus: IncidentStatus, note?: string) => void;
  addIncidentNote: (incidentId: string, text: string) => void;
  assignTeamToIncident: (incidentId: string, teamId: string) => void;
  services: EmergencyService[];
  responseTeams: ResponseTeam[];
  updateTeamStatus: (teamId: string, status: ResponseTeam['status']) => void;
  resources: ResourceItem[];
  updateResourceQuantity: (resourceId: string, deployedChange: number) => void;
  announcements: EmergencyAnnouncement[];
  addAnnouncement: (announcement: Omit<EmergencyAnnouncement, 'id' | 'issuedAt'>) => void;
  toggleAnnouncementActive: (id: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  triggerQuickSos: (lat?: number, lng?: number, address?: string) => string;
  toggleSafetyStatus: (isSafe: boolean) => void;
  activeAnnouncement: EmergencyAnnouncement | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current active user
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS.citizen;
  });

  // Incidents
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_incidents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_INCIDENTS;
  });

  // Response Teams
  const [responseTeams, setResponseTeams] = useState<ResponseTeam[]>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_teams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return RESPONSE_TEAMS;
  });

  // Resources
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_resources');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return RESOURCE_ITEMS;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<EmergencyAnnouncement[]>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ANNOUNCEMENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('smartrescue_live_nimmi_srm_notifs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Services
  const [services] = useState<EmergencyService[]>(EMERGENCY_SERVICES);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_teams', JSON.stringify(responseTeams));
  }, [responseTeams]);

  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('smartrescue_live_nimmi_srm_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const switchRole = (role: UserRole) => {
    if (INITIAL_USERS[role]) {
      setCurrentUser(INITIAL_USERS[role]);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
  };

  const addIncident = (data: {
    title: string;
    disasterType: DisasterType;
    severity: SeverityLevel;
    location: Incident['location'];
    description: string;
    peopleAffected: number;
    hazardsPresent?: string[];
    imageUrl?: string;
  }): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `INC-${randomNum}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      title: data.title,
      disasterType: data.disasterType,
      severity: data.severity,
      status: 'Reported',
      location: data.location,
      reportedAt: now,
      updatedAt: now,
      reportedBy: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        email: currentUser.email,
      },
      description: data.description,
      peopleAffected: data.peopleAffected,
      hazardsPresent: data.hazardsPresent || [],
      imageUrl: data.imageUrl,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: currentUser.name,
          role: currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'response_team' ? 'Response Team' : 'Citizen',
          timestamp: now,
          text: `Emergency reported via portal. Initial Severity: ${data.severity}`,
        },
      ],
      timeline: [
        {
          status: 'Reported',
          timestamp: now,
          note: 'Incident received and logged into emergency triage system',
        },
      ],
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Push notification to user
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Emergency Logged: ${newId}`,
      message: `Your emergency report for ${data.disasterType} has been assigned ticket ${newId}. Our triage desk is reviewing it immediately.`,
      timestamp: now,
      priority: data.severity === 'Critical' ? 'Critical' : 'High',
      read: false,
      link: `/report?track=${newId}`,
      incidentId: newId,
    };
    setNotifications(prev => [newNotification, ...prev]);

    return newId;
  };

  const updateIncidentStatus = (incidentId: string, newStatus: IncidentStatus, noteText?: string) => {
    const now = new Date().toISOString();
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== incidentId) return inc;

        const updatedTimeline = [
          ...inc.timeline,
          {
            status: newStatus,
            timestamp: now,
            note: noteText || `Status transitioned to ${newStatus} by ${currentUser.name}`,
          },
        ];

        const updatedNotes = noteText
          ? [
              ...inc.notes,
              {
                id: `note-${Date.now()}`,
                author: currentUser.name,
                role: currentUser.role === 'admin' ? 'Admin' : 'Response Team',
                timestamp: now,
                text: `[Status: ${newStatus}] ${noteText}`,
              },
            ]
          : inc.notes;

        return {
          ...inc,
          status: newStatus,
          updatedAt: now,
          timeline: updatedTimeline,
          notes: updatedNotes,
        };
      })
    );

    // Push notification
    const alertNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Incident ${incidentId} Updated`,
      message: `Status changed to "${newStatus}"${noteText ? `: ${noteText}` : ''}`,
      timestamp: now,
      priority: newStatus === 'Resolved' ? 'Info' : 'High',
      read: false,
      link: `/report?track=${incidentId}`,
      incidentId,
    };
    setNotifications(prev => [alertNotif, ...prev]);
  };

  const addIncidentNote = (incidentId: string, text: string) => {
    const now = new Date().toISOString();
    const newNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'response_team' ? 'Response Team' : 'Citizen',
      timestamp: now,
      text,
    };

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          updatedAt: now,
          notes: [...inc.notes, newNote],
        };
      })
    );
  };

  const assignTeamToIncident = (incidentId: string, teamId: string) => {
    const team = responseTeams.find(t => t.id === teamId);
    if (!team) return;
    const now = new Date().toISOString();

    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          assignedTeamId: team.id,
          assignedTeamName: team.name,
          status: inc.status === 'Reported' || inc.status === 'Under Review' ? 'Assigned' : inc.status,
          updatedAt: now,
          timeline: [
            ...inc.timeline,
            {
              status: 'Assigned',
              timestamp: now,
              note: `Assigned to ${team.name} (Lead: ${team.leadName})`,
            },
          ],
        };
      })
    );

    setResponseTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, status: 'Deployed', currentIncidentId: incidentId } : t))
    );
  };

  const updateTeamStatus = (teamId: string, status: ResponseTeam['status']) => {
    setResponseTeams(prev =>
      prev.map(t => (t.id === teamId ? { ...t, status } : t))
    );
  };

  const updateResourceQuantity = (resourceId: string, deployedChange: number) => {
    setResources(prev =>
      prev.map(res => {
        if (res.id !== resourceId) return res;
        const newDeployed = Math.max(0, Math.min(res.totalQuantity, res.deployedQuantity + deployedChange));
        const ratio = (res.totalQuantity - newDeployed) / res.totalQuantity;
        let newStatus: ResourceItem['status'] = 'Adequate';
        if (ratio < 0.2) newStatus = 'Critical';
        else if (ratio < 0.5) newStatus = 'Low';
        return {
          ...res,
          deployedQuantity: newDeployed,
          status: newStatus,
        };
      })
    );
  };

  const addAnnouncement = (data: Omit<EmergencyAnnouncement, 'id' | 'issuedAt'>) => {
    const newAnn: EmergencyAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`,
      issuedAt: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    // Broadcast notification
    const broadcastNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `EMERGENCY ALERT: ${data.title}`,
      message: data.message,
      timestamp: new Date().toISOString(),
      priority: data.priority === 'Critical' ? 'Critical' : 'High',
      read: false,
    };
    setNotifications(prev => [broadcastNotif, ...prev]);
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleSafetyStatus = (isSafe: boolean) => {
    setCurrentUser(prev => ({ ...prev, isSafe }));
  };

  const triggerQuickSos = (lat?: number, lng?: number, address?: string): string => {
    return addIncident({
      title: `URGENT SOS: Immediate Rescue Requested by ${currentUser.name}`,
      disasterType: 'Medical Emergency',
      severity: 'Critical',
      location: {
        lat: lat || 12.8230,
        lng: lng || 80.0450,
        address: address || currentUser.address || 'Near SRM IST KTR Campus, Potheri, Kattankulathur, Chengalpattu - 603203, Chennai',
        landmark: 'GPS Distress Beacon near SRM KTR / Potheri Station',
        city: 'Chengalpattu / Chennai',
      },
      description: `HIGH-PRIORITY 1-CLICK SOS TRIGGERED! Citizen reports active life-threatening danger. Direct dispatch required immediately. Phone: ${currentUser.phone}. Blood group: ${currentUser.bloodGroup || 'Unknown'}. Conditions: ${currentUser.medicalConditions || 'None specified'}.`,
      peopleAffected: 1,
      hazardsPresent: ['Immediate Life Safety Hazard', 'Distress Signal Active'],
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeAnnouncement = announcements.find(a => a.active);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        updateProfile,
        incidents,
        addIncident,
        updateIncidentStatus,
        addIncidentNote,
        assignTeamToIncident,
        services,
        responseTeams,
        updateTeamStatus,
        resources,
        updateResourceQuantity,
        announcements,
        addAnnouncement,
        toggleAnnouncementActive,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        triggerQuickSos,
        toggleSafetyStatus,
        activeAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
