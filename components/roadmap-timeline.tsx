"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  UserPlus,
  Lock,
  Megaphone,
  Terminal,
  Trophy,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { roadmap } from "@/data/roadmap";
import { cn } from "@/lib/utils";

// Icon per milestone, matched by title. Falls back to a generic mark for
// any milestone added later that isn't in this map, so the timeline never
// breaks if data/roadmap.ts changes.
const MILESTONE_ICONS: Record<string, LucideIcon> = {
  "Registration Open": UserPlus,
  "Registration Closed": Lock,
  "Awareness Session": Megaphone,
  "Hackathon Day": Terminal,
  "Winners Announcement": Trophy,
};

function iconFor(title: string): LucideIcon {
  return MILESTONE_ICONS[title] ?? Sparkles;
}

export function RoadmapTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 65%"],
  });
  const spineFill = useTransform(scrollYProgress, [0, 1], ["2%", "100%"]);

  return (
    <div ref={containerRef} className="relative mt-14 pb-2 sm:mt-16">
      {/* Faint base spine, always visible */}
      <div
        aria-hidden="true"
        className="absolute left-7 top-0 bottom-0 w-px bg-purple-primary/15 lg:left-1/2 lg:-translate-x-1/2"
      />
      {/* Glowing spine that fills in as the section scrolls into view —
          echoes the same "silk thread" motif as the hero's dangling spiders. */}
      <motion.div
        aria-hidden="true"
        style={{ height: spineFill }}
        className="absolute left-7 top-0 w-px bg-gradient-to-b from-purple-neon via-purple-bright to-purple-primary shadow-[0_0_14px_rgba(230,25,255,0.85)] lg:left-1/2 lg:-translate-x-1/2"
      />

      <ol className="relative space-y-14 lg:space-y-20">
        {roadmap.map((m, i) => {
          const Icon = iconFor(m.title);
          const onRight = i % 2 === 0;

          return (
            <motion.li
              key={m.order}
              initial={{ opacity: 0, x: onRight ? 24 : -24, y: 16 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="relative flex items-start gap-5 lg:block"
            >
              {/* Milestone node */}
              <div
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                  "border border-purple-neon/60 bg-void-900 shadow-[0_0_20px_rgba(230,25,255,0.45)]",
                  "lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2"
                )}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 animate-pulse-slow rounded-full bg-purple-primary/30 blur-md"
                />
                <span className="font-mono text-[10px] tracking-widest text-purple-bright/80 absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {m.order}
                </span>
                <Icon size={22} className="text-purple-neon" strokeWidth={1.75} />
              </div>

              {/* Milestone card */}
              <div
                className={cn(
                  "glass-panel flex-1 rounded-2xl p-6 transition-colors hover:border-purple-neon/50",
                  "lg:w-[calc(50%-3rem)]",
                  onRight ? "lg:ml-auto lg:text-left" : "lg:mr-auto lg:text-right"
                )}
              >
                <h3 className="font-display text-xl text-ink-100 sm:text-2xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-ink-300 sm:text-base">
                  {m.description}
                </p>
                <p className="mt-3 text-sm text-purple-bright">{m.date}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
