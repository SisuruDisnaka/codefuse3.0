begin;

-- =========================================================
-- TEAMS
-- Add Year of Study, collected on the registration form's first step.
-- Nullable at the column level so existing rows aren't broken by this
-- migration; new registrations always populate it because
-- register_team() below requires and validates it, and the form
-- validation requires it before submission.
-- =========================================================

alter table teams add column if not exists year_of_study text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_year_of_study_check'
  ) then
    alter table teams
      add constraint teams_year_of_study_check
      check (year_of_study is null or year_of_study in (
        '1st Year', '2nd Year', '3rd Year', '4th Year'
      ));
  end if;
end $$;


-- =========================================================
-- REGISTRATION FUNCTION
-- Replace with a version that accepts and stores p_year_of_study.
-- =========================================================

drop function if exists register_team(
  text, integer, text, text, text,
  text, text, jsonb
);

create or replace function register_team(
  p_team_name text,
  p_team_size integer,
  p_year_of_study text,
  p_team_email text,
  p_team_whatsapp text,
  p_hackerrank_team_name text,
  p_github_url text,
  p_additional_information text,
  p_members jsonb
)
returns table(registration_code text)
as $$
declare
  v_code text;
  v_team_id uuid;
  member jsonb;
begin

  if exists (
    select 1
    from teams
    where lower(team_name) = lower(p_team_name)
  ) then
    raise exception 'TEAM_NAME_EXISTS';
  end if;

  if p_team_size not between 1 and 3 then
    raise exception 'INVALID_TEAM_SIZE';
  end if;

  if jsonb_array_length(p_members) <> p_team_size then
    raise exception 'MEMBER_COUNT_MISMATCH';
  end if;

  if p_year_of_study not in ('1st Year', '2nd Year', '3rd Year', '4th Year') then
    raise exception 'INVALID_YEAR_OF_STUDY';
  end if;

  v_code := generate_registration_code();

  insert into teams (
    registration_code,
    team_name,
    team_size,
    year_of_study,
    team_email,
    team_whatsapp,
    hackerrank_team_name,
    github_url,
    additional_information,
    status
  )
  values (
    v_code,
    p_team_name,
    p_team_size,
    p_year_of_study,
    p_team_email,
    p_team_whatsapp,
    p_hackerrank_team_name,
    p_github_url,
    p_additional_information,
    'submitted'
  )
  returning id into v_team_id;

  for member in
    select * from jsonb_array_elements(p_members)
  loop

    insert into team_members (
      team_id,
      member_number,
      full_name,
      registration_number,
      email,
      whatsapp_number
    )
    values (
      v_team_id,
      (member->>'member_number')::integer,
      member->>'full_name',
      member->>'registration_number',
      member->>'email',
      member->>'whatsapp_number'
    );

  end loop;

  return query
    select v_code;

end;
$$
language plpgsql
security definer
set search_path = public;


commit;
