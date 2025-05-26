"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";

const education = [
  {
    level: "Undergraduate",
    school: "CMR Engineering College",
    year: "2022 - 2026",
    degree: "B.Tech in Computer Science and Engineering",
  },
  {
    level: "Intermediate",
    school: "Sri Chaitanya Junior College",
    year: "2020 - 2022",
    degree: "Intermediate Education (Mathematics, Physics, Chemistry)",
  },
  {
    level: "Secondary School",
    school: "Kotwal's School",
    year: "2020",
    degree: "Secondary School Certificate",
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const stats = [
    { label: "Projects Completed", value: "10+" },
    { label: "Programming Languages", value: "6+" },
    { label: "Certifications", value: "5+" },
    { label: "Technologies", value: "20+" },
  ];

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 overflow-hidden">
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="About Me"
          subtitle="My journey as a developer and tech enthusiast"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">
                Passionate Full-Stack Developer & Tech Enthusiast
              </h3>

              <p className="text-muted-foreground text-balance">
                I'm a creative full-stack developer with a passion for building
                beautiful, functional, and user-centered digital experiences.
                With 1+ years of experience in the field, I am always looking
                for new and innovative ways to bring my clients' visions to
                life.
              </p>

              <p className="text-muted-foreground">
                I believe that design is about more than just making things look
                pretty - it's about solving problems and creating intuitive,
                enjoyable experiences for users. Whether I'm working on a
                website, or other digital product, I bring my commitment to
                design excellence and user-centered thinking to every project.
              </p>

              <p className="text-muted-foreground">
                I am always looking for new challenges and opportunities to grow
                as a developer. If you're interested in working together, please
                don't hesitate to reach out!
              </p>

              <Link
                href="/Rohit-Resume.pdf"
                target="_blank"
                className="flex items-center text-sm font-medium text-white  transition-colors bg-primary/95 hover:bg-primary/70 rounded-lg py-4 px-6 w-fit"
              >
                <FileText className="mr-2" />
                View Resume
              </Link>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <motion.div
              style={{ scale: imageScale, opacity: imageOpacity }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur-2xl opacity-70 animate-pulse dark:opacity-90" />
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-background shadow-xl dark:border-background/80">
                <Image
                  src="/ProfilePic.jpg"
                  alt="Developer portrait"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="absolute top-5 -right-10 bg-background rounded-lg p-3 shadow-lg dark:bg-background/90">
                <div className="text-xs font-medium text-muted-foreground">
                  Frontend
                </div>
              </div>

              <div className="absolute bottom-5 -left-10 bg-background rounded-lg p-3 shadow-lg dark:bg-background/90">
                <div className="text-xs font-medium text-muted-foreground">
                  Backend
                </div>
              </div>

              <div className="absolute -bottom-10 right-10 bg-background rounded-lg p-3 shadow-lg dark:bg-background/90 text-xs font-medium text-muted-foreground">
                UI/UX
              </div>

              <div className="absolute -top-10 left-10 bg-background rounded-lg p-3 shadow-lg dark:bg-background/90">
                <div className="text-xs font-medium text-muted-foreground">
                  Tech Enthusiast
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl opacity-70 dark:bg-primary/20 dark:opacity-80" />
                  <div className="relative text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-20 p-30 md:p-16 bg-background/50 rounded-lg shadow-lg backdrop-blur-sm border border-primary/10">
        <h3 className="text-4xl font-bold text-center mb-10 ">
          Education
        </h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"/>

          {education.map((edu, index) => (
            <motion.div
              key={edu.level}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex items-center mb-12 ${
                index % 2 === 0 ? "flex-row-reverse" : ""
              }`}
            >
              {/* Timeline content */}
              <div className={`w-1/2 ${index % 2 === 0 ? "pl-8" : "pr-8"}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-background/50 p-6 rounded-lg shadow-lg backdrop-blur-sm border border-primary/10 hover:bg-primary/20 hover:border-primary transition-colors duration-300"
                >
                  <h4 className="text-lg font-semibold text-primary mb-2">
                    {edu.level}
                  </h4>
                  <p className="font-medium">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.year}
                  </p>
                </motion.div>
              </div>

              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="w-8 h-8 bg-primary/20 rounded-full animate-pulse flex items-center justify-center absolute md:left-[49%] left-[46%] transform -translate-x-1/2"
              >
                
                <div className="w-5 h-5 bg-primary rounded-full" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
