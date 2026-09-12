import { eventConfig } from "@/data/event";

export function EventStats() {
  const items = [
    { label: "Date", value: eventConfig.dates.competitionDay },
    { label: "Team Size", value: eventConfig.teamSize },
    { label: "Platform", value: eventConfig.platform },
    { label: "Mode", value: eventConfig.mode },
    { label: "Eligibility", value: eventConfig.eligibility },
    { label: "Registration", value: eventConfig.registrationStatus.replace("_", " ") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="glass-panel rounded-2xl p-6"
          >
            <p className="text-xs tracking-widest text-ink-400">
              {item.label}
            </p>
            <p className="mt-2 font-display text-lg text-ink-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
