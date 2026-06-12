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
        const isWrong =
          wasCorrect === false && isSelected && !isOutcome;

        let stroke = "transparent";
        let strokeDasharray = "none";
        if (visible) {
          stroke = isSelected
            ? "#22d3ee"
            : isOutcome
              ? "#34d399"
              : isWrong
                ? "#f87171"
                : "#475569";
          strokeDasharray = visible && !isSelected ? "4 4" : "none";
        }

        return (
          <rect
            key={zone.id}
            x={zone.x + 2}
            y={zone.y + 2}
            width={zone.width - 4}
            height={zone.height - 4}
            fill="transparent"
            stroke={stroke}
            strokeWidth={isSelected || isOutcome ? 3 : 1.5}
            strokeDasharray={strokeDasharray}
            rx={4}
            style={{ pointerEvents: visible && !disabled ? "auto" : "none" }}
            className={
              visible && !disabled
                ? "cursor-pointer transition-all duration-200 active:opacity-80"
                : ""
            }
            onClick={() => {
              if (visible && !disabled) onSelect(zone.id);
            }}
          />
        );
      })}
    </g>
  );
}
