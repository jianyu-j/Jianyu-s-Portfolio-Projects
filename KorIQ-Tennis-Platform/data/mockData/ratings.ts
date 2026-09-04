/**
 * Mock Coach Rating Data
 * When deployed, this will be replaced by database queries
 */

import { CoachRating } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_RATINGS: CoachRating[] = [
    { id: 'r1', coachId: 'c1', studentId: 's1', clubId: CLUB_ID, rating: 5, comment: "Coach Mike is amazing! My forehand improved so much.", date: "2024-11-20" },
    { id: 'r2', coachId: 'c1', studentId: 's3', clubId: CLUB_ID, rating: 4, comment: "Very patient with beginners", date: "2024-12-15" },
    { id: 'r3', coachId: 'c1', studentId: 's8', clubId: CLUB_ID, rating: 5, comment: "Helped me level up to 3.5!", date: "2025-01-10" },
    { id: 'r4', coachId: 'c1', studentId: 's7', clubId: CLUB_ID, rating: 5, comment: "Best lesson ever", date: "2024-10-28" },
    
    { id: 'r5', coachId: 'c2', studentId: 's2', clubId: CLUB_ID, rating: 5, comment: "Sarah is amazing with kids", date: "2024-12-05" },
    { id: 'r6', coachId: 'c2', studentId: 's7', clubId: CLUB_ID, rating: 5, comment: "Helped me get to 3.0!", date: "2024-12-01" },
    { id: 'r7', coachId: 'c2', studentId: 's1', clubId: CLUB_ID, rating: 4, comment: "Good volley drills", date: "2024-09-20" },
    
    { id: 'r8', coachId: 'c3', studentId: 's9', clubId: CLUB_ID, rating: 5, comment: "Coach Tom makes learning fun", date: "2025-01-15" },
    { id: 'r9', coachId: 'c3', studentId: 's5', clubId: CLUB_ID, rating: 4, comment: "Good technical advice", date: "2024-12-18" },
    
    { id: 'r10', coachId: 'c4', studentId: 's8', clubId: CLUB_ID, rating: 4, comment: "Great backhand tips", date: "2024-11-05" },
    { id: 'r11', coachId: 'c4', studentId: 's6', clubId: CLUB_ID, rating: 5, comment: "Jessica knows advanced tactics", date: "2024-10-15" },
    
    { id: 'r12', coachId: 'c5', studentId: 's10', clubId: CLUB_ID, rating: 5, comment: "Coach Alex pushed me to 4.5", date: "2025-01-08" },
];
