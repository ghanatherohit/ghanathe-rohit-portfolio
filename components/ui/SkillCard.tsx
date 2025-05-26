"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SkillCardProps {
  name: string;
  Icon: React.ElementType;
  index: number;
  color: string
}

export const SkillCard = ({ name, Icon, index, color }: SkillCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="p-4 border rounded-lg bg-card hover:bg-card/80 transition-colors"
  >
    <div className= "flex items-center gap-3">
      <Icon className="size-5 md:size-8" style={{ color: color }} />
      <p className="font-medium ">{name}</p>
    </div>
  </motion.div>
);
