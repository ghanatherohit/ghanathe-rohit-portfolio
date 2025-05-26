"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-[104px] h-10" />
  }

  return (
    <motion.div className="flex p-1 rounded-full bg-muted/80 backdrop-blur-sm border border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: -20 }}
      >
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors",
          theme === "light" ? "bg-slate-300 text-primary" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Light mode"
      >
        <Sun className="relative z-10 h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors",
          theme === "dark" ? "bg-background text-primary" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Dark mode"
      >
        <Moon className="relative z-10 h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors",
          theme === "system" ? "bg-background text-primary" : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="System theme"
      >
        <Monitor className="relative z-10 h-4 w-4" />
      </button>
    </motion.div>
  )
}

