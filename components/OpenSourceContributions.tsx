"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitPullRequest, ExternalLink } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

interface Contribution {
  repo: string;
  title: string;
  url: string;
  number: number;
  mergedAt: string | null;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function OpenSourceContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("/api/github/contributions");
        if (!res.ok) return;
        const data: { contributions: Contribution[] } = await res.json();
        setContributions(data.contributions || []);
      } catch {
        // Network error — section stays hidden
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  if (!loading && contributions.length === 0) return null;

  return (
    <section id="open-source" className="py-20 md:py-32">
      <div className="container px-4 mx-auto max-w-4xl">
        <SectionHeading
          title="Open Source Contributions"
          subtitle="Merged pull requests to projects outside my own repositories"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-10">
            {contributions.map((c, index) => (
              <motion.a
                key={c.url}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-500/10">
                  <GitPullRequest className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground/90 truncate group-hover:text-primary transition-colors">
                    {c.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.repo} · #{c.number} · merged {formatDate(c.mergedAt)}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
