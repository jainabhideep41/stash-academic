// Academic Task & Alarm Storage System
import { AlarmTone } from "./alarmAudioEngine";

export interface AcademicTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM (24h)
  priority: "low" | "medium" | "high" | "critical";
  category: "assignment" | "exam" | "lab" | "project" | "study" | "custom";
  alarmTone?: AlarmTone; // Chosen phone ringtone sound
  challengeText: string; // The phrase the user MUST type to turn off the alarm
  status: "pending" | "snoozed" | "completed" | "dismissed";
  snoozeUntil?: number | null; // epoch ms
  lastTriggeredAt?: number | null;
  createdAt: string;
}

const STORAGE_KEY = "stash_academic_tasks_v1";
const DEFAULT_TONE_KEY = "stash_default_alarm_tone";

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
  if (typeof window === "undefined") return "digital";
  try {
    const saved = localStorage.getItem(DEFAULT_TONE_KEY) as AlarmTone;
    if (saved && ["digital", "radar", "siren", "gentle", "arcade"].includes(saved)) {
      return saved;
    }
  } catch {}
  return "digital";
}

export function setDefaultAlarmTone(tone: AlarmTone): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEFAULT_TONE_KEY, tone);
  } catch {}
}

// Sample default tasks to showcase when user first lands
export const DEFAULT_TASKS: AcademicTask[] = [
  {
    id: "task-1",
    title: "Algorithms Homework 4: Dynamic Programming",
    description: "Solve Longest Common Subsequence and Knapsack problems on Stash.",
    dueDate: getTodayDateString(0),
    dueTime: "23:59",
    priority: "high",
    category: "assignment",
    alarmTone: "radar",
    challengeText: "I acknowledge: Complete Algorithms DP Homework",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Full Stack Lab 04 Submission",
    description: "Generate assessment docx for FSD-II and upload to CU Portal.",
    dueDate: getTodayDateString(1),
    dueTime: "17:00",
    priority: "critical",
    category: "lab",
    alarmTone: "digital",
    challengeText: "I acknowledge: Submit FSD Lab 4 Report",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Database Project Phase 2 ER Schema",
    description: "Finalize relational schemas, normalization, and foreign keys.",
    dueDate: getTodayDateString(2),
    dueTime: "14:30",
    priority: "medium",
    category: "project",
    alarmTone: "gentle",
    challengeText: "I acknowledge: Finalize Database Schema",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

// Load tasks from LocalStorage
export function loadTasks(): AcademicTask[] {
  if (typeof window === "undefined") return DEFAULT_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasks(DEFAULT_TASKS);
      return DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TASKS;
  } catch (e) {
    console.warn("Failed to read tasks from storage:", e);
    return DEFAULT_TASKS;
  }
}

// Save tasks to LocalStorage and dispatch event for real-time reactivity
export function saveTasks(tasks: AcademicTask[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent("stash_tasks_updated", { detail: tasks }));
  } catch (e) {
    console.warn("Failed to write tasks to storage:", e);
  }
}

// Check if a task is due right now
export function isTaskDue(task: AcademicTask): boolean {
  if (task.status === "completed" || task.status === "dismissed") {
    return false;
  }

  const now = Date.now();

  // If snoozed, check snooze timestamp
  if (task.status === "snoozed" && task.snoozeUntil) {
    return now >= task.snoozeUntil;
  }

  // Parse due date and due time (in local timezone)
  try {
    const [year, month, day] = task.dueDate.split("-").map(Number);
    const [hour, minute] = task.dueTime.split(":").map(Number);
    const targetDate = new Date(year, month - 1, day, hour, minute, 0, 0);
    const targetMs = targetDate.getTime();

    // Trigger if within current minute window
    if (now >= targetMs) {
      if (!task.lastTriggeredAt || now - task.lastTriggeredAt > 90000) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

// Calculate human-readable time remaining string
export function getTimeRemainingString(task: AcademicTask): string {
  if (task.status === "completed") return "Completed";
  if (task.status === "snoozed" && task.snoozeUntil) {
    const diffMs = task.snoozeUntil - Date.now();
    if (diffMs <= 0) return "Snooze ending now!";
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    return `Snoozed (${diffMins}m left)`;
  }

  try {
    const [year, month, day] = task.dueDate.split("-").map(Number);
    const [hour, minute] = task.dueTime.split(":").map(Number);
    const target = new Date(year, month - 1, day, hour, minute, 0, 0).getTime();
    const diff = target - Date.now();

    if (diff <= 0) return "Due / Ringing";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `In ${days}d ${hours % 24}h`;
    if (hours > 0) return `In ${hours}h ${mins}m`;
    return `In ${mins} mins`;
  } catch {
    return "Scheduled";
  }
}
