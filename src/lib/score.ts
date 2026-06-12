import type { MatchEvent, MomentumPoint, TeamSide } from "./types";

export function scoreAtMinute(
  events: MatchEvent[],
  minute: number,
): { home: number; away: number } {
  return events
    .filter((e) => e.type === "doelpunt" && e.minute <= minute)
    .reduce(
      (acc, event) => {
        if (event.team === "home") acc.home += 1;
        else acc.away += 1;
        return acc;
      },
      { home: 0, away: 0 },
    );
}

export function getMomentumAtMinute(
  points: MomentumPoint[],
  minute: number,
): MomentumPoint | undefined {
  return points.find((p) => p.minute === minute) ?? points[minute];
}

export function getTrailPoints(
  points: MomentumPoint[],
  minute: number,
  trailLength: number,
): MomentumPoint[] {
  const start = Math.max(0, minute - trailLength + 1);
  const result: MomentumPoint[] = [];
  for (let m = start; m <= minute; m++) {
    const point = getMomentumAtMinute(points, m);
    if (point) result.push(point);
  }
  return result;
}

export function divergingValue(point: MomentumPoint): number {
  const sign = point.dominantTeam === "home" ? 1 : -1;
  return sign * point.pressureValue;
}

export function teamColor(
  team: TeamSide,
  homeColor: string,
  awayColor: string,
): string {
  return team === "home" ? homeColor : awayColor;
}
