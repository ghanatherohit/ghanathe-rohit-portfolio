"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { SkillCard } from "./ui/SkillCard";
import * as fa from "react-icons/fa"
import * as si from 'react-icons/si'
import * as tb from 'react-icons/tb'
import * as cg from 'react-icons/cg'

const SKILLS_DATA = {
  "Frontend Development": [
    { name: "HTML5", icon: fa.FaHtml5, color: "#E34F26" },
    { name: "CSS3", icon: fa.FaCss3Alt, color: "#1572B6" },
    { name: "JavaScript", icon: si.SiJavascript, color: "#F7DF1E" },
    { name: "Bootstrap", icon: si.SiBootstrap, color: "#7952B3" },
    { name: "Tailwind CSS", icon: si.SiTailwindcss, color: "#06B6D4" },
    { name: "React.js", icon: fa.FaReact, color: "#61DAFB" },
    { name: "Next.js", icon: si.SiNextdotjs, color: "#002222" },
  ],
  "Backend Development": [
    { name: "Node.js", icon: fa.FaNodeJs, color: "#339933" },
    { name: "Express.js", icon: si.SiExpress, color: "#999" },
    { name: "MySQL", icon: si.SiMysql, color: "#4479A1" },
    { name: "MongoDB", icon: si.SiMongodb, color: "#47A248" },
    { name: "REST APIs", icon: tb.TbApi, color: "#FF5733" },
  ],
  "Programming Languages": [
    { name: "C++", icon: cg.CgCPlusPlus, color: "#00599C" },
    { name: "Python", icon: si.SiPython, color: "#3776AB" },
    { name: "Java", icon: fa.FaJava, color: "#007396" },
    { name: "JavaScript", icon: si.SiJavascript, color: "#F7DF1E" },
  ],
  "Development Tools": [
    { name: "Git", icon: fa.FaGitAlt, color: "#F05032" },
    { name: "GitHub", icon: fa.FaGithub, color: "#888" },
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
