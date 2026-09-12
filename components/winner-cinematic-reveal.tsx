"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface WinnerCinematicRevealProps {
  edition: string;
  image: string;
  /** Intrinsic pixel size of the source image, for correct aspect ratio. */
  width: number;
  height: number;
}

// A pinned, scroll-linked reveal for a single complete winner photograph.
// The image appears almost as soon as this section reaches the top of the
// viewport (no long scroll of near-nothing before it shows up), then
// keeps growing as the person scrolls further — filling the whole screen
// by the end of the track — before releasing naturally into whatever
// comes next. Driven entirely by framer-motion's scroll-linked
// MotionValues, so it doesn't cause React re-renders on scroll.
export function WinnerCinematicReveal({
  edition,
  image,
  width,
  height,
}: WinnerCinematicRevealProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // The box the image sits in grows from a contained card to the full
  // sticky viewport (100% x 100%) — that's the "zoom to full screen".
  const boxWidth = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    ["74%", "82%", "100%", "100%"]
  );
  const boxHeight = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    ["58%", "64%", "100%", "100%"]
  );
  const radius = useTransform(scrollYProgress, [0.7, 1], ["1.5rem", "0rem"]);

  // Visible almost immediately on entering the section — only ~8% of the
  // track's scroll distance — instead of staying blurred/invisible for a
  // long stretch of scrolling.
  const imageOpacity = useTransform(scrollYProgress, [0, 0.08, 0.94, 1], [0, 1, 1, 0.9]);
  const blur = useTransform(scrollYProgress, [0, 0.08], ["blur(6px)", "blur(0px)"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.7, 1], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.08], [14, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 0.4], [0, 1, 0]);

  if (prefersReducedMotion) {
    // Skip the pinned scroll-driven track entirely — just show the title
    // and the complete image, fully visible, no motion.
    return (
      <div className="flex flex-col items-center px-5 py-16">
        <h2 className="mb-6 text-center font-display text-2xl font-semibold text-ink-100 sm:text-3xl">
          {edition}
        </h2>
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-purple-primary/30 shadow-[0_0_50px_rgba(230,25,255,0.16)]">
          <Image
            src={image}
            alt={`${edition} winners`}
            width={width}
            height={height}
            className="h-auto w-full rounded-2xl object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>
    );
  }

  return (
    // Shorter track than a typical scroll-jacked section on purpose: the
    // image is already fully visible within the first ~10vh of scrolling
    // into this section, so the remaining distance is only spent on the
    // grow-to-full-screen effect, not on making the winners visible.
    <div ref={trackRef} className="relative h-[140vh] sm:h-[160vh]">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-5">
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="mb-6 text-center font-display text-2xl font-semibold text-ink-100 sm:text-3xl"
        >
          {edition}
        </motion.h2>

        <motion.div
          style={{
            width: boxWidth,
            height: boxHeight,
            borderRadius: radius,
            opacity: imageOpacity,
            filter: blur,
          }}
          className="relative max-w-none overflow-hidden border border-purple-primary/30 shadow-[0_0_60px_rgba(230,25,255,0.2)]"
        >
          <Image
            src={image}
            alt={`${edition} winners`}
            fill
            className="object-contain"
            sizes="100vw"
            priority={false}
          />
        </motion.div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="mt-6 text-xs tracking-widest text-ink-400 motion-reduce:hidden"
        >
          scroll
        </motion.p>
      </div>
    </div>
  );
}
