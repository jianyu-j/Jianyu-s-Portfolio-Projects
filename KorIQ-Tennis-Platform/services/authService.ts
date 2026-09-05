/**
 * Authentication flows for every role, in both data modes:
 *  - Supabase mode: real email/password auth, profiles table, RLS-filtered
 *    hydration of the data cache.
 *  - Offline mode: the original localStorage mock users.
 *
 * All methods resolve to a `User` the app can route on, or throw an Error
 * whose message is safe to show in the UI.
 */
import { Coach, CoachType, NtrpLevel, Student, User, UserRole } from '../types';
import { isSupabaseEnabled } from './supabaseClient';
import { remoteAuth, normaliseIdentifier } from './remoteDataService';
import { storageService } from './storageService';

const ACTIVE_ROLE_KEY = 'korIQ_activeRole';

/** Thrown when a sign-up hits an email that already has an account. */
export class AlreadyRegisteredError extends Error {
    constructor() {
        super('An account with this email already exists.');
        this.name = 'AlreadyRegisteredError';
    }
}

const roleLabel = (role: UserRole) => role.charAt(0) + role.slice(1).toLowerCase();

const toUser = (email: string, role: UserRole, linkedEntityId: string): User => ({
    username: email,
    password: '',
    role,
    linkedEntityId,
});

/** After Supabase auth, resolve the profile for a role and hydrate the cache. */
async function finishRemoteLogin(email: string, role: UserRole): Promise<User> {
    const profiles = await remoteAuth.profiles();
    const profile = profiles.find(p => p.role === role);
    if (!profile) {
        await remoteAuth.signOut();
        if (profiles.length > 0) {
            throw new Error(`❌ This email exists but does not have a ${roleLabel(role)} profile. Please Link Account.`);
        }
        throw new Error(`❌ No ${roleLabel(role)} profile is linked to this account.`);
    }
    await storageService.hydrate();
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
    return toUser(email, role, profile.linked_entity_id);
}

/** Sign up, or if the email is taken, sign in with the given password. */
async function signUpOrSignIn(email: string, password: string): Promise<void> {
    const { alreadyRegistered } = await remoteAuth.signUp(email, password);
    if (alreadyRegistered) {
        try {
            await remoteAuth.signIn(email, password);
        } catch {
            throw new AlreadyRegisteredError();
        }
    }
}

function assertCoachMatches(coach: Coach | undefined, coachType: CoachType | null | undefined, clubId?: string) {
    if (!coach) throw new Error('❌ Coach profile not found for this account.');
    if (coach.status === 'Unclaimed') {
        throw new Error("⚠️ Account not yet claimed. Your club admin has created your profile, but you haven't set up your password yet. [Claim Account Now]");
    }
    if (coachType === 'Club') {
        if (coach.coachType === 'Independent') throw new Error('This account is registered as an Independent Coach.');
        if (clubId && coach.clubId !== clubId) {
            throw new Error('❌ Club mismatch. This account is not registered with the selected club. Please select the correct club or contact your club admin.');
        }
    } else if (coachType === 'Independent') {
        if (coach.coachType === 'Club') throw new Error('This account is registered as a Club Coach.');
    }
}

export interface LoginInput {
    role: UserRole;
    identifier: string; // email (or demo username)
    password: string;
    coachType?: CoachType | null;
    clubId?: string;
}

export const authService = {
    /** Is this the Supabase-backed build? */
    remote: isSupabaseEnabled,

    // -----------------------------------------------------------------------
    // Login / logout / restore
    // -----------------------------------------------------------------------
    async login({ role, identifier, password, coachType, clubId }: LoginInput): Promise<User> {
        if (isSupabaseEnabled) {
            let auth;
            try {
                auth = await remoteAuth.signIn(identifier, password);
            } catch (err) {
                const msg = err instanceof Error ? err.message : '';
                if (/invalid login credentials/i.test(msg)) {
                    throw new Error('❌ Incorrect email or password. Please try again.');
                }
                if (/email not confirmed/i.test(msg)) {
                    throw new Error('⚠️ This account still needs email confirmation. Check your inbox, or ask the admin to disable "Confirm email" in Supabase.');
                }
                throw new Error(`❌ Sign-in failed: ${msg || 'unknown error'}`);
            }
            const user = await finishRemoteLogin(auth.email, role);
            if (role === 'COACH') {
                try {
                    assertCoachMatches(storageService.getCoachById(user.linkedEntityId), coachType, clubId);
                } catch (e) {
                    await remoteAuth.signOut();
                    storageService.clearRemote();
                    throw e;
                }
            }
            return user;
        }

        // --- Offline (mock) ---
        if (role === 'COACH') {
            const coach = storageService.findCoachByEmail(identifier);
            if (!coach) throw new Error('❌ Email not found. No account exists with this email address. Please check your email or sign up for an account.');
            assertCoachMatches(coach, coachType, clubId);
        } else if (!storageService.checkUserRoleExists(identifier, role)) {
            if (storageService.checkUserExists(identifier)) {
                throw new Error(`❌ This email exists but does not have a ${roleLabel(role)} profile. Please Link Account.`);
            }
            throw new Error('❌ Email/Username not found. No account exists with this identifier.');
        }
        const user = storageService.authenticate(identifier, password, role);
        if (!user) throw new Error('❌ Incorrect password. The password you entered is incorrect. Please try again or click "Forgot Password?"');
        return user;
    },

    async logout(): Promise<void> {
        localStorage.removeItem(ACTIVE_ROLE_KEY);
        if (isSupabaseEnabled) {
            await remoteAuth.signOut().catch(() => undefined);
            storageService.clearRemote();
        }
    },

    /** Restore a persisted Supabase session (no-op offline). */
    async restoreSession(): Promise<User | null> {
        if (!isSupabaseEnabled) return null;
        const auth = await remoteAuth.currentUser();
        if (!auth) return null;
        const profiles = await remoteAuth.profiles();
        if (profiles.length === 0) return null;
        const preferred = localStorage.getItem(ACTIVE_ROLE_KEY) as UserRole | null;
        const profile = profiles.find(p => p.role === preferred) ?? profiles[0];
        await storageService.hydrate();
        return toUser(auth.email, profile.role, profile.linked_entity_id);
    },

    // -----------------------------------------------------------------------
    // Pre-signup lookups
    // -----------------------------------------------------------------------
    async lookupCoach(email: string): Promise<Pick<Coach, 'id' | 'name' | 'clubId' | 'coachType' | 'status' | 'joinedDate'> | null> {
        if (isSupabaseEnabled) return remoteAuth.lookupCoachByEmail(email);
        return storageService.findCoachByEmail(email) ?? null;
    },

    async lookupStudent(email: string): Promise<Pick<Student, 'id' | 'name' | 'status'> | null> {
        if (isSupabaseEnabled) return remoteAuth.lookupStudentByEmail(email);
        return storageService.findStudentByEmail(email) ?? null;
    },

    /** Offline only: does any account exist for this identifier? (Supabase hides this by design.) */
    accountExists(identifier: string): boolean | null {
        if (isSupabaseEnabled) return null;
        return storageService.checkUserExists(identifier);
    },

    hasRole(identifier: string, role: UserRole): boolean | null {
        if (isSupabaseEnabled) return null;
        return storageService.checkUserRoleExists(identifier, role);
    },

    // -----------------------------------------------------------------------
    // Sign-up flows
    // -----------------------------------------------------------------------
    async signupPlayer(input: { name: string; email: string; city: string; ntrp: NtrpLevel; password: string; link?: boolean }): Promise<User> {
        const email = input.email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            if (input.link) {
                try { await remoteAuth.signIn(email, input.password); }
                catch { throw new Error('Incorrect password.'); }
            } else {
                const { alreadyRegistered } = await remoteAuth.signUp(email, input.password);
                if (alreadyRegistered) throw new AlreadyRegisteredError();
            }
            await remoteAuth.registerProfile('PLAYER', { name: input.name, city: input.city, current_ntrp: input.ntrp });
            return finishRemoteLogin(email, 'PLAYER');
        }

        const id = Date.now().toString();
        if (input.link && !storageService.authenticate(email, input.password)) throw new Error('Incorrect password.');
        storageService.addPlayer({ id, name: input.name, email, city: input.city, currentNtrp: input.ntrp, joinedDate: new Date().toISOString() });
        if (!storageService.registerUser({ username: email, password: input.password, role: 'PLAYER', linkedEntityId: id })) {
            throw new Error('Error creating user.');
        }
        return storageService.authenticate(email, input.password, 'PLAYER')!;
    },

    async signupIndependentCoach(input: { name: string; email: string; phone: string; password: string }): Promise<User> {
        const email = input.email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            await signUpOrSignIn(email, input.password);
            await remoteAuth.registerProfile('COACH', { name: input.name, phone: input.phone || null });
            return finishRemoteLogin(email, 'COACH');
        }

        const id = Date.now().toString();
        storageService.addCoach({ id, name: input.name, email, phone: input.phone, coachType: 'Independent', status: 'Active', joinedDate: new Date().toISOString() });
        if (!storageService.registerUser({ username: email, password: input.password, role: 'COACH', linkedEntityId: id })) {
            throw new Error('An account with this email already exists. Please log in.');
        }
        return storageService.authenticate(email, input.password, 'COACH')!;
    },

    async claimCoach(coach: { id: string; email?: string }, email: string, password: string): Promise<User> {
        const addr = email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            await signUpOrSignIn(addr, password);
            await remoteAuth.claimCoachProfile(coach.id);
            return finishRemoteLogin(addr, 'COACH');
        }

        if (!storageService.claimCoachProfile(coach.id)) throw new Error('Error claiming profile.');
        if (!storageService.registerUser({ username: addr, password, role: 'COACH', linkedEntityId: coach.id })) {
            throw new Error('Error registering user.');
        }
        return storageService.authenticate(addr, password, 'COACH')!;
    },

    async signupClub(input: { name: string; email: string; password: string }): Promise<User> {
        const email = input.email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            await signUpOrSignIn(email, input.password);
            await remoteAuth.registerProfile('CLUB', { name: input.name });
            return finishRemoteLogin(email, 'CLUB');
        }

        const id = Date.now().toString();
        storageService.addClub({ id, name: input.name });
        if (!storageService.registerUser({ username: email, password: input.password, role: 'CLUB', linkedEntityId: id })) {
            throw new Error('Email already exists');
        }
        return storageService.authenticate(email, input.password, 'CLUB')!;
    },

    async signupStudent(input: { name: string; email: string; age: number; password: string }): Promise<User> {
        const email = input.email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            await signUpOrSignIn(email, input.password);
            await remoteAuth.registerProfile('STUDENT', { name: input.name, age: input.age });
            return finishRemoteLogin(email, 'STUDENT');
        }

        const id = Date.now().toString();
        storageService.addStudent({ id, name: input.name, email, age: input.age, currentNtrp: NtrpLevel.L10_15, status: 'Claimed' });
        if (!storageService.registerUser({ username: email, password: input.password, role: 'STUDENT', linkedEntityId: id })) {
            throw new Error('Username already exists');
        }
        return storageService.authenticate(email, input.password, 'STUDENT')!;
    },

    async claimStudent(student: { id: string }, email: string, password: string): Promise<User> {
        const addr = email.trim().toLowerCase();
        if (isSupabaseEnabled) {
            await signUpOrSignIn(addr, password);
            await remoteAuth.claimStudentProfile(student.id);
            return finishRemoteLogin(addr, 'STUDENT');
        }

        if (!storageService.claimStudentProfile(student.id)) throw new Error('Error claiming profile.');
        if (!storageService.registerUser({ username: addr, password, role: 'STUDENT', linkedEntityId: student.id })) {
            throw new Error('Error registering user.');
        }
        return storageService.authenticate(addr, password, 'STUDENT')!;
    },

    /** For display: what a bare demo username resolves to. */
    normaliseIdentifier,
};
