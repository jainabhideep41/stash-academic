/**
 * App Version & In-App Auto-Updater Utility
 * Stash Academic Portal (v1.1.0 Enterprise Security Edition)
 */

export const CURRENT_APP_VERSION = "1.2.0";
export const GITHUB_REPO = "jainabhideep41/stash-academic";
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

export interface AppUpdateInfo {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseName: string;
  releaseNotes: string;
  publishedAt: string;
  apkDownloadUrl: string;
  releaseUrl: string;
}

/**
 * Clean version string for semver comparison
 * e.g., "v1.1.0-apk" -> [1, 1, 0]
 */
function parseSemver(v: string): number[] {
  const match = v.replace(/^v/, "").split("-")[0].split(".");
  return match.map((n) => parseInt(n, 10) || 0);
}

/**
 * Returns true if remoteVersion > localVersion
 */
function isNewerVersion(remote: string, local: string): boolean {
  const r = parseSemver(remote);
  const l = parseSemver(local);
  
  for (let i = 0; i < Math.max(r.length, l.length); i++) {
    const rVal = r[i] || 0;
    const lVal = l[i] || 0;
    if (rVal > lVal) return true;
    if (rVal < lVal) return false;
  }
  return false;
}

/**
 * Fetch latest release from GitHub API
 */
export async function checkForAppUpdate(): Promise<AppUpdateInfo> {
  const defaultInfo: AppUpdateInfo = {
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: CURRENT_APP_VERSION,
    hasUpdate: false,
    releaseName: `Stash v${CURRENT_APP_VERSION}`,
    releaseNotes: "You are running the latest hardened security version of Stash Academic.",
    publishedAt: new Date().toISOString(),
    apkDownloadUrl: `https://github.com/${GITHUB_REPO}/releases/download/v1.1.0-security/Stash-Academic-Alarm-v1.1.0.apk`,
    releaseUrl: `https://github.com/${GITHUB_REPO}/releases`,
  };

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return defaultInfo;
    }

    const data = await res.json();
    const tagName: string = data.tag_name || "";
    // Clean tag name, e.g. "v1.1.0-security" -> "1.1.0"
    const remoteVersion = tagName.replace(/^v/, "").split("-")[0] || CURRENT_APP_VERSION;
    
    // Find .apk asset
    const apkAsset = data.assets?.find(
      (a: any) => a.name?.endsWith(".apk") || a.browser_download_url?.endsWith(".apk")
    );
    const apkDownloadUrl = apkAsset?.browser_download_url || defaultInfo.apkDownloadUrl;

    const hasUpdate = isNewerVersion(remoteVersion, CURRENT_APP_VERSION);

    return {
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: remoteVersion,
      hasUpdate,
      releaseName: data.name || `Stash v${remoteVersion}`,
      releaseNotes: data.body || "Enterprise security hardening, DND alarm fixes, and academic tools update.",
      publishedAt: data.published_at || new Date().toISOString(),
      apkDownloadUrl,
      releaseUrl: data.html_url || GITHUB_RELEASES_URL,
    };
  } catch (error) {
    console.warn("Update check error:", error);
    return defaultInfo;
  }
}
