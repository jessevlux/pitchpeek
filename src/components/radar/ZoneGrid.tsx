"use client";

import type { ZoneId } from "@/lib/types";
import { ZONES } from "@/lib/zones";

interface ZoneGridProps {
  visible: boolean;
  selectedZone: ZoneId | null;
  outcomeZone: ZoneId | null;
  wasCorrect: boolean | null;
  onSelect: (zone: ZoneId) => void;
  disabled: boolean;
}

export function ZoneGrid({
  visible,
  selectedZone,
  outcomeZone,
  wasCorrect,
  onSelect,
  disabled,
}: ZoneGridProps) {
  return (
    <g className="zone-grid">
      {/* SVG neon glow filters */}
      <defs>
        <filter id="neonCyan" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#22d3ee" floodOpacity="0.4" />
        </filter>
        <filter id="neonGreen" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34d399" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#34d399" floodOpacity="0.4" />
        </filter>
        <filter id="neonRed" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f87171" floodOpacity="0.8" />
        </filter>
      </defs>

      {ZONES.map((zone) => {
        const isSelected = selectedZone === zone.id;
        const isOutcome = outcomeZone === zone.id;
        const isWrong = wasCorrect === false && isSelected && !isOutcome;

        if (!visible) return null;

        let stroke = "rgba(255,255,255,0.12)";
        let fill = "transparent";
        let strokeWidth = 1;
        let filter: string | undefined;
        let strokeDasharray = "4 4";

        if (isSelected) {
          stroke = "#22d3ee";
          fill = "rgba(34, 211, 238, 0.08)";
          strokeWidth = 2;
          strokeDasharray = "none";
          filter = "url(#neonCyan)";
        } else if (isOutcome) {
          stroke = "#34d399";
          fill = "rgba(52, 211, 153, 0.1)";
          strokeWidth = 2;
          strokeDasharray = "none";
          filter = "url(#neonGreen)";
        } else if (isWrong) {
          stroke = "#f87171";
          fill = "rgba(248, 113, 113, 0.06)";
          strokeWidth = 2;
          strokeDasharray = "none";
          filter = "url(#neonRed)";
        }

        return (
          <rect
            key={zone.id}
            x={zone.x + 2}
            y={zone.y + 2}
            width={zone.width - 4}
            height={zone.height - 4}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            rx={6}
            filter={filter}
            style={{
              pointerEvents: visible && !disabled ? "auto" : "none",
              cursor: visible && !disabled ? "pointer" : "default",
              transition: "fill 200ms ease, stroke 200ms ease",
            }}
            onClick={() => {
              if (visible && !disabled) onSelect(zone.id);
            }}
            onPointerDown={(e) => e.currentTarget.style.opacity = "0.7"}
            onPointerUp={(e) => e.currentTarget.style.opacity = "1"}
            onPointerLeave={(e) => e.currentTarget.style.opacity = "1"}
          />
        );
      })}
    </g>
  );
}
