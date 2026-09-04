/**
 * Mock Session/Evaluation Data
 * When deployed, this will be replaced by database queries
 * 
 * Sessions track coach evaluations of students over time.
 * Multiple coaches can evaluate the same student.
 */

import { Session, NtrpLevel } from '../../types';

// Helper to generate session data
const createSession = (
    id: string,
    studentId: string,
    coachId: string,
    coachName: string,
    date: string,
    ntrpLevel: NtrpLevel,
    finalScore: number,
    fundamentals: { fh: number; bh: number; serve: number; volley: number },
    performance: { scores: Record<string, number>; average: number },
    notes?: string
): Session => ({
    id,
    studentId,
    coachId,
    coachName,
    date,
    ntrpLevel,
    classType: '1-on-1',
    sessionType: 'CLUB',
    durationMinutes: 60,
    fundamentals: {
        fhScore: fundamentals.fh,
        bhScore: fundamentals.bh,
        serveScore: fundamentals.serve,
        volleyScore: fundamentals.volley,
        average: (fundamentals.fh + fundamentals.bh + fundamentals.serve + fundamentals.volley) / 4
    },
    performance,
    finalScore,
    notes: notes || ''
});

export const MOCK_SESSIONS: Session[] = [
    // ============================================
    // OLIVIA (s1) - Started 3.0, now 3.5
    // Primary coach: Mike (c1), also trained with Sarah (c2)
    // ============================================
    createSession('sess1', 's1', 'c1', 'Coach Mike', '2024-02-15', NtrpLevel.L30, 62,
        { fh: 6.5, bh: 5.8, serve: 6.0, volley: 5.5 },
        { scores: { consistency: 6.2, shotSelection: 5.8, movement: 6.0 }, average: 6.0 },
        'Good baseline. Needs work on backhand.'
    ),
    createSession('sess2', 's1', 'c1', 'Coach Mike', '2024-03-20', NtrpLevel.L30, 68,
        { fh: 7.0, bh: 6.2, serve: 6.5, volley: 5.8 },
        { scores: { consistency: 6.8, shotSelection: 6.2, movement: 6.5 }, average: 6.5 },
        'Forehand improving nicely.'
    ),
    createSession('sess3', 's1', 'c2', 'Coach Sarah', '2024-04-10', NtrpLevel.L30, 65,
        { fh: 6.8, bh: 6.0, serve: 6.2, volley: 5.5 },
        { scores: { consistency: 6.5, shotSelection: 6.0, movement: 6.2 }, average: 6.2 },
        'Worked on volley technique.'
    ),
    createSession('sess4', 's1', 'c1', 'Coach Mike', '2024-05-15', NtrpLevel.L30, 75,
        { fh: 7.5, bh: 7.0, serve: 7.2, volley: 6.5 },
        { scores: { consistency: 7.5, shotSelection: 7.0, movement: 7.2 }, average: 7.2 },
        'Great progress! Consistency is solid.'
    ),
    createSession('sess5', 's1', 'c1', 'Coach Mike', '2024-06-20', NtrpLevel.L30, 82,
        { fh: 8.0, bh: 7.5, serve: 7.8, volley: 7.0 },
        { scores: { consistency: 8.2, shotSelection: 7.8, movement: 8.0 }, average: 8.0 },
        'Ready for level up! Unlocking 3.5.'
    ),
    createSession('sess6', 's1', 'c1', 'Coach Mike', '2024-08-10', NtrpLevel.L35, 55,
        { fh: 6.0, bh: 5.5, serve: 5.8, volley: 5.0 },
        { scores: { consistency: 5.5, shotSelection: 5.2, movement: 5.5 }, average: 5.4 },
        'First session at 3.5. Adjusting to new standards.'
    ),
    createSession('sess7', 's1', 'c2', 'Coach Sarah', '2024-09-15', NtrpLevel.L35, 58,
        { fh: 6.2, bh: 5.8, serve: 6.0, volley: 5.2 },
        { scores: { consistency: 5.8, shotSelection: 5.5, movement: 5.8 }, average: 5.7 },
        'Building at new level.'
    ),
    createSession('sess8', 's1', 'c1', 'Coach Mike', '2024-11-01', NtrpLevel.L35, 65,
        { fh: 6.8, bh: 6.2, serve: 6.5, volley: 5.8 },
        { scores: { consistency: 6.5, shotSelection: 6.2, movement: 6.5 }, average: 6.4 },
        'Good adaptation to 3.5 level.'
    ),

    // ============================================
    // JAMES (s2) - Started 1.0-1.5, now 2.0-2.5
    // Primary coach: Sarah (c2)
    // ============================================
    createSession('sess9', 's2', 'c2', 'Coach Sarah', '2024-03-01', NtrpLevel.L10_15, 58,
        { fh: 5.5, bh: 4.8, serve: 5.0, volley: 4.5 },
        { scores: { basicRally: 5.8, courtCoverage: 5.2 }, average: 5.5 },
        'Young beginner. Enthusiastic!'
    ),
    createSession('sess10', 's2', 'c2', 'Coach Sarah', '2024-04-15', NtrpLevel.L10_15, 68,
        { fh: 6.5, bh: 5.5, serve: 6.0, volley: 5.0 },
        { scores: { basicRally: 6.8, courtCoverage: 6.2 }, average: 6.5 },
        'Good grip on fundamentals now.'
    ),
    createSession('sess11', 's2', 'c2', 'Coach Sarah', '2024-06-01', NtrpLevel.L10_15, 78,
        { fh: 7.5, bh: 6.8, serve: 7.0, volley: 6.0 },
        { scores: { basicRally: 7.8, courtCoverage: 7.2 }, average: 7.5 },
        'Almost ready for 2.0-2.5!'
    ),
    createSession('sess12', 's2', 'c2', 'Coach Sarah', '2024-07-15', NtrpLevel.L10_15, 85,
        { fh: 8.2, bh: 7.5, serve: 7.8, volley: 7.0 },
        { scores: { basicRally: 8.5, courtCoverage: 8.0 }, average: 8.2 },
        'Level up! Moving to 2.0-2.5.'
    ),
    createSession('sess13', 's2', 'c2', 'Coach Sarah', '2024-09-01', NtrpLevel.L20_25, 52,
        { fh: 5.5, bh: 5.0, serve: 5.2, volley: 4.8 },
        { scores: { consistency: 5.2, shotSelection: 4.8, movement: 5.0 }, average: 5.0 },
        'Starting at new level.'
    ),
    createSession('sess14', 's2', 'c2', 'Coach Sarah', '2024-11-15', NtrpLevel.L20_25, 62,
        { fh: 6.2, bh: 5.8, serve: 6.0, volley: 5.5 },
        { scores: { consistency: 6.2, shotSelection: 5.8, movement: 6.0 }, average: 6.0 },
        'Progressing well at 2.0-2.5.'
    ),

    // ============================================
    // ETHAN (s8) - Started 3.0, now 3.5
    // Primary coach: Mike (c1), also trained with Jessica (c4)
    // ============================================
    createSession('sess15', 's8', 'c1', 'Coach Mike', '2024-10-15', NtrpLevel.L30, 70,
        { fh: 7.2, bh: 6.8, serve: 7.0, volley: 6.5 },
        { scores: { consistency: 7.0, shotSelection: 6.8, movement: 7.0 }, average: 6.9 },
        'Strong baseline player.'
    ),
    createSession('sess16', 's8', 'c4', 'Coach Jessica', '2024-11-01', NtrpLevel.L30, 72,
        { fh: 7.0, bh: 7.2, serve: 7.0, volley: 6.8 },
        { scores: { consistency: 7.2, shotSelection: 7.0, movement: 7.2 }, average: 7.1 },
        'Nice backhand. Focus on net game.'
    ),
    createSession('sess17', 's8', 'c1', 'Coach Mike', '2024-12-01', NtrpLevel.L30, 80,
        { fh: 8.0, bh: 7.8, serve: 7.8, volley: 7.2 },
        { scores: { consistency: 8.0, shotSelection: 7.8, movement: 8.0 }, average: 7.9 },
        'Ready for 3.5!'
    ),
    createSession('sess18', 's8', 'c1', 'Coach Mike', '2025-01-15', NtrpLevel.L35, 58,
        { fh: 6.0, bh: 5.8, serve: 5.8, volley: 5.5 },
        { scores: { consistency: 5.8, shotSelection: 5.5, movement: 5.8 }, average: 5.7 },
        'First evaluation at 3.5.'
    ),

    // ============================================
    // NOAH (s10) - Started 4.0, now 4.5
    // Primary coach: Alex (c5)
    // ============================================
    createSession('sess19', 's10', 'c5', 'Coach Alex', '2024-12-10', NtrpLevel.L40, 75,
        { fh: 7.8, bh: 7.5, serve: 7.8, volley: 7.2 },
        { scores: { tacticalPlay: 7.5, powerControl: 7.2, mentalGame: 7.0 }, average: 7.2 },
        'Advanced player. Good court sense.'
    ),
    createSession('sess20', 's10', 'c5', 'Coach Alex', '2025-01-05', NtrpLevel.L40, 82,
        { fh: 8.2, bh: 8.0, serve: 8.2, volley: 7.8 },
        { scores: { tacticalPlay: 8.2, powerControl: 8.0, mentalGame: 7.8 }, average: 8.0 },
        'Outstanding progress. 4.5 material.'
    ),

    // ============================================
    // MIA (s9) - Started 1.0-1.5, now 2.0-2.5
    // Primary coach: Tom (c3)
    // ============================================
    createSession('sess21', 's9', 'c3', 'Coach Tom', '2024-11-20', NtrpLevel.L10_15, 72,
        { fh: 7.0, bh: 6.5, serve: 6.8, volley: 6.2 },
        { scores: { basicRally: 7.2, courtCoverage: 6.8 }, average: 7.0 },
        'Quick learner!'
    ),
    createSession('sess22', 's9', 'c3', 'Coach Tom', '2024-12-15', NtrpLevel.L10_15, 82,
        { fh: 8.0, bh: 7.5, serve: 7.8, volley: 7.0 },
        { scores: { basicRally: 8.2, courtCoverage: 7.8 }, average: 8.0 },
        'Level up to 2.0-2.5!'
    ),
    createSession('sess23', 's9', 'c3', 'Coach Tom', '2025-01-10', NtrpLevel.L20_25, 55,
        { fh: 5.8, bh: 5.2, serve: 5.5, volley: 5.0 },
        { scores: { consistency: 5.5, shotSelection: 5.2, movement: 5.5 }, average: 5.4 },
        'Starting at new level. Good attitude.'
    ),

    // ============================================
    // AVA (s7) - Started 2.0-2.5, now 3.0
    // Primary coach: Sarah (c2), also trained with Mike (c1)
    // ============================================
    createSession('sess24', 's7', 'c2', 'Coach Sarah', '2024-09-20', NtrpLevel.L20_25, 68,
        { fh: 6.8, bh: 6.2, serve: 6.5, volley: 6.0 },
        { scores: { consistency: 6.8, shotSelection: 6.2, movement: 6.5 }, average: 6.5 },
        'Good fundamentals.'
    ),
    createSession('sess25', 's7', 'c1', 'Coach Mike', '2024-10-20', NtrpLevel.L20_25, 72,
        { fh: 7.2, bh: 6.8, serve: 7.0, volley: 6.5 },
        { scores: { consistency: 7.2, shotSelection: 6.8, movement: 7.0 }, average: 7.0 },
        'Nice improvement on serve.'
    ),
    createSession('sess26', 's7', 'c2', 'Coach Sarah', '2024-11-20', NtrpLevel.L20_25, 80,
        { fh: 8.0, bh: 7.5, serve: 7.8, volley: 7.2 },
        { scores: { consistency: 8.0, shotSelection: 7.5, movement: 7.8 }, average: 7.8 },
        'Ready for 3.0!'
    ),
    createSession('sess27', 's7', 'c2', 'Coach Sarah', '2025-01-05', NtrpLevel.L30, 52,
        { fh: 5.5, bh: 5.0, serve: 5.2, volley: 4.8 },
        { scores: { consistency: 5.2, shotSelection: 5.0, movement: 5.2 }, average: 5.1 },
        'First session at 3.0. Building up.'
    ),
];

// ============================================
// HELPER: Calculate coach attribution for level-ups
// ============================================
export function getCoachSessionCounts(studentId: string, sessions: Session[]): Record<string, number> {
    const counts: Record<string, number> = {};
    sessions
        .filter(s => s.studentId === studentId)
        .forEach(s => {
            counts[s.coachId] = (counts[s.coachId] || 0) + 1;
        });
    return counts;
}

export function getPrimaryCoachForStudent(studentId: string, sessions: Session[]): string | null {
    const counts = getCoachSessionCounts(studentId, sessions);
    let maxCount = 0;
    let primaryCoach: string | null = null;
    
    Object.entries(counts).forEach(([coachId, count]) => {
        if (count > maxCount) {
            maxCount = count;
            primaryCoach = coachId;
        }
    });
    
    return primaryCoach;
}
