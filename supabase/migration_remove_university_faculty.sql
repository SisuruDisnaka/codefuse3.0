-- CODEFUSE 3.0 — migration for existing Supabase projects
-- Run this AFTER the original schema.sql has already been applied and the
-- teams/team_members tables exist with data. It brings an already-deployed
-- database in line with the updated schema.sql (intra-faculty registration:
-- no University/Faculty/Batch, members identified by Registration Number
-- and Email instead of Student ID / University Email / HackerRank username).
--
-- Safe to run once. Wrap in a transaction so it's all-or-nothing.

begin;

-- =========================================================
-- teams: drop University / Faculty / Batch
-- =========================================================
alter table teams drop column if exists university;
alter table teams drop column if exists faculty;
alter table teams drop column if exists batch;

-- =========================================================
-- team_members: rename student_id -> registration_number,
-- university_email -> email, drop hackerrank_username
-- =========================================================
alter table team_members rename column student_id to registration_number;
alter table team_members rename column university_email to email;
alter table team_members drop column if exists hackerrank_username;

-- =========================================================
-- register_team(): replace with the updated signature/body
-- (matches the version in schema.sql)
-- =========================================================
drop function if exists register_team(
  text, integer, text, text, text, text, text, text, text, jsonb
);

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

commit;
