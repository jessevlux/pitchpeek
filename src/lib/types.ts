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
  pressureValue: number;
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
