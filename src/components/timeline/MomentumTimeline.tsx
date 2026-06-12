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

/** SVG event markers — pure shapes, no emoji */
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
        <circle r={11} fill="#06080f" opacity={0.9} />
        <circle r={7} fill={accent} opacity={0.9} />
        <circle r={3} fill="white" opacity={0.9} />
      </>
    );
  }
  if (type === "gele_kaart") {
    return (
      <>
        <circle r={11} fill="#06080f" opacity={0.9} />
        <rect x={-5} y={-7} width={10} height={14} rx={2} fill="#fbbf24" />
      </>
    );
  }
  if (type === "vrije_trap") {
    return (
      <>
        <circle r={11} fill="#06080f" opacity={0.9} />
        <circle r={7} fill="none" stroke="#22d3ee" strokeWidth={2} />
        <circle r={2.5} fill="#22d3ee" />
      </>
    );
  }
  if (type === "hoekschop") {
    return (
      <>
        <circle r={11} fill="#06080f" opacity={0.9} />
        <path
          d="M-4,-4 L4,-4 L4,4"
          fill="none"
          stroke="#a78bfa"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    );
  }
  return (
    <>
      <circle r={9} fill="#06080f" opacity={0.9} />
      <circle r={4} fill="rgba(255,255,255,0.5)" />
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
  const [displayMax, setDisplayMax] = useState(APP_CONFIG.START_MINUTE);

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
      {/* Section label */}
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
          Aanvalsdruk
        </span>
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest">
          <span style={{ color: match.homeColor }}>▲ {match.homeTeam}</span>
          <span style={{ color: match.awayColor }}>▼ {match.awayTeam}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-36 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#06080f] shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
        onClick={() => activeEvent && setActiveEvent(null)}
      >
        {!isFollowingLive && <LivePill onClick={snapToLive} />}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: INSET, right: INSET, bottom: INSET, left: INSET }}
          >
            <defs>
              {/* Home gradients */}
              <linearGradient id="homeGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={match.homeColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={match.homeColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="homeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={match.homeColor} stopOpacity={0.5} />
                <stop offset="100%" stopColor={match.homeColor} stopOpacity={0.02} />
              </linearGradient>
              {/* Away gradients */}
              <linearGradient id="awayGlow" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={match.awayColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={match.awayColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={match.awayColor} stopOpacity={0.5} />
                <stop offset="100%" stopColor={match.awayColor} stopOpacity={0.02} />
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
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

            {/* Glow layer — thick stroke at low opacity for neon spread */}
            <Area
              type="monotone"
              dataKey="home"
              baseValue={0}
              stroke={match.homeColor}
              strokeWidth={7}
              strokeOpacity={0.18}
              fill="none"
              isAnimationActive={false}
            />
            {/* Main home curve */}
            <Area
              type="monotone"
              dataKey="home"
              baseValue={0}
              stroke={match.homeColor}
              strokeWidth={2}
              fill="url(#homeGradient)"
              isAnimationActive={false}
            />
            {/* Glow layer for away */}
            <Area
              type="monotone"
              dataKey="away"
              baseValue={0}
              stroke={match.awayColor}
              strokeWidth={7}
              strokeOpacity={0.18}
              fill="none"
              isAnimationActive={false}
            />
            {/* Main away curve */}
            <Area
              type="monotone"
              dataKey="away"
              baseValue={0}
              stroke={match.awayColor}
              strokeWidth={2}
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

        {/* Event markers — pure SVG shapes, no emoji */}
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
                  style={{ transition: "opacity 200ms" }}
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
