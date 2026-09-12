-- CODEFUSE 3.0 — Supabase schema
-- Run this in the Supabase SQL Editor for a fresh project.

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLE: teams
-- =========================================================
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  registration_code text not null unique,
  team_name text not null unique,
  team_size integer not null check (team_size between 1 and 3),
  team_email text not null,
  team_whatsapp text not null,
  hackerrank_team_name text,
  github_url text,
  additional_information text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- TABLE: team_members
-- =========================================================
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  member_number integer not null check (member_number in (1, 2, 3)),
  full_name text not null,
  registration_number text not null,
  email text not null,
  whatsapp_number text not null,
  created_at timestamptz not null default now(),
  unique (team_id, member_number)
);

create index if not exists idx_team_members_team_id on team_members(team_id);
create index if not exists idx_teams_registration_code on teams(registration_code);

-- =========================================================
-- Keep updated_at fresh on teams
-- =========================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_teams_updated_at on teams;
create trigger trg_teams_updated_at
before update on teams
for each row execute function set_updated_at();

-- =========================================================
-- Registration-code generator (server-side, collision-checked)
-- =========================================================
create or replace function generate_registration_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  exists_already boolean;
begin
  loop
    code := 'CF3-';
    for i in 1..6 loop
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;
    select exists(select 1 from teams where registration_code = code) into exists_already;
    exit when not exists_already;
  end loop;
  return code;
end;
$$ language plpgsql;

-- =========================================================
-- Transaction-safe registration function
-- Team + all members are created together, or nothing is created.
-- members_json shape:
-- [{ "member_number":1, "full_name":"...", "registration_number":"...",
--    "email":"...", "whatsapp_number":"..." }, ...]
-- =========================================================
create or replace function register_team(
  p_team_name text,
  p_team_size integer,
  p_team_email text,
  p_team_whatsapp text,
  p_hackerrank_team_name text,
  p_github_url text,
  p_additional_information text,
  p_members jsonb
)
returns table(registration_code text) as $$
declare
  v_code text;
  v_team_id uuid;
  member jsonb;
begin
  if exists (select 1 from teams where lower(team_name) = lower(p_team_name)) then
    raise exception 'TEAM_NAME_EXISTS';
  end if;

  if jsonb_array_length(p_members) <> p_team_size then
    raise exception 'MEMBER_COUNT_MISMATCH';
  end if;

  v_code := generate_registration_code();

  insert into teams (
    registration_code, team_name, team_size,
    team_email, team_whatsapp, hackerrank_team_name, github_url,
    additional_information, status
  ) values (
    v_code, p_team_name, p_team_size,
    p_team_email, p_team_whatsapp, p_hackerrank_team_name, p_github_url,
    p_additional_information, 'submitted'
  ) returning id into v_team_id;

  for member in select * from jsonb_array_elements(p_members)
  loop
    insert into team_members (
      team_id, member_number, full_name, registration_number,
      email, whatsapp_number
    ) values (
      v_team_id,
      (member->>'member_number')::integer,
      member->>'full_name',
      member->>'registration_number',
      member->>'email',
      member->>'whatsapp_number'
    );
  end loop;

  return query select v_code;
end;
$$ language plpgsql security definer;

-- =========================================================
-- Row Level Security
-- Public clients get no direct table access. All writes go through
-- register_team() via the server-side API route using the service
-- role key. No public SELECT policy is defined, so the tables are
-- not publicly readable either.
-- =========================================================
alter table teams enable row level security;
alter table team_members enable row level security;

-- No policies are created for anon/authenticated roles: this makes
-- the tables inaccessible to the public Supabase client entirely.
-- Access happens only via the service role key on the server, and
-- via register_team() if you later choose to grant it to anon.
