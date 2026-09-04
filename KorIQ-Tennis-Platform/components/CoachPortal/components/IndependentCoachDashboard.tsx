
import React, { useState } from 'react';
import { Coach, CoachRating, CoachSubscription, Notification } from '../../../types';
import CoachMessaging from './CoachMessaging';
import CoachProfileEditor from './CoachProfileEditor';
import CoachLocationSettings from './CoachLocationSettings';
import TutorialsTab from './TutorialsTab';
import BookingsTab from './BookingsTab';
import CoachSettings from './CoachSettings';
import AnalyticsTab from './AnalyticsTab';
import CoachBallParkTab from './CoachBallParkTab';
import NotificationBell from '../../Notifications/NotificationBell';
import ConnectionsTab from '../../Shared/ConnectionsTab';

interface IndependentCoachDashboardProps {
    coach: Coach;
    ratings: CoachRating[];
    onLogout: () => void;
}

type Tab = 'OVERVIEW' | 'STUDENTS' | 'TUTORIALS' | 'BALL_PARK' | 'CONNECTIONS' | 'BOOKINGS' | 'MESSAGES' | 'ANALYTICS' | 'SETTINGS';

const IndependentCoachDashboard: React.FC<IndependentCoachDashboardProps> = ({ coach, ratings, onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
    const [subscription, setSubscription] = useState<CoachSubscription>({
        coachId: coach.id,
        plan: 'Free',
        monthlyPrice: 0,
        privateTutorialsUsed: 2,
        messagesUsed: 4,
    });

    const avgRating = ratings.length > 0 
        ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1) 
        : "N/A";

    const unreadMessages = 2; // Mock data
    const pendingBookings = 2; // Mock data

    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', type: 'booking_request', title: 'New Booking Request', message: 'John Smith wants to book a lesson', timestamp: '1 hour ago', isRead: false },
        { id: '2', type: 'message', title: 'New Message', message: 'Sarah: Thanks for the great lesson!', timestamp: '3 hours ago', isRead: false },
        { id: '3', type: 'tutorial_purchased', title: 'Tutorial Sold!', message: 'Someone purchased "Serve Mastery"', timestamp: 'Yesterday', isRead: true },
        { id: '4', type: 'review', title: 'New Review', message: 'You received a 5-star review', timestamp: 'Yesterday', isRead: true },
    ]);

    const handleMarkNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkNotificationRead(notification.id);
        if (notification.type === 'booking_request') setActiveTab('BOOKINGS');
        else if (notification.type === 'message') setActiveTab('MESSAGES');
        else if (notification.type === 'tutorial_purchased') setActiveTab('TUTORIALS');
        else if (notification.type === 'review') setActiveTab('ANALYTICS');
    };

    const handleUpgradeSubscription = (plan: 'Free' | 'Gold') => {
        setSubscription(prev => ({
            ...prev,
            plan,
            monthlyPrice: plan === 'Gold' ? 3 : 0,
            subscribedAt: plan === 'Gold' ? new Date().toISOString() : undefined,
            renewsAt: plan === 'Gold' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        }));
    };

    const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
        { id: 'OVERVIEW', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'STUDENTS', label: 'Students', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )},
        { id: 'TUTORIALS', label: 'Tutorials', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
        { id: 'BOOKINGS', label: 'Bookings', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ), badge: pendingBookings },
        { id: 'MESSAGES', label: 'Messages', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ), badge: unreadMessages },
        { id: 'ANALYTICS', label: 'Analytics', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        )},
        { id: 'SETTINGS', label: 'Settings', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
    ];

    const renderOverview = () => (
        <div className="space-y-6">
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
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">This Week</p>
                            <p className="text-2xl font-bold text-gray-900">8</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-portal-coach p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-portal-coach">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">$480</p>
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
                        onClick={() => setActiveTab('MESSAGES')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Messages</span>
                        {unreadMessages > 0 && (
                            <span className="bg-portal-coach text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadMessages} new
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('PROFILE')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Edit Profile</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('AVAILABILITY')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Set Hours</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('LOCATIONS')}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-portal-coach transition-all group"
                    >
                        <span className="text-gray-400 group-hover:text-portal-coach group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </span>
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-portal-coach">Locations</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity & Messages Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Upcoming Sessions</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { name: 'John Smith', time: 'Today, 2:00 PM', location: 'Stanley Park', type: 'Serve Training' },
                            { name: 'Maria Garcia', time: 'Tomorrow, 10:00 AM', location: 'Jericho Club', type: 'Baseline Drills' },
                            { name: 'Alex Thompson', time: 'Sat, 9:00 AM', location: 'Stanley Park', type: 'Match Play' },
                        ].map((session, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{session.name}</h4>
                                        <p className="text-xs text-gray-500">{session.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-tennis-600">{session.time}</p>
                                        <p className="text-xs text-gray-400">{session.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">Recent Reviews</h3>
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
                                <p className="text-sm">No reviews yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAvailability = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span>📅</span> Weekly Availability
                </h3>
                <p className="text-xs text-gray-500 mt-1">Set your available hours for lessons</p>
            </div>
            <div className="p-5">
                <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-24">
                                <span className="font-bold text-gray-800 text-sm">{day}</span>
                            </div>
                            <div className="flex-1 flex gap-2">
                                {['Morning', 'Afternoon', 'Evening'].map(slot => (
                                    <button
                                        key={slot}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-tennis-50 hover:text-tennis-700 border border-gray-200 hover:border-tennis-200 transition-all"
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 text-sm">
                                ✕ Off
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="bg-tennis-600 hover:bg-tennis-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                        Save Availability
                    </button>
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
                                <p className="text-xs text-portal-coach font-medium">Coach Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Bell */}
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
                {activeTab === 'STUDENTS' && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Students</h2>
                        <p className="text-gray-500">Student management coming soon...</p>
                    </div>
                )}
                {activeTab === 'TUTORIALS' && (
                    <TutorialsTab 
                        coachId={coach.id} 
                        coachName={coach.name}
                        subscription={subscription}
                        onUpgradeClick={() => setActiveTab('SETTINGS')}
                    />
                )}
                {activeTab === 'BALL_PARK' && (
                    <CoachBallParkTab coachId={coach.id} coachName={coach.name} />
                )}
                {activeTab === 'CONNECTIONS' && (
                    <ConnectionsTab
                        portalType="coach"
                        currentUserId={coach.id}
                        currentUserName={coach.name}
                    />
                )}
                {activeTab === 'BOOKINGS' && (
                    <BookingsTab 
                        coachId={coach.id}
                        onMessagePlayer={(playerId, playerName) => {
                            // In a real app, this would open a chat
                            alert(`Opening chat with ${playerName}`);
                        }}
                    />
                )}
                {activeTab === 'MESSAGES' && <CoachMessaging coach={coach} />}
                {activeTab === 'ANALYTICS' && <AnalyticsTab coachId={coach.id} />}
                {activeTab === 'SETTINGS' && (
                    <CoachSettings 
                        coach={coach}
                        subscription={subscription}
                        onUpdateSubscription={handleUpgradeSubscription}
                    />
                )}
            </div>
        </div>
    );
};

export default IndependentCoachDashboard;
