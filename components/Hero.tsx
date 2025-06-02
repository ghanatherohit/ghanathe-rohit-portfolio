"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Typing from "typewriter-effect";

const TYPING_WORDS = [
  "Web Developer",
  "Full-Stack MERN Developer",
  "Tech Enthusiast",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer",
  "Creative Coder",
  "Tech Innovator",
  "Problem Solver",
  "Creative Solutions",
  "UI/UX Designer",
  "Digital Innovation",
  "User-Centric Design",
  "Responsive Design",
  "Performance Optimization",
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex flex-col items-center justify-center min-h-screen h-fit px-4"
    >
      <motion.div
        // Initial motion styles for the hero section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Using transform styles based on scroll position
        style={{ y, opacity }}
        className="container max-w-4xl mx-auto text-center flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
            Hi, I'm{" "}
            <span className="text-primary text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
              Ghanathe Rohit
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary"
        >
          Available for new projects
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl opacity-80 dark:bg-primary/20 dark:opacity-80" />
            <div className="relative font-bold mb-2">
              Crafting Digital <br className="hidden sm:block" />
              <span className="text-primary">Experiences</span> That Matter
            </div>
          </div>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-primary mb-8"
        >
          <Typing
            options={{
              strings: TYPING_WORDS,
              autoStart: true,
              loop: true,
              cursor: "|",
              delay: 75,
              deleteSpeed: 50,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#projects"
            className="flex items-center hover:bg-primary/80 bg-primary px-4 py-2 rounded-md transition-color text-white"
          >
            View My Work
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="flex items-center justify-between bg-primary/10 rounded-full p-2 ml-2"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
          <Link
            href="#contact"
            className="bg-transparent text-black border border-black hover:bg-primary/10 px-4 py-2 rounded-md transition-color dark:text-white dark:border-white dark:hover:bg-primary/10"
          >
            Contact Me
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#about"
          className="flex flex-col items-center text-sm text-foreground/60 hover:text-primary transition-colors"
        >
          <span className="mb-2">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
