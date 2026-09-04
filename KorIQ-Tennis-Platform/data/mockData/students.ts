/**
 * Mock Student Data
 * When deployed, this will be replaced by database queries
 */

import { Student, NtrpLevel } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_STUDENTS: Student[] = [
    { 
        id: 's1', 
        name: 'Olivia Tennis', 
        email: 'olivia@example.com', 
        age: 14, 
        currentNtrp: NtrpLevel.L35,
        startingNtrp: NtrpLevel.L30, // Started at 3.0, now at 3.5 = leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c1', 
        status: 'Claimed', 
        joinedDate: '2024-01-10' 
    },
    { 
        id: 's2', 
        name: 'James Racket', 
        email: 'james@example.com', 
        age: 10, 
        currentNtrp: NtrpLevel.L20_25,
        startingNtrp: NtrpLevel.L10_15, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c2', 
        status: 'Claimed', 
        joinedDate: '2024-02-15' 
    },
    { 
        id: 's3', 
        name: 'Emma Chen', 
        email: 'emma@example.com', 
        age: 12, 
        currentNtrp: NtrpLevel.L20_25,
        startingNtrp: NtrpLevel.L20_25, // Same level (in progress)
        clubId: CLUB_ID, 
        primaryCoachId: 'c1', 
        status: 'Claimed', 
        joinedDate: '2024-03-01' 
    }, 
    { 
        id: 's4', 
        name: 'Jake Wilson', 
        email: 'jake@example.com', 
        age: 16, 
        currentNtrp: NtrpLevel.L30,
        startingNtrp: NtrpLevel.L20_25, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c2', 
        status: 'Unclaimed', 
        joinedDate: '2024-06-20' 
    },
    { 
        id: 's5', 
        name: 'Sofia Martinez', 
        email: 'sofia@example.com', 
        age: 8, 
        currentNtrp: NtrpLevel.L10_15,
        startingNtrp: NtrpLevel.L10_15, // Same level (new student)
        clubId: CLUB_ID, 
        primaryCoachId: 'c3', 
        status: 'Claimed', 
        joinedDate: '2024-07-10' 
    },
    { 
        id: 's6', 
        name: 'Lucas Brown', 
        email: 'lucas@example.com', 
        age: 15, 
        currentNtrp: NtrpLevel.L40,
        startingNtrp: NtrpLevel.L35, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c4', 
        status: 'Unclaimed', 
        joinedDate: '2024-08-05' 
    },
    { 
        id: 's7', 
        name: 'Ava Johnson', 
        email: 'ava@example.com', 
        age: 11, 
        currentNtrp: NtrpLevel.L30,
        startingNtrp: NtrpLevel.L20_25, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c2', 
        status: 'Claimed', 
        joinedDate: '2024-09-12' 
    },
    { 
        id: 's8', 
        name: 'Ethan Lee', 
        email: 'ethan@example.com', 
        age: 13, 
        currentNtrp: NtrpLevel.L35,
        startingNtrp: NtrpLevel.L30, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c1', 
        status: 'Claimed', 
        joinedDate: '2024-10-01' 
    },
    { 
        id: 's9', 
        name: 'Mia Davis', 
        email: 'mia@example.com', 
        age: 9, 
        currentNtrp: NtrpLevel.L20_25,
        startingNtrp: NtrpLevel.L10_15, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c3', 
        status: 'Claimed', 
        joinedDate: '2024-11-15' 
    },
    { 
        id: 's10', 
        name: 'Noah Miller', 
        email: 'noah@example.com', 
        age: 17, 
        currentNtrp: NtrpLevel.L45,
        startingNtrp: NtrpLevel.L40, // Leveled up!
        clubId: CLUB_ID, 
        primaryCoachId: 'c5', 
        status: 'Unclaimed', 
        joinedDate: '2024-12-05' 
    },
    { 
        id: 's11', 
        name: 'Isabella Taylor', 
        email: 'isa@example.com', 
        age: 14, 
        currentNtrp: NtrpLevel.L35,
        startingNtrp: NtrpLevel.L35, // Same level (in progress)
        clubId: CLUB_ID, 
        primaryCoachId: 'c4', 
        status: 'Claimed', 
        joinedDate: '2025-01-05' 
    },
];
