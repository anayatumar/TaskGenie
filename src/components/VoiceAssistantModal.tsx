import React, { useState } from 'react';
import { VoiceState, IntentResult } from '../types';
import { Mic, X, AlertCircle, CheckCircle2, Sparkles, Send, Keyboard } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceState: VoiceState;
  transcript: string;
  intentResult: IntentResult | null;
  audioLevel: number;
  onActivateMic: () => void;
  onConfirmTask: () => void;
  onManualEdit: () => void;
  onSubmitTextCommand: (text: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  voiceState,
  transcript,
  audioLevel,
  onActivateMic,
  onSubmitTextCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);

  if (!isOpen) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitTextCommand(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-slate-900 text-white rounded-t-[32px] p-6 max-w-md mx-auto w-full space-y-5 shadow-2xl relative border-t border-slate-700/60">
        {/* Header Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-extrabold text-[#10B981] uppercase tracking-widest">
              Genie Voice & Text Command
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyboardInput(!showKeyboardInput)}
              className={`p-2 rounded-full transition-colors ${
                showKeyboardInput ? 'bg-[#10B981] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Keyboard Input"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Voice Status Animation */}
        <div className="flex flex-col items-center justify-center space-y-4 py-3">
          <div className="relative">
            {voiceState === 'LISTENING' && (
              <div
                className="absolute inset-0 rounded-full bg-[#10B981]/30 animate-ping"
                style={{ transform: `scale(${1 + audioLevel * 1.5})` }}
              />
            )}

            <button
              onClick={onActivateMic}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all relative z-10 ${
                voiceState === 'LISTENING'
                  ? 'bg-[#10B981] text-white shadow-[#10B981]/50 scale-105'
                  : voiceState === 'PROCESSING'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : voiceState === 'SUCCESS'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Mic className="w-9 h-9" />
            </button>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider">
              {voiceState === 'LISTENING'
                ? 'Listening... Speak Now'
                : voiceState === 'PROCESSING'
                ? 'AI Processing Command...'
                : voiceState === 'SUCCESS'
                ? 'Command Understood!'
                : voiceState === 'ERROR'
                ? 'Could not hear clearly'
                : 'Tap Mic or Type Command Below'}
            </div>

            {transcript && (
              <p className="text-sm font-bold text-white bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 max-w-xs mx-auto">
                "{transcript}"
              </p>
            )}
          </div>
        </div>

        {/* RESTORED KEYBOARD / TEXT COMMAND INPUT FORM */}
        <form onSubmit={handleTextSubmit} className="pt-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Or type command e.g. Call Tariq tomorrow at 3pm..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 p-2 rounded-xl bg-[#10B981] text-white disabled:opacity-40 hover:bg-[#059669] transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
