import type { Badge } from "@/lib/types";
import { Trophy, Target, Globe, Award } from "@/components/icons";

interface BadgeGridProps {
  badges: Badge[];
}

function BadgeIcon({ icon, unlocked }: { icon: string; unlocked: boolean }) {
  const cls = `${unlocked ? "text-cyan-400" : "text-white/15"}`;
  const size = 28;

  if (icon === "trophy") return <Trophy size={size} className={cls} />;
  if (icon === "target") return <Target size={size} className={cls} />;
  if (icon === "globe") return <Globe size={size} className={cls} />;
  return <Award size={size} className={cls} />;
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`glass flex flex-col items-center rounded-2xl px-3 py-5 text-center transition-all duration-300 ${
            badge.unlocked
              ? "neon-cyan ring-1 ring-cyan-400/25"
              : "opacity-35"
          }`}
        >
          <BadgeIcon icon={badge.icon} unlocked={badge.unlocked} />
          <p className="mt-3 text-[11px] font-black leading-tight text-white">
            {badge.label}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-white/30">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
}
