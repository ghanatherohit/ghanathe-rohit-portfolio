"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, X, ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { codingProfiles, type CodingProfile, cfRatingColor } from "@/lib/coding-profiles";
import RatingChart from "@/components/ui/charts/RatingChart";
import DifficultyDonut from "@/components/ui/charts/DifficultyDonut";
import SubmissionTrendChart from "@/components/ui/charts/SubmissionTrendChart";
import LeetCodeContestPanel from "@/components/ui/charts/LeetCodeContestPanel";
import BadgesPanel from "@/components/ui/charts/BadgesPanel";
import ActivityHeatmapCalendar from "@/components/ui/charts/ActivityHeatmapCalendar";
import HorizontalBarList from "@/components/ui/charts/HorizontalBarList";
import CodeforcesSubmissionsPanel from "@/components/ui/charts/CodeforcesSubmissionsPanel";
import CodeChefBadgesPanel from "@/components/ui/charts/CodeChefBadgesPanel";
import HackerRankBadgesPanel from "@/components/ui/charts/HackerRankBadgesPanel";

interface GitHubData {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalContributions: number | null;
  contributionCalendar: { date: string; count: number }[];
  contributionYears: number[];
}

interface LeetCodeContestPoint {
  rating: number;
  ranking: number;
  contestTitle: string;
  startTime: number;
}

interface LeetCodeBadge {
  id: string;
  displayName: string;
  icon: string;
  creationDate: string;
}

interface LeetCodeRecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: number;
}

interface LeetCodeData {
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
  contestHistory: LeetCodeContestPoint[];
  badges: LeetCodeBadge[];
  mostRecentBadge: LeetCodeBadge | null;
  submissionCalendar: { date: string; count: number }[];
  totalActiveDays: number;
  maxStreak: number;
  recentSubmissions: LeetCodeRecentSubmission[];
}

const LEETCODE_DIFFICULTY_COLORS = {
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#ef4444",
} as const;

interface CodeforcesData {
  rating: number;
  rank: string;
  maxRating: number;
  maxRank: string;
  problemsSolved: number;
  contestsAttended: number;
  ratingHistory: { contestName: string; rating: number; date: string }[];
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
  recentSubmissions: {
    id: number;
    contestId: number | null;
    problemIndex: string;
    problemName: string;
    verdict: string;
    programmingLanguage: string;
    creationTimeSeconds: number;
  }[];
}

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

interface CodeChefData {
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
}

type GfgDifficulty = "School" | "Basic" | "Easy" | "Medium" | "Hard";

interface GfgProblem {
  name: string;
  slug: string;
  difficulty: GfgDifficulty;
  solvedAt: string;
}

interface GfgData {
  totalSolved: number;
  difficultyCounts: Record<GfgDifficulty, number>;
  problems: GfgProblem[];
  submissionCalendar: { date: string; count: number }[];
}

const GFG_DIFFICULTY_COLORS: Record<GfgDifficulty, string> = {
  School: "#3b82f6",
  Basic: "#06b6d4",
  Easy: "#22c55e",
  Medium: "#eab308",
  Hard: "#ef4444",
};

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

interface HackerRankData {
  totalBadges: number;
  totalStars: number;
  totalSolved: number;
  badges: HackerRankBadge[];
  skills: string[];
  submissionCalendar: { date: string; count: number }[];
}

type PlatformData =
  | GitHubData
  | LeetCodeData
  | CodeforcesData
  | CodeChefData
  | GfgData
  | HackerRankData;

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; data: PlatformData };

interface StatRow {
  label: string;
  value: string;
}

function getHeadline(profile: CodingProfile, state: FetchState | undefined): StatRow {
  if (profile.manual) return profile.manual.headline;
  if (!state || state.status !== "success") return { label: "", value: "—" };

  switch (profile.platform) {
    case "github": {
      const d = state.data as GitHubData;
      return { label: "Repos", value: String(d.publicRepos ?? "—") };
    }
    case "leetcode": {
      const d = state.data as LeetCodeData;
      return { label: "Solved", value: String(d.totalSolved ?? "—") };
    }
    case "codeforces": {
      const d = state.data as CodeforcesData;
      return { label: "Solved", value: String(d.problemsSolved ?? "—") };
    }
    case "codechef": {
      const d = state.data as CodeChefData;
      return { label: "Solved", value: String(d.totalProblemsSolved ?? "—") };
    }
    case "gfg": {
      const d = state.data as GfgData;
      return { label: "Solved", value: String(d.totalSolved ?? "—") };
    }
    case "hackerrank": {
      const d = state.data as HackerRankData;
      return { label: "Solved", value: String(d.totalSolved ?? "—") };
    }
    default:
      return { label: "", value: "—" };
  }
}

function getDetailRows(profile: CodingProfile, state: FetchState | undefined): StatRow[] {
  if (profile.manual) return profile.manual.details;
  if (!state || state.status !== "success") return [];

  switch (profile.platform) {
    default:
      return [];
  }
}

/** Platform-specific chart, or null if there's nothing chartable for this platform/state. */
function renderChart(profile: CodingProfile, state: FetchState | undefined) {
  if (!state || state.status !== "success") return null;

  switch (profile.platform) {
    default:
      return null;
  }
}

function ProfileTile({
  profile,
  state,
  onOpen,
}: {
  profile: CodingProfile;
  state: FetchState | undefined;
  onOpen: () => void;
}) {
  const Icon = profile.icon;
  const headline = getHeadline(profile, state);
  const live = !profile.manual;
  const isLoading = !profile.manual && (!state || state.status === "loading");
  const isError = !profile.manual && state?.status === "error";

  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card px-4 py-5 sm:px-5 sm:py-6",
        "shadow-sm transition-all duration-300",
        "hover:shadow-xl hover:border-transparent"
      )}
    >
      {/* Colored top edge */}
      <span
        className="absolute inset-x-0 top-0 h-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: profile.color }}
      />

      {/* Hover glow wash */}
      <span
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120px 80px at 50% 0%, ${profile.color}22, transparent 70%)`,
        }}
      />

      <span
        className="absolute right-3 top-3.5 flex items-center"
        title={live ? "Live" : "Updated manually"}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            live ? "bg-emerald-500" : "bg-muted-foreground/40"
          )}
        >
          {live && (
            <span className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500/60" />
          )}
        </span>
      </span>

      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: profile.color + "16",
          boxShadow: `inset 0 0 0 1px ${profile.color}30`,
        }}
      >
        <Icon className="h-6 w-6" style={{ color: profile.color }} />
      </span>

      <span className="relative flex flex-col items-center gap-1">
        <span className="text-sm font-bold leading-tight">{profile.label}</span>

        {isLoading ? (
          <span className="h-4 w-16 animate-pulse rounded-full bg-muted" />
        ) : isError ? (
          <span className="text-xs text-muted-foreground">View profile</span>
        ) : (
          <span className="flex items-baseline gap-1 text-xs leading-tight">
            <span className="text-base font-extrabold" style={{ color: profile.color }}>
              {headline.value}
            </span>
            <span className="text-muted-foreground">{headline.label}</span>
          </span>
        )}
      </span>
    </motion.button>
  );
}

function timeAgo(dateStr: string) {
  const then = new Date(dateStr.replace(" ", "T")).getTime();
  const diffMs = Date.now() - then;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function GfgModalBody({ data }: { data: GfgData }) {
  const { difficultyCounts, problems, submissionCalendar, totalSolved } = data;

  const donutSlices = (Object.keys(GFG_DIFFICULTY_COLORS) as GfgDifficulty[]).map((label) => ({
    label,
    count: difficultyCounts[label] ?? 0,
    color: GFG_DIFFICULTY_COLORS[label],
  }));

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Problems Solved
        </p>
        <DifficultyDonut slices={donutSlices} total={totalSolved} />
      </div>

      {submissionCalendar.length > 0 && (
        <SubmissionTrendChart days={submissionCalendar} />
      )}

      {problems.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Problems Breakdown
          </p>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border/50 divide-y divide-border/50">
            {problems.map((problem) => (
              <a
                key={problem.slug + problem.solvedAt}
                href={`https://www.geeksforgeeks.org/problems/${problem.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate font-medium">{problem.name}</span>
                  <span
                    className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: GFG_DIFFICULTY_COLORS[problem.difficulty] + "22",
                      color: GFG_DIFFICULTY_COLORS[problem.difficulty],
                    }}
                  >
                    {problem.difficulty}
                  </span>
                </span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {timeAgo(problem.solvedAt)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LeetCodeModalBody({ data, profileUrl }: { data: LeetCodeData; profileUrl: string }) {
  const {
    totalSolved,
    totalQuestions,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    ranking,
    contestsAttended,
    topPercentage,
    contestHistory,
    badges,
    mostRecentBadge,
    submissionCalendar,
    totalActiveDays,
    maxStreak,
    recentSubmissions,
  } = data;

  const donutSlices = [
    { label: "Easy", count: easySolved ?? 0, color: LEETCODE_DIFFICULTY_COLORS.Easy },
    { label: "Medium", count: mediumSolved ?? 0, color: LEETCODE_DIFFICULTY_COLORS.Medium },
    { label: "Hard", count: hardSolved ?? 0, color: LEETCODE_DIFFICULTY_COLORS.Hard },
  ];

  return (
    <div className="space-y-4 pt-2">
      {contestHistory.length > 1 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <LeetCodeContestPanel
            history={contestHistory}
            globalRanking={ranking}
            totalParticipants={null}
            attended={contestsAttended}
            topPercentage={topPercentage}
          />
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Problems Solved
        </p>
        <DifficultyDonut slices={donutSlices} total={totalSolved} />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] font-semibold" style={{ color: LEETCODE_DIFFICULTY_COLORS.Easy }}>
              Easy
            </p>
            <p className="text-xs font-bold tabular-nums">
              {easySolved}/{easyTotal}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold" style={{ color: LEETCODE_DIFFICULTY_COLORS.Medium }}>
              Med.
            </p>
            <p className="text-xs font-bold tabular-nums">
              {mediumSolved}/{mediumTotal}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold" style={{ color: LEETCODE_DIFFICULTY_COLORS.Hard }}>
              Hard
            </p>
            <p className="text-xs font-bold tabular-nums">
              {hardSolved}/{hardTotal}
            </p>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {totalQuestions ? `${totalSolved} / ${totalQuestions} total` : null}
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <BadgesPanel
          badges={badges}
          mostRecentBadge={mostRecentBadge}
          profileUrl={profileUrl}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Active days: <span className="font-semibold text-foreground">{totalActiveDays}</span>
        </span>
        <span>
          Max streak: <span className="font-semibold text-foreground">{maxStreak}</span>
        </span>
      </div>

      {submissionCalendar.length > 0 && (
        <ActivityHeatmapCalendar days={submissionCalendar} color="leetcode" label="submissions" />
      )}

      {recentSubmissions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent AC
          </p>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border/50 divide-y divide-border/50">
            {recentSubmissions.map((sub) => (
              <a
                key={sub.titleSlug + sub.timestamp}
                href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="truncate font-medium">{sub.title}</span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {timeAgo(new Date(sub.timestamp * 1000).toISOString())}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CodeforcesModalBody({ data }: { data: CodeforcesData }) {
  const {
    rating,
    rank,
    maxRating,
    maxRank,
    problemsSolved,
    contestsAttended,
    ratingHistory,
    avatar,
    contribution,
    friendOfCount,
    registrationDate,
    bestRank,
    tagBreakdown,
    difficultyBreakdown,
    languageBreakdown,
    verdictBreakdown,
    submissionCalendar,
    recentSubmissions,
  } = data;

  const acceptedCount = verdictBreakdown.find((v) => v.verdict === "Accepted")?.count ?? 0;
  const totalSubmissions = verdictBreakdown.reduce((acc, v) => acc + v.count, 0);
  const acceptanceRate = totalSubmissions > 0 ? (acceptedCount / totalSubmissions) * 100 : null;

  const ratedSolvedCount = difficultyBreakdown.reduce((acc, d) => acc + d.count, 0);
  const avgDifficulty =
    ratedSolvedCount > 0
      ? Math.round(
          difficultyBreakdown.reduce((acc, d) => acc + d.rating * d.count, 0) / ratedSolvedCount
        )
      : null;
  const minDifficulty = difficultyBreakdown.length > 0 ? difficultyBreakdown[0].rating : null;
  const maxDifficulty =
    difficultyBreakdown.length > 0 ? difficultyBreakdown[difficultyBreakdown.length - 1].rating : null;

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {avatar && (
            <Image
              src={avatar}
              alt="Codeforces avatar"
              width={56}
              height={56}
              unoptimized
              className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-full border border-border/50 object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="capitalize font-bold truncate" style={{ color: cfRatingColor(rating) }}>
              {rank}
            </p>
            {registrationDate && (
              <p className="text-xs text-muted-foreground">
                Member since{" "}
                {new Date(registrationDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex gap-5 text-right">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Contribution
              </p>
              <p className="text-sm font-bold tabular-nums">
                {contribution > 0 ? `+${contribution}` : contribution}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Friend of
              </p>
              <p className="text-sm font-bold tabular-nums">{friendOfCount}</p>
            </div>
          </div>
        </div>

        {ratingHistory.length > 1 && (
          <>
            <div className="my-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs border-t border-border/50 pt-3">
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Current Rating
                </p>
                <p className="text-xl font-extrabold tabular-nums" style={{ color: cfRatingColor(rating) }}>
                  {rating}
                </p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Max Rating
                </p>
                <p className="text-sm font-bold tabular-nums" style={{ color: cfRatingColor(maxRating) }}>
                  {maxRating} <span className="font-normal text-muted-foreground capitalize">({maxRank})</span>
                </p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Contests
                </p>
                <p className="text-sm font-bold tabular-nums">{contestsAttended}</p>
              </div>
              {bestRank != null && (
                <div>
                  <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                    Best Rank
                  </p>
                  <p className="text-sm font-bold tabular-nums">#{bestRank.toLocaleString()}</p>
                </div>
              )}
            </div>
            <RatingChart history={ratingHistory} />
          </>
        )}
      </div>

      {tagBreakdown.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Top Topics
            </p>
            {avgDifficulty != null && (
              <p className="text-[11px] text-muted-foreground text-right">
                {problemsSolved} solved · avg difficulty{" "}
                <span className="font-semibold text-foreground">{avgDifficulty}</span>
                {minDifficulty != null && maxDifficulty != null && minDifficulty !== maxDifficulty && (
                  <> ({minDifficulty}–{maxDifficulty})</>
                )}
              </p>
            )}
          </div>
          <HorizontalBarList
            rows={tagBreakdown.map((t) => ({ label: t.tag, count: t.count }))}
          />
        </div>
      )}

      {languageBreakdown.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Languages Used
          </p>
          <HorizontalBarList
            rows={languageBreakdown.map((l) => ({ label: l.language, count: l.count }))}
          />
        </div>
      )}

      {verdictBreakdown.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Verdicts
          </p>
          {acceptanceRate != null && (
            <p className="mb-2 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{acceptanceRate.toFixed(1)}%</span> acceptance rate
            </p>
          )}
          <HorizontalBarList
            rows={verdictBreakdown.slice(0, 5).map((v) => ({
              label: v.verdict,
              count: v.count,
              color: v.verdict === "Accepted" ? "#22c55e" : undefined,
            }))}
            color="#ef4444"
          />
        </div>
      )}

      {submissionCalendar.length > 0 && (
        <ActivityHeatmapCalendar days={submissionCalendar} color="codeforces" label="submissions" />
      )}

      {recentSubmissions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Submissions
          </p>
          <CodeforcesSubmissionsPanel submissions={recentSubmissions} />
        </div>
      )}
    </div>
  );
}

// CodeChef's recent-submissions timestamps look like "09:45 PM 04/03/26" (MM/DD/YY).
function timeAgoCodeChef(dateStr: string) {
  const match = dateStr.match(/(\d{1,2}):(\d{2}) (AM|PM) (\d{2})\/(\d{2})\/(\d{2})/);
  if (!match) return dateStr;
  const [, hh, mm, ampm, mo, dd, yy] = match;
  let hour = Number(hh) % 12;
  if (ampm === "PM") hour += 12;
  const then = new Date(2000 + Number(yy), Number(mo) - 1, Number(dd), hour, Number(mm)).getTime();
  const days = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function CodeChefModalBody({ data }: { data: CodeChefData }) {
  const {
    rating,
    highestRating,
    stars,
    division,
    globalRank,
    countryRank,
    country,
    institution,
    studentStatus,
    contestsAttended,
    ratingHistory,
    badges,
    submissions,
    submissionCalendar,
  } = data;

  const chartHistory = ratingHistory.map((h) => ({
    contestName: h.contestName,
    rating: h.rating,
    date: h.date,
  }));

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-bold">
              {stars > 0 && (
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "#5B4638" }}
                >
                  {stars}★
                </span>
              )}
              {division != null && (
                <span className="text-muted-foreground text-sm font-normal">
                  Division {division}
                </span>
              )}
            </p>
            {(institution || country) && (
              <p className="text-xs text-muted-foreground">
                {[studentStatus, institution, country].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div className="flex gap-5 text-right">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Global Rank
              </p>
              <p className="text-sm font-bold tabular-nums">
                {globalRank ? `#${globalRank.toLocaleString()}` : "—"}
              </p>
            </div>
            {countryRank != null && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Country Rank
                </p>
                <p className="text-sm font-bold tabular-nums">#{countryRank.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {chartHistory.length > 1 && (
          <>
            <div className="my-3 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs border-t border-border/50 pt-3">
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Current Rating
                </p>
                <p className="text-xl font-extrabold tabular-nums">{rating}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Highest Rating
                </p>
                <p className="text-sm font-bold tabular-nums">{highestRating}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wide text-muted-foreground text-[10px]">
                  Contests
                </p>
                <p className="text-sm font-bold tabular-nums">{contestsAttended}</p>
              </div>
            </div>
            <RatingChart history={chartHistory} />
          </>
        )}
      </div>

      {badges.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Badges
          </p>
          <CodeChefBadgesPanel badges={badges} />
        </div>
      )}

      {submissionCalendar.length > 0 && (
        <ActivityHeatmapCalendar days={submissionCalendar} color="codechef" label="submissions" />
      )}

      {submissions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Submissions
          </p>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border/50 divide-y divide-border/50">
            {submissions.map((sub, i) => (
              <a
                key={sub.problemUrl + sub.submittedAt + i}
                href={sub.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate font-medium">{sub.problemCode}</span>
                  <span
                    className={cn(
                      "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      sub.accepted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/15 text-red-600 dark:text-red-400"
                    )}
                  >
                    {sub.accepted ? "Accepted" : sub.result || "Failed"}
                  </span>
                  {sub.language && (
                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                      {sub.language}
                    </span>
                  )}
                </span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {timeAgoCodeChef(sub.submittedAt)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HackerRankModalBody({ data }: { data: HackerRankData }) {
  const { totalBadges, badges, skills, submissionCalendar } = data;

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Badges — {totalBadges}
        </p>
        <HackerRankBadgesPanel badges={badges} />
      </div>

      {skills.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {submissionCalendar.length > 0 && (
        <ActivityHeatmapCalendar days={submissionCalendar} color="hackerrank" label="submissions" />
      )}
    </div>
  );
}

function GithubModalBody({ data, username }: { data: GitHubData; username: string }) {
  const [calendar, setCalendar] = useState(data.contributionCalendar);
  const [selectedYear, setSelectedYear] = useState(
    data.contributionYears[0] ?? new Date().getFullYear()
  );
  const [calendarLoading, setCalendarLoading] = useState(false);

  const handleYearChange = (year: number) => {
    if (year === selectedYear) return;
    setSelectedYear(year);
    setCalendarLoading(true);

    fetch(`/api/coding-stats/github/${username}?year=${year}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.ok) {
          setCalendar(json.contributionCalendar ?? []);
        }
      })
      .catch(() => {
        // Keep the previously-shown year's data on failure.
      })
      .finally(() => setCalendarLoading(false));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border/50 bg-muted/40 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Followers</dt>
          <dd className="mt-1 text-base font-bold tabular-nums">{data.followers}</dd>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/40 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Following</dt>
          <dd className="mt-1 text-base font-bold tabular-nums">{data.following}</dd>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/40 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Stars</dt>
          <dd className="mt-1 text-base font-bold tabular-nums">{data.totalStars}</dd>
        </div>
      </div>

      <ActivityHeatmapCalendar
        days={calendar}
        color="github"
        label="contributions"
        years={data.contributionYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        loading={calendarLoading}
      />
    </div>
  );
}

function ProfileModal({
  profile,
  state,
  onClose,
}: {
  profile: CodingProfile;
  state: FetchState | undefined;
  onClose: () => void;
}) {
  const Icon = profile.icon;
  const details = getDetailRows(profile, state);
  const headline = getHeadline(profile, state);
  const chart = renderChart(profile, state);
  const live = !profile.manual;
  const isLoading = !profile.manual && (!state || state.status === "loading");
  const isError = !profile.manual && state?.status === "error";

  const bodyRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasMoreBelow(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    };

    checkOverflow();
    el.addEventListener("scroll", checkOverflow, { passive: true });
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", checkOverflow);
      resizeObserver.disconnect();
    };
  }, [isLoading, isError]);

  const scrollForMore = () => {
    bodyRef.current?.scrollBy({ top: 240, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
      >
        {/* Colored header band */}
        <div
          className="relative shrink-0 overflow-hidden px-6 pb-6 pt-6 sm:px-7 sm:pt-7"
          style={{
            background: `linear-gradient(180deg, ${profile.color}14, transparent)`,
          }}
        >
          <span
            className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full blur-3xl"
            style={{ backgroundColor: profile.color, opacity: 0.15 }}
          />

          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style={{
                backgroundColor: profile.color + "1c",
                boxShadow: `inset 0 0 0 1px ${profile.color}35`,
              }}
            >
              <Icon className="h-7 w-7" style={{ color: profile.color }} />
            </span>
            <div className="min-w-0">
              <h3 id="profile-modal-title" className="text-lg font-bold leading-tight">
                {profile.label}
              </h3>
              <p className="truncate text-sm text-muted-foreground">@{profile.username}</p>
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <span className="relative flex h-1.5 w-1.5">
                {live && (
                  <span className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500/60" />
                )}
                <span
                  className={cn(
                    "relative h-1.5 w-1.5 rounded-full",
                    live ? "bg-emerald-500" : "bg-muted-foreground/40"
                  )}
                />
              </span>
              <span className={live ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                {live ? "Live stats" : "Updated manually"}
              </span>
            </span>

            {!isLoading && !isError && headline.value !== "—" && (
              <span className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold leading-none" style={{ color: profile.color }}>
                  {headline.value}
                </span>
                <span className="text-xs text-muted-foreground">{headline.label}</span>
              </span>
            )}
          </div>
        </div>

        <div
          ref={bodyRef}
          className="min-h-0 overflow-y-auto px-6 pb-6 sm:px-7 sm:pb-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {isLoading ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
                <div className="h-16 animate-pulse rounded-xl bg-muted" />
              </div>
              <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
            </div>
          ) : isError ? (
            <p className="pt-2 text-sm text-muted-foreground">
              Couldn&apos;t load live stats right now — check the real profile instead.
            </p>
          ) : profile.platform === "gfg" && state?.status === "success" ? (
            <GfgModalBody data={state.data as GfgData} />
          ) : profile.platform === "github" && state?.status === "success" ? (
            <GithubModalBody data={state.data as GitHubData} username={profile.username} />
          ) : profile.platform === "leetcode" && state?.status === "success" ? (
            <LeetCodeModalBody
              data={state.data as LeetCodeData}
              profileUrl={profile.profileUrl}
            />
          ) : profile.platform === "codeforces" && state?.status === "success" ? (
            <CodeforcesModalBody data={state.data as CodeforcesData} />
          ) : profile.platform === "codechef" && state?.status === "success" ? (
            <CodeChefModalBody data={state.data as CodeChefData} />
          ) : profile.platform === "hackerrank" && state?.status === "success" ? (
            <HackerRankModalBody data={state.data as HackerRankData} />
          ) : (
            <>
              {details.length > 0 && (
                <dl className="grid grid-cols-2 gap-2.5 pt-2">
                  {details.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-xl border border-border/50 bg-muted/40 p-3"
                    >
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-base font-bold tabular-nums">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {chart && (
                <div className="mt-5 rounded-xl border border-border/50 bg-muted/30 p-4">
                  {chart}
                </div>
              )}
            </>
          )}

          <Link
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: profile.color }}
          >
            <ExternalLink className="h-4 w-4" />
            View My Profile
          </Link>
        </div>

        <AnimatePresence>
          {hasMoreBelow && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={scrollForMore}
              aria-label="Scroll down for more"
              className="pointer-events-auto absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-card via-card/90 to-transparent pb-2 pt-8"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background shadow-sm text-muted-foreground animate-bounce">
                <ChevronDown className="h-4 w-4" />
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function CodingProfiles() {
  const [statesByPlatform, setStatesByPlatform] = useState<Record<string, FetchState>>({});
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);

  useEffect(() => {
    const controllers: AbortController[] = [];

    codingProfiles.forEach((profile) => {
      if (profile.manual) return;

      const ctrl = new AbortController();
      controllers.push(ctrl);

      setStatesByPlatform((prev) => ({ ...prev, [profile.platform]: { status: "loading" } }));

      fetch(`/api/coding-stats/${profile.platform}/${profile.username}`, {
        signal: ctrl.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setStatesByPlatform((prev) => ({
            ...prev,
            [profile.platform]: data?.ok
              ? { status: "success", data }
              : { status: "error" },
          }));
        })
        .catch((err) => {
          // Ignore abort errors — component unmounted intentionally
          if (err?.name === "AbortError") return;
          setStatesByPlatform((prev) => ({
            ...prev,
            [profile.platform]: { status: "error" },
          }));
        });
    });

    return () => controllers.forEach((c) => c.abort());
  }, []);

  const activeProfile = codingProfiles.find((p) => p.platform === openPlatform);

  return (
    <section id="coding-profiles" className="relative py-20 md:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[20rem] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="container px-4 mx-auto max-w-5xl">
        <SectionHeading
          title="Coding Profiles"
          subtitle="Where I practice, compete, and ship — click a platform for the full picture"
        />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {codingProfiles.map((profile) => (
            <ProfileTile
              key={profile.platform}
              profile={profile}
              state={statesByPlatform[profile.platform]}
              onOpen={() => setOpenPlatform(profile.platform)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProfile && (
          <ProfileModal
            profile={activeProfile}
            state={statesByPlatform[activeProfile.platform]}
            onClose={() => setOpenPlatform(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
