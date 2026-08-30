"use client";

import { useId, useState } from "react";

interface RatingPoint {
  contestName: string;
  rating: number;
  date: string;
}

export default function RatingChart({ history }: { history: RatingPoint[] }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (history.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough contest history yet to plot a trend.
      </p>
    );
  }

  const width = 480;
  const height = 160;
  const padX = 8;
  const padY = 16;

  const ratings = history.map((h) => h.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = max - min || 1;

  const points = history.map((h, i) => {
    const x = padX + (i / (history.length - 1)) * (width - padX * 2);
    const y =
      height - padY - ((h.rating - min) / range) * (height - padY * 2);
    return { x, y, ...h };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padY} L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Recessive baseline */}
        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* End marker */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--card))"
          strokeWidth="2"
        />

        {/* Hover targets */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - (width / history.length) / 2}
            y={0}
            width={width / history.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIndex(i)}
          />
        ))}

        {hovered && (
          <>
            <line
              x1={hovered.x}
              y1={padY / 2}
              x2={hovered.x}
              y2={height - padY}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r="4"
              fill="hsl(var(--primary))"
              stroke="hsl(var(--card))"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-border/60 bg-popover px-2.5 py-1.5 text-xs shadow-lg max-w-[160px]"
          style={{ left: `${Math.min(85, Math.max(15, (hovered.x / width) * 100))}%` }}
        >
          <p className="font-semibold whitespace-nowrap">{hovered.rating}</p>
          <p className="text-muted-foreground truncate">
            {hovered.contestName}
          </p>
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{new Date(history[0].date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        <span>{new Date(history[history.length - 1].date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}
