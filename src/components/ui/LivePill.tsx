"use client";

interface LivePillProps {
  onClick: () => void;
}

export function LivePill({ onClick }: LivePillProps) {
  return (
    <button
      onClick={onClick}
      className="glass absolute right-3 top-2 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400 transition-all duration-200 active:scale-95 active:opacity-70"
      style={{ boxShadow: "0 0 10px rgba(34,211,238,0.2)" }}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
      Live
    </button>
  );
}
