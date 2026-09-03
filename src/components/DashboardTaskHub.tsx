"use client";

import React, { useState, useEffect } from "react";
import {
  AcademicTask,
  loadTasks,
  saveTasks,
  getTodayDateString,
  getCurrentTimeString,
  getTimeRemainingString,
  getDefaultAlarmTone,
  setDefaultAlarmTone,
} from "@/lib/taskAlarmStorage";
import {
  alarmAudio,
  AlarmTone,
  ALARM_TONE_OPTIONS,
} from "@/lib/alarmAudioEngine";
import { voiceAssistant } from "@/lib/voiceAssistantEngine";
import { NativeAlarmBridge } from "@/lib/nativeAlarmBridge";
import { HapticEngine } from "@/lib/hapticEngine";
import {
  Calendar,
  Clock,
  Plus,
  AlarmClock,
  CheckCircle2,
  Trash2,
  X,
  Volume2,
  Mic,
  Sparkles,
} from "lucide-react";

export function DashboardTaskHub() {
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [filter, setFilter] = useState<"pending" | "completed" | "today" | "all">("pending");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(getTodayDateString(0));
  const [dueTime, setDueTime] = useState("08:00");
  const [category, setCategory] = useState<AcademicTask["category"]>("assignment");
  const [priority, setPriority] = useState<AcademicTask["priority"]>("high");
  const [alarmTone, setAlarmTone] = useState<AlarmTone>("digital");
  const [voiceAlarmEnabled, setVoiceAlarmEnabled] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState(90);
  const [challengeText, setChallengeText] = useState("");
  const [previewPlaying, setPreviewPlaying] = useState<AlarmTone | null>(null);

  // Load saved tasks on initial mount
  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
    setAlarmTone(getDefaultAlarmTone());
  }, []);

  // Set default due time 1 hour ahead
  useEffect(() => {
    if (isCreateModalOpen) {
      setDueTime(getCurrentTimeString(60));
    }
  }, [isCreateModalOpen]);

  // Audio preview cleaner
  useEffect(() => {
    return () => {
      alarmAudio.stopAlarm();
    };
  }, []);

  // Handle Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    HapticEngine.trigger("success");

    const newTask: AcademicTask = {
      id: "task_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      dueTime,
      category,
      priority,
      status: "pending",
      alarmTone,
      voiceAlarmEnabled,
      durationSeconds,
      challengeText: challengeText.trim() || `I acknowledge: ${title.trim()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setTasks(updated);
    setDefaultAlarmTone(alarmTone);

    // Schedule exact native Android alarm with DND bypass
    NativeAlarmBridge.scheduleTaskAlarm(newTask);

    // Reset Form
    setTitle("");
    setDescription("");
    setChallengeText("");
    setIsCreateModalOpen(false);
  };

  // Toggle Task Status (Completed / Pending)
  const handleToggleStatus = (id: string) => {
    HapticEngine.trigger("light");
    const currentTasks = loadTasks();
    const updated = currentTasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: (t.status === "completed" ? "pending" : "completed") as any,
            snoozeUntil: null,
          }
        : t
    );
    saveTasks(updated);
    setTasks(updated);
    NativeAlarmBridge.cancelTaskAlarm(id);
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    HapticEngine.trigger("warning");
    const currentTasks = loadTasks();
    const updated = currentTasks.filter((t) => t.id !== id);
    saveTasks(updated);
    setTasks(updated);
    NativeAlarmBridge.cancelTaskAlarm(id);
  };

  // Trigger Instant Test Alarm
  const handleTriggerTestAlarm = (customTask?: AcademicTask) => {
    HapticEngine.trigger("heavy");
    const testTask: AcademicTask = customTask || {
      id: "test_" + Date.now(),
      title: "URGENT: Submit Database Assignment 3",
      description: "Immediate submission deadline before midnight lock.",
      dueDate: getTodayDateString(0),
      dueTime: "23:59",
      category: "assignment",
      priority: "critical",
      status: "pending",
      alarmTone: alarmTone,
      voiceAlarmEnabled: true,
      durationSeconds: 90,
      challengeText: "I am awake and working on Database Assignment 3",
      createdAt: new Date().toISOString(),
    };

    window.dispatchEvent(
      new CustomEvent("stash_trigger_alarm", {
        detail: { task: testTask },
      })
    );
  };

  // Preview Tone in Form
  const handleTogglePreviewTone = (tone: AlarmTone) => {
    if (previewPlaying === tone) {
      alarmAudio.stopAlarm();
      setPreviewPlaying(null);
    } else {
      HapticEngine.trigger("selection");
      alarmAudio.startAlarm(tone, 10);
      setPreviewPlaying(tone);
    }
  };

  // Filter tasks
  const todayStr = getTodayDateString(0);
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return t.status === "pending" || t.status === "snoozed";
    if (filter === "completed") return t.status === "completed";
    if (filter === "today") return t.dueDate === todayStr;
    return true;
  });

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
      case "critical":
        return "border-rose-500/40 bg-rose-500/15 text-rose-300";
      case "high":
        return "border-amber-500/40 bg-amber-500/15 text-amber-300";
      case "medium":
        return "border-purple-500/40 bg-purple-500/15 text-purple-300";
      default:
        return "border-blue-500/40 bg-blue-500/15 text-blue-300";
    }
  };

  const getToneIcon = (tone?: AlarmTone) => {
    const match = ALARM_TONE_OPTIONS.find((opt) => opt.id === tone);
    return match?.iconText || "📟";
  };

  const activeCount = tasks.filter((t) => t.status === "pending" || t.status === "snoozed").length;
  const todayCount = tasks.filter((t) => t.dueDate === todayStr).length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-4">
      
      {/* Native App Screen Header & Action Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 font-display">
            <span>Academic Tasks &amp; Alarms</span>
          </h2>
          <p className="text-[11px] font-mono text-neutral-400">
            {activeCount} Active &bull; 1.5+ Min DND &amp; Voice Alarms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTriggerTestAlarm()}
            title="Test Phone Wake-Up Alarm Screen & Voice"
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <AlarmClock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Test Ring</span>
            <span className="sm:hidden">Test</span>
          </button>

          <button
            type="button"
            onClick={() => {
              HapticEngine.trigger("light");
              setIsCreateModalOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* iOS / Material 3 Style Segmented Control Filter Bar */}
      <div className="p-1 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-between text-xs font-mono font-bold">
        {[
          { key: "pending", label: "Active", count: activeCount },
          { key: "today", label: "Today", count: todayCount },
          { key: "completed", label: "Done", count: completedCount },
          { key: "all", label: "All", count: tasks.length },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                HapticEngine.trigger("selection");
                setFilter(tab.key as any);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-md font-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1 text-[10px] ${isActive ? "text-neutral-700" : "text-neutral-500"}`}>
                ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped Inset Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No tasks found</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {filter === "completed"
                  ? "Completed tasks will show up here."
                  : "Tap the + button to schedule your first academic alarm."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                HapticEngine.trigger("light");
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task Alarm</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === "completed";
            const timeString = getTimeRemainingString(t);

            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all active:scale-[0.99] ${
                  isCompleted
                    ? "bg-neutral-950/40 border-neutral-900 opacity-60"
                    : "bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  
                  {/* Native Touch Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(t.id)}
                    className="mt-0.5 shrink-0 text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center text-black shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-neutral-600 hover:border-purple-400 transition" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                            t.priority
                          )}`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                          <span>{getToneIcon(t.alarmTone)}</span>
                          <span>{t.alarmTone || "digital"}</span>
                        </span>
                        {t.voiceAlarmEnabled !== false && (
                          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                            <span>Voice</span>
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold shrink-0 ${
                          isCompleted
                            ? "text-emerald-400"
                            : t.status === "snoozed"
                            ? "text-amber-400 animate-pulse"
                            : "text-purple-300"
                        }`}
                      >
                        {timeString}
                      </span>
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold leading-snug ${
                          isCompleted ? "text-neutral-500 line-through" : "text-white"
                        }`}
                      >
                        {t.title}
                      </h4>
                      {t.description && (
                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{t.dueTime} &bull; {t.dueDate} ({t.durationSeconds || 90}s ring)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTriggerTestAlarm(t)}
                          title="Ring this task alarm"
                          className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-rose-400" />
                          <span>Ring</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(t.id)}
                          title="Delete task"
                          className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) on Mobile screens (< md) */}
      <button
        type="button"
        onClick={() => {
          HapticEngine.trigger("medium");
          setIsCreateModalOpen(true);
        }}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(168,85,247,0.5)] active:scale-90 transition-transform cursor-pointer"
        title="Create New Academic Task Alarm"
      >
        <Plus className="w-7 h-7 text-white stroke-[2.5]" />
      </button>

      {/* Mobile Bottom Action Sheet & Desktop Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-950 border-t md:border border-neutral-800 rounded-t-3xl md:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Sheet Grabber Handle */}
            <div className="w-12 h-1.5 rounded-full bg-neutral-700 mx-auto -mt-2 mb-2 md:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <AlarmClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Schedule Task Alarm
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Bypasses phone DND with Alexa voice reminders &amp; verification
                  </p>
                </div>
              </div>

              <button
                data-modal-close="true"
                onClick={() => {
                  HapticEngine.trigger("light");
                  setIsCreateModalOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-neutral-900 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              
              {/* Task Title */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-300 block">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems Lab 4 Submission"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Task Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-300 block">
                  Description / Study Goal (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Include submission portal links, rubric checks, or team reminder notes."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-purple-500 transition resize-none"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Alarm Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="critical">🚨 Critical / Exam</option>
                    <option value="high">🔥 High Priority</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="low">☕ Low / Routine</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value="assignment">📝 Assignment</option>
                    <option value="exam">🎓 Exam / Test</option>
                    <option value="study">📚 Study Session</option>
                    <option value="project">💻 Project Lab</option>
                    <option value="custom">⏰ General Wake-Up</option>
                  </select>
                </div>
              </div>

              {/* Voice Alarm & Duration Customizations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Alexa Voice Alarm</span>
                    </span>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      Speaks task reminder aloud
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={voiceAlarmEnabled}
                    onChange={(e) => setVoiceAlarmEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 bg-neutral-800 border-neutral-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 block">
                    Alarm Ring Duration
                  </label>
                  <select
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  >
                    <option value={90}>⏱️ 1.5 Minutes (90s)</option>
                    <option value={180}>⏱️ 3 Minutes (180s)</option>
                    <option value={300}>⏱️ 5 Minutes (300s)</option>
                  </select>
                </div>
              </div>

              {/* Alarm Tone Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center justify-between">
                  <span>Custom Alarm Ringtone</span>
                  <span className="text-[10px] text-purple-400 font-normal">Tap to preview sound</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALARM_TONE_OPTIONS.map((opt) => {
                    const isSelected = alarmTone === opt.id;
                    const isPlaying = previewPlaying === opt.id;

                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => {
                          setAlarmTone(opt.id);
                          handleTogglePreviewTone(opt.id);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-purple-500/15 border-purple-500 text-white shadow-sm"
                            : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{opt.iconText}</span>
                          <div className="truncate">
                            <p className="text-xs font-bold truncate leading-tight">{opt.name}</p>
                            <p className="text-[10px] font-mono text-neutral-500 truncate">{opt.description}</p>
                          </div>
                        </div>
                        <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? "text-purple-400 animate-pulse" : "text-neutral-600"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Anti-Sleep Typing Challenge */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-neutral-300 flex items-center justify-between">
                  <span>Anti-Sleep Challenge Text</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Used for typed / voice verification</span>
                </label>
                <input
                  type="text"
                  placeholder={`Default: I acknowledge: ${title || "this task"}`}
                  value={challengeText}
                  onChange={(e) => setChallengeText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-black transition shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <AlarmClock className="w-4 h-4 text-black" />
                  <span>Set Task Alarm</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
