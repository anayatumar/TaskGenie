import React from 'react';
import { UserProfile, CompanyDetails } from '../types';
import { X, Home, CheckSquare, FileText, Users, Settings, LogOut, UserCheck } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  company: CompanyDetails | null;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  user,
  company,
  activeTab,
  onSelectTab,
  onSignOut,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home Page', icon: <Home className="w-5 h-5" /> },
    { id: 'tasks', label: 'My Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'notes', label: 'Meeting Notes', icon: <FileText className="w-5 h-5" /> },
    { id: 'contacts', label: 'Contacts Directory', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings & Profile', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-fadeIn">
      {/* Dark Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Light Clean Sidebar */}
      <div className="relative z-10 w-4/5 max-w-xs h-full bg-white text-slate-900 p-6 flex flex-col justify-between shadow-2xl border-r border-slate-200">
        <div className="space-y-8">
          {/* Top Close Button & Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#10B981]" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center font-bold text-lg">
                  👤
                </div>
              )}
              <div>
                <div className="text-[10px] font-extrabold tracking-widest text-[#10B981] uppercase">Hey 👋</div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{user ? user.name : 'Guest User'}</h3>
                <p className="text-xs text-slate-500 font-semibold">{user ? user.title : 'Sign In to Sync'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items List in #10B981 Theme */}
          <div className="space-y-2">
            {menuItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/25'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sign Out / Auth Button */}
        <div className="pt-4 border-t border-slate-100">
          {user ? (
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-[#10B981] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/25"
            >
              <UserCheck className="w-5 h-5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
