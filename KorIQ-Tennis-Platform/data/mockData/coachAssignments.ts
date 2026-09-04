/**
 * Mock Coach Assignment Data
 * When deployed, this will be replaced by database queries
 */

import { CoachAssignment } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_COACH_ASSIGNMENTS: CoachAssignment[] = [
    // --- Adult Beginner 2.0-2.5 Mon (prog-1) ---
    // Fall 2025
    { id: 'ca-1', coachId: 'c2', role: 'lead', termId: 'term-1a', programId: 'prog-1', clubId: CLUB_ID },
    { id: 'ca-2', coachId: 'c5', role: 'assistant', termId: 'term-1a', programId: 'prog-1', clubId: CLUB_ID },
    // Winter 2026
    { id: 'ca-3', coachId: 'c2', role: 'lead', termId: 'term-1b', programId: 'prog-1', clubId: CLUB_ID },
    { id: 'ca-4', coachId: 'c5', role: 'assistant', termId: 'term-1b', programId: 'prog-1', clubId: CLUB_ID },
    // Spring 2026
    { id: 'ca-5', coachId: 'c2', role: 'lead', termId: 'term-1c', programId: 'prog-1', clubId: CLUB_ID },
    { id: 'ca-6', coachId: 'c3', role: 'assistant', termId: 'term-1c', programId: 'prog-1', clubId: CLUB_ID },

    // --- Adult Intermediate 3.0 Tue (prog-3) ---
    // Fall 2025
    { id: 'ca-7', coachId: 'c1', role: 'lead', termId: 'term-3a', programId: 'prog-3', clubId: CLUB_ID },
    { id: 'ca-8', coachId: 'c4', role: 'assistant', termId: 'term-3a', programId: 'prog-3', clubId: CLUB_ID },
    // Winter 2026
    { id: 'ca-9', coachId: 'c1', role: 'lead', termId: 'term-3b', programId: 'prog-3', clubId: CLUB_ID },
    { id: 'ca-10', coachId: 'c4', role: 'assistant', termId: 'term-3b', programId: 'prog-3', clubId: CLUB_ID },
    // Spring 2026
    { id: 'ca-11', coachId: 'c1', role: 'lead', termId: 'term-3c', programId: 'prog-3', clubId: CLUB_ID },
    { id: 'ca-12', coachId: 'c4', role: 'assistant', termId: 'term-3c', programId: 'prog-3', clubId: CLUB_ID },

    // --- Advanced 3.5 Wed Evening (prog-5) ---
    // Fall 2025
    { id: 'ca-13', coachId: 'c4', role: 'lead', termId: 'term-5a', programId: 'prog-5', clubId: CLUB_ID },
    // Spring 2026
    { id: 'ca-14', coachId: 'c4', role: 'lead', termId: 'term-5b', programId: 'prog-5', clubId: CLUB_ID },
    { id: 'ca-15', coachId: 'c1', role: 'assistant', termId: 'term-5b', programId: 'prog-5', clubId: CLUB_ID },

    // --- Junior 7-9 Sat AM (prog-6) ---
    // Fall 2025
    { id: 'ca-16', coachId: 'c3', role: 'lead', termId: 'term-6a', programId: 'prog-6', clubId: CLUB_ID },
    { id: 'ca-17', coachId: 'c5', role: 'assistant', termId: 'term-6a', programId: 'prog-6', clubId: CLUB_ID },
    // Spring 2026
    { id: 'ca-18', coachId: 'c3', role: 'lead', termId: 'term-6b', programId: 'prog-6', clubId: CLUB_ID },
    { id: 'ca-19', coachId: 'c5', role: 'assistant', termId: 'term-6b', programId: 'prog-6', clubId: CLUB_ID },

    // --- Junior 10-12 Sat PM (prog-7) ---
    // Fall 2025
    { id: 'ca-20', coachId: 'c2', role: 'lead', termId: 'term-7a', programId: 'prog-7', clubId: CLUB_ID },
    { id: 'ca-21', coachId: 'c3', role: 'assistant', termId: 'term-7a', programId: 'prog-7', clubId: CLUB_ID },
    // Spring 2026
    { id: 'ca-22', coachId: 'c2', role: 'lead', termId: 'term-7b', programId: 'prog-7', clubId: CLUB_ID },
    { id: 'ca-23', coachId: 'c3', role: 'assistant', termId: 'term-7b', programId: 'prog-7', clubId: CLUB_ID },
];
