"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const SPRING = { damping: 30, stiffness: 300 }

export default function MouseFollower() {
  // Raw cursor position as MotionValues — .set() below updates them without
  // triggering a React re-render on every mousemove, unlike useState would.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover">("default")

  const size = cursorVariant === "hover" ? 48 : 32
  const offset = size / 2

  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX - offset)
      rawY.set(e.clientY - offset)
    }
    window.addEventListener("mousemove", mouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", mouseMove)
  }, [rawX, rawY, offset])

  useEffect(() => {
    // Event delegation — single listener on document handles all interactive elements,
    // including dynamically-added ones (modals, etc.). Much cheaper than per-element listeners.
    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"]')) {
        setCursorVariant("hover")
      } else {
        setCursorVariant("default")
      }
    }

    document.addEventListener("mouseover", handleOver, { passive: true })
    return () => document.removeEventListener("mouseover", handleOver)
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[110] hidden md:flex rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 dark:border-primary/60"
      style={{ x, y }}
      animate={{
        height: size,
        width: size,
        backgroundColor: cursorVariant === "hover" ? "rgba(var(--primary), 0.2)" : undefined,
        mixBlendMode: cursorVariant === "hover" ? "difference" : "normal",
      }}
      transition={SPRING}
    />
  )
}
