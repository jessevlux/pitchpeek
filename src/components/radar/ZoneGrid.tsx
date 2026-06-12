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
      {ZONES.map((zone) => {
        const isSelected = selectedZone === zone.id;
        const isOutcome = outcomeZone === zone.id;
        const isWrong = wasCorrect === false && isSelected && !isOutcome;

        if (!visible) return null;

        let stroke = "rgba(255,255,255,0.1)";
        let fill = "transparent";
        let strokeWidth = 1;
        let strokeDasharray = "4 4";

        if (isSelected) {
          stroke = "#34d399";
          fill = "rgba(52, 211, 153, 0.06)";
          strokeWidth = 2;
          strokeDasharray = "none";
        } else if (isOutcome) {
          stroke = "#34d399";
          fill = "rgba(52, 211, 153, 0.1)";
          strokeWidth = 2;
          strokeDasharray = "none";
        } else if (isWrong) {
          stroke = "rgba(255,255,255,0.25)";
          fill = "rgba(255,255,255,0.03)";
          strokeWidth = 2;
          strokeDasharray = "none";
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
