"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  AcademicTask,
  loadTasks,
  saveTasks,
  isTaskDue,
} from "@/lib/taskAlarmStorage";
import { alarmAudio } from "@/lib/alarmAudioEngine";
import { NativeAlarmBridge } from "@/lib/nativeAlarmBridge";
import { AlarmOverlayModal } from "./AlarmOverlayModal";

export function GlobalAlarmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [activeAlarmTask, setActiveAlarmTask] = useState<AcademicTask | null>(
    null
  );

  // Load initial tasks & request native permissions
  useEffect(() => {
    setTasks(loadTasks());

    // Request native alarm and notification permissions
    NativeAlarmBridge.requestPermissions();

    const handleTasksUpdate = (e: any) => {
      if (e.detail) {
        setTasks(e.detail);
      } else {
        setTasks(loadTasks());
      }
    };

    window.addEventListener("stash_tasks_updated", handleTasksUpdate);
    return () =>
      window.removeEventListener("stash_tasks_updated", handleTasksUpdate);
  }, []);

  // Unlock audio on initial user click or keydown
  useEffect(() => {
    const handleUserInteraction = () => {
      alarmAudio.unlockAudio();
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });

    // Request notification permission if supported
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Listen to manual test alarm triggers
  useEffect(() => {
    const handleTestAlarm = (e: any) => {
      const task: AcademicTask = e.detail;
      if (task) {
        setActiveAlarmTask(task);
        alarmAudio.startAlarm(task.alarmTone || "digital");
      }
    };

    window.addEventListener("stash_trigger_alarm", handleTestAlarm);
    return () =>
      window.removeEventListener("stash_trigger_alarm", handleTestAlarm);
  }, []);

  // Check for due tasks every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeAlarmTask) return; // Already ringing

      const currentTasks = loadTasks();
      for (const t of currentTasks) {
        if (isTaskDue(t)) {
          // Update lastTriggeredAt to prevent immediate double ring
          const updated = currentTasks.map((item) =>
            item.id === t.id
              ? { ...item, lastTriggeredAt: Date.now() }
              : item
          );
          saveTasks(updated);
          setTasks(updated);

          // Trigger Ringing Alarm with task's chosen tone
          setActiveAlarmTask(t);
          alarmAudio.startAlarm(t.alarmTone || "digital");

          // Native Web Notification
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(`⏰ Task Alarm: ${t.title}`, {
                body: `${t.description || "Due now!"} - Open Stash to solve challenge and dismiss.`,
                icon: "/favicon.ico",
                requireInteraction: true,
              });
            } catch {}
          }

          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAlarmTask]);

  // Handle Dismiss / Completed
  const handleDismiss = useCallback(
    (taskId: string, completed = true) => {
      alarmAudio.stopAlarm();
      setActiveAlarmTask(null);

      // Cancel native alarm
      NativeAlarmBridge.cancelTaskAlarm(taskId);

      const currentTasks = loadTasks();
      const updated = currentTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: completed ? ("completed" as const) : ("dismissed" as const),
              snoozeUntil: null,
            }
          : t
      );
      saveTasks(updated);
      setTasks(updated);
    },
    []
  );

  // Handle Snooze
  const handleSnooze = useCallback((taskId: string, minutes: number) => {
    alarmAudio.stopAlarm();
    setActiveAlarmTask(null);

    const snoozeUntil = Date.now() + minutes * 60 * 1000;
    const currentTasks = loadTasks();
    const updated = currentTasks.map((t) =>
      t.id === taskId
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
  }, []);

  return (
    <>
      {children}

      {/* Fullscreen Phone Wake-Up Alarm Overlay */}
      {activeAlarmTask && (
        <AlarmOverlayModal
          task={activeAlarmTask}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
        />
      )}
    </>
  );
}
