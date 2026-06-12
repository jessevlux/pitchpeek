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
    <div className="relative mx-4 mt-3 flex flex-1 flex-col overflow-hidden rounded-xl bg-neutral-900">
      {isPredictionActive && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/40" />
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
        <rect
          width={PITCH_DIMENSIONS.width}
          height={PITCH_DIMENSIONS.height}
          fill="#171717"
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
