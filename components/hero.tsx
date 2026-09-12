"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { eventConfig } from "@/data/event";
import { DanglingSpiders } from "@/components/dangling-spiders";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <DanglingSpiders />

      {/* Faint watermark mark behind the title — decoration only. */}
      <div
        aria-hidden="true"
        className="spider-mark pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vh] w-[52vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
      />

      {/* City-glow layer, purely CSS so it stays cheap. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45%] opacity-70"
        style={{
          background:
            "linear-gradient(to top, rgba(124, 77, 255,0.16), transparent 70%), radial-gradient(ellipse at 30% 100%, rgba(76, 141, 246,0.15), transparent 60%)",
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest text-ink-400"
      >
        {eventConfig.faculty} · {eventConfig.university}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="codefuse-glow mt-6 font-display text-6xl font-bold leading-[0.95] text-ink-100 text-glow sm:text-8xl md:text-9xl">
        {eventConfig.eventName}
        <span className="block edition-glow text-purple-bright">{eventConfig.edition}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-6 font-display text-lg tracking-[0.35em] text-ink-300 sm:text-2xl"
      >
        {eventConfig.tagline.toUpperCase()}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-4 max-w-md text-ink-400"
      >
        {eventConfig.quote}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Link
          href="/register"
          className="rounded-full bg-purple-primary px-8 py-3 font-medium text-ink-100 transition hover:shadow-[0_0_28px_rgba(230, 25, 255,0.5)]"
        >
          Register Your Team
        </Link>
        <a
          href="#about"
          className="rounded-full border border-purple-primary/40 px-8 py-3 font-medium text-ink-200 transition hover:border-purple-neon hover:text-ink-100"
        >
          Explore
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute bottom-8 text-xs tracking-widest text-ink-400"
      >
        INTRA-FACULTY CODING COMPETITION
      </motion.p>
    </section>
  );
}
