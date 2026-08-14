import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, Search, CheckCircle2, Zap } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  contacts: Contact[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateModal: () => void;
  onEditTask?: (task: Task) => void;
  onOpenDetail?: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  contacts,
  onToggleComplete,
  onToggleSubtask,
  onDeleteTask,
  onOpenCreateModal,
  onEditTask,
  onOpenDetail,
}) => {
  const [filterTab, setFilterTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.contactOrganization?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

    if (filterTab === 'today') {
      return t.dueDate === todayStr && t.status !== 'completed';
    } else if (filterTab === 'overdue') {
      return t.dueDate && t.dueDate < todayStr && t.status !== 'completed';
    } else if (filterTab === 'upcoming') {
      return t.dueDate && t.dueDate > todayStr && t.status !== 'completed';
    } else if (filterTab === 'completed') {
      return t.status === 'completed';
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'call', label: 'Calls' },
    { id: 'quotation', label: 'Quotations' },
    { id: 'meeting', label: 'Meetings' },
    { id: 'delivery', label: 'Deliveries' },
  ];

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24 space-y-4 select-none animate-fadeIn">
      {/* Top Header & Add Task Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest text-[#10B981] uppercase">
            <Zap className="w-3 h-3 text-[#10B981]" />
            <span>TASK INTELLIGENCE</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">Active Queue</h2>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Search & Categories */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, partner contacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300 text-xs font-extrabold">
        <button
          onClick={() => setFilterTab('today')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterTab === 'today' ? 'bg-[#10B981] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilterTab('overdue')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterTab === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Overdue
        </button>
        <button
          onClick={() => setFilterTab('upcoming')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`flex-1 py-1.5 rounded-xl transition-all ${
            filterTab === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Done
        </button>
      </div>

      {/* Task List (Compact 1-Line Items) */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              contacts={contacts}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onOpenDetail={onOpenDetail}
            />
          ))
        ) : (
          <div className="text-center py-12 clean-card p-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-900">No tasks found</h3>
            <p className="text-xs text-slate-500 font-medium">
              {filterTab === 'today'
                ? "You have no pending tasks for today!"
                : "No matching tasks in this view."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
