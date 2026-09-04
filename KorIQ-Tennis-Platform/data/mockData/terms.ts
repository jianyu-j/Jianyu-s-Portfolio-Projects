/**
 * Mock Term Data
 * When deployed, this will be replaced by database queries
 */

import { Term } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_TERMS: Term[] = [
    // --- Adult Beginner 2.0-2.5 Mon (prog-1) ---
    {
        id: 'term-1a',
        programId: 'prog-1',
        clubId: CLUB_ID,
        name: 'Fall 2025',
        startDate: '2025-09-08',
        endDate: '2025-11-03',
        totalWeeks: 8,
        leadCoachId: 'c2',
        assistantCoachId: 'c5',
        enrolledStudentIds: ['s2', 's5', 's9'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-08-01T00:00:00Z'
    },
    {
        id: 'term-1b',
        programId: 'prog-1',
        clubId: CLUB_ID,
        name: 'Winter 2026',
        startDate: '2026-01-12',
        endDate: '2026-03-09',
        totalWeeks: 8,
        leadCoachId: 'c2',
        assistantCoachId: 'c5',
        enrolledStudentIds: ['s2', 's5', 's9'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-12-15T00:00:00Z'
    },
    {
        id: 'term-1c',
        programId: 'prog-1',
        clubId: CLUB_ID,
        name: 'Spring 2026 Session 1',
        startDate: '2026-03-23',
        endDate: '2026-05-18',
        totalWeeks: 8,
        leadCoachId: 'c2',
        assistantCoachId: 'c3',
        enrolledStudentIds: ['s2', 's9'],
        waitlistStudentIds: ['s5'],
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z'
    },

    // --- Adult Intermediate 3.0 Tue (prog-3) ---
    {
        id: 'term-3a',
        programId: 'prog-3',
        clubId: CLUB_ID,
        name: 'Fall 2025',
        startDate: '2025-09-09',
        endDate: '2025-11-04',
        totalWeeks: 8,
        leadCoachId: 'c1',
        assistantCoachId: 'c4',
        enrolledStudentIds: ['s3', 's4', 's7'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-08-01T00:00:00Z'
    },
    {
        id: 'term-3b',
        programId: 'prog-3',
        clubId: CLUB_ID,
        name: 'Winter 2026',
        startDate: '2026-01-13',
        endDate: '2026-03-10',
        totalWeeks: 8,
        leadCoachId: 'c1',
        assistantCoachId: 'c4',
        enrolledStudentIds: ['s3', 's7'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-12-15T00:00:00Z'
    },
    {
        id: 'term-3c',
        programId: 'prog-3',
        clubId: CLUB_ID,
        name: 'Spring 2026 Session 1',
        startDate: '2026-03-24',
        endDate: '2026-05-19',
        totalWeeks: 8,
        leadCoachId: 'c1',
        assistantCoachId: 'c4',
        enrolledStudentIds: ['s3', 's4', 's7'],
        waitlistStudentIds: ['s8'],
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z'
    },

    // --- Advanced 3.5 Wed Evening (prog-5) ---
    {
        id: 'term-5a',
        programId: 'prog-5',
        clubId: CLUB_ID,
        name: 'Fall 2025',
        startDate: '2025-09-10',
        endDate: '2025-11-05',
        totalWeeks: 8,
        leadCoachId: 'c4',
        enrolledStudentIds: ['s1', 's8', 's11'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-08-01T00:00:00Z'
    },
    {
        id: 'term-5b',
        programId: 'prog-5',
        clubId: CLUB_ID,
        name: 'Spring 2026 Session 1',
        startDate: '2026-03-25',
        endDate: '2026-05-20',
        totalWeeks: 8,
        leadCoachId: 'c4',
        assistantCoachId: 'c1',
        enrolledStudentIds: ['s1', 's8', 's11'],
        waitlistStudentIds: ['s6'],
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z'
    },

    // --- Junior 7-9 Sat AM (prog-6) ---
    {
        id: 'term-6a',
        programId: 'prog-6',
        clubId: CLUB_ID,
        name: 'Fall 2025',
        startDate: '2025-09-13',
        endDate: '2025-11-08',
        totalWeeks: 8,
        leadCoachId: 'c3',
        assistantCoachId: 'c5',
        enrolledStudentIds: ['s5'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-08-01T00:00:00Z'
    },
    {
        id: 'term-6b',
        programId: 'prog-6',
        clubId: CLUB_ID,
        name: 'Spring 2026 Session 1',
        startDate: '2026-03-28',
        endDate: '2026-05-23',
        totalWeeks: 8,
        leadCoachId: 'c3',
        assistantCoachId: 'c5',
        enrolledStudentIds: ['s5'],
        waitlistStudentIds: [],
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z'
    },

    // --- Junior 10-12 Sat PM (prog-7) ---
    {
        id: 'term-7a',
        programId: 'prog-7',
        clubId: CLUB_ID,
        name: 'Fall 2025',
        startDate: '2025-09-13',
        endDate: '2025-11-08',
        totalWeeks: 8,
        leadCoachId: 'c2',
        assistantCoachId: 'c3',
        enrolledStudentIds: ['s3', 's7', 's9'],
        waitlistStudentIds: [],
        status: 'completed',
        createdAt: '2025-08-01T00:00:00Z'
    },
    {
        id: 'term-7b',
        programId: 'prog-7',
        clubId: CLUB_ID,
        name: 'Spring 2026 Session 1',
        startDate: '2026-03-28',
        endDate: '2026-05-23',
        totalWeeks: 8,
        leadCoachId: 'c2',
        assistantCoachId: 'c3',
        enrolledStudentIds: ['s7', 's9'],
        waitlistStudentIds: [],
        status: 'active',
        createdAt: '2026-03-01T00:00:00Z'
    },
];
