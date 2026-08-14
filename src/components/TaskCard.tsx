import React from 'react';
import { Task, Contact } from '../types';
import { Check, Clock, ChevronRight } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  contacts: Contact[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onOpenDetail?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onOpenDetail,
}) => {
  const isCompleted = task.status === 'completed';

  const priorityColors = {
    urgent: 'bg-rose-500 text-white',
    high: 'bg-amber-500 text-white',
    normal: 'bg-[#10B981] text-white',
    low: 'bg-slate-400 text-white',
  };

  return (
    <div
      className={`clean-card px-3.5 py-2.5 flex items-center justify-between gap-3 transition-all select-none hover:border-[#10B981]/50 cursor-pointer ${
        isCompleted ? 'opacity-55 bg-slate-50/60' : ''
      }`}
    >
      {/* 1. Left Dedicated Checkmark Tick Button (Instant Completion Toggle) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task.id);
        }}
        className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all border shrink-0 ${
          isCompleted
            ? 'bg-[#10B981] border-[#10B981] text-white shadow-xs'
            : 'border-slate-300 hover:border-[#10B981] text-transparent bg-white'
        }`}
        title="Mark Task Complete"
      >
        <Check className="w-3.5 h-3.5" />
      </button>

      {/* 2. Middle 1-Line Compact Headline & Category */}
      <div
        onClick={() => onOpenDetail && onOpenDetail(task)}
        className="flex-1 min-w-0 flex items-center gap-2"
      >
        {/* Priority Dot */}
        <span className={`w-2 h-2 rounded-full shrink-0 ${priorityColors[task.priority]}`} />

        <h3 className={`text-xs font-extrabold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </h3>

        {task.category !== 'general' && (
          <span className="px-1.5 py-0.2 text-[9px] font-bold text-slate-500 bg-slate-100 rounded-md uppercase tracking-wider shrink-0 hidden sm:inline-block">
            {task.category}
          </span>
        )}
      </div>

      {/* 3. Right Due Time Pill & Open Details Arrow */}
      <div
        onClick={() => onOpenDetail && onOpenDetail(task)}
        className="flex items-center gap-2 shrink-0"
      >
        {task.dueTime ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-[#10B981]" />
            <span>{task.dueTime}</span>
          </div>
        ) : task.dueDate ? (
          <span className="text-[10px] font-bold text-slate-400">{task.dueDate}</span>
        ) : null}

        <ChevronRight className="w-4 h-4 text-slate-400 hover:text-slate-700 transition-colors" />
      </div>
    </div>
  );
};
