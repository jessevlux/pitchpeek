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
import { LivePill } from "@/components/ui/LivePill";
import { EventPopup } from "./EventPopup";
import { TimelineScrubber } from "./TimelineScrubber";

const INSET = 10;

function EventMarker({
  type,
  team,
  homeColor,
  awayColor,
}: {
  type: string;
  team: "home" | "away";
  homeColor: string;
  awayColor: string;
}) {
  const accent = team === "home" ? homeColor : awayColor;

  if (type === "doelpunt") {
    return (
      <>
        <circle r={10} fill="#171717" />
        <circle r={6} fill={accent} opacity={0.9} />
        <circle r={2.5} fill="white" opacity={0.85} />
      </>
    );
  }
  if (type === "gele_kaart") {
    return (
      <>
        <circle r={10} fill="#171717" />
        <rect x={-4} y={-6} width={8} height={12} rx={1} fill="#fbbf24" />
      </>
    );
  }
  if (type === "vrije_trap") {
    return (
      <>
        <circle r={10} fill="#171717" />
        <circle r={5} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.9} />
      </>
    );
  }
  if (type === "hoekschop") {
    return (
      <>
        <circle r={10} fill="#171717" />
        <path
          d="M-3,-3 L3,-3 L3,3"
          fill="none"
          stroke={accent}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      </>
    );
  }
  return (
    <>
      <circle r={8} fill="#171717" />
      <circle r={3} fill={accent} opacity={0.7} />
    </>
  );
}

export function MomentumTimeline() {
  const {
    match,
    momentumPoints,
    liveMinute,
    liveTimeRef,
    viewMinute,
    isFollowingLive,
    events,
    activeEvent,
    setActiveEvent,
    setViewMinute,
    snapToLive,
  } = useMatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 300, height: 144 });
  const [displayMax, setDisplayMax] = useState<number>(APP_CONFIG.START_MINUTE);

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
    let raf: number;
    let last = 0;
    const loop = (ts: number) => {
      if (ts - last > 60) {
        last = ts;
        const t = liveTimeRef.current;
        setDisplayMax((prev) => (Math.abs(prev - t) >= 0.03 ? t : prev));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [liveTimeRef]);

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
      .map((p) => ({
        minute: p.minute,
        home: p.homePressure,
        away: -p.awayPressure,
      }));
  }, [momentumPoints, liveMinute]);

  if (!match) return null;

  const plotW = chartSize.width - INSET * 2;
  const plotH = chartSize.height - INSET * 2;
  const safeMax = Math.max(displayMax, 1);
  const xPx = (minute: number) => INSET + (minute / safeMax) * plotW;
  const yPx = (value: number) => INSET + (1 - (value + 100) / 200) * plotH;

  return (
    <div className="relative mx-4 mb-4 mt-3 shrink-0">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Aanvalsdruk
        </span>
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest">
          <span style={{ color: match.homeColor }}>▲ {match.homeTeam}</span>
          <span style={{ color: match.awayColor }}>▼ {match.awayTeam}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-36 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900"
        onClick={() => activeEvent && setActiveEvent(null)}
      >
        {!isFollowingLive && <LivePill onClick={snapToLive} />}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: INSET, right: INSET, bottom: INSET, left: INSET }}
          >
            <defs>
              <linearGradient id="homeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={match.homeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={match.homeColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={match.awayColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={match.awayColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="minute"
              type="number"
              hide
              domain={[0, displayMax]}
              allowDataOverflow
            />
            <YAxis hide domain={[-100, 100]} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

            <Area
              type="monotone"
              dataKey="home"
              baseValue={0}
              stroke={match.homeColor}
              strokeWidth={5}
              strokeOpacity={0.12}
              fill="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="home"
              baseValue={0}
              stroke={match.homeColor}
              strokeWidth={1.5}
              fill="url(#homeGradient)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="away"
              baseValue={0}
              stroke={match.awayColor}
              strokeWidth={5}
              strokeOpacity={0.12}
              fill="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="away"
              baseValue={0}
              stroke={match.awayColor}
              strokeWidth={1.5}
              fill="url(#awayGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        <TimelineScrubber
          viewMinute={viewMinute}
          maxMinute={displayMax}
          insetX={INSET}
          isFollowingLive={isFollowingLive}
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
              const point = momentumPoints.find(
                (p) => p.minute === event.minute,
              );
              if (!point) return null;

              const value =
                event.team === "home"
                  ? point.homePressure
                  : -point.awayPressure;
              const x = xPx(event.minute);
              const y = yPx(value);

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
                  <EventMarker
                    type={event.type}
                    team={event.team}
                    homeColor={match.homeColor}
                    awayColor={match.awayColor}
                  />
                </g>
              );
            })}
        </svg>

        <EventPopup event={activeEvent} />
      </div>
    </div>
  );
}
