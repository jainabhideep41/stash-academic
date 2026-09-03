// Web Audio API Synthesizer Alarm Engine (Phone Wake-Up Style)
// Generates loud, realistic multi-tone digital alarm beeps without relying on external MP3 assets

class AlarmAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | number | null = null;
  private gainNode: GainNode | null = null;

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

  // Play a single phone alarm beep pattern (e.g. 4 rapid high-frequency pulse bursts)
  private playBeepBurst(): void {
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const masterGain = this.audioCtx.createGain();
      masterGain.connect(this.audioCtx.destination);
      masterGain.gain.setValueAtTime(0.75, now);

      // Beep sequence: 4 sharp bursts like standard digital phone alarm
      const freqs = [880, 880, 1046, 1174]; // A5, A5, C6, D6
      const burstDuration = 0.08;
      const pauseDuration = 0.04;

      freqs.forEach((freq, idx) => {
        const startTime = now + idx * (burstDuration + pauseDuration);
        const osc = this.audioCtx!.createOscillator();
        const oscGain = this.audioCtx!.createGain();

        osc.type = "sawtooth"; // Gives punchy, urgent digital alarm character
        osc.frequency.setValueAtTime(freq, startTime);

        // Quick envelope
        oscGain.gain.setValueAtTime(0.001, startTime);
        oscGain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.01);
        oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + burstDuration);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + burstDuration);
      });
    } catch (e) {
      console.warn("Error playing alarm burst:", e);
    }
  }

  // Start continuous repeating phone alarm
  public startAlarm(): void {
    if (this.isPlaying) return;
    this.unlockAudio();
    this.isPlaying = true;

    // Immediately play first burst
    this.playBeepBurst();

    // Repeat pattern every 850ms
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playBeepBurst();
      }
    }, 850);
  }

  // Stop / Turn off alarm
  public stopAlarm(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId as any);
      this.intervalId = null;
    }
  }

  // Play celebration / success chime when user successfully solves the typing challenge
  public playSuccessChime(): void {
    this.unlockAudio();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord arpeggio
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
