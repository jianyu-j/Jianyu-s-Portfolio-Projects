import { Student, Coach, RevenueEntry, NtrpLevel } from '../types';
import { storageService } from './storageService';

// Types for Stripe payment data
interface StripePayment {
    id: string;
    amount: number;
    currency: string;
    created: number; // Unix timestamp
    customer: {
        id: string;
        email: string;
        name: string;
    };
    metadata: {
        coach_id?: string;
        coach_name?: string;
        class_type?: 'Private Lesson' | 'Group Class' | 'Camp' | 'Other';
        student_id?: string;
        student_name?: string;
    };
    description: string;
    status: 'succeeded' | 'pending' | 'failed';
}

interface SyncResult {
    newStudents: Student[];
    newCoaches: Coach[];
    newRevenue: RevenueEntry[];
    updatedStudents: Student[];
    errors: string[];
}

// Email templates (mock - would be sent via backend)
const sendInviteEmail = async (email: string, name: string, type: 'student' | 'coach', clubName: string) => {
    console.log(`[Mock] Sending ${type} invite email to ${email}`);
    console.log(`Subject: You've been added to ${clubName} on KorIQ!`);
    console.log(`Body: Hi ${name}, claim your ${type} profile at https://koriq.app/claim`);
    // In production, this would call an API endpoint to send the email
    return true;
};

/**
 * Processes a batch of Stripe payments and automatically creates/updates accounts
 */
export const processStripePayments = async (
    payments: StripePayment[],
    clubId: string,
    clubName: string,
    options: {
        autoCreateStudents: boolean;
        autoCreateCoaches: boolean;
        sendInviteEmails: boolean;
    }
): Promise<SyncResult> => {
    const result: SyncResult = {
        newStudents: [],
        newCoaches: [],
        newRevenue: [],
        updatedStudents: [],
        errors: []
    };

    const existingStudents = storageService.getStudents();
    const existingCoaches = storageService.getCoaches();
    const existingEmails = new Set([
        ...existingStudents.map(s => s.email?.toLowerCase()),
        ...existingCoaches.map(c => c.email?.toLowerCase())
    ]);

    for (const payment of payments) {
        try {
            // Skip non-succeeded payments
            if (payment.status !== 'succeeded') continue;

            const customerEmail = payment.customer.email?.toLowerCase();
            const customerName = payment.customer.name;
            const coachName = payment.metadata.coach_name;

            // 1. Check if student exists, if not create
            if (customerEmail && options.autoCreateStudents) {
                const existingStudent = existingStudents.find(
                    s => s.email?.toLowerCase() === customerEmail
                );

                if (!existingStudent && !result.newStudents.find(s => s.email?.toLowerCase() === customerEmail)) {
                    // Create new unclaimed student
                    const newStudent: Student = {
                        id: `stud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: customerName || 'Unknown',
                        email: customerEmail,
                        age: 0, // Unknown
                        currentNtrp: NtrpLevel.L3_0, // Default level
                        primaryCoachId: payment.metadata.coach_id || '',
                        status: 'Unclaimed',
                        joinedDate: new Date(payment.created * 1000).toISOString(),
                        clubId: clubId
                    };

                    result.newStudents.push(newStudent);
                    existingEmails.add(customerEmail);

                    // Send invite email
                    if (options.sendInviteEmails) {
                        await sendInviteEmail(customerEmail, newStudent.name, 'student', clubName);
                    }
                }
            }

            // 2. Check if coach exists (from metadata), if not create
            if (coachName && payment.metadata.coach_id && options.autoCreateCoaches) {
                const existingCoach = existingCoaches.find(
                    c => c.id === payment.metadata.coach_id || 
                         c.name.toLowerCase() === coachName.toLowerCase()
                );

                if (!existingCoach && !result.newCoaches.find(c => c.name.toLowerCase() === coachName.toLowerCase())) {
                    // Create new unclaimed coach
                    const newCoach: Coach = {
                        id: payment.metadata.coach_id || `coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: coachName,
                        email: '', // Unknown from payment data
                        clubId: clubId,
                        coachType: 'Club',
                        status: 'Unclaimed',
                        joinedDate: new Date(payment.created * 1000).toISOString()
                    };

                    result.newCoaches.push(newCoach);
                }
            }

            // 3. Create revenue entry
            const revenueEntry: RevenueEntry = {
                id: `rev_${payment.id}`,
                clubId: clubId,
                type: payment.metadata.class_type || 'Other',
                amount: payment.amount / 100, // Convert from cents
                date: new Date(payment.created * 1000).toISOString().split('T')[0],
                coachId: payment.metadata.coach_id,
                description: payment.description,
                studentLevel: undefined, // Could be derived from student if exists
                source: 'stripe' as any
            };

            result.newRevenue.push(revenueEntry);

        } catch (error) {
            result.errors.push(`Failed to process payment ${payment.id}: ${error}`);
        }
    }

    // Persist new data
    result.newStudents.forEach(student => {
        storageService.addStudent(student);
    });

    result.newCoaches.forEach(coach => {
        storageService.addCoach(coach);
    });

    result.newRevenue.forEach(revenue => {
        storageService.addRevenue(revenue);
    });

    return result;
};

/**
 * Simulates a Stripe webhook event for testing
 */
export const simulateStripeWebhook = async (
    clubId: string,
    clubName: string
): Promise<SyncResult> => {
    // Mock payment data that would come from Stripe
    const mockPayments: StripePayment[] = [
        {
            id: 'pi_mock_001',
            amount: 8000, // $80.00
            currency: 'usd',
            created: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
            customer: {
                id: 'cus_new1',
                email: 'john.smith.new@example.com',
                name: 'John Smith'
            },
            metadata: {
                coach_id: 'coach_mike',
                coach_name: 'Mike Thompson',
                class_type: 'Private Lesson',
                student_name: 'John Smith'
            },
            description: 'Private Lesson with Coach Mike',
            status: 'succeeded'
        },
        {
            id: 'pi_mock_002',
            amount: 35000, // $350.00
            currency: 'usd',
            created: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
            customer: {
                id: 'cus_new2',
                email: 'sarah.wilson.new@example.com',
                name: 'Sarah Wilson'
            },
            metadata: {
                coach_id: 'coach_sarah',
                coach_name: 'Sarah Chen',
                class_type: 'Camp',
                student_name: 'Sarah Wilson'
            },
            description: 'Junior Tennis Camp - Week 2',
            status: 'succeeded'
        },
        {
            id: 'pi_mock_003',
            amount: 4500, // $45.00
            currency: 'usd',
            created: Math.floor(Date.now() / 1000) - 1800, // 30 min ago
            customer: {
                id: 'cus_new3',
                email: 'emma.johnson.new@example.com',
                name: 'Emma Johnson'
            },
            metadata: {
                coach_id: 'coach_mike',
                coach_name: 'Mike Thompson',
                class_type: 'Group Class',
                student_name: 'Emma Johnson'
            },
            description: 'Tuesday Group Clinic 6pm',
            status: 'succeeded'
        }
    ];

    return processStripePayments(mockPayments, clubId, clubName, {
        autoCreateStudents: true,
        autoCreateCoaches: true,
        sendInviteEmails: true
    });
};

/**
 * Check for new accounts that need claiming
 */
export const getUnclaimedAccounts = (clubId: string): { students: Student[], coaches: Coach[] } => {
    const students = storageService.getStudents().filter(
        s => s.clubId === clubId && s.status === 'Unclaimed'
    );
    const coaches = storageService.getCoaches().filter(
        c => c.clubId === clubId && c.status === 'Unclaimed'
    );
    
    return { students, coaches };
};

/**
 * Resend invite email to unclaimed account
 */
export const resendInvite = async (
    type: 'student' | 'coach',
    id: string,
    clubName: string
): Promise<boolean> => {
    if (type === 'student') {
        const student = storageService.getStudents().find(s => s.id === id);
        if (student?.email) {
            await sendInviteEmail(student.email, student.name, 'student', clubName);
            return true;
        }
    } else {
        const coach = storageService.getCoaches().find(c => c.id === id);
        if (coach?.email) {
            await sendInviteEmail(coach.email, coach.name, 'coach', clubName);
            return true;
        }
    }
    return false;
};

export default {
    processStripePayments,
    simulateStripeWebhook,
    getUnclaimedAccounts,
    resendInvite
};
