// Master Neumorphic Dual-Tone Design Tokens for TaskGenie App
export const theme = {
  colors: {
    primary: '#10B981',       // Primary Emerald Green
    primaryDark: '#059669',   // Dark Green for Active/Hover
    primaryLight: '#D1FAE5',  // Soft Emerald Tint
    
    midnightBg: '#0F172A',    // Top Midnight Zone Background
    midnightCard: '#1E293B',  // Midnight Card Surface
    
    pearlBg: '#F0F4F8',       // Light Pearl Neumorphic Background
    pearlCard: '#FFFFFF',     // Pure White Neumorphic Card
    
    textPrimary: '#0F172A',   // High-Contrast Dark Slate Text
    textSecondary: '#475569', // Medium Slate
    textLight: '#F8FAFC',     // Light Text for Midnight Zone
    
    border: 'rgba(255, 255, 255, 0.6)',
  },
  
  buttons: {
    primary: 'w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm shadow-lg shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-center gap-2',
    neuButton: 'px-4 py-2.5 rounded-2xl neu-button text-slate-800 font-bold text-xs flex items-center gap-2',
    pill: 'px-4 py-1.5 rounded-full bg-[#F0F4F8] border border-white text-xs font-bold text-slate-800 shadow-sm hover:bg-white transition-colors',
  },
  
  cards: {
    neuCard: 'neu-card p-5 space-y-3',
    midnightCard: 'bg-[#1E293B] border border-white/10 rounded-3xl p-5 text-white shadow-xl',
  }
};
