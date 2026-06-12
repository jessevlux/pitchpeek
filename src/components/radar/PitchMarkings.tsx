import { PITCH_DIMENSIONS } from "@/lib/zones";

const { width, height } = PITCH_DIMENSIONS;
const cx = width / 2;
const cy = height / 2;

const LINE = "rgba(255,255,255,0.12)";
const LINE_THIN = "rgba(255,255,255,0.07)";

export function PitchMarkings() {
  return (
    <g className="pitch-markings">
      {/* Outer boundary */}
      <rect
        x={4}
        y={4}
        width={width - 8}
        height={height - 8}
        fill="none"
        stroke={LINE}
        strokeWidth={1.5}
        rx={4}
      />
      {/* Half-way line */}
      <line
        x1={4}
        y1={cy}
        x2={width - 4}
        y2={cy}
        stroke={LINE_THIN}
        strokeWidth={1}
      />
      {/* Centre circle */}
      <circle
        cx={cx}
        cy={cy}
        r={40}
        fill="none"
        stroke={LINE_THIN}
        strokeWidth={1}
      />
      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={3} fill={LINE} />
      {/* Top penalty area */}
      <rect
        x={cx - 55}
        y={4}
        width={110}
        height={70}
        fill="none"
        stroke={LINE_THIN}
        strokeWidth={1}
      />
      {/* Bottom penalty area */}
      <rect
        x={cx - 55}
        y={height - 74}
        width={110}
        height={70}
        fill="none"
        stroke={LINE_THIN}
        strokeWidth={1}
      />
    </g>
  );
}
