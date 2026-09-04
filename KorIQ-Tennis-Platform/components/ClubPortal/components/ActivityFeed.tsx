import React, { useState, useEffect } from 'react';
import { ProcessorConnection, Coach } from '../../../types';

interface ActivityItem {
    id: string;
    type: 'payment' | 'booking' | 'new_student' | 'new_coach' | 'refund' | 'cancellation';
    title: string;
    description: string;
    amount?: number;
    timestamp: Date;
    coachId?: string;
    studentName?: string;
    classType?: string;
}

interface ActivityFeedProps {
    connections: ProcessorConnection[];
    coaches: Coach[];
    onViewStudent?: (studentName: string) => void;
    onViewCoach?: (coach: Coach) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
    connections,
    coaches,
    onViewStudent,
    onViewCoach
}) => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const hasConnection = connections.some(c => c.status === 'connected');

    // Generate mock activities when connected
    useEffect(() => {
        if (hasConnection) {
            const mockActivities: ActivityItem[] = [
                {
                    id: '1',
                    type: 'payment',
                    title: 'Payment Received',
                    description: 'Private Lesson with Coach Mike',
                    amount: 80,
                    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
                    coachId: coaches[0]?.id,
                    studentName: 'John Smith',
                    classType: 'Private Lesson'
                },
                {
                    id: '2',
                    type: 'booking',
                    title: 'New Booking',
                    description: 'Group Class - Tuesday 6pm',
                    amount: 45,
                    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
                    coachId: coaches[1]?.id,
                    studentName: 'Sarah Johnson',
                    classType: 'Group Class'
                },
                {
                    id: '3',
                    type: 'new_student',
                    title: 'New Student',
                    description: 'Emma Wilson signed up',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                    studentName: 'Emma Wilson'
                },
                {
                    id: '4',
                    type: 'payment',
                    title: 'Payment Received',
                    description: 'Junior Camp Week 2',
                    amount: 350,
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                    coachId: coaches[0]?.id,
                    studentName: 'Tommy Chen',
                    classType: 'Camp'
                },
                {
                    id: '5',
                    type: 'booking',
                    title: 'New Booking',
                    description: 'Private Lesson - Tomorrow 10am',
                    amount: 80,
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                    coachId: coaches[2]?.id,
                    studentName: 'Michael Park',
                    classType: 'Private Lesson'
                }
            ];
            setActivities(mockActivities);
        }
    }, [hasConnection, coaches]);

    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'payment':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'booking':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                );
            case 'new_student':
                return (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                );
            case 'new_coach':
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                );
            case 'refund':
                return (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    if (!hasConnection) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">Connect a payment processor</p>
                    <p className="text-gray-400 text-xs">Activity will appear here in real-time</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Recent Activity</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {activities.map((activity) => {
                    const coach = coaches.find(c => c.id === activity.coachId);
                    return (
                        <div 
                            key={activity.id} 
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                                if (activity.studentName && onViewStudent) {
                                    onViewStudent(activity.studentName);
                                }
                            }}
                        >
                            {getActivityIcon(activity.type)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
                                    <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                                {activity.studentName && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {activity.studentName}
                                        {coach && ` • ${coach.name}`}
                                    </p>
                                )}
                            </div>
                            {activity.amount && (
                                <span className={`text-sm font-bold ${activity.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                                    {activity.type === 'refund' ? '-' : '+'}${activity.amount}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Today's total</span>
                    <span className="font-bold text-green-600">+$555</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
