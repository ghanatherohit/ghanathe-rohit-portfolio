"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface Day {
  date: string;
  count: number;
}

type Mode = "year" | "month";

function niceMax(value: number) {
  if (value <= 4) return 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const steps = [1, 2, 4, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return value;
}

function MonthLineChart({ points }: { points: { label: string; value: number }[] }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 720;
  const height = 220;
  const padX = 28;
  const padTop = 16;
  const padBottom = 28;
  const maxVal = niceMax(Math.max(...points.map((p) => p.value), 1));

  const coords = points.map((p, i) => {
    const x =
      points.length > 1
        ? padX + (i / (points.length - 1)) * (width - padX * 2)
        : width / 2;
    const y = height - padBottom - (p.value / maxVal) * (height - padTop - padBottom);
    return { x, y, ...p };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padBottom} L ${coords[0].x.toFixed(1)} ${height - padBottom} Z`
      : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: height - padBottom - f * (height - padTop - padBottom),
    value: Math.round(maxVal * f),
  }));

  const hovered = hoverIndex !== null ? coords[hoverIndex] : null;
  const labelStride = Math.max(1, Math.ceil(points.length / 8));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={padX}
              y1={g.y}
              x2={width - padX}
              y2={g.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            <text x={0} y={g.y + 4} fontSize="11" fill="rgba(255,255,255,0.4)">
              {g.value}
            </text>
          </g>
        ))}

        {coords.length > 0 && (
          <>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </>
        )}

        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="3" fill="#f97316" />
        ))}

        {coords.map((c, i) => (
          <rect
            key={`hit-${i}`}
            x={c.x - width / points.length / 2}
            y={0}
            width={width / points.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIndex(i)}
          />
        ))}

        {hovered && (
          <line
            x1={hovered.x}
            y1={padTop}
            x2={hovered.x}
            y2={height - padBottom}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        )}

        {coords.map((c, i) =>
          i % labelStride === 0 ? (
            <text
              key={`label-${i}`}
              x={c.x}
              y={height - 6}
              fontSize="11"
              fill="rgba(255,255,255,0.4)"
              textAnchor="middle"
            >
              {c.label}
            </text>
          ) : null
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 px-2.5 py-1.5 text-xs shadow-lg text-white"
          style={{ left: `${(hovered.x / width) * 100}%` }}
        >
          <p className="font-semibold">{hovered.value} solved</p>
          <p className="text-white/50">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}

export default function SubmissionTrendChart({ days }: { days: Day[] }) {
  const { years, monthsByYear } = useMemo(() => {
    const yearSet = new Set<string>();
    const monthMap = new Map<string, Set<string>>();
    for (const d of days) {
      const [y, m] = d.date.split("-");
      yearSet.add(y);
      if (!monthMap.has(y)) monthMap.set(y, new Set());
      monthMap.get(y)!.add(m);
    }
    const now = new Date();
    const curY = String(now.getFullYear());
    const curM = String(now.getMonth() + 1).padStart(2, "0");
    yearSet.add(curY);
    if (!monthMap.has(curY)) monthMap.set(curY, new Set());
    monthMap.get(curY)!.add(curM);

    return {
      years: Array.from(yearSet).sort(),
      monthsByYear: monthMap,
    };
  }, [days]);

  const [mode, setMode] = useState<Mode>("month");
  const [selectedYear, setSelectedYear] = useState(years[years.length - 1]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const monthsForYear = Array.from(monthsByYear.get(selectedYear) ?? []).sort();
    return monthsForYear[monthsForYear.length - 1] ?? "01";
  });

  const countByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) map.set(d.date, d.count);
    return map;
  }, [days]);

  const monthOptions = Array.from(monthsByYear.get(selectedYear) ?? ["01"]).sort();

  const monthPoints = useMemo(() => {
    const year = Number(selectedYear);
    const month = Number(selectedMonth) - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateKey = `${selectedYear}-${selectedMonth}-${String(day).padStart(2, "0")}`;
      return { label: String(day).padStart(2, "0"), value: countByDate.get(dateKey) ?? 0 };
    });
  }, [selectedYear, selectedMonth, countByDate]);

  const monthTotal = monthPoints.reduce((acc, p) => acc + p.value, 0);

  const yearPoints = useMemo(() => {
    const monthTotals = new Map<string, number>();
    for (const d of days) {
      const [y, m] = d.date.split("-");
      if (y !== selectedYear) continue;
      monthTotals.set(m, (monthTotals.get(m) ?? 0) + d.count);
    }
    return Array.from({ length: 12 }, (_, i) => {
      const m = String(i + 1).padStart(2, "0");
      const label = new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" });
      return { label, value: monthTotals.get(m) ?? 0 };
    });
  }, [days, selectedYear]);

  const yearTotal = yearPoints.reduce((acc, p) => acc + p.value, 0);

  const headline =
    mode === "month"
      ? `Monthly Problem Solved: (${monthTotal})`
      : `Yearly Problem Solved: (${yearTotal})`;

  return (
    <div className="rounded-xl border border-border/50 bg-[#0b0f16] p-4 sm:p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setMode("year")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
              mode === "year" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
            )}
          >
            Year
          </button>
          <button
            type="button"
            onClick={() => setMode("month")}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
              mode === "month" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
            )}
          >
            Month
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => {
              const y = e.target.value;
              setSelectedYear(y);
              const monthsForYear = Array.from(monthsByYear.get(y) ?? []).sort();
              setSelectedMonth(monthsForYear[monthsForYear.length - 1] ?? "01");
            }}
            className="bg-white/5 border border-white/15 text-white text-xs rounded-md px-2.5 py-1.5 outline-none focus:border-primary/60"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-[#0b0f16]">
                {y}
              </option>
            ))}
          </select>

          {mode === "month" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/5 border border-white/15 text-white text-xs rounded-md px-2.5 py-1.5 outline-none focus:border-primary/60"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m} className="bg-[#0b0f16]">
                  {new Date(2000, Number(m) - 1, 1).toLocaleDateString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <p className="text-center text-sm font-bold text-white mb-3">{headline}</p>

      <MonthLineChart points={mode === "month" ? monthPoints : yearPoints} />
    </div>
  );
}
