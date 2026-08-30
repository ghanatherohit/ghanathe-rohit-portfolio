import { NextResponse } from "next/server";

// Set GITHUB_TOKEN in .env.local (a fine-grained PAT with public-repo read
// access) to raise the rate limit from 60/hr to 5,000/hr and get exact
// contribution counts via GraphQL. Without a token the calendar still works,
// falling back to scraping GitHub's own profile HTML (day-level intensity +
// counts parsed from tooltip text) — more fragile, but needs no auth.
export const revalidate = 21600; // 6 hours

interface ContributionDay {
  date: string;
  count: number;
}

interface GitHubStats {
  ok: true;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalContributions: number | null;
  contributionCalendar: ContributionDay[];
  contributionYears: number[];
  profileUrl: string;
}

const CALENDAR_QUERY = `
  query userContributions($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

function yearRange(year: number) {
  return {
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
  };
}

const SCRAPE_HEADERS: HeadersInit = {
  "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
  "X-Requested-With": "XMLHttpRequest",
};

/**
 * Fallback when no GITHUB_TOKEN is set: scrape the day cells + their tooltip
 * text out of GitHub's own profile-page contribution graph HTML. Each day is
 * `<td ... data-date="YYYY-MM-DD" ...>` immediately followed by a
 * `<tool-tip ...>N contribution(s) on Month Day.</tool-tip>` (or "No
 * contributions on ..."). Best-effort — if GitHub changes this markup, the
 * calendar just comes back empty and the rest of the stats still work.
 */
function parseCalendarHtml(html: string): ContributionDay[] {
  const dayBlockRe =
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*class="ContributionCalendar-day">\s*<\/td>\s*(?:<tool-tip[^>]*>([^<]*)<\/tool-tip>)?/g;

  const days: ContributionDay[] = [];
  let match: RegExpExecArray | null;
  while ((match = dayBlockRe.exec(html)) !== null) {
    const [, date, tooltipText] = match;
    const countMatch = tooltipText?.match(/^(\d+)\s+contribution/);
    days.push({ date, count: countMatch ? Number(countMatch[1]) : 0 });
  }

  // GitHub's grid markup is one <tr> per weekday (Sun, Mon, ... Sat), so cells
  // come out of the DOM grouped by weekday, not in chronological order — sort
  // them here so the client can safely assume days[i] is one day after days[i-1].
  days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return days;
}

function parseAvailableYears(html: string): number[] {
  const years = new Set<number>();
  for (const m of html.matchAll(/year-link-(\d{4})/g)) {
    years.add(Number(m[1]));
  }
  return Array.from(years).sort((a, b) => b - a);
}

async function fetchCalendarViaScrape(
  username: string,
  year?: number
): Promise<{ days: ContributionDay[]; total: number | null; years: number[] }> {
  const url = year
    ? `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`
    : `https://github.com/${username}?action=show&controller=profiles&tab=contributions&user_id=${username}`;

  const res = await fetch(url, { headers: SCRAPE_HEADERS, next: { revalidate } });
  if (!res.ok) return { days: [], total: null, years: [] };

  const html = await res.text();
  const days = parseCalendarHtml(html);
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const years = parseAvailableYears(html);

  return { days, total: days.length > 0 ? total : null, years };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const token = process.env.GITHUB_TOKEN;
  const requestedYear = new URL(request.url).searchParams.get("year");

  const restHeaders: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) {
    restHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: restHeaders,
        next: { revalidate },
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
        { headers: restHeaders, next: { revalidate } }
      ),
    ]);

    if (!userRes.ok) {
      return NextResponse.json(
        { ok: false, error: "GitHub user not found" },
        { status: 404 }
      );
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, repo: { stargazers_count?: number }) =>
            sum + (repo.stargazers_count ?? 0),
          0
        )
      : 0;

    let totalContributions: number | null = null;
    let contributionCalendar: ContributionDay[] = [];
    let contributionYears: number[] = [];

    const currentYear = new Date().getFullYear();
    const targetYear = requestedYear ? Number(requestedYear) : undefined;

    if (token) {
      const accountCreatedYear = user.created_at
        ? new Date(user.created_at).getFullYear()
        : currentYear;
      contributionYears = Array.from(
        { length: currentYear - accountCreatedYear + 1 },
        (_, i) => currentYear - i
      );

      const graphqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: CALENDAR_QUERY,
          variables: { username, ...yearRange(targetYear ?? currentYear) },
        }),
        next: { revalidate },
      });

      if (graphqlRes.ok) {
        const graphqlJson = await graphqlRes.json();
        const calendar =
          graphqlJson?.data?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          totalContributions = calendar.totalContributions ?? 0;
          contributionCalendar = calendar.weeks.flatMap(
            (week: { contributionDays: { date: string; contributionCount: number }[] }) =>
              week.contributionDays.map((day) => ({
                date: day.date,
                count: day.contributionCount,
              }))
          );
        }
      }
    }

    // No token, or GraphQL came back empty — fall back to scraping the profile HTML.
    if (contributionCalendar.length === 0) {
      const scraped = await fetchCalendarViaScrape(username, targetYear);
      contributionCalendar = scraped.days;
      totalContributions = scraped.total;
      if (contributionYears.length === 0) contributionYears = scraped.years;
    }

    const stats: GitHubStats = {
      ok: true,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      totalContributions,
      contributionCalendar,
      contributionYears,
      profileUrl: user.html_url ?? `https://github.com/${username}`,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch GitHub stats" },
      { status: 502 }
    );
  }
}
