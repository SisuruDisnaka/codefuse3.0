import { organizers } from "@/data/organizers";
import { Avatar } from "@/components/ui/avatar";
import { Github, Linkedin } from "lucide-react";

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
          
          <div
  key={i}
  className="glass-panel rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-neon/40 hover:shadow-[0_0_30px_rgba(192,38,255,0.15)]"
>

            <div className="mx-auto flex justify-center">
            <div className="rounded-full p-1 bg-gradient-to-br from-purple-primary via-purple-neon to-pink-500 shadow-[0_0_15px_rgba(192,38,255,0.35)]">
              <Avatar name={o.name} photo={o.photo} size={140} />
            </div>
          </div>
            <p className="mt-4 font-display text-lg text-ink-100">{o.name}</p>
            <p className="text-sm text-ink-400">{o.role}</p>
            {(o.linkedin || o.github) && (
            <div className="mt-4 flex justify-center gap-3">
              {o.linkedin && (
                <a
                  href={o.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${o.name} LinkedIn`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-primary/30 text-purple-bright transition-all duration-200 hover:border-purple-neon hover:bg-purple-neon/10 hover:text-white hover:shadow-[0_0_14px_rgba(192,38,255,0.35)]"
                >
                  <Linkedin size={17} strokeWidth={2} />
                </a>
              )}

              {o.github && (
                <a
                  href={o.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${o.name} GitHub`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-primary/30 text-purple-bright transition-all duration-200 hover:border-purple-neon hover:bg-purple-neon/10 hover:text-white hover:shadow-[0_0_14px_rgba(192,38,255,0.35)]"
                >
                  <Github size={17} strokeWidth={2} />
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
