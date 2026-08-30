import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

interface CodeChefSubmission {
  problemCode: string;
  problemUrl: string;
  result: string;
  accepted: boolean;
  language: string;
  submittedAt: string;
}

interface CodeChefRatingPoint {
  contestName: string;
  rating: number;
  rank: number | null;
  date: string;
}

interface CodeChefBadge {
  title: string;
  description: string;
}

interface CodeChefStats {
  ok: true;
  rating: number;
  highestRating: number;
  stars: number;
  division: number | null;
  globalRank: number | null;
  countryRank: number | null;
  country: string | null;
  institution: string | null;
  studentStatus: string | null;
  contestsAttended: number;
  totalProblemsSolved: number;
  ratingHistory: CodeChefRatingPoint[];
  badges: CodeChefBadge[];
  submissions: CodeChefSubmission[];
  submissionCalendar: { date: string; count: number }[];
  profileUrl: string;
}

function parseSubmissions(html: string): CodeChefSubmission[] {
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  const submissions: CodeChefSubmission[] = [];

  for (const row of rows) {
    const timeMatch = row.match(/<td\s+title='([^']*)'>/);
    const problemMatch = row.match(
      /<a href='(\/[^']+\/problems\/[^']+)'[^>]*>([^<]+)<\/a>/
    );
    const resultMatch = row.match(/<span title='([^']*)'/);
    // Language is the 4th <td> cell's title attribute.
    const cellTitles = [...row.matchAll(/<td[^>]*\btitle='([^']*)'/g)].map((m) => m[1]);

    if (!timeMatch || !problemMatch || !resultMatch) continue;

    const result = resultMatch[1];
    submissions.push({
      problemCode: problemMatch[2],
      problemUrl: `https://www.codechef.com${problemMatch[1]}`,
      result,
      accepted: result.toLowerCase() === "accepted",
      language: cellTitles[3] ?? "",
      submittedAt: timeMatch[1],
    });
  }

  return submissions;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseRatingHistory(html: string): CodeChefRatingPoint[] {
  const match = html.match(/var all_rating = (\[.*?\]);/);
  if (!match) return [];

  try {
    const raw = JSON.parse(match[1]) as {
      name: string;
      rating: string;
      rank: string;
      end_date: string;
    }[];

    return raw.map((entry) => ({
      contestName: decodeHtmlEntities(entry.name),
      rating: parseInt(entry.rating, 10),
      rank: entry.rank ? parseInt(entry.rank, 10) : null,
      date: entry.end_date.replace(" ", "T"),
    }));
  } catch {
    return [];
  }
}

function parseSubmissionCalendar(html: string): { date: string; count: number }[] {
  const match = html.match(/var userDailySubmissionsStats = (\[.*?\]);/);
  if (!match) return [];

  try {
    const raw = JSON.parse(match[1]) as { date: string; value: number }[];
    return raw.map((entry) => {
      const [y, m, d] = entry.date.split("-");
      return {
        date: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`,
        count: entry.value,
      };
    });
  } catch {
    return [];
  }
}

function parseBadges(html: string): CodeChefBadge[] {
  const matches = [
    ...html.matchAll(
      /<p class='badge__title'>([^<]+)<\/p>\s*<p class='badge__description'>([\s\S]*?)<\/p>/g
    ),
  ];
  return matches.map((m) => ({
    title: decodeHtmlEntities(m[1].trim()),
    description: decodeHtmlEntities(m[2].replace(/<[^>]+>/g, "").trim()),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const profileUrl = `https://www.codechef.com/users/${username}`;

  try {
    const headers = { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" };

    const [profileRes, submissionsRes] = await Promise.all([
      fetch(profileUrl, { headers, next: { revalidate } }),
      fetch(
        `https://www.codechef.com/recent/user?page=0&user_handle=${encodeURIComponent(username)}`,
        {
          headers: { ...headers, Referer: profileUrl },
          next: { revalidate },
        }
      ),
    ]);

    if (!profileRes.ok) {
      return NextResponse.json(
        { ok: false, error: "CodeChef profile not found" },
        { status: 404 }
      );
    }

    const html = await profileRes.text();

    const ratingMatch = html.match(/<div class="rating-number">\s*([\d]+)/);
    const starsMatch = html.match(/class='rating'\s*\n\s*style='[^']*'>(\d+)&#9733;/);
    const divisionMatch = html.match(
      /rating-number">\s*[\d]+\s*<\/div>\s*<div>\(Div (\d)\)<\/div>/
    );
    const highestRatingMatch = html.match(/Highest Rating (\d+)/);
    const globalRankMatch = html.match(
      /ratings\/all">\s*<strong>\s*(\d+)\s*<\/strong>\s*<\/a>\s*Global Rank/
    );
    const countryRankMatch = html.match(
      /filterBy=Country[^"]*">\s*<strong>\s*(\d+)\s*<\/strong>\s*<\/a>\s*Country Rank/
    );
    const countryNameMatch = html.match(/user-country-name[^>]*>([^<]+)</);
    const institutionMatch = html.match(/Institution:<\/label><span>([^<]+)<\/span>/);
    const studentStatusMatch = html.match(
      /Student\/Professional:<\/label><span>([^<]+)<\/span>/
    );
    const contestCountMatch = html.match(
      /No\. of Contests Participated: <b>(\d+)<\/b>/
    );
    const totalSolvedMatch = html.match(/Total Problems Solved:\s*(\d+)/);

    if (!ratingMatch) {
      return NextResponse.json(
        { ok: false, error: "Could not parse CodeChef profile" },
        { status: 502 }
      );
    }

    let submissions: CodeChefSubmission[] = [];
    if (submissionsRes.ok) {
      try {
        const data = await submissionsRes.json();
        if (typeof data?.content === "string") {
          submissions = parseSubmissions(data.content).slice(0, 20);
        }
      } catch {
        // Recent-submissions parsing is best-effort — profile stats above still return.
      }
    }

    const stats: CodeChefStats = {
      ok: true,
      rating: parseInt(ratingMatch[1], 10),
      highestRating: highestRatingMatch
        ? parseInt(highestRatingMatch[1], 10)
        : parseInt(ratingMatch[1], 10),
      stars: starsMatch ? parseInt(starsMatch[1], 10) : 0,
      division: divisionMatch ? parseInt(divisionMatch[1], 10) : null,
      globalRank: globalRankMatch ? parseInt(globalRankMatch[1], 10) : null,
      countryRank: countryRankMatch ? parseInt(countryRankMatch[1], 10) : null,
      country: countryNameMatch?.[1]?.trim() ?? null,
      institution: institutionMatch ? decodeHtmlEntities(institutionMatch[1].trim()) : null,
      studentStatus: studentStatusMatch?.[1]?.trim() ?? null,
      contestsAttended: contestCountMatch ? parseInt(contestCountMatch[1], 10) : 0,
      totalProblemsSolved: totalSolvedMatch ? parseInt(totalSolvedMatch[1], 10) : 0,
      ratingHistory: parseRatingHistory(html),
      badges: parseBadges(html),
      submissions,
      submissionCalendar: parseSubmissionCalendar(html),
      profileUrl,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch CodeChef stats" },
      { status: 502 }
    );
  }
}
