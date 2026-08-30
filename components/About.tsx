"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FileText } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";

const stats = [
  { label: "Projects Completed", value: "10+" },
  { label: "Coding Competitions Won", value: "2" },
  { label: "Certifications", value: "3+" },
  { label: "Technologies", value: "15+" },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 overflow-hidden">
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
                Aspiring Full Stack Web Developer
              </h3>

              <p className="text-muted-foreground text-balance">
                I&apos;m an aspiring Full Stack Web Developer skilled in
                JavaScript, React.js, Node.js, MySQL, and MongoDB.
                Experienced in building responsive web applications and
                REST APIs. Passionate about developing efficient and
                user-friendly web solutions.
              </p>

              <p className="text-muted-foreground">
                I believe that great development is about more than just
                writing code &mdash; it&apos;s about solving real problems and
                creating intuitive, enjoyable experiences for users.
                Whether it&apos;s a full-stack web app, an e-commerce
                platform, or a fitness application, I bring my commitment
                to clean code and user-centered thinking to every project.
              </p>

              <p className="text-muted-foreground">
                I&apos;ve secured 1st and 2nd place in inter-college coding
                competitions, organized technical events attended by 100+
                students, and represented my college in inter-college
                football tournaments &mdash; demonstrating teamwork and
                leadership both on and off the field.
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
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur-2xl opacity-70 animate-pulse dark:opacity-90" />
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-background shadow-xl dark:border-background/80">
                <Image
                  src="/rohit-pic.jpg"
                  alt="Ghanathe Rohit — Full Stack Web Developer"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 256px, 288px"
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
    </section>
  );
}
