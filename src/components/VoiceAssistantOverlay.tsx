"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  RefreshCw,
  Clock,
  BookOpen,
} from "lucide-react";
import { voiceAssistant } from "@/lib/voiceAssistantEngine";
import { HapticEngine } from "@/lib/hapticEngine";

interface VoiceMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export function VoiceAssistantOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am Stash, your academic voice assistant. Ask me about your deadlines, course concepts, or study tasks.",
      timestamp: "Just now",
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for global trigger event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      HapticEngine.trigger("medium");
      setTimeout(() => {
        handleStartListening();
      }, 400);
    };

    window.addEventListener("stash_open_voice_assistant", handleOpen);
    return () => window.removeEventListener("stash_open_voice_assistant", handleOpen);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up speech on close
  useEffect(() => {
    if (!isOpen) {
      voiceAssistant.stopListening();
      voiceAssistant.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Start speech recognition
  const handleStartListening = () => {
    if (isListening) {
      handleStopListening();
      return;
    }

    HapticEngine.trigger("light");
    voiceAssistant.stopSpeaking();
    setIsSpeaking(false);
    setTranscript("");

    const success = voiceAssistant.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          handleStopListening();
          handleSendQuery(text.trim());
        }
      },
      (error) => {
        console.warn("Recognition error:", error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (success) {
      setIsListening(true);
    }
  };

  // Stop speech recognition
  const handleStopListening = () => {
    voiceAssistant.stopListening();
    setIsListening(false);
  };

  // Process Query via Gemini and speak response with Alexa voice
  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    HapticEngine.trigger("medium");
    const userMsg: VoiceMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");
    setTranscript("");
    setIsProcessing(true);

    try {
      const responseText = await voiceAssistant.queryGeminiVoiceAssistant(queryText);

      const assistantMsg: VoiceMessage = {
        id: "a_" + Date.now(),
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak using Alexa-style TTS
      voiceAssistant.speakAlexaVoice(
        responseText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } catch (e) {
      console.warn("Query error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          HapticEngine.trigger("medium");
        }}
        className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 hover:scale-105 text-white shadow-[0_8px_30px_rgba(168,85,247,0.4)] transition-all duration-200 active:scale-95 flex items-center gap-2 group cursor-pointer"
        title="Open Alexa Voice Assistant"
      >
        <div className="relative">
          <Mic className="w-5 h-5 text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <span className="text-xs font-bold pr-1 hidden sm:inline">Voice Assistant</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-lg bg-neutral-950 border-t sm:border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[650px] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Glowing Alexa Orb Avatar */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              {isSpeaking && (
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 opacity-60 animate-ping" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white font-display tracking-tight flex items-center gap-1.5">
                <span>Stash Voice Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                  Alexa Voice
                </span>
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                {isListening
                  ? "🎙️ Listening to you..."
                  : isSpeaking
                  ? "🔊 Speaking..."
                  : "Powered by Google Gemini"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                type="button"
                onClick={() => {
                  voiceAssistant.stopSpeaking();
                  setIsSpeaking(false);
                }}
                className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white"
                title="Mute Speech"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            <button
              data-modal-close="true"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 text-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-white text-black font-medium rounded-tr-sm shadow-sm"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] font-mono mt-1.5 block ${
                      isUser ? "text-neutral-500 text-right" : "text-neutral-500"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Real-time Listening Transcript */}
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] p-3 rounded-2xl bg-neutral-900/80 border border-purple-500/40 text-purple-200 text-xs font-mono animate-pulse">
                <span>"{transcript}"</span>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pl-2">
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-neutral-800/60 bg-neutral-950 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            "What are my deadlines today?",
            "What's my next priority task?",
            "Summarize AVL Tree rotations",
            "Explain SQL B-Tree indexes",
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(prompt)}
              className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-mono text-neutral-300 whitespace-nowrap hover:text-white transition cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Interactive Voice Control Bar */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 space-y-3">
          
          {/* Visual Waveform Animation when Listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[40, 70, 100, 60, 90, 45, 80, 55, 95, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(12, Math.random() * h)}px`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Input & Mic Row */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleStartListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white shadow-rose-500/40 animate-pulse ring-4 ring-rose-500/20"
                  : "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white hover:from-purple-500 hover:to-indigo-400 shadow-purple-500/20"
              }`}
              title={isListening ? "Tap to stop listening" : "Tap to speak to Alexa"}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(textInput);
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask Stash or tap mic..."}
                className="flex-1 px-4 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="p-3 rounded-2xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 transition active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
