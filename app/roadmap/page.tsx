import type { Metadata } from "next";
import { RoadmapTimeline } from "@/components/roadmap-timeline";
import { SpiderWebBackground } from "@/components/spider-web-background";

export const metadata: Metadata = {
  title: "Roadmap | CODEFUSE 3.0",
  description: "The journey of CODEFUSE 3.0, from registration to winners.",
};

export default function RoadmapPage() {
  return (
    <>
      <SpiderWebBackground />
      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <p className="text-xs tracking-widest text-ink-400">The Journey</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-100 sm:text-5xl">
          Roadmap
        </h1>
        <RoadmapTimeline />
      </section>
    </>
  );
}
