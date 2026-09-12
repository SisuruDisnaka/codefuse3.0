import { eventConfig } from "@/data/event";

  const items = [
    { label: "Date", value: eventConfig.dates.competitionDay },
    { label: "Team Size", value: eventConfig.teamSize },
    { label: "Platform", value: eventConfig.platform },
    { label: "Mode", value: eventConfig.mode },
    { label: "Eligibility", value: eventConfig.eligibility },
    { label: "Registration", value: eventConfig.registrationStatus.replace("_", " ") },
  ];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-ink-100 sm:text-5xl">
        The Battle for
        <br />
        <span className="text-purple-bright">Coding Brilliance</span>
      </h2>
      <p className="mt-6 max-w-2xl text-ink-300">{eventConfig.description}</p>
      <br></br>
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
