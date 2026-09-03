import { Capacitor } from "@capacitor/core";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

const GOOGLE_CLIENT_ID = "823375870464-jogasafgbtj1h4nvk88tbjcrp08quu1b.apps.googleusercontent.com";

let isInitialized = false;

export async function initNativeGoogleAuth() {
  if (typeof window === "undefined" || isInitialized) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.initialize({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      });
      isInitialized = true;
    }
  } catch (err) {
    console.warn("GoogleAuth native init fallback:", err);
  }
}

export async function performNativeGoogleSignIn(): Promise<{
  email: string;
  name?: string;
  imageUrl?: string;
  idToken?: string;
} | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  await initNativeGoogleAuth();

  try {
    const user = await GoogleAuth.signIn();
    if (user && user.email) {
      return {
        email: user.email,
        name: user.name || user.givenName || "Student",
        imageUrl: user.imageUrl || undefined,
        idToken: user.authentication?.idToken || undefined,
      };
    }
  } catch (error: any) {
    console.warn("Native Google Sign-In error:", error);
    // User cancelled or Play Services error
    if (error?.message?.includes("cancelled") || error?.message?.includes("12501")) {
      return null;
    }
    throw error;
  }

  return null;
}
