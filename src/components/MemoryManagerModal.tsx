import React, { useState } from 'react';
import { AIMemory } from '../types';
import { getStoredMemories, addMemory, deleteMemory, editMemory, clearAllMemories } from '../utils/aiMemory';
import { X, Brain, Plus, Trash2, Edit3, Save, ShieldAlert } from 'lucide-react';

interface MemoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryManagerModal: React.FC<MemoryManagerModalProps> = ({ isOpen, onClose }) => {
  const [memories, setMemories] = useState<AIMemory[]>(getStoredMemories());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;
    const updated = addMemory(key, value);
    setMemories(getStoredMemories());
    setKey('');
    setValue('');
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!key.trim() || !value.trim()) return;
    editMemory(id, key, value);
    setMemories(getStoredMemories());
    setEditingId(null);
    setKey('');
    setValue('');
  };

  const handleDelete = (id: string) => {
    const updated = deleteMemory(id);
    setMemories(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to forget all AI memories? This action cannot be undone.')) {
      clearAllMemories();
      setMemories([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Brain className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Persistent AI Memory Controls
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">View, edit, forget, or wipe AI knowledge</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              setEditingId(null);
              setKey('');
              setValue('');
              setIsAdding(true);
            }}
            className="px-3.5 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Memory
          </button>

          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Forget All
            </button>
          )}
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-slate-900">Add Custom Knowledge Memory</h4>
            <input
              type="text"
              required
              placeholder="Memory Key e.g. Ahmed Equipment Handling"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
            />
            <textarea
              rows={2}
              required
              placeholder="Knowledge Fact e.g. Ahmed handles Olympus CX31 quotations."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-[#10B981] text-white text-xs font-extrabold"
              >
                Save Memory
              </button>
            </div>
          </form>
        )}

        {/* Memory List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pt-1">
          {memories.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <Brain className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-extrabold text-slate-700">No Persistent Memories Stored</div>
              <div className="text-[10px] text-slate-400 font-medium">Click "Add Memory" to teach TaskGenie custom facts</div>
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-start justify-between gap-3"
              >
                {editingId === mem.id ? (
                  <div className="w-full space-y-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(mem.id)}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{mem.key}</h4>
                      <p className="text-[11px] font-medium text-slate-700 mt-0.5">{mem.value}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(mem.id);
                          setKey(mem.key);
                          setValue(mem.value);
                        }}
                        className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs"
                        title="Edit memory"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs"
                        title="Forget memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
