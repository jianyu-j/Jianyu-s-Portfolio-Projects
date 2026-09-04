/**
 * Mock Coach Data
 * When deployed, this will be replaced by database queries
 */

import { Coach } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_COACHES: Coach[] = [
    { 
        id: 'c1', 
        name: 'Coach Mike', 
        email: 'mike@club.com', 
        clubId: CLUB_ID, 
        coachType: 'Club', 
        status: 'Active', 
        joinedDate: '2023-01-15',
        rating: 4.8
    },
    { 
        id: 'c2', 
        name: 'Coach Sarah', 
        email: 'sarah@club.com', 
        clubId: CLUB_ID, 
        coachType: 'Club', 
        status: 'Active', 
        joinedDate: '2023-02-20',
        rating: 4.6
    },
    { 
        id: 'c3', 
        name: 'Coach Tom', 
        email: 'tom@independent.com', 
        clubId: CLUB_ID, 
        coachType: 'Independent', 
        status: 'Active', 
        joinedDate: '2023-05-10',
        rating: 4.5
    },
    { 
        id: 'c4', 
        name: 'Coach Jessica', 
        email: 'jessica@club.com', 
        clubId: CLUB_ID, 
        coachType: 'Both', 
        status: 'Active', 
        joinedDate: '2023-06-01',
        rating: 4.7
    },
    { 
        id: 'c5', 
        name: 'Coach Alex', 
        email: 'alex@club.com', 
        clubId: CLUB_ID, 
        coachType: 'Club', 
        status: 'Active', 
        joinedDate: '2023-09-01',
        rating: 4.4
    }
];
