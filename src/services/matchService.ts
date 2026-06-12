import {
  MATCH_DATA,
  MATCH_EVENTS,
  MOMENTUM_POINTS,
} from "@/data/matchScript";
import type { MatchData, MatchEvent, MomentumPoint } from "@/lib/types";

export async function getMatch(): Promise<MatchData> {
  return MATCH_DATA;
}

export async function getMomentumPoints(): Promise<MomentumPoint[]> {
  return MOMENTUM_POINTS;
}

export async function getEvents(): Promise<MatchEvent[]> {
  return MATCH_EVENTS;
}

export async function getEventAtMinute(
  minute: number,
): Promise<MatchEvent | undefined> {
  return MATCH_EVENTS.find((e) => e.minute === minute);
}

export async function getPredictionEvents(): Promise<MatchEvent[]> {
  return MATCH_EVENTS.filter((e) => e.prediction);
}
