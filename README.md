<h1 align="center">
  <img src="./public/android-chrome-192x192.png" alt="Rohit Ghanathe" width="60" /><br/>
  Ghanathe Rohit — Portfolio
</h1>

<p align="center">
  A production-ready, full-stack personal portfolio built with <strong>Next.js 15</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.<br/>
  Showcasing projects, coding platform statistics, open-source contributions, and more — all powered by live API data.
</p>

<p align="center">
  <a href="https://ghanathe-rohit-portfolio.vercel.app" target="_blank">
    <img alt="Live Site" src="https://img.shields.io/badge/Live%20Site-Visit-6366f1?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>&nbsp;
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />&nbsp;
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />&nbsp;
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## Table of Contents

1. [Overview](#overview)
2. [Live Demo](#live-demo)
3. [Tech Stack](#tech-stack)
4. [Project Architecture](#project-architecture)
5. [Directory Structure](#directory-structure)
6. [Sections and Components](#sections-and-components)
7. [API Routes — Full Documentation](#api-routes--full-documentation)
   - [GET /api/github](#1-get-apigithub)
   - [GET /api/github/contributions](#2-get-apigithubcontributions)
   - [GET /api/coding-stats/leetcode/\[username\]](#3-get-apicoding-statsleetcodeusername)
   - [GET /api/coding-stats/codeforces/\[username\]](#4-get-apicoding-statscodeforcesusername)
   - [GET /api/coding-stats/codechef/\[username\]](#5-get-apicoding-statscodechefusername)
   - [GET /api/coding-stats/gfg/\[username\]](#6-get-apicoding-statsgfgusername)
   - [GET /api/coding-stats/hackerrank/\[username\]](#7-get-apicoding-statshackerankusername)
   - [GET /api/coding-stats/github/\[username\]](#8-get-apicoding-statsgithubusername)
8. [Environment Variables](#environment-variables)
9. [Getting Started](#getting-started)
10. [Caching Strategy](#caching-strategy)
11. [SEO and Metadata](#seo-and-metadata)
12. [Deployment](#deployment)
13. [Customization Guide](#customization-guide)

---

## Overview

This is a **single-page portfolio application** built with the **Next.js App Router**. It aggregates live data from six competitive programming platforms (LeetCode, Codeforces, CodeChef, GeeksforGeeks, HackerRank, GitHub) via custom proxy API routes, displays rich analytics with interactive charts, and includes a fully validated contact form powered by [Web3Forms](https://web3forms.com).

**Key Highlights:**

- **Zero client-side API keys** — all third-party data fetching happens server-side
- **ISR caching** — all API routes revalidate every 1–6 hours, eliminating redundant upstream calls
- **Dark / Light / System theme** via `next-themes`
- **Framer Motion** animations throughout every section
- **Command Palette** (`Cmd+K` / `Ctrl+K`) for keyboard navigation
- **Interactive Terminal** for a developer-style experience
- **Mouse follower cursor** effect and **Scroll progress bar**
- **Schema.org JSON-LD** structured data for SEO
- **Vercel Analytics** integration
- **Production middleware** that redirects all preview URLs to the canonical domain
- **`robots.ts` + `sitemap.ts`** for full search engine indexing support

---

## Live Demo

**Production URL:** https://ghanathe-rohit-portfolio.vercel.app

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3, tailwindcss-animate |
| **Animations** | Framer Motion 12 |
| **Font** | Inter (Google Fonts via `next/font`) |
| **Icons** | Lucide React, React Icons (Si icons) |
| **Forms** | React Hook Form 7 + Zod 3 schema validation |
| **Form Backend** | Web3Forms API (serverless, no backend needed) |
| **Themes** | next-themes 0.4 |
| **Command Menu** | cmdk 1 |
| **Type Effects** | typewriter-effect 2 |
| **Analytics** | @vercel/analytics 1 |
| **Deployment** | Vercel |

---

## Project Architecture

```
Browser / Client
      |
      v
Next.js App Router  (SSR + ISR)
      |
      +-- Page Components  (React Server Components)
      |     +-- Client Components  (Framer Motion, charts, forms)
      |
      +-- API Route Handlers  (server-only functions)
            |
            +-- /api/github                  --> GitHub REST API
            +-- /api/github/contributions    --> GitHub Search API
            +-- /api/coding-stats/
                  +-- leetcode/[username]    --> LeetCode GraphQL API
                  +-- codeforces/[username]  --> Codeforces REST API
                  +-- codechef/[username]    --> CodeChef HTML scraper
                  +-- gfg/[username]         --> GFG Practice API
                  +-- hackerrank/[username]  --> HackerRank REST API
                  +-- github/[username]      --> GitHub REST + GraphQL API
```

All upstream API calls are made **exclusively on the server**. The browser never touches a third-party API directly — keeping rate-limit tokens private and avoiding CORS issues.

---

## Directory Structure

```
ghanathe-rohit-portfolio/
|
+-- app/
|   +-- api/
|   |   +-- github/
|   |   |   +-- route.ts                        # Repo list + language data (1 hr cache)
|   |   |   +-- contributions/
|   |   |       +-- route.ts                    # Merged PR search (6 hr cache)
|   |   +-- coding-stats/
|   |       +-- leetcode/[username]/route.ts    # LeetCode GraphQL stats
|   |       +-- codeforces/[username]/route.ts  # Codeforces REST stats
|   |       +-- codechef/[username]/route.ts    # CodeChef HTML scraper
|   |       +-- gfg/[username]/route.ts         # GFG Practice API
|   |       +-- hackerrank/[username]/route.ts  # HackerRank badges API
|   |       +-- github/[username]/route.ts      # GitHub contribution graph
|   +-- globals.css        # Global styles + CSS variables (light & dark tokens)
|   +-- layout.tsx         # Root layout, metadata export, Inter font
|   +-- page.tsx           # Home page — assembles all section components
|   +-- robots.ts          # Dynamic robots.txt (index only in production)
|   +-- sitemap.ts         # Dynamic sitemap.xml
|
+-- components/
|   +-- Header.tsx                    # Sticky nav, theme switcher, Command Palette trigger
|   +-- Hero.tsx                      # Name, typewriter roles, resume + contact CTAs
|   +-- Now.tsx                       # "What I'm doing now" section
|   +-- About.tsx                     # Bio, profile photo, key facts
|   +-- Education.tsx                 # Academic history timeline
|   +-- Experience.tsx                # Work experience cards with company logos
|   +-- Skills.tsx                    # Technology skills grid
|   +-- CodingProfiles.tsx            # Live stats from 6 coding platforms
|   +-- Projects.tsx                  # GitHub repos with tag filters + case studies
|   +-- OpenSourceContributions.tsx   # Merged PRs to external repos
|   +-- Certifications.tsx            # Certificates with images
|   +-- Contact.tsx                   # Web3Forms contact form with Zod validation
|   +-- Footer.tsx                    # Social links + quick nav
|   +-- theme-provider.tsx            # next-themes ThemeProvider wrapper
|   +-- ui/
|       +-- CaseStudyModal.tsx        # Animated modal for project details
|       +-- CommandPalette.tsx        # Cmd+K command palette (cmdk)
|       +-- DarkModeIndicator.tsx     # Floating theme badge
|       +-- MouseFollower.tsx         # Smooth custom cursor follower
|       +-- ProjectCard.tsx           # Reusable project card component
|       +-- ScrollProgress.tsx        # Top scroll progress bar
|       +-- SectionHeading.tsx        # Reusable section title + subtitle
|       +-- SkillCard.tsx             # Individual skill item card
|       +-- Terminal.tsx              # Interactive CLI terminal widget
|       +-- ThemeSwitcher.tsx         # Sun / Moon / System toggle
|       +-- textarea.tsx              # Styled textarea primitive
|       +-- charts/                   # Data visualization components
|
+-- lib/
|   +-- config.ts            # SITE_URL + IS_PRODUCTION — single source of truth
|   +-- coding-profiles.ts   # Platform metadata, usernames, icon + color config
|   +-- case-studies.ts      # Detailed project case study data
|   +-- now.ts               # "Now" section content
|   +-- utils.ts             # cn() utility (clsx + tailwind-merge)
|
+-- public/
|   +-- rohit-pic.jpg           # Profile photo (About section)
|   +-- preview.png             # OG image 1920x1080
|   +-- Rohit-Resume.pdf        # Downloadable resume
|   +-- BooksStore.png          # Project screenshot
|   +-- ElevateFit.png          # Project screenshot
|   +-- GoldPricePredictor.png  # Project screenshot
|   +-- NexAuth.png             # Project screenshot
|   +-- Portfolio.png           # Project screenshot
|   +-- certifications/         # Certification images
|   +-- experience/             # Company logos
|   +-- favicon.ico
|   +-- android-chrome-192x192.png
|   +-- android-chrome-512x512.png
|   +-- apple-touch-icon.png
|   +-- site.webmanifest
|
+-- middleware.ts        # Canonical domain redirect (308) in production
+-- next.config.ts       # Remote image patterns allowlist
+-- tailwind.config.js   # Tailwind theme extensions + custom utilities
+-- tsconfig.json        # TypeScript strict config with path alias @/
+-- .env.example         # Environment variable reference template
+-- package.json         # Dependencies and npm scripts
```

---

## Sections and Components

| Section | Component | Data Source | Description |
|---|---|---|---|
| **Header** | `Header.tsx` | Static | Sticky nav with smooth scroll links, theme switcher, Command Palette button |
| **Hero** | `Hero.tsx` | Static | Name, typewriter role titles, resume download + contact CTAs |
| **Now** | `Now.tsx` | `lib/now.ts` | What I'm currently working on or learning |
| **About** | `About.tsx` | Static | Bio, profile photo, key highlights |
| **Education** | `Education.tsx` | Static | Academic history timeline |
| **Experience** | `Experience.tsx` | Static | Work experience cards with company logos |
| **Skills** | `Skills.tsx` | Static | Technology skill grid with icons |
| **Coding Profiles** | `CodingProfiles.tsx` | `/api/coding-stats/*` | Live stats from 6 platforms with charts |
| **Projects** | `Projects.tsx` | `/api/github` | GitHub repos with tag filtering and case study modals |
| **Open Source** | `OpenSourceContributions.tsx` | `/api/github/contributions` | Merged PRs to other people's repositories |
| **Certifications** | `Certifications.tsx` | Static | Certificates with images |
| **Contact** | `Contact.tsx` | Web3Forms API | Validated contact form with animated success popup |
| **Footer** | `Footer.tsx` | Static | Social links, quick navigation |

### Special UI Components

| Component | Description |
|---|---|
| `MouseFollower.tsx` | Smooth cursor follower effect (hidden on touch devices) |
| `CommandPalette.tsx` | `Cmd+K` / `Ctrl+K` keyboard navigation palette |
| `Terminal.tsx` | Interactive terminal with commands: `help`, `skills`, `projects`, `contact`, `clear` |
| `DarkModeIndicator.tsx` | Floating badge showing the active theme |
| `ScrollProgress.tsx` | Thin progress bar fixed at top of viewport |
| `ThemeSwitcher.tsx` | Sun / Moon / System theme toggle button |

---

## API Routes — Full Documentation

All routes are **Next.js Route Handlers** (`GET`). They run server-side, use ISR revalidation, and return `application/json`.

---

### 1. GET /api/github

Fetches all non-forked public repositories for `ghanatherohit`, enriched with per-repository language data fetched in parallel.

**Upstream APIs:**
- `GET https://api.github.com/users/ghanatherohit/repos?per_page=100&sort=pushed`
- `GET https://api.github.com/repos/ghanatherohit/{repo}/languages` — for each repo in parallel

**Cache:** `revalidate = 3600` (1 hour)
`Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

**Authentication:** Optional `GITHUB_TOKEN` Bearer token (raises rate limit from 60/hr to 5,000/hr)

**Success Response — 200:**
```json
{
  "projects": [
    {
      "name": "repo-name",
      "description": "Repository description or null",
      "homepage": "https://live-url.com or null",
      "html_url": "https://github.com/ghanatherohit/repo-name",
      "topics": ["nextjs", "typescript"],
      "language": "TypeScript",
      "tags": ["nextjs", "typescript", "TypeScript", "CSS"],
      "stargazers_count": 5,
      "pushed_at": "2026-08-30T12:00:00Z"
    }
  ]
}
```

> `tags` is a deduplicated union of `topics` + language names from the languages API.

**Error Responses:**

| Status | Condition |
|---|---|
| `429` | GitHub rate limit exceeded — add `GITHUB_TOKEN` env var to fix |
| `5xx` | Upstream GitHub API error (status forwarded) |
| `500` | Unhandled internal error |

---

### 2. GET /api/github/contributions

Searches GitHub for merged pull requests authored by `ghanatherohit` in **other users' repositories** (open-source contributions).

**Upstream API:**
- `GET https://api.github.com/search/issues?q=author:ghanatherohit+type:pr+is:merged+-user:ghanatherohit&sort=updated&order=desc&per_page=10`

**Cache:** `revalidate = 21600` (6 hours)
`Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400`

**Authentication:** Optional `GITHUB_TOKEN` Bearer token

**Success Response — 200:**
```json
{
  "contributions": [
    {
      "repo": "owner/repository-name",
      "title": "Fix: resolved null pointer exception in auth module",
      "url": "https://github.com/owner/repository-name/pull/42",
      "number": 42,
      "mergedAt": "2026-07-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**

| Status | Condition |
|---|---|
| `429` | GitHub rate limit exceeded |
| `500` | Unhandled internal error |

---

### 3. GET /api/coding-stats/leetcode/[username]

Fetches comprehensive LeetCode stats via the **LeetCode GraphQL API** at `https://leetcode.com/graphql`.

**Example:** `GET /api/coding-stats/leetcode/ghanatherohit`

**GraphQL queries executed:**
1. **Main query** — `userProfile`, `allQuestionsCount`, `userContestRanking`, `userContestRankingHistory`, `recentAcSubmissionList`, `userProfileUserQuestionProgressV2`
2. **Calendar query** (`userProfileCalendar`) — executed once per active year in parallel to build a full multi-year submission history

**Cache:** `revalidate = 21600` (6 hours)

**Success Response — 200:**
```json
{
  "ok": true,
  "totalSolved": 280,
  "totalQuestions": 3500,
  "easySolved": 120,
  "easyTotal": 900,
  "mediumSolved": 130,
  "mediumTotal": 1900,
  "hardSolved": 30,
  "hardTotal": 700,
  "ranking": 150000,
  "contestRating": 1520,
  "contestsAttended": 15,
  "topPercentage": 35.2,
  "contestGlobalRanking": 80000,
  "contestTotalParticipants": 250000,
  "contestBadgeName": null,
  "contestHistory": [
    {
      "attended": true,
      "rating": 1520,
      "ranking": 3200,
      "contestTitle": "Weekly Contest 350",
      "startTime": 1700000000,
      "problemsSolved": 2,
      "totalProblems": 4
    }
  ],
  "badges": [
    {
      "id": "badge-id",
      "displayName": "100 Days Badge",
      "icon": "https://assets.leetcode.com/static_assets/badge.png",
      "creationDate": "2025-01-01"
    }
  ],
  "mostRecentBadge": {
    "id": "badge-id",
    "displayName": "100 Days Badge",
    "icon": "https://assets.leetcode.com/static_assets/badge.png",
    "creationDate": "2025-01-01"
  },
  "upcomingBadges": [
    { "name": "200 Days", "icon": "https://leetcode.com/static/images/badge.gif" }
  ],
  "submissionCalendar": [
    { "date": "2025-01-01", "count": 3 }
  ],
  "totalActiveDays": 200,
  "maxStreak": 30,
  "recentSubmissions": [
    { "title": "Two Sum", "titleSlug": "two-sum", "timestamp": 1700000000 }
  ],
  "languageBreakdown": [
    { "language": "C++", "solved": 150 },
    { "language": "Python", "solved": 80 }
  ],
  "tagBreakdown": [
    { "tag": "Dynamic Programming", "solved": 45 }
  ],
  "acceptanceByDifficulty": [
    {
      "difficulty": "Easy",
      "solved": 120,
      "totalSubmissions": 200,
      "acceptedSubmissions": 145
    }
  ],
  "beatsPercentage": [
    { "difficulty": "Easy", "percentage": 72.5 }
  ],
  "totalBeatsPercentage": 65.3,
  "profileUrl": "https://leetcode.com/ghanatherohit/"
}
```

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "LeetCode user not found" }` | Username does not exist on LeetCode |
| `502` | `{ "ok": false, "error": "LeetCode request failed" }` | LeetCode API unreachable or returned non-200 |

---

### 4. GET /api/coding-stats/codeforces/[username]

Fetches complete Codeforces statistics from the **official Codeforces REST API**.

**Example:** `GET /api/coding-stats/codeforces/GhanatheRohit`

**Upstream APIs (executed in parallel):**
- `GET https://codeforces.com/api/user.info?handles={username}`
- `GET https://codeforces.com/api/user.status?handle={username}`
- `GET https://codeforces.com/api/user.rating?handle={username}`

**Cache:** `revalidate = 21600` (6 hours)

**Verdict label mapping** (raw Codeforces verdict → human-readable display):

| Raw | Display |
|---|---|
| `OK` | Accepted |
| `WRONG_ANSWER` | Wrong Answer |
| `TIME_LIMIT_EXCEEDED` | Time Limit Exceeded |
| `MEMORY_LIMIT_EXCEEDED` | Memory Limit Exceeded |
| `RUNTIME_ERROR` | Runtime Error |
| `COMPILATION_ERROR` | Compilation Error |
| `CHALLENGED` | Hacked |
| `PARTIAL` | Partial |

**Success Response — 200:**
```json
{
  "ok": true,
  "rating": 1050,
  "rank": "pupil",
  "maxRating": 1200,
  "maxRank": "pupil",
  "problemsSolved": 180,
  "contestsAttended": 22,
  "ratingHistory": [
    {
      "contestName": "Codeforces Round 900 (Div. 3)",
      "rating": 1050,
      "date": "2025-10-01T12:00:00.000Z"
    }
  ],
  "profileUrl": "https://codeforces.com/profile/GhanatheRohit",
  "avatar": "https://userpic.codeforces.org/...",
  "contribution": 0,
  "friendOfCount": 5,
  "registrationDate": "2023-01-15T00:00:00.000Z",
  "lastOnlineDate": "2026-08-28T00:00:00.000Z",
  "bestRank": 850,
  "tagBreakdown": [
    { "tag": "greedy", "count": 40 },
    { "tag": "dp", "count": 25 }
  ],
  "difficultyBreakdown": [
    { "rating": 800, "count": 30 },
    { "rating": 900, "count": 25 }
  ],
  "languageBreakdown": [
    { "language": "GNU C++17", "count": 350 }
  ],
  "verdictBreakdown": [
    { "verdict": "Accepted", "count": 180 },
    { "verdict": "Wrong Answer", "count": 70 }
  ],
  "submissionCalendar": [
    { "date": "2025-01-01", "count": 5 }
  ],
  "recentSubmissions": [
    {
      "id": 123456789,
      "contestId": 1900,
      "problemIndex": "A",
      "problemName": "Array and Integers",
      "verdict": "Accepted",
      "programmingLanguage": "GNU C++17",
      "creationTimeSeconds": 1700000000
    }
  ]
}
```

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "Codeforces user not found" }` | Handle does not exist |
| `502` | `{ "ok": false, "error": "Failed to fetch Codeforces stats" }` | API unreachable |

---

### 5. GET /api/coding-stats/codechef/[username]

Fetches CodeChef statistics by **scraping the public profile HTML**. CodeChef has no public API. Rating, stars, rank, rating history, and submission calendar are parsed from JavaScript variables embedded in the page source.

**Example:** `GET /api/coding-stats/codechef/ghantherohit`

**Upstream URLs (executed in parallel):**
- `GET https://www.codechef.com/users/{username}` — HTML page (scraped for profile data)
- `GET https://www.codechef.com/recent/user?page=0&user_handle={username}` — JSON endpoint for recent submissions

**Parsed JS variables from HTML:**
- `var all_rating = [...]` — rating history array
- `var userDailySubmissionsStats = [...]` — submission calendar array

**Cache:** `revalidate = 21600` (6 hours)

**Success Response — 200:**
```json
{
  "ok": true,
  "rating": 1520,
  "highestRating": 1620,
  "stars": 3,
  "division": 3,
  "globalRank": 25000,
  "countryRank": 8000,
  "country": "India",
  "institution": "NIT Warangal",
  "studentStatus": "Student",
  "contestsAttended": 18,
  "totalProblemsSolved": 95,
  "ratingHistory": [
    {
      "contestName": "Starters 120",
      "rating": 1520,
      "rank": 1200,
      "date": "2025-10-01T00:00:00"
    }
  ],
  "badges": [
    {
      "title": "3-Star Coder",
      "description": "Achieved 3-star rating on CodeChef."
    }
  ],
  "submissions": [
    {
      "problemCode": "PRTSQ",
      "problemUrl": "https://www.codechef.com/problems/PRTSQ",
      "result": "Accepted",
      "accepted": true,
      "language": "C++ 17",
      "submittedAt": "2026-08-29 14:30:00"
    }
  ],
  "submissionCalendar": [
    { "date": "2025-01-01", "count": 2 }
  ],
  "profileUrl": "https://www.codechef.com/users/ghantherohit"
}
```

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "CodeChef profile not found" }` | Username does not exist |
| `502` | `{ "ok": false, "error": "Could not parse CodeChef profile" }` | HTML structure changed |

---

### 6. GET /api/coding-stats/gfg/[username]

Fetches GeeksforGeeks solved problem statistics from the **GeeksforGeeks Practice API**.

**Example:** `GET /api/coding-stats/gfg/ghanatherohit`

**Upstream API:** `POST https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/`

Two request types are used:
- `requestType: ""` — all-time difficulty breakdown
- `requestType: "getYearwiseUserSubmissions"` — per-year calendar (walks back up to 8 years, stops when a year returns empty)

**Cache:** `revalidate = 21600` (6 hours)

**Difficulty levels:** `School` | `Basic` | `Easy` | `Medium` | `Hard`

**Success Response — 200:**
```json
{
  "ok": true,
  "totalSolved": 120,
  "difficultyCounts": {
    "School": 10,
    "Basic": 20,
    "Easy": 50,
    "Medium": 35,
    "Hard": 5
  },
  "problems": [
    {
      "name": "Reverse a Linked List",
      "slug": "reverse-a-linked-list",
      "difficulty": "Easy",
      "solvedAt": "2025-08-15 10:00:00"
    }
  ],
  "submissionCalendar": [
    { "date": "2025-01-01", "count": 3 }
  ],
  "profileUrl": "https://www.geeksforgeeks.org/user/ghanatherohit/"
}
```

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "GeeksforGeeks user not found" }` | Username does not exist |
| `502` | `{ "ok": false, "error": "GeeksforGeeks request failed" }` | API unreachable |

---

### 7. GET /api/coding-stats/hackerrank/[username]

Fetches HackerRank badge and skill statistics from the **HackerRank REST API**. Only badges with at least 1 star are included in the response.

**Example:** `GET /api/coding-stats/hackerrank/2004ghantherohit`

**Upstream APIs (executed in parallel):**
- `GET https://www.hackerrank.com/rest/hackers/{username}/badges`
- `GET https://www.hackerrank.com/rest/hackers/{username}/scores_elo` — enriches badges with practice rank
- `GET https://www.hackerrank.com/rest/hackers/{username}/skills`
- `GET https://www.hackerrank.com/rest/hackers/{username}/submission_histories`

**Cache:** `revalidate = 21600` (6 hours)

**Success Response — 200:**
```json
{
  "ok": true,
  "totalBadges": 8,
  "totalStars": 28,
  "totalSolved": 145,
  "badges": [
    {
      "badgeType": "practice",
      "name": "Problem Solving",
      "shortName": "problem-solving",
      "category": "Problem Solving",
      "stars": 5,
      "totalStars": 5,
      "solved": 40,
      "totalChallenges": 50,
      "url": "https://www.hackerrank.com/domains/algorithms",
      "practiceRank": 3
    }
  ],
  "skills": ["Python", "SQL", "Java"],
  "submissionCalendar": [
    { "date": "2025-01-01", "count": 2 }
  ],
  "profileUrl": "https://www.hackerrank.com/profile/2004ghantherohit"
}
```

> `totalSolved` is the sum of `solved` across all badges.
> `totalStars` is the sum of `stars` across all badges.

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "HackerRank profile not found" }` | Username does not exist |
| `502` | `{ "ok": false, "error": "Could not parse HackerRank badges" }` | API response format changed |

---

### 8. GET /api/coding-stats/github/[username]

Fetches GitHub contribution calendar, public repository count, follower stats, and total stars. Supports two modes: **GraphQL with token** (accurate counts) or **HTML scrape fallback** (no token needed).

**Example:** `GET /api/coding-stats/github/ghanatherohit`

**With year filter:** `GET /api/coding-stats/github/ghanatherohit?year=2024`

**Query Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `year` | `number` (optional) | Filter the contribution calendar to a specific year |

**Upstream APIs (in parallel):**
- `GET https://api.github.com/users/{username}`
- `GET https://api.github.com/users/{username}/repos?per_page=100&type=owner`

Then, one of the following (based on `GITHUB_TOKEN`):
- `POST https://api.github.com/graphql` — GraphQL `userContributions` query _(if token set)_
- `GET https://github.com/users/{username}/contributions` — HTML scrape fallback _(no token)_

**Cache:** `revalidate = 21600` (6 hours)

**Success Response — 200:**
```json
{
  "ok": true,
  "publicRepos": 25,
  "followers": 40,
  "following": 30,
  "totalStars": 15,
  "totalContributions": 850,
  "contributionCalendar": [
    { "date": "2025-01-01", "count": 4 },
    { "date": "2025-01-02", "count": 0 }
  ],
  "contributionYears": [2026, 2025, 2024, 2023],
  "profileUrl": "https://github.com/ghanatherohit"
}
```

> `totalContributions` can be `null` when running without a `GITHUB_TOKEN` and the HTML scrape returns an empty calendar.

**Error Responses:**

| Status | Body | Condition |
|---|---|---|
| `404` | `{ "ok": false, "error": "GitHub user not found" }` | Username does not exist |
| `502` | `{ "ok": false, "error": "Failed to fetch GitHub stats" }` | API unreachable |

---

## Environment Variables

Create a `.env.local` file at the project root (copy from `.env.example`).

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL (e.g. `https://yourname.vercel.app`). Used for OG tags, sitemap, and middleware redirect. Defaults to the Vercel deployment URL. |
| `GITHUB_TOKEN` | Optional | GitHub PAT (fine-grained, public repo read). Raises rate limit to 5,000/hr and enables GraphQL contribution calendar. Without it, the calendar falls back to HTML scraping. |
| `GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token. Injected as a `<meta name="google-site-verification">` tag. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Same as above — also accessible client-side. |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Required for contact form | Your [Web3Forms](https://web3forms.com) access key. Without it the contact form submissions will fail. |

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GITHUB_TOKEN=ghp_your_personal_access_token_here
GOOGLE_SITE_VERIFICATION=your-google-verification-token
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-token
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9 (or pnpm / yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ghanatherohit/ghanathe-rohit-portfolio.git
cd ghanathe-rohit-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in your values

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server (requires prior build) |
| `npm run lint` | Run ESLint |

---

## Caching Strategy

All API routes use **Next.js ISR** via `export const revalidate`. The first request triggers a fresh upstream fetch; subsequent requests within the revalidation window are served from the Vercel CDN cache.

| Route | `revalidate` | Cache Window |
|---|---|---|
| `/api/github` | `3600` | 1 hour |
| `/api/github/contributions` | `21600` | 6 hours |
| `/api/coding-stats/leetcode/*` | `21600` | 6 hours |
| `/api/coding-stats/codeforces/*` | `21600` | 6 hours |
| `/api/coding-stats/codechef/*` | `21600` | 6 hours |
| `/api/coding-stats/gfg/*` | `21600` | 6 hours |
| `/api/coding-stats/hackerrank/*` | `21600` | 6 hours |
| `/api/coding-stats/github/*` | `21600` | 6 hours |

All routes also set explicit `Cache-Control: public, s-maxage=..., stale-while-revalidate=86400` headers for Vercel's edge layer.

---

## SEO and Metadata

| Feature | Implementation |
|---|---|
| Title + Description | `Metadata` export in `app/layout.tsx` with template `%s \| Ghanathe Rohit` |
| Open Graph | Full OG tags with 1920×1080 preview image at `/preview.png` |
| Twitter Card | `summary_large_image` card |
| Canonical URL | `alternates.canonical: "/"` in metadata |
| Robots | `app/robots.ts` — index/follow only when `IS_PRODUCTION = true` |
| Sitemap | `app/sitemap.ts` — auto-generated `/sitemap.xml` |
| JSON-LD | `WebSite` + `Person` structured data in `app/page.tsx` |
| Google Verification | `GOOGLE_SITE_VERIFICATION` env var → injected `<meta>` tag |
| Semantic HTML | `<main>`, `<section id="...">`, `<nav>`, `<footer>`, `<h1>`–`<h4>` hierarchy |
| Performance | ISR, `next/font` with `display: swap`, remote image optimization via `next/image` |

---

## Deployment

This project is optimized for **Vercel** deployment.

### Deploy Steps

1. Push your fork to GitHub
2. Import the repo at [https://vercel.com/new](https://vercel.com/new)
3. Add all **Environment Variables** in Vercel project settings
4. Deploy — Vercel auto-detects Next.js and applies optimal build settings

### Middleware — Canonical Domain Redirect

`middleware.ts` enforces a canonical domain in production. Any request arriving on a Vercel preview URL is **308-redirected** to the URL in `NEXT_PUBLIC_SITE_URL`. This consolidates all SEO authority on a single canonical domain.

```
preview-xyz.vercel.app  →  308 Permanent Redirect  →  your-domain.com
```

The middleware `matcher` excludes `api/`, `_next/static`, `_next/image`, and `favicon.ico` so API routes and assets are never redirected.

### Remote Image Allowlist

`next.config.ts` whitelists these hostnames for `next/image`:

| Hostname | Used For |
|---|---|
| `opengraph.githubassets.com` | GitHub repository OG preview images |
| `assets.leetcode.com` | LeetCode badge icons |
| `userpic.codeforces.org` | Codeforces user avatars |

---

## Customization Guide

### 1. Personal Information

| File | What to Update |
|---|---|
| `lib/coding-profiles.ts` | `USERNAMES` object — set your handle for each platform |
| `app/api/github/route.ts` | `GITHUB_USERNAME` constant (line 3) |
| `app/api/github/contributions/route.ts` | `GITHUB_USERNAME` constant (line 3) |
| `components/Contact.tsx` | Email address, location string, social links array |
| `components/Hero.tsx` | Your name, typewriter role strings |
| `components/About.tsx` | Bio text, highlights |
| `components/Education.tsx` | Academic history data |
| `components/Experience.tsx` | Work experience data |
| `components/Skills.tsx` | Your tech stack |
| `components/Certifications.tsx` | Your certificates |
| `lib/now.ts` | What you're currently doing or learning |
| `lib/case-studies.ts` | Detailed project case study content |
| `app/layout.tsx` | Site title, description, keywords, OG metadata |
| `app/page.tsx` | JSON-LD structured data (name, social links, skills list) |

### 2. Platform Usernames

```ts
// lib/coding-profiles.ts — single source of truth for all platform handles
const USERNAMES = {
  github:     "your-github-username",
  leetcode:   "your-leetcode-username",
  codeforces: "your-codeforces-handle",
  codechef:   "your-codechef-handle",
  gfg:        "your-gfg-handle",
  hackerrank: "your-hackerrank-username",
};
```

Also update the hardcoded `GITHUB_USERNAME` in `app/api/github/route.ts` and `app/api/github/contributions/route.ts` (line 3 in each file).

### 3. Public Assets

| Asset | Path | Usage |
|---|---|---|
| Profile photo | `public/rohit-pic.jpg` | About section |
| OG / preview image | `public/preview.png` | Social sharing (1920×1080) |
| Resume PDF | `public/Rohit-Resume.pdf` | Hero download button |
| Project screenshots | `public/*.png` | ProjectCard thumbnails |
| Certifications | `public/certifications/` | Certifications section |
| Company logos | `public/experience/` | Experience section |
| Favicon | `public/favicon.ico` | Browser tab |

### 4. Theme and Colors

Edit `tailwind.config.js` to change the color palette. The design uses CSS custom properties (`--primary`, `--background`, `--foreground`, `--muted`, `--border`, etc.) defined in `app/globals.css` with separate values for `:root` (light) and `.dark` (dark mode).

---

## License

This project is open source. Feel free to fork and adapt it for your own portfolio — attribution appreciated but not required.

---

<p align="center">Made with ❤️ by <a href="https://github.com/ghanatherohit">Ghanathe Rohit</a></p>
