"use client"

import { useState, useEffect } from "react"
import Link from "next/link" 
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import ThemeSwitcher from "./ui/ThemeSwitcher"
import ScrollProgress from "./ui/ScrollProgress"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section based on scroll position
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = section.clientHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md py-3 shadow-md dark:bg-background/90" : "bg-transparent py-5",
      )}
    >
      <ScrollProgress />
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="#home" className="group flex items-center">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 bg-primary/30"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}  
                />
                <span className="relative text-lg font-bold text-primary">GR</span>
              </div>
              <span className="ml-3 text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <span className="text-primary">.</span>dev
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-1">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      activeSection === item.href.substring(1)
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    {item.name}
                    {activeSection === item.href.substring(1) && (
                      <motion.span
                        layoutId="activeSection"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="ml-4">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <ThemeSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="sticky inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="#home" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">FS</span>
                  </div>
                  <span className="ml-3 text-xl font-semibold tracking-tight">
                    <span className="text-primary">.</span>dev
                  </span>
                </Link>
                <button
                  type="button"
                  className="rounded-md p-2 text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  <div className="space-y-2 py-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                          activeSection === item.href.substring(1)
                            ? "text-primary bg-muted"
                            : "text-foreground hover:bg-muted hover:text-primary",
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

