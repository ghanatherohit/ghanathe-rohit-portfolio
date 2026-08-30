"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Github, Target, Lightbulb, Wrench, AlertTriangle, GraduationCap, TrendingUp } from "lucide-react";
import type { CaseStudy } from "@/lib/case-studies";

interface CaseStudyModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  caseStudy: CaseStudy;
  demoUrl?: string;
  codeUrl?: string;
}

export default function CaseStudyModal({
  open,
  onClose,
  title,
  caseStudy,
  demoUrl,
  codeUrl,
}: CaseStudyModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} case study`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
              <h3 className="text-xl font-bold">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close case study"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <Section icon={Target} label="Problem" color="text-red-500" bg="bg-red-500/10">
                <p className="text-sm text-foreground/90 leading-relaxed">{caseStudy.problem}</p>
              </Section>

              <Section icon={Lightbulb} label="Solution" color="text-amber-500" bg="bg-amber-500/10">
                <p className="text-sm text-foreground/90 leading-relaxed">{caseStudy.solution}</p>
              </Section>

              <Section icon={Wrench} label="Tech Choices" color="text-blue-500" bg="bg-blue-500/10">
                <div className="space-y-3">
                  {caseStudy.techChoices.map((tc) => (
                    <div key={tc.choice} className="pl-3 border-l-2 border-primary/30">
                      <p className="text-sm font-semibold text-foreground/90">{tc.choice}</p>
                      <p className="text-sm text-muted-foreground">{tc.reason}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon={AlertTriangle} label="Challenges" color="text-orange-500" bg="bg-orange-500/10">
                <p className="text-sm text-foreground/90 leading-relaxed">{caseStudy.challenges}</p>
              </Section>

              <Section icon={GraduationCap} label="What I Learned" color="text-emerald-500" bg="bg-emerald-500/10">
                <p className="text-sm text-foreground/90 leading-relaxed">{caseStudy.learned}</p>
              </Section>

              {caseStudy.impact && (
                <Section icon={TrendingUp} label="Impact" color="text-purple-500" bg="bg-purple-500/10">
                  <p className="text-sm text-foreground/90 leading-relaxed">{caseStudy.impact}</p>
                </Section>
              )}

              {(demoUrl || codeUrl) && (
                <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  )}
                  {codeUrl && (
                    <a
                      href={codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  icon: Icon,
  label,
  color,
  bg,
  children,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-md ${bg}`}>
          <Icon className={`h-3.5 w-3.5 ${color}`} />
        </div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h4>
      </div>
      {children}
    </div>
  );
}
