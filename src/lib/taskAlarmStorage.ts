// Academic Task & Alarm Storage System
import { AlarmTone } from "./alarmAudioEngine";

export type AlarmAckMode = "both" | "type_only" | "voice_only" | "neither";

export interface AcademicTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM (24h)
  priority: "low" | "medium" | "high" | "critical";
  category: "assignment" | "exam" | "lab" | "project" | "study" | "custom";
  alarmTone?: AlarmTone; // Chosen phone ringtone sound (60+ options)
  challengeText: string; // The phrase the user MUST type or speak to disarm the alarm
  status: "pending" | "snoozed" | "completed" | "dismissed";
  snoozeUntil?: number | null; // epoch ms
  lastTriggeredAt?: number | null;
  voiceAlarmEnabled?: boolean; // Whether Alexa voice assistant speaks the task reminder during the alarm
  durationSeconds?: number; // Ring duration (default: 90s / 1.5 mins)
  createdAt: string;
}

const STORAGE_KEY = "stash_academic_tasks_v1";
const DEFAULT_TONE_KEY = "stash_default_alarm_tone";
const ALARM_ACK_MODE_KEY = "stash_alarm_ack_mode";
const VOICE_AUTH_PHRASE_KEY = "stash_voice_auth_phrase";

export const DEFAULT_VOICE_AUTH_PHRASE = "I am awake and ready to study";

// Helper to get formatted local date string YYYY-MM-DD
export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to get formatted local time string HH:MM
export function getCurrentTimeString(offsetMinutes = 0): string {
  const d = new Date();
  if (offsetMinutes !== 0) {
    d.setMinutes(d.getMinutes() + offsetMinutes);
  }
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getDefaultAlarmTone(): AlarmTone {
  if (typeof window === "undefined") return "samsung_horizon";
  try {
    const saved = localStorage.getItem(DEFAULT_TONE_KEY) as AlarmTone;
    if (saved) return saved;
  } catch {}
  return "samsung_horizon";
}

export function setDefaultAlarmTone(tone: AlarmTone): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEFAULT_TONE_KEY, tone);
  } catch {}
}

export function getAlarmAckMode(): AlarmAckMode {
  if (typeof window === "undefined") return "type_only";
  try {
    const saved = localStorage.getItem(ALARM_ACK_MODE_KEY) as AlarmAckMode;
    if (saved && ["both", "type_only", "voice_only", "neither"].includes(saved)) {
      return saved;
    }
  } catch {}
  return "type_only";
}

export function setAlarmAckMode(mode: AlarmAckMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ALARM_ACK_MODE_KEY, mode);
    window.dispatchEvent(new CustomEvent("stash_ack_mode_updated", { detail: mode }));
  } catch {}
}

export function getVoiceAuthPhrase(): string {
  if (typeof window === "undefined") return DEFAULT_VOICE_AUTH_PHRASE;
  try {
    const saved = localStorage.getItem(VOICE_AUTH_PHRASE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return DEFAULT_VOICE_AUTH_PHRASE;
}

export function setVoiceAuthPhrase(phrase: string): void {
  if (typeof window === "undefined") return;
  try {
    const clean = phrase.trim() || DEFAULT_VOICE_AUTH_PHRASE;
    localStorage.setItem(VOICE_AUTH_PHRASE_KEY, clean);
    window.dispatchEvent(new CustomEvent("stash_voice_auth_updated", { detail: clean }));
  } catch {}
}

// Sample default tasks to showcase when user first lands
export const DEFAULT_TASKS: AcademicTask[] = [
  {
    id: "task-1",
    title: "Algorithms Homework 4: Dynamic Programming",
    description: "Solve Longest Common Subsequence and Knapsack problems on Stash.",
    dueDate: getTodayDateString(0),
    dueTime: getCurrentTimeString(30),
    priority: "high",
    category: "assignment",
    alarmTone: "samsung_horizon",
    challengeText: "I am awake and working on Dynamic Programming Assignment",
    status: "pending",
    voiceAlarmEnabled: true,
    durationSeconds: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Operating Systems: Kernel Threads Lab Prep",
    description: "Review mutex synchronization and POSIX pthread code in file vault.",
    dueDate: getTodayDateString(0),
    dueTime: getCurrentTimeString(120),
    priority: "critical",
    category: "lab",
    alarmTone: "xiaomi_fireflies",
    challengeText: "I will complete the OS Kernel Thread lab today",
    status: "pending",
    voiceAlarmEnabled: true,
    durationSeconds: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Database Systems: Mid-Term Examination",
    description: "B+ Tree indices, SQL subqueries, and ACID transaction isolation levels.",
    dueDate: getTodayDateString(1),
    dueTime: "09:00",
    priority: "critical",
    category: "exam",
    alarmTone: "nuclear_siren",
    challengeText: "Ready for Mid-Term exam with maximum focus",
    status: "pending",
    voiceAlarmEnabled: true,
    durationSeconds: 300,
    createdAt: new Date().toISOString(),
  },
];

// Load tasks from LocalStorage
export function loadTasks(): AcademicTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load tasks from local storage:", e);
    return [];
  }
}

// Save tasks to LocalStorage and broadcast update event
export function saveTasks(tasks: AcademicTask[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent("stash_tasks_updated", { detail: tasks }));
  } catch (e) {
    console.warn("Failed to save tasks to local storage:", e);
  }
}

// Format time remaining for human display
export function getTimeRemainingString(task: AcademicTask): string {
  try {
    const now = new Date();
    const [dueHours, dueMinutes] = task.dueTime.split(":").map(Number);
    const [year, month, day] = task.dueDate.split("-").map(Number);

    const targetDate = new Date(year, month - 1, day, dueHours, dueMinutes, 0, 0);
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      const minutesAgo = Math.abs(Math.floor(diffMs / (1000 * 60)));
      if (minutesAgo < 60) {
        return `${minutesAgo}m overdue`;
      }
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo}h overdue`;
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `in ${diffDays}d ${diffHours % 24}h`;
    }
    if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes % 60}m`;
    }
    return `in ${diffMinutes}m`;
  } catch {
    return task.dueTime;
  }
}

// Check if a task is currently due
export function isTaskDue(task: AcademicTask): boolean {
  if (task.status === "completed" || task.status === "dismissed") {
    return false;
  }

  const now = Date.now();

  // If snoozed, check snooze expiry
  if (task.status === "snoozed" && task.snoozeUntil) {
    return now >= task.snoozeUntil;
  }

  // Check scheduled due date & time
  try {
    const [dueHours, dueMinutes] = task.dueTime.split(":").map(Number);
    const [year, month, day] = task.dueDate.split("-").map(Number);

    const targetDate = new Date(year, month - 1, day, dueHours, dueMinutes, 0, 0);
    const diffMs = now - targetDate.getTime();

    // Trigger if within last 60 seconds of due time
    return diffMs >= 0 && diffMs < 120000;
  } catch {
    return false;
  }
}
