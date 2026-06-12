"use client";

interface LivePillProps {
  onClick: () => void;
}

export function LivePill({ onClick }: LivePillProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-3 top-2 z-10 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-400 ring-1 ring-cyan-500/40 transition-all duration-200 active:scale-95"
    >
      Terug naar LIVE
    </button>
  );
}
