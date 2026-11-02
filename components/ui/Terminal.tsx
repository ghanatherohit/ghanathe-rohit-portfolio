"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare, X } from "lucide-react";

interface Line {
  type: "input" | "output";
  text: string;
}

const BIO = [
  "Ghanathe Rohit — Aspiring Full Stack Web Developer.",
  "Based in Hyderabad, India. B.Tech CSE (Data Science), CMR Engineering College.",
  "Skilled in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB.",
];

const SKILLS = [
  "Frontend : HTML5, CSS3, JavaScript, Tailwind CSS, React.js, Next.js",
  "Backend  : Node.js, Express.js, MySQL, MongoDB, REST APIs",
  "Languages: C++, Python, Java",
  "Tools    : Git, GitHub",
];

const SECTION_IDS: Record<string, string> = {
  home: "home",
  about: "about",
  experience: "experience",
  skills: "skills",
  projects: "projects",
  contact: "contact",
  certifications: "certifications",
};

const HELP_LINES = [
  "Available commands:",
  "  help       show this list",
  "  whoami     print my bio",
  "  skills     list my tech stack",
  "  projects   jump to the Projects section",
  "  contact    show contact info",
  "  github     open my GitHub profile",
  "  linkedin   open my LinkedIn profile",
  "  resume     download my resume (PDF)",
  "  clear      clear the terminal",
  "  exit       close the terminal",
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Line[]>([
    { type: "output", text: "Welcome. Type `help` to see available commands." },
  ]);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "`" && !isTyping) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const print = (lines: string | string[]) => {
    const arr = Array.isArray(lines) ? lines : [lines];
    setHistory((prev) => [...prev, ...arr.map((text) => ({ type: "output" as const, text }))]);
  };

  const navigateTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setHistory((prev) => [...prev, { type: "input", text: raw }]);
    if (!cmd) return;

    setCommandLog((prev) => [...prev, raw]);
    setLogIndex(null);

    switch (cmd) {
      case "help":
        print(HELP_LINES);
        break;
      case "whoami":
        print(BIO);
        break;
      case "skills":
        print(SKILLS);
        break;
      case "projects":
        print("Opening Projects section...");
        navigateTo(SECTION_IDS.projects);
        break;
      case "about":
        print("Opening About section...");
        navigateTo(SECTION_IDS.about);
        break;
      case "experience":
        print("Opening Experience section...");
        navigateTo(SECTION_IDS.experience);
        break;
      case "certifications":
        print("Opening Certifications section...");
        navigateTo(SECTION_IDS.certifications);
        break;
      case "contact":
        print([
          "Email : rohitghanathe09@gmail.com",
          "GitHub: github.com/ghanatherohit",
          "LinkedIn: linkedin.com/in/ghanatherohit",
        ]);
        break;
      case "github":
        print("Opening GitHub...");
        window.open("https://github.com/ghanatherohit", "_blank", "noopener,noreferrer");
        break;
      case "linkedin":
        print("Opening LinkedIn...");
        window.open("https://www.linkedin.com/in/ghanatherohit", "_blank", "noopener,noreferrer");
        break;
      case "resume":
        print("Downloading resume...");
        window.open("/Rohit-Resume.pdf", "_blank");
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        print(`Command not found: ${cmd}. Type "help" for a list of commands.`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleKeyNav = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandLog.length === 0) return;
      const nextIndex = logIndex === null ? commandLog.length - 1 : Math.max(0, logIndex - 1);
      setLogIndex(nextIndex);
      setInput(commandLog[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (logIndex === null) return;
      const nextIndex = logIndex + 1;
      if (nextIndex >= commandLog.length) {
        setLogIndex(null);
        setInput("");
      } else {
        setLogIndex(nextIndex);
        setInput(commandLog[nextIndex]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[90] hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-xs font-mono text-muted-foreground bg-muted/80 border border-border backdrop-blur-sm hover:text-foreground hover:border-primary/50 transition-colors"
        aria-label="Open terminal"
      >
        <TerminalSquare className="h-3.5 w-3.5" />
        <span>Terminal</span>
        <kbd className="text-[10px] border border-border rounded px-1 py-0.5">`</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
              className="w-full max-w-2xl rounded-xl border border-border bg-[#0b0f14] shadow-2xl overflow-hidden font-mono text-sm"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Interactive terminal"
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-white/50">rohit@portfolio: ~</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                  aria-label="Close terminal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="h-[360px] overflow-y-auto px-4 py-3 space-y-1 text-white/90"
                onClick={() => inputRef.current?.focus()}
              >
                {history.map((line, i) =>
                  line.type === "input" ? (
                    <div key={i} className="flex gap-2 text-emerald-400">
                      <span>$</span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div key={i} className="whitespace-pre-wrap text-white/70 pl-4">
                      {line.text}
                    </div>
                  )
                )}

                <form onSubmit={handleSubmit} className="flex gap-2 items-center pt-1">
                  <span className="text-emerald-400">$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyNav}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-transparent outline-none text-white/90 caret-emerald-400"
                    aria-label="Terminal input"
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
