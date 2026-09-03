"use client";

import React, { useState, useEffect, useRef } from "react";
import { AcademicTask, getAlarmAckMode, AlarmAckMode } from "@/lib/taskAlarmStorage";
import { alarmAudio } from "@/lib/alarmAudioEngine";
import { voiceAssistant } from "@/lib/voiceAssistantEngine";
import { HapticEngine } from "@/lib/hapticEngine";
import {
  Bell,
  AlarmClock,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  VolumeX,
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
  const [ackMode, setAckMode] = useState<AlarmAckMode>("type_only");
  
  // Voice Verification State
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [isVoiceVerified, setIsVoiceVerified] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Target phrase the user must type or speak
  const targetPhrase =
    task.challengeText || `I acknowledge: ${task.title}`;

  const isTypeSolved =
    typedInput.trim().toLowerCase() === targetPhrase.trim().toLowerCase();

  // Determine overall challenge readiness based on user's preference
  const isFullySolved = (() => {
    switch (ackMode) {
      case "neither":
        return true;
      case "voice_only":
        return isVoiceVerified;
      case "both":
        return isTypeSolved && isVoiceVerified;
      case "type_only":
      default:
        return isTypeSolved;
    }
  })();

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

  // Initial Load: Acknowledgment Mode & Voice Alarm Announcement
  useEffect(() => {
    const mode = getAlarmAckMode();
    setAckMode(mode);

    // If Voice Alarm is enabled, Alexa announces the reminder
    if (task.voiceAlarmEnabled !== false) {
      const announcement = `Wake up! It's time for your task: ${task.title}. You have an academic ${task.category} scheduled at ${task.dueTime}. Please confirm and get ready.`;
      
      const timer = setTimeout(() => {
        voiceAssistant.speakAlexaVoice(announcement);
      }, 1200);

      return () => {
        clearTimeout(timer);
        voiceAssistant.stopSpeaking();
      };
    }
  }, [task]);

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

  // Auto focus input if typing is required
  useEffect(() => {
    if (ackMode === "type_only" || ackMode === "both") {
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [ackMode]);

  // Start Voice Verification
  const handleStartVoiceVerification = () => {
    if (isVoiceListening) {
      voiceAssistant.stopListening();
      setIsVoiceListening(false);
      return;
    }

    HapticEngine.trigger("light");
    setIsVoiceListening(true);
    setSpokenText("");

    voiceAssistant.startListening(
      (text, isFinal) => {
        setSpokenText(text);

        const cleanSpoken = text.toLowerCase().trim();
        const cleanTarget = targetPhrase.toLowerCase().trim();

        // Check if spoken text matches target phrase OR generic confirmation phrases
        if (
          cleanSpoken.includes(cleanTarget) ||
          cleanSpoken.includes("i am awake") ||
          cleanSpoken.includes("i'm awake") ||
          cleanSpoken.includes("i am ready") ||
          cleanSpoken.includes("turn off alarm") ||
          cleanSpoken.includes(task.title.toLowerCase())
        ) {
          setIsVoiceVerified(true);
          voiceAssistant.stopListening();
          setIsVoiceListening(false);
          HapticEngine.trigger("success");
          voiceAssistant.speakAlexaVoice("Voice verified! Alarm ready to turn off.");
        }
      },
      (error) => {
        console.warn("Voice verification error:", error);
        setIsVoiceListening(false);
      },
      () => {
        setIsVoiceListening(false);
      }
    );
  };

  // Handle Turn Off Alarm
  const handleTurnOff = (markAsCompleted = false) => {
    if (!isFullySolved) return;
    HapticEngine.trigger("success");
    alarmAudio.playSuccessChime();
    alarmAudio.stopAlarm();
    voiceAssistant.stopSpeaking();
    voiceAssistant.stopListening();
    onDismiss(task.id, markAsCompleted);
  };

  // Handle Snooze
  const handleSnooze = (minutes: number) => {
    HapticEngine.trigger("medium");
    alarmAudio.stopAlarm();
    voiceAssistant.stopSpeaking();
    voiceAssistant.stopListening();
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
    <div
      data-alarm-overlay="active"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 select-none overflow-y-auto"
    >
      
      {/* Intense pulsing perimeter aura like phone emergency alarm */}
      <div className="absolute inset-0 border-4 sm:border-8 border-rose-500/60 animate-pulse pointer-events-none shadow-[inset_0_0_80px_rgba(244,63,94,0.4)]" />

      {/* Main Alarm Card */}
      <div className="relative w-full max-w-xl bg-neutral-950 border-2 border-rose-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-white overflow-hidden my-auto">
        
        {/* Glowing header bar with audio indicator */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-bounce">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  ⏰ ALARM RINGING (1.5 MIN+)
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
        <div className="space-y-2 bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
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
            {task.voiceAlarmEnabled !== false && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Alexa Voice Alarm</span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug font-display">
              {task.title}
            </h2>
            {task.description && (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Acknowledgment Verification Section (Based on User's Profile Preference) */}
        <div className="space-y-3 bg-rose-500/5 border border-rose-500/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-300 uppercase">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>
                {ackMode === "neither"
                  ? "Standard Alarm Dismiss"
                  : ackMode === "voice_only"
                  ? "Voice Confirmation Required"
                  : ackMode === "both"
                  ? "Typing & Voice Required"
                  : "Typing Confirmation Required"}
              </span>
            </div>
            {ackMode !== "neither" && (
              <span className="text-[11px] font-mono text-slate-400">
                {isFullySolved ? "✅ Unlocked" : "🔒 Locked"}
              </span>
            )}
          </div>

          {/* 1. Typing Challenge (If mode is 'type_only' or 'both') */}
          {(ackMode === "type_only" || ackMode === "both") && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-300">
                Type the exact phrase below to disarm:
              </p>
              <div className="p-2.5 rounded-xl bg-black/80 border border-neutral-700 font-mono text-xs text-yellow-300 font-bold tracking-wide select-text">
                {targetPhrase}
              </div>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder="Type phrase here..."
                  className={`w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 border text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition ${
                    isTypeSolved
                      ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20"
                      : "border-neutral-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  }`}
                />
                {isTypeSolved && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
          )}

          {/* 2. Voice Challenge (If mode is 'voice_only' or 'both') */}
          {(ackMode === "voice_only" || ackMode === "both") && (
            <div className="space-y-2 pt-1 border-t border-white/10">
              <p className="text-[11px] text-slate-300">
                Tap mic and say: <span className="text-yellow-300 font-mono font-bold">"{targetPhrase}"</span> or <span className="text-cyan-300 font-mono font-bold">"I am awake"</span>
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartVoiceVerification}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                    isVoiceVerified
                      ? "bg-emerald-500 text-black shadow-emerald-500/30"
                      : isVoiceListening
                      ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/20"
                      : "bg-purple-600 hover:bg-purple-500 text-white"
                  }`}
                >
                  {isVoiceVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>Voice Confirmed ✓</span>
                    </>
                  ) : isVoiceListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Listening... Speak Now</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>🎙️ Speak to Disarm</span>
                    </>
                  )}
                </button>

                {spokenText && (
                  <span className="text-[11px] font-mono text-purple-300 truncate max-w-[180px]">
                    "{spokenText}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls: Turn Off & Snooze */}
        <div className="space-y-2.5 pt-1">
          
          {/* Turn Off Button */}
          <button
            type="button"
            disabled={!isFullySolved}
            onClick={() => handleTurnOff(true)}
            className={`w-full py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isFullySolved
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 active:scale-95 animate-pulse"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
            }`}
          >
            {isFullySolved ? (
              <>
                <Unlock className="w-4 h-4 text-black" />
                <span>Turn Off Alarm (Confirmed &amp; Complete Task)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-neutral-500" />
                <span>Complete Verification Above to Disarm</span>
              </>
            )}
          </button>

          {/* Snooze Options */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              Snooze:
            </span>
            <div className="grid grid-cols-3 gap-2 flex-1">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSnooze(mins)}
                  className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-slate-200 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlarmClock className="w-3.5 h-3.5 text-purple-400" />
                  <span>+{mins}m</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
