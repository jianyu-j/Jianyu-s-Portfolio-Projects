/**
 * Mock User Authentication Data
 * When deployed, this will be replaced by auth provider (Supabase, Auth0, etc.)
 */

import { User, Player, NtrpLevel } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_USERS: User[] = [
    { username: 'coach', password: 'password', role: 'COACH', linkedEntityId: 'c1' },
    { username: 'coach2', password: 'password', role: 'COACH', linkedEntityId: 'c2' },
    { username: 'student', password: 'password', role: 'STUDENT', linkedEntityId: 's1' },
    { username: 'club', password: 'password', role: 'CLUB', linkedEntityId: CLUB_ID },
    { username: 'player', password: 'password', role: 'PLAYER', linkedEntityId: 'p1' }
];

export const MOCK_PLAYERS: Player[] = [
    { 
        id: 'p1', 
        name: 'Pro Player', 
        email: 'player@example.com', 
        city: 'Vancouver', 
        currentNtrp: NtrpLevel.L45, 
        joinedDate: '2024-01-01' 
    },
    { 
        id: 'p2', 
        name: 'Weekend Warrior', 
        email: 'weekend@example.com', 
        city: 'Burnaby', 
        currentNtrp: NtrpLevel.L35, 
        joinedDate: '2024-03-15' 
    },
    { 
        id: 'p3', 
        name: 'Tennis Newbie', 
        email: 'newbie@example.com', 
        city: 'Richmond', 
        currentNtrp: NtrpLevel.L20_25, 
        joinedDate: '2024-06-01' 
    }
];
