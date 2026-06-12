"use client";

import { useState } from "react";
import { useMatch } from "@/context/MatchContext";
import { MatchHeader } from "./MatchHeader";
import { RadarField } from "./radar/RadarField";
import { PouleStrip } from "./poule/PouleStrip";
import { PouleSheet } from "./poule/PouleSheet";
import { MomentumTimeline } from "./timeline/MomentumTimeline";

export function MatchScreen() {
  const [pouleOpen, setPouleOpen] = useState(false);
  const { loading } = useMatch();

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <p className="text-sm text-slate-400">Wedstrijd laden...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <MatchHeader />
      <RadarField />
      <PouleStrip onOpen={() => setPouleOpen(true)} />
      <MomentumTimeline />
      <PouleSheet open={pouleOpen} onClose={() => setPouleOpen(false)} />
    </div>
  );
}
