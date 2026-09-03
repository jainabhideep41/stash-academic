// Web Audio API Synthesizer Alarm Engine (Phone Wake-Up Style)
// Features: Custom Ringtones, Hardware Vibration API, Screen WakeLock API, and MediaSession Integration

import { voiceAssistant } from "./voiceAssistantEngine";

export type AlarmTone = "digital" | "radar" | "siren" | "gentle" | "arcade";

export interface ToneInfo {
  id: AlarmTone;
  name: string;
  description: string;
  iconText: string;
}

export const ALARM_TONE_OPTIONS: ToneInfo[] = [
  {
    id: "digital",
    name: "Classic Digital Beep",
    description: "Sharp 4-burst digital clock alarm",
    iconText: "📟",
  },
  {
    id: "radar",
    name: "Radar Chimes",
    description: "Modern phone radar pulse chime",
    iconText: "📡",
  },
  {
    id: "siren",
    name: "Emergency Siren",
    description: "Escalating high-urgency wake-up siren",
    iconText: "🚨",
  },
  {
    id: "gentle",
    name: "Gentle Morning",
    description: "Soft calming harmonic chime chord",
    iconText: "🌅",
  },
  {
    id: "arcade",
    name: "8-Bit Arcade",
    description: "Retro high-energy synth pulses",
    iconText: "👾",
  },
];

class AlarmAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | number | null = null;
  private timeoutId: NodeJS.Timeout | number | null = null;
  private vibrationIntervalId: NodeJS.Timeout | number | null = null;
  private wakeLockSentinel: any = null;
  private currentTone: AlarmTone = "digital";

  // Initialize or resume AudioContext
  public unlockAudio(): void {
    if (typeof window === "undefined") return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn("AudioContext unlock failed:", e);
    }
  }

  // Request Screen WakeLock so phone screen doesn't turn off during alarm
  private async acquireWakeLock(): Promise<void> {
    if (typeof window === "undefined" || !("wakeLock" in navigator)) return;
    try {
      this.wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
    } catch (e) {
      console.warn("WakeLock request failed:", e);
    }
  }

  private releaseWakeLock(): void {
    try {
      if (this.wakeLockSentinel) {
        this.wakeLockSentinel.release();
        this.wakeLockSentinel = null;
      }
    } catch {}
  }

  // Trigger Hardware Vibration API (Intense pulsing vibration to wake user even if silent)
  private startHardwareVibration(): void {
    if (typeof window === "undefined" || !("vibrate" in navigator)) return;
    try {
      // Pulsing pattern: Vibrate 600ms, pause 200ms, vibrate 600ms, pause 200ms, vibrate 1000ms
      const pattern = [600, 200, 600, 200, 1000];
      navigator.vibrate(pattern);

      this.vibrationIntervalId = setInterval(() => {
        if (this.isPlaying && "vibrate" in navigator) {
          navigator.vibrate(pattern);
        }
      }, 2800);
    } catch (e) {
      console.warn("Vibration API error:", e);
    }
  }

  private stopHardwareVibration(): void {
    if (this.vibrationIntervalId) {
      clearInterval(this.vibrationIntervalId as any);
      this.vibrationIntervalId = null;
    }
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch {}
    }
  }

  // Setup MediaSession for background audio claim
  private setupMediaSession(tone: AlarmTone): void {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "⏰ WAKE-UP ALARM RINGING",
        artist: "Stash Academic Hub",
        album: `Alarm Tone: ${tone}`,
      });
      navigator.mediaSession.playbackState = "playing";
    } catch {}
  }

  // 1. Classic Digital Beep (4 rapid bursts)
  private playDigitalBurst(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freqs = [880, 880, 1046, 1174];
    const burstDuration = 0.08;

    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.01, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.4, now + idx * 0.12 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + burstDuration);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + burstDuration);
    });
  }

  // 2. Radar Chimes (Ascending modern sonar pings)
  private playRadarPing(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const chord = [587.33, 880, 1174.66]; // D5, A5, D6

    chord.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.01, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.35, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.55);
    });
  }

  // 3. Emergency Siren (Continuous high-low sweep)
  private playSirenSweep(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.7);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.65);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  // 4. Gentle Morning (Warm soothing bells)
  private playGentleChime(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major Harmonic

    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.01, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.8);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.85);
    });
  }

  // 5. 8-Bit Arcade Pulses
  private playArcadePulse(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];

    notes.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.01, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.05 + 0.01);
      gain.gain.linearRampToValueAtTime(0.001, now + i * 0.05 + 0.045);

      osc.connect(gain);
      gain.connect(this.audioCtx!.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.05);
    });
  }

  // Play single cycle of the active tone
  private playTonePattern(tone: AlarmTone): void {
    switch (tone) {
      case "digital":
        this.playDigitalBurst();
        break;
      case "radar":
        this.playRadarPing();
        break;
      case "siren":
        this.playSirenSweep();
        break;
      case "gentle":
        this.playGentleChime();
        break;
      case "arcade":
        this.playArcadePulse();
        break;
      default:
        this.playDigitalBurst();
        break;
    }
  }

  // Start repeating alarm with chosen tone, hardware vibration, and screen wakelock
  // Rings for at least 90s (1.5 minutes) by default or until turned off
  public startAlarm(tone: AlarmTone = "digital", durationSeconds = 90): void {
    if (this.isPlaying) return;
    this.unlockAudio();
    this.isPlaying = true;
    this.currentTone = tone;

    // Acquire Screen WakeLock & Hardware Vibration
    this.acquireWakeLock();
    this.startHardwareVibration();
    this.setupMediaSession(tone);

    this.playTonePattern(this.currentTone);

    const intervalMs = tone === "siren" ? 700 : tone === "gentle" ? 950 : 850;
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playTonePattern(this.currentTone);
      }
    }, intervalMs);

    // Enforce minimum 1.5 min duration timer (defaults to 90s)
    if (durationSeconds > 0) {
      if (this.timeoutId) clearTimeout(this.timeoutId as any);
      this.timeoutId = setTimeout(() => {
        if (this.isPlaying) {
          this.stopAlarm();
        }
      }, durationSeconds * 1000);
    }
  }

  // Preview a single burst of a chosen tone
  public previewTone(tone: AlarmTone): void {
    this.unlockAudio();
    this.playTonePattern(tone);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  // Stop / Turn off alarm
  public stopAlarm(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId as any);
      this.intervalId = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId as any);
      this.timeoutId = null;
    }
    this.stopHardwareVibration();
    this.releaseWakeLock();
    voiceAssistant.stopSpeaking();

    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "none";
      } catch {}
    }
  }

  // Play celebration / success chime when user solves challenge
  public playSuccessChime(): void {
    this.unlockAudio();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, i) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.01, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.4, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Success chime error:", e);
    }
  }

  public isAlarmPlaying(): boolean {
    return this.isPlaying;
  }
}

export const alarmAudio = new AlarmAudioEngine();
