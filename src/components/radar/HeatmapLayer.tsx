"use client";

import { APP_CONFIG } from "@/lib/config";
import { getTrailPoints, teamColor } from "@/lib/score";
import type { MatchData, MomentumPoint } from "@/lib/types";
import { ZONE_MAP } from "@/lib/zones";

interface HeatmapLayerProps {
  match: MatchData;
  momentumPoints: MomentumPoint[];
  viewMinute: number;
}

export function HeatmapLayer({
  match,
  momentumPoints,
  viewMinute,
}: HeatmapLayerProps) {
  const trail = getTrailPoints(
    momentumPoints,
    viewMinute,
    APP_CONFIG.HEATMAP_TRAIL_MINUTES,
  );

  return (
    <g className="heatmap-layer">
      {trail.map((point, index) => {
        const zone = ZONE_MAP[point.activeZone];
        const opacity =
          ((index + 1) / trail.length) * (point.pressureValue / 100) * 0.7;
        const color = teamColor(
          point.dominantTeam,
          match.homeColor,
          match.awayColor,
        );
        const radius = 30 + (point.pressureValue / 100) * 40;

        return (
          <ellipse
            key={`${point.minute}-${point.activeZone}`}
            cx={zone.cx}
            cy={zone.cy}
            rx={radius}
            ry={radius * 0.85}
            fill={color}
            opacity={opacity}
            style={{
              filter: "blur(12px)",
              transition: "all 0.5s ease-in-out",
            }}
          />
        );
      })}
    </g>
  );
}
