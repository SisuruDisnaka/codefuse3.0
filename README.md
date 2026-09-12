# CODEFUSE 3.0 — The Web of Code

Website for CODEFUSE 3.0, the intra-faculty coding competition run by ACS of
the Faculty of Computing, University of Sri Jayewardenepura.

## 1. Overview

A dark-purple, cyberpunk, spider-web-themed marketing site with a
Supabase-backed team registration system.

## 2. Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL) for registration storage
- Framer Motion for animation, Lucide for icons
- Zod for validation

## 3. Installation

```bash
npm install
```

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project's
values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is used **only** inside
`app/api/registration/route.ts` (server-side). Never prefix it with
`NEXT_PUBLIC_` and never import it into a client component.

## 5. Supabase setup

1. Create a new Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`. This creates the
   `teams` and `team_members` tables, the `register_team()` function
   (transaction-safe team + member creation), and enables Row Level
   Security with no public policies — the tables are not readable or
   writable by the anon/public client at all.
3. Copy the project URL, anon key, and service role key into
   `.env.local`.

## 6. Database setup

Handled entirely by `supabase/schema.sql` (step 5). No separate
migration tool is required.

## 7. Local development

```bash
npm run dev
```

Visit http://localhost:3000.

## 8. Vercel deployment

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Add the three environment variables from step 4 in the Vercel
   project settings (Production + Preview).
4. Deploy.

## 9. How to update event data

Edit `data/event.ts`. This single file controls the event name,
tagline, dates, team size, platform, eligibility, and
`registrationStatus` (`OPEN` / `CLOSED` / `COMING_SOON`) used across
the whole site.

## 10. How to update winners

Edit `data/winners.ts`. Add a `WinnerTeam` entry (place, team name,
members) under the relevant edition.

## 11. How to update organizers

Edit `data/organizers.ts`. Add or edit entries with name, role, and
optional social links.

## 12. How to open/close registration

Change `registrationStatus` in `data/event.ts` to `"OPEN"`,
`"CLOSED"`, or `"COMING_SOON"`. The `/register` page and the
`/api/registration` route both read this value, so the form and the
API stay in sync automatically.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
```

## Security notes

- The Supabase service role key never reaches the browser.
- No password of any kind is ever collected.
- Row Level Security is enabled with no public policies; all writes
  go through the validated `/api/registration` route, which calls the
  `register_team()` Postgres function so a team and its members are
  created together or not at all.
- Team name and (team_id, member_number) uniqueness are enforced at
  the database level, not just in the form.
- There is no public endpoint that lists all registrations.
