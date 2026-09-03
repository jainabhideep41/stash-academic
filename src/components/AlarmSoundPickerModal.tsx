"use client";

import React, { useState, useEffect } from "react";
import {
  ALARM_TONE_OPTIONS,
  alarmAudio,
  ToneInfo,
  SoundCategory,
} from "@/lib/alarmAudioEngine";
import { HapticEngine } from "@/lib/hapticEngine";
import {
  Volume2,
  VolumeX,
  Search,
  Check,
  X,
  Sparkles,
  Flame,
  Radio,
  Music,
  Compass,
} from "lucide-react";

interface AlarmSoundPickerModalProps {
  isOpen: boolean;
  selectedTone: string;
  onSelect: (toneId: string) => void;
  onClose: () => void;
}

export function AlarmSoundPickerModal({
  isOpen,
  selectedTone,
  onSelect,
  onClose,
}: AlarmSoundPickerModalProps) {
  const [activeCategory, setActiveCategory] = useState<SoundCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingTone, setPlayingTone] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      alarmAudio.stopAlarm();
    };
  }, []);

  const handleTogglePreview = (toneId: string) => {
    if (playingTone === toneId) {
      alarmAudio.stopAlarm();
      setPlayingTone(null);
    } else {
      HapticEngine.trigger("selection");
      alarmAudio.startAlarm(toneId, 10);
      setPlayingTone(toneId);
    }
  };

  const handleSelectSound = (toneId: string) => {
    HapticEngine.trigger("success");
    alarmAudio.stopAlarm();
    setPlayingTone(null);
    onSelect(toneId);
    onClose();
  };

  if (!isOpen) return null;

  const filteredTones = ALARM_TONE_OPTIONS.filter((t) => {
    const matchesCategory =
      activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { key: SoundCategory | "all"; label: string; icon: any; count: number }[] = [
    { key: "all", label: "All Sounds", icon: Radio, count: ALARM_TONE_OPTIONS.length },
    {
      key: "popular",
      label: "Samsung & Xiaomi",
      icon: Sparkles,
      count: ALARM_TONE_OPTIONS.filter((t) => t.category === "popular").length,
    },
    {
      key: "extreme",
      label: "Extreme Sirens",
      icon: Flame,
      count: ALARM_TONE_OPTIONS.filter((t) => t.category === "extreme").length,
    },
    {
      key: "digital",
      label: "Digital Clocks",
      icon: Radio,
      count: ALARM_TONE_OPTIONS.filter((t) => t.category === "digital").length,
    },
    {
      key: "melodic",
      label: "Melodic & Marimba",
      icon: Music,
      count: ALARM_TONE_OPTIONS.filter((t) => t.category === "melodic").length,
    },
    {
      key: "zen",
      label: "Zen & Bowls",
      icon: Compass,
      count: ALARM_TONE_OPTIONS.filter((t) => t.category === "zen").length,
    },
  ];

  const getUrgencyBadge = (urgency: ToneInfo["urgency"]) => {
    switch (urgency) {
      case "extreme":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "high":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "medium":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "low":
      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-neutral-950 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[88vh] sm:h-[680px] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-display flex items-center gap-2">
                <span>Alarm Sound Library</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                  {ALARM_TONE_OPTIONS.length} Sounds
                </span>
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                Samsung Galaxy, Xiaomi HyperOS, Apple, Sirens &amp; Digital
              </p>
            </div>
          </div>

          <button
            data-modal-close="true"
            onClick={() => {
              alarmAudio.stopAlarm();
              setPlayingTone(null);
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/30">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 60+ sounds (e.g. Horizon, Fireflies, Air Horn, Big Ben)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-purple-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  HapticEngine.trigger("selection");
                  setActiveCategory(cat.key);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] ${
                    isActive ? "text-neutral-700 font-black" : "text-neutral-500"
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Sounds Grid */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {filteredTones.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <p className="text-sm font-bold">No matching sounds found</p>
              <p className="text-xs">Try searching for a different keyword or select "All Sounds".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTones.map((tone) => {
                const isSelected = selectedTone === tone.id;
                const isPlaying = playingTone === tone.id;

                return (
                  <div
                    key={tone.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? "bg-purple-500/15 border-purple-500 ring-2 ring-purple-500/30 shadow-md"
                        : "bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/90"
                    }`}
                  >
                    {/* Left: Icon & Sound Name */}
                    <div
                      onClick={() => handleSelectSound(tone.id)}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xl shrink-0">{tone.iconText}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate font-display">
                            {tone.name}
                          </h4>
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-full border ${getUrgencyBadge(
                              tone.urgency
                            )}`}
                          >
                            {tone.urgency}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                          {tone.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Action: Preview Tone */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePreview(tone.id)}
                        className={`p-2 rounded-xl transition cursor-pointer active:scale-90 ${
                          isPlaying
                            ? "bg-purple-500 text-white animate-pulse ring-2 ring-purple-500/30 shadow-md"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                        }`}
                        title={isPlaying ? "Stop Preview" : "Preview Tone"}
                      >
                        {isPlaying ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectSound(tone.id)}
                        className={`p-2 rounded-xl transition cursor-pointer active:scale-90 ${
                          isSelected
                            ? "bg-emerald-500 text-black font-bold shadow-emerald-500/20"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                        }`}
                        title="Select this tone"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/90 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>Tap any tone to preview or set as alarm</span>
          <span className="text-purple-400 font-bold">100% Offline Synthesizer</span>
        </div>

      </div>
    </div>
  );
}
