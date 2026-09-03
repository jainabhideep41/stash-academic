// Web Audio API Synthesizer Alarm Engine (Phone Wake-Up Style)
// Features: Custom Ringtones, Hardware Vibration API, Screen WakeLock API, and MediaSession Integration

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
    const pauseDuration = 0.04;

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * (burstDuration + pauseDuration);
      const osc = this.audioCtx!.createOscillator();
      const oscGain = this.audioCtx!.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, startTime);

      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.exponentialRampToValueAtTime(0.7, startTime + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + burstDuration);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx!.destination);

      osc.start(startTime);
      osc.stop(startTime + burstDuration);
    });
  }

  // 2. Radar Chimes (Resonant marimba-style pings)
  private playRadarBurst(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [659.25, 880.0, 1318.51];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = this.audioCtx!.createOscillator();
      const oscGain = this.audioCtx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.65, startTime + 0.015);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  // 3. Emergency Siren (Sweeping oscillating sirens)
  private playSirenBurst(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.25);
    osc.frequency.linearRampToValueAtTime(550, now + 0.5);

    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.linearRampToValueAtTime(0.75, now + 0.05);
    oscGain.gain.linearRampToValueAtTime(0.75, now + 0.45);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(oscGain);
    oscGain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // 4. Gentle Morning (Major 7th soft harmonic chime)
  private playGentleBurst(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 830.61];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.09;
      const osc = this.audioCtx!.createOscillator();
      const oscGain = this.audioCtx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.5, startTime + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // 5. 8-Bit Arcade (Energetic game wake-up)
  private playArcadeBurst(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freqs = [330, 440, 660, 880, 1320];

    freqs.forEach((freq, idx) => {
      const startTime = now + idx * 0.06;
      const osc = this.audioCtx!.createOscillator();
      const oscGain = this.audioCtx!.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, startTime);

      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.45, startTime + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
  }

  private playTonePattern(tone: AlarmTone): void {
    switch (tone) {
      case "radar":
        this.playRadarBurst();
        break;
      case "siren":
        this.playSirenBurst();
        break;
      case "gentle":
        this.playGentleBurst();
        break;
      case "arcade":
        this.playArcadeBurst();
        break;
      case "digital":
      default:
        this.playDigitalBurst();
        break;
    }
  }

  // Start repeating alarm with chosen tone, hardware vibration, and screen wakelock
  public startAlarm(tone: AlarmTone = "digital"): void {
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
    this.stopHardwareVibration();
    this.releaseWakeLock();

    if (typeof window !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.playbackState = "none";
      } catch {}
    }
  }

  // Play celebration / success chime when user solves typing challenge
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
