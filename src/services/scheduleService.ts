import { MATCH_DAYS, SCHEDULE_MATCHES } from "@/data/schedule";
import type { MatchDay, ScheduleMatch } from "@/lib/types";

export async function getMatchDays(): Promise<MatchDay[]> {
  return MATCH_DAYS;
}

export async function getMatchesForDay(dayId: string): Promise<ScheduleMatch[]> {
  return SCHEDULE_MATCHES.filter((m) => m.dayId === dayId);
}

export async function getTodayDayId(): Promise<string> {
  const today = MATCH_DAYS.find((d) => d.isToday);
  return today?.id ?? MATCH_DAYS[0].id;
}
