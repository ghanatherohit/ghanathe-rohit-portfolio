"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export default function DarkModeIndicator() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const [showIndicator, setShowIndicator] = useState(false) 

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setShowIndicator(true)
      const timer = setTimeout(() => {
        setShowIndicator(false)
      }, 1250)

      return () => clearTimeout(timer)
    }
  }, [theme, mounted])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 flex items-center justify-center p-2 bg-background/80 rounded-full shadow-lg backdrop-blur-md border-2 border-primary"
        >
          {isDark ? (
            <>
              <Moon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

