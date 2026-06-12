"use client";

interface LivePillProps {
  onClick: () => void;
}

export function LivePill({ onClick }: LivePillProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-3 top-2 z-10 flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400 transition-opacity active:opacity-70"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Live
    </button>
  );
}
