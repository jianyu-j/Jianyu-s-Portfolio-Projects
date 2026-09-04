/**
 * Mock Club Session Period Data (for retention tracking)
 * When deployed, this will be replaced by database queries
 */

import { ClubSessionPeriod } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_CLUB_SESSIONS: ClubSessionPeriod[] = [
    { 
        id: 'cs1', 
        clubId: CLUB_ID, 
        name: 'Winter 2024', 
        startDate: '2024-01-01', 
        endDate: '2024-03-31', 
        enrolledEmails: ['olivia@example.com', 'james@example.com', 'emma@example.com'] 
    },
    { 
        id: 'cs2', 
        clubId: CLUB_ID, 
        name: 'Spring 2024', 
        startDate: '2024-04-01', 
        endDate: '2024-06-30', 
        enrolledEmails: ['olivia@example.com', 'james@example.com', 'jake@example.com'] 
    },
    { 
        id: 'cs3', 
        clubId: CLUB_ID, 
        name: 'Summer 2024', 
        startDate: '2024-07-01', 
        endDate: '2024-08-31', 
        enrolledEmails: ['olivia@example.com', 'sofia@example.com', 'lucas@example.com'] 
    },
    { 
        id: 'cs4', 
        clubId: CLUB_ID, 
        name: 'Fall 2024', 
        startDate: '2024-09-01', 
        endDate: '2024-11-30', 
        enrolledEmails: ['olivia@example.com', 'sofia@example.com', 'ava@example.com', 'ethan@example.com'] 
    },
    { 
        id: 'cs5', 
        clubId: CLUB_ID, 
        name: 'Winter 2025', 
        startDate: '2025-01-01', 
        endDate: '2025-03-31', 
        enrolledEmails: ['olivia@example.com', 'sofia@example.com', 'ava@example.com', 'ethan@example.com', 'mia@example.com'] 
    }
];
