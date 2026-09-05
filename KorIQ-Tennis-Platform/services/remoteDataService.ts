/**
 * Supabase-backed data access for the evaluation slice:
 * auth profiles, clubs, coaches, students, players and evaluations.
 *
 * Everything here maps between snake_case Postgres rows and the camelCase
 * domain types the UI already uses, so components never see the difference
 * between the localStorage mock database and the real one.
 */
import { Club, Coach, NtrpLevel, Player, Session, Student, UserRole } from '../types';
import { requireSupabase } from './supabaseClient';

// ---------------------------------------------------------------------------
// Row types (subset of the schema in supabase/migrations)
// ---------------------------------------------------------------------------
interface ClubRow { id: string; name: string; location: string | null; website_url: string | null }
interface CoachRow {
    id: string; name: string; email: string; phone: string | null; club_id: string | null;
    coach_type: Coach['coachType']; status: Coach['status']; joined_date: string;
    rate: number | null; specialties: string[] | null; bio: string | null; rating: number | null; review_count: number | null;
}
interface StudentRow {
    id: string; name: string; email: string; age: number; current_ntrp: NtrpLevel; starting_ntrp: NtrpLevel | null;
    club_id: string | null; primary_coach_id: string | null; status: Student['status']; joined_date: string;
    created_from: Student['createdFrom'] | null; physical_attributes: Student['physicalAttributes'] | null;
    total_paid: number | null; last_payment_date: string | null; payment_count: number | null;
}
interface PlayerRow {
    id: string; name: string; email: string; city: string; current_ntrp: NtrpLevel; joined_date: string;
    extras: Record<string, unknown>;
}
interface EvaluationRow {
    id: string; student_id: string; coach_id: string; club_id: string | null; evaluated_at: string;
    ntrp_level: NtrpLevel; class_type: Session['classType']; session_type: Session['sessionType']; duration_minutes: number;
    fh_score: number; bh_score: number; serve_score: number; volley_score: number;
    performance_scores: Record<string, number>; fundamentals_avg: number; performance_avg: number;
    final_score: number; notes: string;
}
export interface ProfileRow {
    user_id: string; role: UserRole; linked_entity_id: string; email: string;
    onboarding_completed_at: string | null; onboarding_skipped: boolean;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------
const num = (v: unknown): number => (v === null || v === undefined ? 0 : Number(v));
const orUndef = <T,>(v: T | null): T | undefined => (v === null ? undefined : v);

const toClub = (r: ClubRow): Club => ({
    id: r.id, name: r.name, location: orUndef(r.location), websiteUrl: orUndef(r.website_url),
});

const toCoach = (r: CoachRow): Coach => ({
    id: r.id, name: r.name, email: r.email, phone: orUndef(r.phone), clubId: orUndef(r.club_id),
    coachType: r.coach_type, status: r.status, joinedDate: r.joined_date,
    rate: orUndef(r.rate) as number | undefined, specialties: orUndef(r.specialties), bio: orUndef(r.bio),
    rating: r.rating === null ? undefined : Number(r.rating), reviewCount: orUndef(r.review_count),
});

const toStudent = (r: StudentRow): Student => ({
    id: r.id, name: r.name, email: r.email, age: r.age, currentNtrp: r.current_ntrp,
    startingNtrp: orUndef(r.starting_ntrp), physicalAttributes: orUndef(r.physical_attributes),
    clubId: orUndef(r.club_id), primaryCoachId: orUndef(r.primary_coach_id), status: r.status,
    joinedDate: r.joined_date, createdFrom: orUndef(r.created_from),
    totalPaid: r.total_paid === null ? undefined : Number(r.total_paid),
    lastPaymentDate: orUndef(r.last_payment_date), paymentCount: orUndef(r.payment_count),
});

const toPlayer = (r: PlayerRow): Player => ({
    ...(r.extras as Partial<Player>),
    id: r.id, name: r.name, email: r.email, city: r.city, currentNtrp: r.current_ntrp, joinedDate: r.joined_date,
});

const toSession = (r: EvaluationRow, coachName?: string): Session => ({
    id: r.id, studentId: r.student_id, coachId: r.coach_id, coachName, clubId: orUndef(r.club_id),
    date: r.evaluated_at, ntrpLevel: r.ntrp_level, classType: r.class_type, sessionType: r.session_type,
    durationMinutes: r.duration_minutes,
    fundamentals: {
        fhScore: num(r.fh_score), bhScore: num(r.bh_score), serveScore: num(r.serve_score),
        volleyScore: num(r.volley_score), average: num(r.fundamentals_avg),
    },
    performance: { scores: r.performance_scores ?? {}, average: num(r.performance_avg) },
    finalScore: num(r.final_score), notes: r.notes ?? '',
});

/** Drop undefined keys so partial updates don't null out columns. */
const compact = <T extends Record<string, unknown>>(o: T): Partial<T> =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

const studentToRow = (s: Partial<Student>) => compact({
    id: s.id, name: s.name, email: s.email, age: s.age, current_ntrp: s.currentNtrp, starting_ntrp: s.startingNtrp,
    club_id: s.clubId, primary_coach_id: s.primaryCoachId, status: s.status, joined_date: s.joinedDate?.slice(0, 10),
    created_from: s.createdFrom, physical_attributes: s.physicalAttributes, total_paid: s.totalPaid,
    last_payment_date: s.lastPaymentDate?.slice(0, 10), payment_count: s.paymentCount,
});

const coachToRow = (c: Partial<Coach>) => compact({
    id: c.id, name: c.name, email: c.email, phone: c.phone, club_id: c.clubId, coach_type: c.coachType,
    status: c.status, joined_date: c.joinedDate?.slice(0, 10), rate: c.rate, specialties: c.specialties,
    bio: c.bio, rating: c.rating, review_count: c.reviewCount,
});

const clubToRow = (c: Partial<Club>) => compact({ id: c.id, name: c.name, location: c.location, website_url: c.websiteUrl });

const playerToRow = (p: Partial<Player>) => {
    const { id, name, email, city, currentNtrp, joinedDate, ...extras } = p;
    return compact({
        id, name, email, city, current_ntrp: currentNtrp, joined_date: joinedDate?.slice(0, 10),
        extras: Object.keys(extras).length ? extras : undefined,
    });
};

const fail = (ctx: string, error: { message: string } | null) => {
    if (error) throw new Error(`${ctx}: ${error.message}`);
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
const DEMO_DOMAIN = 'koriq.demo';

/** Bare demo usernames (e.g. "coach") map to coach@koriq.demo. */
export const normaliseIdentifier = (identifier: string): string => {
    const id = identifier.trim().toLowerCase();
    return id.includes('@') ? id : `${id}@${DEMO_DOMAIN}`;
};

export interface AuthUser { id: string; email: string }

export const remoteAuth = {
    async signIn(identifier: string, password: string): Promise<AuthUser> {
        const sb = requireSupabase();
        const { data, error } = await sb.auth.signInWithPassword({ email: normaliseIdentifier(identifier), password });
        if (error) throw new Error(error.message);
        return { id: data.user.id, email: data.user.email ?? '' };
    },

    /**
     * Returns the new user, or `{ alreadyRegistered: true }` if the email is
     * taken (Supabase hides that behind an empty identities array when email
     * confirmation is on, and an explicit error when it is off).
     */
    async signUp(email: string, password: string): Promise<{ user: AuthUser | null; alreadyRegistered: boolean }> {
        const sb = requireSupabase();
        const { data, error } = await sb.auth.signUp({ email: email.trim().toLowerCase(), password });
        if (error) {
            if (/already|registered|exists/i.test(error.message)) return { user: null, alreadyRegistered: true };
            throw new Error(error.message);
        }
        if (!data.user || (data.user.identities && data.user.identities.length === 0)) {
            return { user: null, alreadyRegistered: true };
        }
        if (!data.session) {
            throw new Error('Account created but email confirmation is required. Disable "Confirm email" in Supabase Auth settings for the demo.');
        }
        return { user: { id: data.user.id, email: data.user.email ?? '' }, alreadyRegistered: false };
    },

    async signOut(): Promise<void> {
        const sb = requireSupabase();
        await sb.auth.signOut();
    },

    async currentUser(): Promise<AuthUser | null> {
        const sb = requireSupabase();
        const { data } = await sb.auth.getSession();
        const u = data.session?.user;
        return u ? { id: u.id, email: u.email ?? '' } : null;
    },

    async profiles(): Promise<ProfileRow[]> {
        const sb = requireSupabase();
        const { data, error } = await sb.from('profiles').select('*');
        fail('Loading profiles', error);
        return (data ?? []) as ProfileRow[];
    },

    async registerProfile(role: UserRole, payload: Record<string, unknown>): Promise<string> {
        const sb = requireSupabase();
        const { data, error } = await sb.rpc('register_profile', { p_role: role, p_payload: payload });
        fail('Creating profile', error);
        return data as string;
    },

    async claimCoachProfile(coachId: string): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.rpc('claim_coach_profile', { p_coach_id: coachId });
        fail('Claiming coach profile', error);
    },

    async claimStudentProfile(studentId: string): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.rpc('claim_student_profile', { p_student_id: studentId });
        fail('Claiming student profile', error);
    },

    async lookupCoachByEmail(email: string): Promise<Pick<Coach, 'id' | 'name' | 'clubId' | 'coachType' | 'status' | 'joinedDate'> | null> {
        const sb = requireSupabase();
        const { data, error } = await sb.rpc('lookup_coach_by_email', { p_email: email });
        fail('Looking up coach', error);
        const r = (data as Array<{ id: string; name: string; club_id: string | null; coach_type: Coach['coachType']; status: Coach['status']; joined_date: string }>)?.[0];
        return r ? { id: r.id, name: r.name, clubId: orUndef(r.club_id), coachType: r.coach_type, status: r.status, joinedDate: r.joined_date } : null;
    },

    async lookupStudentByEmail(email: string): Promise<Pick<Student, 'id' | 'name' | 'status'> | null> {
        const sb = requireSupabase();
        const { data, error } = await sb.rpc('lookup_student_by_email', { p_email: email });
        fail('Looking up student', error);
        const r = (data as Array<{ id: string; name: string; status: Student['status'] }>)?.[0];
        return r ?? null;
    },

    async completeOnboarding(role: UserRole, skipped = false): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.rpc('complete_onboarding', { p_role: role, p_skipped: skipped });
        fail('Completing onboarding', error);
    },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
export interface RemoteSnapshot {
    clubs: Club[];
    coaches: Coach[];
    students: Student[];
    players: Player[];
    sessions: Session[];
}

export const remoteData = {
    /** Public data readable before login (clubs only). */
    async fetchPublic(): Promise<Pick<RemoteSnapshot, 'clubs'>> {
        const sb = requireSupabase();
        const { data, error } = await sb.from('clubs').select('*').order('name');
        fail('Loading clubs', error);
        return { clubs: ((data ?? []) as ClubRow[]).map(toClub) };
    },

    /** Everything the signed-in user is allowed to see (RLS decides). */
    async fetchAll(): Promise<RemoteSnapshot> {
        const sb = requireSupabase();
        const [clubs, coaches, students, players, evaluations] = await Promise.all([
            sb.from('clubs').select('*').order('name'),
            sb.from('coaches').select('*').order('name'),
            sb.from('students').select('*').order('name'),
            sb.from('players').select('*').order('name'),
            sb.from('evaluations').select('*').order('evaluated_at'),
        ]);
        fail('Loading clubs', clubs.error);
        fail('Loading coaches', coaches.error);
        fail('Loading students', students.error);
        fail('Loading players', players.error);
        fail('Loading evaluations', evaluations.error);

        const coachList = ((coaches.data ?? []) as CoachRow[]).map(toCoach);
        const coachName = new Map(coachList.map((c) => [c.id, c.name]));
        return {
            clubs: ((clubs.data ?? []) as ClubRow[]).map(toClub),
            coaches: coachList,
            students: ((students.data ?? []) as StudentRow[]).map(toStudent),
            players: ((players.data ?? []) as PlayerRow[]).map(toPlayer),
            sessions: ((evaluations.data ?? []) as EvaluationRow[]).map((r) => toSession(r, coachName.get(r.coach_id))),
        };
    },

    /** Insert an evaluation; the database computes averages and final score. */
    async insertEvaluation(s: Session): Promise<Session> {
        const sb = requireSupabase();
        const { data, error } = await sb
            .from('evaluations')
            .insert({
                id: s.id,
                student_id: s.studentId,
                coach_id: s.coachId,
                club_id: s.clubId ?? null,
                evaluated_at: s.date,
                ntrp_level: s.ntrpLevel,
                class_type: s.classType,
                session_type: s.sessionType,
                duration_minutes: s.durationMinutes,
                fh_score: s.fundamentals.fhScore,
                bh_score: s.fundamentals.bhScore,
                serve_score: s.fundamentals.serveScore,
                volley_score: s.fundamentals.volleyScore,
                performance_scores: s.performance.scores,
                notes: s.notes,
            })
            .select('*')
            .single();
        fail('Saving evaluation', error);
        return toSession(data as EvaluationRow, s.coachName);
    },

    async insertStudent(s: Student): Promise<Student> {
        const sb = requireSupabase();
        const { data, error } = await sb.from('students').insert(studentToRow(s)).select('*').single();
        fail('Saving student', error);
        return toStudent(data as StudentRow);
    },

    async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.from('students').update(studentToRow(updates)).eq('id', id);
        fail('Updating student', error);
    },

    async insertCoach(c: Coach): Promise<Coach> {
        const sb = requireSupabase();
        const { data, error } = await sb.from('coaches').insert(coachToRow(c)).select('*').single();
        fail('Saving coach', error);
        return toCoach(data as CoachRow);
    },

    async updateCoach(id: string, updates: Partial<Coach>): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.from('coaches').update(coachToRow(updates)).eq('id', id);
        fail('Updating coach', error);
    },

    async updateClub(id: string, updates: Partial<Club>): Promise<void> {
        const sb = requireSupabase();
        const { error } = await sb.from('clubs').update(clubToRow(updates)).eq('id', id);
        fail('Updating club', error);
    },

    async updatePlayer(id: string, updates: Partial<Player>, current?: Player): Promise<void> {
        const sb = requireSupabase();
        // extras is a whole-column jsonb; merge with the current profile so we don't drop fields
        const merged = current ? { ...current, ...updates } : updates;
        const { error } = await sb.from('players').update(playerToRow(merged)).eq('id', id);
        fail('Updating player', error);
    },

    // --- Analytics views -----------------------------------------------------
    async coachImpact(clubId?: string) {
        const sb = requireSupabase();
        let q = sb.from('v_coach_impact').select('*').order('evaluation_count', { ascending: false });
        if (clubId) q = q.eq('club_id', clubId);
        const { data, error } = await q;
        fail('Loading coach impact', error);
        return (data ?? []) as Array<{
            coach_id: string; coach_name: string; club_id: string | null; coach_type: string;
            evaluation_count: number; students_evaluated: number; avg_score: number | null;
            last_evaluation_at: string | null; avg_student_improvement: number | null;
            students_improved: number; students_with_repeat_evals: number;
        }>;
    },

    async clubMonthly(clubId: string) {
        const sb = requireSupabase();
        const { data, error } = await sb.from('v_club_monthly_evaluations').select('*').eq('club_id', clubId).order('month');
        fail('Loading monthly evaluations', error);
        return (data ?? []) as Array<{
            club_id: string; month: string; evaluations: number; students_evaluated: number;
            active_coaches: number; avg_score: number | null; promotion_ready_evaluations: number;
        }>;
    },

    async studentComposite(clubId?: string) {
        const sb = requireSupabase();
        let q = sb.from('v_student_composite').select('*').order('name');
        if (clubId) q = q.eq('club_id', clubId);
        const { data, error } = await q;
        fail('Loading student composite', error);
        return (data ?? []) as Array<{
            student_id: string; name: string; club_id: string | null; primary_coach_id: string | null;
            current_ntrp: NtrpLevel; starting_ntrp: NtrpLevel | null; evaluation_count: number;
            first_evaluated_at: string | null; last_evaluated_at: string | null; first_score: number | null;
            latest_score: number | null; latest_level: NtrpLevel | null; improvement: number | null; avg_last_3: number | null;
            fh_latest: number | null; bh_latest: number | null; serve_latest: number | null; volley_latest: number | null;
            weakest_stroke: string | null; promotion_ready: boolean; levels_gained: number;
        }>;
    },

    async levelBenchmarks() {
        const sb = requireSupabase();
        const { data, error } = await sb.from('v_level_benchmarks').select('*').order('sort_order');
        fail('Loading level benchmarks', error);
        return (data ?? []) as Array<{
            ntrp_level: NtrpLevel; sort_order: number; evaluations: number; students: number;
            avg_final_score: number | null; avg_fh: number | null; avg_bh: number | null;
            avg_serve: number | null; avg_volley: number | null; avg_performance: number | null;
        }>;
    },
};
