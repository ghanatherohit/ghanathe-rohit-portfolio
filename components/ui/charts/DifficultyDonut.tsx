"use client";

import { useId, useState } from "react";

interface DifficultySlice {
  label: string;
  count: number;
  color: string;
}

export default function DifficultyDonut({
  slices,
  total,
}: {
  slices: DifficultySlice[];
  total: number;
}) {
  const clipId = useId();
  const [hovered, setHovered] = useState<DifficultySlice | null>(null);

  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices
    .filter((s) => s.count > 0)
    .map((slice) => {
      const fraction = total > 0 ? slice.count / total : 0;
      const dash = fraction * circumference;
      const segment = { ...slice, dash, offset };
      offset += dash;
      return segment;
    });

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <clipPath id={clipId}>
              <circle cx={size / 2} cy={size / 2} r={radius} />
            </clipPath>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-muted"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
              onMouseEnter={() => setHovered(seg)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer transition-opacity"
              style={{ opacity: hovered && hovered.label !== seg.label ? 0.4 : 1 }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tabular-nums">
            {hovered ? hovered.count : total}
          </span>
          <span className="text-[10px] text-muted-foreground text-center leading-tight px-4">
            {hovered ? hovered.label : "Problems Solved"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {slices.map((slice) => (
          <div
            key={slice.label}
            className="flex items-center gap-2 text-xs cursor-pointer"
            onMouseEnter={() => setHovered(slice)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-muted-foreground">{slice.label}</span>
            <span className="font-semibold tabular-nums">({slice.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
