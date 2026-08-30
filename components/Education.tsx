"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const education = [
  {
    level: "Undergraduate",
    school: "CMR Engineering College, Hyderabad",
    year: "2022 – 2026",
    degree: "B.Tech in Computer Science and Engineering (Data Science)",
  },
  {
    level: "Intermediate",
    school: "Sri Chaitanya Junior College",
    year: "2020 – 2022",
    degree: "Intermediate Education (Mathematics, Physics, Chemistry)",
  },
  {
    level: "Secondary School",
    school: "Kotwal's School",
    year: "2020",
    degree: "Secondary School Certificate",
  },
];

const DOT_EPSILON = 0.02;

function TimelineDot({
  index,
  scrollYProgress,
  timelineRef,
}: {
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  timelineRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const [threshold, setThreshold] = useState(DOT_EPSILON);

  useEffect(() => {
    function measure() {
      const dotEl = dotRef.current;
      const timelineEl = timelineRef.current;
      if (!dotEl || !timelineEl) return;

      // Position the dot's own vertical center as a fraction of the timeline's
      // total height, so the glow threshold matches where the fill line
      // actually reaches — the rows have different heights (varying content),
      // so an assumed even split across items would be wrong. Measured via
      // getBoundingClientRect so it's correct regardless of which element is
      // the dot's absolute-positioning offsetParent.
      const dotRect = dotEl.getBoundingClientRect();
      const timelineRect = timelineEl.getBoundingClientRect();
      const dotCenter = dotRect.top + dotRect.height / 2 - timelineRect.top;
      const timelineHeight = timelineRect.height;
      if (timelineHeight <= 0) return;

      setThreshold(Math.max(DOT_EPSILON, dotCenter / timelineHeight));
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [timelineRef]);

  const reached = useTransform(scrollYProgress, (v) => (v >= threshold ? 1 : 0) as number);
  // The dot itself matches the line's fully-opaque bg-primary exactly once reached.
  const dotColorOpacity = useTransform(reached, [0, 1], [0.25, 1]);
  const ringOpacity = useTransform(reached, [0, 1], [0, 0.5]);
  const ringScale = useTransform(reached, [0, 1], [1, 1.3]);

  return (
    // Static centering lives on a plain div — Framer Motion owns the `transform`
    // property on any motion.* element for its own animated values (scale, x, y),
    // and will silently overwrite Tailwind's -translate-x/y-1/2 utility classes
    // if they're applied to the same motion.div. Keeping them on a separate,
    // non-animated wrapper avoids that clobbering.
    <div
      ref={dotRef}
      className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        viewport={{ once: true }}
        className="w-full h-full rounded-full flex items-center justify-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-primary"
          style={{ opacity: ringOpacity, scale: ringScale }}
        />
        <motion.div
          className="relative w-5 h-5 rounded-full bg-primary"
          style={{ opacity: dotColorOpacity }}
        />
      </motion.div>
    </div>
  );
}

export default function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="education" className="py-20 md:py-32">
      <div className="container px-4 mx-auto">
        <SectionHeading
          title="Education"
          subtitle="My academic journey"
        />

        <div className="mt-10 p-6 md:p-16 bg-background/50 rounded-lg shadow-lg backdrop-blur-sm border border-primary/10">
          <div ref={timelineRef} className="relative">
            {/* Timeline line — base track + scroll-filled progress */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-primary/20" />
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-1 bg-primary origin-top"
              style={{ height: fillHeight }}
            />

            {education.map((edu, index) => (
              <motion.div
                key={edu.level}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
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
                <TimelineDot
                  index={index}
                  scrollYProgress={scrollYProgress}
                  timelineRef={timelineRef}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
