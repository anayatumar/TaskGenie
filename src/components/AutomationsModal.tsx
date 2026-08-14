import React, { useState } from 'react';
import { AutomationRule } from '../types';
import { getStoredAutomations, toggleAutomationRule, addAutomationRule, deleteAutomationRule } from '../utils/automations';
import { X, Zap, Plus, Trash2, CheckCircle2, Play } from 'lucide-react';

interface AutomationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomationsModal: React.FC<AutomationsModalProps> = ({ isOpen, onClose }) => {
  const [rules, setRules] = useState<AutomationRule[]>(getStoredAutomations());
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('TASK_ASSIGNED');
  const [condition, setCondition] = useState('Priority is High or Urgent');
  const [action, setAction] = useState('Schedule Sound Alarm 1 Day Before Due Date');

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    const updated = toggleAutomationRule(id);
    setRules(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteAutomationRule(id);
    setRules(updated);
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAutomationRule(name, trigger, condition, action);
    setRules(getStoredAutomations());
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <Zap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Business Automations Engine
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">TRIGGER → CONDITION → ACTION rules</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="w-full py-2.5 rounded-2xl bg-emerald-50 text-[#10B981] hover:bg-emerald-100 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Custom Automation Rule
        </button>

        {/* Create Rule Form */}
        {isAdding && (
          <form onSubmit={handleAddRuleSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-extrabold text-slate-900">Define Automation Rule:</h4>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Auto-Escalate Overdue Quotations"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">TRIGGER Event</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="TASK_ASSIGNED">When a task is assigned</option>
                <option value="TASK_OVERDUE">When a task becomes overdue</option>
                <option value="NOTE_SAVED">When a meeting note is saved</option>
                <option value="WHATSAPP_IMPORT">When a WhatsApp order arrives</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">CONDITION</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">ACTION</label>
              <input
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
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
                Save Rule
              </button>
            </div>
          </form>
        )}

        {/* Rules List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pt-1">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#10B981]" />
                  <h4 className="text-xs font-extrabold text-slate-900">{rule.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      rule.enabled ? 'bg-[#10B981]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-600 space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>⚡ <strong>TRIGGER:</strong> {rule.trigger}</div>
                <div>🔍 <strong>IF:</strong> {rule.condition}</div>
                <div>🚀 <strong>THEN:</strong> {rule.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
