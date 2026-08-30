"use client";

import { useId, useState } from "react";

interface ContestPoint {
  rating: number;
  ranking: number;
  contestTitle: string;
  startTime: number;
}

function RatingTrend({ history }: { history: ContestPoint[] }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 320;
  const height = 120;
  const padX = 6;
  const padTop = 22;
  const padBottom = 18;

  const ratings = history.map((h) => h.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = max - min || 1;

  const points = history.map((h, i) => {
    const x = padX + (i / (history.length - 1)) * (width - padX * 2);
    const y =
      height - padBottom - ((h.rating - min) / range) * (height - padTop - padBottom);
    return { x, y, ...h };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padBottom} L ${points[0].x.toFixed(1)} ${height - padBottom} Z`;

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const first = points[0];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1={padX}
          y1={height - padBottom}
          x2={width - padX}
          y2={height - padBottom}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Starting-point label, mirroring LeetCode's own chart */}
        <circle cx={first.x} cy={first.y} r="3" fill="#f59e0b" />

        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill="#f59e0b"
          stroke="hsl(var(--card))"
          strokeWidth="2"
        />

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
              y1={padTop / 2}
              x2={hovered.x}
              y2={height - padBottom}
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
            />
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r="4"
              fill="#f59e0b"
              stroke="hsl(var(--card))"
              strokeWidth="2"
            />
          </>
        )}
      </svg>

      {hovered ? (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-border/60 bg-popover px-2.5 py-1.5 text-xs shadow-lg max-w-[160px]"
          style={{ left: `${Math.min(85, Math.max(15, (hovered.x / width) * 100))}%` }}
        >
          <p className="font-semibold whitespace-nowrap">{hovered.rating}</p>
          <p className="text-muted-foreground truncate">
            {hovered.contestTitle}
          </p>
        </div>
      ) : (
        <div
          className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-border/60 bg-popover px-2 py-1 text-[11px] font-semibold shadow-sm"
          style={{ left: `${(first.x / width) * 100}%`, top: first.y - 28 }}
        >
          {first.rating}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{new Date(history[0].startTime * 1000).getFullYear()}</span>
        <span>{new Date(history[history.length - 1].startTime * 1000).getFullYear()}</span>
      </div>
    </div>
  );
}

function RankingHistogram({ history }: { history: ContestPoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const bucketCount = 20;
  const rankings = history.map((h) => h.ranking);
  const min = Math.min(...rankings);
  const max = Math.max(...rankings);
  const range = max - min || 1;

  const buckets = Array.from({ length: bucketCount }, () => 0);
  history.forEach((h) => {
    const idx = Math.min(
      bucketCount - 1,
      Math.floor(((h.ranking - min) / range) * bucketCount)
    );
    buckets[idx] += 1;
  });

  const bestBucket = Math.min(
    bucketCount - 1,
    Math.floor(((history[history.length - 1].ranking - min) / range) * bucketCount)
  );

  const maxCount = Math.max(...buckets, 1);
  const height = 90;

  return (
    <div className="relative">
      <div className="flex items-end gap-[3px]" style={{ height }}>
        {buckets.map((count, i) => {
          const barHeight = count === 0 ? 2 : Math.max(4, (count / maxCount) * height);
          const isHighlighted = i === bestBucket;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-opacity cursor-pointer"
              style={{
                height: barHeight,
                backgroundColor: isHighlighted ? "#f59e0b" : "currentColor",
                opacity: isHighlighted
                  ? 1
                  : hoverIndex === i
                    ? 0.5
                    : 0.25,
              }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              title={`${count} contest${count === 1 ? "" : "s"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function LeetCodeContestPanel({
  history,
  globalRanking,
  totalParticipants,
  attended,
  topPercentage,
}: {
  history: ContestPoint[];
  globalRanking: number;
  totalParticipants: number | null;
  attended: number;
  topPercentage: number | null;
}) {
  if (history.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough contest history yet to plot a trend.
      </p>
    );
  }

  const latest = history[history.length - 1];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs">
          <div>
            <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
              Contest Rating
            </p>
            <p className="text-xl font-extrabold tabular-nums">{latest.rating}</p>
          </div>
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
              Global Ranking
            </p>
            <p className="text-sm font-bold tabular-nums truncate">
              {globalRanking.toLocaleString()}
              {totalParticipants != null && (
                <span className="font-normal text-muted-foreground">
                  /{totalParticipants.toLocaleString()}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
              Attended
            </p>
            <p className="text-sm font-bold tabular-nums">{attended}</p>
          </div>
        </div>
        <RatingTrend history={history} />
      </div>

      <div className="border-t border-border/50 pt-4">
        {topPercentage != null && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Top
            </p>
            <p className="mb-2 text-xl font-extrabold tabular-nums">{topPercentage.toFixed(2)}%</p>
          </>
        )}
        <RankingHistogram history={history} />
      </div>
    </div>
  );
}
