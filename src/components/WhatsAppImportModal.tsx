import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { X, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface WhatsAppImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onSaveTask: (task: Partial<Task>) => void;
}

export const WhatsAppImportModal: React.FC<WhatsAppImportModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSaveTask,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');

  const handleProcessImport = () => {
    if (!rawText.trim()) return;

    const matchedContact = contacts.find(c =>
      rawText.toLowerCase().includes(c.name.toLowerCase()) ||
      rawText.toLowerCase().includes(c.organization.toLowerCase())
    );

    onSaveTask({
      title: rawText.length > 50 ? rawText.substring(0, 48) + '...' : rawText,
      description: `Imported WhatsApp Message:\n"${rawText}"`,
      category: 'follow_up',
      priority: 'high',
      contactId: matchedContact?.id,
      contactName: matchedContact?.name,
      contactOrganization: matchedContact?.organization,
      sourceWhatsAppMessage: rawText,
      dueDate: new Date().toISOString().split('T')[0],
    });

    setRawText('');
    onClose();
    alert('Task extracted from WhatsApp message successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 select-none animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 mx-auto flex items-center justify-center text-[#10B981] text-xl font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 font-heading">Import WhatsApp Message</h3>
          <p className="text-xs text-slate-500 font-medium">Paste text message to extract task and auto-tag contact</p>
        </div>

        <textarea
          rows={4}
          placeholder="Paste message here e.g. 'Mohsin from Labex Lab called regarding equipment delivery...'"
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#10B981] font-medium"
        />

        <button
          onClick={handleProcessImport}
          className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-lg shadow-[#10B981]/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" /> Extract Task & Contact <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
