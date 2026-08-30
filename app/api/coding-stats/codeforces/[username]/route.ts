import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

interface CfSubmission {
  id: number;
  creationTimeSeconds: number;
  verdict?: string;
  programmingLanguage: string;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
}

interface RecentSubmission {
  id: number;
  contestId: number | null;
  problemIndex: string;
  problemName: string;
  verdict: string;
  programmingLanguage: string;
  creationTimeSeconds: number;
}

interface CodeforcesStats {
  ok: true;
  rating: number;
  rank: string;
  maxRating: number;
  maxRank: string;
  problemsSolved: number;
  contestsAttended: number;
  ratingHistory: { contestName: string; rating: number; date: string }[];
  profileUrl: string;

  avatar: string | null;
  contribution: number;
  friendOfCount: number;
  registrationDate: string | null;
  lastOnlineDate: string | null;

  bestRank: number | null;

  tagBreakdown: { tag: string; count: number }[];
  difficultyBreakdown: { rating: number; count: number }[];
  languageBreakdown: { language: string; count: number }[];
  verdictBreakdown: { verdict: string; count: number }[];
  submissionCalendar: { date: string; count: number }[];
  recentSubmissions: RecentSubmission[];
}

const VERDICT_LABELS: Record<string, string> = {
  OK: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
  IDLENESS_LIMIT_EXCEEDED: "Idleness Limit Exceeded",
  SECURITY_VIOLATED: "Security Violated",
  CRASHED: "Crashed",
  INPUT_PREPARATION_CRASHED: "Input Preparation Crashed",
  CHALLENGED: "Hacked",
  SKIPPED: "Skipped",
  REJECTED: "Rejected",
  PARTIAL: "Partial",
  FAILED: "Failed",
  TESTING: "Testing",
  SUBMITTED: "Submitted",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const [infoRes, statusRes, ratingRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${username}`, {
        next: { revalidate },
      }),
      fetch(`https://codeforces.com/api/user.status?handle=${username}`, {
        next: { revalidate },
      }),
      fetch(`https://codeforces.com/api/user.rating?handle=${username}`, {
        next: { revalidate },
      }),
    ]);

    if (!infoRes.ok) {
      return NextResponse.json(
        { ok: false, error: "Codeforces user not found" },
        { status: 404 }
      );
    }

    const info = await infoRes.json();
    if (info.status !== "OK" || !info.result?.[0]) {
      return NextResponse.json(
        { ok: false, error: "Codeforces user not found" },
        { status: 404 }
      );
    }
    const user = info.result[0];

    let problemsSolved = 0;
    const tagCounts = new Map<string, number>();
    const difficultyCounts = new Map<number, number>();
    const languageCounts = new Map<string, number>();
    const verdictCounts = new Map<string, number>();
    const calendarCounts = new Map<string, number>();
    let recentSubmissions: RecentSubmission[] = [];

    if (statusRes.ok) {
      const status = await statusRes.json();
      if (status.status === "OK" && Array.isArray(status.result)) {
        const submissions = status.result as CfSubmission[];
        const solvedProblems = new Set<string>();

        // API returns submissions newest-first already.
        recentSubmissions = submissions.slice(0, 15).map((s) => ({
          id: s.id,
          contestId: s.problem.contestId ?? null,
          problemIndex: s.problem.index,
          problemName: s.problem.name,
          verdict: VERDICT_LABELS[s.verdict ?? "UNKNOWN"] ?? s.verdict ?? "Unknown",
          programmingLanguage: s.programmingLanguage ?? "Unknown",
          creationTimeSeconds: s.creationTimeSeconds,
        }));

        for (const submission of submissions) {
          const verdict = submission.verdict ?? "UNKNOWN";
          const verdictLabel = VERDICT_LABELS[verdict] ?? verdict;
          verdictCounts.set(verdictLabel, (verdictCounts.get(verdictLabel) ?? 0) + 1);

          const lang = submission.programmingLanguage ?? "Unknown";
          languageCounts.set(lang, (languageCounts.get(lang) ?? 0) + 1);

          const dateKey = new Date(submission.creationTimeSeconds * 1000)
            .toISOString()
            .slice(0, 10);
          calendarCounts.set(dateKey, (calendarCounts.get(dateKey) ?? 0) + 1);

          if (verdict === "OK") {
            const key = `${submission.problem.contestId ?? ""}-${submission.problem.index}`;
            if (!solvedProblems.has(key)) {
              solvedProblems.add(key);

              for (const tag of submission.problem.tags ?? []) {
                tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
              }

              if (submission.problem.rating != null) {
                difficultyCounts.set(
                  submission.problem.rating,
                  (difficultyCounts.get(submission.problem.rating) ?? 0) + 1
                );
              }
            }
          }
        }

        problemsSolved = solvedProblems.size;
      }
    }

    let ratingHistory: CodeforcesStats["ratingHistory"] = [];
    let contestsAttended = 0;
    let bestRank: number | null = null;
    if (ratingRes.ok) {
      const ratingJson = await ratingRes.json();
      if (ratingJson.status === "OK" && Array.isArray(ratingJson.result)) {
        contestsAttended = ratingJson.result.length;
        ratingHistory = ratingJson.result.map(
          (entry: {
            contestName: string;
            newRating: number;
            ratingUpdateTimeSeconds: number;
          }) => ({
            contestName: entry.contestName,
            rating: entry.newRating,
            date: new Date(
              entry.ratingUpdateTimeSeconds * 1000
            ).toISOString(),
          })
        );
        for (const entry of ratingJson.result as { rank: number }[]) {
          if (bestRank === null || entry.rank < bestRank) bestRank = entry.rank;
        }
      }
    }

    const tagBreakdown = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const difficultyBreakdown = Array.from(difficultyCounts.entries())
      .map(([rating, count]) => ({ rating, count }))
      .sort((a, b) => a.rating - b.rating);

    const languageBreakdown = Array.from(languageCounts.entries())
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const verdictBreakdown = Array.from(verdictCounts.entries())
      .map(([verdict, count]) => ({ verdict, count }))
      .sort((a, b) => b.count - a.count);

    const submissionCalendar = Array.from(calendarCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const stats: CodeforcesStats = {
      ok: true,
      rating: user.rating ?? 0,
      rank: user.rank ?? "unrated",
      maxRating: user.maxRating ?? 0,
      maxRank: user.maxRank ?? "unrated",
      problemsSolved,
      contestsAttended,
      ratingHistory,
      profileUrl: `https://codeforces.com/profile/${username}`,

      avatar: user.avatar && !user.avatar.includes("no-avatar") ? user.avatar : null,
      contribution: user.contribution ?? 0,
      friendOfCount: user.friendOfCount ?? 0,
      registrationDate: user.registrationTimeSeconds
        ? new Date(user.registrationTimeSeconds * 1000).toISOString()
        : null,
      lastOnlineDate: user.lastOnlineTimeSeconds
        ? new Date(user.lastOnlineTimeSeconds * 1000).toISOString()
        : null,

      bestRank,

      tagBreakdown,
      difficultyBreakdown,
      languageBreakdown,
      verdictBreakdown,
      submissionCalendar,
      recentSubmissions,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch Codeforces stats" },
      { status: 502 }
    );
  }
}
