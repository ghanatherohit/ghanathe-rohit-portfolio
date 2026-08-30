interface BarRow {
  label: string;
  count: number;
  color?: string;
}

export default function HorizontalBarList({
  rows,
  color = "hsl(var(--primary))",
}: {
  rows: BarRow[];
  color?: string;
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="space-y-2.5">
      {rows.map((row) => {
        const pct = (row.count / max) * 100;
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="truncate font-medium pr-2">{row.label}</span>
              <span className="flex-shrink-0 text-muted-foreground tabular-nums">
                {row.count}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: row.color ?? color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
