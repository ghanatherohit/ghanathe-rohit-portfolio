"use client";

import { useState } from "react";

interface Day {
  date: string;
  count: number;
}

// Sequential single-hue ramp (primary), light -> dark, for magnitude encoding.
const LEVELS = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

function levelFor(count: number, max: number) {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export default function ContributionHeatmap({ days }: { days: Day[] }) {
  const [hovered, setHovered] = useState<Day | null>(null);

  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Contribution calendar unavailable right now.
      </p>
    );
  }

  const max = Math.max(...days.map((d) => d.count));

  // Group into weeks (columns), each 7 days, starting from the first entry.
  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                onMouseEnter={() => setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={`h-2.5 w-2.5 rounded-sm ${LEVELS[levelFor(day.count, max)]}`}
                title={`${day.count} contributions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {hovered
            ? `${hovered.count} contribution${hovered.count === 1 ? "" : "s"} · ${new Date(hovered.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            : "Hover a day for details"}
        </span>
        <span className="flex items-center gap-1">
          Less
          {LEVELS.map((level, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${level}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
