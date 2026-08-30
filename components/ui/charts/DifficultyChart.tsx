interface DifficultyRow {
  label: string;
  solved: number;
  total: number;
  color: string;
}

export default function DifficultyChart({ rows }: { rows: DifficultyRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const pct = row.total > 0 ? Math.min(100, (row.solved / row.total) * 100) : 0;
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                {row.label}
              </span>
              <span className="text-muted-foreground">
                {row.solved.toLocaleString()} / {row.total.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
