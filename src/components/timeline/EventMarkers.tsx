"use client";

import type { MatchEvent } from "@/lib/types";
import { divergingValue } from "@/lib/score";
import type { MomentumPoint } from "@/lib/types";

const EVENT_ICONS: Record<string, string> = {
  doelpunt: "⚽",
  gele_kaart: "🟨",
  kans: "●",
  vrije_trap: "🎯",
  hoekschop: "📐",
};

interface EventMarkersProps {
  events: MatchEvent[];
  momentumPoints: MomentumPoint[];
  liveMinute: number;
  chartWidth: number;
  chartHeight: number;
  onEventTap: (event: MatchEvent) => void;
}

export function EventMarkers({
  events,
  momentumPoints,
  liveMinute,
  chartWidth,
  chartHeight,
  onEventTap,
}: EventMarkersProps) {
  const padding = { left: 0, right: 8, top: 8, bottom: 8 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const midY = padding.top + plotHeight / 2;

  return (
    <g className="event-markers">
      {events
        .filter((e) => e.minute <= liveMinute)
        .map((event) => {
          const point = momentumPoints.find((p) => p.minute === event.minute);
          if (!point) return null;

          const x = padding.left + (event.minute / 90) * plotWidth;
          const diverging = divergingValue(point);
          const y =
            midY - (diverging / 100) * (plotHeight / 2 - padding.top);

          return (
            <g
              key={event.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEventTap(event);
              }}
            >
              <circle r={14} fill="#0f172a" opacity={0.7} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                className="select-none"
              >
                {EVENT_ICONS[event.type] ?? "●"}
              </text>
            </g>
          );
        })}
    </g>
  );
}
