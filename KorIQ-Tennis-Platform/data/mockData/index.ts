/**
 * Mock Data Index
 * 
 * This file exports all mock data for the application.
 * When deployed with a real backend, these imports will be replaced
 * with API calls to your database.
 * 
 * The data structure and types remain the same, making the transition seamless.
 */

// Core entities
export { CLUB_ID, MOCK_CLUBS } from './clubs';
export { MOCK_COACHES } from './coaches';
export { MOCK_STUDENTS } from './students';
export { MOCK_SESSIONS, getCoachSessionCounts, getPrimaryCoachForStudent } from './sessions';

// User & Auth
export { MOCK_USERS, MOCK_PLAYERS } from './users';

// Ratings & Reviews
export { MOCK_RATINGS } from './ratings';

// Financial
export { MOCK_REVENUE } from './revenue';
export { MOCK_EXPENSES } from './expenses';

// Club Operations
export { MOCK_CLUB_SESSIONS } from './clubSessions';

// BI Analytics
export { MOCK_PROGRAMS } from './programs';
export { MOCK_TERMS } from './terms';
export { MOCK_COACH_ASSIGNMENTS } from './coachAssignments';
export { MOCK_EVALUATIONS } from './evaluations';
