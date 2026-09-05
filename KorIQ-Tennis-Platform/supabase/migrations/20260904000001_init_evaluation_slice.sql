-- ============================================================================
-- KorIQ — Evaluation slice schema
-- ----------------------------------------------------------------------------
-- Scope: authentication profiles, clubs, coaches, students, players and the
-- NTRP-based evaluation engine. Scoring is computed in the database (trigger),
-- access is enforced with row-level security, and analytics are exposed as
-- SQL views so the front-end only renders what Postgres computes.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Reference data: NTRP levels and scoring weights
--    Fundamentals dominate for beginners, performance for advanced players.
-- ----------------------------------------------------------------------------
create table public.ntrp_levels (
    level               text primary key,
    sort_order          int  not null unique,
    fundamentals_weight numeric(3,2) not null check (fundamentals_weight between 0 and 1),
    performance_weight  numeric(3,2) not null check (performance_weight  between 0 and 1),
    constraint ntrp_weights_sum_to_one check (fundamentals_weight + performance_weight = 1.00)
);

insert into public.ntrp_levels (level, sort_order, fundamentals_weight, performance_weight) values
    ('1.0-1.5',  1, 0.70, 0.30),
    ('2.0-2.5',  2, 0.50, 0.50),
    ('3.0',      3, 0.30, 0.70),
    ('3.5',      4, 0.20, 0.80),
    ('4.0',      5, 0.10, 0.90),
    ('4.5',      6, 0.10, 0.90),
    ('4.0-4.5',  7, 0.10, 0.90),
    ('5.0',      8, 0.00, 1.00),
    ('5.5+',     9, 0.00, 1.00),
    ('6.0+',    10, 0.00, 1.00);

-- ----------------------------------------------------------------------------
-- 2. Core entities
--    Text primary keys (default uuid) so seeded prototype ids like 'c1' remain
--    valid while new rows get real uuids.
-- ----------------------------------------------------------------------------
create table public.clubs (
    id          text primary key default gen_random_uuid()::text,
    name        text not null,
    location    text,
    website_url text,
    created_at  timestamptz not null default now()
);

create table public.coaches (
    id           text primary key default gen_random_uuid()::text,
    name         text not null,
    email        text not null,
    phone        text,
    club_id      text references public.clubs(id) on delete set null,
    coach_type   text not null check (coach_type in ('Club', 'Independent', 'Both')),
    status       text not null default 'Unclaimed' check (status in ('Active', 'Inactive', 'Unclaimed')),
    joined_date  date not null default current_date,
    rate         numeric(8,2),
    specialties  text[],
    bio          text,
    rating       numeric(3,2),
    review_count int,
    created_at   timestamptz not null default now()
);
create unique index coaches_email_lower_idx on public.coaches (lower(email));
create index coaches_club_id_idx on public.coaches (club_id);

create table public.students (
    id                  text primary key default gen_random_uuid()::text,
    name                text not null,
    email               text not null,
    age                 int  not null check (age between 3 and 100),
    current_ntrp        text not null references public.ntrp_levels(level),
    starting_ntrp       text references public.ntrp_levels(level),
    club_id             text references public.clubs(id)   on delete set null,
    primary_coach_id    text references public.coaches(id) on delete set null,
    status              text not null default 'Unclaimed' check (status in ('Claimed', 'Unclaimed')),
    joined_date         date not null default current_date,
    created_from        text check (created_from in ('Manual', 'CSV Import', 'Coach Added')),
    physical_attributes jsonb,
    total_paid          numeric(10,2),
    last_payment_date   date,
    payment_count       int,
    created_at          timestamptz not null default now()
);
create unique index students_email_lower_idx on public.students (lower(email));
create index students_club_id_idx on public.students (club_id);
create index students_primary_coach_id_idx on public.students (primary_coach_id);

create table public.players (
    id           text primary key default gen_random_uuid()::text,
    name         text not null,
    email        text not null,
    city         text not null,
    current_ntrp text not null references public.ntrp_levels(level),
    joined_date  date not null default current_date,
    -- Prototype-only profile fields (bio, availability, self-assessment, …)
    extras       jsonb not null default '{}'::jsonb,
    created_at   timestamptz not null default now()
);
create unique index players_email_lower_idx on public.players (lower(email));

-- ----------------------------------------------------------------------------
-- 3. Evaluations (the "Session" in the front-end)
--    Stroke fundamentals are stored per stroke; level-specific performance
--    criteria are a jsonb map {criterion: score}. Averages and the weighted
--    final score are computed by trigger so the database is authoritative.
-- ----------------------------------------------------------------------------
create table public.evaluations (
    id                 text primary key default gen_random_uuid()::text,
    student_id         text not null references public.students(id) on delete cascade,
    coach_id           text not null references public.coaches(id),
    club_id            text references public.clubs(id),
    evaluated_at       timestamptz not null default now(),
    ntrp_level         text not null references public.ntrp_levels(level),
    class_type         text not null default '1-on-1' check (class_type in ('Group', '1-on-1', '1v2', '1v4')),
    session_type       text not null default 'CLUB'   check (session_type in ('CLUB', 'INDEPENDENT')),
    duration_minutes   int  not null default 60 check (duration_minutes > 0),
    fh_score           numeric(4,2) not null default 0 check (fh_score     between 0 and 10),
    bh_score           numeric(4,2) not null default 0 check (bh_score     between 0 and 10),
    serve_score        numeric(4,2) not null default 0 check (serve_score  between 0 and 10),
    volley_score       numeric(4,2) not null default 0 check (volley_score between 0 and 10),
    performance_scores jsonb not null default '{}'::jsonb,
    -- computed
    fundamentals_avg   numeric(4,2) not null default 0,
    performance_avg    numeric(4,2) not null default 0,
    final_score        numeric(5,1) not null default 0,
    notes              text not null default '',
    created_by         uuid references auth.users(id) default auth.uid(),
    created_at         timestamptz not null default now()
);
create index evaluations_student_date_idx on public.evaluations (student_id, evaluated_at);
create index evaluations_coach_id_idx on public.evaluations (coach_id);
create index evaluations_club_id_idx on public.evaluations (club_id);

-- Average of a {criterion: score} map.
create or replace function public.performance_average(scores jsonb)
returns numeric
language sql immutable
as $$
    select coalesce(avg(value::numeric), 0)
    from jsonb_each_text(coalesce(scores, '{}'::jsonb));
$$;

-- Weighted 0–100 score for a given level.
create or replace function public.compute_final_score(p_level text, p_fund_avg numeric, p_perf_avg numeric)
returns numeric
language sql stable
as $$
    select round((p_fund_avg * l.fundamentals_weight + p_perf_avg * l.performance_weight) * 10, 1)
    from public.ntrp_levels l
    where l.level = p_level;
$$;

-- A stroke score of 0 means "not assessed this session". Fundamentals average
-- only the assessed strokes; a session with none assessed is performance-only.
create or replace function public.evaluations_before_write()
returns trigger
language plpgsql
as $$
declare
    v_assessed int := (new.fh_score > 0)::int + (new.bh_score > 0)::int
                    + (new.serve_score > 0)::int + (new.volley_score > 0)::int;
begin
    new.performance_avg := round(public.performance_average(new.performance_scores), 2);

    if v_assessed = 0 then
        new.fundamentals_avg := 0;
        new.final_score      := round(new.performance_avg * 10, 1);
    else
        new.fundamentals_avg := round((new.fh_score + new.bh_score + new.serve_score + new.volley_score) / v_assessed, 2);
        new.final_score      := coalesce(public.compute_final_score(new.ntrp_level, new.fundamentals_avg, new.performance_avg), 0);
    end if;

    -- Default the club from the student when not supplied.
    if new.club_id is null then
        select s.club_id into new.club_id from public.students s where s.id = new.student_id;
    end if;
    return new;
end;
$$;

create trigger trg_evaluations_before_write
    before insert or update on public.evaluations
    for each row execute function public.evaluations_before_write();

-- Evaluating a student at a higher level promotes them.
create or replace function public.evaluations_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.students s
       set current_ntrp = new.ntrp_level
     where s.id = new.student_id
       and (select sort_order from public.ntrp_levels where level = new.ntrp_level)
         > (select sort_order from public.ntrp_levels where level = s.current_ntrp);
    return new;
end;
$$;

create trigger trg_evaluations_after_insert
    after insert on public.evaluations
    for each row execute function public.evaluations_after_insert();

-- ----------------------------------------------------------------------------
-- 4. Auth profiles — one auth user may hold several roles
-- ----------------------------------------------------------------------------
create table public.profiles (
    user_id                 uuid not null references auth.users(id) on delete cascade,
    role                    text not null check (role in ('COACH', 'STUDENT', 'CLUB', 'PLAYER')),
    linked_entity_id        text not null,
    email                   text not null,
    onboarding_completed_at timestamptz,
    onboarding_skipped      boolean not null default false,
    created_at              timestamptz not null default now(),
    primary key (user_id, role)
);
create index profiles_linked_entity_idx on public.profiles (linked_entity_id);

-- Helpers used by RLS policies. SECURITY DEFINER so they can read profiles
-- without recursing into profiles' own policies.
create or replace function public.my_entity_id(p_role text)
returns text
language sql stable security definer
set search_path = public
as $$
    select linked_entity_id from public.profiles
    where user_id = auth.uid() and role = p_role
    limit 1;
$$;

create or replace function public.my_coach_club_id()
returns text
language sql stable security definer
set search_path = public
as $$
    select c.club_id from public.coaches c
    where c.id = public.my_entity_id('COACH');
$$;

create or replace function public.my_email()
returns text
language sql stable
as $$
    select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- ----------------------------------------------------------------------------
-- 5. Row-level security
-- ----------------------------------------------------------------------------
alter table public.ntrp_levels enable row level security;
alter table public.clubs       enable row level security;
alter table public.coaches     enable row level security;
alter table public.students    enable row level security;
alter table public.players     enable row level security;
alter table public.evaluations enable row level security;
alter table public.profiles    enable row level security;

-- Reference data: readable by everyone.
create policy ntrp_levels_read on public.ntrp_levels for select using (true);

-- Clubs: public directory; only the owning club account can edit.
create policy clubs_read   on public.clubs for select using (true);
create policy clubs_update on public.clubs for update to authenticated
    using (id = public.my_entity_id('CLUB'));

-- Coaches: directory visible to signed-in users; a club manages its roster;
-- a coach edits their own profile.
create policy coaches_read on public.coaches for select to authenticated using (true);
create policy coaches_insert_by_club on public.coaches for insert to authenticated
    with check (club_id is not null and club_id = public.my_entity_id('CLUB'));
create policy coaches_update on public.coaches for update to authenticated
    using (id = public.my_entity_id('COACH') or club_id = public.my_entity_id('CLUB'));

-- Students: self, their club, their primary coach, or any coach at their club.
create policy students_read on public.students for select to authenticated
    using (
        id = public.my_entity_id('STUDENT')
        or club_id = public.my_entity_id('CLUB')
        or primary_coach_id = public.my_entity_id('COACH')
        or (club_id is not null and club_id = public.my_coach_club_id())
    );
create policy students_insert on public.students for insert to authenticated
    with check (
        (club_id is not null and club_id = public.my_entity_id('CLUB'))
        or (primary_coach_id is not null and primary_coach_id = public.my_entity_id('COACH'))
    );
create policy students_update on public.students for update to authenticated
    using (
        id = public.my_entity_id('STUDENT')
        or club_id = public.my_entity_id('CLUB')
        or primary_coach_id = public.my_entity_id('COACH')
    );

-- Players: community directory; self-edit only.
create policy players_read   on public.players for select to authenticated using (true);
create policy players_update on public.players for update to authenticated
    using (id = public.my_entity_id('PLAYER'));

-- Evaluations: a student sees their own; a coach sees what they authored or
-- anything at their club; a club sees everything in its walls.
create policy evaluations_read on public.evaluations for select to authenticated
    using (
        student_id = public.my_entity_id('STUDENT')
        or coach_id = public.my_entity_id('COACH')
        or (club_id is not null and club_id = public.my_coach_club_id())
        or club_id = public.my_entity_id('CLUB')
    );
-- Only a coach can write an evaluation, only as themselves, only for a student
-- they are allowed to see.
create policy evaluations_insert on public.evaluations for insert to authenticated
    with check (
        coach_id = public.my_entity_id('COACH')
        and exists (select 1 from public.students s where s.id = student_id)
    );
create policy evaluations_update on public.evaluations for update to authenticated
    using (coach_id = public.my_entity_id('COACH'));

-- Profiles: users manage only their own.
create policy profiles_read   on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_insert on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy profiles_update on public.profiles for update to authenticated using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 6. RPCs for sign-up flows (SECURITY DEFINER, validated against the JWT)
-- ----------------------------------------------------------------------------

-- Pre-login lookups used by the "claim your profile" flows. Return only what
-- the UI needs to confirm identity; never emails of other people.
create or replace function public.lookup_coach_by_email(p_email text)
returns table (id text, name text, club_id text, coach_type text, status text, joined_date date)
language sql stable security definer
set search_path = public
as $$
    select c.id, c.name, c.club_id, c.coach_type, c.status, c.joined_date
    from public.coaches c
    where lower(c.email) = lower(p_email);
$$;

create or replace function public.lookup_student_by_email(p_email text)
returns table (id text, name text, status text)
language sql stable security definer
set search_path = public
as $$
    select s.id, s.name, s.status
    from public.students s
    where lower(s.email) = lower(p_email);
$$;

-- Create the entity for a role and link it to the signed-in user.
create or replace function public.register_profile(p_role text, p_payload jsonb)
returns text
language plpgsql security definer
set search_path = public
as $$
declare
    v_uid   uuid := auth.uid();
    v_email text := public.my_email();
    v_id    text;
begin
    if v_uid is null then
        raise exception 'Not authenticated';
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

-- Claim a coach row the club pre-created. The signed-in email must match.
create or replace function public.claim_coach_profile(p_coach_id text)
returns text
language plpgsql security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_row public.coaches%rowtype;
begin
    select * into v_row from public.coaches where id = p_coach_id;
    if not found then raise exception 'Coach profile not found'; end if;
    if lower(v_row.email) <> public.my_email() then
        raise exception 'This profile belongs to a different email address';
    end if;
    if v_row.status <> 'Unclaimed' then
        raise exception 'This profile has already been claimed';
    end if;

    update public.coaches set status = 'Active' where id = p_coach_id;
    insert into public.profiles (user_id, role, linked_entity_id, email)
    values (v_uid, 'COACH', p_coach_id, public.my_email());
    return p_coach_id;
end;
$$;

create or replace function public.claim_student_profile(p_student_id text)
returns text
language plpgsql security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_row public.students%rowtype;
begin
    select * into v_row from public.students where id = p_student_id;
    if not found then raise exception 'Student profile not found'; end if;
    if lower(v_row.email) <> public.my_email() then
        raise exception 'This profile belongs to a different email address';
    end if;
    if v_row.status <> 'Unclaimed' then
        raise exception 'This profile has already been claimed';
    end if;

    update public.students set status = 'Claimed' where id = p_student_id;
    insert into public.profiles (user_id, role, linked_entity_id, email)
    values (v_uid, 'STUDENT', p_student_id, public.my_email());
    return p_student_id;
end;
$$;

create or replace function public.complete_onboarding(p_role text, p_skipped boolean default false)
returns void
language sql security definer
set search_path = public
as $$
    update public.profiles
       set onboarding_completed_at = now(), onboarding_skipped = p_skipped
     where user_id = auth.uid() and role = p_role;
$$;

-- Mutating RPCs are for signed-in users only.
revoke execute on function public.register_profile(text, jsonb)      from public, anon;
revoke execute on function public.claim_coach_profile(text)          from public, anon;
revoke execute on function public.claim_student_profile(text)        from public, anon;
revoke execute on function public.complete_onboarding(text, boolean) from public, anon;

-- ----------------------------------------------------------------------------
-- 7. Analytics views (security_invoker => RLS of the caller applies)
-- ----------------------------------------------------------------------------

-- Every evaluation with its position in the student's timeline and the change
-- since the previous one.
create view public.v_student_progress
with (security_invoker = true) as
select
    e.id                    as evaluation_id,
    e.student_id,
    e.coach_id,
    c.name                  as coach_name,
    e.club_id,
    e.evaluated_at,
    e.ntrp_level,
    e.final_score,
    e.fundamentals_avg,
    e.performance_avg,
    e.fh_score, e.bh_score, e.serve_score, e.volley_score,
    row_number() over w     as evaluation_no,
    lag(e.final_score) over w                       as previous_score,
    e.final_score - lag(e.final_score) over w       as score_delta,
    (e.evaluated_at::date - lag(e.evaluated_at::date) over w) as days_since_previous
from public.evaluations e
join public.coaches c on c.id = e.coach_id
window w as (partition by e.student_id order by e.evaluated_at, e.id);

-- One row per student: where they started, where they are, and what to work on.
create view public.v_student_composite
with (security_invoker = true) as
with ordered as (
    select e.*,
           row_number() over (partition by e.student_id order by e.evaluated_at desc, e.id desc) as rn_desc,
           row_number() over (partition by e.student_id order by e.evaluated_at asc,  e.id asc)  as rn_asc
    from public.evaluations e
),
agg as (
    select
        student_id,
        count(*)                                         as evaluation_count,
        min(evaluated_at)                                as first_evaluated_at,
        max(evaluated_at)                                as last_evaluated_at,
        round(avg(final_score) filter (where rn_desc <= 3), 1) as avg_last_3,
        max(final_score) filter (where rn_desc = 1)      as latest_score,
        max(ntrp_level)  filter (where rn_desc = 1)      as latest_level,
        max(final_score) filter (where rn_asc  = 1)      as first_score,
        (array_agg(fh_score     order by evaluated_at desc) filter (where fh_score     > 0))[1] as fh_latest,
        (array_agg(bh_score     order by evaluated_at desc) filter (where bh_score     > 0))[1] as bh_latest,
        (array_agg(serve_score  order by evaluated_at desc) filter (where serve_score  > 0))[1] as serve_latest,
        (array_agg(volley_score order by evaluated_at desc) filter (where volley_score > 0))[1] as volley_latest
    from ordered
    group by student_id
)
select
    s.id            as student_id,
    s.name,
    s.club_id,
    s.primary_coach_id,
    s.current_ntrp,
    s.starting_ntrp,
    coalesce(a.evaluation_count, 0) as evaluation_count,
    a.first_evaluated_at,
    a.last_evaluated_at,
    a.first_score,
    a.latest_score,
    a.latest_level,
    a.latest_score - a.first_score  as improvement,
    a.avg_last_3,
    a.fh_latest, a.bh_latest, a.serve_latest, a.volley_latest,
    case
        when a.fh_latest is null and a.bh_latest is null and a.serve_latest is null and a.volley_latest is null then null
        when a.fh_latest     = least(coalesce(a.fh_latest,99), coalesce(a.bh_latest,99), coalesce(a.serve_latest,99), coalesce(a.volley_latest,99)) then 'Forehand'
        when a.bh_latest     = least(coalesce(a.fh_latest,99), coalesce(a.bh_latest,99), coalesce(a.serve_latest,99), coalesce(a.volley_latest,99)) then 'Backhand'
        when a.serve_latest  = least(coalesce(a.fh_latest,99), coalesce(a.bh_latest,99), coalesce(a.serve_latest,99), coalesce(a.volley_latest,99)) then 'Serve'
        else 'Volley'
    end                              as weakest_stroke,
    coalesce(a.latest_score >= 80, false) as promotion_ready,
    (select sort_order from public.ntrp_levels where level = s.current_ntrp)
      - coalesce((select sort_order from public.ntrp_levels where level = s.starting_ntrp), 
                 (select sort_order from public.ntrp_levels where level = s.current_ntrp)) as levels_gained
from public.students s
left join agg a on a.student_id = s.id;

-- Coach effectiveness: how much did students improve under each coach?
create view public.v_coach_impact
with (security_invoker = true) as
with per_pair as (
    select
        coach_id,
        student_id,
        count(*)                                                  as n,
        (array_agg(final_score order by evaluated_at asc,  id asc))[1]  as first_score,
        (array_agg(final_score order by evaluated_at desc, id desc))[1] as last_score
    from public.evaluations
    group by coach_id, student_id
),
totals as (
    select coach_id,
           count(*)                  as evaluation_count,
           round(avg(final_score),1) as avg_score,
           max(evaluated_at)         as last_evaluation_at
    from public.evaluations
    group by coach_id
)
select
    c.id          as coach_id,
    c.name        as coach_name,
    c.club_id,
    c.coach_type,
    coalesce(t.evaluation_count, 0)                                  as evaluation_count,
    count(p.student_id)                                              as students_evaluated,
    t.avg_score,
    t.last_evaluation_at,
    round(avg(p.last_score - p.first_score) filter (where p.n >= 2), 1) as avg_student_improvement,
    count(*) filter (where p.n >= 2 and p.last_score > p.first_score)   as students_improved,
    count(*) filter (where p.n >= 2)                                    as students_with_repeat_evals
from public.coaches c
left join per_pair p on p.coach_id = c.id
left join totals   t on t.coach_id = c.id
group by c.id, c.name, c.club_id, c.coach_type, t.evaluation_count, t.avg_score, t.last_evaluation_at;

-- Club activity by month.
create view public.v_club_monthly_evaluations
with (security_invoker = true) as
select
    club_id,
    date_trunc('month', evaluated_at)::date        as month,
    count(*)                                       as evaluations,
    count(distinct student_id)                     as students_evaluated,
    count(distinct coach_id)                       as active_coaches,
    round(avg(final_score), 1)                     as avg_score,
    count(*) filter (where final_score >= 80)      as promotion_ready_evaluations
from public.evaluations
where club_id is not null
group by club_id, date_trunc('month', evaluated_at);

-- Peer benchmarks per level (what "average" looks like at each NTRP band).
create view public.v_level_benchmarks
with (security_invoker = true) as
select
    l.level                                                  as ntrp_level,
    l.sort_order,
    count(e.id)                                              as evaluations,
    count(distinct e.student_id)                             as students,
    round(avg(e.final_score), 1)                             as avg_final_score,
    round(avg(e.fh_score)     filter (where e.fh_score     > 0), 2) as avg_fh,
    round(avg(e.bh_score)     filter (where e.bh_score     > 0), 2) as avg_bh,
    round(avg(e.serve_score)  filter (where e.serve_score  > 0), 2) as avg_serve,
    round(avg(e.volley_score) filter (where e.volley_score > 0), 2) as avg_volley,
    round(avg(e.performance_avg), 2)                         as avg_performance
from public.ntrp_levels l
left join public.evaluations e on e.ntrp_level = l.level
group by l.level, l.sort_order;

-- ----------------------------------------------------------------------------
-- 8. Grants (Supabase default privileges usually cover these; explicit for
--    clarity and so the migration is self-contained).
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.ntrp_levels, public.clubs to anon, authenticated;
grant select, insert, update on public.coaches, public.students, public.players,
                                 public.evaluations, public.profiles to authenticated;
grant select on public.v_student_progress, public.v_student_composite, public.v_coach_impact,
                public.v_club_monthly_evaluations, public.v_level_benchmarks to authenticated;
grant execute on function public.lookup_coach_by_email(text), public.lookup_student_by_email(text) to anon, authenticated;
grant execute on function public.register_profile(text, jsonb), public.claim_coach_profile(text),
                          public.claim_student_profile(text), public.complete_onboarding(text, boolean) to authenticated;
