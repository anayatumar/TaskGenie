import React, { useState, useEffect } from 'react';
import { Note, Task } from '../types';
import { FileText, Mic, StopCircle, Pause, Play, Sparkles, Plus, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onSaveNote: (note: Note) => void;
  onConvertActionItemsToTasks: (note: Note) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onConvertActionItemsToTasks,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeNoteText, setActiveNoteText] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Timer interval for active note taking
  useEffect(() => {
    let timer: any = null;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  const handleStartNoteTaking = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    setActiveNoteText('Discussed quotation terms with Mohsin from Labex Lab. Nadeem will inspect the CX31 optical equipment tomorrow. Customer requested shipment before Friday.');
  };

  const handleStopNoteTaking = () => {
    setIsRecording(false);

    // AI Intelligent Summarizer Mock Result
    const newNote: Note = {
      id: `n_${Date.now()}`,
      title: `Meeting Note — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      content: activeNoteText,
      date: new Date().toISOString().split('T')[0],
      durationSeconds: recordingSeconds || 180,
      peopleMentioned: ['Mohsin', 'Nadeem'],
      organizationsMentioned: ['Labex Lab', 'TechSolutions'],
      keyPoints: [
        'Labex Lab quotation terms confirmed',
        'CX31 optical equipment technical check required',
        'Delivery requested before Friday'
      ],
      decisions: [
        'Approved wholesale unit pricing',
        'Assigned Nadeem for technical verification'
      ],
      actionItems: [
        {
          id: `ai_${Date.now()}_1`,
          taskTitle: 'Send quotation to Mohsin from Labex Lab',
          contactName: 'Mohsin',
          organization: 'Labex Lab',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          confidence: 0.98
        },
        {
          id: `ai_${Date.now()}_2`,
          taskTitle: 'Check CX31 machine with Nadeem',
          contactName: 'Nadeem',
          organization: 'TechSolutions',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          confidence: 0.95
        }
      ],
      category: 'meeting',
      createdAt: new Date().toISOString()
    };

    onSaveNote(newNote);
    setSelectedNote(newNote);
    setRecordingSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 pt-2 pb-24 space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">Intelligent Notes</h2>
          <p className="text-xs text-gray-400">Live meeting summaries & auto action items</p>
        </div>
        <button
          onClick={handleStartNoteTaking}
          disabled={isRecording}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          <Mic className="w-4 h-4" /> Start Note Taking
        </button>
      </div>

      {/* Active Note Taking Bar Banner */}
      {isRecording && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-purple-950/80 to-indigo-950/80 border border-rose-500/40 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Note Taking Active ({formatTime(recordingSeconds)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={handleStopNoteTaking}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs flex items-center gap-1 hover:bg-rose-500"
              >
                <StopCircle className="w-4 h-4" /> Stop & Summarize
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-300 italic bg-black/30 p-2.5 rounded-xl border border-white/5">
            "{activeNoteText}"
          </p>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note)}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] cursor-pointer transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {note.category}
              </span>
              <span className="text-xs text-gray-400">{note.date}</span>
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight">{note.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-2">{note.content}</p>

            {/* Badges: Action items & Key Points */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ⚡ {note.actionItems.length} action item{note.actionItems.length !== 1 ? 's' : ''}
                </span>
                <span className="text-purple-300">
                  🎯 {note.decisions.length} decision{note.decisions.length !== 1 ? 's' : ''}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Note Detail & Task Converter Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111827] border-t border-white/10 rounded-t-3xl p-6 max-w-md mx-auto w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">{selectedNote.date}</span>
                <h3 className="text-base font-bold text-white">{selectedNote.title}</h3>
              </div>
              <button onClick={() => setSelectedNote(null)} className="p-1 rounded-full text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Key Points */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Key Points</h4>
              <ul className="space-y-1 pl-1">
                {selectedNote.keyPoints.map((kp, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decisions */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Decisions Made</h4>
              <ul className="space-y-1 pl-1">
                {selectedNote.decisions.map((d, idx) => (
                  <li key={idx} className="text-xs text-indigo-200 flex items-start gap-2 bg-indigo-950/40 p-2 rounded-xl border border-indigo-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Action Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Extracted Action Items</h4>
              {selectedNote.actionItems.map(ai => (
                <div key={ai.id} className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                  <div>
                    <div className="font-semibold text-white">{ai.taskTitle}</div>
                    <div className="text-[11px] text-emerald-400">
                      {ai.contactName ? `👤 ${ai.contactName} (${ai.organization})` : 'General Task'}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Due {ai.dueDate || 'Soon'}
                  </span>
                </div>
              ))}
            </div>

            {/* One-Tap Task Converter */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onConvertActionItemsToTasks(selectedNote);
                  setSelectedNote(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Convert Action Items to Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
