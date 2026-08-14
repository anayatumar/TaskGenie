import React from 'react';
import { Home, CheckSquare, FileText, Users, Mic, UserPlus } from 'lucide-react';

export type TabType = 'home' | 'tasks' | 'notes' | 'contacts' | 'team' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onActivateMic: () => void;
  onOpenCreateTaskModal: () => void;
  pendingTasksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onActivateMic,
  pendingTasksCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none select-none">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-2xl p-2 flex items-center justify-around pointer-events-auto relative">
        {/* Home Tab */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'home'
              ? 'bg-emerald-50 text-[#10B981] font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Tasks Tab */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all relative ${
            activeTab === 'tasks'
              ? 'bg-emerald-50 text-[#10B981] font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">Tasks</span>
          {pendingTasksCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-[#10B981] text-white text-[9px] font-extrabold flex items-center justify-center border border-white">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Floating Voice Mic Action Button */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            onClick={onActivateMic}
            className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/30 hover:scale-105 active:scale-95 transition-all border-2 border-white"
            title="Activate Voice Assistant"
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>

        {/* Company Team Tab */}
        <button
          onClick={() => onSelectTab('team')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'team'
              ? 'bg-emerald-50 text-[#10B981] font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[10px]">Team</span>
        </button>

        {/* Contacts Tab */}
        <button
          onClick={() => onSelectTab('contacts')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all ${
            activeTab === 'contacts'
              ? 'bg-emerald-50 text-[#10B981] font-extrabold shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Partners</span>
        </button>
      </div>
    </div>
  );
};
