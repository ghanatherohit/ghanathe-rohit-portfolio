"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface Day {
  date: string;
  count: number;
}

const DAY_LABEL_ROWS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

// Sequential ramps derived from each platform's brand color, empty->full.
// Every ramp's contrast against the #0b0f16 card surface is strictly increasing
// (verified: leetcode 1.5->9.5, codeforces 1.2->7.2, codechef 1.1->8.6,
// hackerrank 1.6->11.8, github 1.2->7.8) so "more activity" always reads as
// visually stronger, never flatter or lighter-but-weaker.
const COLOR_LEVELS: Record<string, string[]> = {
  leetcode: ["bg-white/10", "#472d06", "#99610d", "#e08e13", "#FFA116"],
  codeforces: ["bg-white/10", "#092739", "#13537a", "#4d93be", "#57a7d8"],
  codechef: ["bg-white/10", "#191410", "#372a22", "#9f9791", "#b5aca5"],
  hackerrank: ["bg-white/10", "#00421c", "#008c3c", "#00ce58", "#00EA64"],
  github: ["bg-white/10", "#1f2124", "#42474d", "#8e9298", "#a1a6ad"],
};

/** Local-calendar-day key (YYYY-MM-DD) — never use toISOString() here, it normalizes to UTC and shifts the date in any non-UTC timezone. */
function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parses a "YYYY-MM-DD" key as a local-midnight Date — `new Date("YYYY-MM-DD")` parses as UTC and shifts the calendar day when read back in local time. */
function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function levelFor(count: number, max: number) {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export default function ActivityHeatmapCalendar({
  days,
  color,
  label = "submissions",
  years: controlledYears,
  selectedYear: controlledSelectedYear,
  onYearChange,
  loading = false,
}: {
  days: Day[];
  /** Platform key selecting that platform's brand-derived sequential ramp (e.g. "leetcode", "codeforces"). */
  color: keyof typeof COLOR_LEVELS;
  label?: string;
  /** Pass these three together to drive year selection externally (e.g. when each year requires a server refetch). Omit for fully client-side year switching. */
  years?: number[];
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  /** Shows a loading state instead of the grid while a controlled year change is in flight. */
  loading?: boolean;
}) {
  const [hovered, setHovered] = useState<Day | null>(null);
  const LEVELS = COLOR_LEVELS[color];
  const isControlled = controlledYears != null && controlledSelectedYear != null && onYearChange != null;

  const countByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) map.set(d.date, d.count);
    return map;
  }, [days]);

  const inferredYears = useMemo(() => {
    const yearSet = new Set<number>();
    for (const d of days) yearSet.add(Number(d.date.slice(0, 4)));
    yearSet.add(new Date().getFullYear());
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [days]);

  const years = isControlled ? controlledYears : inferredYears;

  const [internalSelectedYear, setInternalSelectedYear] = useState(inferredYears[0]);
  const selectedYear = isControlled ? controlledSelectedYear : internalSelectedYear;
  const setSelectedYear = isControlled ? onYearChange : setInternalSelectedYear;

  const { weeks, monthLabels, totalForYear } = useMemo(() => {
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);
    const startPad = start.getDay();

    const cells: Day[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = dateKey(cursor);
      cells.push({ date: key, count: countByDate.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    const padded: (Day | null)[] = [...Array(startPad).fill(null), ...cells];

    const weekCount = Math.ceil(padded.length / 7);
    const grid: (Day | null)[][] = Array.from({ length: weekCount }, (_, w) =>
      padded.slice(w * 7, w * 7 + 7)
    );

    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const firstValid = week.find((d) => d !== null);
      if (!firstValid) return;
      const firstValidDate = parseDateKey(firstValid.date);
      const month = firstValidDate.getMonth();
      if (month !== lastMonth) {
        labels.push({
          weekIndex: wi,
          label: firstValidDate.toLocaleDateString("en-US", { month: "short" }),
        });
        lastMonth = month;
      }
    });

    const total = cells.reduce((acc, d) => acc + d.count, 0);

    return { weeks: grid, monthLabels: labels, totalForYear: total };
  }, [selectedYear, countByDate]);

  const max = Math.max(...days.map((d) => d.count), 1);
  const cellSize = 11;
  const cellGap = 3;
  const step = cellSize + cellGap;

  function cellStyle(level: number) {
    return level === 0 ? undefined : { backgroundColor: LEVELS[level] };
  }

  function swatchStyle(level: number) {
    return level === 0 ? undefined : { backgroundColor: LEVELS[level] };
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0f16] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="min-w-0 truncate text-sm text-white/90">
          {loading ? (
            "Loading…"
          ) : (
            <>
              <span className="font-bold">{totalForYear}</span> {label} in {selectedYear}
            </>
          )}
        </p>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="shrink-0 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white outline-none focus:border-primary/60"
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-[#0b0f16]">
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-white/10 p-3">
        <div className="relative">
          <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
            <div className="flex min-w-max">
              <div className="sticky left-0 z-10 flex flex-col gap-[3px] bg-[#0b0f16] pr-2 pt-[19px]">
                {Array.from({ length: 7 }, (_, row) => (
                  <span
                    key={row}
                    className="flex items-center text-[11px] text-white/40"
                    style={{ height: cellSize }}
                  >
                    {DAY_LABEL_ROWS[row] ?? ""}
                  </span>
                ))}
              </div>

              <div>
                <div className="relative mb-1" style={{ height: 16, width: weeks.length * step }}>
                  {monthLabels.map((m, i) => (
                    <span
                      key={i}
                      className="absolute text-[11px] text-white/40"
                      style={{ left: m.weekIndex * step }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) =>
                        day ? (
                          <div
                            key={di}
                            onMouseEnter={() => setHovered(day)}
                            onMouseLeave={() => setHovered(null)}
                            className={cn("rounded-sm", levelFor(day.count, max) === 0 && LEVELS[0])}
                            style={{ width: cellSize, height: cellSize, ...cellStyle(levelFor(day.count, max)) }}
                            title={`${day.count} ${label} on ${day.date}`}
                          />
                        ) : (
                          <div key={di} style={{ width: cellSize, height: cellSize }} />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-2 w-6"
            style={{ background: "linear-gradient(to right, transparent, #0b0f16)" }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-white/40">
          <span className="min-w-0 truncate">
            {hovered &&
              `${hovered.count} on ${parseDateKey(hovered.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </span>
          <span className="flex flex-shrink-0 items-center gap-1">
            Less
            {LEVELS.map((_, i) => (
              <span
                key={i}
                className={cn("h-2.5 w-2.5 rounded-sm", i === 0 && LEVELS[0])}
                style={swatchStyle(i)}
              />
            ))}
            More
          </span>
        </div>
      </div>
    </div>
  );
}
