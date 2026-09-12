import Link from "next/link";
import { RoadmapTimeline } from "@/components/roadmap-timeline";

export function RoadmapPreview() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl font-semibold text-ink-100">
          The Journey
        </h2>
        <Link
          href="/roadmap"
          className="text-sm text-purple-bright hover:text-purple-neon"
        >
          Roadmap page →
        </Link>
      </div>
      <RoadmapTimeline />
    </section>
  );
}
