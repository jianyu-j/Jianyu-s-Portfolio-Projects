/**
 * Mock Club Data
 * When deployed, this will be replaced by database queries
 */

import { Club } from '../../types';

export const CLUB_ID = 'club_vancouver';

export const MOCK_CLUBS: Club[] = [
    { id: CLUB_ID, name: 'Vancouver Tennis Club', location: 'Vancouver, BC' },
    { id: 'club_richmond', name: 'Richmond Racquet Club', location: 'Richmond, BC' },
    { id: 'club_burnaby', name: 'Burnaby Tennis Academy', location: 'Burnaby, BC' }
];
