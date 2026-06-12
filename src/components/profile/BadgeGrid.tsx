import type { Badge } from "@/lib/types";
import { Trophy, Target, Globe, Award } from "@/components/icons";

interface BadgeGridProps {
  badges: Badge[];
}

function BadgeIcon({ icon, unlocked }: { icon: string; unlocked: boolean }) {
  const cls = unlocked ? "text-emerald-400" : "text-neutral-700";
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
          className={`flex flex-col items-center rounded-xl bg-neutral-900 px-3 py-5 text-center ${
            badge.unlocked ? "border border-emerald-400/30" : "opacity-40"
          }`}
        >
          <BadgeIcon icon={badge.icon} unlocked={badge.unlocked} />
          <p className="mt-3 text-[11px] font-bold leading-tight text-white">
            {badge.label}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-neutral-500">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
}
