import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

type Difficulty = "School" | "Basic" | "Easy" | "Medium" | "Hard";

interface GfgProblem {
  name: string;
  slug: string;
  difficulty: Difficulty;
  solvedAt: string;
}

interface GfgStats {
  ok: true;
  totalSolved: number;
  difficultyCounts: Record<Difficulty, number>;
  problems: GfgProblem[];
  submissionCalendar: { date: string; count: number }[];
  profileUrl: string;
}

const ENDPOINT = "https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/";
const DIFFICULTIES: Difficulty[] = ["School", "Basic", "Easy", "Medium", "Hard"];

function makeHeaders(handle: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Referer: `https://www.geeksforgeeks.org/user/${handle}/`,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const headers = makeHeaders(username);

    const breakdownReq = fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ handle: username, requestType: "", year: "", month: "" }),
      next: { revalidate },
    });

    // Walk backwards from the current year until a year comes back empty —
    // covers however far back the account's submission history actually goes.
    const currentYear = new Date().getFullYear();
    const maxYearsBack = 8;
    const submissionCalendar: { date: string; count: number }[] = [];

    const [breakdownRes] = await Promise.all([
      breakdownReq,
      (async () => {
        for (let i = 0; i < maxYearsBack; i++) {
          const year = currentYear - i;
          const res = await fetch(ENDPOINT, {
            method: "POST",
            headers,
            body: JSON.stringify({
              handle: username,
              requestType: "getYearwiseUserSubmissions",
              year: String(year),
              month: "",
            }),
            next: { revalidate },
          });
          if (!res.ok) break;

          const calendar = await res.json();
          if (calendar?.status !== "success" || !calendar.result) break;

          const entries = Object.entries(calendar.result as Record<string, number>);
          if (entries.length === 0) break;

          for (const [date, count] of entries) {
            submissionCalendar.push({ date, count });
          }
        }
      })(),
    ]);

    if (!breakdownRes.ok) {
      return NextResponse.json(
        { ok: false, error: "GeeksforGeeks request failed" },
        { status: 502 }
      );
    }

    const breakdown = await breakdownRes.json();
    if (breakdown?.status !== "success") {
      return NextResponse.json(
        { ok: false, error: "GeeksforGeeks user not found" },
        { status: 404 }
      );
    }

    const result = breakdown.result ?? {};
    const difficultyCounts = {} as Record<Difficulty, number>;
    const problems: GfgProblem[] = [];

    for (const difficulty of DIFFICULTIES) {
      const entries = Object.values(
        (result[difficulty] ?? {}) as Record<
          string,
          { slug: string; pname: string; lang: string; user_subtime: string }
        >
      );
      difficultyCounts[difficulty] = entries.length;
      for (const entry of entries) {
        problems.push({
          name: entry.pname,
          slug: entry.slug,
          difficulty,
          solvedAt: entry.user_subtime,
        });
      }
    }

    problems.sort(
      (a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime()
    );

    const stats: GfgStats = {
      ok: true,
      totalSolved: breakdown.count ?? 0,
      difficultyCounts,
      problems,
      submissionCalendar,
      profileUrl: `https://www.geeksforgeeks.org/user/${username}/`,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to fetch GeeksforGeeks stats" },
      { status: 502 }
    );
  }
}
