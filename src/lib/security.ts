/**
 * Client & Storage Security Utilities
 * Stash Academic Portal (v1.1.0 Enterprise Security)
 */

/**
 * Sanitize text input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Derive encryption key from a device/app salt
 */
async function getDeviceEncryptionKey(): Promise<CryptoKey> {
  const salt = new TextEncoder().encode("stash_academic_device_salt_v1_secure");
  const baseKey = await crypto.subtle.importKey(
    "raw",
    salt,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt sensitive string data using AES-GCM
 */
export async function encryptData(plainText: string): Promise<string> {
  try {
    if (!plainText) return "";
    const key = await getDeviceEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64 string
    let binary = "";
    for (let i = 0; i < combined.length; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.warn("Client encryption fallback:", error);
    return plainText;
  }
}

/**
 * Decrypt AES-GCM encrypted string data
 */
export async function decryptData(cipherBase64: string): Promise<string> {
  try {
    if (!cipherBase64) return "";
    // If not base64 or legacy plain text, return as-is
    if (!/^[A-Za-z0-9+/=]+$/.test(cipherBase64)) return cipherBase64;

    const binary = atob(cipherBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.length < 13) return cipherBase64;

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const key = await getDeviceEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    // If decryption fails (e.g. legacy plain text), return raw string
    return cipherBase64;
  }
}
