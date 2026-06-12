"use client";

import { useMatch } from "@/context/MatchContext";
import { MatchHeader } from "./MatchHeader";
import { RadarField } from "./radar/RadarField";
import { LivePouleUpdate } from "./live/LivePouleUpdate";
import { MomentumTimeline } from "./timeline/MomentumTimeline";

export function MatchScreen() {
  const { loading } = useMatch();

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-emerald-400" />
        <p className="text-sm text-neutral-500">Wedstrijd laden...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-1 pb-1">
      <MatchHeader />
      <RadarField />
      <LivePouleUpdate />
      <MomentumTimeline />
    </div>
  );
}
