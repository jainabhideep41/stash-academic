// 60+ Authentic Alarm Sound Synthesizer Engine (Samsung, Xiaomi, Extreme Sirens, Digital, Melodic & Zen)
// Powered by Web Audio API Procedural Synthesis (100% Offline, Zero-Latency, Lightweight)

import { voiceAssistant } from "./voiceAssistantEngine";

export type SoundCategory =
  | "popular"
  | "extreme"
  | "digital"
  | "melodic"
  | "zen";

export interface ToneInfo {
  id: string;
  name: string;
  description: string;
  category: SoundCategory;
  iconText: string;
  urgency: "low" | "medium" | "high" | "extreme";
}

export const ALARM_TONE_OPTIONS: ToneInfo[] = [
  // --- 1. SAMSUNG & XIAOMI / POPULAR PHONES (12) ---
  {
    id: "samsung_horizon",
    name: "Samsung Horizon",
    description: "Iconic Galaxy rising marimba & horn chord",
    category: "popular",
    iconText: "🌌",
    urgency: "high",
  },
  {
    id: "samsung_homecoming",
    name: "Samsung Homecoming",
    description: "Bright energetic bell & mallet arpeggio",
    category: "popular",
    iconText: "🏠",
    urgency: "medium",
  },
  {
    id: "xiaomi_fireflies",
    name: "Xiaomi Fireflies",
    description: "MIUI crystal glass sine chime cascade",
    category: "popular",
    iconText: "✨",
    urgency: "medium",
  },
  {
    id: "xiaomi_morning_glory",
    name: "Xiaomi Morning Glory",
    description: "HyperOS uplifting morning flute & harp",
    category: "popular",
    iconText: "🌺",
    urgency: "medium",
  },
  {
    id: "xiaomi_sweet_dream",
    name: "Xiaomi Sweet Dream",
    description: "Warm vibraphone harmonic awakening",
    category: "popular",
    iconText: "🌙",
    urgency: "low",
  },
  {
    id: "ios_radar",
    name: "Apple Radar",
    description: "Sharp dual-frequency sonar pulses",
    category: "popular",
    iconText: "📡",
    urgency: "high",
  },
  {
    id: "ios_apex",
    name: "Apple Apex",
    description: "Multi-chord modern phone polyphony",
    category: "popular",
    iconText: "⚡",
    urgency: "high",
  },
  {
    id: "ios_chimes",
    name: "Apple Wind Chimes",
    description: "Crisp pentatonic cascading bell chime",
    category: "popular",
    iconText: "🔔",
    urgency: "low",
  },
  {
    id: "pixel_zen",
    name: "Pixel Zen Dawn",
    description: "Google Pixel soft resonant morning mallet",
    category: "popular",
    iconText: "☀️",
    urgency: "low",
  },
  {
    id: "samsung_cosmos",
    name: "Samsung Cosmos",
    description: "Starlight synth shimmer arpeggios",
    category: "popular",
    iconText: "🪐",
    urgency: "medium",
  },
  {
    id: "xiaomi_breeze",
    name: "Xiaomi Mountain Breeze",
    description: "Fresh high-altitude wooden chime",
    category: "popular",
    iconText: "🍃",
    urgency: "low",
  },
  {
    id: "pixel_voyager",
    name: "Pixel Voyager",
    description: "Clean modern pulse with bass accent",
    category: "popular",
    iconText: "🚀",
    urgency: "medium",
  },

  // --- 2. EXTREME WAKE-UP & EMERGENCY SIRENS (12) ---
  {
    id: "nuclear_siren",
    name: "Nuclear Meltdown Siren",
    description: "Continuous heavy dual-pitch alarm",
    category: "extreme",
    iconText: "☢️",
    urgency: "extreme",
  },
  {
    id: "air_horn",
    name: "Heavy Industrial Air Horn",
    description: "Triple low-frequency stadium blast",
    category: "extreme",
    iconText: "📢",
    urgency: "extreme",
  },
  {
    id: "submarine_dive",
    name: "Submarine Klaxon",
    description: "Heavy resonant emergency dive klaxon",
    category: "extreme",
    iconText: "🚢",
    urgency: "extreme",
  },
  {
    id: "fire_evac",
    name: "Fire Evacuation Alarm",
    description: "Escalating rapid sawtooth sweep",
    category: "extreme",
    iconText: "🔥",
    urgency: "extreme",
  },
  {
    id: "defcon_one",
    name: "DEFCON 1 Hazard Alert",
    description: "Intense warbling high-pitch warning",
    category: "extreme",
    iconText: "🚨",
    urgency: "extreme",
  },
  {
    id: "police_wail",
    name: "Emergency Interceptor",
    description: "High-speed rapid two-tone siren",
    category: "extreme",
    iconText: "🚔",
    urgency: "extreme",
  },
  {
    id: "buzzer_lock",
    name: "Industrial 120Hz Buzzer",
    description: "Loud piercing mechanical buzzer",
    category: "extreme",
    iconText: "⚡",
    urgency: "extreme",
  },
  {
    id: "screamer",
    name: "Ultrasonic Screamer",
    description: "Piercing 2.4kHz high-intensity tone",
    category: "extreme",
    iconText: "🔊",
    urgency: "extreme",
  },
  {
    id: "shockwave",
    name: "Shockwave Strobe",
    description: "Rapid amplitude pulse wake-up strobe",
    category: "extreme",
    iconText: "💥",
    urgency: "extreme",
  },
  {
    id: "ambulance",
    name: "Rapid Ambulance Yelp",
    description: "High-urgency alternating tone sweep",
    category: "extreme",
    iconText: "🚑",
    urgency: "extreme",
  },
  {
    id: "tornado_warning",
    name: "Tornado Warning Horn",
    description: "Deep oscillating distance horn",
    category: "extreme",
    iconText: "🌪️",
    urgency: "extreme",
  },
  {
    id: "drill_sergeant",
    name: "Drill Staccato Siren",
    description: "Ultra-fast triple burst wake-up alarm",
    category: "extreme",
    iconText: "🎖️",
    urgency: "extreme",
  },

  // --- 3. DIGITAL & ELECTRONIC CLOCKS (12) ---
  {
    id: "digital_classic",
    name: "Classic 4-Burst Beep",
    description: "Traditional bedside digital clock alarm",
    category: "digital",
    iconText: "📟",
    urgency: "high",
  },
  {
    id: "digital_fast",
    name: "High-Speed Clock Ticker",
    description: "8-burst rapid staccato digital beeps",
    category: "digital",
    iconText: "⏱️",
    urgency: "high",
  },
  {
    id: "vintage_casio",
    name: "80s Vintage Digital Watch",
    description: "Crisp classic dual-beep chime",
    category: "digital",
    iconText: "⌚",
    urgency: "medium",
  },
  {
    id: "arcade_8bit",
    name: "8-Bit Arcade Jump",
    description: "Retro high-energy synth pulses",
    category: "digital",
    iconText: "👾",
    urgency: "medium",
  },
  {
    id: "cyber_glitch",
    name: "Cyberpunk Glitch",
    description: "Futuristic frequency-modulated steps",
    category: "digital",
    iconText: "🤖",
    urgency: "high",
  },
  {
    id: "matrix_data",
    name: "Matrix Data Stream",
    description: "Fast binary polyrhythm synth",
    category: "digital",
    iconText: "💾",
    urgency: "medium",
  },
  {
    id: "sonar_ping",
    name: "Deep Ocean Sonar",
    description: "Clean metallic echo ping",
    category: "digital",
    iconText: "🌊",
    urgency: "medium",
  },
  {
    id: "telecom_ring",
    name: "90s Telecom Bell Ring",
    description: "Dual frequency electronic phone ring",
    category: "digital",
    iconText: "☎️",
    urgency: "high",
  },
  {
    id: "pulsar_beacon",
    name: "Cosmic Pulsar Beacon",
    description: "Deep space square-wave rhythm",
    category: "digital",
    iconText: "📡",
    urgency: "medium",
  },
  {
    id: "techno_drop",
    name: "Techno Beat Drop",
    description: "Punchy sub bass & synth pluck groove",
    category: "digital",
    iconText: "🎧",
    urgency: "high",
  },
  {
    id: "synthwave_drive",
    name: "Synthwave Neon Lead",
    description: "80s analog saw wave arpeggiator",
    category: "digital",
    iconText: "🚗",
    urgency: "medium",
  },
  {
    id: "gameover_alarm",
    name: "Arcade Extra Life",
    description: "Ascending celebratory 8-bit run",
    category: "digital",
    iconText: "🕹️",
    urgency: "medium",
  },

  // --- 4. MELODIC, MARIMBA & ORCHESTRAL (12) ---
  {
    id: "marimba_sunrise",
    name: "Sunny Marimba Groove",
    description: "Woodblock major pentatonic melody",
    category: "melodic",
    iconText: "🪵",
    urgency: "medium",
  },
  {
    id: "kalimba_lullaby",
    name: "African Kalimba Chime",
    description: "Warm resonant thumb piano",
    category: "melodic",
    iconText: "🎶",
    urgency: "low",
  },
  {
    id: "vibraphone_glow",
    name: "Jazz Vibraphone",
    description: "Sustained mellow harmonic chords",
    category: "melodic",
    iconText: "🎷",
    urgency: "low",
  },
  {
    id: "grand_piano",
    name: "Grand Piano Arpeggio",
    description: "Bright multi-key concert piano triad",
    category: "melodic",
    iconText: "🎹",
    urgency: "medium",
  },
  {
    id: "glockenspiel",
    name: "Orchestra Glockenspiel",
    description: "High bell melodic twinkle",
    category: "melodic",
    iconText: "✨",
    urgency: "medium",
  },
  {
    id: "celesta_fairytale",
    name: "Celesta Fairytale",
    description: "Magical bell music box melody",
    category: "melodic",
    iconText: "🧚",
    urgency: "low",
  },
  {
    id: "harp_glissando",
    name: "Angelic Harp Glissando",
    description: "Cascading ascending harp glide",
    category: "melodic",
    iconText: "🪕",
    urgency: "low",
  },
  {
    id: "church_bells",
    name: "Westminster Chimes",
    description: "Classic Big Ben tower quarter bells",
    category: "melodic",
    iconText: "🕰️",
    urgency: "high",
  },
  {
    id: "tubular_bells",
    name: "Cathedral Tubular Bells",
    description: "Heavy brass church bell strike",
    category: "melodic",
    iconText: "⛪",
    urgency: "high",
  },
  {
    id: "steel_drum",
    name: "Caribbean Steel Drum",
    description: "Tropical island steel pan rhythm",
    category: "melodic",
    iconText: "🏝️",
    urgency: "medium",
  },
  {
    id: "xylophone_hop",
    name: "Playful Xylophone Hop",
    description: "Bouncy wooden mallet staccato",
    category: "melodic",
    iconText: "🪘",
    urgency: "medium",
  },
  {
    id: "orchestra_brass",
    name: "Royal Fanfare Horns",
    description: "Triumphant morning brass chord",
    category: "melodic",
    iconText: "🎺",
    urgency: "high",
  },

  // --- 5. ZEN, NATURE & HARMONIC BOWLS (12) ---
  {
    id: "tibetan_bowl",
    name: "Tibetan Singing Bowl",
    description: "Deep 432Hz meditative bronze resonance",
    category: "zen",
    iconText: "🥣",
    urgency: "low",
  },
  {
    id: "zen_gong",
    name: "Temple Bronze Gong",
    description: "Low sustained ceremonial strike",
    category: "zen",
    iconText: "🧘",
    urgency: "medium",
  },
  {
    id: "shakuhachi_wind",
    name: "Zen Bamboo Flute",
    description: "Gentle acoustic morning breath",
    category: "zen",
    iconText: "🎋",
    urgency: "low",
  },
  {
    id: "rain_thunder",
    name: "Harmonic Raindrops",
    description: "Resonant fluid water droplets",
    category: "zen",
    iconText: "🌧️",
    urgency: "low",
  },
  {
    id: "forest_birds",
    name: "Morning Songbird Trill",
    description: "High melodic bird call chirps",
    category: "zen",
    iconText: "🐦",
    urgency: "low",
  },
  {
    id: "ocean_swell",
    name: "Deep Ocean Swell",
    description: "Low harmonic sine tide wave",
    category: "zen",
    iconText: "🌊",
    urgency: "low",
  },
  {
    id: "bamboo_water",
    name: "Kyoto Water Rocker",
    description: "Crisp wooden bamboo clack & chime",
    category: "zen",
    iconText: "🎍",
    urgency: "low",
  },
  {
    id: "cricket_night",
    name: "Summer Meadow Chimes",
    description: "Ethereal high harmonic ringing",
    category: "zen",
    iconText: "🌾",
    urgency: "low",
  },
  {
    id: "celtic_pipe",
    name: "Highland Folk Whistle",
    description: "Warm morning acoustic flute",
    category: "zen",
    iconText: "☘️",
    urgency: "low",
  },
  {
    id: "meditation_bell",
    name: "Ting-Sha Brass Cymbal",
    description: "Ultra-clean sustained high bell",
    category: "zen",
    iconText: "🧘‍♂️",
    urgency: "low",
  },
  {
    id: "monastery_bell",
    name: "Monastery Dawn Bell",
    description: "Echoing deep bronze monastery bell",
    category: "zen",
    iconText: "⛩️",
    urgency: "medium",
  },
  {
    id: "wind_harmonics",
    name: "Aeolian Wind Harp",
    description: "Ethereal flowing overtone chords",
    category: "zen",
    iconText: "💨",
    urgency: "low",
  },
];

export type AlarmTone = string;

class AlarmAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | number | null = null;
  private timeoutId: NodeJS.Timeout | number | null = null;
  private vibrationIntervalId: NodeJS.Timeout | number | null = null;
  private wakeLockSentinel: any = null;
  private currentTone: AlarmTone = "samsung_horizon";

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

  // Request Screen WakeLock
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

  // Hardware Vibration API
  private startHardwareVibration(): void {
    if (typeof window === "undefined" || !("vibrate" in navigator)) return;
    try {
      const pattern = [600, 200, 600, 200, 1000];
      navigator.vibrate(pattern);

      this.vibrationIntervalId = setInterval(() => {
        if (this.isPlaying && "vibrate" in navigator) {
          navigator.vibrate(pattern);
        }
      }, 2800);
    } catch (e) {
      console.warn("Vibration error:", e);
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

  // MediaSession integration
  private setupMediaSession(tone: AlarmTone): void {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    try {
      const info = ALARM_TONE_OPTIONS.find((t) => t.id === tone);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "⏰ WAKE-UP ALARM RINGING",
        artist: "Stash Academic Hub",
        album: info ? `${info.iconText} ${info.name}` : `Alarm Tone: ${tone}`,
      });
      navigator.mediaSession.playbackState = "playing";
    } catch {}
  }

  // Helper: Play Polyphonic Note
  private playNote(
    freq: number,
    startOffset: number,
    duration: number,
    type: OscillatorType = "sine",
    peakGain: number = 0.3,
    decayRate: number = 0.8
  ): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime + startOffset;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * decayRate);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Helper: Frequency Sweep (Sirens / Klaxons)
  private playSweep(
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType = "sawtooth",
    peakGain: number = 0.4
  ): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.5);
    osc.frequency.exponentialRampToValueAtTime(startFreq, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.04);
    gain.gain.linearRampToValueAtTime(peakGain, now + duration - 0.04);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Master Sound Synthesizer Dispatcher for all 60+ sounds
  private playTonePattern(tone: AlarmTone): void {
    if (!this.audioCtx) return;

    switch (tone) {
      // --- SAMSUNG & XIAOMI / POPULAR ---
      case "samsung_horizon": {
        // C4, G4, C5, E5 rising marimba horn chord
        const notes = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, i) => this.playNote(f, i * 0.08, 0.6, "triangle", 0.35));
        break;
      }
      case "samsung_homecoming": {
        const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98];
        notes.forEach((f, i) => this.playNote(f, i * 0.07, 0.5, "sine", 0.3));
        break;
      }
      case "xiaomi_fireflies": {
        // High-frequency crystal bell chime
        const bells = [1046.5, 1318.51, 1567.98, 2093.0, 2637.02];
        bells.forEach((f, i) => this.playNote(f, i * 0.06, 0.8, "sine", 0.25));
        break;
      }
      case "xiaomi_morning_glory": {
        const chord = [392.0, 440.0, 523.25, 659.25, 783.99];
        chord.forEach((f, i) => this.playNote(f, i * 0.1, 0.7, "triangle", 0.3));
        break;
      }
      case "xiaomi_sweet_dream": {
        const notes = [329.63, 392.0, 493.88, 587.33, 659.25];
        notes.forEach((f, i) => this.playNote(f, i * 0.12, 0.9, "sine", 0.3));
        break;
      }
      case "ios_radar":
      case "radar": {
        // Sonar D5, A5, D6
        [587.33, 880.0, 1174.66].forEach((f, i) => this.playNote(f, i * 0.06, 0.5, "sine", 0.4));
        break;
      }
      case "ios_apex": {
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((f, i) => this.playNote(f, i * 0.07, 0.45, "triangle", 0.35));
        break;
      }
      case "ios_chimes":
      case "gentle": {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.playNote(f, i * 0.1, 0.8, "triangle", 0.3)
        );
        break;
      }
      case "pixel_zen": {
        [220, 277.18, 329.63, 440, 554.37].forEach((f, i) =>
          this.playNote(f, i * 0.14, 1.1, "sine", 0.28)
        );
        break;
      }
      case "samsung_cosmos": {
        [659.25, 830.61, 987.77, 1318.51, 1661.22].forEach((f, i) =>
          this.playNote(f, i * 0.07, 0.6, "sine", 0.25)
        );
        break;
      }
      case "xiaomi_breeze": {
        [440, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.playNote(f, i * 0.09, 0.9, "triangle", 0.25)
        );
        break;
      }
      case "pixel_voyager": {
        [196, 293.66, 392, 587.33, 783.99].forEach((f, i) =>
          this.playNote(f, i * 0.08, 0.5, "triangle", 0.35)
        );
        break;
      }

      // --- EXTREME WAKE-UP & SIRENS ---
      case "nuclear_siren":
      case "siren": {
        this.playSweep(550, 1450, 0.65, "sawtooth", 0.45);
        break;
      }
      case "air_horn": {
        [150, 187.5, 225].forEach((f) => this.playNote(f, 0, 0.55, "sawtooth", 0.5));
        break;
      }
      case "submarine_dive": {
        this.playSweep(300, 700, 0.5, "sawtooth", 0.5);
        break;
      }
      case "fire_evac": {
        this.playSweep(700, 1800, 0.4, "sawtooth", 0.45);
        break;
      }
      case "defcon_one": {
        this.playSweep(1100, 2200, 0.3, "square", 0.4);
        break;
      }
      case "police_wail": {
        this.playSweep(600, 1300, 0.45, "sawtooth", 0.45);
        break;
      }
      case "buzzer_lock": {
        [120, 240, 360, 480].forEach((f) => this.playNote(f, 0, 0.4, "sawtooth", 0.5));
        break;
      }
      case "screamer": {
        this.playNote(2400, 0, 0.35, "square", 0.45);
        this.playNote(2400, 0.4, 0.35, "square", 0.45);
        break;
      }
      case "shockwave": {
        [0, 0.1, 0.2, 0.3].forEach((t) => this.playNote(980, t, 0.06, "square", 0.5));
        break;
      }
      case "ambulance": {
        this.playNote(650, 0, 0.22, "sawtooth", 0.45);
        this.playNote(850, 0.23, 0.22, "sawtooth", 0.45);
        break;
      }
      case "tornado_warning": {
        this.playSweep(220, 440, 0.8, "sawtooth", 0.5);
        break;
      }
      case "drill_sergeant": {
        [0, 0.12, 0.24].forEach((t) => this.playNote(1200, t, 0.08, "square", 0.45));
        break;
      }

      // --- DIGITAL & ELECTRONIC ---
      case "digital_classic":
      case "digital": {
        [880, 880, 1046, 1174].forEach((f, i) =>
          this.playNote(f, i * 0.11, 0.08, "square", 0.4)
        );
        break;
      }
      case "digital_fast": {
        [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42].forEach((t) =>
          this.playNote(1200, t, 0.035, "square", 0.4)
        );
        break;
      }
      case "vintage_casio": {
        this.playNote(2048, 0, 0.06, "square", 0.35);
        this.playNote(2048, 0.1, 0.06, "square", 0.35);
        break;
      }
      case "arcade_8bit":
      case "arcade": {
        [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((f, i) =>
          this.playNote(f, i * 0.05, 0.05, "square", 0.35)
        );
        break;
      }
      case "cyber_glitch": {
        [1500, 900, 1800, 1200, 2200].forEach((f, i) =>
          this.playNote(f, i * 0.05, 0.04, "sawtooth", 0.35)
        );
        break;
      }
      case "matrix_data": {
        [1000, 1250, 1500, 1750, 2000, 1500, 1250].forEach((f, i) =>
          this.playNote(f, i * 0.04, 0.03, "sine", 0.35)
        );
        break;
      }
      case "sonar_ping": {
        this.playNote(1400, 0, 0.8, "sine", 0.4, 0.95);
        break;
      }
      case "telecom_ring": {
        this.playNote(440, 0, 0.35, "sine", 0.35);
        this.playNote(480, 0, 0.35, "sine", 0.35);
        break;
      }
      case "pulsar_beacon": {
        [0, 0.15, 0.3].forEach((t) => this.playNote(750, t, 0.08, "triangle", 0.4));
        break;
      }
      case "techno_drop": {
        this.playNote(65, 0, 0.3, "sine", 0.5);
        [440, 659, 880].forEach((f, i) => this.playNote(f, 0.1 + i * 0.06, 0.15, "sawtooth", 0.3));
        break;
      }
      case "synthwave_drive": {
        [220, 330, 440, 550, 660].forEach((f, i) =>
          this.playNote(f, i * 0.06, 0.25, "sawtooth", 0.3)
        );
        break;
      }
      case "gameover_alarm": {
        [523, 659, 783, 1046, 1318].forEach((f, i) =>
          this.playNote(f, i * 0.06, 0.15, "square", 0.3)
        );
        break;
      }

      // --- MELODIC & ORCHESTRAL ---
      case "marimba_sunrise": {
        [261.63, 329.63, 392.0, 523.25, 659.25].forEach((f, i) =>
          this.playNote(f, i * 0.09, 0.4, "triangle", 0.35)
        );
        break;
      }
      case "kalimba_lullaby": {
        [523.25, 587.33, 659.25, 783.99, 880.0].forEach((f, i) =>
          this.playNote(f, i * 0.1, 0.6, "sine", 0.3)
        );
        break;
      }
      case "vibraphone_glow": {
        [440, 554.37, 659.25, 880].forEach((f, i) =>
          this.playNote(f, i * 0.12, 0.8, "sine", 0.3)
        );
        break;
      }
      case "grand_piano": {
        [261.63, 329.63, 392.0, 523.25].forEach((f, i) =>
          this.playNote(f, i * 0.08, 0.7, "triangle", 0.35)
        );
        break;
      }
      case "glockenspiel": {
        [1046.5, 1174.66, 1318.51, 1567.98, 2093.0].forEach((f, i) =>
          this.playNote(f, i * 0.07, 0.7, "sine", 0.28)
        );
        break;
      }
      case "celesta_fairytale": {
        [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) =>
          this.playNote(f, i * 0.09, 0.6, "sine", 0.28)
        );
        break;
      }
      case "harp_glissando": {
        [392, 440, 493.88, 523.25, 587.33, 659.25, 783.99].forEach((f, i) =>
          this.playNote(f, i * 0.05, 0.6, "triangle", 0.28)
        );
        break;
      }
      case "church_bells": {
        // Big Ben chime notes (E4, C4, D4, G3)
        [329.63, 261.63, 293.66, 196.0].forEach((f, i) =>
          this.playNote(f, i * 0.22, 0.8, "triangle", 0.4)
        );
        break;
      }
      case "tubular_bells": {
        [220, 277.18, 330].forEach((f, i) =>
          this.playNote(f, i * 0.18, 1.0, "triangle", 0.45)
        );
        break;
      }
      case "steel_drum": {
        [392, 493.88, 587.33, 783.99].forEach((f, i) =>
          this.playNote(f, i * 0.08, 0.4, "triangle", 0.35)
        );
        break;
      }
      case "xylophone_hop": {
        [523.25, 659.25, 523.25, 783.99].forEach((f, i) =>
          this.playNote(f, i * 0.09, 0.3, "triangle", 0.35)
        );
        break;
      }
      case "orchestra_brass": {
        [261.63, 329.63, 392, 523.25].forEach((f) =>
          this.playNote(f, 0, 0.6, "sawtooth", 0.25)
        );
        break;
      }

      // --- ZEN & NATURE ---
      case "tibetan_bowl": {
        this.playNote(432, 0, 1.4, "sine", 0.4, 0.95);
        this.playNote(864, 0.05, 1.2, "sine", 0.2, 0.9);
        break;
      }
      case "zen_gong": {
        this.playNote(110, 0, 1.5, "triangle", 0.5, 0.95);
        this.playNote(220, 0, 1.2, "sine", 0.3, 0.9);
        break;
      }
      case "shakuhachi_wind": {
        [330, 392, 440, 493.88].forEach((f, i) =>
          this.playNote(f, i * 0.18, 0.9, "sine", 0.25)
        );
        break;
      }
      case "rain_thunder": {
        [800, 1200, 600, 1400, 900].forEach((f, i) =>
          this.playNote(f, i * 0.08, 0.15, "sine", 0.2)
        );
        break;
      }
      case "forest_birds": {
        [2200, 2600, 2400, 2800].forEach((f, i) =>
          this.playNote(f, i * 0.07, 0.1, "sine", 0.25)
        );
        break;
      }
      case "ocean_swell": {
        this.playNote(90, 0, 1.4, "sine", 0.35, 0.9);
        break;
      }
      case "bamboo_water": {
        this.playNote(350, 0, 0.1, "triangle", 0.4);
        this.playNote(880, 0.15, 0.5, "sine", 0.25);
        break;
      }
      case "cricket_night": {
        [4000, 4200, 4000, 4200].forEach((f, i) =>
          this.playNote(f, i * 0.06, 0.05, "triangle", 0.18)
        );
        break;
      }
      case "celtic_pipe": {
        [587.33, 659.25, 783.99, 880].forEach((f, i) =>
          this.playNote(f, i * 0.12, 0.6, "sine", 0.25)
        );
        break;
      }
      case "meditation_bell": {
        this.playNote(1760, 0, 1.2, "sine", 0.35, 0.95);
        break;
      }
      case "monastery_bell": {
        this.playNote(146.83, 0, 1.6, "triangle", 0.45, 0.95);
        break;
      }
      case "wind_harmonics": {
        [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) =>
          this.playNote(f, i * 0.14, 1.2, "sine", 0.2)
        );
        break;
      }

      default: {
        // Fallback: Samsung Horizon
        const notes = [261.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, i) => this.playNote(f, i * 0.08, 0.6, "triangle", 0.35));
        break;
      }
    }
  }

  // Start repeating alarm
  public startAlarm(tone: AlarmTone = "samsung_horizon", durationSeconds = 90): void {
    if (this.isPlaying) return;
    this.unlockAudio();
    this.isPlaying = true;
    this.currentTone = tone;

    this.acquireWakeLock();
    this.startHardwareVibration();
    this.setupMediaSession(tone);

    this.playTonePattern(this.currentTone);

    const info = ALARM_TONE_OPTIONS.find((t) => t.id === tone);
    const intervalMs =
      info?.category === "extreme"
        ? 650
        : info?.category === "zen"
        ? 1200
        : info?.category === "digital"
        ? 800
        : 850;

    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playTonePattern(this.currentTone);
      }
    }, intervalMs);

    if (durationSeconds > 0) {
      if (this.timeoutId) clearTimeout(this.timeoutId as any);
      this.timeoutId = setTimeout(() => {
        if (this.isPlaying) {
          this.stopAlarm();
        }
      }, durationSeconds * 1000);
    }
  }

  // Preview a single cycle of a chosen tone
  public previewTone(tone: AlarmTone): void {
    this.unlockAudio();
    this.playTonePattern(tone);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([150, 80, 150]);
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

  public playSuccessChime(): void {
    this.unlockAudio();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, i) => {
        this.playNote(freq, i * 0.08, 0.4, "triangle", 0.4);
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
