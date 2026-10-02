-- Row-level security and field-guard tests for the evaluation slice.
-- Run against a local stack with the seed loaded:  supabase db reset && supabase test db
begin;
create extension if not exists pgtap with schema extensions;
select plan(53);

-- Account ids for the seeded demo users, plus a stranger who has only signed up.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a77c',
        'authenticated', 'authenticated', 'stranger@test.local', '', now(), now(), now());
select id as stranger_uid from auth.users where email = 'stranger@test.local' \gset
select id as coach_uid    from auth.users where email = 'coach@koriq.demo'    \gset
select id as student_uid  from auth.users where email = 'student@koriq.demo'  \gset
select id as club_uid     from auth.users where email = 'club@koriq.demo'     \gset
select id as player_uid   from auth.users where email = 'player@koriq.demo'   \gset

-- ---------------------------------------------------------------------------
-- Anonymous visitor (public anon key, not signed in)
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims', '{"role":"anon"}', true) \g /dev/null
set local role anon;

select ok((select count(*) from public.clubs) >= 3, 'anon reads the club directory');
select ok((select count(*) from public.ntrp_levels) = 10, 'anon reads the NTRP levels');
select throws_ok('select * from public.students', '42501', null, 'anon cannot read students');
select throws_ok('select * from public.coaches', '42501', null, 'anon cannot read coaches');
select throws_ok('select * from public.evaluations', '42501', null, 'anon cannot read evaluations');
select throws_ok('select * from public.v_student_composite', '42501', null, 'anon cannot read analytics views');
select throws_ok($$update public.clubs set name = 'x'$$, '42501', null, 'anon cannot edit clubs');
select throws_ok($$select public.register_profile('CLUB', '{"name":"x"}')$$, '42501', null, 'anon cannot register profiles');
select is((select name from public.lookup_coach_by_email('mike@club.com')), null,
          'lookup does not reveal the name behind a claimed coach email');
select is((select status from public.lookup_coach_by_email('mike@club.com')), 'Active',
          'lookup still reports that the coach email is taken');
select is((select name from public.lookup_student_by_email('jake@example.com')), 'Jake Wilson',
          'lookup describes an unclaimed student so they can claim it');
reset role;

-- ---------------------------------------------------------------------------
-- Stranger: a fresh account with no profile yet
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims',
    json_build_object('sub', :'stranger_uid', 'email', 'stranger@test.local', 'role', 'authenticated')::text, true) \g /dev/null
set local role authenticated;

select is((select count(*) from public.coaches), 0::bigint, 'stranger sees no coach contact details');
select is((select count(*) from public.players), 0::bigint, 'stranger sees no players');
select is((select count(*) from public.students), 0::bigint, 'stranger sees no students');
select is((select count(*) from public.evaluations), 0::bigint, 'stranger sees no evaluations');
select throws_ok(
    format($$insert into public.profiles (user_id, role, linked_entity_id, email)
             values (%L, 'CLUB', 'club_vancouver', 'stranger@test.local')$$, :'stranger_uid'),
    '42501', null, 'stranger cannot make themselves admin of an existing club');

select lives_ok($$select public.register_profile('COACH', '{"name":"Stranger Coach"}')$$,
                'stranger can sign up as an independent coach');
select public.my_entity_id('COACH') as stranger_coach_id \gset
select lives_ok(format($$update public.coaches set bio = 'Hello', rate = 80 where id = %L$$, :'stranger_coach_id'),
                'coach edits their own bio and rate');
select throws_ok(format($$update public.coaches set club_id = 'club_vancouver' where id = %L$$, :'stranger_coach_id'),
                 '42501', null, 'coach cannot move themselves into a club');
select throws_ok(format($$update public.coaches set rating = 5 where id = %L$$, :'stranger_coach_id'),
                 '42501', null, 'coach cannot set their own rating');
select throws_ok(
    format($$insert into public.evaluations (student_id, coach_id, ntrp_level) values ('s1', %L, '3.5')$$, :'stranger_coach_id'),
    '42501', null, 'coach cannot evaluate a student outside their roster');

select lives_ok($$select public.register_profile('CLUB', '{"name":"Stranger Club"}')$$,
                'stranger can sign up as a new club');
select throws_ok($$insert into public.coaches (name, email, club_id, coach_type, status)
                   values ('Spy', 'spy@test.local', 'club_vancouver', 'Club', 'Unclaimed')$$,
                 '42501', null, 'a club cannot add coaches to another club');
select throws_ok($$insert into public.students (name, email, age, current_ntrp, club_id, status)
                   values ('Spy', 'spy@test.local', 20, '3.0', 'club_vancouver', 'Unclaimed')$$,
                 '42501', null, 'a club cannot add students to another club');
select is_empty($$update public.clubs set name = 'Hacked' where id = 'club_vancouver' returning id$$,
                'a club cannot rename another club');
select is((select name from public.clubs where id = 'club_vancouver'), 'Vancouver Tennis Club',
          'other clubs are untouched');
reset role;

-- ---------------------------------------------------------------------------
-- Demo student (Olivia, s1)
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims',
    json_build_object('sub', :'student_uid', 'email', 'student@koriq.demo', 'role', 'authenticated')::text, true) \g /dev/null
set local role authenticated;

select is((select count(*) from public.students), 1::bigint, 'student sees only their own record');
select lives_ok($$update public.students set physical_attributes = '{"sleepHours": 8}' where id = 's1'$$,
                'student logs their physical stats');
select throws_ok($$update public.students set total_paid = 99999 where id = 's1'$$,
                 '42501', null, 'student cannot edit their billing');
select throws_ok($$update public.students set current_ntrp = '6.0+' where id = 's1'$$,
                 '42501', null, 'student cannot promote themselves');
select throws_ok($$update public.students set club_id = 'club_richmond' where id = 's1'$$,
                 '42501', null, 'student cannot move clubs');
select ok((select count(*) from public.v_student_progress) > 0
          and (select count(*) from public.v_student_progress where coach_name is null) = 0,
          'student progress view still shows coach names');
select is((select count(*) from public.players), 0::bigint, 'student sees no players');
reset role;

-- ---------------------------------------------------------------------------
-- Demo club coach (Coach Mike, c1 at Vancouver Tennis Club)
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims',
    json_build_object('sub', :'coach_uid', 'email', 'coach@koriq.demo', 'role', 'authenticated')::text, true) \g /dev/null
set local role authenticated;

select is((select count(*) from public.students where club_id = 'club_vancouver'), 11::bigint,
          'club coach sees the club roster');
insert into public.evaluations (id, student_id, coach_id, club_id, ntrp_level, fh_score, performance_scores, created_by)
values ('test-eval', 's3', 'c1', 'club_richmond', '2.0-2.5', 6, '{"Movement": 7}', :'stranger_uid');
select is((select club_id from public.evaluations where id = 'test-eval'), 'club_vancouver',
          'evaluation is filed under the student''s club, not the one the client sent');
select is((select created_by::text from public.evaluations where id = 'test-eval'), :'coach_uid',
          'evaluation records the real author');
select ok((select final_score > 0 from public.evaluations where id = 'test-eval'), 'evaluation is scored by the database');
select throws_ok($$insert into public.evaluations (student_id, coach_id, ntrp_level, performance_scores)
                   values ('s3', 'c1', '2.0-2.5', '{"Movement": 11}')$$,
                 '22023', null, 'performance scores above 10 are rejected');
select throws_ok($$insert into public.evaluations (student_id, coach_id, ntrp_level) values ('s3', 'c2', '2.0-2.5')$$,
                 '42501', null, 'coach cannot file an evaluation as another coach');
select lives_ok($$update public.coaches set bio = 'Coach bio', specialties = '{Serve}', rate = 90 where id = 'c1'$$,
                'coach completes onboarding fields');
select throws_ok($$update public.coaches set status = 'Inactive' where id = 'c1'$$,
                 '42501', null, 'coach cannot change their own status');
reset role;

-- ---------------------------------------------------------------------------
-- Demo club admin (Vancouver Tennis Club)
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims',
    json_build_object('sub', :'club_uid', 'email', 'club@koriq.demo', 'role', 'authenticated')::text, true) \g /dev/null
set local role authenticated;

select is((select count(*) from public.coaches where club_id = 'club_vancouver'), 5::bigint, 'club sees its coaches');
select lives_ok($$insert into public.coaches (name, email, club_id, coach_type, status)
                  values ('New Coach', 'new.coach@test.local', 'club_vancouver', 'Club', 'Unclaimed')$$,
                'club adds an unclaimed coach to its roster');
select throws_ok($$insert into public.coaches (name, email, club_id, coach_type, status)
                   values ('Pre-claimed', 'pre@test.local', 'club_vancouver', 'Club', 'Active')$$,
                 '42501', null, 'club cannot create an already-claimed coach');
select lives_ok($$insert into public.students (name, email, age, current_ntrp, club_id, primary_coach_id, status)
                  values ('New Student', 'new.student@test.local', 12, '2.0-2.5', 'club_vancouver', 'c1', 'Unclaimed')$$,
                'club adds a student with one of its coaches');
select throws_ok(format($$insert into public.students (name, email, age, current_ntrp, club_id, primary_coach_id, status)
                          values ('Odd', 'odd@test.local', 12, '2.0-2.5', 'club_vancouver', %L, 'Unclaimed')$$,
                        :'stranger_coach_id'),
                 '42501', null, 'club cannot assign a coach from outside the club');
select lives_ok($$update public.students set total_paid = 450, payment_count = 3 where id = 's4'$$,
                'club records payments for its student');
select lives_ok($$update public.coaches set status = 'Inactive' where id = 'c5'$$, 'club deactivates one of its coaches');
select ok((select count(*) from public.v_coach_impact where club_id = 'club_vancouver') >= 5,
          'club analytics view still lists its coaches');
reset role;

-- ---------------------------------------------------------------------------
-- Demo player (p1)
-- ---------------------------------------------------------------------------
select set_config('request.jwt.claims',
    json_build_object('sub', :'player_uid', 'email', 'player@koriq.demo', 'role', 'authenticated')::text, true) \g /dev/null
set local role authenticated;

select is((select count(*) from public.players), 1::bigint, 'player sees only their own profile');
select lives_ok($$update public.players set city = 'Burnaby', extras = '{"availability": {}}' where id = 'p1'$$,
                'player edits their onboarding fields');
select throws_ok($$update public.players set email = 'someone@else.test' where id = 'p1'$$,
                 '42501', null, 'player cannot change the email on their profile');
reset role;

-- ---------------------------------------------------------------------------
-- Shared demo accounts cannot be taken over through the Auth API
-- ---------------------------------------------------------------------------
select pg_has_role('supabase_auth_admin', 'member') as can_act_as_auth \gset
\if :can_act_as_auth
select encrypted_password as club_password from auth.users where email = 'club@koriq.demo' \gset
set local role supabase_auth_admin;
update auth.users set email = 'thief@test.local', encrypted_password = 'stolen', last_sign_in_at = now()
 where email = 'club@koriq.demo';
reset role;
select ok(exists (select 1 from auth.users
                  where email = 'club@koriq.demo' and encrypted_password = :'club_password' and last_sign_in_at is not null),
          'demo account keeps its email and password; sign-in bookkeeping still updates');
\else
select skip('cannot switch to supabase_auth_admin in this environment', 1);
\endif

select * from finish();
rollback;
