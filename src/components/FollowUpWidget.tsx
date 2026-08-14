import React from 'react';
import { Task } from '../types';
import { Clock, AlertCircle, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

interface FollowUpWidgetProps {
  tasks: Task[];
  onOpenCreateTaskModal: () => void;
}

export const FollowUpWidget: React.FC<FollowUpWidgetProps> = ({ tasks, onOpenCreateTaskModal }) => {
  const followUpTasks = tasks.filter(
    (t) => t.status !== 'completed' && (t.category === 'follow_up' || t.category === 'quotation' || t.title.toLowerCase().includes('waiting'))
  );

  if (followUpTasks.length === 0) return null;

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-2 select-none animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 font-heading">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Follow-Up Intelligence ({followUpTasks.length} Waiting Items)</span>
        </div>

        <button
          onClick={onOpenCreateTaskModal}
          className="text-[10px] font-extrabold text-amber-700 hover:underline flex items-center"
        >
          Add Follow-up <ArrowRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      <div className="space-y-1.5">
        {followUpTasks.slice(0, 2).map((t) => (
          <div
            key={t.id}
            className="bg-white/90 rounded-xl p-2.5 border border-amber-200/50 flex items-center justify-between gap-2 text-xs font-bold text-slate-800"
          >
            <div className="truncate min-w-0">
              <span className="text-amber-700">Waiting for:</span> {t.title}
              {t.contactName && <span className="text-[10px] text-slate-400 font-medium ml-1">({t.contactName})</span>}
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
              Due: {t.dueDate || 'Today'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
