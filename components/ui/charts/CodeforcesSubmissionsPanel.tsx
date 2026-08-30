import { cn } from "@/lib/utils";

interface Submission {
  id: number;
  contestId: number | null;
  problemIndex: string;
  problemName: string;
  verdict: string;
  programmingLanguage: string;
  creationTimeSeconds: number;
}

function timeAgo(unixSeconds: number) {
  const diffMs = Date.now() - unixSeconds * 1000;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    return `${hours}h ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default function CodeforcesSubmissionsPanel({
  submissions,
}: {
  submissions: Submission[];
}) {
  if (submissions.length === 0) {
    return <p className="text-sm text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <div className="max-h-64 overflow-y-auto rounded-xl border border-border/50 divide-y divide-border/50">
      {submissions.map((sub) => (
        <a
          key={sub.id}
          href={
            sub.contestId
              ? `https://codeforces.com/contest/${sub.contestId}/submission/${sub.id}`
              : `https://codeforces.com/problemset/status`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="truncate font-medium">
              {sub.problemIndex}. {sub.problemName}
            </span>
            <span
              className={cn(
                "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                sub.verdict === "Accepted"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400"
              )}
            >
              {sub.verdict}
            </span>
          </span>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {timeAgo(sub.creationTimeSeconds)}
          </span>
        </a>
      ))}
    </div>
  );
}
