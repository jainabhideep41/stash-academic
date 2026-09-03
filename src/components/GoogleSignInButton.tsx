"use client";

import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { performNativeGoogleSignIn, initNativeGoogleAuth } from "@/lib/nativeGoogleAuth";
import { HapticEngine } from "@/lib/hapticEngine";

interface GoogleSignInButtonProps {
  className?: string;
  buttonText?: string;
  callbackUrl?: string;
}

export function GoogleSignInButton({
  className = "",
  buttonText = "Continue with Google",
  callbackUrl = "/dashboard",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initNativeGoogleAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      HapticEngine.trigger("medium");
      setLoading(true);

      // Check if running on Android/iOS native mobile app
      if (Capacitor.isNativePlatform()) {
        const googleUser = await performNativeGoogleSignIn();
        if (googleUser && googleUser.email) {
          HapticEngine.trigger("success");
          // Direct native authentication into NextAuth session
          const res = await signIn("google-native", {
            email: googleUser.email,
            name: googleUser.name || "Student",
            image: googleUser.imageUrl || "",
            idToken: googleUser.idToken || "",
            callbackUrl,
            redirect: false,
          });

          if (res?.ok) {
            window.location.href = callbackUrl;
            return;
          }
        }
        setLoading(false);
        return;
      }

      // Fallback for Web browser
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error("Sign in failed", err);
      HapticEngine.trigger("error");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl text-black font-bold bg-white hover:bg-neutral-200 border border-white transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-black" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#000000"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#000000"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#000000"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#000000"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span>{loading ? "Authenticating..." : buttonText}</span>
    </button>
  );
}
