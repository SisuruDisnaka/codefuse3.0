"use client";

import Image from "next/image";
import type { WinnerMember } from "@/data/winners";
import { Avatar } from "@/components/ui/avatar";

function MemberCard({ member, teamName }: { member: WinnerMember; teamName: string }) {
  return (
    <div className="group glass-panel rounded-lg border border-purple-primary/40 p-4 text-center transition hover:border-purple-neon/60">
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-void-800">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Avatar name={member.name} size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <h4 className="mb-1 font-display text-lg text-ink-100">{member.name}</h4>
      <p className="text-sm text-purple-bright">{teamName}</p>
    </div>
  );
}

// Lays members out in full rows of `columns`, with any remainder
// centered on its own row (matches the reference site's 2-up + centered
// single pattern, generalized to any member count / column count).
export function WinnerPhotoGrid({
  members,
  teamName,
  columns = 2,
}: {
  members: WinnerMember[];
  teamName: string;
  columns?: 2 | 3;
}) {
  if (members.length === 0) return null;

  const rows: WinnerMember[][] = [];
  for (let i = 0; i < members.length; i += columns) {
    rows.push(members.slice(i, i + columns));
  }

  return (
    <div className="space-y-6">
      {rows.map((row, i) =>
        row.length === columns ? (
          <div
            key={i}
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {row.map((m) => (
              <MemberCard key={m.name} member={m} teamName={teamName} />
            ))}
          </div>
        ) : (
          <div key={i} className="flex flex-wrap justify-center gap-6">
            {row.map((m) => (
              <div key={m.name} className="w-full max-w-xs">
                <MemberCard member={m} teamName={teamName} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
