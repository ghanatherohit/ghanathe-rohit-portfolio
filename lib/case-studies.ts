/**
 * Manually-curated case study content, keyed by GitHub repo name.
 * Projects without an entry here just show the standard card — no case study button.
 */

export interface CaseStudy {
  problem: string;
  solution: string;
  techChoices: { choice: string; reason: string }[];
  challenges: string;
  learned: string;
  impact?: string;
}

export const caseStudies: Record<string, CaseStudy> = {
  "book-store-app-frontend": {
    problem:
      "Readers browsing an online bookstore needed a fast way to search, filter, and purchase books without a cluttered UI slowing them down.",
    solution:
      "Built a React-based storefront with client-side filtering, a persistent cart, and a checkout flow that talks to a REST backend for inventory and orders.",
    techChoices: [
      {
        choice: "React with component-level state",
        reason: "The catalog and cart didn't need a global store — prop drilling stayed shallow enough that Redux would have been overhead, not help.",
      },
      {
        choice: "REST over GraphQL",
        reason: "The data shape was simple and fixed (books, cart, orders); REST kept the backend small and easy to reason about.",
      },
    ],
    challenges:
      "Keeping the cart in sync across tabs and page reloads without a backend session required careful localStorage handling and edge-case testing around stale cart items.",
    learned:
      "Client-side state that has to survive reloads is trickier than it looks — I now default to persisting derived state explicitly rather than assuming React state is 'enough'.",
  },
  "elevate-fit": {
    problem:
      "People starting a fitness routine often abandon it within weeks because generic plans don't adapt to their progress.",
    solution:
      "Built a full-stack fitness tracker where users log workouts and the app surfaces trends (volume, frequency) to help them see progress and stay motivated.",
    techChoices: [
      {
        choice: "MongoDB over MySQL",
        reason: "Workout logs are naturally document-shaped (varying sets/reps per exercise) — a rigid relational schema would have meant constant migrations.",
      },
      {
        choice: "Node.js + Express backend",
        reason: "Kept the whole stack in JavaScript so I could share validation logic and move faster as a solo developer.",
      },
    ],
    challenges:
      "Designing a data model flexible enough for arbitrary exercise types while still making aggregate queries (weekly volume, PRs) fast and simple.",
    learned:
      "Schema flexibility and query simplicity are often in tension — I learned to model for the 2-3 queries that actually matter instead of maximum flexibility.",
  },
  "gold-price-predictor": {
    problem:
      "Gold price movement is influenced by many variables, and casual investors have no simple way to see a data-driven estimate of near-term trends.",
    solution:
      "Built a predictor using historical price data and a regression model, exposed through a simple web interface for quick lookups.",
    techChoices: [
      {
        choice: "Python for the modeling layer",
        reason: "The scientific Python ecosystem (pandas, scikit-learn) made data cleaning and regression far faster to iterate on than reimplementing in JS.",
      },
    ],
    challenges:
      "Historical financial data is noisy and full of gaps — a large part of the effort went into cleaning and normalizing the dataset before the model itself.",
    learned:
      "Model accuracy is capped by data quality, not algorithm choice — I spent disproportionate time on data cleaning once I saw how much it moved results.",
  },
};

export function getCaseStudy(repoName: string): CaseStudy | undefined {
  return caseStudies[repoName];
}
