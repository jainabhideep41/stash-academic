"use client";

import React, { useState, useEffect, useRef } from "react";
import { AcademicTask } from "@/lib/taskAlarmStorage";
import { alarmAudio } from "@/lib/alarmAudioEngine";
import {
  Bell,
  AlarmClock,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Volume2,
  Calendar,
  Sparkles,
  AlertTriangle,
  Snooze,
} from "lucide-react";

interface AlarmOverlayModalProps {
  task: AcademicTask;
  onDismiss: (taskId: string, completed?: boolean) => void;
  onSnooze: (taskId: string, minutes: number) => void;
}

export function AlarmOverlayModal({
  task,
  onDismiss,
  onSnooze,
}: AlarmOverlayModalProps) {
  const [typedInput, setTypedInput] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [selectedSnoozeMins, setSelectedSnoozeMins] = useState(5);
  const inputRef = useRef<HTMLInputElement>(null);

  // Target phrase the user must type to unlock
  const targetPhrase =
    task.challengeText || `I acknowledge: ${task.title}`;

  const isChallengeSolved =
    typedInput.trim().toLowerCase() === targetPhrase.trim().toLowerCase();

  // Progress of typing
  const matchLength = (() => {
    const target = targetPhrase.toLowerCase();
    const typed = typedInput.toLowerCase();
    let count = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) {
        count++;
      } else {
        break;
      }
    }
    return count;
  })();

  const progressPercent = Math.min(
    100,
    Math.round((matchLength / targetPhrase.length) * 100)
  );

  // Live Digital Clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto focus the input field for instant typing
  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // Handle Turn Off Alarm
  const handleTurnOff = (markAsCompleted = false) => {
    if (!isChallengeSolved) return;
    alarmAudio.playSuccessChime();
    alarmAudio.stopAlarm();
    onDismiss(task.id, markAsCompleted);
  };

  // Handle Snooze
  const handleSnooze = (minutes: number) => {
    alarmAudio.stopAlarm();
    onSnooze(task.id, minutes);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "medium":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 select-none">
      
      {/* Intense pulsing perimeter aura like phone emergency alarm */}
      <div className="absolute inset-0 border-4 sm:border-8 border-rose-500/60 animate-pulse pointer-events-none shadow-[inset_0_0_80px_rgba(244,63,94,0.4)]" />

      {/* Main Alarm Card */}
      <div className="relative w-full max-w-xl bg-neutral-950 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
        
        {/* Glowing header bar with audio indicator */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-bounce">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  ⏰ WAKE-UP ALARM RINGING
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Volume2 className="w-3 h-3 text-rose-400 animate-pulse" />
                  Sound Active
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono mt-0.5">
                Stash Academic Alert
              </h3>
            </div>
          </div>

          {/* Live Digital Clock */}
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white block">
              {currentTime}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {task.dueTime} Scheduled
            </span>
          </div>
        </div>

        {/* Task Details Banner */}
        <div className="space-y-3 bg-neutral-900/90 border border-neutral-800 p-5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white/10 text-white border border-white/20">
              {task.category}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug font-display">
              {task.title}
            </h2>
            {task.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Typing Challenge Section (Anti-Sleep Mode) */}
        <div className="space-y-3 bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-300 uppercase">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Typing Acknowledgment Challenge</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {progressPercent}% Complete
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            To prove you are awake and turn off this alarm, type the exact phrase below:
          </p>

          {/* Target Phrase Box */}
          <div className="p-3 rounded-xl bg-black/80 border border-neutral-700 font-mono text-xs sm:text-sm text-yellow-300 font-bold tracking-wide select-text">
            {targetPhrase}
          </div>

          {/* Typing Input */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isChallengeSolved) {
                    handleTurnOff(true);
                  }
                }}
                placeholder="Type the exact phrase above..."
                className={`w-full py-3 px-4 rounded-xl bg-neutral-900 border text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition ${
                  isChallengeSolved
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20"
                    : "border-neutral-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                }`}
              />
              {isChallengeSolved && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Visual Match Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  isChallengeSolved ? "bg-emerald-400" : "bg-rose-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls: Turn Off & Snooze */}
        <div className="space-y-3 pt-2">
          
          {/* Turn Off Button (Enabled ONLY when challenge is solved) */}
          <button
            type="button"
            disabled={!isChallengeSolved}
            onClick={() => handleTurnOff(true)}
            className={`w-full py-4 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isChallengeSolved
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 animate-pulse"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
            }`}
          >
            {isChallengeSolved ? (
              <>
                <Unlock className="w-4 h-4 text-black" />
                <span>Turn Off Alarm (Challenge Solved &amp; Complete Task)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-neutral-500" />
                <span>Type Phrase Above to Unlock Dismiss Button</span>
              </>
            )}
          </button>

          {/* Snooze Options */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              Snooze for:
            </span>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSnooze(mins)}
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-slate-200 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlarmClock className="w-3.5 h-3.5 text-purple-400" />
                  <span>+{mins} min</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
