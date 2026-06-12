"use client";

import { useEffect, useState } from "react";
import type { MatchDay, ScheduleMatch } from "@/lib/types";
import { getMatchDays, getMatchesForDay, getTodayDayId } from "@/services/scheduleService";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { MatchCard } from "./MatchCard";

export function SchemaScreen() {
  const [days, setDays] = useState<MatchDay[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>("");
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMatchDays(), getTodayDayId()]).then(([d, todayId]) => {
      setDays(d);
      setSelectedDayId(todayId);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDayId) return;
    getMatchesForDay(selectedDayId).then(setMatches);
  }, [selectedDayId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  const selectedDay = days.find((d) => d.id === selectedDayId);

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar">
      <ScreenHeader
        title="Schema"
        subtitle={selectedDay?.label}
      />

      {/* Day carousel */}
      <div className="mb-4 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
        {days.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() => setSelectedDayId(day.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 ${
              day.id === selectedDayId
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                : "glass text-white/40 hover:text-white/60"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <section className="space-y-3 px-5 pb-10">
        {matches.length === 0 ? (
          <div className="glass rounded-2xl px-5 py-10 text-center">
            <p className="text-sm text-white/30">Geen wedstrijden op deze dag.</p>
          </div>
        ) : (
          matches.map((m) => <MatchCard key={m.id} match={m} />)
        )}
      </section>
    </div>
  );
}
