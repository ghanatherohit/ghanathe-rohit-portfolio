"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { SkillCard } from "./ui/SkillCard";
// Named imports only — avoids bundling entire icon packs
import { FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaJava } from "react-icons/fa";
import { SiJavascript, SiBootstrap, SiTailwindcss, SiNextdotjs, SiExpress, SiMysql, SiMongodb, SiPython } from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { CgCPlusPlus } from "react-icons/cg";

const SKILLS_DATA = {
  "Frontend Development": [
    { name: "HTML5", icon: FaHtml5, color: "#E34F26" },
    { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "React.js", icon: FaReact, color: "#61DAFB" },
    { name: "Next.js", icon: SiNextdotjs, color: "#002222" },
  ],
  "Backend Development": [
    { name: "Node.js", icon: FaNodeJs, color: "#339933" },
    { name: "Express.js", icon: SiExpress, color: "#999" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "REST APIs", icon: TbApi, color: "#FF5733" },
  ],
  "Programming Languages": [
    { name: "C++", icon: CgCPlusPlus, color: "#00599C" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Java", icon: FaJava, color: "#007396" },
  ],
  "Development Tools": [
    { name: "Git", icon: FaGitAlt, color: "#F05032" },
    { name: "GitHub", icon: FaGithub, color: "#888" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            title="Skills & Expertise"
            subtitle="Technologies I Work With"
            className="mb-16 text-center"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {Object.entries(SKILLS_DATA).map(([category, skills]) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className={cn(
                "p-6 rounded-2xl",
                "bg-gradient-to-br from-card/90 to-card",
                "border border-border/50 hover:border-primary/50",
                "transition-all duration-500 ease-out",
                "hover:shadow-xl hover:shadow-primary/10",
                "hover:scale-[1.02]",
                "backdrop-blur-sm"
              )}
            >
              <h3 className="text-2xl font-bold mb-6 text-primary/90 bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                {category}
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                {skills.map((skill, index) => (
                  <SkillCard
                    key={skill.name}
                    name={skill.name}
                    Icon={skill.icon}
                    index={index}
                    color={skill.color}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
