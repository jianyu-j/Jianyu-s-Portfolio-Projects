import React, { useState, useEffect, useMemo } from 'react';
import { User, Coach, Student, Session, NtrpLevel, CoachRating, CoachType, RevenueEntry, ExpenseEntry, ClubSessionPeriod, ProcessorConnection, SyncEvent, PaymentProcessor } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { RadarVis } from '../Charts/RadarVis';
import { calculateCoachDashboardStats, getNtrpWeights, calculateProgressionDelivered, getPeerAverageScore } from '../../utils/calculations';
import { CoachStudentView } from '../CoachPortal/CoachStudentView';
import { AddCoachModal } from './AddCoachModal';
import CSVImportModal from './components/CSVImportModal';
import InsightsPanel from './components/InsightsPanel';
import RevenueAnalytics from './components/RevenueAnalytics';
import StudentAnalyticsPanel from './components/StudentAnalyticsPanel';
import CoachAnalyticsPanel from './components/CoachAnalyticsPanel';
import CoachConsistencyPanel from './components/CoachConsistencyPanel';
import CoachImpactPanel from './components/CoachImpactPanel';
import OperationalAnalytics from './components/OperationalAnalytics';
import ClubBallParkTab from './components/ClubBallParkTab';
import ClubEventsTab from './components/ClubEventsTab';
import ClubScheduleTab from './components/ClubScheduleTab';
import ConnectionsTab from '../Shared/ConnectionsTab';
// New Integration Components
import IntegrationsSettings from './components/IntegrationsSettings';
import SyncStatusWidget from './components/SyncStatusWidget';
import DataSourceIndicator from './components/DataSourceIndicator';
import ConnectionPromptBanner from './components/ConnectionPromptBanner';
import AIChatWidget from './components/AIChatWidget';
import ConnectionWizard from './components/ConnectionWizard';
import SyncLogModal from './components/SyncLogModal';
import ClubGettingStartedWizard from './components/ClubGettingStartedWizard';
import ActivityFeed from './components/ActivityFeed';
import CoachInvoiceSystem from './components/CoachInvoiceSystem';

// SVG Icon Components for professional UI
const UsersIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const RefreshIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StarIcon = ({ className = "w-5 h-5", filled = false }: { className?: string; filled?: boolean }) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ExclamationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ClipboardListIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const TrophyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

interface ClubViewProps {
    user: User;
    onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'COACHES' | 'STUDENTS' | 'SCHEDULE' | 'BALL_PARK' | 'CONNECTIONS' | 'EVENTS' | 'REPORTS' | 'REVENUE' | 'SETTINGS';

export const ClubView: React.FC<ClubViewProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
    
    // Data States
    const [students, setStudents] = useState<Student[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
    const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
    const [clubSessions, setClubSessions] = useState<ClubSessionPeriod[]>([]);
    
    // Selection States
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    
    // View Modal State
    const [viewingCoach, setViewingCoach] = useState<Coach | null>(null);
    const [viewingCoachRatings, setViewingCoachRatings] = useState<CoachRating[]>([]);

    // Modal States
    const [isAddCoachModalOpen, setIsAddCoachModalOpen] = useState(false);
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);

    // Filter States
    const [studentSearchQuery, setStudentSearchQuery] = useState('');

    // Integration States
    const [processorConnections, setProcessorConnections] = useState<ProcessorConnection[]>([]);
    const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
    const [showConnectionWizard, setShowConnectionWizard] = useState(false);
    const [wizardProcessor, setWizardProcessor] = useState<PaymentProcessor | null>(null);
    const [showSyncLog, setShowSyncLog] = useState(false);
    const [connectionPromptDismissed, setConnectionPromptDismissed] = useState(false);

    // Revenue Sub-Tab State
    type RevenueSubTab = 'analytics' | 'invoices' | 'integrations';
    const [revenueSubTab, setRevenueSubTab] = useState<RevenueSubTab>('analytics');

    // Onboarding Wizard State
    const [showOnboarding, setShowOnboarding] = useState(() => {
        // Check if onboarding has been completed
        const completed = localStorage.getItem(`koriq_onboarding_${user.linkedEntityId}`);
        return completed !== 'complete';
    });

    // Forms
    const [sessForm, setSessForm] = useState<Partial<ClubSessionPeriod>>({ startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });

    // Refresh Data
    useEffect(() => {
        setStudents(storageService.getStudents());
        setCoaches(storageService.getCoaches());
        setSessions(storageService.getSessions());
        setRevenue(storageService.getRevenue(user.linkedEntityId));
        setExpenses(storageService.getExpenses(user.linkedEntityId));
        setClubSessions(storageService.getClubSessions(user.linkedEntityId));
    }, [user.linkedEntityId, activeTab]);

    // --- ACTIONS ---
    const handleAddCoach = (data: { name: string; email: string; phone: string; coachType: CoachType }) => {
        const newCoach: Coach = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            coachType: data.coachType,
            clubId: user.linkedEntityId,
            status: 'Unclaimed',
            joinedDate: new Date().toISOString()
        };
        storageService.addCoach(newCoach);
        setCoaches(storageService.getCoaches()); 
    };

    const handleViewCoach = (coach: Coach) => {
        setViewingCoach(coach);
        setViewingCoachRatings(storageService.getRatings(coach.id));
    };

    const handleCSVImportComplete = (newStudents: Student[], newPayments: RevenueEntry[]) => {
        // Add new students
        newStudents.forEach(student => {
            storageService.addStudent(student);
        });
        
        // Add new revenue entries
        newPayments.forEach(payment => {
            storageService.addRevenue(payment);
        });
        
        // Refresh data
        setStudents(storageService.getStudents());
        setRevenue(storageService.getRevenue(user.linkedEntityId));
        
        // Show success (you could add a toast notification here)
        console.log(`Imported ${newStudents.length} new students and ${newPayments.length} payments`);
    };

    const handleSaveSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessForm.name || !sessForm.startDate || !sessForm.endDate) return;
        storageService.addClubSession({
            id: Date.now().toString(),
            clubId: user.linkedEntityId,
            name: sessForm.name,
            startDate: sessForm.startDate,
            endDate: sessForm.endDate,
            enrolledEmails: [] // Mock: would be populated by real enrollment logic
        });
        setClubSessions(storageService.getClubSessions(user.linkedEntityId));
        setIsAddSessionOpen(false);
        setSessForm({ startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] });
    };

    // --- DASHBOARD STATS ---
    const dashboardStats = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // 1. Total Students (YTD) - Basic count for now
        const totalStudents = students.length;

        // 2. New This Month
        const newThisMonth = students.filter(s => {
            const d = new Date(s.joinedDate || '2024-01-01');
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        // 3. Retention Rate (Mock based on Club Sessions)
        // Logic: Compare last two sessions email overlap
        let retentionRate = 78; // Default mock
        if (clubSessions.length >= 2) {
            const last = clubSessions[clubSessions.length - 1];
            const prev = clubSessions[clubSessions.length - 2];
            if (prev.enrolledEmails.length > 0) {
                const retained = last.enrolledEmails.filter(e => prev.enrolledEmails.includes(e)).length;
                retentionRate = Math.round((retained / prev.enrolledEmails.length) * 100);
            }
        }

        // 4. Sessions This Month
        const sessionsThisMonth = sessions.filter(s => {
            const d = new Date(s.date);
            return s.sessionType === 'CLUB' && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;

        // 5. Avg Coach Rating (Mock - hardcoded average of mock ratings)
        const avgRating = 4.6; 

        // 6. Coaches Count
        const coachesCount = coaches.length;

        return { totalStudents, newThisMonth, retentionRate, sessionsThisMonth, avgRating, coachesCount };
    }, [students, sessions, coaches, clubSessions]);

    // --- REVENUE STATS ---
    const revenueStats = useMemo(() => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const totalRevYTD = revenue.reduce((acc, curr) => new Date(curr.date).getFullYear() === thisYear ? acc + curr.amount : acc, 0);
        const totalExpYTD = expenses.reduce((acc, curr) => new Date(curr.date).getFullYear() === thisYear ? acc + curr.amount : acc, 0);
        
        const revThisMonth = revenue.reduce((acc, curr) => {
            const d = new Date(curr.date);
            return (d.getMonth() === thisMonth && d.getFullYear() === thisYear) ? acc + curr.amount : acc;
        }, 0);

        const expThisMonth = expenses.reduce((acc, curr) => {
            const d = new Date(curr.date);
            return (d.getMonth() === thisMonth && d.getFullYear() === thisYear) ? acc + curr.amount : acc;
        }, 0);

        const netProfit = totalRevYTD - totalExpYTD;
        const profitMargin = totalRevYTD > 0 ? ((netProfit / totalRevYTD) * 100).toFixed(1) : '0.0';
        const avgRevPerStudent = students.length > 0 ? Math.round(totalRevYTD / students.length) : 0;

        return { totalRevYTD, totalExpYTD, revThisMonth, expThisMonth, netProfit, profitMargin, avgRevPerStudent };
    }, [revenue, expenses, students]);

    // --- RENDERERS ---

    const renderDashboard = () => {
        // Level Distribution Data
        const levels: Record<string, number> = {};
        Object.values(NtrpLevel).forEach(l => levels[l] = 0);
        students.forEach(s => { if (levels[s.currentNtrp] !== undefined) levels[s.currentNtrp]++; });
        const levelData = Object.keys(levels).map(name => ({ name, count: levels[name] }));

        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">Club Overview</h2>
                
                {/* Insights & Alerts Panel */}
                <InsightsPanel
                    students={students}
                    coaches={coaches}
                    revenue={revenue}
                    sessions={sessions}
                    clubSessions={clubSessions}
                    onViewStudent={(student) => {
                        setSelectedStudent(student);
                        setActiveTab('STUDENTS');
                    }}
                    onViewCoach={(coach) => {
                        handleViewCoach(coach);
                    }}
                    onNavigateToTab={(tab) => setActiveTab(tab as Tab)}
                />

                {/* 6 Stats Cards - Clickable */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Students', val: dashboardStats.totalStudents, color: 'text-gray-900', tab: 'STUDENTS' as Tab, icon: <UsersIcon className="w-5 h-5" />, iconColor: 'text-gray-400' },
                        { label: 'New This Month', val: `+${dashboardStats.newThisMonth}`, color: 'text-green-600', tab: 'STUDENTS' as Tab, icon: <TrendingUpIcon className="w-5 h-5" />, iconColor: 'text-green-400' },
                        { label: 'Retention Rate', val: `${dashboardStats.retentionRate}%`, color: 'text-blue-600', tab: 'REPORTS' as Tab, icon: <RefreshIcon className="w-5 h-5" />, iconColor: 'text-blue-400' },
                        { label: 'Revenue (MTD)', val: `$${revenueStats.revThisMonth.toLocaleString()}`, color: 'text-green-700', tab: 'REVENUE' as Tab, icon: <CurrencyIcon className="w-5 h-5" />, iconColor: 'text-green-500' },
                        { label: 'Avg Coach Rating', val: dashboardStats.avgRating, color: 'text-yellow-600', tab: 'COACHES' as Tab, icon: <StarIcon className="w-5 h-5" filled />, iconColor: 'text-yellow-400' },
                        { label: 'Active Coaches', val: dashboardStats.coachesCount, color: 'text-purple-600', tab: 'COACHES' as Tab, icon: <AcademicCapIcon className="w-5 h-5" />, iconColor: 'text-purple-400' }
                    ].map((stat, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveTab(stat.tab)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-left hover:border-portal-club/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-gray-500 text-xs font-bold uppercase">{stat.label}</p>
                                <span className={`${stat.iconColor} opacity-60 group-hover:opacity-100 transition-opacity`}>{stat.icon}</span>
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Level Distribution */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Student Level Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={levelData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2e7d32" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Activity Feed (when connected) OR Top Coaches */}
                    {processorConnections.some(c => c.status === 'connected') ? (
                        <ActivityFeed
                            connections={processorConnections}
                            coaches={coaches}
                            onViewStudent={(name) => {
                                // Find student by name and navigate
                                const student = students.find(s => s.name === name);
                                if (student) {
                                    setSelectedStudent(student);
                                    setActiveTab('STUDENTS');
                                }
                            }}
                            onViewCoach={(coach) => handleViewCoach(coach)}
                        />
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Top Performing Coaches</h3>
                            <div className="space-y-3">
                                {coaches.slice(0, 3).map((coach, i) => (
                                    <button 
                                        key={coach.id} 
                                        onClick={() => handleViewCoach(coach)}
                                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-portal-club text-white flex items-center justify-center font-bold text-xs">
                                                {i + 1}
                                            </div>
                                            <p className="font-bold text-sm text-gray-800">{coach.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-portal-club text-sm flex items-center gap-1 justify-end">4.{9 - i} <StarIcon className="w-4 h-4 text-yellow-400" filled /></p>
                                            <p className="text-[10px] text-gray-400">{(20 - i*3)} ratings</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Connection Prompt (compact) for Dashboard */}
                {!processorConnections.some(c => c.status === 'connected') && !connectionPromptDismissed && (
                    <ConnectionPromptBanner
                        connections={processorConnections}
                        onConnect={() => {
                            setWizardProcessor('stripe');
                            setShowConnectionWizard(true);
                        }}
                        variant="compact"
                    />
                )}
            </div>
        );
    };

    const renderCoaches = () => {
        // Calculate coach metrics
        const getCoachMetrics = (coach: Coach) => {
            const coachStudents = students.filter(s => s.primaryCoachId === coach.id);
            const coachRevenue = revenue.filter(r => r.coachId === coach.id);
            const coachSessions = sessions.filter(s => s.coachId === coach.id);
            
            // Calculate earnings this month
            const now = new Date();
            const thisMonthRevenue = coachRevenue
                .filter(r => {
                    const d = new Date(r.date);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                })
                .reduce((sum, r) => sum + r.amount, 0);
            
            // Mock utilization (would be calculated from schedule vs booked sessions)
            const utilization = Math.floor(40 + Math.random() * 50);
            
            // Mock retention (would be calculated from student history)
            const retention = Math.floor(70 + Math.random() * 25);
            
            // Mock rating
            const rating = (4.2 + Math.random() * 0.7).toFixed(1);
            
            return {
                studentCount: coachStudents.length,
                earnings: thisMonthRevenue || Math.floor(1500 + Math.random() * 3500), // Mock if no data
                utilization,
                retention,
                rating,
                sessionsThisMonth: coachSessions.filter(s => {
                    const d = new Date(s.date);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length
            };
        };

        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Coaches</h2>
                    <Button onClick={() => setIsAddCoachModalOpen(true)}>+ Add Coach</Button>
                </div>

                {/* Coach Analytics Panel */}
                <CoachAnalyticsPanel 
                    coaches={coaches}
                    students={students}
                    revenue={revenue}
                    sessions={sessions}
                    onViewCoach={handleViewCoach}
                />

                {/* New: Coach Consistency & Impact Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CoachConsistencyPanel 
                        coaches={coaches}
                        sessions={sessions}
                        students={students}
                    />
                    <CoachImpactPanel 
                        coaches={coaches}
                        sessions={sessions}
                        students={students}
                    />
                </div>

                {/* Desktop View (Table) - Enhanced */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Coach</th>
                                <th className="p-4 text-center">Utilization</th>
                                <th className="p-4 text-center">Students</th>
                                <th className="p-4 text-right">Earnings (MTD)</th>
                                <th className="p-4 text-center">Retention</th>
                                <th className="p-4 text-center">Rating</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coaches.map(coach => {
                                const metrics = getCoachMetrics(coach);
                                return (
                                    <tr key={coach.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-portal-club/10 rounded-full flex items-center justify-center">
                                                    <span className="text-portal-club font-bold text-sm">
                                                        {coach.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{coach.name}</p>
                                                    <p className="text-xs text-gray-500">{coach.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            metrics.utilization >= 80 ? 'bg-green-500' :
                                                            metrics.utilization >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${metrics.utilization}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{metrics.utilization}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-gray-800">{metrics.studentCount}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-green-600">${metrics.earnings.toLocaleString()}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`font-bold ${
                                                metrics.retention >= 80 ? 'text-green-600' :
                                                metrics.retention >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {metrics.retention}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-gray-900 inline-flex items-center gap-1">{metrics.rating} <StarIcon className="w-4 h-4 text-yellow-400" filled /></span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleViewCoach(coach)}
                                                className="px-3 py-1.5 bg-portal-club/10 text-portal-club hover:bg-portal-club hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {coaches.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">No coaches found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet View (Cards) - Enhanced */}
                <div className="lg:hidden space-y-4">
                    {coaches.map(coach => {
                        const metrics = getCoachMetrics(coach);
                        return (
                            <div key={coach.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-portal-club/10 rounded-full flex items-center justify-center">
                                            <span className="text-portal-club font-bold">
                                                {coach.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{coach.name}</h3>
                                            <p className="text-sm text-gray-500">{coach.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleViewCoach(coach)}
                                        className="px-3 py-1.5 bg-portal-club/10 text-portal-club hover:bg-portal-club hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                                
                                {/* Utilization Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500 font-medium">Utilization</span>
                                        <span className="text-xs font-bold text-gray-700">{metrics.utilization}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                metrics.utilization >= 80 ? 'bg-green-500' :
                                                metrics.utilization >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${metrics.utilization}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-4 gap-2 text-center border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Students</p>
                                        <p className="font-bold text-gray-800">{metrics.studentCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Earnings</p>
                                        <p className="font-bold text-green-600">${metrics.earnings.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Retention</p>
                                        <p className={`font-bold ${metrics.retention >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {metrics.retention}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Rating</p>
                                        <p className="font-bold text-gray-800 flex items-center gap-1">{metrics.rating}<StarIcon className="w-4 h-4 text-yellow-400" filled /></p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {coaches.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-100">No coaches found.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderCoachDetailsModal = () => {
        if (!viewingCoach) return null;

        const coachSessions = sessions.filter(s => s.coachId === viewingCoach.id);
        const assignedStudents = students.filter(s => s.primaryCoachId === viewingCoach.id);
        const totalHours = Math.round(coachSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60);
        const avgRating = viewingCoachRatings.length > 0 
            ? (viewingCoachRatings.reduce((acc, r) => acc + r.rating, 0) / viewingCoachRatings.length).toFixed(1) 
            : 'N/A';
        
        const now = new Date();
        const sessionsThisMonth = coachSessions.filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        const sessionsThisYear = coachSessions.filter(s => new Date(s.date).getFullYear() === now.getFullYear()).length;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingCoach(null)}></div>
                <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden animate-slideDown max-h-[90vh] flex flex-col">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">COACH DETAILS: {viewingCoach.name}</h2>
                        <button onClick={() => setViewingCoach(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                    </div>

                    <div className="overflow-y-auto p-6 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { l: 'Students', v: assignedStudents.length },
                                { l: 'Sessions', v: coachSessions.length },
                                { l: 'Hours', v: totalHours },
                                { l: 'Avg Rating', v: avgRating },
                                { l: 'This Month', v: `${sessionsThisMonth} sessions` },
                                { l: 'This Year', v: `${sessionsThisYear} sessions` }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">{stat.l}</p>
                                    <p className="text-xl font-bold text-gray-800">{stat.v}</p>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Ratings */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">RATINGS & FEEDBACK</h3>
                            <div className="space-y-3">
                                {viewingCoachRatings.length > 0 ? viewingCoachRatings.map((r, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {Array(Math.round(r.rating)).fill(0).map((_, idx) => (
                                                        <span key={idx}><StarIcon className="w-4 h-4 text-yellow-400" filled /></span>
                                                    ))}
                                                </div>
                                                <span className="font-bold text-gray-800 text-sm">{r.rating.toFixed(1)}</span>
                                                <span className="text-gray-600 text-sm italic">"{r.comment}"</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
                                    </div>
                                )) : <p className="text-sm text-gray-400 italic">No ratings yet.</p>}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Assigned Students */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">ASSIGNED STUDENTS</h3>
                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">NTRP Level</th>
                                            <th className="p-3">Last Session</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {assignedStudents.map(s => {
                                            const lastSession = sessions
                                                .filter(sess => sess.studentId === s.id && sess.coachId === viewingCoach.id)
                                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                            return (
                                                <tr key={s.id}>
                                                    <td className="p-3 font-bold text-gray-800">{s.name}</td>
                                                    <td className="p-3">{s.currentNtrp}</td>
                                                    <td className="p-3 text-gray-500">{lastSession ? new Date(lastSession.date).toLocaleDateString() : 'None'}</td>
                                                </tr>
                                            );
                                        })}
                                        {assignedStudents.length === 0 && (
                                            <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No assigned students.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStudents = () => {
        if (selectedStudent) {
            return (
                <div className="animate-fadeIn">
                    <div className="mb-4">
                         <Button variant="ghost" onClick={() => setSelectedStudent(null)}>← Back to List</Button>
                    </div>
                    <CoachStudentView 
                        student={selectedStudent} 
                        onBack={() => setSelectedStudent(null)} 
                        onEvaluate={() => {}} 
                        viewMode="CLUB"
                    />
                </div>
            );
        }

        // Calculate student metrics
        const getStudentMetrics = (student: Student) => {
            const studentSessions = sessions.filter(s => s.studentId === student.id);
            const studentRevenue = revenue.filter(r => r.description?.includes(student.name) || r.studentLevel === student.currentNtrp);
            
            // Total spend (mock calculation)
            const totalSpend = studentRevenue.reduce((sum, r) => sum + r.amount, 0) || Math.floor(500 + Math.random() * 3000);
            
            // Last activity (mock - would be from session data)
            const lastSessionDate = studentSessions.length > 0 
                ? new Date(Math.max(...studentSessions.map(s => new Date(s.date).getTime())))
                : new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
            
            const daysSinceLastActivity = Math.floor((Date.now() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Risk indicator: green = active (0-7 days), yellow = at risk (8-21 days), red = inactive (22+ days)
            const risk: 'low' | 'medium' | 'high' = 
                daysSinceLastActivity <= 7 ? 'low' :
                daysSinceLastActivity <= 21 ? 'medium' : 'high';
            
            return {
                totalSpend,
                lastActivity: lastSessionDate,
                daysSinceLastActivity,
                risk,
                sessionsTotal: studentSessions.length || Math.floor(5 + Math.random() * 25)
            };
        };

        const filteredStudents = students.filter(s => 
            s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
        );

        // Sort by risk (high risk first)
        const sortedStudents = [...filteredStudents].sort((a, b) => {
            const riskA = getStudentMetrics(a).risk;
            const riskB = getStudentMetrics(b).risk;
            const riskOrder = { high: 0, medium: 1, low: 2 };
            return riskOrder[riskA] - riskOrder[riskB];
        });

        const formatLastActivity = (date: Date) => {
            const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (days === 0) return 'Today';
            if (days === 1) return 'Yesterday';
            if (days < 7) return `${days} days ago`;
            if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
            return `${Math.floor(days / 30)} months ago`;
        };

        const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
            switch (risk) {
                case 'low':
                    return <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-green-600 text-xs font-bold">Active</span></span>;
                case 'medium':
                    return <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span><span className="text-yellow-600 text-xs font-bold">At Risk</span></span>;
                case 'high':
                    return <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="text-red-600 text-xs font-bold">Inactive</span></span>;
            }
        };

        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Students</h2>
                    <div className="flex gap-3">
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            className="p-2 w-full md:w-64 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-portal-club"
                            value={studentSearchQuery}
                            onChange={(e) => setStudentSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Students', val: students.length, color: 'text-gray-900', icon: <UsersIcon className="w-6 h-6" />, iconColor: 'text-gray-400' },
                        { label: 'Active', val: students.filter(s => getStudentMetrics(s).risk === 'low').length, color: 'text-green-600', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>, iconColor: 'text-green-400' },
                        { label: 'At Risk', val: students.filter(s => getStudentMetrics(s).risk === 'medium').length, color: 'text-yellow-600', icon: <ExclamationIcon className="w-6 h-6" />, iconColor: 'text-yellow-400' },
                        { label: 'Inactive', val: students.filter(s => getStudentMetrics(s).risk === 'high').length, color: 'text-red-600', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, iconColor: 'text-red-400' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">{stat.label}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
                                </div>
                                <span className={`opacity-50 ${stat.iconColor}`}>{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Student Analytics Panel */}
                <StudentAnalyticsPanel 
                    students={students}
                    revenue={revenue}
                    sessions={sessions}
                    onViewStudent={(student) => setSelectedStudent(student)}
                />

                {/* Desktop View (Table) - Enhanced */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4 text-center">Level</th>
                                <th className="p-4">Coach</th>
                                <th className="p-4 text-right">Total Spend</th>
                                <th className="p-4 text-center">Last Activity</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedStudents.map(student => {
                                const coach = coaches.find(c => c.id === student.primaryCoachId);
                                const metrics = getStudentMetrics(student);
                                return (
                                    <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${metrics.risk === 'high' ? 'bg-red-50/30' : metrics.risk === 'medium' ? 'bg-yellow-50/30' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-portal-club/10 rounded-full flex items-center justify-center">
                                                    <span className="text-portal-club font-bold text-sm">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{student.name}</p>
                                                    <p className="text-xs text-gray-500">{student.age} yrs • Joined {new Date(student.joinedDate || '').toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-700">{student.currentNtrp}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{coach?.name || '-'}</td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-green-600">${metrics.totalSpend.toLocaleString()}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`text-sm ${metrics.daysSinceLastActivity > 21 ? 'text-red-600' : metrics.daysSinceLastActivity > 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                                {formatLastActivity(metrics.lastActivity)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {getRiskBadge(metrics.risk)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => setSelectedStudent(student)}
                                                className="px-3 py-1.5 bg-portal-club/10 text-portal-club hover:bg-portal-club hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                             {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet View (Cards) - Enhanced */}
                <div className="lg:hidden space-y-4">
                    {sortedStudents.map(student => {
                        const coach = coaches.find(c => c.id === student.primaryCoachId);
                        const metrics = getStudentMetrics(student);
                        return (
                            <div key={student.id} className={`bg-white rounded-xl p-5 shadow-sm border ${
                                metrics.risk === 'high' ? 'border-red-200 bg-red-50/30' : 
                                metrics.risk === 'medium' ? 'border-yellow-200 bg-yellow-50/30' : 
                                'border-gray-100'
                            }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-portal-club/10 rounded-full flex items-center justify-center">
                                            <span className="text-portal-club font-bold">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{student.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold text-gray-700">{student.currentNtrp}</span>
                                                {getRiskBadge(metrics.risk)}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedStudent(student)}
                                        className="px-3 py-1.5 bg-portal-club/10 text-portal-club hover:bg-portal-club hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Total Spend</p>
                                        <p className="font-bold text-green-600">${metrics.totalSpend.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Last Active</p>
                                        <p className={`font-bold ${metrics.daysSinceLastActivity > 21 ? 'text-red-600' : metrics.daysSinceLastActivity > 7 ? 'text-yellow-600' : 'text-gray-800'}`}>
                                            {formatLastActivity(metrics.lastActivity)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Coach</p>
                                        <p className="font-bold text-gray-800 truncate">{coach?.name?.split(' ')[0] || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                     {filteredStudents.length === 0 && (
                        <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-100">No students found.</div>
                    )}
                </div>
            </div>
        );
    };

    const renderReports = () => {
        // Mock Data for Reports
        const sessionVolumeData = [
            { name: 'Jan', val: 120 }, { name: 'Feb', val: 135 }, { name: 'Mar', val: 160 },
            { name: 'Apr', val: 140 }, { name: 'May', val: 155 }, { name: 'Jun', val: 180 },
            { name: 'Jul', val: 170 }, { name: 'Aug', val: 165 }, { name: 'Sep', val: 150 },
            { name: 'Oct', val: 145 }, { name: 'Nov', val: 130 }, { name: 'Dec', val: 125 }
        ];

        const retentionData = [
            { name: 'S1→S2', rate: 75 }, { name: 'S2→S3', rate: 82 }, 
            { name: 'S3→S4', rate: 78 }, { name: 'S4→S5', rate: 85 }
        ];

        const coachPerfData = [
            { name: 'Jan', Mike: 4.5, Sarah: 4.2 }, { name: 'Feb', Mike: 4.6, Sarah: 4.3 },
            { name: 'Mar', Mike: 4.7, Sarah: 4.4 }, { name: 'Apr', Mike: 4.7, Sarah: 4.5 },
            { name: 'May', Mike: 4.8, Sarah: 4.6 }, { name: 'Jun', Mike: 4.8, Sarah: 4.7 }
        ];

        // Optimization insights data - derived from coaches and revenue data
        const coachMetrics = coaches.map(coach => {
            const coachRevenue = revenue.filter(r => r.coachId === coach.id);
            const privateRevenue = coachRevenue.filter(r => r.type === 'Private Lesson').reduce((s, r) => s + r.amount, 0);
            const groupRevenue = coachRevenue.filter(r => r.type === 'Group Class').reduce((s, r) => s + r.amount, 0);
            const coachStudents = students.filter(s => s.primaryCoachId === coach.id);
            const utilization = Math.floor(40 + Math.random() * 50); // Mock
            const retention = Math.floor(70 + Math.random() * 25); // Mock
            return {
                coach,
                privateRevenue,
                groupRevenue,
                totalRevenue: privateRevenue + groupRevenue,
                studentCount: coachStudents.length,
                utilization,
                retention
            };
        });

        // Calculate revenue per hour by class type
        const revenuePerHourByType = {
            private: 85,
            group: 45,
            camp: 135 // Higher due to multi-student sessions
        };

        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
                </div>

                {/* Optimization Insights Section */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                            <LightBulbIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Optimization Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Coach Retention Insight */}
                        {coachMetrics.length > 0 && (() => {
                            const bestRetention = [...coachMetrics].sort((a, b) => b.retention - a.retention)[0];
                            const avgRetention = coachMetrics.reduce((s, c) => s + c.retention, 0) / coachMetrics.length;
                            return (
                                <div className="bg-white rounded-lg p-4 border border-amber-100 flex items-start gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <AcademicCapIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">
                                            {bestRetention.coach.name}'s private lessons have {bestRetention.retention}% retention vs {Math.round(avgRetention)}% average
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Consider having {bestRetention.coach.name.split(' ')[0]} mentor other coaches on their approach. 
                                            This could improve overall retention by 8-12%.
                                        </p>
                                        <button 
                                            onClick={() => handleViewCoach(bestRetention.coach)}
                                            className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                        >
                                            View Coach Details →
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Revenue per Hour Insight */}
                        <div className="bg-white rounded-lg p-4 border border-amber-100 flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-800">
                                    Junior Camps show 3x revenue per hour (${revenuePerHourByType.camp}/hr) vs adult group classes (${revenuePerHourByType.group}/hr)
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Expanding camp offerings during school breaks could add $2,400+/week in revenue. 
                                    Consider adding spring break and winter camps.
                                </p>
                                <button 
                                    onClick={() => setActiveTab('REVENUE')}
                                    className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    View Revenue Breakdown →
                                </button>
                            </div>
                        </div>

                        {/* Underutilized Coach Alert */}
                        {coachMetrics.length > 0 && (() => {
                            const underutilizedCoaches = coachMetrics.filter(c => c.utilization < 50);
                            if (underutilizedCoaches.length === 0) return null;
                            const worstCoach = underutilizedCoaches.sort((a, b) => a.utilization - b.utilization)[0];
                            return (
                                <div className="bg-white rounded-lg p-4 border border-amber-100 flex items-start gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <ExclamationIcon className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">
                                            {worstCoach.coach.name} at {worstCoach.utilization}% utilization - review schedule
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Low utilization may indicate scheduling conflicts or need for promotion. 
                                            Consider adjusting hours or running targeted promotions for their time slots.
                                        </p>
                                        <button 
                                            onClick={() => handleViewCoach(worstCoach.coach)}
                                            className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                                        >
                                            Review Coach Schedule →
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Peak Time Optimization */}
                        <div className="bg-white rounded-lg p-4 border border-amber-100 flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-600 text-lg">⏰</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-800">
                                    Tuesday & Wednesday 2-4pm slots are 65% empty - $1,200/week opportunity
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Target work-from-home professionals and retirees with "Off-Peak Specials". 
                                    15% discount could fill these slots and add $800+/week net revenue.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Analytics Panel */}
                <OperationalAnalytics 
                    students={students}
                    coaches={coaches}
                    sessions={sessions}
                    revenue={revenue}
                    expenses={expenses}
                />

                {/* Report 1: Session Volume */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Session Volume</h3>
                        <div className="flex gap-2">
                            <select className="text-xs bg-white text-gray-900 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"><option>2025</option></select>
                            <select className="text-xs bg-white text-gray-900 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Monthly</option></select>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sessionVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="val" fill="#3aa54e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Report 2: Student Retention */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Student Retention</h3>
                        <Button onClick={() => setIsAddSessionOpen(true)} className="text-xs py-1">+ Add Session</Button>
                    </div>

                    {/* Manage Sessions Table */}
                    <div className="mb-8 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                <tr><th className="p-3">Session Name</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Students</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clubSessions.map(cs => (
                                    <tr key={cs.id}>
                                        <td className="p-3 font-bold">{cs.name}</td>
                                        <td className="p-3">{cs.startDate}</td>
                                        <td className="p-3">{cs.endDate}</td>
                                        <td className="p-3">{cs.enrolledEmails.length || '--'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Retention Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[{l:'Retention',v:'78%'}, {l:'Same Level',v:'52%'}, {l:'Level Up',v:'26%'}, {l:'Churned',v:'22%'}].map((m,i)=>(
                            <div key={i} className="bg-gray-50 p-3 rounded-lg text-center">
                                <p className="text-[10px] text-gray-500 uppercase">{m.l}</p>
                                <p className="text-xl font-bold text-gray-800">{m.v}</p>
                            </div>
                        ))}
                    </div>

                    {/* Retention Chart */}
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={retentionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={2} dot={{r:4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Report 3: Coach Performance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Coach Performance Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={coachPerfData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis domain={[3, 5]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Mike" stroke="#2e7d32" strokeWidth={2} />
                                <Line type="monotone" dataKey="Sarah" stroke="#f59e0b" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    };

    const renderRevenue = () => {
        // Aggregate Data for Charts
        const revenueTrendData = [
            { name: 'Jan', rev: 15000, exp: 13000 }, { name: 'Feb', rev: 16500, exp: 12500 },
            { name: 'Mar', rev: 18000, exp: 14000 }, { name: 'Apr', rev: 17500, exp: 13500 },
            { name: 'May', rev: 19000, exp: 14500 }, { name: 'Jun', rev: 21000, exp: 15000 }
        ];

        const revByCoachData = coaches.map(c => ({
            name: c.name,
            value: revenue.filter(r => r.coachId === c.id).reduce((sum, r) => sum + r.amount, 0)
        })).filter(d => d.value > 0);

        const revByTypeData = [
            { name: 'Group Class', value: revenue.filter(r => r.type === 'Group Class').reduce((sum, r) => sum + r.amount, 0) },
            { name: 'Private', value: revenue.filter(r => r.type === 'Private Lesson').reduce((sum, r) => sum + r.amount, 0) },
            { name: 'Camp', value: revenue.filter(r => r.type === 'Camp').reduce((sum, r) => sum + r.amount, 0) },
            { name: 'Other', value: revenue.filter(r => r.type === 'Other').reduce((sum, r) => sum + r.amount, 0) }
        ].filter(d => d.value > 0);

        const expensesData = [
            { name: 'Payroll', value: expenses.filter(e => e.category === 'Payroll').reduce((sum, e) => sum + e.amount, 0) },
            { name: 'Rent', value: expenses.filter(e => e.category === 'Rent').reduce((sum, e) => sum + e.amount, 0) },
            { name: 'Equipment', value: expenses.filter(e => e.category === 'Equipment').reduce((sum, e) => sum + e.amount, 0) },
            { name: 'Other', value: expenses.filter(e => ['Marketing', 'Insurance', 'Other'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0) },
        ].filter(d => d.value > 0);

        const COLORS = ['#2e7d32', '#f59e0b', '#2563eb', '#9333ea', '#ef4444'];
        const hasConnection = processorConnections.some(c => c.status === 'connected');

        const revenueSubTabConfig = [
            { id: 'analytics' as RevenueSubTab, label: 'Analytics', icon: <ChartBarIcon className="w-4 h-4" /> },
            { id: 'invoices' as RevenueSubTab, label: 'Coach Invoices', icon: <ClipboardListIcon className="w-4 h-4" /> },
            { id: 'integrations' as RevenueSubTab, label: 'Integrations', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
        ];

        return (
            <div className="space-y-6 animate-fadeIn">
                {/* Header with Sub-tabs */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Revenue & Financials</h2>
                        {hasConnection && (
                            <DataSourceIndicator 
                                connections={processorConnections} 
                                lastUpdated={processorConnections.find(c => c.status === 'connected')?.lastSyncAt}
                            />
                        )}
                    </div>
                    {!hasConnection && (
                        <Button 
                            onClick={() => {
                                setWizardProcessor('stripe');
                                setShowConnectionWizard(true);
                            }}
                            className="bg-portal-club hover:bg-portal-club/90"
                        >
                            Connect Payment Processor
                        </Button>
                    )}
                </div>

                {/* Revenue Sub-tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-0">
                    {revenueSubTabConfig.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setRevenueSubTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                                revenueSubTab === tab.id
                                    ? 'border-portal-club text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Analytics Sub-tab */}
                {revenueSubTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Connection Prompt Banner */}
                        {!hasConnection && !connectionPromptDismissed && (
                            <ConnectionPromptBanner
                                connections={processorConnections}
                                onConnect={() => {
                                    setWizardProcessor('stripe');
                                    setShowConnectionWizard(true);
                                }}
                                onDismiss={() => setConnectionPromptDismissed(true)}
                            />
                        )}

                        {/* Revenue Intelligence & Analytics */}
                        <RevenueAnalytics 
                            students={students}
                            coaches={coaches}
                            revenue={revenue}
                            sessions={sessions}
                            expenses={expenses}
                        />

                        {/* Section 1: Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { l: 'Total Revenue (YTD)', v: `$${revenueStats.totalRevYTD.toLocaleString()}`, c: 'text-green-700' },
                                { l: 'Rev This Month', v: `$${revenueStats.revThisMonth.toLocaleString()}`, c: 'text-green-600' },
                                { l: 'Avg Rev/Student', v: `$${revenueStats.avgRevPerStudent}`, c: 'text-gray-800' },
                                { l: 'YoY Growth', v: '+15.6%', c: 'text-blue-600' },
                                { l: 'Total Expenses (YTD)', v: `$${revenueStats.totalExpYTD.toLocaleString()}`, c: 'text-red-700' },
                                { l: 'Exp This Month', v: `$${revenueStats.expThisMonth.toLocaleString()}`, c: 'text-red-600' },
                                { l: 'Net Profit (YTD)', v: `$${revenueStats.netProfit.toLocaleString()}`, c: 'text-gray-900' },
                                { l: 'Profit Margin', v: `${revenueStats.profitMargin}%`, c: 'text-purple-600' },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{card.l}</p>
                                    <p className={`text-2xl font-bold ${card.c}`}>{card.v}</p>
                                </div>
                            ))}
                        </div>

                        {/* Section 2: Revenue Trend */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-6">Revenue Trend</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{fontSize: 10}} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="rev" name="Revenue" stroke="#2e7d32" strokeWidth={2} />
                                        <Line type="monotone" dataKey="exp" name="Expenses" stroke="#ef4444" strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section 3: Revenue by Coach */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Revenue by Coach</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revByCoachData} layout="vertical" margin={{ left: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#2e7d32" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Section 4: Revenue by Type */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Revenue by Class Type</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={revByTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {revByTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section 7: Expenses Breakdown */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Expenses Breakdown</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={expensesData} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10}} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Section 9: Forecast */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6">Revenue Forecast (Projected)</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[...revenueTrendData, {name:'Jul', rev:22000}, {name:'Aug', rev:23500}, {name:'Sep', rev:21000}]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fontSize: 10}} />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="rev" stroke="#2e7d32" fill="#dcfce7" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coach Invoices Sub-tab */}
                {revenueSubTab === 'invoices' && (
                    <CoachInvoiceSystem
                        clubId={user.linkedEntityId}
                        coaches={coaches}
                    />
                )}

                {/* Integrations Sub-tab */}
                {revenueSubTab === 'integrations' && (
                    <IntegrationsSettings
                        clubId={user.linkedEntityId}
                        connections={processorConnections}
                        syncEvents={syncEvents}
                        onConnectionChange={setProcessorConnections}
                    />
                )}

            </div>
        );
    };

    // Tab configuration with icons
    // Tab order: Dashboard, Reports, Revenue, Coaches, Students, Events, Ball Park, Connections, Settings
    const tabConfig = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'REPORTS', label: 'Reports', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )},
        { id: 'REVENUE', label: 'Revenue', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { id: 'COACHES', label: 'Coaches', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )},
        { id: 'STUDENTS', label: 'Students', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )},
        { id: 'SCHEDULE', label: 'Schedule', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )},
        { id: 'EVENTS', label: 'Events', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )},
        { id: 'BALL_PARK', label: 'Ball Park', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        )},
        { id: 'CONNECTIONS', label: 'Connections', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )},
        { id: 'SETTINGS', label: 'Settings', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
    ];

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-white">
            {/* Header with Horizontal Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-portal-club rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Vancouver Tennis Club</h1>
                                <p className="text-xs text-portal-club font-medium">Club Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Help / Getting Started Button */}
                            <button 
                                onClick={() => setShowOnboarding(true)}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                                title="Getting Started Guide"
                            >
                                <svg className="w-6 h-6 text-gray-600 group-hover:text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            {/* Notification Bell */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs with underline style - horizontal scrollable */}
                    <div className="flex gap-1 mt-4 overflow-x-auto border-b border-gray-200 -mb-px scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {tabConfig.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id as Tab); setSelectedCoach(null); setSelectedStudent(null); }}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'border-portal-club text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-portal-club' : 'text-gray-400'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'COACHES' && renderCoaches()}
                {activeTab === 'STUDENTS' && renderStudents()}
                {activeTab === 'BALL_PARK' && (
                    <ClubBallParkTab clubId={user.linkedEntityId} clubName="Vancouver Tennis Club" />
                )}
                {activeTab === 'CONNECTIONS' && (
                    <ConnectionsTab
                        portalType="club"
                        currentUserId={user.linkedEntityId}
                        currentUserName="Vancouver Tennis Club"
                    />
                )}
                {activeTab === 'SCHEDULE' && (
                    <ClubScheduleTab clubId={user.linkedEntityId} clubName="Vancouver Tennis Club" />
                )}
                {activeTab === 'EVENTS' && (
                    <ClubEventsTab clubId={user.linkedEntityId} clubName="Vancouver Tennis Club" />
                )}
                {activeTab === 'REPORTS' && renderReports()}
                {activeTab === 'REVENUE' && renderRevenue()}
                {activeTab === 'SETTINGS' && (
                    <IntegrationsSettings
                        clubId={user.linkedEntityId}
                        connections={processorConnections}
                        syncEvents={syncEvents}
                        onConnectionChange={setProcessorConnections}
                    />
                )}
            </div>

            {/* --- MODALS --- */}
            
            {renderCoachDetailsModal()}


            {/* Add Session Modal */}
            {isAddSessionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Add New Session</h3>
                            <button onClick={() => setIsAddSessionOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSaveSession} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Session Name</label>
                                <input type="text" required placeholder="e.g. Spring 2025" className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={sessForm.name || ''} onChange={e => setSessForm({...sessForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Start Date</label>
                                <input type="date" required className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={sessForm.startDate} onChange={e => setSessForm({...sessForm, startDate: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">End Date</label>
                                <input type="date" required className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" value={sessForm.endDate} onChange={e => setSessForm({...sessForm, endDate: e.target.value})} />
                            </div>
                            <Button fullWidth type="submit">Create Session</Button>
                        </form>
                    </div>
                </div>
            )}

            <AddCoachModal 
                isOpen={isAddCoachModalOpen}
                onClose={() => setIsAddCoachModalOpen(false)}
                onSave={handleAddCoach}
            />

            <CSVImportModal
                isOpen={isCSVImportOpen}
                onClose={() => setIsCSVImportOpen(false)}
                clubId={user.linkedEntityId}
                existingStudents={students}
                onImportComplete={handleCSVImportComplete}
            />

            {/* Connection Wizard Modal */}
            {showConnectionWizard && wizardProcessor && (
                <ConnectionWizard
                    processor={wizardProcessor}
                    clubId={user.linkedEntityId}
                    onComplete={(newConnection) => {
                        setProcessorConnections(prev => [...prev.filter(c => c.processor !== newConnection.processor), newConnection]);
                        setShowConnectionWizard(false);
                        setWizardProcessor(null);
                    }}
                    onClose={() => {
                        setShowConnectionWizard(false);
                        setWizardProcessor(null);
                    }}
                />
            )}

            {/* Sync Log Modal */}
            {showSyncLog && (
                <SyncLogModal
                    processor={processorConnections.find(c => c.status === 'connected')?.processor || 'stripe'}
                    events={syncEvents}
                    connection={processorConnections.find(c => c.status === 'connected')}
                    onClose={() => setShowSyncLog(false)}
                />
            )}

            {/* AI Chat Widget - Floating */}
            <AIChatWidget
                clubId={user.linkedEntityId}
                clubName="Vancouver Tennis Club"
                coaches={coaches}
                onNavigateToTab={(tab) => setActiveTab(tab as Tab)}
            />

            {/* Getting Started Wizard */}
            {showOnboarding && (
                <ClubGettingStartedWizard
                    clubId={user.linkedEntityId}
                    clubName="Vancouver Tennis Club"
                    coaches={coaches}
                    students={students}
                    onComplete={() => setShowOnboarding(false)}
                    onConnectPayment={(processor) => {
                        setWizardProcessor(processor);
                        setShowConnectionWizard(true);
                    }}
                    onAddCoach={() => setIsAddCoachModalOpen(true)}
                    onImportCSV={() => setIsCSVImportOpen(true)}
                    onNavigateToTab={(tab) => {
                        setActiveTab(tab as Tab);
                        setShowOnboarding(false);
                    }}
                />
            )}
            
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};