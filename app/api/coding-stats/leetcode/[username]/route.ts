import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

interface ContestHistoryPoint {
  attended: boolean;
  rating: number;
  ranking: number;
  contestTitle: string;
  startTime: number;
  problemsSolved: number;
  totalProblems: number;
}

interface LeetCodeBadge {
  id: string;
  displayName: string;
  icon: string;
  creationDate: string;
}

interface UpcomingBadge {
  name: string;
  icon: string;
}

interface DifficultyAcceptance {
  difficulty: string;
  solved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

interface BeatsPercentage {
  difficulty: string;
  percentage: number;
}

interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
}

interface LanguageStat {
  language: string;
  solved: number;
}

interface TagStat {
  tag: string;
  solved: number;
}

interface LeetCodeStats {
  ok: true;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  ranking: number;
  contestRating: number | null;
  contestsAttended: number;
  topPercentage: number | null;
  contestGlobalRanking: number | null;
  contestTotalParticipants: number | null;
  contestBadgeName: string | null;
  contestHistory: ContestHistoryPoint[];
  badges: LeetCodeBadge[];
  mostRecentBadge: LeetCodeBadge | null;
  upcomingBadges: UpcomingBadge[];
  submissionCalendar: { date: string; count: number }[];
  totalActiveDays: number;
  maxStreak: number;
  recentSubmissions: RecentSubmission[];
  languageBreakdown: LanguageStat[];
  tagBreakdown: TagStat[];
  acceptanceByDifficulty: DifficultyAcceptance[];
  beatsPercentage: BeatsPercentage[];
  totalBeatsPercentage: number | null;
  profileUrl: string;
}

const QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
        creationDate
      }
      upcomingBadges {
        name
        icon
      }
      userCalendar {
        activeYears
        streak
        totalActiveDays
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
      tagProblemCounts {
        advanced {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
        fundamental {
          tagName
          problemsSolved
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
    userContestRanking(username: $username) {
      rating
      attendedContestsCount
      topPercentage
      globalRanking
      totalParticipants
      badge {
        name
      }
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      problemsSolved
      totalProblems
      contest {
        title
        startTime
      }
    }
    recentAcSubmissionList(username: $username, limit: 10) {
      title
      titleSlug
      timestamp
    }
    userProfileUserQuestionProgressV2(userSlug: $username) {
      userSessionBeatsPercentage {
        difficulty
        percentage
      }
      totalQuestionBeatsPercentage
    }
  }
`;

const CALENDAR_QUERY = `
  query userProfileCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        submissionCalendar
      }
    }
  }
`;

async function fetchCalendarForYear(username: string, year: number): Promise<string | null> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({ query: CALENDAR_QUERY, variables: { username, year } }),
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.matchedUser?.userCalendar?.submissionCalendar ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      next: { revalidate },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "LeetCode request failed" },
        { status: 502 }
      );
    }

    const json = await res.json();
    const user = json?.data?.matchedUser;
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "LeetCode user not found" },
        { status: 404 }
      );
    }

    const counts: Record<string, number> = {};
    for (const entry of user.submitStatsGlobal?.acSubmissionNum ?? []) {
      counts[entry.difficulty] = entry.count;
    }

    const totals: Record<string, number> = {};
    for (const entry of json?.data?.allQuestionsCount ?? []) {
      totals[entry.difficulty] = entry.count;
    }

    const contest = json?.data?.userContestRanking;

    const contestHistory: ContestHistoryPoint[] = (json?.data?.userContestRankingHistory ?? [])
      .filter((entry: { attended: boolean }) => entry.attended)
      .map(
        (entry: {
          attended: boolean;
          rating: number;
          ranking: number;
          problemsSolved: number;
          totalProblems: number;
          contest: { title: string; startTime: number };
        }) => ({
          attended: entry.attended,
          rating: Math.round(entry.rating),
          ranking: entry.ranking,
          contestTitle: entry.contest?.title ?? "",
          startTime: entry.contest?.startTime ?? 0,
          problemsSolved: entry.problemsSolved ?? 0,
          totalProblems: entry.totalProblems ?? 0,
        })
      );

    const badges: LeetCodeBadge[] = (user.badges ?? []).map(
      (b: LeetCodeBadge) => ({
        id: b.id,
        displayName: b.displayName,
        icon: b.icon,
        creationDate: b.creationDate,
      })
    );
    const mostRecentBadge =
      badges.length > 0
        ? [...badges].sort(
            (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
          )[0]
        : null;

    const upcomingBadges: UpcomingBadge[] = (user.upcomingBadges ?? []).map(
      (b: { name: string; icon: string }) => ({
        name: b.name,
        icon: b.icon.startsWith("http") ? b.icon : `https://leetcode.com${b.icon}`,
      })
    );

    // submissionCalendar without a year arg only covers the current year, so
    // fetch every active year in parallel and merge for a complete history.
    const activeYears: number[] = user.userCalendar?.activeYears ?? [new Date().getFullYear()];
    const yearCalendars = await Promise.all(
      activeYears.map((year: number) => fetchCalendarForYear(username, year))
    );

    let submissionCalendar: { date: string; count: number }[] = [];
    try {
      const merged: Record<string, number> = {};
      for (const raw of yearCalendars) {
        if (!raw) continue;
        const parsed = JSON.parse(raw) as Record<string, number>;
        Object.assign(merged, parsed);
      }
      submissionCalendar = Object.entries(merged)
        .map(([ts, count]) => ({
          date: new Date(Number(ts) * 1000).toISOString().slice(0, 10),
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch {
      submissionCalendar = [];
    }

    const recentSubmissions: RecentSubmission[] = (json?.data?.recentAcSubmissionList ?? []).map(
      (s: { title: string; titleSlug: string; timestamp: string }) => ({
        title: s.title,
        titleSlug: s.titleSlug,
        timestamp: Number(s.timestamp),
      })
    );

    const languageBreakdown: LanguageStat[] = (user.languageProblemCount ?? [])
      .map((l: { languageName: string; problemsSolved: number }) => ({
        language: l.languageName,
        solved: l.problemsSolved,
      }))
      .sort((a: LanguageStat, b: LanguageStat) => b.solved - a.solved);

    const tagTiers = user.tagProblemCounts ?? {};
    const tagBreakdown: TagStat[] = ([
      ...(tagTiers.advanced ?? []),
      ...(tagTiers.intermediate ?? []),
      ...(tagTiers.fundamental ?? []),
    ] as { tagName: string; problemsSolved: number }[])
      .map((t) => ({ tag: t.tagName, solved: t.problemsSolved }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 10);

    const acSubmissions: Record<string, { count: number; submissions: number }> = {};
    for (const entry of user.submitStats?.acSubmissionNum ?? []) {
      acSubmissions[entry.difficulty] = { count: entry.count, submissions: entry.submissions };
    }
    const totalSubmissions: Record<string, { count: number; submissions: number }> = {};
    for (const entry of user.submitStats?.totalSubmissionNum ?? []) {
      totalSubmissions[entry.difficulty] = { count: entry.count, submissions: entry.submissions };
    }
    const acceptanceByDifficulty: DifficultyAcceptance[] = ["Easy", "Medium", "Hard"]
      .filter((d) => totalSubmissions[d])
      .map((d) => ({
        difficulty: d,
        solved: acSubmissions[d]?.count ?? 0,
        totalSubmissions: totalSubmissions[d]?.submissions ?? 0,
        acceptedSubmissions: acSubmissions[d]?.submissions ?? 0,
      }));

    const progress = json?.data?.userProfileUserQuestionProgressV2;
    const beatsPercentage: BeatsPercentage[] = (progress?.userSessionBeatsPercentage ?? []).map(
      (b: { difficulty: string; percentage: number }) => ({
        difficulty: b.difficulty,
        percentage: b.percentage,
      })
    );

    const stats: LeetCodeStats = {
      ok: true,
      totalSolved: counts.All ?? 0,
      totalQuestions: totals.All ?? 0,
      easySolved: counts.Easy ?? 0,
      easyTotal: totals.Easy ?? 0,
      mediumSolved: counts.Medium ?? 0,
      mediumTotal: totals.Medium ?? 0,
      hardSolved: counts.Hard ?? 0,
      hardTotal: totals.Hard ?? 0,
      ranking: user.profile?.ranking ?? 0,
      contestRating: contest?.rating ? Math.round(contest.rating) : null,
      contestsAttended: contest?.attendedContestsCount ?? 0,
      topPercentage: contest?.topPercentage ?? null,
      contestGlobalRanking: contest?.globalRanking ?? null,
      contestTotalParticipants: contest?.totalParticipants ?? null,
      contestBadgeName: contest?.badge?.name ?? null,
      contestHistory,
      badges,
      mostRecentBadge,
      upcomingBadges,
      submissionCalendar,
      totalActiveDays: user.userCalendar?.totalActiveDays ?? 0,
      maxStreak: user.userCalendar?.streak ?? 0,
      recentSubmissions,
      languageBreakdown,
      tagBreakdown,
      acceptanceByDifficulty,
      beatsPercentage,
      totalBeatsPercentage: progress?.totalQuestionBeatsPercentage ?? null,
      profileUrl: `https://leetcode.com/${username}/`,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch LeetCode stats" },
      { status: 502 }
    );
  }
}
