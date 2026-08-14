import React from 'react';
import { VoiceState } from '../types';
import { Mic, Loader2, Check, AlertCircle } from 'lucide-react';

interface MicrophoneOrbProps {
  state: VoiceState;
  onClick: () => void;
  audioLevel?: number;
  size?: 'normal' | 'large';
}

export const MicrophoneOrb: React.FC<MicrophoneOrbProps> = ({
  state,
  onClick,
  audioLevel = 0,
  size = 'large',
}) => {
  const isLarge = size === 'large';
  const orbDimensions = isLarge ? 'w-44 h-44 sm:w-52 sm:h-52' : 'w-24 h-24';
  const innerDimensions = isLarge ? 'w-32 h-32 sm:w-36 sm:h-36' : 'w-16 h-16';
  const iconSize = isLarge ? 'w-10 h-10' : 'w-6 h-6';

  const audioScale = state === 'LISTENING' ? 1 + audioLevel * 0.25 : 1;

  return (
    <div className="relative flex items-center justify-center cursor-pointer select-none group" onClick={onClick}>
      {/* Outer Precision Ring */}
      <div
        className={`absolute rounded-full border border-white/40 transition-all duration-500 ${orbDimensions}`}
        style={{ transform: `scale(${audioScale * 1.12})` }}
      />

      {state === 'LISTENING' && (
        <div
          className={`absolute rounded-full border border-white/60 transition-all duration-300 animate-ping ${orbDimensions}`}
        />
      )}

      {/* Ambient Aura Core */}
      <div
        className={`absolute rounded-full blur-xl transition-all duration-500 ${orbDimensions} ${
          state === 'LISTENING'
            ? 'bg-white/40 opacity-100'
            : state === 'PROCESSING'
            ? 'bg-amber-400/40 opacity-100 animate-pulse'
            : state === 'SUCCESS'
            ? 'bg-emerald-300/40 opacity-100'
            : 'bg-white/20 opacity-60 group-hover:opacity-100'
        }`}
        style={{ transform: `scale(${audioScale * 1.2})` }}
      />

      {/* Main Solid Spherical Orb Body */}
      <div
        className={`relative flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border ${innerDimensions} ${
          state === 'LISTENING'
            ? 'bg-[#0B132B] border-white text-emerald-400 shadow-emerald-500/30'
            : state === 'PROCESSING'
            ? 'bg-[#0B132B] border-amber-400 text-amber-300 shadow-amber-500/30'
            : state === 'SUCCESS'
            ? 'bg-[#059669] border-white text-white shadow-emerald-600/30'
            : 'bg-[#0B132B] border-white/30 hover:border-white text-white shadow-black/20'
        }`}
        style={{ transform: `scale(${audioScale})` }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 transition-transform duration-200">
          {state === 'PROCESSING' ? (
            <Loader2 className={`${iconSize} animate-spin text-amber-300`} />
          ) : state === 'SUCCESS' ? (
            <Check className={`${iconSize} text-white`} />
          ) : state === 'ERROR' ? (
            <AlertCircle className={`${iconSize} text-rose-300`} />
          ) : (
            <Mic className={`${iconSize} ${state === 'LISTENING' ? 'text-emerald-400 animate-pulse' : 'text-white'}`} />
          )}
        </div>
      </div>
    </div>
  );
};
