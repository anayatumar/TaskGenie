import React from 'react';
import { Task, Contact, Note } from '../types';
import { Flame, CheckCircle2, Award, TrendingUp, BarChart3, ShieldCheck } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  contacts: Contact[];
  notes: Note[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, contacts, notes }) => {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 100;

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-2 pb-24 space-y-4 select-none">
      <div>
        <h2 className="text-xl font-bold text-white font-heading">Productivity & Insights</h2>
        <p className="text-xs text-gray-400">Humanized summary of your assistant achievements</p>
      </div>

      {/* Streak Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-indigo-950/60 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
            🔥
          </div>
          <div>
            <h3 className="text-base font-bold text-white">5 Day Productivity Streak</h3>
            <p className="text-xs text-amber-300">You've completed tasks consistently!</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Completion Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400">{completionRate}%</div>
          <div className="text-[11px] text-gray-500">{completedTasks.length} of {tasks.length} done</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Partner Contacts</div>
          <div className="text-2xl font-extrabold text-purple-400">{contacts.length}</div>
          <div className="text-[11px] text-gray-500">Auto-tagged in voice</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Meeting Notes</div>
          <div className="text-2xl font-extrabold text-indigo-400">{notes.length}</div>
          <div className="text-[11px] text-gray-500">Intelligent summaries</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-xs text-gray-400 font-medium">Genie Efficiency</div>
          <div className="text-2xl font-extrabold text-pink-400">98%</div>
          <div className="text-[11px] text-gray-500">Intent accuracy</div>
        </div>
      </div>
    </div>
  );
};
