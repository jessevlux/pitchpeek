import type { ZoneGeometry, ZoneId } from "./types";

const PITCH_WIDTH = 300;
const PITCH_HEIGHT = 400;
const COL_W = PITCH_WIDTH / 3;
const ROW_H = PITCH_HEIGHT / 3;

const ZONE_LABELS: Record<ZoneId, string> = {
  links_aanval: "Links aanval",
  centrum_aanval: "Centrum aanval",
  rechts_aanval: "Rechts aanval",
  links_midden: "Links midden",
  centrum_midden: "Centrum midden",
  rechts_midden: "Rechts midden",
  links_verdediging: "Links verdediging",
  centrum_verdediging: "Centrum verdediging",
  rechts_verdediging: "Rechts verdediging",
};

function buildZone(id: ZoneId, col: number, row: number): ZoneGeometry {
  const x = col * COL_W;
  const y = row * ROW_H;
  return {
    id,
    label: ZONE_LABELS[id],
    x,
    y,
    width: COL_W,
    height: ROW_H,
    cx: x + COL_W / 2,
    cy: y + ROW_H / 2,
  };
}

export const ZONES: ZoneGeometry[] = [
  buildZone("links_aanval", 0, 0),
  buildZone("centrum_aanval", 1, 0),
  buildZone("rechts_aanval", 2, 0),
  buildZone("links_midden", 0, 1),
  buildZone("centrum_midden", 1, 1),
  buildZone("rechts_midden", 2, 1),
  buildZone("links_verdediging", 0, 2),
  buildZone("centrum_verdediging", 1, 2),
  buildZone("rechts_verdediging", 2, 2),
];

export const ZONE_MAP = Object.fromEntries(
  ZONES.map((zone) => [zone.id, zone]),
) as Record<ZoneId, ZoneGeometry>;

export const PITCH_DIMENSIONS = {
  width: PITCH_WIDTH,
  height: PITCH_HEIGHT,
};
