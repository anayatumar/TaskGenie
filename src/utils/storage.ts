import { Task, Contact, Note, TeamMember, Reminder, UserProfile, CompanyDetails, UserPreferences, AuthState } from '../types';

const STORAGE_KEYS = {
  AUTH_SESSION: 'taskgenie_auth_session',
  USER_PROFILE: 'taskgenie_user_profile',
  COMPANY_DETAILS: 'taskgenie_company_details',
  PREFERENCES: 'taskgenie_preferences',
  TASKS: 'taskgenie_tasks',
  CONTACTS: 'taskgenie_contacts',
  NOTES: 'taskgenie_notes',
  TEAM: 'taskgenie_team',
  REMINDERS: 'taskgenie_reminders',
};

// Default User & Company Seed
const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex.morgan@taskgenie.app',
  title: 'Operations Director',
  phone: '+92 300 123 4567',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  bio: 'Managing cross-functional team operations and customer equipment deliveries.',
};

const DEFAULT_COMPANY: CompanyDetails = {
  id: 'cmp_001',
  companyName: 'TaskGenie Enterprise',
  industry: 'Medical & Scientific Instruments',
  location: 'Lahore, Pakistan',
  taxId: 'PK-9876543-A',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=250',
  size: '10-50 Employees',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  voiceSpeed: 1.0,
  autoSpeakResponses: true,
  wakeWordEnabled: true,
  storeVoiceRecordings: true,
  keepTranscripts: true,
  notificationsEnabled: true,
  dailyBriefingEnabled: true,
  theme: 'glass',
  language: 'en',
  geminiApiKey: '',
};

// Auth & Session Storage
export function getStoredAuthState(): AuthState {
  const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  const isAuthenticated = session === 'true';
  return {
    isAuthenticated,
    user: getStoredUserProfile(),
    company: getStoredCompanyDetails(),
    preferences: getStoredPreferences(),
  };
}

export function setAuthSession(authenticated: boolean): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, authenticated ? 'true' : 'false');
}

export function getStoredUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getStoredCompanyDetails(): CompanyDetails {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPANY_DETAILS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMPANY_DETAILS, JSON.stringify(DEFAULT_COMPANY));
      return DEFAULT_COMPANY;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_COMPANY;
  }
}

export function saveCompanyDetails(company: CompanyDetails): void {
  localStorage.setItem(STORAGE_KEYS.COMPANY_DETAILS, JSON.stringify(company));
}

export function getStoredPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}

// Data Download & Backup Helper
export function downloadBackupJSON(): void {
  const data = {
    exportDate: new Date().toISOString(),
    profile: getStoredUserProfile(),
    company: getStoredCompanyDetails(),
    preferences: getStoredPreferences(),
    tasks: getStoredTasks(),
    contacts: getStoredContacts(),
    notes: getStoredNotes(),
    team: getStoredTeam(),
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `TaskGenie_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Permanent Account Deletion
export function deleteAccountAndData(): void {
  localStorage.clear();
  window.location.reload();
}

// Entity Storage Wrappers
export function getStoredTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getStoredContacts(): Contact[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
}

export function getStoredNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

export function getStoredTeam(): TeamMember[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEAM);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTeam(team: TeamMember[]): void {
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
}
