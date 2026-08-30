"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Code2,
  BarChart3,
  FolderGit2,
  Award,
  Mail,
  Sun,
  Moon,
  Monitor,
  Github,
  Linkedin,
  FileDown,
  Search,
  GraduationCap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navCommands = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Education", href: "#education", icon: GraduationCap },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Skills", href: "#skills", icon: Code2 },
  { name: "Coding Profiles", href: "#coding-profiles", icon: BarChart3 },
  { name: "Projects", href: "#projects", icon: FolderGit2 },
  { name: "Certifications", href: "#certifications", icon: Award },
  { name: "Contact", href: "#contact", icon: Mail },
];

const externalLinks = [
  { name: "Open GitHub", href: "https://github.com/ghanatherohit", icon: Github },
  { name: "Open LinkedIn", href: "https://www.linkedin.com/in/ghanatherohit", icon: Linkedin },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const runCommand = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      runCommand(() => router.push(`/${href}`));
    },
    [router, runCommand]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
          "text-muted-foreground bg-muted/80 border border-border backdrop-blur-sm",
          "hover:text-foreground hover:border-primary/50 transition-colors"
        )}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="ml-2 text-[10px] font-mono bg-background/80 border border-border rounded px-1.5 py-0.5">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Command
                className="w-full overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
                loop
              >
                <div className="flex items-center gap-2 border-b border-border px-4">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <Command.Input
                    autoFocus
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    Esc
                  </kbd>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Close command palette"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </Command.Empty>

                  <Command.Group
                    heading="Navigate"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {navCommands.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.name}
                        onSelect={() => navigateTo(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer",
                          "text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.name}
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Group
                    heading="Actions"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    <Command.Item
                      value="Download Resume"
                      onSelect={() =>
                        runCommand(() => window.open("/Rohit-Resume.pdf", "_blank"))
                      }
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <FileDown className="h-4 w-4 shrink-0" />
                      Download Resume
                    </Command.Item>

                    <Command.Item
                      value="Light mode theme"
                      onSelect={() => runCommand(() => setTheme("light"))}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <Sun className="h-4 w-4 shrink-0" />
                      Switch to Light Mode
                    </Command.Item>

                    <Command.Item
                      value="Dark mode theme"
                      onSelect={() => runCommand(() => setTheme("dark"))}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <Moon className="h-4 w-4 shrink-0" />
                      Switch to Dark Mode
                    </Command.Item>

                    <Command.Item
                      value="System theme"
                      onSelect={() => runCommand(() => setTheme("system"))}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <Monitor className="h-4 w-4 shrink-0" />
                      Use System Theme
                    </Command.Item>
                  </Command.Group>

                  <Command.Group
                    heading="Links"
                    className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                  >
                    {externalLinks.map((link) => (
                      <Command.Item
                        key={link.href}
                        value={link.name}
                        onSelect={() =>
                          runCommand(() => window.open(link.href, "_blank", "noopener,noreferrer"))
                        }
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer text-foreground/90 aria-selected:bg-primary/10 aria-selected:text-primary"
                      >
                        <link.icon className="h-4 w-4 shrink-0" />
                        {link.name}
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
