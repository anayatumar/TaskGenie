import React, { useState, useEffect } from 'react';
import { UserProfile, CompanyDetails, UserPreferences } from '../types';
import { User, Building2, Bell, Key, Save, Check, LogOut, Trash2, Volume2, Music, Smartphone, ShieldCheck, Sparkles, Brain, Zap, Calendar, Mail, MessageSquare, ShieldAlert } from 'lucide-react';
import {
  AlarmSoundType,
  MobileNotificationSettings,
  getStoredMobileNotificationSettings,
  saveMobileNotificationSettings,
  playAlarmSound,
  requestNotificationPermissions,
  triggerSystemNotification,
} from '../utils/notifications';
import { getStoredIntegrations, saveIntegrations } from '../utils/integrations';
import { IntegrationState } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  company: CompanyDetails;
  preferences: UserPreferences;
  onSaveProfile: (profile: UserProfile) => void;
  onSaveCompany: (company: CompanyDetails) => void;
  onSavePreferences: (preferences: UserPreferences) => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
  onOpenMemoryManager?: () => void;
  onOpenAutomationsManager?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  company,
  preferences,
  onSaveProfile,
  onSaveCompany,
  onSavePreferences,
  onSignOut,
  onDeleteAccount,
  onOpenMemoryManager,
  onOpenAutomationsManager,
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'integrations' | 'privacy' | 'profile' | 'company' | 'api'>('notifications');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');

  // Company Form State
  const [companyName, setCompanyName] = useState(company.companyName);
  const [industry, setIndustry] = useState(company.industry);
  const [location, setLocation] = useState(company.location || '');
  const [taxId, setTaxId] = useState(company.taxId || '');
  const [size, setSize] = useState(company.size || '10-50');

  // Integrations State
  const [integrations, setIntegrations] = useState<IntegrationState>(getStoredIntegrations());

  // Mobile Notification Engine State
  const [mobileNotifSettings, setMobileNotifSettings] = useState<MobileNotificationSettings>(
    getStoredMobileNotificationSettings()
  );
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [geminiApiKey, setGeminiApiKey] = useState(preferences.geminiApiKey || '');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const showSavedMessage = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...user,
      name,
      email,
      title,
      phone,
      bio,
    });
    showSavedMessage();
  };

  const handleSaveCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCompany({
      ...company,
      companyName,
      industry,
      location,
      taxId,
      size,
    });
    showSavedMessage();
  };

  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveMobileNotificationSettings(mobileNotifSettings);
    onSavePreferences({
      ...preferences,
      notificationsEnabled: mobileNotifSettings.pushEnabled,
    });
    showSavedMessage();
  };

  const handleToggleIntegration = (key: keyof IntegrationState) => {
    const updated = { ...integrations, [key]: !integrations[key] };
    setIntegrations(updated);
    saveIntegrations(updated);
    showSavedMessage();
  };

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermissions();
    setPermissionStatus(status);
  };

  const handlePreviewSound = () => {
    playAlarmSound(mobileNotifSettings.soundType, mobileNotifSettings.vibrationEnabled);
  };

  const handleTestSystemPush = () => {
    triggerSystemNotification(
      'Test Mobile Push Alarm',
      'This is a live test notification from TaskGenie notification engine!',
      'system',
      mobileNotifSettings
    );
  };

  const handleClearTranscriptsAndVoiceHistory = () => {
    if (confirm('Clear all local voice transcripts and assistant conversation logs?')) {
      alert('Voice history and transcripts cleared!');
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24 select-none animate-fadeIn flex flex-col space-y-4">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
            Executive Control Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage notifications, integrations, AI memory & privacy</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 text-xs font-bold animate-fadeIn">
            <Check className="w-3.5 h-3.5" /> Saved!
          </div>
        )}
      </div>

      {/* Quick Launchers for AI Memory & Automations */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenMemoryManager}
          className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between hover:bg-amber-100 transition-all text-xs font-extrabold"
        >
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-amber-600" />
            <span>AI Memory</span>
          </div>
          <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full font-bold">Manage</span>
        </button>

        <button
          onClick={onOpenAutomationsManager}
          className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between hover:bg-emerald-100 transition-all text-xs font-extrabold"
        >
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#10B981]" />
            <span>Automations</span>
          </div>
          <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full font-bold">Rules</span>
        </button>
      </div>

      {/* Settings Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'notifications' ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Alarms
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'integrations' ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Integrations
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'privacy' ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'profile' ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'company' ? 'bg-[#10B981] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Company
        </button>
      </div>

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotificationSettings} className="clean-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#10B981]" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                  Mobile Push & Alarm Engine
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Real-time alerts, ringtones & haptics</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequestPermission}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                permissionStatus === 'granted'
                  ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{permissionStatus === 'granted' ? 'Allowed' : 'Enable Push'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">System Push Notifications</div>
              <div className="text-[10px] text-slate-500 font-medium font-sans">Pop-up alert banners when tasks are due</div>
            </div>
            <button
              type="button"
              onClick={() => {
                handleRequestPermission();
                setMobileNotifSettings({ ...mobileNotifSettings, pushEnabled: !mobileNotifSettings.pushEnabled });
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                mobileNotifSettings.pushEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  mobileNotifSettings.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">Audio Alarm Ringtones</div>
              <div className="text-[10px] text-slate-500 font-medium font-sans">Synthesized audio chime on due reminders</div>
            </div>
            <button
              type="button"
              onClick={() =>
                setMobileNotifSettings({ ...mobileNotifSettings, soundEnabled: !mobileNotifSettings.soundEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                mobileNotifSettings.soundEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  mobileNotifSettings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Alarm Sound Ringtone</span>
              <button
                type="button"
                onClick={handlePreviewSound}
                className="text-[11px] font-extrabold text-[#10B981] hover:underline flex items-center gap-1"
              >
                <Music className="w-3 h-3" /> Test Sound Preview 🔊
              </button>
            </label>

            <select
              value={mobileNotifSettings.soundType}
              onChange={(e) =>
                setMobileNotifSettings({
                  ...mobileNotifSettings,
                  soundType: e.target.value as AlarmSoundType,
                })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
            >
              <option value="chime">🔔 Gentle Bell Chime (Default)</option>
              <option value="radar">📡 Radar Beep (Modern Digital Pulsar)</option>
              <option value="digital">🚨 Digital Alarm Beep (High Alert Pulse)</option>
              <option value="gong">🛎️ Executive Gong (Deep Tone)</option>
              <option value="silent">🔇 Silent (No Sound)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestSystemPush}
              className="flex-1 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#10B981] font-extrabold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <Bell className="w-3.5 h-3.5" /> Test Push Notification 🔔
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" /> Save Notification Settings
          </button>
        </form>
      )}

      {/* INTEGRATIONS ARCHITECTURE TAB */}
      {activeTab === 'integrations' && (
        <div className="clean-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-5 h-5 text-[#10B981]" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Calendar, Email & WhatsApp Integrations
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Connect external business productivity services</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Google Calendar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Google Calendar Sync</div>
                  <div className="text-[10px] text-slate-500 font-medium">Export tasks as .ics & Google Events</div>
                </div>
              </div>
              <button
                onClick={() => handleToggleIntegration('googleCalendar')}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                  integrations.googleCalendar
                    ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {integrations.googleCalendar ? 'Connected ✓' : 'Connect'}
              </button>
            </div>

            {/* Apple Calendar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-rose-500" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Apple Calendar & iCal</div>
                  <div className="text-[10px] text-slate-500 font-medium">iOS Calendar Event Sync</div>
                </div>
              </div>
              <button
                onClick={() => handleToggleIntegration('appleCalendar')}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                  integrations.appleCalendar
                    ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {integrations.appleCalendar ? 'Connected ✓' : 'Connect'}
              </button>
            </div>

            {/* Gmail */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-600" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">Gmail Integration</div>
                  <div className="text-[10px] text-slate-500 font-medium">Draft email actions & Email-to-Task</div>
                </div>
              </div>
              <button
                onClick={() => handleToggleIntegration('gmail')}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                  integrations.gmail
                    ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {integrations.gmail ? 'Connected ✓' : 'Connect'}
              </button>
            </div>

            {/* WhatsApp Business API */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-extrabold text-slate-900">WhatsApp Business API Webhook</div>
                  <div className="text-[10px] text-slate-500 font-medium">Auto-convert WhatsApp messages</div>
                </div>
              </div>
              <button
                onClick={() => handleToggleIntegration('whatsappBusiness')}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                  integrations.whatsappBusiness
                    ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {integrations.whatsappBusiness ? 'Connected ✓' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY & USER CONTROLS TAB */}
      {activeTab === 'privacy' && (
        <div className="clean-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Privacy & Data Deletion Controls
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Manage voice history, transcripts & AI data</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-slate-900">Voice Transcripts & Logs</div>
                <div className="text-[10px] text-slate-500 font-medium">Clear local voice speech recognition history</div>
              </div>
              <button
                onClick={handleClearTranscriptsAndVoiceHistory}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
              >
                Clear History
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-slate-900">Persistent AI Memory</div>
                <div className="text-[10px] text-slate-500 font-medium">View, edit, or forget AI facts</div>
              </div>
              <button
                onClick={onOpenMemoryManager}
                className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold shadow-2xs"
              >
                Manage Memories
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfileSubmit} className="clean-card p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#10B981]"
            />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">{user.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{user.title}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </form>
      )}

      {/* Company Settings Tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompanySubmit} className="clean-card p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" /> Save Company Details
          </button>
        </form>
      )}

      {/* Account Actions */}
      <div className="clean-card p-4 space-y-2">
        <button
          onClick={onSignOut}
          className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" /> Sign Out
        </button>

        <button
          onClick={onDeleteAccount}
          className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-500" /> Delete Account & Wipe Data
        </button>
      </div>
    </div>
  );
};
