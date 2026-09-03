/**
 * Native Haptics & Vibration Engine
 * Stash Academic Mobile
 */

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

export type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | "selection";

export class HapticEngine {
  /**
   * Trigger native tactile feedback
   */
  static async trigger(type: HapticFeedbackType = "light"): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        switch (type) {
          case "light":
            await Haptics.impact({ style: ImpactStyle.Light });
            break;
          case "medium":
            await Haptics.impact({ style: ImpactStyle.Medium });
            break;
          case "heavy":
            await Haptics.impact({ style: ImpactStyle.Heavy });
            break;
          case "success":
            await Haptics.notification({ type: NotificationType.Success });
            break;
          case "warning":
            await Haptics.notification({ type: NotificationType.Warning });
            break;
          case "error":
            await Haptics.notification({ type: NotificationType.Error });
            break;
          case "selection":
            await Haptics.selectionStart();
            await Haptics.selectionChanged();
            await Haptics.selectionEnd();
            break;
        }
      } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        // Fallback for mobile browsers
        switch (type) {
          case "light":
          case "selection":
            navigator.vibrate(10);
            break;
          case "medium":
            navigator.vibrate(25);
            break;
          case "heavy":
            navigator.vibrate(50);
            break;
          case "success":
            navigator.vibrate([20, 50, 20]);
            break;
          case "warning":
            navigator.vibrate([40, 60, 40]);
            break;
          case "error":
            navigator.vibrate([60, 80, 60, 80]);
            break;
        }
      }
    } catch {
      // Ignore if hardware does not support haptics
    }
  }
}
