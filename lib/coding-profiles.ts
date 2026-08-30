import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiGithub,
  SiHackerrank,
} from "react-icons/si";
import type { IconType } from "react-icons";

// Fill in your real handle for each platform.
const USERNAMES = {
  github: "ghanatherohit",
  leetcode: "ghanatherohit",
  codeforces: "GhanatheRohit",
  codechef: "ghantherohit",
  gfg: "ghanatherohit",
  hackerrank: "2004ghantherohit",
};

export interface CodingProfile {
  platform: "github" | "codeforces" | "leetcode" | "codechef" | "gfg" | "hackerrank";
  label: string;
  username: string;
  profileUrl: string;
  icon: IconType;
  color: string;
  /** For platforms with no reliable API — statically maintained stats. */
  manual?: {
    headline: { label: string; value: string };
    details: { label: string; value: string }[];
  };
}

/** Codeforces' official rating-to-color scale (matches the rank colors shown on codeforces.com). */
export function cfRatingColor(rating: number): string {
  if (rating < 1200) return "#808080"; // newbie (gray)
  if (rating < 1400) return "#008000"; // pupil (green)
  if (rating < 1600) return "#03a89e"; // specialist (cyan)
  if (rating < 1900) return "#0000ff"; // expert (blue)
  if (rating < 2100) return "#aa00aa"; // candidate master (violet)
  if (rating < 2300) return "#ff8c00"; // master (orange)
  if (rating < 2400) return "#ff8c00"; // international master (orange)
  if (rating < 2600) return "#ff0000"; // grandmaster (red)
  if (rating < 3000) return "#ff0000"; // international grandmaster (red)
  return "#aa0000"; // legendary grandmaster (dark red)
}

export const codingProfiles: CodingProfile[] = [
  {
    platform: "github",
    label: "GitHub",
    username: USERNAMES.github,
    profileUrl: `https://github.com/${USERNAMES.github}`,
    icon: SiGithub,
    color: "#6e7681",
  },
  {
    platform: "leetcode",
    label: "LeetCode",
    username: USERNAMES.leetcode,
    profileUrl: `https://leetcode.com/${USERNAMES.leetcode}/`,
    icon: SiLeetcode,
    color: "#FFA116",
  },
  {
    platform: "codeforces",
    label: "Codeforces",
    username: USERNAMES.codeforces,
    profileUrl: `https://codeforces.com/profile/${USERNAMES.codeforces}`,
    icon: SiCodeforces,
    color: "#1F8ACB",
  },
  {
    platform: "codechef",
    label: "CodeChef",
    username: USERNAMES.codechef,
    profileUrl: `https://www.codechef.com/users/${USERNAMES.codechef}`,
    icon: SiCodechef,
    color: "#5B4638",
  },
  {
    platform: "gfg",
    label: "GeeksforGeeks",
    username: USERNAMES.gfg,
    profileUrl: `https://www.geeksforgeeks.org/user/${USERNAMES.gfg}/`,
    icon: SiGeeksforgeeks,
    color: "#2F8D46",
  },
  {
    platform: "hackerrank",
    label: "HackerRank",
    username: USERNAMES.hackerrank,
    profileUrl: `https://www.hackerrank.com/profile/${USERNAMES.hackerrank}`,
    icon: SiHackerrank,
    color: "#00EA64",
  },
];
