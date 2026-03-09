"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";
import { Folder, ArrowUpRight } from "lucide-react";

const GITHUB_USERNAME = "ghanatherohit";

const categories = [
  "All",
  "Full Stack",
  "React.js+Vite",
  "React.js+Next.js",
];

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string[];
  tags: string[];
  demoUrl: string;
  codeUrl: string;
  featured: boolean;
  pushedAt: string;
}

const localImages: Record<string, string> = {
  "book-store-app-frontend": "/BooksStore.png",
  "ghanathe-rohit-portfolio": "/Portfolio.png",
  "elevate-fit": "/ElevateFit.png", 
  "gold-price-predictor": "/GoldPricePredictor.png",
  "nexAuth-UserRegistrationAndLogin": "/NexAuth.png",
};

function getRepoImage(repoName: string): string {
  if (localImages[repoName]) return localImages[repoName];
  return `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repoName}`;
}

function inferCategories(repo: {
  topics?: string[];
  language?: string | null;
}): string[] {
  const cats: string[] = [];
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const lang = (repo.language || "").toLowerCase();

  const isReact =
    topics.includes("react") ||
    topics.includes("reactjs") ||
    lang === "typescript" ||
    lang === "javascript";

  if (isReact) {
    if (topics.includes("nextjs") || topics.includes("next")) {
      cats.push("React.js+Next.js");
    } else {
      cats.push("React.js+Vite");
    }
  }

  if (
    topics.includes("fullstack") ||
    topics.includes("full-stack") ||
    (topics.includes("frontend") && topics.includes("backend"))
  ) {
    cats.push("Full Stack");
  }

  return cats;
}

interface GitHubRepo {
  fork: boolean;
  html_url: string;
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchGitHubRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
          {
            headers: { Accept: "application/vnd.github.mercy-preview+json" },
          }
        );
        if (!res.ok) return;
        const repos: GitHubRepo[] = await res.json();

        const allProjects: Project[] = repos
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              new Date(b.pushed_at).getTime() -
              new Date(a.pushed_at).getTime()
          )
          .map((repo, index) => ({
            id: index + 1,
            title: repo.name
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            description:
              repo.description || "A project built by Rohit Ghanathe.",
            image: getRepoImage(repo.name),
            category: inferCategories(repo),
            tags: repo.topics?.length
              ? repo.topics
              : ([repo.language].filter(Boolean) as string[]),
            demoUrl: repo.homepage || "",
            codeUrl: repo.html_url,
            featured: repo.stargazers_count > 0,
            pushedAt: repo.pushed_at,
          }));

        setProjects(allProjects);
      } catch {
        // Nothing to show on error
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubRepos();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) =>
          project.category.includes(activeCategory)
        );

  return (
    <section id="projects" ref={ref} className="py-20 md:py-32">
      <motion.div className="container px-4 mx-auto max-w-6xl">
        {/* Header */}
        <SectionHeading
          title="My Projects"
          subtitle="Real-world applications I've designed, built, and deployed"
        />

        {/* Stats bar */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-6 mb-10 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Folder className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                {projects.length}
              </span>{" "}
              repositories
            </span>
            <span className="h-4 w-px bg-border" />
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              View GitHub Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        )}

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                activeCategory === category
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {category}
              {activeCategory === category && (
                <span className="ml-2 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {filteredProjects.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Project grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading projects from GitHub...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <Folder className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">
              No projects in this category yet
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="text-sm text-primary hover:underline"
            >
              View all projects
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
