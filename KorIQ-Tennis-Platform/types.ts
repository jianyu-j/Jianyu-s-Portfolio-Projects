
export enum StrokeType {
    FH = 'Forehand',
    BH = 'Backhand',
    Serve = 'Serve',
    Volley = 'Volley'
}

export enum NtrpLevel {
    L10_15 = '1.0-1.5',
    L20_25 = '2.0-2.5',
    L30 = '3.0',
    L35 = '3.5',
    L40 = '4.0',
    L45 = '4.5',
    L40_45 = '4.0-4.5',
    L50 = '5.0',
    L55_PLUS = '5.5+',
    L60_PRO = '6.0+'
}

export type UserRole = 'COACH' | 'STUDENT' | 'CLUB' | 'PLAYER';

export interface User {
    username: string; // This will store the Email for Coaches
    password: string; // In a real app, this would be hashed
    role: UserRole;
    linkedEntityId: string; // coachId, studentId, clubId, or playerId
}

export interface PhysicalAttributes {
    sleepHours: number;
    hydrationCups: number;
    nutritionRating: number; // 1-10
    cardioMinutes: number;
    strengthMinutes: number;
}

export interface PhysicalLogEntry extends PhysicalAttributes {
    id: string;
    studentId: string;
    date: string; // ISO String
}

export interface Student {
    id: string;
    name: string;
    email: string;
    age: number;
    currentNtrp: NtrpLevel;
    startingNtrp?: NtrpLevel; // For tracking progress/level-ups
    physicalAttributes?: PhysicalAttributes;
    clubId?: string; // Link to club
    primaryCoachId?: string;
    status: 'Claimed' | 'Unclaimed'; // For profile linking
    joinedDate?: string;
    // CSV Import fields
    createdFrom?: 'Manual' | 'CSV Import' | 'Coach Added';
    totalPaid?: number;
    lastPaymentDate?: string;
    paymentCount?: number;
}

export interface Player {
    id: string;
    name: string;
    email: string;
    city: string;
    currentNtrp: NtrpLevel;
    joinedDate: string;
    physicalAttributes?: PhysicalAttributes;
    // New fields for portal
    bio?: string;
    style?: string;
    availability?: Record<string, string[]>; // Keys: Mon-Sun, Values: ['Morning', 'Afternoon', 'Evening']
    selfAssessment?: { fh: number; bh: number; serve: number; volley: number; };
    connectionSetting?: 'Approval' | 'Auto';
    isOnline?: boolean; // New
    lastActive?: string; // New
}

export interface StrokeEvaluation {
    grip: number;
    setup: number;
    impact: number;
    swing: number;
    recovery: number;
}

export interface FundamentalsInput {
    [StrokeType.FH]?: StrokeEvaluation;
    [StrokeType.BH]?: StrokeEvaluation;
    [StrokeType.Serve]?: StrokeEvaluation;
    [StrokeType.Volley]?: StrokeEvaluation;
}

export type PerformanceInput = Record<string, number>;

export type SessionType = 'CLUB' | 'INDEPENDENT';

export interface Session {
    id: string;
    studentId: string;
    coachId: string;
    coachName?: string; // For display purposes
    clubId?: string; // Optional: Only if logged as a club session
    date: string; // ISO String
    ntrpLevel: NtrpLevel;
    classType: 'Group' | '1-on-1' | '1v2' | '1v4';
    sessionType: SessionType;
    durationMinutes: number;

    // Calculated/Stored Scores
    fundamentals: {
        fhScore: number; // 0-10
        bhScore: number;
        serveScore: number;
        volleyScore: number;
        average: number; // 0-10
    };

    performance: {
        scores: PerformanceInput;
        average: number; // 0-10
    };

    finalScore: number; // 0-100 (weighted)
    notes: string;
}

export type CoachType = 'Club' | 'Independent' | 'Both';

export interface Coach {
    id: string;
    name: string;
    email: string;
    phone?: string;
    clubId?: string; // Optional: Independent coaches might not have one
    coachType: CoachType;
    status: 'Active' | 'Inactive' | 'Unclaimed';
    joinedDate: string;
    // New fields for portal display
    rate?: number;
    specialties?: string[];
    bio?: string;
    rating?: number;
    reviewCount?: number;
    isOnline?: boolean; // New
    lastActive?: string; // New
}

export interface Club {
    id: string;
    name: string;
    location?: string;
    websiteUrl?: string; // New field
}

export interface CoachRating {
    id: string;
    coachId: string;
    studentId: string; // Hidden from coach
    clubId: string;
    sessionId?: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

// Stats Helpers
export interface ClubStats {
    totalStudents: number;
    totalCoaches: number;
    totalSessions: number;
    avgNtrp: string;
    activeStudents: number;
}

// --- NEW FINANCIAL & REPORT TYPES ---

export interface RevenueEntry {
    id: string;
    clubId: string;
    type: 'Group Class' | 'Private Lesson' | 'Camp' | 'Other' | 'CSV Import';
    amount: number;
    date: string;
    coachId?: string; // Optional linking to coach for breakdown
    studentLevel?: string; // Optional Ntrp level
    description?: string;
    // CSV Import fields
    studentId?: string;
    studentEmail?: string;
    importedAt?: string;
    // BI Attribution fields
    source?: 'stripe' | 'square' | 'paypal' | 'csv_import' | 'document_upload';
    matchConfidence?: 'auto' | 'manual' | 'unmatched';
    programId?: string;
    paymentType?: 'lesson' | 'program' | 'camp' | 'tournament' | 'membership' | 'other';
    isRecurring?: boolean;
}

export interface ExpenseEntry {
    id: string;
    clubId: string;
    category: 'Payroll' | 'Rent' | 'Equipment' | 'Marketing' | 'Insurance' | 'Other';
    amount: number;
    date: string;
    description?: string;
}

export interface ClubSessionPeriod {
    id: string;
    clubId: string;
    name: string;
    startDate: string;
    endDate: string;
    enrolledEmails: string[]; // Track emails to calculate retention
}

// --- PLAYER PORTAL TYPES ---

export interface MatchResult {
    id: string;
    date: string;
    opponentName: string;
    tournamentName: string;
    round: string;
    score: string; // e.g. "6-4, 6-2"
    result: 'W' | 'L';
    surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
    type: 'Singles' | 'Doubles';
}

export interface Tournament {
    id: string;
    name: string;
    date: string;
    location: string;
    level: string;
    format: string;
    fee: string;
    status?: 'Upcoming' | 'Registered' | 'Completed';
    registrationUrl?: string; // New field
}

export interface Message {
    id: string;
    senderName: string;
    content: string;
    timestamp: string;
    isMe: boolean;
}

export interface MessageThread {
    id: string;
    participantName: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: boolean;
    messages: Message[];
    isOnline?: boolean; // New
}

export interface Challenge {
    id: string;
    fromUserId: string; // 'Me' or opponent ID
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    date: string;
    time: string;
    location: string;
    matchType: 'Friendly' | 'Ranking' | 'Stakes';
    message?: string;
    status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
    createdAt: string;
}

// --- TUTORIAL SYSTEM TYPES ---

export type TutorialCategory = 'Forehand' | 'Backhand' | 'Serve' | 'Volley' | 'Footwork' | 'Strategy' | 'Other';
export type TutorialSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
export type TutorialType = 'Public' | 'Private';

export interface Tutorial {
    id: string;
    coachId: string;
    coachName: string;
    clubId?: string; // For club ecosystem - tutorials scoped to specific club
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    type: TutorialType;
    price?: number; // Only for Private tutorials, minimum $5
    category: TutorialCategory;
    skillLevel: TutorialSkillLevel;
    duration?: number; // in minutes
    views: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
    // Ecosystem visibility fields
    visibility?: ClubContentVisibility; // Only for club ecosystem content - 'club' or 'both'
    clubName?: string; // For branding when club content is shared to community
}

// --- ECOSYSTEM VISIBILITY TYPES ---

// Content visibility for club ecosystem posting
// 'club' = Only visible within the club ecosystem
// 'both' = Visible in both club and community ecosystems
export type ClubContentVisibility = 'club' | 'both';

// Event audience type for club events
// Determines who can see and register for club events
export type ClubEventAudience = 'coaches' | 'students' | 'both';

// --- POST SYSTEM TYPES ---

export type PostAuthorType = 'player' | 'coach' | 'club' | 'student';

export interface Post {
    id: string;
    clubId?: string; // For club ecosystem - posts scoped to specific club
    authorId: string;
    authorName: string;
    authorType: PostAuthorType;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    likes: number;
    comments: number;
    timestamp: string;
    isLiked: boolean;
    isTutorial?: boolean; // Flag for tutorial posts
    tutorialId?: string; // Link to tutorial if this is a tutorial post
    // Ecosystem visibility fields
    visibility?: ClubContentVisibility; // Only for club ecosystem content - 'club' or 'both'
    clubName?: string; // For branding when club content is shared to community
}

export interface TutorialPurchase {
    id: string;
    tutorialId: string;
    tutorialTitle: string;
    coachId: string;
    coachName: string;
    buyerId: string; // Player or Student ID
    buyerType: 'Player' | 'Student';
    price: number;
    purchasedAt: string;
    watchProgress: number; // 0-100 percentage
    refundEligible: boolean; // True if <24 hours and <30% watched
}

export interface CoachEarnings {
    coachId: string;
    totalEarnings: number;
    pendingPayout: number; // Balance < $20
    lastPayoutDate?: string;
    lastPayoutAmount?: number;
}

// --- BOOKING SYSTEM TYPES ---

export type LessonType = 'Private' | 'Group' | 'Evaluation';
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening';
export type LessonDuration = '30 min' | '1 hour' | '1.5 hours' | '2 hours';
export type BookingStatus = 'Pending' | 'Approved' | 'Declined' | 'Completed' | 'Cancelled';

export interface BookingRequest {
    id: string;
    playerId: string;
    playerName: string;
    playerPhoto?: string;
    playerNtrp: NtrpLevel;
    playerCity?: string;
    coachId: string;
    coachName: string;
    lessonType: LessonType;
    preferredDate: string;
    preferredTime: TimePreference;
    duration: LessonDuration;
    locationPreference?: string;
    message?: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    declineReason?: string;
    suggestedChange?: string;
}

export interface LessonReview {
    id: string;
    bookingId: string;
    playerId: string;
    playerName: string;
    coachId: string;
    rating: number; // 1-5
    comment?: string;
    isVerified: boolean; // Booked through KorIQ
    coachResponse?: string;
    createdAt: string;
}

// --- EVENT SYSTEM TYPES ---

export type EventType = 'Free' | 'Paid';
export type EventCategory = 'Match Up';

export interface CommunityEvent {
    id: string;
    clubId?: string; // For club ecosystem - events scoped to specific club
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    hostId: string;
    hostName: string;
    hostType: 'Player' | 'Coach' | 'Club';
    eventType: EventType;
    category: EventCategory;
    price?: number; // Only for Paid events
    maxAttendees: number;
    currentAttendees: number;
    attendeeIds: string[];
    waitlistIds: string[];
    ageRangeMin?: number;
    ageRangeMax?: number;
    ntrpMin?: NtrpLevel;
    ntrpMax?: NtrpLevel;
    isApproved: boolean; // Paid events need approval
    createdAt: string;
    // Club event audience - determines who can see/register for club events
    clubEventAudience?: ClubEventAudience; // 'coaches' | 'students' | 'both'
    // Ecosystem visibility for club events shared to community
    visibility?: ClubContentVisibility; // 'club' or 'both'
}

// --- NOTIFICATION TYPES ---

export type NotificationType =
    | 'message'
    | 'booking_request'
    | 'booking_approved'
    | 'booking_declined'
    | 'challenge_received'
    | 'event_reminder'
    | 'new_review'
    | 'tutorial_purchased'
    | 'payout_sent';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string; // ID of related entity (booking, message, etc.)
    isRead: boolean;
    createdAt: string;
}

// --- COACH SUBSCRIPTION TYPES ---

export interface CoachSubscription {
    coachId: string;
    plan: 'Free' | 'Gold';
    monthlyPrice: number; // 0 for Free, 3 for Gold
    privateTutorialsUsed: number; // Free: max 3/month
    messagesUsed: number; // Free: max 5 new conversations/month
    subscribedAt?: string;
    renewsAt?: string;
}

// --- PAYMENT INTEGRATION TYPES ---

export type PaymentProcessor = 'stripe' | 'square' | 'paypal';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'syncing';

export interface ProcessorConnection {
    id: string;
    clubId: string;
    processor: PaymentProcessor;
    status: ConnectionStatus;
    accountName?: string;
    accountId?: string; // External account ID from processor
    connectedAt?: string;
    connectedBy?: string;
    lastSyncAt?: string;
    lastError?: string;
    transactionsSynced: number;
    // OAuth tokens would be encrypted on backend - not stored in frontend
}

export interface PaymentMapping {
    id: string;
    clubId: string;
    matchType: 'exact' | 'contains' | 'regex';
    matchValue: string; // The payment description to match
    coachId?: string;
    coachName?: string;
    programType: 'Private Lesson' | 'Group Class' | 'Camp' | 'Other';
    transactionCount: number;
    autoSuggested: boolean;
    confirmedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NormalizedTransaction {
    id: string;
    externalId: string;
    processor: PaymentProcessor;
    clubId: string;
    // Financial
    amount: number; // In cents
    currency: string;
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    // Customer
    customerEmail?: string;
    customerName?: string;
    studentId?: string;
    // Mapping
    rawDescription: string;
    mappedCoachId?: string;
    mappedCoachName?: string;
    mappedProgramType?: string;
    isMapped: boolean;
    // Timestamps
    transactionDate: string;
    syncedAt: string;
}

export interface SyncEvent {
    id: string;
    clubId: string;
    processor: PaymentProcessor;
    eventType: 'payment_received' | 'refund' | 'sync_completed' | 'sync_error' | 'new_unmapped';
    message: string;
    amount?: number;
    timestamp: string;
    metadata?: Record<string, any>;
}

// UnmappedPaymentGroup was removed - no longer needed

// --- AI ASSISTANT TYPES ---

export type ChatMessageRole = 'user' | 'assistant';
export type ChatIntent =
    | 'revenue_query'
    | 'comparison'
    | 'student_query'
    | 'coach_query'
    | 'invoice_generate'
    | 'invoice_status'
    | 'recommendation'
    | 'general_help';

export interface AIChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
    timestamp: string;
    intent?: ChatIntent;
    data?: any; // Structured data for rich displays
    actions?: ChatAction[];
}

export interface ChatAction {
    id: string;
    label: string;
    type: 'view_details' | 'generate_invoice' | 'send_email' | 'download_pdf' | 'navigate';
    payload?: any;
}

export interface CoachInvoice {
    id: string;
    invoiceNumber: string;
    clubId: string;
    coachId: string;
    coachName: string;
    coachEmail: string;
    periodStart: string;
    periodEnd: string;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    platformFee: number; // KorIQ's cut if applicable
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    createdAt: string;
    sentAt?: string;
    paidAt?: string;
    dueDate?: string;
}

export interface InvoiceLineItem {
    description: string;
    programType: string;
    sessionCount: number;
    rate: number;
    amount: number;
}

// =============================================
// BI ANALYTICS TYPES — Programs, Terms, Evaluations
// =============================================

export interface Program {
    id: string;
    clubId: string;
    name: string;                          // e.g., "Adult Intermediate 3.0 Tue"
    targetNtrpLevel: NtrpLevel;
    ageGroup: 'adult' | 'junior';
    ageRange?: { min: number; max: number }; // For juniors
    dayOfWeek: string;
    timeSlot: string;
    maxCapacity: number;
    courtId?: string;
    isActive: boolean;
    createdAt: string;
}

export interface Term {
    id: string;
    programId: string;
    clubId: string;
    name: string;                          // e.g., "Spring 2026 Session 1"
    startDate: string;
    endDate: string;
    totalWeeks: number;
    leadCoachId: string;
    assistantCoachId?: string;
    enrolledStudentIds: string[];
    waitlistStudentIds: string[];
    status: 'upcoming' | 'active' | 'completed';
    createdAt: string;
}

export interface CoachAssignment {
    id: string;
    coachId: string;
    role: 'lead' | 'assistant';
    termId: string;
    programId: string;
    clubId: string;
}

export interface StrokeAssessment {
    grip: number;       // 1-10
    setup: number;      // 1-10
    impact: number;     // 1-10
    swing: number;      // 1-10
    recovery: number;   // 1-10
    average: number;    // Calculated
}

export interface Evaluation {
    id: string;
    termId?: string;
    programId?: string;
    studentId: string;
    evaluatingCoachId: string;
    assistantCoachId?: string;
    clubId?: string;
    date: string;
    weekNumber?: number;
    ntrpLevel: NtrpLevel;
    classType: 'Group' | '1-on-1' | '1v2' | '1v4';
    sessionType: SessionType;
    durationMinutes: number;

    // null means "not assessed this session"
    fundamentals: {
        forehand: StrokeAssessment | null;
        backhand: StrokeAssessment | null;
        serve: StrokeAssessment | null;
        volley: StrokeAssessment | null;
    };

    performance: {
        scores: Record<string, number>;
        average: number;
    };

    focusArea: string;
    assessedStrokesCount: number;
    sessionScore: number | null;
    notes: string;
    createdAt: string;
}

export interface CompositeProfile {
    studentId: string;
    currentNtrpLevel: NtrpLevel;

    latestForehand: { score: number; date: string; coachId: string } | null;
    latestBackhand: { score: number; date: string; coachId: string } | null;
    latestServe: { score: number; date: string; coachId: string } | null;
    latestVolley: { score: number; date: string; coachId: string } | null;

    fundamentalsAverage: number | null;
    performanceAverage: number | null;
    overallScore: number | null;

    assessmentCount: number;
    lastEvaluatedDate: string | null;
    readyForPromotion: boolean;
}

export interface ExtractedPayment {
    studentName: string;
    email: string;
    amount: number;
    date: string;
    description: string;
}
