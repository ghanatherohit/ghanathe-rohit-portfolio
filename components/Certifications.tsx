"use client";

import React from "react";
import SectionHeading from "./ui/SectionHeading";
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const certifications = [
  {
    title: "Smart Coder",
    institution: "Smart Interviews",
    year: "2024",
    link: "https://smartinterviews.in/certificate/f2f938cb",
    img: "/certifications/smart-coder.png",
    color: "#6366f1",
  },
  {
    title: "SQL and Relational Databases 101",
    institution: "IBM Cognitive Class",
    year: "2024",
    link: "https://courses.cognitiveclass.ai/certificates/dd5616c02ade456da8ee2505c1119748",
    img: "/certifications/sql-and-relational-databases-101.png",
    color: "#0ea5e9",
  },
  {
    title: "Responsive Web Design",
    institution: "freeCodeCamp",
    year: "2024",
    link: "https://www.freecodecamp.org/certification/ghanatherohit/responsive-web-design",
    img: "/certifications/responsive-web-design.png",
    color: "#8b5cf6",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-32">
      <div className="container px-4 mx-auto max-w-6xl">
        <SectionHeading
          title="Certifications"
          subtitle="Credentials that validate my technical expertise"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500"
            >
              {/* Certificate image */}
              <div className="relative overflow-hidden bg-muted">
                <Image
                  src={cert.img}
                  alt={`${cert.title} certification earned by Ghanathe Rohit`}
                  width={800}
                  height={600}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors duration-200 shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Certificate
                  </Link>
                </div>

                {/* Year badge */}
                <div
                  className="absolute top-3 right-3 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm"
                  style={{ backgroundColor: cert.color + "dd" }}
                >
                  {cert.year}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cert.color + "18" }}
                  >
                    <Award
                      className="h-4 w-4"
                      style={{ color: cert.color }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {cert.institution}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-auto border-t border-border/40">
                  <Link
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Verify Credential
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
