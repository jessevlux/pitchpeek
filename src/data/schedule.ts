import type { MatchDay, ScheduleMatch } from "@/lib/types";
import { MATCH_DATA } from "./matchScript";

export const MATCH_DAYS: MatchDay[] = [
  { id: "day-1", label: "Za 14 jun", date: "2026-06-14", isToday: false },
  { id: "day-2", label: "Zo 15 jun", date: "2026-06-15", isToday: false },
  { id: "day-3", label: "Ma 16 jun", date: "2026-06-16", isToday: true },
  { id: "day-4", label: "Di 17 jun", date: "2026-06-17", isToday: false },
  { id: "day-5", label: "Wo 18 jun", date: "2026-06-18", isToday: false },
];

export const SCHEDULE_MATCHES: ScheduleMatch[] = [
  {
    id: "match-ned-esp",
    dayId: "day-3",
    homeTeam: MATCH_DATA.homeTeam,
    awayTeam: MATCH_DATA.awayTeam,
    homeFlag: MATCH_DATA.homeFlag,
    awayFlag: MATCH_DATA.awayFlag,
    kickoff: "20:00",
    status: "live",
    matchDataId: MATCH_DATA.id,
  },
  {
    id: "match-ger-fra",
    dayId: "day-3",
    homeTeam: "GER",
    awayTeam: "FRA",
    homeFlag: "🇩🇪",
    awayFlag: "🇫🇷",
    kickoff: "23:00",
    status: "upcoming",
  },
  {
    id: "match-eng-por",
    dayId: "day-3",
    homeTeam: "ENG",
    awayTeam: "POR",
    homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayFlag: "🇵🇹",
    kickoff: "18:00",
    status: "upcoming",
  },
  {
    id: "match-bra-arg",
    dayId: "day-4",
    homeTeam: "BRA",
    awayTeam: "ARG",
    homeFlag: "🇧🇷",
    awayFlag: "🇦🇷",
    kickoff: "21:00",
    status: "upcoming",
  },
];
