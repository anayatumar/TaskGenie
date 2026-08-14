import React, { useState, useEffect } from 'react';
import {
  VoiceState,
  Task,
  Contact,
  Note,
  TeamMember,
  UserProfile,
  CompanyDetails,
  UserPreferences,
  IntentResult,
  AppLanguage,
  AppNotification,
  AIMemory,
} from './types';
import {
  getStoredTasks,
  saveTasks,
  getStoredContacts,
  saveContacts,
  getStoredNotes,
  saveNotes,
  getStoredTeam,
  saveTeam,
  getStoredAuthState,
  setAuthSession,
  saveUserProfile,
  saveCompanyDetails,
  savePreferences,
  deleteAccountAndData,
} from './utils/storage';
import {
  getStoredNotifications,
  saveNotifications,
  requestNotificationPermissions,
  checkAndTriggerDueReminders,
  triggerSystemNotification,
  getStoredMobileNotificationSettings,
} from './utils/notifications';
import { getStoredMemories } from './utils/aiMemory';
import { handleWebShareIncoming } from './utils/whatsappShare';
import { speechEngine } from './utils/speech';
import { processVoiceCommand } from './utils/aiEngine';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TasksView } from './components/TasksView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ContactsView } from './components/ContactsView';
import { TeamView } from './components/TeamView';
import { NotesView } from './components/NotesView';
import { WhatsAppImportModal } from './components/WhatsAppImportModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsView } from './components/SettingsView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { SideDrawer } from './components/SideDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DocumentScannerModal } from './components/DocumentScannerModal';
import { MemoryManagerModal } from './components/MemoryManagerModal';
import { AutomationsModal } from './components/AutomationsModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [intentResult, setIntentResult] = useState<IntentResult | null>(null);

  // Auth & Profile State
  const initialAuth = getStoredAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth.isAuthenticated);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialAuth.user);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(initialAuth.company);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(initialAuth.preferences);

  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [memories, setMemories] = useState<AIMemory[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);
  const [isHandsFreeAutoSave, setIsHandsFreeAutoSave] = useState(false);

  // Modals & Drawers
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [isWhatsAppImportOpen, setIsWhatsAppImportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  // V2 & V3 Intelligence Modals
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isDocumentScannerOpen, setIsDocumentScannerOpen] = useState(false);
  const [isMemoryManagerOpen, setIsMemoryManagerOpen] = useState(false);
  const [isAutomationsOpen, setIsAutomationsOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    const loadedTasks = getStoredTasks();
    const loadedContacts = getStoredContacts();
    const loadedTeam = getStoredTeam();

    setTasks(loadedTasks);
    setContacts(loadedContacts);
    setNotes(getStoredNotes());
    setTeam(loadedTeam);
    setMemories(getStoredMemories());
    setNotifications(getStoredNotifications());

    requestNotificationPermissions();

    handleWebShareIncoming(
      loadedContacts,
      loadedTeam,
      userPreferences.language,
      userPreferences.geminiApiKey,
      (sharedTask) => {
        setTasks((prev) => [sharedTask, ...prev]);
        const mobileSettings = getStoredMobileNotificationSettings();
        triggerSystemNotification('WhatsApp Task Imported', `Task: ${sharedTask.title}`, 'task', mobileSettings, sharedTask.id);
      }
    );

    const hasSeenOnboarding = localStorage.getItem('taskgenie_onboarding_seen');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Automated 3-second Reminder & Sound Alarm Monitor (Ultra-Fast Instant Trigger)
  useEffect(() => {
    const checkReminders = () => {
      if (tasks.length > 0) {
        const mobileSettings = getStoredMobileNotificationSettings();
        const triggered = checkAndTriggerDueReminders(tasks, mobileSettings);
        if (triggered.length > 0) {
          setNotifications(getStoredNotifications());
        }
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 3000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Save changes
  useEffect(() => {
    if (tasks.length > 0) saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (contacts.length > 0) saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    if (notes.length > 0) saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (team.length > 0) saveTeam(team);
  }, [team]);

  // Company Team Handlers
  const handleAddTeamMember = (memberData: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name: memberData.name || 'New Team Member',
      role: memberData.role || 'Operations Member',
      phone: memberData.phone || '+92 300 0000000',
      email: memberData.email || 'employee@company.com',
      avatar: memberData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      active: true,
    };
    const updated = [newMember, ...team];
    setTeam(updated);
    saveTeam(updated);
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    const updated = team.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    setTeam(updated);
    saveTeam(updated);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    const updated = team.filter((m) => m.id !== memberId);
    setTeam(updated);
    saveTeam(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setIsAuthenticated(true);
    setUserProfile(user);
    setAuthSession(true);
    saveUserProfile(user);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAuthSession(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to permanently delete your account and wipe all stored data? This action cannot be undone.')) {
      deleteAccountAndData();
    }
  };

  const handleChangeLanguage = (lang: AppLanguage) => {
    const updated = { ...userPreferences, language: lang };
    setUserPreferences(updated);
    savePreferences(updated);
    speechEngine.setLanguage(lang);
  };

  const handleActivateMic = async () => {
    speechEngine.stopSpeaking();
    setIsVoiceModalOpen(true);
    setVoiceState('LISTENING');
    setTranscript('');
    setIntentResult(null);

    speechEngine.setLanguage(userPreferences.language);

    await speechEngine.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          handleProcessVoiceInput(text);
        }
      },
      (err) => {
        setVoiceState('ERROR');
        console.warn('Speech error:', err);
      },
      () => {},
      (level) => {
        setAudioLevel(level);
      }
    );
  };

  const handleProcessVoiceInput = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    setTranscript(spokenText);
    setVoiceState('PROCESSING');
    speechEngine.stopListening();

    const result = await processVoiceCommand(
      spokenText,
      contacts,
      team,
      userPreferences.language,
      userPreferences.geminiApiKey
    );

    setIntentResult(result);
    setVoiceState('SUCCESS');

    setIsVoiceModalOpen(false);
    speechEngine.stopSpeaking();

    const extractedTaskData: Partial<Task> = result.extractedTask || {
      title: spokenText,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      priority: 'normal',
      category: 'quotation',
      contactId: result.matchedContact?.id,
      contactName: result.matchedContact?.name,
      contactOrganization: result.matchedContact?.organization,
    };

    setEditingTask(null);
    setIsHandsFreeAutoSave(true);
    setIsTaskModalOpen(true);
  };

  const handleConfirmTaskFromModal = () => {
    setIsVoiceModalOpen(false);
    setVoiceState('IDLE');
    speechEngine.stopSpeaking();
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask((prev) => prev ? { ...prev, status: prev.status === 'completed' ? 'pending' : 'completed' } : null);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : t
      )
    );
    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask((prev) => prev ? {
        ...prev,
        subtasks: prev.subtasks.map((st) => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      } : null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedDetailTask && selectedDetailTask.id === taskId) {
      setSelectedDetailTask(null);
      setIsTaskDetailModalOpen(false);
    }
  };

  const handleSaveManualTask = (taskData: Partial<Task>) => {
    const mobileSettings = getStoredMobileNotificationSettings();

    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );

      const notifMsg = taskData.assigneeName
        ? `Task '${taskData.title}' delegated to ${taskData.assigneeName}`
        : `Task updated: ${taskData.title}`;

      triggerSystemNotification('Task Updated / Delegated', notifMsg, 'task', mobileSettings, taskData.id);
    } else {
      const newTask: Task = {
        id: `t_${Date.now()}`,
        title: taskData.title || 'Untitled Task',
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority || 'normal',
        category: taskData.category || 'general',
        dueDate: taskData.dueDate,
        dueTime: taskData.dueTime,
        assigneeId: taskData.assigneeId,
        assigneeName: taskData.assigneeName,
        contactId: taskData.contactId,
        contactName: taskData.contactName,
        contactOrganization: taskData.contactOrganization,
        subtasks: taskData.subtasks || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);

      const notifMsg = newTask.assigneeName
        ? `🔔 Assigned Task '${newTask.title}' to ${newTask.assigneeName}`
        : `Task Scheduled: ${newTask.title}`;

      triggerSystemNotification('Task Delegated & Scheduled', notifMsg, 'task', mobileSettings, newTask.id);
    }

    setNotifications(getStoredNotifications());
    setEditingTask(null);
    setIsHandsFreeAutoSave(false);
  };

  const handleAddContact = (contactData: Partial<Contact>) => {
    const newContact: Contact = {
      id: `c_${Date.now()}`,
      name: contactData.name || 'New Contact',
      organization: contactData.organization || 'General',
      role: contactData.role || 'Partner',
      phone: contactData.phone || '+92 300 000 0000',
      email: contactData.email || 'contact@domain.com',
      avatar: contactData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      tags: contactData.tags || [],
    };
    setContacts((prev) => [newContact, ...prev]);
  };

  const handleSaveNote = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev]);
    const mobileSettings = getStoredMobileNotificationSettings();
    triggerSystemNotification('AI Meeting Note Saved', `Note: ${newNote.title}`, 'note', mobileSettings, newNote.id);
    setNotifications(getStoredNotifications());
  };

  const handleConvertActionItemsToTasks = (note: Note) => {
    const createdTasks: Task[] = note.actionItems.map((ai) => {
      const matched = contacts.find(
        (c) => c.name.toLowerCase() === ai.contactName?.toLowerCase()
      );
      return {
        id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        title: ai.taskTitle,
        status: 'pending',
        priority: 'high',
        category: 'general',
        dueDate: ai.dueDate || new Date().toISOString().split('T')[0],
        contactId: matched?.id,
        contactName: ai.contactName || matched?.name,
        contactOrganization: ai.organization || matched?.organization,
        sourceNoteId: note.id,
        sourceNoteTitle: note.title,
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    setTasks((prev) => [...createdTasks, ...prev]);
    alert(`Converted ${createdTasks.length} action items into tasks!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <LandingPage
          onOpenSignIn={() => {
            setAuthMode('signin');
            setIsAuthModalOpen(true);
          }}
          onOpenSignUp={() => {
            setAuthMode('signup');
            setIsAuthModalOpen(true);
          }}
          onDemoLogin={() => {
            const demoUser: UserProfile = {
              id: 'usr_demo',
              name: 'Alex Morgan',
              email: 'alex.morgan@taskgenie.app',
              title: 'Operations Director',
              phone: '+92 300 123 4567',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
              bio: 'Managing cross-functional team operations and customer equipment deliveries.',
            };
            handleLoginSuccess(demoUser);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header
        user={userProfile}
        company={companyDetails}
        isAuthenticated={isAuthenticated}
        tasks={tasks}
        notifications={notifications}
        language={userPreferences.language}
        onChangeLanguage={handleChangeLanguage}
        onOpenSideDrawer={() => setIsSideDrawerOpen(true)}
        onOpenWhatsAppImport={() => setIsWhatsAppImportOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isDarkHeader={activeTab === 'home'}
      />

      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <HomeView
            user={userProfile}
            tasks={tasks}
            contacts={contacts}
            language={userPreferences.language}
            onActivateMic={handleActivateMic}
            onOpenCreateTaskModal={() => {
              setEditingTask(null);
              setIsHandsFreeAutoSave(false);
              setIsTaskModalOpen(true);
            }}
            onViewTasks={() => setActiveTab('tasks')}
            onViewNotes={() => setActiveTab('notes')}
            onViewContacts={() => setActiveTab('contacts')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsHandsFreeAutoSave(false);
              setIsTaskModalOpen(true);
            }}
            onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
            onOpenDocumentScanner={() => setIsDocumentScannerOpen(true)}
            onOpenMemoryManager={() => setIsMemoryManagerOpen(true)}
            onOpenAutomationsManager={() => setIsAutomationsOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            contacts={contacts}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTask}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsHandsFreeAutoSave(false);
              setIsTaskModalOpen(true);
            }}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsHandsFreeAutoSave(false);
              setIsTaskModalOpen(true);
            }}
            onOpenDetail={(task) => {
              setSelectedDetailTask(task);
              setIsTaskDetailModalOpen(true);
            }}
          />
        )}

        {activeTab === 'team' && (
          <TeamView
            team={team}
            tasks={tasks}
            user={userProfile}
            onAddTeamMember={handleAddTeamMember}
            onUpdateTeamMember={handleUpdateTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsHandsFreeAutoSave(false);
              setIsTaskModalOpen(true);
            }}
            onToggleCompleteTask={handleToggleComplete}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onSaveNote={handleSaveNote}
            onConvertActionItemsToTasks={handleConvertActionItemsToTasks}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsView contacts={contacts} onAddContact={handleAddContact} />
        )}

        {activeTab === 'settings' && userProfile && companyDetails && (
          <SettingsView
            user={userProfile}
            company={companyDetails}
            preferences={userPreferences}
            onSaveProfile={(prof) => {
              setUserProfile(prof);
              saveUserProfile(prof);
            }}
            onSaveCompany={(cmp) => {
              setCompanyDetails(cmp);
              saveCompanyDetails(cmp);
            }}
            onSavePreferences={(prefs) => {
              setUserPreferences(prefs);
              savePreferences(prefs);
            }}
            onSignOut={handleSignOut}
            onDeleteAccount={handleDeleteAccount}
            onOpenMemoryManager={() => setIsMemoryManagerOpen(true)}
            onOpenAutomationsManager={() => setIsAutomationsOpen(true)}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onActivateMic={handleActivateMic}
        onOpenCreateTaskModal={() => {
          setEditingTask(null);
          setIsHandsFreeAutoSave(false);
          setIsTaskModalOpen(true);
        }}
        pendingTasksCount={tasks.filter((t) => t.status !== 'completed').length}
      />

      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        user={userProfile}
        company={companyDetails}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSignOut={handleSignOut}
        onOpenAuth={() => {
          setAuthMode('signin');
          setIsAuthModalOpen(true);
        }}
      />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => {
          setIsVoiceModalOpen(false);
          setVoiceState('IDLE');
          speechEngine.stopListening();
          speechEngine.stopSpeaking();
        }}
        voiceState={voiceState}
        transcript={transcript}
        intentResult={intentResult}
        audioLevel={audioLevel}
        onActivateMic={handleActivateMic}
        onConfirmTask={handleConfirmTaskFromModal}
        onManualEdit={() => {
          setIsVoiceModalOpen(false);
          if (intentResult?.extractedTask) {
            const tempTask: Task = {
              id: `t_${Date.now()}`,
              title: intentResult.extractedTask.title || transcript,
              description: intentResult.extractedTask.description || '',
              status: 'pending',
              priority: intentResult.extractedTask.priority || 'normal',
              category: intentResult.extractedTask.category || 'general',
              dueDate: intentResult.extractedTask.dueDate || new Date().toISOString().split('T')[0],
              dueTime: intentResult.extractedTask.dueTime || '17:00',
              assigneeId: intentResult.extractedTask.assigneeId,
              assigneeName: intentResult.extractedTask.assigneeName,
              contactId: intentResult.matchedContact?.id,
              contactName: intentResult.matchedContact?.name,
              contactOrganization: intentResult.matchedContact?.organization,
              subtasks: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setEditingTask(tempTask);
          }
          setIsHandsFreeAutoSave(false);
          setIsTaskModalOpen(true);
        }}
        onSubmitTextCommand={(text) => handleProcessVoiceInput(text)}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setIsHandsFreeAutoSave(false);
        }}
        contacts={contacts}
        team={team}
        onSaveTask={handleSaveManualTask}
        initialTask={intentResult?.extractedTask}
        taskToEdit={editingTask}
        isHandsFreeAutoSave={isHandsFreeAutoSave}
      />

      <TaskDetailModal
        isOpen={isTaskDetailModalOpen}
        onClose={() => {
          setIsTaskDetailModalOpen(false);
          setSelectedDetailTask(null);
        }}
        task={selectedDetailTask}
        contacts={contacts}
        onToggleComplete={handleToggleComplete}
        onToggleSubtask={handleToggleSubtask}
        onDeleteTask={handleDeleteTask}
        onEditTask={(task) => {
          setIsTaskDetailModalOpen(false);
          setEditingTask(task);
          setIsHandsFreeAutoSave(false);
          setIsTaskModalOpen(true);
        }}
      />

      <WhatsAppImportModal
        isOpen={isWhatsAppImportOpen}
        onClose={() => setIsWhatsAppImportOpen(false)}
        contacts={contacts}
        onSaveTask={handleSaveManualTask}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearAll={handleClearAllNotifications}
        onOpenTaskDetail={(taskId) => {
          const matched = tasks.find(t => t.id === taskId);
          if (matched) {
            setSelectedDetailTask(matched);
            setIsTaskDetailModalOpen(true);
          }
        }}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        tasks={tasks}
        notes={notes}
        contacts={contacts}
        memories={memories}
        onSelectTask={(task) => {
          setSelectedDetailTask(task);
          setIsTaskDetailModalOpen(true);
        }}
      />

      <DocumentScannerModal
        isOpen={isDocumentScannerOpen}
        onClose={() => setIsDocumentScannerOpen(false)}
        onConfirmScannedTask={(scannedData) => {
          setEditingTask(null);
          handleSaveManualTask(scannedData);
        }}
      />

      <MemoryManagerModal
        isOpen={isMemoryManagerOpen}
        onClose={() => setIsMemoryManagerOpen(false)}
      />

      <AutomationsModal
        isOpen={isAutomationsOpen}
        onClose={() => setIsAutomationsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onFinish={() => {
          setIsOnboardingOpen(false);
          localStorage.setItem('taskgenie_onboarding_seen', 'true');
        }}
      />
    </div>
  );
}
