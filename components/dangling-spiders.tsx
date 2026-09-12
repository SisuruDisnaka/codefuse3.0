import type { CSSProperties } from "react";

interface Drop {
  left: string;
  length: string; // max silk length once fully descended
  size: number; // spider mark width in px
  duration: number; // seconds for one full descend -> hold -> retract cycle
  delay: number; // stagger so several are mid-cycle at once
  tier: "mobile" | "tablet" | "desktop"; // min breakpoint this one appears at
}

// Anchor points chosen to sit within reach of the existing corner webs
// (top-left / top-right in spider-web-background.tsx) so the strand
// reads as dropping from the web above rather than from nowhere.
const DROPS: Drop[] = [
  { left: "8%", length: "32vh", size: 26, duration: 9, delay: 0, tier: "mobile" },
  { left: "91%", length: "38vh", size: 24, duration: 10.5, delay: 3.5, tier: "mobile" },
  { left: "32%", length: "26vh", size: 20, duration: 8.5, delay: 6.5, tier: "tablet" },
  { left: "68%", length: "44vh", size: 32, duration: 12, delay: 1.5, tier: "desktop" },
  { left: "96%", length: "24vh", size: 18, duration: 8, delay: 5, tier: "desktop" },
];

const TIER_CLASS: Record<Drop["tier"], string> = {
  mobile: "",
  tablet: "hidden sm:block",
  desktop: "hidden lg:block",
};

// Spiders that lower themselves from the web above on their own visible
// silk strand -- the strand's height animates from 0 to full length (it
// grows as the spider descends, in lockstep, sharing the same duration
// and delay) rather than the spider simply translating down on its own.
export function DanglingSpiders() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden"
    >
      {DROPS.map((d, i) => {
        const timing: CSSProperties = {
          animationDuration: `${d.duration}s`,
          animationDelay: `${d.delay}s`,
        };
        const threadStyle: CSSProperties = {
          ...timing,
          ["--thread-length" as string]: d.length,
        };

        return (
          <div
            key={i}
            className={`absolute top-0 ${TIER_CLASS[d.tier]}`}
            style={{ left: d.left }}
          >
            {/* Web anchor node -- the strand's fixed attachment point. */}
            <div
              className="mx-auto h-1.5 w-1.5 rounded-full bg-ink-200/70"
              style={{ boxShadow: "0 0 6px 1px rgba(166, 77, 248, 0.6)" }}
            />
            {/* Silk strand -- height animates 0 -> full length -> 0. */}
            <div
              className="animate-silk-grow mx-auto w-px bg-gradient-to-b from-accent-cyan/60 via-purple-bright/50 to-purple-primary/10"
              style={threadStyle}
            />
            {/* Spider, attached to the strand's bottom end throughout. */}
            <div
              className="spider-mark animate-spider-hang mx-auto -mt-1"
              style={{ ...timing, width: d.size, height: d.size * 1.33 }}
            />
          </div>
        );
      })}
    </div>
  );
}
