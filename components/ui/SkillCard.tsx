"use client";
import React from "react";
import { motion } from "framer-motion";

interface SkillCardProps {
  name: string;
  Icon: React.ElementType;
  index: number;
  color: string;
}

export const SkillCard = ({ name, Icon, index, color }: SkillCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="p-4 border rounded-lg bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
  >
    <div className="flex items-center gap-3">
      <Icon className="size-5 md:size-7 shrink-0" style={{ color }} />
      <p className="font-medium text-sm leading-tight">{name}</p>
    </div>
  </motion.div>
);
