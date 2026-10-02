-- ============================================================================
-- KorIQ — security hardening for the evaluation slice
-- ----------------------------------------------------------------------------
-- The anon key ships in the public bundle, sign-up is open and the demo
-- passwords are published, so every rule here assumes the caller is a
-- stranger with a valid account. Verified by supabase/tests/security.test.sql.
--
-- Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Profiles decide which club, coach or student an account acts as, so they
--    may only be written by the SECURITY DEFINER sign-up and claim RPCs.
-- ----------------------------------------------------------------------------
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_update on public.profiles;
revoke insert, update on public.profiles from authenticated;

-- ----------------------------------------------------------------------------
-- 2. Table privileges. Supabase grants every API role ALL on new tables and
--    leaves the rest to RLS; narrow that so a missing policy fails closed.
--    Anonymous visitors read only the club directory and the NTRP levels.
-- ----------------------------------------------------------------------------
revoke all on public.coaches, public.students, public.players, public.evaluations, public.profiles,
              public.v_student_progress, public.v_student_composite, public.v_coach_impact,
              public.v_club_monthly_evaluations, public.v_level_benchmarks
    from anon;
revoke insert, update, delete, truncate, references, trigger on public.clubs, public.ntrp_levels from anon;

revoke insert, update, delete, truncate, references, trigger on public.ntrp_levels from authenticated;
revoke insert, delete, truncate, references, trigger on public.clubs from authenticated;
revoke delete, truncate, references, trigger
    on public.coaches, public.students, public.players, public.evaluations, public.profiles
    from authenticated;
revoke insert, update, delete, truncate, references, trigger
    on public.v_student_progress, public.v_student_composite, public.v_coach_impact,
       public.v_club_monthly_evaluations, public.v_level_benchmarks
    from authenticated;

-- ----------------------------------------------------------------------------
-- 3. Visibility of people. Coach and player rows carry contact details, so
--    instead of "any signed-in account" they are visible only to someone with
--    a relationship to them.
-- ----------------------------------------------------------------------------
create or replace function public.my_student_club_id()
returns text
language sql stable security definer
set search_path = ''
as $$
    select s.club_id from public.students s where s.id = public.my_entity_id('STUDENT');
$$;

create or replace function public.my_student_coach_id()
returns text
language sql stable security definer
set search_path = ''
as $$
    select s.primary_coach_id from public.students s where s.id = public.my_entity_id('STUDENT');
$$;

-- Coaches: themselves, everyone at the same club (admin, coaches, students),
-- a student's primary coach, and any coach who authored an evaluation the
-- caller can already see (keeps coach names in progress views).
drop policy if exists coaches_read on public.coaches;
create policy coaches_read on public.coaches for select to authenticated
    using (
        id = public.my_entity_id('COACH')
        or (club_id is not null
            and club_id in (public.my_entity_id('CLUB'), public.my_coach_club_id(), public.my_student_club_id()))
        or id = public.my_student_coach_id()
        or exists (select 1 from public.evaluations e where e.coach_id = coaches.id)
    );

drop policy if exists players_read on public.players;
create policy players_read on public.players for select to authenticated
    using (id = public.my_entity_id('PLAYER'));

-- A club adds coaches to its own roster; they start unclaimed.
drop policy if exists coaches_insert_by_club on public.coaches;
create policy coaches_insert_by_club on public.coaches for insert to authenticated
    with check (
        club_id is not null and club_id = public.my_entity_id('CLUB')
        and status = 'Unclaimed'
    );

-- A club adds students to its roster (optionally with one of its coaches), or
-- a coach adds a student they will coach, inside their own club if they have one.
drop policy if exists students_insert on public.students;
create policy students_insert on public.students for insert to authenticated
    with check (
        status = 'Unclaimed'
        and (
            (club_id is not null and club_id = public.my_entity_id('CLUB')
             and (primary_coach_id is null
                  or exists (select 1 from public.coaches c
                             where c.id = students.primary_coach_id and c.club_id = students.club_id)))
            or
            (primary_coach_id is not null and primary_coach_id = public.my_entity_id('COACH')
             and (club_id is null or club_id = public.my_coach_club_id()))
        )
    );

-- ----------------------------------------------------------------------------
-- 4. Field-level guards. RLS decides which rows someone may update; these
--    triggers decide which columns. They only restrict API callers (anon /
--    authenticated): the RPCs above run as the table owner and pass through.
-- ----------------------------------------------------------------------------
create or replace function public.coaches_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if current_user not in ('anon', 'authenticated') then
        return new;
    end if;
    if (new.id, new.email, new.joined_date, new.rating, new.review_count, new.created_at)
       is distinct from (old.id, old.email, old.joined_date, old.rating, old.review_count, old.created_at) then
        raise exception 'A coach''s id, email, join date and ratings cannot be edited' using errcode = '42501';
    end if;
    if (new.club_id, new.coach_type, new.status) is distinct from (old.club_id, old.coach_type, old.status)
       and (old.club_id is null or old.club_id is distinct from public.my_entity_id('CLUB')) then
        raise exception 'Only the coach''s club can change their club, type or status' using errcode = '42501';
    end if;
    return new;
end;
$$;

drop trigger if exists trg_coaches_guard_update on public.coaches;
create trigger trg_coaches_guard_update
    before update on public.coaches
    for each row execute function public.coaches_guard_update();

create or replace function public.students_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    v_is_club  boolean;
    v_is_coach boolean;
begin
    if current_user not in ('anon', 'authenticated') then
        return new;
    end if;
    v_is_club  := coalesce(old.club_id = public.my_entity_id('CLUB'), false);
    v_is_coach := coalesce(old.primary_coach_id = public.my_entity_id('COACH'), false);
    if (new.id, new.email, new.status, new.club_id, new.joined_date, new.created_from, new.created_at)
       is distinct from (old.id, old.email, old.status, old.club_id, old.joined_date, old.created_from, old.created_at) then
        raise exception 'A student''s id, email, status, club and join date cannot be edited' using errcode = '42501';
    end if;
    if (new.total_paid, new.last_payment_date, new.payment_count, new.primary_coach_id)
       is distinct from (old.total_paid, old.last_payment_date, old.payment_count, old.primary_coach_id) then
        if not v_is_club then
            raise exception 'Only the student''s club can change billing or the primary coach' using errcode = '42501';
        end if;
        if new.primary_coach_id is not null and not exists (
            select 1 from public.coaches c where c.id = new.primary_coach_id and c.club_id = old.club_id
        ) then
            raise exception 'The primary coach must belong to the student''s club' using errcode = '42501';
        end if;
    end if;
    if (new.current_ntrp, new.starting_ntrp) is distinct from (old.current_ntrp, old.starting_ntrp)
       and not (v_is_club or v_is_coach) then
        raise exception 'Only the student''s club or coach can change their level' using errcode = '42501';
    end if;
    return new;
end;
$$;

drop trigger if exists trg_students_guard_update on public.students;
create trigger trg_students_guard_update
    before update on public.students
    for each row execute function public.students_guard_update();

create or replace function public.players_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if current_user in ('anon', 'authenticated')
       and (new.id, new.email, new.joined_date, new.created_at)
           is distinct from (old.id, old.email, old.joined_date, old.created_at) then
        raise exception 'A player''s id, email and join date cannot be edited' using errcode = '42501';
    end if;
    return new;
end;
$$;

drop trigger if exists trg_players_guard_update on public.players;
create trigger trg_players_guard_update
    before update on public.players
    for each row execute function public.players_guard_update();

create or replace function public.clubs_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if current_user in ('anon', 'authenticated')
       and (new.id, new.created_at) is distinct from (old.id, old.created_at) then
        raise exception 'A club''s id cannot be edited' using errcode = '42501';
    end if;
    return new;
end;
$$;

drop trigger if exists trg_clubs_guard_update on public.clubs;
create trigger trg_clubs_guard_update
    before update on public.clubs
    for each row execute function public.clubs_guard_update();

-- Evaluations: the database, not the client, decides the club an evaluation
-- is filed under and who created it, and validates the performance scores.
create or replace function public.evaluations_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    v_assessed int := (new.fh_score > 0)::int + (new.bh_score > 0)::int
                    + (new.serve_score > 0)::int + (new.volley_score > 0)::int;
begin
    if (select count(*) from jsonb_object_keys(coalesce(new.performance_scores, '{}'::jsonb))) > 20
       or exists (select 1 from jsonb_each_text(coalesce(new.performance_scores, '{}'::jsonb))
                  where value !~ '^[0-9]+(\.[0-9]+)?$' or value::numeric > 10) then
        raise exception 'Performance scores must be at most 20 numbers between 0 and 10' using errcode = '22023';
    end if;

    if current_user in ('anon', 'authenticated') then
        if tg_op = 'INSERT' then
            new.created_by := auth.uid();
            new.created_at := now();
            select s.club_id into new.club_id from public.students s where s.id = new.student_id;
        elsif (new.student_id, new.coach_id, new.club_id, new.created_by, new.created_at)
              is distinct from (old.student_id, old.coach_id, old.club_id, old.created_by, old.created_at) then
            raise exception 'An evaluation''s student, coach and club cannot be changed' using errcode = '42501';
        end if;
    elsif new.club_id is null then
        select s.club_id into new.club_id from public.students s where s.id = new.student_id;
    end if;

    new.performance_avg := round(public.performance_average(new.performance_scores), 2);

    if v_assessed = 0 then
        new.fundamentals_avg := 0;
        new.final_score      := round(new.performance_avg * 10, 1);
    else
        new.fundamentals_avg := round((new.fh_score + new.bh_score + new.serve_score + new.volley_score) / v_assessed, 2);
        new.final_score      := coalesce(public.compute_final_score(new.ntrp_level, new.fundamentals_avg, new.performance_avg), 0);
    end if;
    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5. Sign-up RPCs
-- ----------------------------------------------------------------------------
-- The pre-login lookups are callable by anyone, so they only describe profiles
-- that are still waiting to be claimed. For a claimed profile they return just
-- the status, which is all the UI needs to say "please log in".
create or replace function public.lookup_coach_by_email(p_email text)
returns table (id text, name text, club_id text, coach_type text, status text, joined_date date)
language sql stable security definer
set search_path = ''
as $$
    select case when c.status = 'Unclaimed' then c.id end,
           case when c.status = 'Unclaimed' then c.name end,
           case when c.status = 'Unclaimed' then c.club_id end,
           c.coach_type,
           c.status,
           case when c.status = 'Unclaimed' then c.joined_date end
    from public.coaches c
    where lower(c.email) = lower(btrim(p_email));
$$;

create or replace function public.lookup_student_by_email(p_email text)
returns table (id text, name text, status text)
language sql stable security definer
set search_path = ''
as $$
    select case when s.status = 'Unclaimed' then s.id end,
           case when s.status = 'Unclaimed' then s.name end,
           s.status
    from public.students s
    where lower(s.email) = lower(btrim(p_email));
$$;

-- Same as before, but refuses accounts without an email address (e.g. anonymous
-- sign-ins), which would otherwise create unclaimable rows.
create or replace function public.register_profile(p_role text, p_payload jsonb)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
    v_uid   uuid := auth.uid();
    v_email text := public.my_email();
    v_id    text;
begin
    if v_uid is null then
        raise exception 'Not authenticated';
    end if;
    if v_email = '' then
        raise exception 'An email address is required';
    end if;
    if exists (select 1 from public.profiles where user_id = v_uid and role = p_role) then
        raise exception 'A % profile already exists for this account', p_role;
    end if;

    if p_role = 'COACH' then
        insert into public.coaches (name, email, phone, coach_type, status)
        values (p_payload ->> 'name', v_email, p_payload ->> 'phone', 'Independent', 'Active')
        returning id into v_id;

    elsif p_role = 'STUDENT' then
        insert into public.students (name, email, age, current_ntrp, status, created_from)
        values (p_payload ->> 'name', v_email, coalesce((p_payload ->> 'age')::int, 18),
                coalesce(p_payload ->> 'current_ntrp', '1.0-1.5'), 'Claimed', 'Manual')
        returning id into v_id;

    elsif p_role = 'CLUB' then
        insert into public.clubs (name, location)
        values (p_payload ->> 'name', p_payload ->> 'location')
        returning id into v_id;

    elsif p_role = 'PLAYER' then
        insert into public.players (name, email, city, current_ntrp)
        values (p_payload ->> 'name', v_email, coalesce(p_payload ->> 'city', ''),
                coalesce(p_payload ->> 'current_ntrp', '1.0-1.5'))
        returning id into v_id;

    else
        raise exception 'Unknown role %', p_role;
    end if;

    insert into public.profiles (user_id, role, linked_entity_id, email)
    values (v_uid, p_role, v_id, v_email);

    return v_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 6. Input limits, so one account cannot fill the database or the public club
--    directory with junk. NOT VALID: enforced for new and edited rows without
--    failing on anything already stored.
-- ----------------------------------------------------------------------------
alter table public.clubs
    drop constraint if exists clubs_name_len, add constraint clubs_name_len check (char_length(btrim(name)) between 1 and 100) not valid,
    drop constraint if exists clubs_location_len, add constraint clubs_location_len check (char_length(location) <= 200) not valid,
    drop constraint if exists clubs_website_url_http, add constraint clubs_website_url_http
        check (char_length(website_url) <= 300 and website_url ~* '^https?://[^[:space:]]+$') not valid;

alter table public.coaches
    drop constraint if exists coaches_name_len, add constraint coaches_name_len check (char_length(btrim(name)) between 1 and 100) not valid,
    drop constraint if exists coaches_email_len, add constraint coaches_email_len check (char_length(email) <= 254) not valid,
    drop constraint if exists coaches_phone_len, add constraint coaches_phone_len check (char_length(phone) <= 40) not valid,
    drop constraint if exists coaches_bio_len, add constraint coaches_bio_len check (char_length(bio) <= 2000) not valid,
    drop constraint if exists coaches_specialties_len, add constraint coaches_specialties_len
        check (cardinality(specialties) <= 20 and char_length(array_to_string(specialties, '')) <= 1000) not valid,
    drop constraint if exists coaches_rate_range, add constraint coaches_rate_range check (rate between 0 and 10000) not valid,
    drop constraint if exists coaches_rating_range, add constraint coaches_rating_range check (rating between 0 and 5) not valid,
    drop constraint if exists coaches_review_count_range, add constraint coaches_review_count_range check (review_count >= 0) not valid;

alter table public.students
    drop constraint if exists students_name_len, add constraint students_name_len check (char_length(btrim(name)) between 1 and 100) not valid,
    drop constraint if exists students_email_len, add constraint students_email_len check (char_length(email) <= 254) not valid,
    drop constraint if exists students_physical_size, add constraint students_physical_size check (octet_length(physical_attributes::text) <= 4096) not valid,
    drop constraint if exists students_billing_range, add constraint students_billing_range check (total_paid >= 0 and payment_count >= 0) not valid;

alter table public.players
    drop constraint if exists players_name_len, add constraint players_name_len check (char_length(btrim(name)) between 1 and 100) not valid,
    drop constraint if exists players_email_len, add constraint players_email_len check (char_length(email) <= 254) not valid,
    drop constraint if exists players_city_len, add constraint players_city_len check (char_length(city) <= 100) not valid,
    drop constraint if exists players_extras_size, add constraint players_extras_size check (octet_length(extras::text) <= 16384) not valid;

alter table public.evaluations
    drop constraint if exists evaluations_notes_len, add constraint evaluations_notes_len check (char_length(notes) <= 5000) not valid;

-- ----------------------------------------------------------------------------
-- 7. Shared demo accounts. Their passwords are published, so a visitor could
--    otherwise change the email or password and lock everyone else out.
--    Changes arriving through the Auth API are ignored for @koriq.demo users;
--    re-running seed.sql from the SQL editor still works.
-- ----------------------------------------------------------------------------
create or replace function public.protect_demo_accounts()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if current_user = 'supabase_auth_admin' and old.email like '%@koriq.demo' then
        new.email              := old.email;
        new.encrypted_password := old.encrypted_password;
        new.phone              := old.phone;
    end if;
    return new;
end;
$$;

drop trigger if exists koriq_protect_demo_accounts on auth.users;
create trigger koriq_protect_demo_accounts
    before update on auth.users
    for each row execute function public.protect_demo_accounts();

-- ----------------------------------------------------------------------------
-- 8. Function hygiene: pin search_path (Supabase security advisor) and keep
--    internal helpers out of the public RPC surface.
-- ----------------------------------------------------------------------------
alter function public.performance_average(jsonb)                  set search_path = '';
alter function public.compute_final_score(text, numeric, numeric) set search_path = '';
alter function public.evaluations_after_insert()                  set search_path = '';
alter function public.my_entity_id(text)                          set search_path = '';
alter function public.my_coach_club_id()                          set search_path = '';
alter function public.my_email()                                  set search_path = '';
alter function public.claim_coach_profile(text)                   set search_path = '';
alter function public.claim_student_profile(text)                 set search_path = '';
alter function public.complete_onboarding(text, boolean)          set search_path = '';

-- RLS helpers: needed by signed-in users' policies, useless to anyone else.
revoke execute on function public.my_entity_id(text), public.my_coach_club_id(), public.my_email(),
                           public.my_student_club_id(), public.my_student_coach_id()
    from public, anon;
grant execute on function public.my_entity_id(text), public.my_coach_club_id(), public.my_email(),
                          public.my_student_club_id(), public.my_student_coach_id()
    to authenticated;

-- Trigger functions run without an EXECUTE check; nobody needs to call them.
revoke execute on function public.evaluations_before_write(), public.evaluations_after_insert(),
                           public.coaches_guard_update(), public.students_guard_update(),
                           public.players_guard_update(), public.clubs_guard_update(),
                           public.protect_demo_accounts()
    from public, anon, authenticated;

-- Scoring helpers are called by the evaluation trigger as the signed-in user.
revoke execute on function public.performance_average(jsonb), public.compute_final_score(text, numeric, numeric)
    from public, anon;
grant execute on function public.performance_average(jsonb), public.compute_final_score(text, numeric, numeric)
    to authenticated;

-- register_profile was re-created above; keep it signed-in only.
revoke execute on function public.register_profile(text, jsonb) from public, anon;
grant execute on function public.register_profile(text, jsonb) to authenticated;
