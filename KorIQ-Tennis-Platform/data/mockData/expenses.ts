/**
 * Mock Expense Data
 * When deployed, this will be replaced by database queries
 */

import { ExpenseEntry } from '../../types';
import { CLUB_ID } from './clubs';

export const MOCK_EXPENSES: ExpenseEntry[] = [
    // 2024 Data
    { id: 'exp1', clubId: CLUB_ID, category: 'Payroll', amount: 10000, date: '2024-01-30' },
    { id: 'exp2', clubId: CLUB_ID, category: 'Rent', amount: 3000, date: '2024-01-01' },
    { id: 'exp3', clubId: CLUB_ID, category: 'Equipment', amount: 2500, date: '2024-03-15' },
    { id: 'exp4', clubId: CLUB_ID, category: 'Marketing', amount: 500, date: '2024-04-01' },
    { id: 'exp5', clubId: CLUB_ID, category: 'Payroll', amount: 11000, date: '2024-06-30' },
    { id: 'exp6', clubId: CLUB_ID, category: 'Rent', amount: 3000, date: '2024-07-01' },
    { id: 'exp7', clubId: CLUB_ID, category: 'Utilities', amount: 800, date: '2024-08-15' },
    { id: 'exp8', clubId: CLUB_ID, category: 'Insurance', amount: 1200, date: '2024-09-01' },
    
    // 2025 Data
    { id: 'exp9', clubId: CLUB_ID, category: 'Payroll', amount: 12000, date: '2025-01-30' },
    { id: 'exp10', clubId: CLUB_ID, category: 'Rent', amount: 3200, date: '2025-01-01' },
    { id: 'exp11', clubId: CLUB_ID, category: 'Equipment', amount: 1500, date: '2025-02-15' },
    { id: 'exp12', clubId: CLUB_ID, category: 'Marketing', amount: 800, date: '2025-03-01' },
    { id: 'exp13', clubId: CLUB_ID, category: 'Software', amount: 200, date: '2025-01-15', description: 'KorIQ Subscription' },
];
