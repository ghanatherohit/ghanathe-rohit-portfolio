import { NextResponse } from "next/server";

const GITHUB_USERNAME = "ghanatherohit";

// Cache for 6 hours — merged PRs to other repos change infrequently
export const revalidate = 21600;

interface SearchIssueItem {
  title: string;
  html_url: string;
  repository_url: string;
  closed_at: string | null;
  number: number;
}

function makeHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function GET() {
  try {
    const headers = makeHeaders();
    const query = `author:${GITHUB_USERNAME}+type:pr+is:merged+-user:${GITHUB_USERNAME}`;

    const res = await fetch(
      `https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=10`,
      { headers, next: { revalidate: 21600 } }
    );

    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Add a GITHUB_TOKEN env variable to fix this." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data: { items: SearchIssueItem[] } = await res.json();

    const contributions = data.items.map((item) => {
      const repoPath = item.repository_url.replace(
        "https://api.github.com/repos/",
        ""
      );
      return {
        repo: repoPath,
        title: item.title,
        url: item.html_url,
        number: item.number,
        mergedAt: item.closed_at,
      };
    });

    return NextResponse.json(
      { contributions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 500 }
    );
  }
}
