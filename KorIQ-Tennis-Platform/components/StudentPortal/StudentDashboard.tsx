import React, { useEffect, useState, useMemo } from 'react';
import { Student, Session, PhysicalLogEntry, Tutorial } from '../../types';
import { storageService } from '../../services/storageService';
import { getPhysicalStandards } from '../../utils/calculations';
import { Button } from '../ui/Button';
import { StudentAnalytics } from '../Shared/StudentAnalytics';
import TutorialCard from '../Shared/TutorialCard';
import StudentBallParkTab from './components/StudentBallParkTab';
import ClubEventsViewTab from '../Shared/ClubEventsViewTab';

interface StudentDashboardProps {
    student: Student;
    onStudentUpdate?: () => void;
}

type Tab = 'DASHBOARD' | 'PROGRESS' | 'BALL_PARK' | 'EVENTS' | 'PHYSICAL';

// Mock tutorials
const MOCK_TUTORIALS: Tutorial[] = [
    {
        id: 't1',
        coachId: '1',
        coachName: 'Coach Mike Chen',
        title: 'Beginner Forehand Basics',
        description: 'Learn the fundamentals of a solid forehand',
        type: 'Public',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 15,
        category: 'Forehand',
        skillLevel: 'Beginner',
        views: 2500,
        likes: 180,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
    },
    {
        id: 't2',
        coachId: '1',
        coachName: 'Coach Mike Chen',
        title: 'Serve Fundamentals',
        description: 'Build a consistent serve from scratch',
        type: 'Public',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 20,
        category: 'Serve',
        skillLevel: 'Beginner',
        views: 1800,
        likes: 142,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
    },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onStudentUpdate }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
    const [physicals, setPhysicals] = useState(student.physicalAttributes || {
        sleepHours: 0, hydrationCups: 0, nutritionRating: 5, cardioMinutes: 0, strengthMinutes: 0
    });
    const [recommendedTutorials] = useState<Tutorial[]>(MOCK_TUTORIALS);

    // Update local state when prop changes (e.g. after save)
    useEffect(() => {
        if (student.physicalAttributes) {
            setPhysicals(student.physicalAttributes);
        }
    }, [student]);

    useEffect(() => {
        setSessions(storageService.getSessions(student.id));
    }, [student.id]);

    const handleSavePhysicals = () => {
        // Create a history log entry
        const newLog: PhysicalLogEntry = {
            id: Date.now().toString(),
            studentId: student.id,
            date: new Date().toISOString(),
            ...physicals
        };
        
        storageService.addPhysicalLog(newLog);
        
        if (onStudentUpdate) onStudentUpdate(); // Notify parent to refresh
        alert('Physical attributes updated!');
    };

    const recommended = getPhysicalStandards(student.age);
    const isKid = student.age < 10;

    // Helper to determine status color
    const getStatusColor = (val: number, target: number) => {
        if (val >= target) return "text-green-600";
        if (val >= target * 0.8) return "text-yellow-600";
        return "text-red-500";
    };

    // Tab configuration
    const tabConfig = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'PROGRESS', label: 'My Progress', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )},
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
        { id: 'PHYSICAL', label: 'Physical', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )},
    ];

    // Get club info for the student
    const clubName = student.clubId ? 'My Tennis Club' : 'Club';

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-1">Welcome, {student.name}!</h1>
                <p className="text-blue-100">Keep up the great work on your tennis journey!</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-student p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-student p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium">Current Level</p>
                    <p className="text-2xl font-bold text-gray-900">{student.ntrpLevel || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-student p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{sessions.filter(s => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(s.date) > weekAgo;
                    }).length}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-student p-4">
                    <p className="text-xs text-gray-500 uppercase font-medium">Sleep Avg</p>
                    <p className="text-2xl font-bold text-gray-900">{physicals.sleepHours}h</p>
                </div>
            </div>

            {/* Recent Evaluations Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Recent Evaluations</h3>
                    <button 
                        onClick={() => setActiveTab('PROGRESS')}
                        className="text-sm text-portal-student font-medium hover:underline"
                    >
                        View all →
                    </button>
                </div>
                {sessions.length > 0 ? (
                    <div className="space-y-2">
                        {sessions.slice(0, 3).map(session => (
                            <div key={session.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{session.coachName || 'Coach'}</p>
                                    <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs text-gray-400">{session.notes ? 'Has notes' : ''}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No evaluations yet</p>
                )}
            </div>

            {/* Ball Park Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Club Feed</h3>
                    <button 
                        onClick={() => setActiveTab('BALL_PARK')}
                        className="text-sm text-portal-student font-medium hover:underline"
                    >
                        See all →
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Coach</span>
                        </div>
                        <p className="text-sm text-gray-700">Check out the new footwork drill in the Tutorials section!</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">Club</span>
                        </div>
                        <p className="text-sm text-gray-700">Club tournament registration closes Friday!</p>
                        <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPhysical = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-student">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Physical Attributes</h2>
                <p className="text-sm text-gray-500 mb-4">Enter your weekly averages. This data helps track your off-court progress.</p>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Sleep Hours</label>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-lg ${getStatusColor(physicals.sleepHours, recommended.sleepHours)}`}>{physicals.sleepHours} hrs</span>
                                <span className="text-xs text-gray-400">Target: {recommended.sleepHours}+</span>
                            </div>
                            <input type="range" min="4" max="12" step="0.5" value={physicals.sleepHours} onChange={e => setPhysicals({...physicals, sleepHours: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-portal-student" />
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Hydration</label>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-lg ${getStatusColor(physicals.hydrationCups, recommended.hydrationCups)}`}>{physicals.hydrationCups} cups</span>
                                <span className="text-xs text-gray-400">Target: {recommended.hydrationCups}+</span>
                            </div>
                            <input type="range" min="0" max="20" step="1" value={physicals.hydrationCups} onChange={e => setPhysicals({...physicals, hydrationCups: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-portal-student" />
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Nutrition Rating</label>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-lg ${getStatusColor(physicals.nutritionRating, 8)}`}>{physicals.nutritionRating}/10</span>
                                <span className="text-xs text-gray-400">Target: 8+</span>
                            </div>
                            <input type="range" min="1" max="10" step="1" value={physicals.nutritionRating} onChange={e => setPhysicals({...physicals, nutritionRating: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-portal-student" />
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">{isKid ? 'Hours of Play' : 'Cardio Mins'}</label>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-lg ${getStatusColor(physicals.cardioMinutes, recommended.cardioMinutes)}`}>{physicals.cardioMinutes} m</span>
                                <span className="text-xs text-gray-400">Target: {recommended.cardioMinutes}+</span>
                            </div>
                            <input type="range" min="0" max="300" step="10" value={physicals.cardioMinutes} onChange={e => setPhysicals({...physicals, cardioMinutes: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-portal-student" />
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Strength Mins</label>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-bold text-lg ${getStatusColor(physicals.strengthMinutes, recommended.strengthMinutes)}`}>{physicals.strengthMinutes} m</span>
                                <span className="text-xs text-gray-400">Target: {recommended.strengthMinutes}+</span>
                            </div>
                            <input type="range" min="0" max="200" step="10" value={physicals.strengthMinutes} onChange={e => setPhysicals({...physicals, strengthMinutes: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-portal-student" />
                        </div>
                    </div>
                    <button 
                        onClick={handleSavePhysicals}
                        className="w-full py-3 bg-portal-student text-white font-semibold rounded-xl hover:bg-blue-600"
                    >
                        Save Updates
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTutorials = () => (
        <div className="space-y-6">
            {/* From My Coach */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">From My Coach</h3>
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>No private tutorials from your coach yet</p>
                </div>
            </div>

            {/* Recommended */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Recommended for You</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedTutorials.map(tutorial => (
                        <TutorialCard
                            key={tutorial.id}
                            tutorial={tutorial}
                            onWatch={() => console.log('Watch:', tutorial.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Purchase History</h3>
                <div className="text-center py-8 text-gray-500">
                    <p>No purchased tutorials yet</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Horizontal Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-portal-student rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                                <p className="text-xs text-portal-student font-medium">Student Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Bell placeholder */}
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Tabs with underline style - horizontal scrollable */}
                    <div className="flex gap-1 mt-4 overflow-x-auto border-b border-gray-200 -mb-px scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {tabConfig.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'border-portal-student text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-portal-student' : 'text-gray-400'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === 'DASHBOARD' && renderDashboard()}
                {activeTab === 'PROGRESS' && <StudentAnalytics student={student} sessions={sessions} />}
                {activeTab === 'BALL_PARK' && student.clubId && (
                    <StudentBallParkTab 
                        studentId={student.id}
                        studentName={student.name}
                        clubId={student.clubId}
                        clubName={clubName}
                    />
                )}
                {activeTab === 'BALL_PARK' && !student.clubId && (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Not connected to a club</h3>
                        <p className="text-sm text-gray-500">Ball Park is available when you're enrolled at a tennis club.</p>
                    </div>
                )}
                {activeTab === 'EVENTS' && student.clubId && (
                    <ClubEventsViewTab 
                        clubId={student.clubId}
                        clubName={clubName}
                        userType="student"
                        userName={student.name}
                    />
                )}
                {activeTab === 'EVENTS' && !student.clubId && (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Not connected to a club</h3>
                        <p className="text-sm text-gray-500">Events are available when you're enrolled at a tennis club.</p>
                    </div>
                )}
                {activeTab === 'PHYSICAL' && renderPhysical()}
            </div>
        </div>
    );
};