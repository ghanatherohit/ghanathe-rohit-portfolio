import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Badge {
  id: string;
  displayName: string;
  icon: string;
}

export default function BadgesPanel({
  badges,
  mostRecentBadge,
  profileUrl,
}: {
  badges: Badge[];
  mostRecentBadge: Badge | null;
  profileUrl: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Badges
          </p>
          <p className="text-xl font-extrabold tabular-nums">{badges.length}</p>
        </div>
        <a
          href={`${profileUrl}badges`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="View all badges"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {badges.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/40 p-1.5"
                title={badge.displayName}
              >
                <Image
                  src={badge.icon}
                  alt={badge.displayName}
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>

          {mostRecentBadge && (
            <div className="mt-auto pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Most Recent Badge
              </p>
              <p className="text-sm font-bold leading-snug">{mostRecentBadge.displayName}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No badges earned yet.</p>
      )}
    </div>
  );
}
