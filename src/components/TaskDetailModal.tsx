import React from 'react';
import { Task, Contact } from '../types';
import { X, Check, Clock, Calendar, Phone, Building, MessageSquare, Trash2, Edit3, Tag, FileText, CheckSquare, Mail, Download, ExternalLink } from 'lucide-react';
import { openGoogleCalendarForTask, exportTaskToCalendarICS, openGmailComposer, openWhatsAppDirect } from '../utils/integrations';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  contacts: Contact[];
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  contacts,
  onToggleComplete,
  onToggleSubtask,
  onDeleteTask,
  onEditTask,
}) => {
  if (!isOpen || !task) return null;

  const matchedContact = contacts.find(
    (c) => c.id === task.contactId || c.name.toLowerCase() === task.contactName?.toLowerCase()
  );

  const priorityColors = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    normal: 'bg-emerald-50 text-[#10B981] border-emerald-200',
    low: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const isCompleted = task.status === 'completed';

  const handleOpenGoogleCalendar = () => {
    openGoogleCalendarForTask(task.title, task.dueDate, task.dueTime, task.description);
  };

  const handleExportICS = () => {
    exportTaskToCalendarICS(task.title, task.dueDate, task.dueTime, task.description);
  };

  const handleOpenGmail = () => {
    const recipient = matchedContact?.email || '';
    const subject = `Task: ${task.title}`;
    const body = `Hi ${task.contactName || 'Team'},\n\nRegarding: ${task.title}\nDue Date: ${task.dueDate || 'Today'} ${task.dueTime || ''}\n\nDetails:\n${task.description || ''}\n\nBest regards,\nTaskGenie AI Executive Assistant`;
    openGmailComposer(recipient, subject, body);
  };

  const handleOpenWhatsApp = () => {
    const phone = matchedContact?.phone || '';
    const msg = `Hi ${task.contactName || ''}, following up regarding task: "${task.title}". Scheduled for ${task.dueDate || 'Today'} ${task.dueTime || ''}.`;
    openWhatsAppDirect(phone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-fadeIn select-none">
      {/* Full Task Detail Sheet */}
      <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${priorityColors[task.priority]}`}>
                {task.priority} Priority
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 bg-slate-100 rounded-md uppercase tracking-wider">
                {task.category}
              </span>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Full Task Title & Instant Completion Toggle */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all border mt-1 shrink-0 ${
                isCompleted
                  ? 'bg-[#10B981] border-[#10B981] text-white shadow-md'
                  : 'border-slate-300 hover:border-[#10B981] text-transparent bg-slate-50'
              }`}
              title="Toggle Completion"
            >
              <Check className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0">
              <h2 className={`text-base font-extrabold tracking-tight ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                {task.title}
              </h2>
              <div className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#10B981]" /> {task.dueDate || 'No Date'}
                </span>
                {task.dueTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10B981]" /> {task.dueTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* REAL FUNCTIONAL CONNECTORS BAR (Google Calendar, iCal, Gmail, WhatsApp) */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Real Live Integrations</span>
              <span className="text-[#10B981] text-[9px]">Functional Models</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenGoogleCalendar}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-[#10B981] hover:bg-emerald-50 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </button>

              <button
                onClick={handleExportICS}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download iCal</span>
              </button>

              <button
                onClick={handleOpenGmail}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send via Gmail</span>
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-200 text-teal-600 hover:bg-teal-50 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </button>
            </div>
          </div>

          {/* Full Description */}
          {task.description ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Details & Notes</div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400 font-medium">
              No additional notes added for this task.
            </div>
          )}

          {/* Tagged Partner Contact Card */}
          {(task.contactName || matchedContact) && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider">Tagged Partner Contact</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {matchedContact?.avatar ? (
                    <img src={matchedContact.avatar} alt={task.contactName} className="w-10 h-10 rounded-full object-cover border border-[#10B981]" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#10B981]/15 text-[#10B981] font-extrabold text-sm flex items-center justify-center">
                      {task.contactName?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{task.contactName || matchedContact?.name}</div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#10B981]" />
                      <span>{task.contactOrganization || matchedContact?.organization || 'Partner'}</span>
                    </div>
                  </div>
                </div>

                {matchedContact?.phone && (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${matchedContact.phone}`}
                      className="p-2 rounded-xl bg-emerald-50 text-[#10B981] border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      title="Call Partner"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleOpenWhatsApp}
                      className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100 transition-colors"
                      title="WhatsApp Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtasks Checklist */}
          {task.subtasks.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                <span>Subtasks Checklist</span>
                <span className="text-[11px] font-bold text-slate-500">
                  {task.subtasks.filter((s) => s.completed).length} / {task.subtasks.length}
                </span>
              </div>
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                {task.subtasks.map((st) => (
                  <label key={st.id} className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => onToggleSubtask(task.id, st.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#10B981] focus:ring-0"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 font-semibold'}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer: Edit ✏️ | Delete 🗑️ | Toggle Done ✔ */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onEditTask(task);
            }}
            className="flex-1 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Edit Task
          </button>

          <button
            onClick={() => {
              onToggleComplete(task.id);
            }}
            className={`px-4 py-3 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isCompleted ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <Check className="w-4 h-4" /> {isCompleted ? 'Mark Pending' : 'Mark Done'}
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
