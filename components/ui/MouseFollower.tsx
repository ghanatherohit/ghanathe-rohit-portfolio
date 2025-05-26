"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  useEffect(() => {
    const handleMouseOver = () => setCursorVariant("hover")
    const handleMouseOut = () => setCursorVariant("default")

    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver)
      el.addEventListener("mouseout", handleMouseOut)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver)
        el.removeEventListener("mouseout", handleMouseOut)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(var(--primary), 0.2)",
      mixBlendMode: "difference" as const,
    },
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:flex rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 dark:border-primary/60"
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
      }}
    />
  )
}

