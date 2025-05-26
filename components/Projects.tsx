"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";

// Project categories
const categories = [
  "All",
  "E-commerce",
  "UI/UX",
  "MERN",
  "React.js+Vite",
  "React.js+Next.js",
  "Full Stack",
  "Frontend",
  "Backend",
  "Web Design",
];

// Project data
const projects = [
  {
    id: 1,
    title: "Books Store",
    description:
      "An e-commerce platform for buying books, with a catalog, cart, and user authentication. Built with React.js, Vite, Tailwind CSS, integrated with Firebase for authentication, Redux for state management, JWT for secure API calls, MongoDB for database, and Express.js for backend.",
    image: "/BooksStore.png",
    category: [
      "E-commerce",
      "MERN",
      "React.js+Vite",
      "Frontend",
      "Backend",
      "Web Design",
      "Full Stack",
      "UI/UX",
    ],
    tags: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Tailwind CSS",
      "Redux",
      "Firebase",
      "JWT",
      "Vite",
    ],
    demoUrl: "https://book-store-app-frontend-phi.vercel.app",
    codeUrl: "https://github.com/ghanatherohit/book-store-app-frontend",
    featured: true,
  },
  {
    id: 2,
    title: "Personal Portfolio Website",
    description:
      "A personal portfolio website showcasing my projects and skills. Built with React.js, Next.js, and Tailwind CSS, featuring a responsive design and smooth animations.",
    image: "/Portfolio.png",
    category: ["UI/UX", "React.js+Next.js", "Frontend", "Web Design"],
    tags: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
    demoUrl: "https://rohit-portfolio.vercel.app",
    codeUrl: "",
    featured: true,
  },
  {
    id: 3,
    title: "Grocery Store",
    description:
      "A grocery store application built with MERN stack, featuring a user-friendly interface for browsing and purchasing groceries. Integrated with Stripe for secure payments.",
    image: "/GroceryStore.png",
    category: [
      "E-commerce",
      "MERN",
      "React.js+Next.js",
      "Frontend",
      "Backend",
      "Web Design",
      "Full Stack",
      "UI/UX",
    ],
    tags: [
      "React.js",
      "Next.js",
      "TypeScript",
      "MongoDB",
      "Node.js",
      "Express.js",
      "JWT",
      "Stripe",
      "Tailwind CSS",
      "Redux",
    ],
    demoUrl: "",
    codeUrl: "",
    featured: true,
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const ref = useRef<HTMLElement>(null);
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category.includes(activeCategory));
  return (
    <section id="projects" ref={ref} className="py-20 md:py-32">
      <motion.div className="container px-4 mx-auto">
        <SectionHeading
          title="My Projects"
          subtitle="A showcase of my work and skills"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 mb-8 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-gray-800"
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
