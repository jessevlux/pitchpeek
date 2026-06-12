export type TeamSide = "home" | "away";

export type ZoneId =
  | "links_aanval"
  | "centrum_aanval"
  | "rechts_aanval"
  | "links_midden"
  | "centrum_midden"
  | "rechts_midden"
  | "links_verdediging"
  | "centrum_verdediging"
  | "rechts_verdediging";

export type EventType =
  | "doelpunt"
  | "gele_kaart"
  | "kans"
  | "vrije_trap"
  | "hoekschop";

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeColor: string;
  awayColor: string;
  homeFlag: string;
  awayFlag: string;
}

export interface MomentumPoint {
  minute: number;
  /** Aanvalsdruk van het thuisteam op dit moment (0-100). */
  homePressure: number;
  /** Aanvalsdruk van het uitteam op dit moment (0-100). */
  awayPressure: number;
  /** = max(homePressure, awayPressure); bepaalt de intensiteit van de heatmap-glow. */
  pressureValue: number;
  /** = team met de hoogste druk; bepaalt de kleur van de heatmap-glow. */
  dominantTeam: TeamSide;
  activeZone: ZoneId;
  eventId?: string;
}

export interface PredictionConfig {
  windowSec: number;
  outcomeZone: ZoneId;
  bonusPoints: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  team: TeamSide;
  type: EventType;
  label: string;
  prediction?: PredictionConfig;
}

export interface UserProfile {
  userId: string;
  userName: string;
  avatarColor: string;
}

export interface PouleMember {
  userId: string;
  userName: string;
  avatarColor: string;
}

export interface PouleStanding {
  userId: string;
  userName: string;
  points: number;
  avatarColor: string;
  isCurrentUser: boolean;
  rank: number;
}

export interface PoulePointDelta {
  minute: number;
  userId: string;
  points: number;
}

export interface ZoneGeometry {
  id: ZoneId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
}

export type PredictionPhase = "idle" | "open" | "selected" | "locked" | "resolved";

export interface PredictionState {
  phase: PredictionPhase;
  event: MatchEvent | null;
  selectedZone: ZoneId | null;
  timeLeft: number;
  wasCorrect: boolean | null;
}

export interface PredictionRecord {
  id: string;
  label: string;
  minute: number;
  predictedZone: ZoneId;
  predictedZoneLabel: string;
  outcomeZone: ZoneId;
  status: "correct" | "incorrect";
  points: number;
  createdAt: number;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type MatchStatus = "live" | "upcoming" | "finished";

export interface ScheduleMatch {
  id: string;
  dayId: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  kickoff: string;
  status: MatchStatus;
  matchDataId?: string;
}

export interface MatchDay {
  id: string;
  label: string;
  date: string;
  isToday: boolean;
}
