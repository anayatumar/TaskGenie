import React, { useState } from 'react';
import { AppLanguage, Task, UserProfile, CompanyDetails, AppNotification } from '../types';
import { Grid, Bell, Globe, ChevronDown } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  company: CompanyDetails | null;
  isAuthenticated: boolean;
  tasks: Task[];
  notifications: AppNotification[];
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  onOpenSideDrawer: () => void;
  onOpenWhatsAppImport: () => void;
  onOpenNotifications: () => void;
  isDarkHeader?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isAuthenticated,
  notifications,
  language,
  onChangeLanguage,
  onOpenSideDrawer,
  onOpenNotifications,
  isDarkHeader = true,
}) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const langLabels: Record<AppLanguage, string> = {
    en: 'EN',
    ur: 'اردو',
    ps: 'پښتو',
  };

  return (
    <header
      className={`sticky top-0 z-30 pt-3 pb-2.5 px-4 transition-colors select-none ${
        isDarkHeader
          ? 'bg-[#0F172A] text-white border-b border-slate-800'
          : 'bg-white/95 text-slate-900 border-b border-slate-200/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSideDrawer}
            className={`p-2 rounded-xl transition-colors ${
              isDarkHeader
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Open Menu"
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 font-heading font-extrabold text-sm tracking-tight">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className={isDarkHeader ? 'text-white' : 'text-slate-900'}>TaskGenie</span>
          </div>
        </div>

        {/* Right Section: Compact Language Dropdown, Notification Bell & 32px User Avatar */}
        <div className="flex items-center gap-2 relative">
          {/* Single Dropdown Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all border ${
                isDarkHeader
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3 h-3 text-[#10B981]" />
              <span>{langLabels[language]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-2xl shadow-xl py-1 z-50 text-xs font-bold text-slate-800 animate-fadeIn">
                <button
                  onClick={() => {
                    onChangeLanguage('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                    language === 'en' ? 'text-[#10B981] font-extrabold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>English</span>
                  <span className="text-[10px] text-slate-400">EN</span>
                </button>
                <button
                  onClick={() => {
                    onChangeLanguage('ur');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                    language === 'ur' ? 'text-[#10B981] font-extrabold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>اردو</span>
                  <span className="text-[10px] text-slate-400">UR</span>
                </button>
                <button
                  onClick={() => {
                    onChangeLanguage('ps');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 ${
                    language === 'ps' ? 'text-[#10B981] font-extrabold bg-emerald-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>پښتو</span>
                  <span className="text-[10px] text-slate-400">PS</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className={`p-2 rounded-xl transition-colors relative ${
              isDarkHeader
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white animate-pulse" />
            )}
          </button>

          {/* Fixed 32px User Avatar */}
          {isAuthenticated && user && (
            <button
              onClick={onOpenSideDrawer}
              className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full border border-[#10B981] p-0.5 overflow-hidden shrink-0"
              title="User Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover block"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
