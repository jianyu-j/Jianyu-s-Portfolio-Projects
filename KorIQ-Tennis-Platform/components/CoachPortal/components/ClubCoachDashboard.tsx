import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Coach, Student, Session, Club, CoachRating, NtrpLevel, Notification } from '../../../types';
import { storageService } from '../../../services/storageService';
import { calculateCoachDashboardStats } from '../../../utils/calculations';
import { Button } from '../../ui/Button';
import { AddEvaluation } from '../AddEvaluation';
import { CoachStudentView } from '../CoachStudentView';
import ClubCoachBallParkTab from './ClubCoachBallParkTab';
import ClubEventsViewTab from '../../Shared/ClubEventsViewTab';
import CoachMessaging from './CoachMessaging';
import CoachScheduleTab from './CoachScheduleTab';
import NotificationBell from '../../Notifications/NotificationBell';

interface ClubCoachDashboardProps {
    coach: Coach;
    ratings: CoachRating[];
    onLogout: () => void;
}

type Tab = 'OVERVIEW' | 'STUDENTS' | 'BALL_PARK' | 'EVENTS' | 'SCHEDULE' | 'MESSAGES' | 'SETTINGS';

const ClubCoachDashboard: React.FC<ClubCoachDashboardProps> = ({ coach, ratings, onLogout }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
    const [view, setView] = useState<'dashboard' | 'profile' | 'evaluate'>('dashboard');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [club, setClub] = useState<Club | null>(null);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', age: '', ntrp: NtrpLevel.L10_15 });
    const [addError, setAddError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', userId: coach.id, type: 'booking_request', title: 'New Booking Request', message: 'Emma Wilson wants to book a lesson', isRead: false, createdAt: new Date().toISOString() },
        { id: '2', userId: coach.id, type: 'message', title: 'New Message', message: 'Club Admin: Staff meeting Friday', isRead: false, createdAt: new Date().toISOString() },
    ]);

    const handleMarkNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkNotificationRead(notification.id);
        if (notification.type === 'booking_request') setActiveTab('SCHEDULE');
        else if (notification.type === 'message') setActiveTab('MESSAGES');
    };

    const refreshData = useCallback(() => {
        // Filter students by club
        const allStudents = storageService.getStudents();
        const clubStudents = coach.clubId 
            ? allStudents.filter(s => s.clubId === coach.clubId)
            : allStudents;
        setStudents(clubStudents);
        setSessions(storageService.getSessions());
        if (coach?.clubId) {
            setClub(storageService.getClubs().find(c => c.id === coach.clubId) || null);
        }
    }, [coach?.clubId]);

    useEffect(() => {
        refreshData();
    }, [view, refreshData]);

    const stats = useMemo(() => calculateCoachDashboardStats(students, sessions, coach.id), [students, sessions, coach.id]);

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        setAddError('');
        const existingStudent = storageService.findStudentByEmail(newStudent.email);
        if (existingStudent) {
            setAddError('⚠️ This student already exists in the system. Use the search bar to find and select this student.');
            return;
        }
        const s: Student = {
            id: Date.now().toString(),
            name: newStudent.name,
            email: newStudent.email,
            age: parseInt(newStudent.age),
            currentNtrp: newStudent.ntrp,
            status: 'Unclaimed',
            clubId: coach.clubId, // Associate with club
            primaryCoachId: coach.id,
        };
        storageService.addStudent(s);
        refreshData();
        setIsAddingStudent(false);
        setNewStudent({ name: '', email: '', age: '', ntrp: NtrpLevel.L10_15 });
        alert(`Student profile created! Status: Unclaimed. An email has been sent to ${newStudent.email} to claim their profile.`);
    };

    const handleStudentClick = (s: Student) => {
        setSelectedStudent(s);
        setView('profile');
    };

    const avgRating = ratings.length > 0 ? (ratings.reduce((a,b) => a + b.rating, 0) / ratings.length).toFixed(1) : "N/A";

    // Filter students by search
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { id: 'OVERVIEW', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'STUDENTS', label: 'My Students', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ), badge: students.length },
        { id: 'BALL_PARK', label: 'Ball Park', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        )},
        { id: 'EVENTS', label: 'Events', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )},
        { id: 'SCHEDULE', label: 'Schedule', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )},
        { id: 'MESSAGES', label: 'Messages', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )},
        { id: 'SETTINGS', label: 'Settings', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
    ];

    // Handle evaluation flow
    if (view === 'evaluate' && selectedStudent) {
        return (
            <div className="w-full md:max-w-3xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
                <Button variant="ghost" onClick={() => setView('profile')} className="mb-4">← Cancel Evaluation</Button>
                <h2 className="text-xl font-bold mb-4">New Evaluation for {selectedStudent.name}</h2>
                <AddEvaluation student={selectedStudent} onComplete={() => setView('profile')} />
            </div>
        );
    }

    // Handle student profile view
    if (view === 'profile' && selectedStudent) {
        const currentStudent = students.find(s => s.id === selectedStudent.id) || selectedStudent;
        const viewMode = 'CLUB_COACH';
        return (
            <div className="w-full md:max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
                <CoachStudentView student={currentStudent} onBack={() => setView('dashboard')} onEvaluate={() => setView('evaluate')} viewMode={viewMode} />
            </div>
        );
    }

    // Handle add student form
    if (isAddingStudent) {
        return (
            <div className="max-w-md mx-auto p-4 min-h-screen bg-gray-50 flex flex-col justify-center">
                 <h2 className="text-xl font-bold mb-6 text-center">Add New Student</h2>
                 <form onSubmit={handleAddStudent} className="space-y-4 bg-white p-6 rounded-xl shadow-sm relative">
                    <button type="button" onClick={() => setIsAddingStudent(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                    <div><label className="block text-sm font-bold text-gray-700">Student Email *</label><input required type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full p-3 bg-white text-gray-900 border rounded-lg mt-1 placeholder-gray-400" placeholder="student@email.com" /></div>
                    {addError && <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm mb-4">{addError}<button type="button" onClick={() => setIsAddingStudent(false)} className="block mt-2 font-bold text-portal-coach hover:underline">Search Instead</button></div>}
                    {!addError && (<><div><label className="block text-sm font-bold text-gray-700">Full Name *</label><input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-3 bg-white text-gray-900 border rounded-lg mt-1 placeholder-gray-400" /></div><div><label className="block text-sm font-bold text-gray-700">Age *</label><input required type="number" value={newStudent.age} onChange={e => setNewStudent({...newStudent, age: e.target.value})} className="w-full p-3 bg-white text-gray-900 border rounded-lg mt-1 placeholder-gray-400" /></div><div><label className="block text-sm font-bold text-gray-700">Initial NTRP *</label><select value={newStudent.ntrp} onChange={e => setNewStudent({...newStudent, ntrp: e.target.value as NtrpLevel})} className="w-full p-3 bg-white text-gray-900 border rounded-lg mt-1">{Object.values(NtrpLevel).map(l => <option key={l} value={l}>{l}</option>)}</select></div><div className="flex gap-2 pt-4"><Button type="button" variant="secondary" onClick={() => setIsAddingStudent(false)} fullWidth>Cancel</Button><Button type="submit" fullWidth>Add Student</Button></div></>)}
                 </form>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Club Badge */}
            {club && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-portal-coach" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{club.name}</h4>
                            <p className="text-sm text-gray-600">Club Coach</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Hours</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button 
                        onClick={() => setActiveTab('STUDENTS')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Add Student</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('BALL_PARK')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Ball Park</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('EVENTS')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Events</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('MESSAGES')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Messages</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Recent Students</h3>
                        <button 
                            onClick={() => setActiveTab('STUDENTS')}
                            className="text-portal-coach text-xs font-semibold hover:underline"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {students.slice(0, 3).map(student => (
                            <div 
                                key={student.id} 
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleStudentClick(student)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{student.name}</h4>
                                        <p className="text-xs text-gray-500">NTRP {student.currentNtrp}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                        student.status === 'Claimed' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && (
                            <div className="p-6 text-center text-gray-400">
                                <p className="text-sm">No students yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Recent Feedback</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {ratings.length > 0 ? ratings.slice(0, 3).map((rating, i) => (
                            <div key={i} className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400 text-sm">
                                        {'⭐'.repeat(rating.rating)}
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(rating.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-700 italic">"{rating.comment}"</p>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-gray-400">
                                <p className="text-2xl mb-2">⭐</p>
                                <p className="text-sm">No feedback yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="space-y-4">
            {/* Search & Add */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-portal-coach outline-none placeholder-gray-400" 
                    />
                </div>
                <button 
                    onClick={() => setIsAddingStudent(true)}
                    className="px-4 py-2 bg-portal-coach text-white font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </button>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map(student => (
                    <div 
                        key={student.id} 
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-portal-coach flex justify-between items-center cursor-pointer hover:shadow-md transition-all" 
                        onClick={() => handleStudentClick(student)}
                    >
                        <div>
                            <h4 className="font-bold text-gray-800">{student.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-portal-coach font-medium">NTRP {student.currentNtrp} • Age {student.age}</span>
                            </div>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mt-2 ${
                                student.status === 'Unclaimed' 
                                    ? 'bg-yellow-100 text-yellow-700' 
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {student.status === 'Unclaimed' ? '⏳ Unclaimed' : '✅ Claimed'}
                            </span>
                        </div>
                        <div className="bg-green-50 text-portal-coach p-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                        {searchTerm ? 'No students found' : 'No students yet'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {searchTerm ? 'Try a different search term' : 'Add your first student to get started'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setIsAddingStudent(true)}
                            className="px-4 py-2 bg-portal-coach text-white font-semibold rounded-lg"
                        >
                            Add Student
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                            type="text" 
                            value={coach.name} 
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={coach.email} 
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
                        <input 
                            type="text" 
                            value={club?.name || 'N/A'} 
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                    {['New booking requests', 'Messages from students', 'Club announcements', 'Event reminders'].map((item, i) => (
                        <label key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <span className="text-sm text-gray-700">{item}</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-portal-coach rounded" />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-portal-coach rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {coach.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{coach.name}</h1>
                                <p className="text-xs text-portal-coach font-medium">{club?.name || 'Club Coach'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationBell
                                notifications={notifications}
                                onMarkAsRead={handleMarkNotificationRead}
                                onMarkAllRead={handleMarkAllNotificationsRead}
                                onNotificationClick={handleNotificationClick}
                                accentColor="bg-portal-coach"
                            />
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Tabs with underline style */}
                    <div className="flex gap-1 mt-4 overflow-x-auto border-b border-gray-200 -mb-px scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'border-portal-coach text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-portal-coach' : 'text-gray-400'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {tab.badge && tab.badge > 0 && (
                                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-portal-coach text-white">
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === 'OVERVIEW' && renderOverview()}
                {activeTab === 'STUDENTS' && renderStudents()}
                {activeTab === 'BALL_PARK' && coach.clubId && club && (
                    <ClubCoachBallParkTab 
                        coachId={coach.id} 
                        coachName={coach.name}
                        clubId={coach.clubId}
                        clubName={club.name}
                    />
                )}
                {activeTab === 'EVENTS' && coach.clubId && club && (
                    <ClubEventsViewTab 
                        clubId={coach.clubId}
                        clubName={club.name}
                        userType="coach"
                        userName={coach.name}
                    />
                )}
                {activeTab === 'SCHEDULE' && (
                    <CoachScheduleTab 
                        coachId={coach.id}
                        coachName={coach.name}
                        clubName={club?.name || 'Club'}
                    />
                )}
                {activeTab === 'MESSAGES' && <CoachMessaging coach={coach} />}
                {activeTab === 'SETTINGS' && renderSettings()}
            </div>
        </div>
    );
};

export default ClubCoachDashboard;
