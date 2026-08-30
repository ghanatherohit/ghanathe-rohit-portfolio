"use client";

import { motion } from "framer-motion";
import { Hammer, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOW_DATA } from "@/lib/now";

const items = [
  {
    icon: Hammer,
    prefix: "Building",
    label: NOW_DATA.building.label,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BookOpen,
    prefix: "Learning",
    label: NOW_DATA.learning.label,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Target,
    prefix: "Goal",
    label: NOW_DATA.goal.label,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function Now() {
  return (
    <section id="now" className="py-10 md:py-14">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/50",
            "bg-gradient-to-br from-card/90 to-card backdrop-blur-sm p-6 md:p-8"
          )}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                What I&apos;m up to right now
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date(NOW_DATA.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.prefix}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-background/40 border border-border/40"
              >
                <div className={cn("flex-shrink-0 p-2 rounded-lg", item.bg)}>
                  <item.icon className={cn("h-4 w-4", item.color)} />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {item.prefix}
                  </div>
                  <p className="text-sm text-foreground/90 leading-snug">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
