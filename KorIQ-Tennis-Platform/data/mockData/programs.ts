/**
 * Mock Program Data
 * When deployed, this will be replaced by database queries
 */

import { Program, NtrpLevel } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_PROGRAMS: Program[] = [
    {
        id: 'prog-1',
        clubId: CLUB_ID,
        name: 'Adult Beginner 2.0-2.5 Mon',
        targetNtrpLevel: NtrpLevel.L20_25,
        ageGroup: 'adult',
        dayOfWeek: 'Monday',
        timeSlot: '6:00 PM - 7:30 PM',
        maxCapacity: 8,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-2',
        clubId: CLUB_ID,
        name: 'Adult Beginner 2.0-2.5 Wed',
        targetNtrpLevel: NtrpLevel.L20_25,
        ageGroup: 'adult',
        dayOfWeek: 'Wednesday',
        timeSlot: '6:00 PM - 7:30 PM',
        maxCapacity: 8,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-3',
        clubId: CLUB_ID,
        name: 'Adult Intermediate 3.0 Tue',
        targetNtrpLevel: NtrpLevel.L30,
        ageGroup: 'adult',
        dayOfWeek: 'Tuesday',
        timeSlot: '7:00 PM - 8:30 PM',
        maxCapacity: 6,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-4',
        clubId: CLUB_ID,
        name: 'Adult Intermediate 3.0 Thu',
        targetNtrpLevel: NtrpLevel.L30,
        ageGroup: 'adult',
        dayOfWeek: 'Thursday',
        timeSlot: '7:00 PM - 8:30 PM',
        maxCapacity: 6,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-5',
        clubId: CLUB_ID,
        name: 'Advanced 3.5 Wed Evening',
        targetNtrpLevel: NtrpLevel.L35,
        ageGroup: 'adult',
        dayOfWeek: 'Wednesday',
        timeSlot: '8:00 PM - 9:30 PM',
        maxCapacity: 4,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-6',
        clubId: CLUB_ID,
        name: 'Junior 7-9 Sat AM',
        targetNtrpLevel: NtrpLevel.L10_15,
        ageGroup: 'junior',
        ageRange: { min: 7, max: 9 },
        dayOfWeek: 'Saturday',
        timeSlot: '9:00 AM - 10:30 AM',
        maxCapacity: 10,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-7',
        clubId: CLUB_ID,
        name: 'Junior 10-12 Sat PM',
        targetNtrpLevel: NtrpLevel.L20_25,
        ageGroup: 'junior',
        ageRange: { min: 10, max: 12 },
        dayOfWeek: 'Saturday',
        timeSlot: '11:00 AM - 12:30 PM',
        maxCapacity: 8,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    },
    {
        id: 'prog-8',
        clubId: CLUB_ID,
        name: 'Junior 4-6 Sun AM',
        targetNtrpLevel: NtrpLevel.L10_15,
        ageGroup: 'junior',
        ageRange: { min: 4, max: 6 },
        dayOfWeek: 'Sunday',
        timeSlot: '9:00 AM - 10:00 AM',
        maxCapacity: 12,
        isActive: true,
        createdAt: '2024-06-01T00:00:00Z'
    }
];
