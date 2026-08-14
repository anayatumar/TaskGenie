import React, { useState } from 'react';
import { Sparkles, Mic, PhoneCall, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 select-none">
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-6 text-center shadow-2xl">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-600/40">
              ✨
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Meet TaskGenie</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Your voice-first AI assistant for personal and business task execution. Just speak naturally in English or Urdu!
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center text-2xl">
              👤
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Contact & Org Tagging</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Say <em className="text-purple-300">"Make a call to Mohsin from Labex Lab"</em> and TaskGenie automatically tags the contact and links quick call shortcuts!
            </p>
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border border-pink-500/30 text-pink-400 mx-auto flex items-center justify-center text-2xl">
              🎙️
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Ready to Start!</h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tap the large microphone orb anytime or say <strong>"Hey Genie"</strong> to manage tasks, reminders, and meeting notes.
            </p>
            <button
              onClick={onFinish}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
            >
              Get Started <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
