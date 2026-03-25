import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "../logger.js";

const STORAGE_KEY = "lookout-blacklisted-apps";

function loadFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveToStorage(apps: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

/**
 * Manages the list of blacklisted app names.
 * Persists to localStorage and syncs to the Rust backend.
 */
export function useBlacklistedApps() {
  const [blacklistedApps, setBlacklistedApps] = useState<string[]>(loadFromStorage);
  const syncedRef = useRef(false);

  // Sync to Rust on mount and whenever the list changes
  useEffect(() => {
    invoke("set_blacklisted_apps", { apps: blacklistedApps }).catch((e: unknown) =>
      console.warn("[blacklist] failed to sync to backend:", e)
    );
    saveToStorage(blacklistedApps);
  }, [blacklistedApps]);

  // Initial sync from localStorage to Rust on mount
  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;
    const stored = loadFromStorage();
    if (stored.length > 0) {
      invoke("set_blacklisted_apps", { apps: stored }).catch((e: unknown) =>
        console.warn("[blacklist] initial sync failed:", e)
      );
    }
  }, []);

  const addApp = useCallback((appName: string) => {
    setBlacklistedApps((prev) => {
      if (prev.includes(appName)) return prev;
      return [...prev, appName].sort();
    });
  }, []);

  const removeApp = useCallback((appName: string) => {
    setBlacklistedApps((prev) => prev.filter((a) => a !== appName));
  }, []);

  const toggleApp = useCallback((appName: string) => {
    setBlacklistedApps((prev) => {
      if (prev.includes(appName)) {
        return prev.filter((a) => a !== appName);
      }
      return [...prev, appName].sort();
    });
  }, []);

  return { blacklistedApps, addApp, removeApp, toggleApp, setBlacklistedApps };
}
