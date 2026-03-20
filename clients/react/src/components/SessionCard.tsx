import React from "react";
import type { SessionSummary } from "@collapse/shared";
import { formatTrackedTime } from "../hooks/useSessionTimer.js";
import { Badge } from "../ui/Badge.js";
import { Card } from "../ui/Card.js";
import { colors, spacing, fontSize, fontWeight } from "../ui/theme.js";

export interface SessionCardProps {
  session: SessionSummary;
  onClick?: () => void;
  onArchive?: () => void;
}

export function SessionCard({ session, onClick, onArchive }: SessionCardProps) {
  const date = new Date(session.createdAt);
  const dateStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  return (
    <Card onClick={onClick} style={{ position: "relative" }}>
      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: colors.bg.sunken, overflow: "hidden" }}>
        {session.thumbnailUrl ? (
          <img
            src={session.thumbnailUrl}
            alt="Timelapse thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: colors.bg.sunken }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.text.quaternary} strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
        )}
        <span style={{ position: "absolute", top: spacing.sm, right: spacing.sm }}>
          <Badge status={session.status} variant="overlay" />
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: `${spacing.md}px ${spacing.md}px` }}>
        <div style={{
          fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text.primary,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2,
        }}>
          {session.name}
        </div>
        <div style={{ fontSize: fontSize.xs, color: colors.text.tertiary }}>
          {formatTrackedTime(session.trackedSeconds)} &middot; {dateStr}
        </div>
      </div>

      {/* Archive button */}
      {onArchive && (
        <button
          style={{
            position: "absolute",
            top: spacing.sm,
            left: spacing.sm,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--color-bg-surface, rgba(0,0,0,0.6))",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            color: "var(--color-text-primary, #fff)",
            border: `1px solid var(--color-border-default, rgba(255,255,255,0.1))`,
            cursor: "pointer",
            fontSize: fontSize.lg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-bg-selected, rgba(255,255,255,0.1))";
            e.currentTarget.style.color = "var(--color-text-error, #ef4444)";
            e.currentTarget.style.borderColor = "var(--color-border-hover, rgba(255,255,255,0.2))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-bg-surface, rgba(0,0,0,0.6))";
            e.currentTarget.style.color = "var(--color-text-primary, #fff)";
            e.currentTarget.style.borderColor = "var(--color-border-default, rgba(255,255,255,0.1))";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          title="Archive"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </Card>
  );
}
