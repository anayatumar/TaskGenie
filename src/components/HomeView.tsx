import React, { useState } from 'react';
import { Task, Contact, AppLanguage, UserProfile } from '../types';
import { Phone, CheckCircle2, Clock, ChevronRight, Edit3, TrendingUp, Sparkles, Zap, FileText, AlertCircle, Circle, Sun, Moon, Search, FileCheck, Brain } from 'lucide-react';
import { speechEngine } from '../utils/speech';
import { FollowUpWidget } from './FollowUpWidget';

interface HomeViewProps {
  user: UserProfile | null;
  tasks: Task[];
  contacts: Contact[];
  language: AppLanguage;
  onActivateMic: () => void;
  onOpenCreateTaskModal: () => void;
  onViewTasks: () => void;
  onViewNotes: () => void;
  onViewContacts: () => void;
  onOpenNotifications: () => void;
  onEditTask?: (task: Task) => void;
  onOpenGlobalSearch?: () => void;
  onOpenDocumentScanner?: () => void;
  onOpenMemoryManager?: () => void;
  onOpenAutomationsManager?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  tasks,
  contacts,
  language,
  onActivateMic,
  onOpenCreateTaskModal,
  onViewTasks,
  onViewNotes,
  onViewContacts,
  onEditTask,
  onOpenGlobalSearch,
  onOpenDocumentScanner,
  onOpenMemoryManager,
  onOpenAutomationsManager,
}) => {
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(3);
  const [activeBriefingType, setActiveBriefingType] = useState<'none' | 'morning' | 'evening'>('none');

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = pendingTasks.filter(t => t.dueDate === todayStr);

  const nextUpcomingTask = pendingTasks.find(t => t.dueDate && t.dueTime) || pendingTasks[0];
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const handlePlayMorningBriefing = () => {
    if (activeBriefingType === 'morning') {
      speechEngine.stopSpeaking();
      setActiveBriefingType('none');
      return;
    }

    setActiveBriefingType('morning');
    const text = language === 'ur'
      ? `صبح بخیر ${user?.name || ''}! آج کا سرفہرست کام ${nextUpcomingTask?.title || 'کوئی کام نہیں'} ہے۔ آپ کے پاس آج کل ${pendingTasks.length} اہم کام پینڈنگ ہیں۔`
      : `Good Morning ${user?.name || ''}! Your top priority task for today is ${nextUpcomingTask?.title || 'all clear'}. You have ${pendingTasks.length} pending items scheduled.`;

    speechEngine.speak(text, language, () => {
      setActiveBriefingType('none');
    });
  };

  const handlePlayEveningSummary = () => {
    if (activeBriefingType === 'evening') {
      speechEngine.stopSpeaking();
      setActiveBriefingType('none');
      return;
    }

    setActiveBriefingType('evening');
    const text = language === 'ur'
      ? `شام بخیر ${user?.name || ''}! ماشاء اللہ، آج آپ نے ${completedTasks.length} کام مکمل کیے ہیں اور کمپنی کی ورک لوڈ کارکردگی ${completionPercentage} فیصد رہی۔`
      : `Good Evening ${user?.name || ''}! Today you completed ${completedTasks.length} tasks with an overall efficiency of ${completionPercentage} percent. Great progress!`;

    speechEngine.speak(text, language, () => {
      setActiveBriefingType('none');
    });
  };

  const chartPoints = [
    { day: 'Mon', val: 50 },
    { day: 'Tue', val: 25 },
    { day: 'Wed', val: 80 },
    { day: 'Thu', val: 95 },
    { day: 'Fri', val: 40 },
    { day: 'Sat', val: 85 },
    { day: 'Sun', val: 60 },
  ];

  const svgWidth = 360;
  const svgHeight = 90;
  const stepX = svgWidth / (chartPoints.length - 1);

  const pointsCoords = chartPoints.map((p, i) => ({
    x: i * stepX,
    y: svgHeight - (p.val / 100) * (svgHeight - 24) - 12,
  }));

  let pathD = `M 0 ${pointsCoords[0].y}`;
  for (let i = 0; i < pointsCoords.length - 1; i++) {
    const curr = pointsCoords[i];
    const next = pointsCoords[i + 1];
    const cp1x = curr.x + stepX / 2.2;
    const cp1y = curr.y;
    const cp2x = next.x - stepX / 2.2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const fillD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="flex-1 max-w-md mx-auto w-full pb-24 select-none animate-fadeIn flex flex-col bg-[#F8FAFC]">
      {/* 1. DARK TOP SECTION WITH S-CURVE HUD & MORNING/EVENING VOICE BRIEFINGS */}
      <div className="relative bg-[#0F172A] text-white pt-3 pb-16 px-5 space-y-3 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

        {/* HUD Header Row */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#10B981] uppercase tracking-widest">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>S-CURVE EXECUTIVE HUD</span>
            </div>
            <h2 className="text-lg font-extrabold text-white font-heading mt-0.5">
              {pendingTasks.length} Active Workload
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayMorningBriefing}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all border ${
                activeBriefingType === 'morning'
                  ? 'bg-amber-500 text-slate-900 border-amber-400 animate-pulse'
                  : 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Play Morning AI Executive Briefing (8:00 AM)"
            >
              <Sun className="w-3 h-3" />
              <span>Morning</span>
            </button>

            <button
              onClick={handlePlayEveningSummary}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all border ${
                activeBriefingType === 'evening'
                  ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse'
                  : 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Play Evening AI Performance Summary (6:00 PM)"
            >
              <Moon className="w-3 h-3" />
              <span>Evening</span>
            </button>
          </div>
        </div>

        {/* S-Curve Chart */}
        <div className="relative -mx-5 pt-1">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-28 overflow-visible">
            <defs>
              <linearGradient id="exactSCurveShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={fillD} fill="url(#exactSCurveShadow)" />

            <path
              d={pathD}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]"
            />

            {pointsCoords.map((pt, idx) => {
              const isSelected = selectedPointIndex === idx;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => setSelectedPointIndex(idx)}>
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="9"
                      className="fill-[#10B981]/30 stroke-[#10B981] animate-ping"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '5.5' : '4'}
                    className={isSelected ? 'fill-[#10B981] stroke-white' : 'fill-slate-900 stroke-[#10B981]'}
                    strokeWidth="2.5"
                  />
                </g>
              );
            })}
          </svg>

          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1 px-5">
            {chartPoints.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPointIndex(idx)}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  selectedPointIndex === idx
                    ? 'bg-[#10B981] text-white font-extrabold shadow-sm'
                    : 'hover:text-white'
                }`}
              >
                {p.day}
              </button>
            ))}
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute left-0 right-0 bottom-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12 text-[#F8FAFC] filter drop-shadow-[0_12px_14px_rgba(15,23,42,0.35)]"
          >
            <path
              d="M0,0 C200,120 450,-50 700,80 C900,160 1050,20 1200,70 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* 2. LIGHT CANVAS SECTION */}
      <div className="px-5 pt-3 space-y-4 relative z-10">
        {/* Intelligence Quick Action Launchers Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGlobalSearch}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#10B981] active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-800"
          >
            <Search className="w-4 h-4 text-[#10B981]" />
            <span>AI Global Search</span>
          </button>

          <button
            onClick={onOpenDocumentScanner}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-800"
          >
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span>Scan Invoice / Doc</span>
          </button>
        </div>

        {/* Follow-Up Intelligence Widget */}
        <FollowUpWidget tasks={tasks} onOpenCreateTaskModal={onOpenCreateTaskModal} />

        {/* Soft Neumorphic Icon Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onViewTasks}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#10B981] active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">{pendingTasks.length} Tasks</span>
            <span className="text-[10px] text-slate-400 font-bold">Active Queue</span>
          </button>

          <button
            onClick={onViewTasks}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">{todayTasks.length} Alerts</span>
            <span className="text-[10px] text-slate-400 font-bold">Due Today</span>
          </button>

          <button
            onClick={onViewNotes}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-extrabold text-slate-900">3 Notes</span>
            <span className="text-[10px] text-slate-400 font-bold">Transcripts</span>
          </button>
        </div>

        {/* CLEAN 1-LINE PRIORITY FOCUS TASKS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 px-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" /> Priority Focus
            </span>
            <button onClick={onViewTasks} className="text-[#10B981] hover:underline text-[11px] font-bold flex items-center">
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          {nextUpcomingTask ? (
            <div className="bg-white rounded-2xl px-3.5 py-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 hover:border-[#10B981] transition-all">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  onClick={() => {
                    if (onEditTask) onEditTask(nextUpcomingTask);
                  }}
                  className="w-5 h-5 rounded-full border-2 border-[#10B981] flex items-center justify-center text-[#10B981] hover:bg-emerald-50 shrink-0"
                >
                  <Circle className="w-2.5 h-2.5 fill-current" />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-emerald-50 text-[#10B981] shrink-0">
                      {nextUpcomingTask.category}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">
                      {nextUpcomingTask.title}
                    </h3>
                  </div>
                  {nextUpcomingTask.contactName && (
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      👤 {nextUpcomingTask.contactName} ({nextUpcomingTask.contactOrganization})
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {nextUpcomingTask.dueTime && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10B981]" />
                    <span>{nextUpcomingTask.dueTime}</span>
                  </span>
                )}

                {onEditTask && (
                  <button
                    onClick={() => onEditTask(nextUpcomingTask)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-[#10B981] hover:bg-emerald-100 text-xs font-bold transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {nextUpcomingTask.contactName && (
                  <a
                    href="tel:+923001234567"
                    className="p-1.5 rounded-lg bg-[#10B981] text-white hover:bg-[#059669] text-xs font-bold transition-colors shadow-2xs"
                    title="Call Partner"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] mx-auto" />
              <div className="text-xs font-extrabold text-slate-900">Schedule Clear</div>
              <div className="text-[10px] text-slate-400 font-medium">No pending tasks for today</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
