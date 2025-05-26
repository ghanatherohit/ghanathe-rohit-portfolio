"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

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
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-background border border-border shadow-md dark:bg-background/50"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-0 transition-opacity" />

        {project.featured && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-muted-foreground bg-primary/10 rounded-full border border-primary/20 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="flex gap-4">
          <Link
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white hover:bg-primary/80 bg-primary px-4 py-2 rounded-md transition-colors"
            onClick={(e) => {
              if (!project.demoUrl) {
                e.preventDefault();
                alert("This project is in development. Please check back later.");
              }
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <p className="text-sm">Live Demo</p>
          </Link>

          <Link
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:bg-secondary/80 bg-secondary px-4 py-2 rounded-md transition-colors"
            onClick={(e) => {
              if (!project.codeUrl) {
                e.preventDefault();
                alert("Code link is not available.");
              }
            }}
          >
            <Github className="mr-2 h-4 w-4" />
            View Code
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
