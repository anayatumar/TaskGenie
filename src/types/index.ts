export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';

export type AppLanguage = 'en' | 'ur' | 'ps'; // English, Urdu, Pashto

export type TaskStatus = 'inbox' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskCategory = 
  | 'general' 
  | 'call' 
  | 'follow_up' 
  | 'order' 
  | 'quotation' 
  | 'customer' 
  | 'delivery' 
  | 'purchase' 
  | 'service' 
  | 'meeting' 
  | 'payment' 
  | 'other';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Contact {
  id: string;
  name: string;
  organization: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
  notes?: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
  active: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeId?: string;
  assigneeName?: string;
  contactId?: string;
  contactName?: string;
  contactOrganization?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  reminderTime?: string;
  subtasks: SubTask[];
  sourceNoteId?: string;
  sourceNoteTitle?: string;
  sourceWhatsAppMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  id: string;
  taskTitle: string;
  assignee?: string;
  contactName?: string;
  organization?: string;
  dueDate?: string;
  confidence: number;
  convertedTaskId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  durationSeconds: number;
  peopleMentioned: string[];
  organizationsMentioned: string[];
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  category: 'meeting' | 'personal' | 'work' | 'general';
  audioUrl?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  taskId?: string;
  completed: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'reminder' | 'call' | 'note' | 'system';
  targetId?: string;
}

// User Profile Entity
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  avatar: string;
  bio: string;
}

// Company & Business Entity
export interface CompanyDetails {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  taxId: string;
  logo: string;
  size: string;
}

// Persistent AI Memory Entity (V2 Intelligence)
export interface AIMemory {
  id: string;
  key: string;
  value: string;
  category: 'partner' | 'preference' | 'workflow' | 'product';
  createdAt: string;
}

// Automation Rule Entity (V3 Agent)
export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
}

// Integration Connections State (V2 & V3 Architecture)
export interface IntegrationState {
  googleCalendar: boolean;
  appleCalendar: boolean;
  gmail: boolean;
  outlook: boolean;
  whatsappBusiness: boolean;
}

// Follow-Up Intelligence Entity (V2 Intelligence)
export interface FollowUpItem {
  id: string;
  title: string;
  person: string;
  waitingFor: string;
  createdAt: string;
  taskId?: string;
}

// Preferences Entity
export interface UserPreferences {
  voiceSpeed: number; // 0.8 to 1.2
  autoSpeakResponses: boolean;
  wakeWordEnabled: boolean;
  storeVoiceRecordings: boolean;
  keepTranscripts: boolean;
  notificationsEnabled: boolean;
  dailyBriefingEnabled: boolean;
  theme: 'dark' | 'glass' | 'oled';
  language: AppLanguage;
  geminiApiKey: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  company: CompanyDetails | null;
  preferences: UserPreferences;
}

export type IntentType = 
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'COMPLETE_TASK'
  | 'DELETE_TASK'
  | 'ASSIGN_TASK'
  | 'SET_REMINDER'
  | 'CREATE_NOTE'
  | 'START_NOTE_TAKING'
  | 'STOP_NOTE_TAKING'
  | 'SUMMARIZE'
  | 'EXTRACT_ACTION_ITEMS'
  | 'SEARCH'
  | 'SHOW_TASKS'
  | 'SHOW_NOTES'
  | 'SHOW_REMINDERS'
  | 'SHOW_CONTACTS'
  | 'GENERAL_CONVERSATION'
  | 'UNKNOWN';

export interface IntentResult {
  intent: IntentType;
  rawText: string;
  humanResponse: string;
  languageDetected: AppLanguage;
  extractedTask?: Partial<Task>;
  extractedNote?: Partial<Note>;
  extractedReminder?: Partial<Reminder>;
  matchedContact?: Contact;
  matchedTeamMember?: TeamMember;
  searchQuery?: string;
  confidence: number;
  missingInformation?: string[];
}

export interface Settings extends UserPreferences {
  userName: string;
  assistantName: string;
}
