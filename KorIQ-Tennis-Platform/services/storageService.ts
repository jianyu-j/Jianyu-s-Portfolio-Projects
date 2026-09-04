import { Student, Session, Coach, NtrpLevel, PhysicalLogEntry, User, UserRole, Club, CoachRating, StrokeType, RevenueEntry, ExpenseEntry, ClubSessionPeriod, Player } from '../types';

// --- IMPORT MOCK DATA FROM SEPARATE FILES ---
// When deployed with a real backend, replace these imports with API calls
import {
    CLUB_ID,
    MOCK_CLUBS,
    MOCK_COACHES,
    MOCK_STUDENTS,
    MOCK_SESSIONS,
    MOCK_USERS,
    MOCK_PLAYERS,
    MOCK_RATINGS,
    MOCK_REVENUE,
    MOCK_EXPENSES,
    MOCK_CLUB_SESSIONS
} from '../data/mockData';

// Onboarding completion tracking
interface OnboardingStatus {
    completed: boolean;
    completedAt?: string;
    skipped?: boolean;
}

type OnboardingRecord = Record<string, OnboardingStatus>; // key: `${role}_${entityId}`

class StorageService {
    private students: Student[] = [];
    private players: Player[] = [];
    private sessions: Session[] = [];
    private users: User[] = [];
    private coaches: Coach[] = [];
    private clubs: Club[] = [];
    private physicalLogs: PhysicalLogEntry[] = [];
    private ratings: CoachRating[] = [];
    private revenue: RevenueEntry[] = [];
    private expenses: ExpenseEntry[] = [];
    private clubSessions: ClubSessionPeriod[] = [];
    private onboardingStatus: OnboardingRecord = {};

    constructor() {
        this.loadData();
    }

    private loadData() {
        const storedStudents = localStorage.getItem('korIQ_students');
        const storedPlayers = localStorage.getItem('korIQ_players');
        const storedSessions = localStorage.getItem('korIQ_sessions');
        const storedUsers = localStorage.getItem('korIQ_users');
        const storedCoaches = localStorage.getItem('korIQ_coaches');
        const storedClubs = localStorage.getItem('korIQ_clubs');
        const storedPhysicalLogs = localStorage.getItem('korIQ_physicalLogs');
        const storedRatings = localStorage.getItem('korIQ_ratings');
        const storedRevenue = localStorage.getItem('korIQ_revenue');
        const storedExpenses = localStorage.getItem('korIQ_expenses');
        const storedClubSessions = localStorage.getItem('korIQ_clubSessions');
        const storedOnboarding = localStorage.getItem('korIQ_onboarding');

        this.students = storedStudents ? JSON.parse(storedStudents) : MOCK_STUDENTS;
        this.players = storedPlayers ? JSON.parse(storedPlayers) : MOCK_PLAYERS;
        this.sessions = storedSessions ? JSON.parse(storedSessions) : MOCK_SESSIONS;
        this.users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
        this.coaches = storedCoaches ? JSON.parse(storedCoaches) : MOCK_COACHES;
        this.clubs = storedClubs ? JSON.parse(storedClubs) : MOCK_CLUBS;
        this.physicalLogs = storedPhysicalLogs ? JSON.parse(storedPhysicalLogs) : [];
        this.ratings = storedRatings ? JSON.parse(storedRatings) : MOCK_RATINGS;
        this.revenue = storedRevenue ? JSON.parse(storedRevenue) : MOCK_REVENUE;
        this.expenses = storedExpenses ? JSON.parse(storedExpenses) : MOCK_EXPENSES;
        this.clubSessions = storedClubSessions ? JSON.parse(storedClubSessions) : MOCK_CLUB_SESSIONS;
        this.onboardingStatus = storedOnboarding ? JSON.parse(storedOnboarding) : {};

        // Save defaults if empty
        if (!storedStudents) this.saveStudents();
        if (!storedPlayers) this.savePlayers();
        if (!storedSessions) this.saveSessions();
        if (!storedUsers) this.saveUsers();
        if (!storedCoaches) this.saveCoaches();
        if (!storedClubs) this.saveClubs();
        if (!storedRatings) this.saveRatings();
        if (!storedRevenue) this.saveRevenue();
        if (!storedExpenses) this.saveExpenses();
        if (!storedClubSessions) this.saveClubSessions();
    }

    // --- Students ---
    getStudents(): Student[] {
        return this.students;
    }

    findStudentByEmail(email: string): Student | undefined {
        return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    }

    addStudent(student: Student) {
        this.students.push(student);
        this.saveStudents();
    }

    claimStudentProfile(studentId: string): boolean {
        const studentIndex = this.students.findIndex(s => s.id === studentId);
        if (studentIndex >= 0) {
            this.students[studentIndex].status = 'Claimed';
            this.saveStudents();
            return true;
        }
        return false;
    }

    private saveStudents() {
        localStorage.setItem('korIQ_students', JSON.stringify(this.students));
    }

    // --- Players ---
    getPlayers(): Player[] {
        return this.players;
    }

    findPlayerByEmail(email: string): Player | undefined {
        return this.players.find(p => p.email.toLowerCase() === email.toLowerCase());
    }

    addPlayer(player: Player) {
        this.players.push(player);
        this.savePlayers();
    }

    private savePlayers() {
        localStorage.setItem('korIQ_players', JSON.stringify(this.players));
    }

    // --- Sessions ---
    getSessions(studentId?: string): Session[] {
        if (studentId) {
            return this.sessions.filter(s => s.studentId === studentId);
        }
        return this.sessions;
    }

    addSession(session: Session) {
        this.sessions.push(session);
        this.saveSessions();
    }

    private saveSessions() {
        localStorage.setItem('korIQ_sessions', JSON.stringify(this.sessions));
    }

    // --- Physical Logs ---
    getPhysicalLogs(studentId: string): PhysicalLogEntry[] {
        return this.physicalLogs.filter(l => l.studentId === studentId);
    }

    addPhysicalLog(log: PhysicalLogEntry) {
        this.physicalLogs.push(log);
        this.savePhysicalLogs();
        
        // Update student current attributes
        const studentIndex = this.students.findIndex(s => s.id === log.studentId);
        if (studentIndex >= 0) {
            this.students[studentIndex].physicalAttributes = {
                sleepHours: log.sleepHours,
                hydrationCups: log.hydrationCups,
                nutritionRating: log.nutritionRating,
                cardioMinutes: log.cardioMinutes,
                strengthMinutes: log.strengthMinutes
            };
            this.saveStudents();
        }
    }

    private savePhysicalLogs() {
        localStorage.setItem('korIQ_physicalLogs', JSON.stringify(this.physicalLogs));
    }

    // --- Auth ---
    authenticate(username: string, password: string, role?: UserRole): User | null {
        // Simple auth for prototype
        return this.users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() && 
            u.password === password &&
            (!role || u.role === role)
        ) || null;
    }

    checkUserExists(username: string): boolean {
        return this.users.some(u => u.username.toLowerCase() === username.toLowerCase());
    }
    
    // Check if a specific role exists for this username (for linking)
    checkUserRoleExists(username: string, role: UserRole): boolean {
        return this.users.some(u => u.username.toLowerCase() === username.toLowerCase() && u.role === role);
    }

    registerUser(user: User): boolean {
        // Allow same username if role is different
        if (this.users.find(u => u.username.toLowerCase() === user.username.toLowerCase() && u.role === user.role)) {
            return false;
        }
        this.users.push(user);
        this.saveUsers();
        return true;
    }

    private saveUsers() {
        localStorage.setItem('korIQ_users', JSON.stringify(this.users));
    }

    // --- Coaches & Clubs ---
    getCoaches(): Coach[] {
        return this.coaches;
    }

    findCoachByEmail(email: string): Coach | undefined {
        return this.coaches.find(c => c.email.toLowerCase() === email.toLowerCase());
    }

    addCoach(coach: Coach) {
        this.coaches.push(coach);
        this.saveCoaches();
    }

    claimCoachProfile(coachId: string): boolean {
        const index = this.coaches.findIndex(c => c.id === coachId);
        if (index >= 0) {
            this.coaches[index].status = 'Active';
            this.saveCoaches();
            return true;
        }
        return false;
    }

    private saveCoaches() {
        localStorage.setItem('korIQ_coaches', JSON.stringify(this.coaches));
    }

    getClubs(): Club[] {
        return this.clubs;
    }

    addClub(club: Club) {
        this.clubs.push(club);
        this.saveClubs();
    }

    private saveClubs() {
        localStorage.setItem('korIQ_clubs', JSON.stringify(this.clubs));
    }

    // --- Ratings ---
    getRatings(coachId: string): CoachRating[] {
        return this.ratings.filter(r => r.coachId === coachId);
    }

    getStudentRatings(studentId: string): CoachRating[] {
        return this.ratings.filter(r => r.studentId === studentId);
    }

    addRating(rating: CoachRating) {
        this.ratings.push(rating);
        this.saveRatings();
    }

    private saveRatings() {
        localStorage.setItem('korIQ_ratings', JSON.stringify(this.ratings));
    }

    // --- Revenue & Expenses ---
    getRevenue(clubId: string): RevenueEntry[] {
        return this.revenue.filter(r => r.clubId === clubId);
    }

    addRevenue(entry: RevenueEntry) {
        this.revenue.push(entry);
        this.saveRevenue();
    }

    private saveRevenue() {
        localStorage.setItem('korIQ_revenue', JSON.stringify(this.revenue));
    }

    getExpenses(clubId: string): ExpenseEntry[] {
        return this.expenses.filter(e => e.clubId === clubId);
    }

    addExpense(entry: ExpenseEntry) {
        this.expenses.push(entry);
        this.saveExpenses();
    }

    private saveExpenses() {
        localStorage.setItem('korIQ_expenses', JSON.stringify(this.expenses));
    }

    // --- Club Sessions (Retention) ---
    getClubSessions(clubId: string): ClubSessionPeriod[] {
        return this.clubSessions.filter(cs => cs.clubId === clubId);
    }

    addClubSession(session: ClubSessionPeriod) {
        this.clubSessions.push(session);
        this.saveClubSessions();
    }

    private saveClubSessions() {
        localStorage.setItem('korIQ_clubSessions', JSON.stringify(this.clubSessions));
    }

    // --- Onboarding ---
    getOnboardingKey(role: string, entityId: string): string {
        return `${role}_${entityId}`;
    }

    isOnboardingComplete(role: string, entityId: string): boolean {
        const key = this.getOnboardingKey(role, entityId);
        return this.onboardingStatus[key]?.completed || false;
    }

    completeOnboarding(role: string, entityId: string) {
        const key = this.getOnboardingKey(role, entityId);
        this.onboardingStatus[key] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveOnboarding();
    }

    skipOnboarding(role: string, entityId: string) {
        const key = this.getOnboardingKey(role, entityId);
        this.onboardingStatus[key] = {
            completed: true,
            skipped: true,
            completedAt: new Date().toISOString()
        };
        this.saveOnboarding();
    }

    private saveOnboarding() {
        localStorage.setItem('korIQ_onboarding', JSON.stringify(this.onboardingStatus));
    }

    // --- Update Methods for Onboarding ---
    updatePlayer(playerId: string, updates: Partial<Player>) {
        const index = this.players.findIndex(p => p.id === playerId);
        if (index >= 0) {
            this.players[index] = { ...this.players[index], ...updates };
            this.savePlayers();
            return true;
        }
        return false;
    }

    updateCoach(coachId: string, updates: Partial<Coach>) {
        const index = this.coaches.findIndex(c => c.id === coachId);
        if (index >= 0) {
            this.coaches[index] = { ...this.coaches[index], ...updates };
            this.saveCoaches();
            return true;
        }
        return false;
    }

    updateClub(clubId: string, updates: Partial<Club>) {
        const index = this.clubs.findIndex(c => c.id === clubId);
        if (index >= 0) {
            this.clubs[index] = { ...this.clubs[index], ...updates };
            this.saveClubs();
            return true;
        }
        return false;
    }

    updateStudent(studentId: string, updates: Partial<Student>) {
        const index = this.students.findIndex(s => s.id === studentId);
        if (index >= 0) {
            this.students[index] = { ...this.students[index], ...updates };
            this.saveStudents();
            return true;
        }
        return false;
    }

    getPlayerById(playerId: string): Player | undefined {
        return this.players.find(p => p.id === playerId);
    }

    getCoachById(coachId: string): Coach | undefined {
        return this.coaches.find(c => c.id === coachId);
    }

    getClubById(clubId: string): Club | undefined {
        return this.clubs.find(c => c.id === clubId);
    }

    getStudentById(studentId: string): Student | undefined {
        return this.students.find(s => s.id === studentId);
    }

    getCoachesByClubId(clubId: string): Coach[] {
        return this.coaches.filter(c => c.clubId === clubId);
    }
}

export const storageService = new StorageService();