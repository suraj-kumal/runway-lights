import type { LightGroup, LightPosition, LightType } from "./RunwayEditor";

const r1 = (n: number) => Math.round(n * 10) / 10;

export const ASPHALT = "#30343b";

export const RUNWAY = { x: 80, y: 80, width: 900, height: 180 };
const RUNWAY_RIGHT = RUNWAY.x + RUNWAY.width; // 980
const RUNWAY_BOTTOM = RUNWAY.y + RUNWAY.height; // 260
const RUNWAY_CENTER_Y = RUNWAY.y + RUNWAY.height / 2; // 170

/* ---------- Turn pad (beyond the runway end, widened on one side) ---------- */
const CHAMFER = 60; // 45° corner back to the runway edge
const PAD = {
  left: RUNWAY_RIGHT - 10, // slight overlap so it tucks under the runway
  right: 1180,
  top: RUNWAY.y, // top edge continues straight from the runway
  bottom: RUNWAY_BOTTOM + CHAMFER, // 320
};

export const TURN_PAD_PATH = `M ${PAD.left} ${PAD.top} L ${PAD.right} ${PAD.top} L ${PAD.right} ${PAD.bottom} L ${RUNWAY_RIGHT + CHAMFER} ${PAD.bottom} L ${RUNWAY_RIGHT} ${RUNWAY_BOTTOM} L ${PAD.left} ${RUNWAY_BOTTOM} Z`;

/* Thin yellow pad-edge marking, inset from the pavement edge */
const MARK_INSET = 12;
const MARK_D = MARK_INSET * Math.SQRT2;
const markBottom = PAD.bottom - MARK_INSET;
const markDiagX = (y: number) => RUNWAY_RIGHT - RUNWAY_BOTTOM + y + MARK_D;
export const TURN_EDGE_MARK_PATH = `M ${RUNWAY_RIGHT} ${PAD.top + MARK_INSET} L ${PAD.right - MARK_INSET} ${PAD.top + MARK_INSET} L ${PAD.right - MARK_INSET} ${markBottom} L ${r1(markDiagX(markBottom))} ${markBottom} L ${r1(markDiagX(RUNWAY_BOTTOM - 5))} ${RUNWAY_BOTTOM - 5}`;

/* Yellow teardrop guide: leaves the centerline, wraps a turning circle */
const GUIDE_P = { x: 960, y: RUNWAY_CENTER_Y };
const GUIDE_C = { x: 1085, y: 195 };
const GUIDE_R = 62;
const gdx = GUIDE_C.x - GUIDE_P.x;
const gdy = GUIDE_C.y - GUIDE_P.y;
const gd = Math.hypot(gdx, gdy);
const gTheta = Math.atan2(gdy, gdx);
const gAlpha = Math.asin(GUIDE_R / gd);
const gTan = Math.sqrt(gd * gd - GUIDE_R * GUIDE_R);
const tanUp = {
  x: GUIDE_P.x + gTan * Math.cos(gTheta - gAlpha),
  y: GUIDE_P.y + gTan * Math.sin(gTheta - gAlpha),
};
const tanDown = {
  x: GUIDE_P.x + gTan * Math.cos(gTheta + gAlpha),
  y: GUIDE_P.y + gTan * Math.sin(gTheta + gAlpha),
};
export const TURN_GUIDE_PATH = `M ${GUIDE_P.x} ${GUIDE_P.y} L ${r1(tanUp.x)} ${r1(tanUp.y)} A ${GUIDE_R} ${GUIDE_R} 0 1 1 ${r1(tanDown.x)} ${r1(tanDown.y)} Z`;

/* ---------- Taxiway geometry ---------- */
export const TAXI_X = 620; // vertical section centerline
export const TAXI_WIDTH = 60;
const TAXI_HALF = TAXI_WIDTH / 2;
const TURN_R = 80; // centerline curve radius (must be > TAXI_HALF)
const TAXI_Y = 430; // horizontal section centerline
const TAXI_END_X = 900;

const ARC_CX = TAXI_X + TURN_R; // 700
const ARC_CY = TAXI_Y - TURN_R; // 350

export const TAXI_PATH = `M ${TAXI_X} 170 L ${TAXI_X} ${ARC_CY} A ${TURN_R} ${TURN_R} 0 0 0 ${ARC_CX} ${TAXI_Y} L ${TAXI_END_X} ${TAXI_Y}`;
export const TAXI_CENTER_PATH = `M ${TAXI_X} 250 L ${TAXI_X} ${ARC_CY} A ${TURN_R} ${TURN_R} 0 0 0 ${ARC_CX} ${TAXI_Y} L ${TAXI_END_X} ${TAXI_Y}`;

/* Junction fillets (smooth concave corners where taxiway meets runway) */
const F = 20;
const L = TAXI_X - TAXI_HALF;
const R = TAXI_X + TAXI_HALF;
export const FILLET_LEFT = `M ${L} ${RUNWAY_BOTTOM} L ${L} ${RUNWAY_BOTTOM + F} A ${F} ${F} 0 0 0 ${L - F} ${RUNWAY_BOTTOM} Z`;
export const FILLET_RIGHT = `M ${R} ${RUNWAY_BOTTOM} L ${R} ${RUNWAY_BOTTOM + F} A ${F} ${F} 0 0 1 ${R + F} ${RUNWAY_BOTTOM} Z`;
/* Rect that hides the white runway edge line across the taxiway mouth */
export const MOUTH_GAP = {
  x: L,
  y: RUNWAY_BOTTOM - 20,
  width: TAXI_WIDTH,
  height: 20,
};

/* ---------- Colors & labels ---------- */
export const LIGHT_COLORS: Record<LightType, string> = {
  white: "#ffffff",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
};

export const GROUP_LABELS: Record<LightGroup, string> = {
  edge: "Edge lights",
  mid: "Mid (centerline) lights",
  threshold: "Threshold lights",
  "taxi-center": "Taxiway centerline lights",
  turn: "Turning lights (runway-end turn pad)",
  "taxi-edge": "Taxiway edge lights",
};

/* ---------- Light position generation ---------- */
function arcPoint(cx: number, cy: number, radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/** Blue lights along the pad's outer edge, corners included */
function turnPadLightPoints(step = 60, inset = 8) {
  const bottom = PAD.bottom - inset;
  const diagX = (y: number) =>
    RUNWAY_RIGHT - RUNWAY_BOTTOM + y + inset * Math.SQRT2;

  const verts = [
    { x: RUNWAY_RIGHT + 20, y: PAD.top + inset },
    { x: PAD.right - inset, y: PAD.top + inset },
    { x: PAD.right - inset, y: bottom },
    { x: diagX(bottom), y: bottom },
    { x: diagX(RUNWAY_BOTTOM - 5), y: RUNWAY_BOTTOM - 5 },
  ];

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < verts.length - 1; i++) {
    const a = verts[i];
    const b = verts[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / step));
    for (let k = 0; k < n; k++) {
      points.push({
        x: a.x + ((b.x - a.x) * k) / n,
        y: a.y + ((b.y - a.y) * k) / n,
      });
    }
  }
  points.push(verts[verts.length - 1]);
  return points;
}

function buildPositions(): LightPosition[] {
  const out: LightPosition[] = [];
  const counters: Record<string, number> = {};

  const add = (
    group: LightGroup,
    type: LightType,
    x: number,
    y: number
  ) => {
    counters[group] = (counters[group] ?? 0) + 1;
    out.push({
      id: `${group}-${counters[group]}`,
      group,
      type,
      x: r1(x),
      y: r1(y),
    });
  };

  /* Runway edge lights (top + bottom, white) */
  for (let x = 140; x <= 940; x += 40) {
    add("edge", "white", x, 95);
    add("edge", "white", x, 245);
  }

  /* Runway mid / centerline lights (white) */
  for (let x = 140; x <= 940; x += 40) {
    add("mid", "white", x, RUNWAY_CENTER_Y);
  }

  /* Threshold bars: green at the landing end, red at the far end */
  for (let y = 100; y <= 240; y += 20) {
    add("threshold", "green", 100, y);
    add("threshold", "red", 960, y);
  }

  /* Turning lights (blue): outer edge of the turn pad */
  for (const p of turnPadLightPoints()) {
    add("turn", "blue", p.x, p.y);
  }

  /* Taxiway centerline (green): leaving runway */
  for (const y of [290, 320, 350]) add("taxi-center", "green", TAXI_X, y);

  /* Taxiway centerline (green): around the curve */
  for (const deg of [165, 150, 135, 120, 105]) {
    const p = arcPoint(ARC_CX, ARC_CY, TURN_R, deg);
    add("taxi-center", "green", p.x, p.y);
  }

  /* Taxiway centerline (green): after the curve */
  add("taxi-center", "green", ARC_CX, TAXI_Y);
  for (let x = 740; x <= TAXI_END_X; x += 40) {
    add("taxi-center", "green", x, TAXI_Y);
  }

  /* Taxiway edge lights (blue): outer edge */
  const outerR = TURN_R + TAXI_HALF;
  for (const y of [290, 320, 350]) {
    add("taxi-edge", "blue", TAXI_X - TAXI_HALF, y);
  }
  for (const deg of [165, 150, 135, 120, 105]) {
    const p = arcPoint(ARC_CX, ARC_CY, outerR, deg);
    add("taxi-edge", "blue", p.x, p.y);
  }
  add("taxi-edge", "blue", ARC_CX, TAXI_Y + TAXI_HALF);
  for (let x = 740; x <= TAXI_END_X; x += 40) {
    add("taxi-edge", "blue", x, TAXI_Y + TAXI_HALF);
  }

  /* Taxiway edge lights (blue): inner edge */
  const innerR = TURN_R - TAXI_HALF;
  for (const y of [290, 320, 350]) {
    add("taxi-edge", "blue", TAXI_X + TAXI_HALF, y);
  }
  for (const deg of [150, 120]) {
    const p = arcPoint(ARC_CX, ARC_CY, innerR, deg);
    add("taxi-edge", "blue", p.x, p.y);
  }
  add("taxi-edge", "blue", ARC_CX, TAXI_Y - TAXI_HALF);
  for (let x = 740; x <= TAXI_END_X; x += 40) {
    add("taxi-edge", "blue", x, TAXI_Y - TAXI_HALF);
  }

  return out;
}

export const LIGHT_POSITIONS: LightPosition[] = buildPositions();
