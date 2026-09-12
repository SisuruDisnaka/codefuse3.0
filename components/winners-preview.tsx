import Link from "next/link";
import { winners } from "@/data/winners";
import { WinnerCinematicReveal } from "@/components/winner-cinematic-reveal";

// Homepage Hall of Fame: shows the latest edition that has a complete,
// official winner graphic (fullImage) using the same pinned, scroll-driven
// cinematic zoom effect as the /winners page — the whole image, never
// cropped, gradually zooming in as the section is scrolled through before
// releasing into whatever comes next. Falls back to a simple summary card
// if no edition has a fullImage yet. Full history lives on /winners.
export function WinnersPreview() {
  const featuredEdition = [...winners].reverse().find((e) => e.fullImage);

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between px-0 pt-16">
        <h2 className="font-display text-3xl font-semibold text-ink-100">
          Hall of Fame
        </h2>
        <Link
          href="/winners"
          className="text-sm text-purple-bright hover:text-purple-neon"
        >
          See all winners →
        </Link>
      </div>

      {featuredEdition ? (
        <WinnerCinematicReveal
          edition={featuredEdition.edition}
          image={featuredEdition.fullImage!}
          width={featuredEdition.fullImageSize?.width ?? 1200}
          height={featuredEdition.fullImageSize?.height ?? 675}
        />
      ) : (
        <p className="mt-8 text-ink-400">
          Results will appear here once a season concludes.
        </p>
      )}
    </section>
  );
}
