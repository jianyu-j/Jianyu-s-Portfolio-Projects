import { NtrpLevel, StrokeEvaluation, FundamentalsInput, StrokeType, PhysicalAttributes, Session, Student } from '../types';

// Part 3: Performance Criteria by NTRP Level (Exact Match)
export const PERFORMANCE_CRITERIA: Record<string, string[]> = {
    [NtrpLevel.L10_15]: ['Ball Contact', 'Racket Control', 'Ball in Play', 'Stroke Attempts', 'Serve Attempt'],
    [NtrpLevel.L20_25]: ['Ball Judgment', 'Rally Ability', 'Movement', 'Recovery', 'Stroke Development', 'Court Positions'],
    [NtrpLevel.L30]: ['Consistency', 'Stroke Comfort', 'Directional Control', 'Depth Control', 'Pace Control', 'Doubles Formation'],
    [NtrpLevel.L35]: ['Stroke Dependability', 'Depth', 'Variety', 'Lobs/Overheads', 'Approach Shots', 'Volleys', 'Net Comfort'],
    [NtrpLevel.L40]: ['Directional Control', 'Depth Control', 'Lobs', 'Overheads', 'Approach Shots', 'Volleys', 'Serve Pressure'],
    [NtrpLevel.L45]: ['Pace Variation', 'Spin Variation', 'Court Coverage', 'Game Planning', 'First Serve', 'Second Serve'],
    [NtrpLevel.L40_45]: ['Directional Control', 'Depth Control', 'Court Coverage', 'Game Planning', 'Serve Pressure'],
    [NtrpLevel.L50]: ['Shot Anticipation', 'Winners', 'Volleys', 'Lobs', 'Drop Shots', 'Half Volleys', 'Overheads'],
    [NtrpLevel.L55_PLUS]: ['Shot Anticipation', 'Winners', 'Volleys', 'Lobs', 'Drop Shots', 'Half Volleys', 'Overheads'], // Using 5.0+ set
    [NtrpLevel.L60_PRO]: ['Shot Anticipation', 'Winners', 'Volleys', 'Lobs', 'Drop Shots', 'Half Volleys', 'Overheads']
};

// Part 2: Fundamental Criteria Descriptions
export const FUNDAMENTAL_CRITERIA_DESCRIPTIONS: Record<StrokeType, Record<string, string>> = {
    [StrokeType.FH]: {
        grip: "Eastern forehand",
        setup: "Neutral stance, racket at shoulder, body sideways",
        impact: "Waist level, out in front at comfortable distance",
        swing: "Racket extends toward target, wrist laid back",
        recovery: "Balanced position before next bounce"
    },
    [StrokeType.BH]: {
        grip: "Eastern backhand OR Continental low + Eastern FH top",
        setup: "Neutral stance, racket at shoulder, body sideways",
        impact: "Waist level, out in front",
        swing: "Racket extends toward target, wrist laid back",
        recovery: "Balanced position before next bounce"
    },
    [StrokeType.Serve]: {
        grip: "Continental",
        setup: "Sideways stance, coordinated ball toss to trophy",
        impact: "Full extension, contact near 11 o'clock",
        swing: "Throwing action - low-to-high with pronation",
        recovery: "Return to balanced position"
    },
    [StrokeType.Volley]: {
        grip: "Continental",
        setup: "Step-hit-step, racket ready, lay-back wrist",
        impact: "Chest level, slightly out and in front",
        swing: "Catching action - short punch, stable face",
        recovery: "Return to ready position"
    }
};

export const getCriteriaForLevel = (level: NtrpLevel): string[] => {
    if (level === NtrpLevel.L40_45) return PERFORMANCE_CRITERIA[NtrpLevel.L40];
    return PERFORMANCE_CRITERIA[level] || PERFORMANCE_CRITERIA[NtrpLevel.L10_15];
};

export const getNtrpWeights = (level: NtrpLevel): { fund: number; perf: number } => {
    switch (level) {
        case NtrpLevel.L10_15: return { fund: 0.7, perf: 0.3 };
        case NtrpLevel.L20_25: return { fund: 0.5, perf: 0.5 };
        case NtrpLevel.L30: return { fund: 0.3, perf: 0.7 };
        case NtrpLevel.L35: return { fund: 0.2, perf: 0.8 };
        case NtrpLevel.L40:
        case NtrpLevel.L45:
        case NtrpLevel.L40_45: return { fund: 0.1, perf: 0.9 };
        case NtrpLevel.L50:
        case NtrpLevel.L55_PLUS:
        case NtrpLevel.L60_PRO: return { fund: 0.0, perf: 1.0 };
        default: return { fund: 0.5, perf: 0.5 };
    }
};

export const getPhysicalStandards = (age: number): PhysicalAttributes => {
    if (age <= 9) return { sleepHours: 11, hydrationCups: 6, cardioMinutes: 60, strengthMinutes: 0, nutritionRating: 10 };
    if (age <= 13) return { sleepHours: 10, hydrationCups: 8, cardioMinutes: 120, strengthMinutes: 45, nutritionRating: 10 };
    if (age <= 17) return { sleepHours: 9, hydrationCups: 9, cardioMinutes: 175, strengthMinutes: 75, nutritionRating: 10 };
    if (age <= 25) return { sleepHours: 8.5, hydrationCups: 11, cardioMinutes: 225, strengthMinutes: 120, nutritionRating: 10 };
    if (age <= 40) return { sleepHours: 8, hydrationCups: 9, cardioMinutes: 200, strengthMinutes: 90, nutritionRating: 10 };
    return { sleepHours: 7.5, hydrationCups: 9, cardioMinutes: 160, strengthMinutes: 75, nutritionRating: 10 };
};

export const calculateStrokeScore = (evalData?: StrokeEvaluation): number => {
    if (!evalData) return 0;
    const scores = [
        evalData.grip,
        evalData.setup,
        evalData.impact,
        evalData.swing,
        evalData.recovery
    ];
    const sum = scores.reduce((a, b) => a + b, 0);
    return sum / 5;
};

export const calculateFundamentalsAverage = (input: FundamentalsInput): {
    fh: number; bh: number; serve: number; volley: number; average: number
} => {
    const fh = calculateStrokeScore(input[StrokeType.FH]);
    const bh = calculateStrokeScore(input[StrokeType.BH]);
    const serve = calculateStrokeScore(input[StrokeType.Serve]);
    const volley = calculateStrokeScore(input[StrokeType.Volley]);
    const average = (fh + bh + serve + volley) / 4;
    return { fh, bh, serve, volley, average };
};

export const calculateFinalScore = (
    ntrp: NtrpLevel,
    fundAvg: number, // 0-10
    perfAvg: number // 0-10
): number => {
    const weights = getNtrpWeights(ntrp);
    const weightedScore = (fundAvg * weights.fund) + (perfAvg * weights.perf);
    return parseFloat((weightedScore * 10).toFixed(1));
};

export const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });
};

export const identifyWeaknesses = (session: Session) => {
    const weaknesses: { name: string; score: number; type: 'Fundamental' | 'Performance' }[] = [];

    // Check Fundamentals
    if (session.fundamentals.fhScore < 8) weaknesses.push({ name: 'Forehand', score: session.fundamentals.fhScore, type: 'Fundamental' });
    if (session.fundamentals.bhScore < 8) weaknesses.push({ name: 'Backhand', score: session.fundamentals.bhScore, type: 'Fundamental' });
    if (session.fundamentals.serveScore < 8) weaknesses.push({ name: 'Serve', score: session.fundamentals.serveScore, type: 'Fundamental' });
    if (session.fundamentals.volleyScore < 8) weaknesses.push({ name: 'Volley', score: session.fundamentals.volleyScore, type: 'Fundamental' });

    // Check Performance
    Object.entries(session.performance.scores).forEach(([key, score]) => {
        if (score < 8) weaknesses.push({ name: key, score, type: 'Performance' });
    });

    return weaknesses.sort((a, b) => a.score - b.score).slice(0, 3);
};

export const calculateCoachDashboardStats = (students: Student[], sessions: Session[], coachId: string) => {
    const mySessions = sessions.filter(s => s.coachId === coachId);
    const myStudentIds = new Set(mySessions.map(s => s.studentId));
    const totalMinutes = mySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    return {
        totalStudents: myStudentIds.size,
        totalSessions: mySessions.length,
        totalHours: Math.round(totalMinutes / 60),
    };
};

// Part 5: Cross-Mapping Logic
// New Chart = ((Score - 8.0) / 2.0) * 20 --> 0 to 20
// Input Score is 0-10 scale (so 8.0). Output is 0-100 scale (so 20).
export const mapScoreToNextLevel = (score0to10: number): number => {
    if (score0to10 < 8.0) return 0;
    const mapped = ((score0to10 - 8.0) / 2.0) * 20; // Result is 0-20 (scaled to 100)
    return Math.min(Math.max(mapped, 0), 20); // Clamp 0-20
};

// Old Chart = 80 + (Score / 2.0) * 20 --> 80 to 100
// Input Score is 0-10 scale (0 to 2.0).
export const mapScoreToPrevLevel = (score0to10: number): number => {
    const mapped = 80 + (score0to10 / 2.0) * 20;
    return Math.min(Math.max(mapped, 80), 100);
};

// --- NEW HELPERS FOR CLUB ANALYTICS ---

export const ntrpToNumber = (level: NtrpLevel): number => {
    switch (level) {
        case NtrpLevel.L10_15: return 1.5;
        case NtrpLevel.L20_25: return 2.5;
        case NtrpLevel.L30: return 3.0;
        case NtrpLevel.L35: return 3.5;
        case NtrpLevel.L40: return 4.0;
        case NtrpLevel.L45: return 4.5;
        case NtrpLevel.L40_45: return 4.25;
        case NtrpLevel.L50: return 5.0;
        case NtrpLevel.L55_PLUS: return 5.5;
        case NtrpLevel.L60_PRO: return 6.0;
        default: return 1.0;
    }
};

export const calculateProgressionDelivered = (coachId: string, students: Student[], sessions: Session[]): number => {
    // 1. Identify students primarily assigned to this coach
    const myStudents = students.filter(s => s.primaryCoachId === coachId);
    let totalProgression = 0;

    myStudents.forEach(student => {
        // 2. Find sessions for this student
        const studentSessions = sessions
            .filter(s => s.studentId === student.id)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (studentSessions.length > 0) {
            // 3. Compare Initial Level vs Current Level
            const startLevel = ntrpToNumber(studentSessions[0].ntrpLevel);
            const currentLevel = ntrpToNumber(student.currentNtrp);

            if (currentLevel > startLevel) {
                totalProgression += (currentLevel - startLevel);
            }
        }
    });

    return parseFloat(totalProgression.toFixed(1));
};

export const getPeerAverageScore = (level: NtrpLevel, allSessions: Session[]): number => {
    // Get all sessions from ANY student at this level
    const relevantSessions = allSessions.filter(s => s.ntrpLevel === level);
    if (relevantSessions.length === 0) return 0;

    const sum = relevantSessions.reduce((acc, s) => acc + s.finalScore, 0);
    return parseFloat((sum / relevantSessions.length).toFixed(1));
};

// =============================================
// BI ANALYTICS — Nullable Stroke Scoring
// =============================================

import { Evaluation, StrokeAssessment, CompositeProfile } from '../types';

/**
 * Calculate fundamentals average from nullable stroke assessments.
 * Only includes non-null strokes in the average.
 * Returns null if no strokes were assessed.
 */
export const calculateFundamentalsAverageNullable = (fundamentals: {
    forehand: StrokeAssessment | null;
    backhand: StrokeAssessment | null;
    serve: StrokeAssessment | null;
    volley: StrokeAssessment | null;
}): { forehand: number | null; backhand: number | null; serve: number | null; volley: number | null; average: number | null; assessedCount: number } => {
    const scores: { forehand: number | null; backhand: number | null; serve: number | null; volley: number | null } = {
        forehand: fundamentals.forehand?.average ?? null,
        backhand: fundamentals.backhand?.average ?? null,
        serve: fundamentals.serve?.average ?? null,
        volley: fundamentals.volley?.average ?? null,
    };

    const assessed = Object.values(scores).filter((v): v is number => v !== null);
    const average = assessed.length > 0
        ? parseFloat((assessed.reduce((a, b) => a + b, 0) / assessed.length).toFixed(1))
        : null;

    return { ...scores, average, assessedCount: assessed.length };
};

/**
 * Calculate final score handling nullable fundamentals.
 * If 0 strokes assessed, uses performance-only.
 */
export const calculateFinalScoreNullable = (
    ntrp: NtrpLevel,
    fundAvg: number | null,
    perfAvg: number
): number | null => {
    const weights = getNtrpWeights(ntrp);

    if (fundAvg === null) {
        // Performance-only evaluation
        return parseFloat((perfAvg * 10).toFixed(1));
    }

    const weightedScore = (fundAvg * weights.fund) + (perfAvg * weights.perf);
    return parseFloat((weightedScore * 10).toFixed(1));
};

/**
 * Compute a CompositeProfile from all evaluations for a student.
 * For each stroke, finds the most recent evaluation where that stroke was assessed.
 */
export const computeCompositeProfile = (
    studentId: string,
    currentNtrpLevel: NtrpLevel,
    evaluations: Evaluation[]
): CompositeProfile => {
    const studentEvals = evaluations
        .filter(e => e.studentId === studentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first

    const findLatestStroke = (strokeKey: 'forehand' | 'backhand' | 'serve' | 'volley') => {
        for (const ev of studentEvals) {
            const assessment = ev.fundamentals[strokeKey];
            if (assessment) {
                return { score: assessment.average, date: ev.date, coachId: ev.evaluatingCoachId };
            }
        }
        return null;
    };

    const latestForehand = findLatestStroke('forehand');
    const latestBackhand = findLatestStroke('backhand');
    const latestServe = findLatestStroke('serve');
    const latestVolley = findLatestStroke('volley');

    // Fundamentals average from latest available scores
    const strokeScores = [latestForehand, latestBackhand, latestServe, latestVolley]
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .map(s => s.score);
    const fundamentalsAverage = strokeScores.length > 0
        ? parseFloat((strokeScores.reduce((a, b) => a + b, 0) / strokeScores.length).toFixed(1))
        : null;

    // Performance average from most recent evaluation
    const latestEval = studentEvals[0];
    const performanceAverage = latestEval ? latestEval.performance.average : null;

    // Overall weighted score
    let overallScore: number | null = null;
    if (fundamentalsAverage !== null && performanceAverage !== null) {
        overallScore = calculateFinalScoreNullable(currentNtrpLevel, fundamentalsAverage, performanceAverage);
    } else if (performanceAverage !== null) {
        overallScore = calculateFinalScoreNullable(currentNtrpLevel, null, performanceAverage);
    }

    return {
        studentId,
        currentNtrpLevel,
        latestForehand,
        latestBackhand,
        latestServe,
        latestVolley,
        fundamentalsAverage,
        performanceAverage,
        overallScore,
        assessmentCount: studentEvals.length,
        lastEvaluatedDate: latestEval?.date ?? null,
        readyForPromotion: overallScore !== null && overallScore >= 80,
    };
};

/**
 * NTRP Level Descriptions for display in evaluation form
 */
export const NTRP_LEVEL_DESCRIPTIONS: Record<string, string> = {
    [NtrpLevel.L10_15]: 'This player is just starting to play tennis. Focus is on basic stroke development, making contact with the ball, and learning court positioning.',
    [NtrpLevel.L20_25]: 'This player needs on-court experience and is beginning to develop strokes. Can sustain a rally of slow pace and is developing consistent serve.',
    [NtrpLevel.L30]: 'This player is fairly consistent on medium-paced shots but lacks execution under pressure. Has developed directional intent, depth, and doubles awareness.',
    [NtrpLevel.L35]: 'This player has achieved stroke dependability with directional control on moderate shots. Has developing net game and variety. Beginning to show competitive patterns.',
    [NtrpLevel.L40]: 'This player has dependable strokes including directional control and depth on both forehand and backhand sides. Uses lobs, overheads, approach shots and volleys with some success.',
    [NtrpLevel.L45]: 'This player has begun to master the use of pace and spin and is developing game plans. Can hit forcing shots and serve with power/spin. Has effective first serves and reliable second serves.',
    [NtrpLevel.L40_45]: 'This player exhibits strong directional control, depth management, and court coverage. Shows game planning ability and serve pressure at an advanced-intermediate level.',
    [NtrpLevel.L50]: 'This player has good shot anticipation and frequently has an outstanding shot or attribute. Can regularly hit winners, has improved volley skills and can use lobs, drop shots, half volleys and overhead smashes.',
    [NtrpLevel.L55_PLUS]: 'This player has developed power and/or consistency as a major weapon. Can vary strategies and compete at tournament level with shot combinations and sound mental skills.',
    [NtrpLevel.L60_PRO]: 'This player has had intensive training for national/international competition. Has obtained a sectional/national ranking and is able to execute all strokes with power and precision.',
};