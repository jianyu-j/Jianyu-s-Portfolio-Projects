/**
 * Mock Revenue Data
 * When deployed, this will be replaced by database/Stripe queries
 */

import { RevenueEntry, NtrpLevel } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_REVENUE: RevenueEntry[] = [
    // 2024 Data
    { id: 'rev1', clubId: CLUB_ID, type: 'Group Class', amount: 15000, date: '2024-01-15', coachId: 'c1' },
    { id: 'rev2', clubId: CLUB_ID, type: 'Private Lesson', amount: 8000, date: '2024-01-20', coachId: 'c2' },
    { id: 'rev3', clubId: CLUB_ID, type: 'Camp', amount: 5000, date: '2024-06-15', coachId: 'c1' },
    { id: 'rev4', clubId: CLUB_ID, type: 'Private Lesson', amount: 6500, date: '2024-07-10', coachId: 'c3' },
    { id: 'rev5', clubId: CLUB_ID, type: 'Group Class', amount: 12000, date: '2024-08-01', coachId: 'c2' },
    { id: 'rev6', clubId: CLUB_ID, type: 'Private Lesson', amount: 7200, date: '2024-09-15', coachId: 'c4' },
    { id: 'rev7', clubId: CLUB_ID, type: 'Group Class', amount: 14000, date: '2024-10-01', coachId: 'c1' },
    { id: 'rev8', clubId: CLUB_ID, type: 'Camp', amount: 8500, date: '2024-11-15', coachId: 'c5' },
    { id: 'rev9', clubId: CLUB_ID, type: 'Private Lesson', amount: 9000, date: '2024-12-01', coachId: 'c1' },
    
    // 2025 Data
    { id: 'rev10', clubId: CLUB_ID, type: 'Group Class', amount: 18000, date: '2025-01-10', coachId: 'c1' },
    { id: 'rev11', clubId: CLUB_ID, type: 'Private Lesson', amount: 9500, date: '2025-01-15', coachId: 'c2' },
    { id: 'rev12', clubId: CLUB_ID, type: 'Other', amount: 2000, date: '2025-02-01' },
    { id: 'rev13', clubId: CLUB_ID, type: 'Group Class', amount: 20000, date: '2025-03-01', coachId: 'c3' },
    { id: 'rev14', clubId: CLUB_ID, type: 'Private Lesson', amount: 11000, date: '2025-03-15', coachId: 'c4' },
    { id: 'rev15', clubId: CLUB_ID, type: 'Group Class', amount: 12500, date: '2025-06-01', coachId: 'c1', studentLevel: NtrpLevel.L30 },
    
    // Student-specific revenue (for LTV calculations)
    { id: 'rev16', clubId: CLUB_ID, type: 'Private Lesson', amount: 1200, date: '2024-03-01', coachId: 'c1', studentId: 's1', studentEmail: 'olivia@example.com' },
    { id: 'rev17', clubId: CLUB_ID, type: 'Private Lesson', amount: 1200, date: '2024-05-01', coachId: 'c1', studentId: 's1', studentEmail: 'olivia@example.com' },
    { id: 'rev18', clubId: CLUB_ID, type: 'Private Lesson', amount: 1200, date: '2024-07-01', coachId: 'c1', studentId: 's1', studentEmail: 'olivia@example.com' },
    { id: 'rev19', clubId: CLUB_ID, type: 'Private Lesson', amount: 1200, date: '2024-09-01', coachId: 'c2', studentId: 's1', studentEmail: 'olivia@example.com' },
    { id: 'rev20', clubId: CLUB_ID, type: 'Private Lesson', amount: 1200, date: '2024-11-01', coachId: 'c1', studentId: 's1', studentEmail: 'olivia@example.com' },
    
    { id: 'rev21', clubId: CLUB_ID, type: 'Group Class', amount: 800, date: '2024-04-01', coachId: 'c2', studentId: 's2', studentEmail: 'james@example.com' },
    { id: 'rev22', clubId: CLUB_ID, type: 'Group Class', amount: 800, date: '2024-06-01', coachId: 'c2', studentId: 's2', studentEmail: 'james@example.com' },
    { id: 'rev23', clubId: CLUB_ID, type: 'Group Class', amount: 800, date: '2024-09-01', coachId: 'c2', studentId: 's2', studentEmail: 'james@example.com' },
    
    { id: 'rev24', clubId: CLUB_ID, type: 'Private Lesson', amount: 1500, date: '2024-10-15', coachId: 'c1', studentId: 's8', studentEmail: 'ethan@example.com' },
    { id: 'rev25', clubId: CLUB_ID, type: 'Private Lesson', amount: 1500, date: '2024-12-01', coachId: 'c1', studentId: 's8', studentEmail: 'ethan@example.com' },
    { id: 'rev26', clubId: CLUB_ID, type: 'Private Lesson', amount: 1500, date: '2025-01-15', coachId: 'c1', studentId: 's8', studentEmail: 'ethan@example.com' },
];
