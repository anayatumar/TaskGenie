import React, { useState, useEffect } from 'react';
import { Task, Contact, TaskPriority, TaskCategory, TeamMember } from '../types';
import { X, Mic, Volume2, Save, Calendar, Clock, AlertTriangle, User, ShieldAlert, Square, CheckSquare } from 'lucide-react';
import { speechEngine } from '../utils/speech';
import { getLocalDateString } from '../utils/timeParser';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  team?: TeamMember[];
  onSaveTask: (taskData: Partial<Task>) => void;
  initialTask?: Partial<Task>;
  taskToEdit?: Task | null;
  isHandsFreeAutoSave?: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  contacts,
  team = [],
  onSaveTask,
  initialTask,
  taskToEdit,
  isHandsFreeAutoSave = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [category, setCategory] = useState<TaskCategory>('general');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [contactId, setContactId] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');

  // 5-Second Hands-Free Driving Auto-Save Countdown State
  const [autoSaveCountdown, setAutoSaveCountdown] = useState<number | null>(null);
  const [isDictatingDesc, setIsDictatingDesc] = useState(false);
  const [isRecordingAudioNote, setIsRecordingAudioNote] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const todayLocal = getLocalDateString(new Date());
      if (taskToEdit) {
        setTitle(taskToEdit.title || '');
        setDescription(taskToEdit.description || '');
        setDueDate(taskToEdit.dueDate || todayLocal);
        setDueTime(taskToEdit.dueTime || '12:00');
        setPriority(taskToEdit.priority || 'normal');
        setCategory(taskToEdit.category || 'general');
        setAssigneeId(taskToEdit.assigneeId || '');
        setAssigneeName(taskToEdit.assigneeName || '');
        setContactId(taskToEdit.contactId || '');
        setContactName(taskToEdit.contactName || '');
      } else if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setDueDate(initialTask.dueDate || todayLocal);
        setDueTime(initialTask.dueTime || '09:00');
        setPriority(initialTask.priority || 'normal');
        setCategory(initialTask.category || 'general');
        setAssigneeId(initialTask.assigneeId || '');
        setAssigneeName(initialTask.assigneeName || '');
        setContactId(initialTask.contactId || '');
        setContactName(initialTask.contactName || '');
      } else {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        setTitle('');
        setDescription('');
        setDueDate(getLocalDateString(now));
        setDueTime(`${hrs}:${mins}`);
        setPriority('normal');
        setCategory('general');
        setAssigneeId('');
        setAssigneeName('');
        setContactId('');
        setContactName('');
      }

      if (isHandsFreeAutoSave) {
        setAutoSaveCountdown(5);
      } else {
        setAutoSaveCountdown(null);
      }
    }
  }, [isOpen, initialTask, taskToEdit, isHandsFreeAutoSave]);

  // Handle 5-second Auto-Save Timer Countdown for Driving Safety
  useEffect(() => {
    if (autoSaveCountdown === null) return;
    if (autoSaveCountdown <= 0) {
      handleSaveSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setAutoSaveCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoSaveCountdown]);

  const cancelAutoSave = () => {
    setAutoSaveCountdown(null);
  };

  const handleDictateDescription = () => {
    cancelAutoSave();
    if (isDictatingDesc) {
      speechEngine.stopListening();
      setIsDictatingDesc(false);
      return;
    }

    setIsDictatingDesc(true);
    speechEngine.startListening(
      (text, isFinal) => {
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
        if (isFinal) {
          setIsDictatingDesc(false);
        }
      },
      () => setIsDictatingDesc(false),
      () => setIsDictatingDesc(false)
    );
  };

  const handleSaveSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      id: taskToEdit?.id,
      title,
      description,
      dueDate,
      dueTime,
      priority,
      category,
      assigneeId,
      assigneeName,
      contactId,
      contactName,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div
        className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={cancelAutoSave}
      >
        {/* Driving Safety Auto-Save Banner */}
        {autoSaveCountdown !== null && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-extrabold">
                Auto-saving for driving safety in <strong className="text-amber-600 text-sm">{autoSaveCountdown}s</strong>...
              </span>
            </div>
            <button
              type="button"
              onClick={cancelAutoSave}
              className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-600 text-white rounded-full"
            >
              Pause
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 font-heading">
            {taskToEdit ? 'Edit Task' : 'Create Task Sheet'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Send equipment quotation to Tariq Khan"
              value={title}
              onChange={(e) => {
                cancelAutoSave();
                setTitle(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* TEAM MEMBER ASSIGNEE SELECTOR (EXPLICIT ASSIGNMENT) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
              <span>Assign to Team Member / Partner 👤</span>
              <span className="text-[10px] text-[#10B981] font-extrabold">Delegation</span>
            </label>
            <select
              value={assigneeId}
              onChange={(e) => {
                cancelAutoSave();
                const selectedId = e.target.value;
                setAssigneeId(selectedId);
                const matchedMember = team.find((m) => m.id === selectedId);
                const matchedContact = contacts.find((c) => c.id === selectedId);
                setAssigneeName(matchedMember?.name || matchedContact?.name || '');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
            >
              <option value="">Unassigned (My Personal Queue)</option>
              <optgroup label="🏢 Company Team Members">
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    👤 {m.name} ({m.role})
                  </option>
                ))}
              </optgroup>
              <optgroup label="👥 External Partners & Clients">
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    🤝 {c.name} ({c.organization})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Description & Voice Dictation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Description & Voice Notes</label>
              <button
                type="button"
                onClick={handleDictateDescription}
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                  isDictatingDesc
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-50 text-[#10B981] hover:bg-emerald-100'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isDictatingDesc ? 'Listening...' : 'Voice Dictate 🎙️'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              placeholder="Add task notes or dictate using mic..."
              value={description}
              onChange={(e) => {
                cancelAutoSave();
                setDescription(e.target.value);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  cancelAutoSave();
                  setDueDate(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => {
                  cancelAutoSave();
                  setDueTime(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => {
                  cancelAutoSave();
                  setPriority(e.target.value as TaskPriority);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent 🔥</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  cancelAutoSave();
                  setCategory(e.target.value as TaskCategory);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#10B981]"
              >
                <option value="general">General</option>
                <option value="call">Call</option>
                <option value="follow_up">Follow Up</option>
                <option value="order">Order</option>
                <option value="quotation">Quotation</option>
                <option value="delivery">Delivery</option>
                <option value="payment">Payment</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{taskToEdit ? 'Save Task Changes' : 'Confirm & Save Task'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
