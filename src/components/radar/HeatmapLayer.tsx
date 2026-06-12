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

const TRANSITION = `transform ${APP_CONFIG.TICK_MS}ms ease-out, opacity ${APP_CONFIG.TICK_MS}ms ease-out`;

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
      <defs>
        <filter id="heatBlur" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
        </filter>
        <filter id="heatCore" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
      </defs>

      {trail.map((point, index) => {
        const zone = ZONE_MAP[point.activeZone];
        const progress = (index + 1) / trail.length;
        const intensity = point.pressureValue / 100;
        const outerOpacity = progress * intensity * 0.4;
        const coreOpacity = progress * intensity * 0.28;
        const color = teamColor(
          point.dominantTeam,
          match.homeColor,
          match.awayColor,
        );
        const rx = 34 + intensity * 40;
        const ry = rx * 0.8;

        return (
          <g
            key={index}
            style={{
              transform: `translate(${zone.cx}px, ${zone.cy}px)`,
              transition: TRANSITION,
            }}
          >
            <ellipse
              cx={0}
              cy={0}
              rx={rx * 1.35}
              ry={ry * 1.35}
              fill={color}
              opacity={outerOpacity}
              filter="url(#heatBlur)"
            />
            <ellipse
              cx={0}
              cy={0}
              rx={rx}
              ry={ry}
              fill={color}
              opacity={coreOpacity}
              filter="url(#heatCore)"
            />
          </g>
        );
      })}
    </g>
  );
}
