"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, Calendar } from "lucide-react";

function isExternal(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string[];
    tags: string[];
    demoUrl: string;
    codeUrl: string;
    featured: boolean;
    pushedAt?: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {isExternal(project.image) ? (
          <Image
            src={project.image}
            alt={`${project.title} project by Ghanathe Rohit`}
            fill
            unoptimized
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <Image
            src={project.image || "/placeholder.svg"}
            alt={`${project.title} project by Ghanathe Rohit`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Hover overlay with quick links */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4 gap-3">
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 shadow-lg"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </Link>
          )}
          <Link
            href={project.codeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/90 text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 shadow-lg"
            onClick={(e) => {
              if (!project.codeUrl) {
                e.preventDefault();
              }
            }}
          >
            <Github className="h-3.5 w-3.5" />
            Source Code
          </Link>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title + date row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          {project.pushedAt && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap mt-0.5">
              <Calendar className="h-3 w-3" />
              {formatDate(project.pushedAt)}
            </span>
          )}
        </div>

        {/* Description — clamped to 2 lines */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-primary/8 text-primary border border-primary/15 dark:bg-primary/15 dark:border-primary/25"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/50 mt-1">
          {project.demoUrl ? (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground/60 italic">
              No live demo
            </span>
          )}
          <span className="h-3.5 w-px bg-border/60" />
          <Link
            href={project.codeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => {
              if (!project.codeUrl) e.preventDefault();
            }}
          >
            <Github className="h-3.5 w-3.5" />
            View Code
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
