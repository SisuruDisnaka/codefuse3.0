import { organizers } from "@/data/organizers";
import { Avatar } from "@/components/ui/avatar";

// The Organizers section now lives only on the Home page — the dedicated
// /organizers route was removed from navigation. This keeps the same
// card-grid presentation (avatar, name, role, socials) that used to live
// on that standalone page, just embedded here instead.
export function OrganizersPreview() {
  return (
    <section id="organizers" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 scroll-mt-24">
      <p className="text-xs tracking-widest text-ink-400">The Committee</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink-100">
        Meet the Organizers
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {organizers.map((o, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 text-center">
            <div className="mx-auto flex justify-center">
              <Avatar name={o.name} photo={o.photo} size={80} />
            </div>
            <p className="mt-4 font-display text-lg text-ink-100">{o.name}</p>
            <p className="text-sm text-ink-400">{o.role}</p>
            {(o.linkedin || o.github) && (
              <div className="mt-3 flex justify-center gap-4 text-xs text-purple-bright">
                {o.linkedin && (
                  <a href={o.linkedin} className="hover:text-purple-neon">
                    LinkedIn
                  </a>
                )}
                {o.github && (
                  <a href={o.github} className="hover:text-purple-neon">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
