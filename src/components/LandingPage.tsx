import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onDemoLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignIn,
  onOpenSignUp,
}) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F0F4F8] text-slate-800 flex flex-col justify-between max-w-md mx-auto w-full px-5 py-3 overflow-hidden select-none animate-fadeIn">
      {/* Clean Top Header in Light Theme (Black Top Block Removed Completely) */}
      <header className="flex items-center justify-between py-1 shrink-0">
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-[#10B981] uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>TASKGENIE AI</span>
        </div>

        <button
          onClick={onOpenSignIn}
          className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-sm"
        >
          Login
        </button>
      </header>

      {/* Main Hero Body - Fully Fluid & Responsive on Light Neumorphic Canvas */}
      <div className="flex-1 my-auto flex flex-col items-center justify-center text-center px-2 min-h-0 space-y-2">
        {/* Transparent PNG 3D Robot Assistant Mascot */}
        <div className="relative w-[28vh] h-[28vh] max-w-[160px] max-h-[160px] sm:max-w-[200px] sm:max-h-[200px] flex items-center justify-center shrink-0">
          <img
            src="/mascot.png"
            alt="TaskGenie 3D Robot Assistant"
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 pointer-events-none drop-shadow-md"
          />
        </div>

        {/* Clean Typography */}
        <div className="space-y-1 max-w-xs shrink-0">
          <h1 className="text-[clamp(1.15rem,3.5vh,1.5rem)] font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            Hello! I'm your <br />
            <span className="text-[#10B981]">AI Task Assistant</span>
          </h1>
          <p className="text-[clamp(0.7rem,1.8vh,0.85rem)] text-slate-600 leading-snug font-medium">
            Speak naturally, get tasks organized, calls scheduled, and make your work day easier.
          </p>
        </div>
      </div>

      {/* Primary Pill Action Button */}
      <div className="pb-2 pt-1 shrink-0">
        <button
          onClick={onOpenSignUp}
          className="w-full py-3 sm:py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-between px-5 sm:px-6"
        >
          <span className="flex-1 text-center font-bold">Get Started</span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};
