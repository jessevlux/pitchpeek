import type { MatchData, MatchEvent, MomentumPoint, ZoneId } from "@/lib/types";

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

function wave(minute: number, offset: number, amplitude: number): number {
  return Math.round(
    50 + amplitude * Math.sin((minute + offset) * 0.35) + amplitude * 0.3,
  );
}

function buildMomentumPoints(): MomentumPoint[] {
  const points: MomentumPoint[] = [];
  const spikes: Record<number, { team: "home" | "away"; value: number; zone: ZoneId }> = {
    12: { team: "away", value: 88, zone: "centrum_aanval" },
    23: { team: "home", value: 95, zone: "centrum_aanval" },
    28: { team: "away", value: 72, zone: "rechts_midden" },
    36: { team: "home", value: 82, zone: "centrum_aanval" },
    44: { team: "away", value: 78, zone: "rechts_aanval" },
    53: { team: "away", value: 85, zone: "centrum_midden" },
    61: { team: "home", value: 80, zone: "links_aanval" },
    67: { team: "home", value: 98, zone: "centrum_aanval" },
    78: { team: "home", value: 65, zone: "centrum_midden" },
    85: { team: "away", value: 90, zone: "centrum_aanval" },
  };

  for (let minute = 0; minute <= 90; minute++) {
    const spike = spikes[minute];
    if (spike) {
      points.push({
        minute,
        pressureValue: spike.value,
        dominantTeam: spike.team,
        activeZone: spike.zone,
        eventId: `evt-${minute}`,
      });
      continue;
    }

    const homeLean = minute < 40 || (minute > 55 && minute < 75);
    const dominantTeam = homeLean ? "home" : minute % 3 === 0 ? "away" : "home";
    const pressureValue = wave(minute, homeLean ? 2 : 5, homeLean ? 28 : 22);
    points.push({
      minute,
      pressureValue: Math.min(100, Math.max(20, pressureValue)),
      dominantTeam,
      activeZone: ZONE_ROTATION[minute % ZONE_ROTATION.length],
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
