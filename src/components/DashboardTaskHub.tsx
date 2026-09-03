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
import { NativeAlarmBridge } from "@/lib/nativeAlarmBridge";
import { HapticEngine } from "@/lib/hapticEngine";
import {
  Calendar,
  Clock,
  Plus,
  Bell,
  AlarmClock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Sparkles,
  X,
  Volume2,
  Lock,
  Play,
  Music,
} from "lucide-react";

export function DashboardTaskHub() {
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "today" | "completed">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(getTodayDateString(0));
  const [dueTime, setDueTime] = useState(getCurrentTimeString(10));
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [category, setCategory] = useState<"assignment" | "exam" | "lab" | "project" | "study" | "custom">("assignment");
  const [selectedTone, setSelectedTone] = useState<AlarmTone>("digital");
  const [customChallenge, setCustomChallenge] = useState("");

  // Load tasks on mount and sync on updates
  useEffect(() => {
    setTasks(loadTasks());
    setSelectedTone(getDefaultAlarmTone());

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setTasks(e.detail);
      } else {
        setTasks(loadTasks());
      }
    };

    window.addEventListener("stash_tasks_updated", handleUpdate);
    const interval = setInterval(() => {
      setTasks(loadTasks());
    }, 10000);

    return () => {
      window.removeEventListener("stash_tasks_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Update auto challenge text when title changes
  useEffect(() => {
    if (title.trim()) {
      setCustomChallenge(`I acknowledge: ${title.trim()}`);
    } else {
      setCustomChallenge("");
    }
  }, [title]);

  // Handle Add Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: AcademicTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      dueTime,
      priority,
      category,
      alarmTone: selectedTone,
      challengeText: customChallenge.trim() || `I acknowledge: ${title.trim()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const currentTasks = loadTasks();
    const updated = [newTask, ...currentTasks];
    saveTasks(updated);
    setTasks(updated);

    // Schedule native exact alarm for Android/iOS with DND bypass
    NativeAlarmBridge.scheduleTaskAlarm(newTask);

    // Save tone preference
    setDefaultAlarmTone(selectedTone);

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate(getTodayDateString(0));
    setDueTime(getCurrentTimeString(15));
    setIsCreateModalOpen(false);
  };

  // Preview tone burst
  const handlePreviewTone = (tone: AlarmTone) => {
    alarmAudio.unlockAudio();
    alarmAudio.previewTone(tone);
  };

  // Trigger Immediate Test Alarm
  const handleTriggerTestAlarm = (taskToTest?: AcademicTask) => {
    const task: AcademicTask = taskToTest || {
      id: "test-preview-alarm",
      title: "Test Alarm: Wake Up & Complete Task",
      description: "This is a live test of the phone wake-up alarm sound, screen pulse, and typing acknowledgment challenge.",
      dueDate: getTodayDateString(0),
      dueTime: getCurrentTimeString(0),
      priority: "critical",
      category: "custom",
      alarmTone: selectedTone || "digital",
      challengeText: "I acknowledge: Wake up and focus on my studies",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    window.dispatchEvent(
      new CustomEvent("stash_trigger_alarm", { detail: task })
    );
  };

  // Toggle Task Status (Completed / Pending)
  const handleToggleStatus = (id: string) => {
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
    const currentTasks = loadTasks();
    const updated = currentTasks.filter((t) => t.id !== id);
    saveTasks(updated);
    setTasks(updated);
    NativeAlarmBridge.cancelTaskAlarm(id);
  };

  // Quick Snooze +5 mins
  const handleQuickSnooze = (id: string) => {
    const currentTasks = loadTasks();
    const snoozeUntil = Date.now() + 5 * 60 * 1000;
    const updated = currentTasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status: "snoozed" as const,
            snoozeUntil,
            lastTriggeredAt: null,
          }
        : t
    );
    saveTasks(updated);
    setTasks(updated);
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
        return "border-rose-500/40 bg-rose-500/10 text-rose-300";
      case "high":
        return "border-amber-500/40 bg-amber-500/10 text-amber-300";
      case "medium":
        return "border-purple-500/40 bg-purple-500/10 text-purple-300";
      default:
        return "border-blue-500/40 bg-blue-500/10 text-blue-300";
    }
  };

  const getBorderColor = (p: string) => {
    switch (p) {
      case "critical":
        return "border-l-rose-500";
      case "high":
        return "border-l-amber-500";
      case "medium":
        return "border-l-purple-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getToneIcon = (tone?: AlarmTone) => {
    const match = ALARM_TONE_OPTIONS.find((opt) => opt.id === tone);
    return match?.iconText || "📟";
  };

  return (
    <div className="space-y-4">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
          <Calendar className="w-5 h-5 text-white" />
          Academic Tasks &amp; Alarms
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTriggerTestAlarm()}
            title="Test Phone Wake-Up Alarm Screen & Sound"
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>Test Alarm</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Main Task List Card */}
      <div className="fused-card rounded-2xl p-5 space-y-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 pb-1 border-b border-white/10 overflow-x-auto text-[11px] font-mono">
          {(["all", "pending", "today", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer font-bold ${
                filter === tab
                  ? "bg-white/15 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "all" ? `All (${tasks.length})` : tab}
            </button>
          ))}
        </div>

        {/* Task Items */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <AlarmClock className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">No tasks found</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Schedule an assignment deadline or study session with loud wake-up alarm reminders.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 text-xs font-mono text-purple-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add your first task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((t) => {
              const isCompleted = t.status === "completed";
              const timeString = getTimeRemainingString(t);

              return (
                <div
                  key={t.id}
                  className={`border-l-4 ${getBorderColor(
                    t.priority
                  )} bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3.5 space-y-2 transition group`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                          t.priority
                        )}`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {t.category}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-purple-300 uppercase bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                        <span>{getToneIcon(t.alarmTone)}</span>
                        <span>{t.alarmTone || "digital"}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {t.dueTime} &bull; {t.dueDate}
                      </span>
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
                      className={`text-sm font-bold leading-snug transition ${
                        isCompleted
                          ? "text-slate-500 line-through"
                          : "text-white group-hover:text-purple-200"
                      }`}
                    >
                      {t.title}
                    </h4>
                    {t.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    )}
                  </div>

                  {/* Anti-Sleep typing challenge note */}
                  <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">Challenge: &ldquo;{t.challengeText}&rdquo;</span>
                  </div>

                  {/* Task Card Action Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t.id)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                      </button>

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleQuickSnooze(t.id)}
                          title="Snooze for 5 minutes"
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <AlarmClock className="w-3 h-3 text-amber-400" />
                          <span>+5m Snooze</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTriggerTestAlarm(t)}
                        title="Test Alarm with this task's ringtone"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition cursor-pointer flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">Ring</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(t.id)}
                        title="Delete Task"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: Add New Task & Alarm */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fused-card border-prismatic rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <AlarmClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Create Task Alarm
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Phone wake-up alarm with anti-sleep typing challenge &amp; custom ringtones
                  </p>
                </div>
              </div>

              <button
                data-modal-close="true"
                onClick={() => {
                  HapticEngine.trigger("light");
                  setIsCreateModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              
              {/* Event / Task Title */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-300 block">
                  Event / Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Algorithms Homework 4 / Midterm Revision"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white text-xs placeholder-slate-500 focus:outline-none transition"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-300 block">
                  Description / Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes, topics, or instructions to remember when the alarm rings..."
                  className="w-full py-2 px-3.5 rounded-xl bg-neutral-900 border border-neutral-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white text-xs placeholder-slate-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Alarm Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Alarm Time (24h) *
                  </label>
                  <input
                    type="time"
                    required
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="critical">Critical (Loudest)</option>
                    <option value="high">High Urgency</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="lab">Lab Assessment</option>
                    <option value="exam">Exam / Quiz</option>
                    <option value="project">Project Work</option>
                    <option value="study">Study Session</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Alarm Tone / Ringtone Sound Selector */}
              <div className="space-y-2 bg-purple-500/5 border border-purple-500/20 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-purple-400" />
                    <span>Alarm Tone / Ringtone:</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Click ▶ to preview sound
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALARM_TONE_OPTIONS.map((tone) => {
                    const isSelected = selectedTone === tone.id;
                    return (
                      <div
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-500 ring-1 ring-purple-500/40 text-white"
                            : "bg-neutral-900/90 border-neutral-700 text-slate-300 hover:border-neutral-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-base shrink-0">{tone.iconText}</span>
                          <div className="overflow-hidden">
                            <h5 className="font-bold text-xs truncate leading-tight">
                              {tone.name}
                            </h5>
                            <p className="text-[10px] text-slate-400 truncate">
                              {tone.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewTone(tone.id);
                          }}
                          title={`Preview ${tone.name}`}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-purple-500 hover:text-white text-slate-300 transition shrink-0 ml-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Anti-Sleep Typing Challenge Preview */}
              <div className="space-y-1.5 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-300">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mandatory Typing Challenge to Turn Off:</span>
                </div>
                <input
                  type="text"
                  value={customChallenge}
                  onChange={(e) => setCustomChallenge(e.target.value)}
                  placeholder="Phrase user must type to silence the alarm..."
                  className="w-full py-1.5 px-2.5 rounded-lg bg-black/60 border border-neutral-700 text-yellow-300 text-xs font-mono focus:border-rose-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  The alarm stays ringing until you type this exact phrase when it fires.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-black" />
                  <span>Save Task Alarm</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
