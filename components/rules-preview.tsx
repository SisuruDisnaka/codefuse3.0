import Link from "next/link";
import { rules } from "@/data/rules";

export function RulesPreview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-3xl font-semibold text-ink-100">
          Know the Rules
        </h2>
        <Link href="/rules" className="text-sm text-purple-bright hover:text-purple-neon">
          Read all rules →
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rules.slice(0, 4).map((r) => (
          <div key={r.id} className="glass-panel rounded-2xl p-5">
            <p className="font-display text-ink-100">{r.title}</p>
            <p className="mt-2 text-sm text-ink-400">
              {r.items.length} guideline{r.items.length === 1 ? "" : "s"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
