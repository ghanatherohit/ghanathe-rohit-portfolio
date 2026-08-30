"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

interface Job {
  role: string;
  company: string;
  companyUrl: string | null;
  logo: string | null;
  location: string;
  remote: boolean;
  startDate: string;
  endDate: string | null;
  type: string;
  description: string;
  highlights: string[];
  tech: string[];
  current: boolean;
}

function parseMonth(date: string): Date {
  const [year, month] = date.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = parseMonth(startDate);
  const end = endDate ? parseMonth(endDate) : new Date();

  const startLabel = formatMonthYear(start);
  const endLabel = endDate ? formatMonthYear(end) : "Present";

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  months = Math.max(months, 1);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo`);

  return `${startLabel} – ${endLabel} · ${parts.join(" ")}`;
}

const experience: Job[] = [
  {
    role: "Development Trainee",
    company: "DKM Online | Payroll, HR & Compliance Solutions",
    companyUrl: "https://www.linkedin.com/company/dkmonline/",
    logo: "/experience/DKM_Logo.png",
    location: "Chennai, India",
    remote: true,
    startDate: "2026-08",
    endDate: null,
    type: "On Job Trainee (OJT)",
    description:
      "Building and shipping customer-facing features for a SaaS platform, working closely with design and backend teams to take ideas from Figma to production.",
    highlights: [
      "Building reusable Qwik and TypeScript components to speed up new feature development",
      "Integrating REST APIs with PHP, MongoDB, and Redis for real-time reporting",
      "Improving page load performance and overall Lighthouse scores across key pages",
    ],
    tech: ["Qwik", "PHP", "TypeScript", "Tailwind CSS", "REST APIs", "MongoDB", "Redis", "Git", "GitHub"],
    current: true,
  },
  {
    role: "Developer Intern",
    company: "HCL Guvi",
    companyUrl: "https://www.linkedin.com/company/guviofficial/",
    logo: "/experience/hcl-guvi.png",
    location: "Chennai, India",
    remote: true,
    startDate: "2026-05",
    endDate: "2026-08",
    type: "Internship",
    description:
      "Built and shipped customer-facing features for a SaaS platform, working closely with design and backend teams to take ideas from Figma to production.",
    highlights: [
      "Developed reusable Qwik and TypeScript components, cutting new feature build time by ~30%",
      "Designed and integrated REST APIs with PHP, MongoDB, and Redis for real-time reporting",
      "Optimized page load performance, improving Lighthouse scores from 68 to 94",
    ],
    tech: ["Qwik", "PHP", "TypeScript", "Tailwind CSS", "REST APIs", "MongoDB", "Redis", "Git", "GitHub"],
    current: false,
  },
];

const sortedExperience = [...experience].sort((a, b) => {
  if (a.current !== b.current) return a.current ? -1 : 1;
  return 0;
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Experience() {
  return (
    <section id="experience" className="relative py-20 md:py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 mx-auto max-w-4xl">
        <SectionHeading
          title="Experience"
          subtitle="Where I've applied my skills to build real-world solutions"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mt-16"
        >
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:left-6" />

          <div className="space-y-10">
            {sortedExperience.map((job) => (
              <motion.div
                key={`${job.company}-${job.role}`}
                variants={itemVariants}
                className="relative pl-14 md:pl-20"
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background shadow-md dark:bg-background/80 md:h-12 md:w-12">
                  {job.logo ? (
                    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white md:h-9 md:w-9">
                      <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        fill
                        sizes="36px"
                        className="object-contain p-1"
                      />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary md:h-9 md:w-9",
                        job.current && "animate-pulse"
                      )}
                    >
                      <Briefcase className="h-4 w-4 md:h-4.5 md:w-4.5" />
                    </span>
                  )}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    "group relative rounded-2xl border bg-gradient-to-br from-card/90 to-card p-6 md:p-8",
                    "shadow-sm hover:shadow-xl transition-all duration-500 backdrop-blur-sm",
                    job.current
                      ? "border-primary/40 hover:border-primary/60 hover:shadow-primary/10"
                      : "border-border/60 hover:border-primary/40 hover:shadow-primary/10"
                  )}
                >
                  {job.current && (
                    <span className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-primary" />
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold leading-tight">
                        {job.role}
                      </h3>
                      {job.companyUrl ? (
                        <Link
                          href={job.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-2"
                        >
                          {job.company}
                        </Link>
                      ) : (
                        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          {job.company}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {job.type}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "flex items-center gap-1.5",
                        job.current && "font-medium text-primary"
                      )}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateRange(job.startDate, job.endDate)}
                      {job.current && (
                        <span className="relative ml-0.5 flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                        {job.remote ? "Remote" : "On-site"}
                      </span>
                    </span>
                  </div>

                  <p className="mt-4 text-muted-foreground font-medium">
                    {job.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                        <span className="text-foreground/80">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border/40 pt-5">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs font-medium text-foreground/70 group-hover:border-primary/20 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
