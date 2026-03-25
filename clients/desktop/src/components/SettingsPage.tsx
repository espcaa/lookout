import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Button,
  colors,
  spacing,
  fontSize,
  fontWeight,
  radii,
} from "@lookout/react";
import { invoke } from "../logger.js";
import { PageLayout, cardButtonStyle } from "./PageLayout.js";
import { useBlacklistedApps } from "../hooks/useBlacklistedApps.js";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { blacklistedApps, toggleApp } = useBlacklistedApps();
  const [runningApps, setRunningApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRunningApps = useCallback(async () => {
    try {
      const apps = await invoke<string[]>("list_running_apps");
      setRunningApps(apps);
    } catch (e) {
      console.warn("[settings] failed to list running apps:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount, then refresh every 5 seconds
  useEffect(() => {
    fetchRunningApps();
    refreshTimerRef.current = setInterval(fetchRunningApps, 5000);
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fetchRunningApps]);

  // Merge running apps with already-blacklisted apps (some may not be running)
  const allApps = Array.from(
    new Set([...runningApps, ...blacklistedApps])
  ).sort((a, b) => a.localeCompare(b));

  const filtered = searchQuery
    ? allApps.filter((app) =>
        app.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allApps;

  const blacklistedCount = blacklistedApps.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 480,
        margin: "0 auto",
        padding: spacing.lg,
        boxSizing: "border-box",
      }}
    >
      {/* Back button */}
      <div style={{ flexShrink: 0, marginBottom: spacing.lg }}>
        <Button variant="secondary" size="sm" onClick={onBack} style={cardButtonStyle}>
          {navigator.userAgent.includes("Mac") ? (
            <span>&larr; Back</span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: spacing.xs }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Back</span>
            </span>
          )}
        </Button>
      </div>

      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: spacing.lg }}>
        <h2
          style={{
            fontSize: fontSize.heading,
            fontWeight: fontWeight.bold,
            color: colors.text.primary,
            margin: 0,
            marginBottom: spacing.xs,
          }}
        >
          Filtered Apps
        </h2>
        <p
          style={{
            fontSize: fontSize.sm,
            color: colors.text.secondary,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Selected apps will be blacked out in monitor screen captures.
          {blacklistedCount > 0 && (
            <span style={{ color: colors.status.warning }}>
              {" "}{blacklistedCount} app{blacklistedCount !== 1 ? "s" : ""} filtered.
            </span>
          )}
        </p>
      </div>

      {/* Search */}
      <div style={{ flexShrink: 0, marginBottom: spacing.md }}>
        <input
          type="text"
          placeholder="Search apps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: `${spacing.sm}px ${spacing.md}px`,
            fontSize: fontSize.md,
            color: colors.text.primary,
            background: colors.bg.surface,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radii.md,
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.border.hover;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.border.default;
          }}
        />
      </div>

      {/* App list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          borderRadius: radii.lg,
          border: `1px solid ${colors.border.default}`,
          background: colors.bg.surface,
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: spacing.xxl,
              color: colors.text.tertiary,
              fontSize: fontSize.sm,
            }}
          >
            Loading apps...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: spacing.xxl,
              color: colors.text.tertiary,
              fontSize: fontSize.sm,
            }}
          >
            {searchQuery ? "No matching apps" : "No apps detected"}
          </div>
        ) : (
          <div style={{ padding: spacing.xs }}>
            <AnimatePresence initial={false}>
              {filtered.map((app) => {
                const isBlacklisted = blacklistedApps.includes(app);
                const isRunning = runningApps.includes(app);
                return (
                  <motion.button
                    key={app}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => toggleApp(app)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing.md,
                      width: "100%",
                      padding: `${spacing.sm}px ${spacing.md}px`,
                      background: "transparent",
                      border: "none",
                      borderRadius: radii.md,
                      cursor: "pointer",
                      textAlign: "left",
                      color: colors.text.primary,
                      fontSize: fontSize.md,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.bg.selected;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: radii.sm,
                        border: `1.5px solid ${isBlacklisted ? colors.status.danger : colors.border.hover}`,
                        background: isBlacklisted ? colors.status.danger : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >
                      {isBlacklisted && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* App name + running indicator */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: isBlacklisted ? fontWeight.medium : fontWeight.normal,
                        }}
                      >
                        {app}
                      </span>
                    </div>

                    {/* Status indicators */}
                    <div style={{ display: "flex", alignItems: "center", gap: spacing.xs, flexShrink: 0 }}>
                      {isRunning && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: colors.status.success,
                          }}
                          title="Running"
                        />
                      )}
                      {isBlacklisted && (
                        <span
                          style={{
                            fontSize: fontSize.xs,
                            color: colors.status.danger,
                            fontWeight: fontWeight.medium,
                          }}
                        >
                          filtered
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
