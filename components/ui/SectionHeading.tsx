"use client"

import { motion } from "framer-motion"
interface SectionHeadingProps {
  title: string
  subtitle: string
  className?: string
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold tracking-tight"
      >
        {title}
        <span className="text-primary">.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground max-w-2xl"
      >
        {subtitle}
      </motion.p>
    </div>
  )
}

