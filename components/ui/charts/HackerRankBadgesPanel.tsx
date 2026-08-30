import { Star, Code2, Database, Puzzle, FileCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  badgeType: string;
  name: string;
  shortName: string | null;
  stars: number;
  totalStars: number;
  solved: number;
  totalChallenges: number;
  url: string;
  practiceRank: number | null;
}

const ICONS: Record<string, LucideIcon> = {
  "problem-solving": Puzzle,
  cpp: Code2,
  c: FileCode,
  sql: Database,
};

function iconFor(badgeType: string): LucideIcon {
  return ICONS[badgeType] ?? Code2;
}

function hexGradient(stars: number) {
  if (stars >= 5) return "linear-gradient(160deg, #a1c4d9, #6f95ad)";
  if (stars >= 3) return "linear-gradient(160deg, #ffd39a, #f7973b)";
  return "linear-gradient(160deg, #ffb99a, #f5825a)";
}

export default function HackerRankBadgesPanel({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return <p className="text-sm text-muted-foreground">No badges earned yet.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge) => {
        const Icon = iconFor(badge.badgeType);
        return (
          <a
            key={badge.badgeType}
            href={badge.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5"
            title={`${badge.name}: ${badge.solved}/${badge.totalChallenges} solved`}
          >
            <div
              className="flex h-24 w-[104px] items-center justify-center text-slate-800 shadow-md"
              style={{
                background: hexGradient(badge.stars),
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="h-6 w-6" strokeWidth={2} />
                <span className="text-[11px] font-bold leading-none">
                  {badge.shortName ?? badge.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs font-semibold">{badge.name}</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: badge.stars }, (_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </span>
              {badge.practiceRank != null && (
                <span className="text-[10px] text-muted-foreground">
                  Rank #{badge.practiceRank.toLocaleString()}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
