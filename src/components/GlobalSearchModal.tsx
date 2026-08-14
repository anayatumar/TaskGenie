import React, { useState } from 'react';
import { Task, Note, Contact, AIMemory } from '../types';
import { X, Search, Sparkles, CheckCircle2, FileText, Users, Brain, Clock, ChevronRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  notes: Note[];
  contacts: Contact[];
  memories: AIMemory[];
  onSelectTask?: (task: Task) => void;
  onSelectNote?: (note: Note) => void;
  onSelectContact?: (contact: Contact) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  notes,
  contacts,
  memories,
  onSelectTask,
  onSelectNote,
  onSelectContact,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const queryLower = query.toLowerCase().trim();

  const matchedTasks = queryLower
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(queryLower) ||
          (t.description && t.description.toLowerCase().includes(queryLower)) ||
          (t.contactName && t.contactName.toLowerCase().includes(queryLower))
      )
    : [];

  const matchedNotes = queryLower
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(queryLower) ||
          n.content.toLowerCase().includes(queryLower) ||
          n.peopleMentioned.some((p) => p.toLowerCase().includes(queryLower))
      )
    : [];

  const matchedContacts = queryLower
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(queryLower) ||
          c.organization.toLowerCase().includes(queryLower) ||
          c.role.toLowerCase().includes(queryLower)
      )
    : [];

  const matchedMemories = queryLower
    ? memories.filter(
        (m) =>
          m.key.toLowerCase().includes(queryLower) ||
          m.value.toLowerCase().includes(queryLower)
      )
    : [];

  const totalResults = matchedTasks.length + matchedNotes.length + matchedContacts.length + matchedMemories.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start pt-16 px-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-3xl p-5 max-w-md mx-auto w-full space-y-4 max-h-[82vh] overflow-y-auto shadow-2xl relative border border-slate-100">
        {/* Header Search Input */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder="Ask anything e.g. What did Ahmed say about CX31?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        {!queryLower ? (
          <div className="py-8 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#10B981] mx-auto animate-pulse" />
            <div className="text-xs font-extrabold text-slate-900">AI Natural Language Search</div>
            <div className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">
              Type natural queries like "Show Ahmed's tasks", "Quotation for Olympus", or "What did we decide yesterday?"
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="py-8 text-center space-y-1">
            <Search className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-extrabold text-slate-700">No Matching Results Found</div>
            <div className="text-[10px] text-slate-400 font-medium">Try searching with keywords or partner names</div>
          </div>
        ) : (
          <div className="space-y-4 pt-1 max-h-[60vh] overflow-y-auto">
            {/* 1. Tasks Matches */}
            {matchedTasks.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-[#10B981] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matching Tasks ({matchedTasks.length})
                </div>
                <div className="space-y-1.5">
                  {matchedTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (onSelectTask) onSelectTask(t);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:border-[#10B981] cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{t.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium">📅 {t.dueDate || 'No Date'}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Notes Matches */}
            {matchedNotes.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Meeting Transcripts ({matchedNotes.length})
                </div>
                <div className="space-y-1.5">
                  {matchedNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (onSelectNote) onSelectNote(n);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:border-indigo-400 cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{n.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">{n.content}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. AI Memories Matches */}
            {matchedMemories.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5" /> AI Knowledge Memory ({matchedMemories.length})
                </div>
                <div className="space-y-1.5">
                  {matchedMemories.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1"
                    >
                      <div className="text-xs font-extrabold text-slate-900">{m.key}</div>
                      <div className="text-[11px] font-medium text-slate-700">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Contacts Matches */}
            {matchedContacts.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Partners & Team ({matchedContacts.length})
                </div>
                <div className="space-y-1.5">
                  {matchedContacts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (onSelectContact) onSelectContact(c);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 hover:border-emerald-400 cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.organization} • {c.role}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
