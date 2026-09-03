// Native Alarm Bridge (Capacitor Native Android/iOS <-> Next.js Web)
// Handles native exact alarms, DND bypass notification channels, and lockscreen wakeups

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { AcademicTask } from "./taskAlarmStorage";

export class NativeAlarmBridge {
  public static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Request native alarm and notification permissions
  public static async requestPermissions(): Promise<boolean> {
    if (!this.isNative()) return false;
    try {
      const status = await LocalNotifications.requestPermissions();
      return status.display === "granted";
    } catch (e) {
      console.warn("Native permission request failed:", e);
      return false;
    }
  }

  // Schedule native exact alarm on Android / iOS
  public static async scheduleTaskAlarm(task: AcademicTask): Promise<void> {
    if (!this.isNative()) return;

    try {
      // Parse task date and time
      const [year, month, day] = task.dueDate.split("-").map(Number);
      const [hour, minute] = task.dueTime.split(":").map(Number);
      const scheduleDate = new Date(year, month - 1, day, hour, minute, 0, 0);

      if (scheduleDate.getTime() <= Date.now()) {
        return; // Already past
      }

      // Generate numeric ID from task ID
      const numericId = Math.abs(
        task.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      );

      await LocalNotifications.schedule({
        notifications: [
          {
            id: numericId,
            title: `⏰ WAKE-UP ALARM: ${task.title}`,
            body: `${task.description || "Due now!"} - Type phrase to dismiss!`,
            channelId: "stash_alarm_channel_dnd_bypass",
            schedule: { at: scheduleDate, allowWhileIdle: true },
            sound: "alarm_sound.wav",
            extra: { taskId: task.id },
          },
        ],
      });
    } catch (e) {
      console.warn("Failed to schedule native alarm:", e);
    }
  }

  // Cancel scheduled native alarm
  public static async cancelTaskAlarm(taskId: string): Promise<void> {
    if (!this.isNative()) return;
    try {
      const numericId = Math.abs(
        taskId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      );
      await LocalNotifications.cancel({ notifications: [{ id: numericId }] });
    } catch (e) {
      console.warn("Failed to cancel native alarm:", e);
    }
  }
}
