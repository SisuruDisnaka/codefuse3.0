import type { Metadata } from "next";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { winners, type WinnerEdition, type WinnerTeam } from "@/data/winners";
import { SpiderWebBackground } from "@/components/spider-web-background";
import { WinnerPhotoGrid } from "@/components/winner-photo-grid";
import { WinnerCinematicReveal } from "@/components/winner-cinematic-reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Winners | CODEFUSE 3.0",
  description: "The Hall of Fame — champions of every CODEFUSE edition.",
};

const RANK_EMOJI: Record<1 | 2 | 3, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const RANK_ICON: Record<1 | 2 | 3, typeof Trophy> = { 1: Trophy, 2: Medal, 3: Award };

function TeamHeading({ team }: { team: WinnerTeam }) {
  return (
    <h3 className="mb-4 text-center font-display text-xl text-purple-bright">
      {team.rank ? `${RANK_EMOJI[team.rank]} ` : ""}
      {team.label} — {team.teamName}
    </h3>
  );
}

function PlainTeamCard({ team }: { team: WinnerTeam }) {
  const Icon = team.rank ? RANK_ICON[team.rank] : Star;
  return (
    <div className="glass-panel rounded-2xl p-6">
      <Icon
        className={cn("text-ink-300", team.rank === 1 && "text-purple-neon")}
        size={24}
      />
      <p className="mt-3 text-xs tracking-widest text-ink-400">{team.label}</p>
      <p className="mt-1 font-display text-xl text-ink-100">{team.teamName}</p>
    </div>
  );
}

function EditionPoster({ edition }: { edition: WinnerEdition }) {
  return (
    <div className="glass-panel rounded-2xl border border-purple-primary/20 p-8">
      {edition.poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={edition.poster}
          alt={`${edition.edition} event poster`}
          className="mb-4 w-full rounded-lg"
        />
      )}
      <h3 className="mb-4 text-center font-display text-2xl text-ink-100">
        {edition.edition}
      </h3>
      {edition.description && (
        <p className="text-center text-sm text-ink-300">{edition.description}</p>
      )}
    </div>
  );
}

export default function WinnersPage() {
  return (
    <>
      <SpiderWebBackground />
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="text-xs tracking-widest text-ink-400">
          The Ones Who Conquered the Web
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink-100 sm:text-5xl">
          The Hall of Fame
        </h1>

        <div className="mt-16 space-y-20">
          {winners.map((edition) => {
            if (edition.fullImage) {
              return (
                <WinnerCinematicReveal
                  key={edition.edition}
                  edition={edition.edition}
                  image={edition.fullImage}
                  width={edition.fullImageSize?.width ?? 1200}
                  height={edition.fullImageSize?.height ?? 675}
                />
              );
            }

            if (edition.teams.length === 0) {
              return (
                <div key={edition.edition}>
                  <h2 className="font-display text-2xl text-ink-100">
                    {edition.edition}
                  </h2>
                  <p className="mt-4 text-ink-400">Results not yet published.</p>
                </div>
              );
            }

            const hasPoster = Boolean(edition.poster || edition.description);
            const featured = hasPoster
              ? edition.teams.find((t) => t.rank === 1)
              : undefined;
            const rest = featured
              ? edition.teams.filter((t) => t !== featured)
              : edition.teams;

            return (
              <div key={edition.edition}>
                <h2 className="font-display text-2xl text-ink-100">
                  {edition.edition}
                </h2>

                {featured && (
                  <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
                    <div>
                      <TeamHeading team={featured} />
                      <WinnerPhotoGrid
                        members={featured.members}
                        teamName={featured.teamName}
                        columns={2}
                      />
                    </div>
                    <EditionPoster edition={edition} />
                  </div>
                )}

                {rest.length > 0 &&
                  (rest.some((t) => t.members.length > 0) ? (
                    <div
                      className={cn(
                        "mt-12 grid items-start gap-10",
                        rest.length > 1 ? "lg:grid-cols-3" : ""
                      )}
                    >
                      {rest.map((team) => (
                        <div key={team.teamName}>
                          <TeamHeading team={team} />
                          {team.members.length > 0 ? (
                            <WinnerPhotoGrid
                              members={team.members}
                              teamName={team.teamName}
                              columns={2}
                            />
                          ) : (
                            <PlainTeamCard team={team} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-5 sm:grid-cols-3">
                      {rest.map((team) => (
                        <PlainTeamCard key={team.teamName} team={team} />
                      ))}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
