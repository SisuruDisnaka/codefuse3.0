import type { Metadata } from "next";
import { rules } from "@/data/rules";
import { AccordionItem } from "@/components/ui/accordion";
import { SpiderWebBackground } from "@/components/spider-web-background";

export const metadata: Metadata = {
  title: "Rules | CODEFUSE 3.0",
  description: "Registration, team, HackerRank, and competition rules for CODEFUSE 3.0.",
};

export default function RulesPage() {
  return (
    <>
      <SpiderWebBackground />
      <section className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <p className="text-xs tracking-widest text-ink-400">Guidelines</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-100 sm:text-5xl">
          Hackathon Rules
        </h1>

        <div className="mt-12 space-y-4">
          {rules.map((section) => (
            <AccordionItem key={section.id} id={section.id} title={section.title}>
              <ul className="list-disc space-y-2 pl-5">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </div>
      </section>
    </>
  );
}
