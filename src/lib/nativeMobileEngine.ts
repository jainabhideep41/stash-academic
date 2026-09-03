/**
 * Native Mobile App Lifecycle, Status Bar & Hardware Back Navigation Engine
 * Stash Academic Mobile
 */

import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { HapticEngine } from "./hapticEngine";

export class NativeMobileEngine {
  private static isInitialized = false;
  private static lastBackPressTime = 0;

  /**
   * Initialize native status bar, splash screen, and hardware back button listener
   */
  static async init(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Configure Native Status Bar for immersive black theme
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#000000" });
        await StatusBar.setOverlaysWebView({ overlay: false });

        // 2. Hide Splash Screen smoothly once UI renders
        await SplashScreen.hide({ fadeOutDuration: 300 });

        // 3. Hardware Back Button Handling
        App.addListener("backButton", ({ canGoBack }) => {
          // A. If an emergency wake-up alarm is ringing, block exit!
          const activeAlarmModal = document.querySelector("[data-alarm-overlay='active']");
          if (activeAlarmModal) {
            HapticEngine.trigger("warning");
            return;
          }

          // B. If a modal is open (Task Create, Update, etc.), close it
          const openCloseButtons = document.querySelectorAll<HTMLButtonElement>(
            "[data-modal-close='true']"
          );
          if (openCloseButtons.length > 0) {
            HapticEngine.trigger("light");
            openCloseButtons[openCloseButtons.length - 1].click();
            return;
          }

          // C. If not on Dashboard, navigate to Dashboard
          const currentPath = window.location.pathname;
          if (currentPath !== "/dashboard" && currentPath !== "/") {
            HapticEngine.trigger("selection");
            window.location.href = "/dashboard";
            return;
          }

          // D. If on Dashboard, require double-tap back within 2 seconds to exit
          const now = Date.now();
          if (now - this.lastBackPressTime < 2000) {
            App.exitApp();
          } else {
            this.lastBackPressTime = now;
            HapticEngine.trigger("medium");
            // Show native-style toast prompt
            this.showExitToast();
          }
        });
      } catch (err) {
        console.warn("Native initialization error:", err);
      }
    }
  }

  /**
   * Show a subtle native-style toast when user presses back on Dashboard
   */
  private static showExitToast(): void {
    const existing = document.getElementById("stash-exit-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "stash-exit-toast";
    toast.className =
      "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-900/95 border border-white/10 text-white text-xs font-mono shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 pointer-events-none";
    toast.innerText = "Press back again to exit Stash";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-out", "fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 1800);
  }
}
