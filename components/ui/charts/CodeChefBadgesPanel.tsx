import { Award } from "lucide-react";

interface Badge {
  title: string;
  description: string;
}

export default function CodeChefBadgesPanel({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return <p className="text-sm text-muted-foreground">No badges earned yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/40 p-3"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Award className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">{badge.title}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
