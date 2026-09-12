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

// A pinned, scroll-linked reveal for a single complete winner photograph:
// the section title fades up, the image scales in, and — as the person
// keeps scrolling through this section — the image continues to zoom in
// (never cropping, since it's always shown with object-contain sizing)
// before releasing naturally into whatever comes next. Driven entirely by
// framer-motion's scroll-linked MotionValues, so it doesn't cause React
// re-renders on scroll.
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

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 1.0, 1.22]);
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.88, 1],
    [0, 1, 1, 0.85]
  );
  const blur = useTransform(scrollYProgress, [0, 0.18], ["blur(10px)", "blur(0px)"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.16], [22, 0]);

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
    <div ref={trackRef} className="relative h-[190vh] sm:h-[220vh]">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-5">
        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="mb-6 text-center font-display text-2xl font-semibold text-ink-100 sm:text-3xl"
        >
          {edition}
        </motion.h2>

        <motion.div
          style={{ scale, opacity: imageOpacity, filter: blur }}
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-purple-primary/30 shadow-[0_0_60px_rgba(230,25,255,0.2)]"
        >
          <Image
            src={image}
            alt={`${edition} winners`}
            width={width}
            height={height}
            className="h-auto w-full rounded-2xl object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={false}
          />
        </motion.div>

        <p className="mt-6 text-xs tracking-widest text-ink-400 motion-reduce:hidden">
          scroll
        </p>
      </div>
    </div>
  );
}
