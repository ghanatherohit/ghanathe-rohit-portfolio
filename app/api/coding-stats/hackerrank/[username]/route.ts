import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

interface HackerRankBadge {
  badgeType: string;
  name: string;
  shortName: string | null;
  category: string | null;
  stars: number;
  totalStars: number;
  solved: number;
  totalChallenges: number;
  url: string;
  practiceRank: number | null;
}

interface HackerRankStats {
  ok: true;
  totalBadges: number;
  totalStars: number;
  totalSolved: number;
  badges: HackerRankBadge[];
  skills: string[];
  submissionCalendar: { date: string; count: number }[];
  profileUrl: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const profileUrl = `https://www.hackerrank.com/profile/${username}`;

  try {
    const headers = { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" };
    const encodedUsername = encodeURIComponent(username);

    const [res, scoresRes, skillsRes, submissionHistoryRes] = await Promise.all([
      fetch(`https://www.hackerrank.com/rest/hackers/${encodedUsername}/badges`, {
        headers,
        next: { revalidate },
      }),
      fetch(`https://www.hackerrank.com/rest/hackers/${encodedUsername}/scores_elo`, {
        headers,
        next: { revalidate },
      }),
      fetch(`https://www.hackerrank.com/rest/hackers/${encodedUsername}/skills`, {
        headers,
        next: { revalidate },
      }),
      fetch(`https://www.hackerrank.com/rest/hackers/${encodedUsername}/submission_histories`, {
        headers,
        next: { revalidate },
      }),
    ]);

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "HackerRank profile not found" },
        { status: 404 }
      );
    }

    const json = await res.json();
    if (json?.status !== true || !Array.isArray(json.models)) {
      return NextResponse.json(
        { ok: false, error: "Could not parse HackerRank badges" },
        { status: 502 }
      );
    }

    const rankBySlug = new Map<string, number>();
    if (scoresRes.ok) {
      try {
        const scoresJson = (await scoresRes.json()) as {
          slug: string;
          practice?: { rank?: number };
        }[];
        if (Array.isArray(scoresJson)) {
          for (const track of scoresJson) {
            if (typeof track.practice?.rank === "number") {
              rankBySlug.set(track.slug, track.practice.rank);
            }
          }
        }
      } catch {
        // Rank enrichment is best-effort — badges above still return.
      }
    }

    const badges: HackerRankBadge[] = (
      json.models as {
        badge_type: string;
        badge_name: string;
        badge_short_name: string | null;
        category_name: string | null;
        stars: number;
        total_stars: number;
        solved: number;
        total_challenges: number;
        url: string;
      }[]
    )
      .filter((b) => b.stars > 0)
      .map((b) => {
        const slug = b.url.replace(/^\/domains\//, "");
        return {
          badgeType: b.badge_type,
          name: b.badge_name,
          shortName: b.badge_short_name,
          category: b.category_name,
          stars: b.stars,
          totalStars: b.total_stars,
          solved: b.solved,
          totalChallenges: b.total_challenges,
          url: `https://www.hackerrank.com${b.url}`,
          practiceRank: rankBySlug.get(slug) ?? null,
        };
      })
      .sort((a, b) => b.stars - a.stars);

    const totalSolved = badges.reduce((acc, b) => acc + b.solved, 0);
    const totalStars = badges.reduce((acc, b) => acc + b.stars, 0);

    let skills: string[] = [];
    if (skillsRes.ok) {
      try {
        const skillsJson = await skillsRes.json();
        if (Array.isArray(skillsJson)) skills = skillsJson;
      } catch {
        // Skills enrichment is best-effort — badges above still return.
      }
    }

    let submissionCalendar: { date: string; count: number }[] = [];
    if (submissionHistoryRes.ok) {
      try {
        const historyJson = (await submissionHistoryRes.json()) as Record<string, number>;
        submissionCalendar = Object.entries(historyJson)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
      } catch {
        // Calendar enrichment is best-effort — badges above still return.
      }
    }

    const stats: HackerRankStats = {
      ok: true,
      totalBadges: badges.length,
      totalStars,
      totalSolved,
      badges,
      skills,
      submissionCalendar,
      profileUrl,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch HackerRank stats" },
      { status: 502 }
    );
  }
}
