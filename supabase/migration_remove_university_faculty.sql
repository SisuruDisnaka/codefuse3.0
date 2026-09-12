begin;

-- =========================================================
-- TEAMS
-- Remove fields no longer required for intra-faculty competition
-- =========================================================

alter table teams drop column if exists university;
alter table teams drop column if exists faculty;
alter table teams drop column if exists batch;


-- =========================================================
-- TEAM MEMBERS
-- Rename old columns only if they exist
-- =========================================================

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'student_id'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'registration_number'
  ) then
    alter table team_members
      rename column student_id to registration_number;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'university_email'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'team_members'
      and column_name = 'email'
  ) then
    alter table team_members
      rename column university_email to email;
  end if;
end $$;


alter table team_members
  drop column if exists hackerrank_username;


-- =========================================================
-- REGISTRATION FUNCTION
-- =========================================================

drop function if exists register_team(
  text, integer, text, text, text,
  text, text, text, text, jsonb
);

drop function if exists register_team(
  text, integer, text, text, text,
  text, text, jsonb
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

  v_code := generate_registration_code();

  insert into teams (
    registration_code,
    team_name,
    team_size,
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