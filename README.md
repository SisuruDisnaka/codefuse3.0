# CODEFUSE 3.0 - The Web of Code

Website for CODEFUSE 3.0, the intra-faculty coding competition run by ACS of
the Faculty of Computing, University of Sri Jayewardenepura.

## 1. Overview

A dark-purple, cyberpunk, spider-web-themed marketing site with a
Supabase-backed team registration system.

## 2. Features

- Landing page with animated spider-web background
- Multi-step registration (`/register`) with live per-step validation,
  duplicate-detection, and a live group-name availability check
- "Join the WhatsApp group" popup after registering, plus a standalone
  `/join` page with a live QR code
- Winners Hall of Fame (`/winners`) with a cinematic full-screen photo
  reveal
- Rules and Roadmap pages
- All event info, dates, registration status, and the WhatsApp link
  are controlled from `data/event.ts` — no code changes needed

## 3. Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL) for registration storage
- Framer Motion for animation, Lucide for icons
- Zod for validation

## 4. Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project keys
npm run dev
```

Run `supabase/schema.sql` in your Supabase project's SQL Editor once,
before first use — it sets up the `teams`/`team_members` tables and
Row Level Security.

## 5. Environment variables

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

## Developed by

**Sisuru Disnaka Samarathunga**

[![GitHub](https://img.shields.io/badge/GitHub-SisuruDisnaka-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/SisuruDisnaka)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sisuru%20Disnaka%20Samarathunga-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sisuru-disnaka-samarathunga-90b9602b1/)