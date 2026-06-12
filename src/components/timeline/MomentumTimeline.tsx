"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useMatch } from "@/context/MatchContext";
import { APP_CONFIG } from "@/lib/config";
import { divergingValue } from "@/lib/score";
import { LivePill } from "@/components/ui/LivePill";
import { EventPopup } from "./EventPopup";
import { TimelineScrubber } from "./TimelineScrubber";

export function MomentumTimeline() {
  const {
    match,
    momentumPoints,
    liveMinute,
    viewMinute,
    isFollowingLive,
    events,
    activeEvent,
    setActiveEvent,
    setViewMinute,
    snapToLive,
  } = useMatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 300, height: 140 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setChartSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeEvent) return;
    const timer = setTimeout(
      () => setActiveEvent(null),
      APP_CONFIG.EVENT_POPUP_DISMISS_MS,
    );
    return () => clearTimeout(timer);
  }, [activeEvent, setActiveEvent]);

  const chartData = useMemo(() => {
    return momentumPoints
      .filter((p) => p.minute <= liveMinute)
      .map((p) => {
        const val = divergingValue(p);
        return {
          minute: p.minute,
          home: val > 0 ? val : 0,
          away: val < 0 ? val : 0,
          raw: val,
        };
      });
  }, [momentumPoints, liveMinute]);

  if (!match) return null;

  return (
    <div className="relative mx-4 mb-4 shrink-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Momentum
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span style={{ color: match.homeColor }}>▲ {match.homeTeam}</span>
          <span style={{ color: match.awayColor }}>▼ {match.awayTeam}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-36 overflow-hidden rounded-2xl bg-slate-900"
        onClick={() => activeEvent && setActiveEvent(null)}
      >
        {!isFollowingLive && <LivePill onClick={snapToLive} />}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="homeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={match.homeColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={match.homeColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={match.awayColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={match.awayColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="minute" hide domain={[0, 90]} />
            <YAxis hide domain={[-100, 100]} />
            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
            <Area
              type="monotone"
              dataKey="home"
              stroke={match.homeColor}
              strokeWidth={2}
              fill="url(#homeGradient)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="away"
              stroke={match.awayColor}
              strokeWidth={2}
              fill="url(#awayGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        <TimelineScrubber
          viewMinute={viewMinute}
          onScrub={setViewMinute}
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
          preserveAspectRatio="none"
        >
          {events
            .filter((e) => e.minute <= liveMinute && e.type !== "kans")
            .map((event) => {
              const point = momentumPoints.find((p) => p.minute === event.minute);
              if (!point) return null;
              const padding = { top: 8, bottom: 8 };
              const plotHeight = chartSize.height - padding.top - padding.bottom;
              const midY = padding.top + plotHeight / 2;
              const x = (event.minute / 90) * (chartSize.width - 8);
              const diverging = divergingValue(point);
              const y = midY - (diverging / 100) * (plotHeight / 2);

              const icons: Record<string, string> = {
                doelpunt: "⚽",
                gele_kaart: "🟨",
                vrije_trap: "🎯",
                hoekschop: "📐",
              };

              return (
                <g
                  key={event.id}
                  transform={`translate(${x}, ${y})`}
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMinute(event.minute);
                    setActiveEvent(event);
                  }}
                >
                  <circle r={12} fill="#0f172a" opacity={0.8} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                  >
                    {icons[event.type] ?? "●"}
                  </text>
                </g>
              );
            })}
        </svg>

        <EventPopup event={activeEvent} />
      </div>
    </div>
  );
}
