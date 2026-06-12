import type {
  MatchData,
  MatchEvent,
  MomentumPoint,
  TeamSide,
  ZoneId,
} from "@/lib/types";

export const MATCH_DATA: MatchData = {
  id: "ned-esp-wk2026",
  homeTeam: "NED",
  awayTeam: "ESP",
  homeColor: "#f97316",
  awayColor: "#dc2626",
  homeFlag: "🇳🇱",
  awayFlag: "🇪🇸",
};

const ZONE_ROTATION: ZoneId[] = [
  "centrum_midden",
  "links_midden",
  "rechts_midden",
  "centrum_aanval",
  "links_aanval",
  "rechts_aanval",
  "centrum_verdediging",
  "links_verdediging",
  "rechts_verdediging",
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Twee onafhankelijke golven met verschillende frequentie en fase, zodat de
// aanvalsdruk van NED en ESP een eigen verloop heeft (geen spiegelbeeld).
function homeWave(minute: number): number {
  return 40 + 22 * Math.sin(minute * 0.18 + 0.4) + 9 * Math.sin(minute * 0.55 + 1);
}

function awayWave(minute: number): number {
  return 42 + 19 * Math.sin(minute * 0.23 + 2.1) + 8 * Math.sin(minute * 0.48 + 0.3);
}

interface MomentumBoost {
  home?: number;
  away?: number;
  zone: ZoneId;
}

// Extra druk rond belangrijke gebeurtenissen, voor het scorende/drukkende team.
const EVENT_BOOSTS: Record<number, MomentumBoost> = {
  12: { away: 34, zone: "centrum_aanval" },
  23: { home: 46, zone: "centrum_aanval" },
  28: { away: 16, zone: "rechts_midden" },
  36: { home: 30, zone: "centrum_aanval" },
  44: { away: 28, zone: "rechts_aanval" },
  53: { away: 36, zone: "centrum_midden" },
  61: { home: 30, zone: "links_aanval" },
  67: { home: 50, zone: "centrum_aanval" },
  78: { home: 16, zone: "centrum_midden" },
  85: { away: 42, zone: "centrum_aanval" },
};

function buildMomentumPoints(): MomentumPoint[] {
  const points: MomentumPoint[] = [];

  for (let minute = 0; minute <= 90; minute++) {
    const boost = EVENT_BOOSTS[minute];
    const homePressure = Math.round(
      clamp(homeWave(minute) + (boost?.home ?? 0), 12, 98),
    );
    const awayPressure = Math.round(
      clamp(awayWave(minute) + (boost?.away ?? 0), 12, 98),
    );
    const dominantTeam: TeamSide = homePressure >= awayPressure ? "home" : "away";

    points.push({
      minute,
      homePressure,
      awayPressure,
      pressureValue: Math.max(homePressure, awayPressure),
      dominantTeam,
      activeZone: boost?.zone ?? ZONE_ROTATION[minute % ZONE_ROTATION.length],
      eventId: boost ? `evt-${minute}` : undefined,
    });
  }

  return points;
}

export const MATCH_EVENTS: MatchEvent[] = [
  {
    id: "evt-12",
    minute: 12,
    team: "away",
    type: "kans",
    label: "Kans — Morata",
  },
  {
    id: "evt-23",
    minute: 23,
    team: "home",
    type: "doelpunt",
    label: "Doelpunt — Gakpo",
  },
  {
    id: "evt-28",
    minute: 28,
    team: "away",
    type: "gele_kaart",
    label: "Gele kaart — Rodri",
  },
  {
    id: "evt-36",
    minute: 36,
    team: "home",
    type: "vrije_trap",
    label: "Vrije trap — NED",
    prediction: {
      windowSec: 8,
      outcomeZone: "centrum_aanval",
      bonusPoints: 25,
    },
  },
  {
    id: "evt-44",
    minute: 44,
    team: "away",
    type: "hoekschop",
    label: "Hoekschop — ESP",
    prediction: {
      windowSec: 8,
      outcomeZone: "rechts_aanval",
      bonusPoints: 25,
    },
  },
  {
    id: "evt-53",
    minute: 53,
    team: "away",
    type: "vrije_trap",
    label: "Vrije trap — ESP",
    prediction: {
      windowSec: 8,
      outcomeZone: "centrum_midden",
      bonusPoints: 25,
    },
  },
  {
    id: "evt-61",
    minute: 61,
    team: "home",
    type: "kans",
    label: "Kans — Depay",
  },
  {
    id: "evt-67",
    minute: 67,
    team: "home",
    type: "doelpunt",
    label: "Doelpunt — Depay",
  },
  {
    id: "evt-78",
    minute: 78,
    team: "home",
    type: "gele_kaart",
    label: "Gele kaart — Van Dijk",
  },
  {
    id: "evt-85",
    minute: 85,
    team: "away",
    type: "kans",
    label: "Kans — Yamal",
  },
];

export const MOMENTUM_POINTS = buildMomentumPoints();
