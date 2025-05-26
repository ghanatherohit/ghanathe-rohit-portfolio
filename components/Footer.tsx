"use client"

import Link from "next/link"
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
 
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/ghanatherohit" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ghanatherohit" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/therohitghanathe" },
  ]

  return (
    <footer className="bg-background border-t border-border dark:bg-background/90">
      <div className="container px-4 pb-8 pt-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <Link href="#home" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">FS</span>
              </div>
              <span className="ml-3 text-xl font-semibold tracking-tight">
                <span className="text-primary">.</span>dev
              </span>
            </Link>

            <p className="max-w-xs text-sm text-muted-foreground">
              I am a passionate developer with a knack for creating beautiful and functional web applications. Let&apos;s connect and build something amazing together!
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
          {/* Navigations */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">Navigation</h3>
              <ul className="mt-4 space-y-2">
                {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Services</h3>
              <ul className="mt-4 space-y-2">
                {["Web Development", "UI/UX Design", "E-commerce", "Consulting"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#contact"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ghanathe Rohit. All rights reserved.
          </p>

          <button onClick={scrollToTop} className="mt-4 md:mt-0 bg-primary rounded-md p-2 hover:bg-primary/80" aria-label="Scroll to top">
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  )
}

