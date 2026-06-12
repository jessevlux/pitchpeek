"use client";

import { useMatch } from "@/context/MatchContext";
import { PITCH_DIMENSIONS } from "@/lib/zones";
import { HeatmapLayer } from "./HeatmapLayer";
import { PitchMarkings } from "./PitchMarkings";
import { PredictionOverlay } from "./PredictionOverlay";
import { ZoneGrid } from "./ZoneGrid";

export function RadarField() {
  const { match, momentumPoints, viewMinute, prediction } = useMatch();

  if (!match) return null;

  const pred = prediction.prediction;
  const isPredictionActive = pred.phase !== "idle";
  const showZones =
    pred.phase === "open" ||
    pred.phase === "selected" ||
    pred.phase === "resolved";
  const canSelect = pred.phase === "open" && !pred.selectedZone;

  return (
    <div className="relative mx-4 flex flex-1 flex-col overflow-hidden rounded-2xl bg-slate-900">
      {isPredictionActive && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-slate-950/30" />
      )}

      <PredictionOverlay
        prediction={pred}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
      />

      <svg
        viewBox={`0 0 ${PITCH_DIMENSIONS.width} ${PITCH_DIMENSIONS.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="pitchGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <rect
          width={PITCH_DIMENSIONS.width}
          height={PITCH_DIMENSIONS.height}
          fill="url(#pitchGradient)"
        />
        <HeatmapLayer
          match={match}
          momentumPoints={momentumPoints}
          viewMinute={viewMinute}
        />
        <PitchMarkings />
        <ZoneGrid
          visible={showZones}
          selectedZone={pred.selectedZone}
          outcomeZone={
            pred.phase === "resolved"
              ? pred.event?.prediction?.outcomeZone ?? null
              : null
          }
          wasCorrect={pred.wasCorrect}
          onSelect={prediction.selectZone}
          disabled={!canSelect}
        />
      </svg>
    </div>
  );
}
