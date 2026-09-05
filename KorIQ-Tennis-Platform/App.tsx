
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Coach, Student, NtrpLevel, Session, User, UserRole, Club, CoachRating } from './types';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { AddEvaluation } from './components/CoachPortal/AddEvaluation';
import { StudentDashboard } from './components/StudentPortal/StudentDashboard';
import { CoachStudentView } from './components/CoachPortal/CoachStudentView';
import { ClubView } from './components/ClubPortal/ClubView';
import { PlayerView } from './components/PlayerPortal/PlayerView';
import { Button } from './components/ui/Button';
import { AuthModal } from './components/Auth/AuthModal';
import { OnboardingModal } from './components/Onboarding';
import { calculateCoachDashboardStats } from './utils/calculations';
import IndependentCoachDashboard from './components/CoachPortal/components/IndependentCoachDashboard';
import ClubCoachDashboard from './components/CoachPortal/components/ClubCoachDashboard';
import TennisGame from './components/Game/TennisGame.tsx';
import CommunityLayout from './components/Community/CommunityLayout';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
                    <p className="text-gray-600 mb-4">The application encountered an unexpected error.</p>
                    <pre className="bg-gray-100 p-4 rounded text-left text-xs overflow-auto max-w-lg mx-auto mb-4">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-tennis-600 text-white rounded hover:bg-tennis-700"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const TENNIS_FACTS = [
    { type: 'History', text: "The longest match in history lasted 11 hours and 5 minutes (Isner vs. Mahut, 2010)." },
    { type: 'Health', text: "Hydration Strategy: Drink 16-24oz of water 2 hours before a match." },
    { type: 'Pro Tip', text: "The 'split step' is the most critical footwork move to react to any shot." },
    { type: 'History', text: "Yellow balls were introduced in 1972 solely to be visible on color TV." },
    { type: 'Health', text: "Bananas help prevent muscle cramps due to their high potassium content." },
    { type: 'History', text: "The word 'tennis' comes from the French 'tenez', meaning 'hold' or 'receive'." },
    { type: 'Pro Tip', text: "Exhale as you hit the ball to release tension and generate max power." },
    { type: 'Health', text: "Static stretching is best after a match. Use dynamic stretching before playing." },
    { type: 'Pro Tip', text: "Aim for 3 feet over the net to increase consistency and depth." },
    { type: 'History', text: "Wimbledon is the only Grand Slam still played on grass." },
    { type: 'Pro Tip', text: "Watch the ball hit your strings to improve contact quality." },
    { type: 'Health', text: "Dynamic warm-ups reduce injury risk by increasing blood flow to muscles." },
    { type: 'History', text: "Arthur Ashe was the first African American player selected to the US Davis Cup team." },
    { type: 'Pro Tip', text: "Recover to the 'geometric center' of the court's possible return angles." },
    { type: 'Health', text: "Core strength is essential for transferring power from legs to the racket." },
    { type: 'Pro Tip', text: "Keep your non-dominant hand on the racket throat during the unit turn." }
];

// ... (Rest of existing Mock Data for News, Shorts, etc.) ...
// Preserving all existing mock data arrays to ensure no regression in Landing Page
const LOCAL_TOURNAMENTS = [
    { id: 1, name: "Vancouver Open 3.5", date: "Jan 25-26, 2025", location: "Stanley Park Courts", level: "NTRP 3.5" },
    { id: 2, name: "BC Winter Championship", date: "Feb 8-10, 2025", location: "UBC Tennis Center", level: "Open" },
    { id: 3, name: "City Clay Court Classic", date: "Mar 1-2, 2025", location: "Queen Elizabeth Park", level: "NTRP 4.0 & 4.5" },
    { id: 4, name: "Spring Doubles Mixer", date: "Mar 15, 2025", location: "Kitsilano Beach Courts", level: "Recreational" },
];

const WORLD_UPCOMING = [
    { event: "Australian Open", dates: "Jan 12-26", location: "Melbourne" },
    { event: "Indian Wells", dates: "Mar 5-16", location: "California" },
    { event: "Miami Open", dates: "Mar 19-30", location: "Miami" },
];

const WORLD_RESULTS = [
    { event: "Brisbane International", winner: "Grigor Dimitrov" },
    { event: "Adelaide International", winner: "Jiri Lehecka" },
    { event: "United Cup", winner: "Germany" },
];

const ATP_RANKINGS = [
    { rank: 1, name: "Novak Djokovic" },
    { rank: 2, name: "Carlos Alcaraz" },
    { rank: 3, name: "Jannik Sinner" },
    { rank: 4, name: "Daniil Medvedev" },
    { rank: 5, name: "Andrey Rublev" },
];

const NEWS_ARTICLES = [
    { id: 1, title: "Nadal Announces Return to Clay", time: "2 hours ago", desc: "The King of Clay is back training for the upcoming season." },
    { id: 2, title: "New Racket Tech Banned?", time: "5 hours ago", desc: "ITF investigating new string patterns claiming to add 20% spin." },
    { id: 3, title: "Grand Slam Prize Money Increase", time: "1 day ago", desc: "Record breaking prize pool announced for 2025 majors." },
];

const HIGHLIGHTS = [
    { id: 1, title: "Shot of the Year Candidate!", time: "1 hour ago", desc: "Unbelievable passing shot from behind the back." },
    { id: 2, title: "Top 10 Rallies of 2024", time: "Yesterday", desc: "A compilation of the longest and most grueling points." },
];

const DRAMA_STORIES = [
    { id: 1, title: "Hot Mic Moments", time: "3 hours ago", desc: "What players really say during changeovers." },
    { id: 2, title: "Umpire Arguments Compilation", time: "2 days ago", desc: "The most heated exchanges with chair umpires this month." },
];

const MOCK_SHORTS = [
    {
        id: 1,
        coach: 'Coach Sarah Miller',
        title: 'How to improve your serve toss',
        likes: 234,
        comments: 18,
        time: '2 days ago',
        duration: '0:45',
        coachDetails: {
            name: 'Coach Sarah Miller',
            location: 'Vancouver, BC',
            rating: 4.8,
            reviews: 23,
            rate: 60,
            specialties: ['Serve', 'Juniors', 'Beginners'],
            bio: '10+ years coaching. Certified Tennis Canada coach. Specializing in serve development.',
            reviewsList: [
                { user: 'John T.', rating: 5, text: 'Great coach! My serve improved so much.' },
                { user: 'Amy L.', rating: 5, text: 'Very patient with beginners.' }
            ]
        }
    },
    {
        id: 2,
        coach: 'Coach David Park',
        title: 'Footwork drill for better court coverage',
        likes: 156,
        comments: 24,
        time: '5 days ago',
        duration: '1:12',
        coachDetails: {
            name: 'Coach David Park',
            location: 'Burnaby, BC',
            rating: 4.9,
            reviews: 45,
            rate: 75,
            specialties: ['Footwork', 'Strategy', 'Advanced'],
            bio: 'Former university player. I focus on movement and court geometry.',
            reviewsList: [
                { user: 'Mike R.', rating: 5, text: 'Intense drills, great workout.' },
                { user: 'Sarah K.', rating: 4, text: 'Really knows his stuff.' }
            ]
        }
    },
    {
        id: 3,
        coach: 'Coach Lisa Chen',
        title: 'Backhand slice technique breakdown',
        likes: 89,
        comments: 7,
        time: '1 week ago',
        duration: '0:58',
        coachDetails: {
            name: 'Coach Lisa Chen',
            location: 'Richmond, BC',
            rating: 4.7,
            reviews: 15,
            rate: 65,
            specialties: ['Backhand', 'Slice', 'Defense'],
            bio: 'Specialist in defensive play and transitions. Let\'s build a solid base.',
            reviewsList: [
                { user: 'Tom B.', rating: 5, text: 'My slice stays low now!' }
            ]
        }
    },
    {
        id: 4,
        coach: 'Coach Mike Johnson',
        title: 'One-handed backhand basics',
        likes: 312,
        comments: 42,
        time: '1 week ago',
        duration: '1:20',
        coachDetails: {
            name: 'Coach Mike Johnson',
            location: 'Vancouver, BC',
            rating: 4.6,
            reviews: 32,
            rate: 70,
            specialties: ['Backhand', 'Power', 'Baseline'],
            bio: 'Teaching the modern game. Power and consistency.',
            reviewsList: []
        }
    },
    {
        id: 5,
        coach: 'Coach Emma Wilson',
        title: 'Return of serve positioning',
        likes: 178,
        comments: 15,
        time: '2 weeks ago',
        duration: '0:35',
        coachDetails: {
            name: 'Coach Emma Wilson',
            location: 'North Van, BC',
            rating: 4.9,
            reviews: 28,
            rate: 65,
            specialties: ['Return', 'Doubles', 'Net Play'],
            bio: 'Doubles specialist. Improve your net game and returns.',
            reviewsList: []
        }
    }
];

const GlassyBall = ({ onClick }: { onClick: () => void }) => (
    <div
        onClick={onClick}
        className="group relative w-48 h-48 cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 animate-float z-20"
    >
        {/* Main Sphere Body */}
        <div
            className="absolute inset-0 rounded-full"
            style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(220, 255, 120, 0.9), rgba(160, 220, 40, 0.6))',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3), inset 0 0 40px rgba(255,255,255,0.4), inset 0 -10px 40px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
            }}
        ></div>

        {/* The Seam (SVG Overlay) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out">
            <path
                d="M5 50 C 5 25, 25 5, 50 5 C 75 5, 95 25, 95 50 C 95 75, 75 95, 50 95 C 25 95, 5 75, 5 50"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}
            />
            <path
                d="M50 5 C 35 25, 35 75, 50 95"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}
            />
        </svg>

        {/* Specular Highlight (The Glass Shine) */}
        <div className="absolute top-8 left-8 w-16 h-8 bg-gradient-to-br from-white to-transparent opacity-80 rounded-full blur-sm transform -rotate-45"></div>

        {/* Interaction Hint */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/0 font-bold text-xs tracking-[0.2em] group-hover:text-white/90 transition-colors duration-300 pointer-events-none">
                TAP ME
            </span>
        </div>
    </div>
);

// --- NEW OVERLAY COMPONENTS ---

const TournamentsOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'MY_TOURNAMENTS' | 'WORLD_TOUR'>('MY_TOURNAMENTS');
    const [location, setLocation] = useState('Vancouver, BC');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900/95 backdrop-blur-xl animate-slideUp overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">TOURNAMENT CENTER</h2>
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">✕</button>
            </div>

            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('MY_TOURNAMENTS')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'MY_TOURNAMENTS' ? 'bg-tennis-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    My Tournaments
                </button>
                <button
                    onClick={() => setActiveTab('WORLD_TOUR')}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'WORLD_TOUR' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    World Tour
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {activeTab === 'MY_TOURNAMENTS' ? (
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">📍 Enter your location</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-tennis-500"
                                />
                                <button className="bg-tennis-600 hover:bg-tennis-500 text-white font-bold px-6 py-2 rounded-lg transition-colors">Search</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {LOCAL_TOURNAMENTS.map(t => (
                                <div key={t.id} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{t.name}</h3>
                                            <p className="text-tennis-400 font-medium text-sm mb-2">{t.date} | {t.location}</p>
                                            <div className="inline-block bg-white/10 px-2 py-1 rounded text-xs text-gray-300 font-bold">{t.level}</div>
                                        </div>
                                        <button className="bg-white/10 hover:bg-white text-white hover:text-tennis-900 border border-white/20 font-bold text-xs uppercase px-4 py-2 rounded-lg transition-all">
                                            Sign Up →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 max-w-2xl mx-auto">
                        <div>
                            <h3 className="text-blue-400 font-black text-lg uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Upcoming Tournaments</h3>
                            <div className="space-y-2">
                                {WORLD_UPCOMING.map((t, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <span className="font-bold text-white">{t.event}</span>
                                        <span className="text-sm text-gray-400">{t.dates} <span className="text-gray-600">|</span> {t.location}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-blue-400 font-black text-lg uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Recent Results</h3>
                            <div className="space-y-2">
                                {WORLD_RESULTS.map((r, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <span className="text-gray-300">{r.event}</span>
                                        <span className="font-bold text-white text-right">Winner: <span className="text-yellow-400">{r.winner}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-blue-400 font-black text-lg uppercase tracking-wider mb-4 border-b border-white/10 pb-2">ATP Rankings (Top 5)</h3>
                            <div className="space-y-2">
                                {ATP_RANKINGS.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                                        <span className="font-black text-blue-500 w-6">{p.rank}.</span>
                                        <span className="font-bold text-white">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NewsfeedOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'NEWS' | 'HIGHLIGHTS' | 'DRAMA'>('NEWS');

    if (!isOpen) return null;

    const renderContent = () => {
        let items: any[] = [];
        if (activeTab === 'NEWS') items = NEWS_ARTICLES;
        if (activeTab === 'HIGHLIGHTS') items = HIGHLIGHTS;
        if (activeTab === 'DRAMA') items = DRAMA_STORIES;

        return (
            <div className="space-y-4 max-w-2xl mx-auto">
                {items.map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-tennis-400 transition-colors">
                            {activeTab === 'HIGHLIGHTS' || activeTab === 'DRAMA' ? '🎥 ' : '📰 '}
                            {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">{item.desc}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase">{item.time}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900/95 backdrop-blur-xl animate-slideUp overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">NEWSFEED</h2>
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">✕</button>
            </div>

            <div className="flex border-b border-white/10">
                {['NEWS', 'HIGHLIGHTS', 'DRAMA'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-white/10 text-white border-b-2 border-tennis-500' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
}

const ShortsOverlay = ({ isOpen, onClose, onLoginRequest, onCreateRequest }: { isOpen: boolean, onClose: () => void, onLoginRequest: () => void, onCreateRequest: () => void }) => {
    const [viewingCoach, setViewingCoach] = useState<any | null>(null);
    const [commentsVisible, setCommentsVisible] = useState<Record<number, boolean>>({});
    const [likedVideos, setLikedVideos] = useState<Record<number, boolean>>({});

    if (!isOpen) return null;

    const toggleComments = (id: number) => {
        setCommentsVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleLike = (id: number) => {
        setLikedVideos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900/95 backdrop-blur-xl animate-slideUp overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-gray-900/95 z-10">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">SHORTS</h2>
                <button onClick={onClose} className="text-white text-sm font-bold">← Back</button>
            </div>

            {/* Content Feed */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-8">
                    {MOCK_SHORTS.map(video => (
                        <div key={video.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-colors">
                            {/* Video Placeholder */}
                            <div className="relative aspect-video bg-black/40 flex items-center justify-center group cursor-pointer">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent"></div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-mono text-white">{video.duration}</div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tennis-500 to-tennis-700 flex items-center justify-center text-white text-xs font-bold">
                                            {video.coach.charAt(0)}
                                        </div>
                                        <span className="font-bold text-white text-sm">{video.coach}</span>
                                    </div>
                                    <button
                                        onClick={() => setViewingCoach(video.coachDetails)}
                                        className="text-xs font-bold text-tennis-400 hover:text-white transition-colors"
                                    >
                                        View Profile →
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-3">{video.title}</h3>

                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <button
                                        onClick={() => toggleLike(video.id)}
                                        className={`flex items-center gap-1 transition-colors ${likedVideos[video.id] ? 'text-red-500' : 'hover:text-white'}`}
                                    >
                                        <span className="text-lg">{likedVideos[video.id] ? '❤️' : '♡'}</span>
                                        {video.likes + (likedVideos[video.id] ? 1 : 0)}
                                    </button>
                                    <button
                                        onClick={() => toggleComments(video.id)}
                                        className="flex items-center gap-1 hover:text-white transition-colors"
                                    >
                                        <span className="text-lg">💬</span> {video.comments}
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                        <span className="text-lg">🔗</span> Share
                                    </button>
                                    <span className="ml-auto text-xs opacity-60">{video.time}</span>
                                </div>
                            </div>

                            {/* Comments Section */}
                            {commentsVisible[video.id] && (
                                <div className="border-t border-white/10 bg-black/20 p-4 space-y-4 animate-fadeIn">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Comments ({video.comments})</p>
                                    <div className="space-y-3">
                                        <div className="flex gap-2 text-sm">
                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">J</div>
                                            <div>
                                                <p className="text-gray-300 text-xs font-bold mb-0.5">John T. <span className="opacity-50 font-normal ml-1">1 day ago</span></p>
                                                <p className="text-gray-400">This helped my serve so much! Thank you!</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">A</div>
                                            <div>
                                                <p className="text-gray-300 text-xs font-bold mb-0.5">Amy L. <span className="opacity-50 font-normal ml-1">2 days ago</span></p>
                                                <p className="text-gray-400">Great explanation, very clear.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-2 border-t border-white/5">
                                        <input type="text" placeholder="Add a comment..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-tennis-500" />
                                        <button onClick={onLoginRequest} className="text-tennis-400 text-xs font-bold px-3 hover:text-white">Post</button>
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-center">(Login required to comment)</p>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="text-center text-gray-500 text-sm py-4">↓ Scroll for more</div>
                </div>
            </div>

            {/* Coach Profile Modal */}
            {viewingCoach && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-white/10 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-lg font-bold text-white">COACH PROFILE</h2>
                            <button onClick={() => setViewingCoach(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-tennis-500 to-tennis-700 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                                        <path strokeWidth="1.5" d="M12 3c-2.5 2.5-2.5 6.5 0 9s2.5 6.5 0 9" />
                                        <path strokeWidth="1.5" d="M3 12c2.5-2.5 6.5-2.5 9 0s6.5 2.5 9 0" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{viewingCoach.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            {viewingCoach.rating}
                                        </span>
                                        <span>({viewingCoach.reviews} reviews)</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{viewingCoach.location}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                    <span className="text-gray-300 font-bold">Hourly Rate</span>
                                    <span className="text-tennis-400 font-bold text-xl">${viewingCoach.rate}/hr</span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Specialties</p>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingCoach.specialties.map((s: string) => (
                                            <span key={s} className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/10">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Bio</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{viewingCoach.bio}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">More Videos</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="aspect-video bg-white/10 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-white/20 transition-colors">
                                                Video {i}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Reviews</p>
                                    <div className="space-y-2">
                                        {viewingCoach.reviewsList.length > 0 ? viewingCoach.reviewsList.map((r: any, i: number) => (
                                            <div key={i} className="text-sm border-b border-white/5 pb-2">
                                                <p className="font-bold text-gray-300 mb-1 flex items-center gap-1 flex-wrap">
                                                    <span className="flex text-yellow-400">
                                                        {Array.from({ length: r.rating }).map((_, idx) => (
                                                            <svg key={idx} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        ))}
                                                    </span>
                                                    <span>"{r.text}"</span>
                                                </p>
                                                <p className="text-xs text-gray-500">- {r.user}</p>
                                            </div>
                                        )) : <p className="text-xs text-gray-500 italic">No reviews yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-white/5 text-center">
                            <p className="text-sm text-gray-300 mb-3">To request a lesson, please log in or create an account.</p>
                            <div className="flex gap-2">
                                <Button fullWidth onClick={() => { setViewingCoach(null); onClose(); onLoginRequest(); }}>Login</Button>
                                <Button fullWidth variant="secondary" onClick={() => { setViewingCoach(null); onClose(); onCreateRequest(); }}>Create Player Account</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Coach Dashboard - Routes to appropriate dashboard based on coach type
const CoachDashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
    const [coach, setCoach] = useState<Coach | null>(null);
    const [ratings, setRatings] = useState<CoachRating[]>([]);

    useEffect(() => {
        const c = storageService.getCoaches().find(c => c.id === user.linkedEntityId);
        setCoach(c || null);
        setRatings(storageService.getRatings(user.linkedEntityId));
    }, [user.linkedEntityId]);

    // Loading state
    if (!coach) {
        return <div className="p-10 text-center">Loading Coach Profile...</div>;
    }

    // Route to Independent Coach Dashboard (Community Ecosystem)
    if (coach.coachType === 'Independent' || coach.coachType === 'Both') {
        return <IndependentCoachDashboard coach={coach} ratings={ratings} onLogout={onLogout} />;
    }

    // Route to Club Coach Dashboard (Club Ecosystem)
    return <ClubCoachDashboard coach={coach} ratings={ratings} onLogout={onLogout} />;
};

// Student View Wrapper
const StudentView = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const refreshStudent = useCallback(() => {
        const students = storageService.getStudents();
        const found = students.find(s => s.id === user.linkedEntityId);
        if (found) setStudent(found);
    }, [user.linkedEntityId]);
    useEffect(() => { refreshStudent(); }, [refreshStudent]);
    if (!student) return <div className="p-10 text-center">Loading Profile... (ID: {user.linkedEntityId})</div>;
    return (
        <div className="w-full md:max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50 pb-20">
            <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-gray-400">STUDENT PORTAL</span><Button variant="ghost" className="text-xs" onClick={onLogout}>Logout</Button></div>
            <StudentDashboard student={student} onStudentUpdate={refreshStudent} />
        </div>
    );
};

// Portal Card Icons (SVG)
const PortalIcons = {
    club: (
        <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    coach: (
        <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    student: (
        <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    player: (
        <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-2.5 2.5-2.5 6.5 0 9s2.5 6.5 0 9" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12c2.5-2.5 6.5-2.5 9 0s6.5 2.5 9 0" />
        </svg>
    )
};

// Portal Card Data
const PORTAL_CARDS = [
    {
        id: 'club',
        title: 'Club',
        hook: 'Your club\'s command center.',
        icon: PortalIcons.club,
        colors: 'from-amber-500 to-amber-700',
        borderColor: 'border-amber-500/50',
        glowColor: 'shadow-amber-500/30',
        hoverGlow: 'hover:shadow-amber-500/50',
        bgSpecial: 'bg-gradient-to-br from-gray-900 to-black',
        modalIntro: 'Your club. Your coaches. Your students. One dashboard.',
        features: [
            'Revenue analytics and optimization',
            'Coach and student performance tracking',
            'Centralized evaluation system',
            'AI powered operations assistant'
        ],
        modalFooter: 'Free tier: Basic analytics included. Go Pro for deep insights and coach management.'
    },
    {
        id: 'coach',
        title: 'Coach',
        hook: 'Your followers scroll past. Your KorIQ students book lessons.',
        icon: PortalIcons.coach,
        colors: 'from-green-500 to-green-700',
        borderColor: 'border-green-500/50',
        glowColor: 'shadow-green-500/30',
        hoverGlow: 'hover:shadow-green-500/50',
        modalIntro: 'Build your brand. Grow your roster.',
        features: [
            'Create a public profile with credentials',
            'Post tutorials (public & private)',
            'Get discovered by local players',
            'Receive lesson requests directly',
            'Evaluate students with NTRP system',
            'Collect reviews and ratings'
        ],
        modalFooter: 'Free tier: 3 private tutorials/month, 5 messages/month. Go Pro for unlimited access.'
    },
    {
        id: 'student',
        title: 'Student',
        hook: 'Watch yourself level up.',
        icon: PortalIcons.student,
        colors: 'from-cyan-500 to-blue-600',
        borderColor: 'border-cyan-500/50',
        glowColor: 'shadow-cyan-500/30',
        hoverGlow: 'hover:shadow-cyan-500/50',
        modalIntro: 'Your progress, visualized.',
        features: [
            'View evaluations from your coach',
            'Track your NTRP progression over time',
            'Access private video tutorials',
            'See Fundamentals & Performance breakdowns',
            'Visualize your skills with radar charts',
            'Never forget your coach\'s feedback'
        ],
        modalFooter: 'Join through your club or coach.'
    },
    {
        id: 'player',
        title: 'Player',
        hook: 'Stop hitting against the wall. Find your match.',
        icon: PortalIcons.player,
        colors: 'from-orange-500 to-orange-700',
        borderColor: 'border-orange-500/50',
        glowColor: 'shadow-orange-500/30',
        hoverGlow: 'hover:shadow-orange-500/50',
        modalIntro: 'Your next hitting partner is one tap away.',
        features: [
            'Find partners at your NTRP level',
            'Join events and group hits',
            'Challenge other players',
            'Message coaches directly',
            'Book lessons',
            'Track your progress'
        ],
        modalFooter: 'Free to join. Free to play.'
    }
];

// Portal Card Component
const PortalCard = ({ card, onMoreInfo }: { card: typeof PORTAL_CARDS[0], onMoreInfo: () => void }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative h-80 cursor-pointer group perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front of Card */}
                <div className={`absolute inset-0 backface-hidden rounded-2xl ${card.bgSpecial || 'bg-gradient-to-br from-gray-800/80 to-gray-900/90'} backdrop-blur-xl border-2 ${card.borderColor} shadow-xl ${card.glowColor} ${card.hoverGlow} transition-all duration-300 overflow-hidden`}>
                    {/* Card Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
                    </div>

                    {/* Gradient Top Bar */}
                    <div className={`h-2 w-full bg-gradient-to-r ${card.colors}`}></div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col items-center justify-center h-full relative z-10">
                        <div className={`mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg text-white`}>
                            {card.icon}
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm text-center font-medium">{card.hook}</p>

                        {/* Tap to flip hint */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Tap to flip</span>
                        </div>
                    </div>

                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${card.colors} opacity-20 rounded-bl-full`}></div>
                </div>

                {/* Back of Card */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl ${card.bgSpecial || 'bg-gradient-to-br from-gray-800/95 to-gray-900/98'} backdrop-blur-xl border-2 ${card.borderColor} shadow-xl overflow-hidden`}>
                    {/* Gradient Top Bar */}
                    <div className={`h-2 w-full bg-gradient-to-r ${card.colors}`}></div>

                    <div className="p-5 h-full flex flex-col">
                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 text-white">{React.cloneElement(card.icon as React.ReactElement, { className: 'w-5 h-5' })}</span> What You Can Do
                        </h4>
                        <ul className="space-y-2 flex-1 overflow-y-auto text-sm">
                            {card.features.slice(0, 4).map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-green-400 mt-0.5">•</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMoreInfo(); }}
                            className={`mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r ${card.colors} text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg`}
                        >
                            More Information →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Portal Modal Component
const PortalModal = ({ card, isOpen, onClose }: { card: typeof PORTAL_CARDS[0] | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className={`h-2 w-full bg-gradient-to-r ${card.colors}`}></div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-white w-10 h-10">{React.cloneElement(card.icon as React.ReactElement, { className: 'w-10 h-10' })}</span>
                            <div>
                                <h3 className="text-2xl font-black text-white">{card.title}</h3>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">×</button>
                    </div>

                    {/* Intro text */}
                    {'modalIntro' in card && (
                        <p className="text-lg text-white font-medium mb-6">{(card as any).modalIntro}</p>
                    )}

                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">What you can do:</h4>
                        <ul className="space-y-2.5">
                            {card.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-200">
                                    <span className="text-gray-500 mt-1">-</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer text */}
                    {'modalFooter' in card && (
                        <p className="mt-6 text-sm text-gray-400 border-t border-white/10 pt-4">{(card as any).modalFooter}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Intersection Observer Hook for scroll animations
const useInView = (threshold = 0.1) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const { ref, isInView } = useInView();

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Landing Page Component
const Landing = ({ onLoginClick, onSignupClick, onPortalClick }: { onLoginClick: () => void, onSignupClick: (role?: UserRole) => void, onPortalClick: (role: UserRole) => void }) => {
    const [fact, setFact] = useState<{ type: string, text: string } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [selectedPortal, setSelectedPortal] = useState<typeof PORTAL_CARDS[0] | null>(null);
    const [activeBackground, setActiveBackground] = useState(0);
    const [showGame, setShowGame] = useState(false);

    // Section refs for intersection observer
    const section2Ref = useInView(0.3);
    const section3Ref = useInView(0.2);
    const section4Ref = useInView(0.3);
    const section5Ref = useInView(0.3);
    const section6Ref = useInView(0.3);
    const section7Ref = useInView(0.3);
    const section8Ref = useInView(0.3);

    // Handle scroll for bouncing ball and background transitions
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
            const vh = window.innerHeight;
            const scrollProgress = window.scrollY / vh;

            // Background transitions
            if (scrollProgress < 3) setActiveBackground(0); // Sections 1-3: Original
            else if (scrollProgress < 4) setActiveBackground(1); // Section 4: Game Day
            else if (scrollProgress < 5) setActiveBackground(2); // Section 5: News
            else if (scrollProgress < 6) setActiveBackground(3); // Section 6: Courtside
            else setActiveBackground(4); // Sections 7-8: The Pulse & CTA
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBallClick = () => {
        setIsAnimating(true);
        setFact(null);
        setTimeout(() => {
            const random = TENNIS_FACTS[Math.floor(Math.random() * TENNIS_FACTS.length)];
            setFact(random);
            setIsAnimating(false);
        }, 150);
    };

    // Calculate bouncing ball position based on scroll
    const getBallPosition = () => {
        // Start position (Hero): Center-ish, large
        // End position (Header): Top left, small

        const vh = window.innerHeight;
        const scrollThreshold = vh * 0.8; // Transition over first 80% of screen height
        const progress = Math.min(scrollY / scrollThreshold, 1);

        // Easing function for smoother movement
        const ease = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const p = ease(progress);

        // These values are approximations to match the static layout
        // Initial: top ~35vh, left ~50% - 160px (to be left of text)
        // Final: top ~20px, left ~20px

        const startTop = 72; // vh
        const endTop = 33; // px (approx top padding + alignment)

        // We use a fixed position approach
        // At progress 0: it should look like it's in the hero
        // At progress 1: it should be in the header

        if (progress === 0) {
            // Return to "static" flow position if at top to ensure perfect alignment
            return { position: 'absolute', top: 'auto', left: 'auto', transform: 'none', opacity: 0 } as const;
        }

        // Calculate interpolated position
        // We'll use fixed positioning for the transition
        const currentTop = `calc(${startTop * (1 - p)}vh + ${endTop * p}px)`;

        // Horizontal: Start at center minus offset, End at left padding
        // Start: 50vw - 180px (approx)
        // End: 24px

        // Using calc for interpolation
        const currentLeft = `calc(50vw * ${1 - p} - ${200 * (1 - p)}px + ${35 * p}px)`;

        const scale = 3; // Start 3x, End 3x (consistent size)

        // Brightness: 60% at start, 100% at end
        const brightness = 0.4 + (0.6 * p);

        return {
            position: 'fixed',
            top: currentTop,
            left: currentLeft,
            transform: `scale(${scale})`,
            zIndex: 60,
            opacity: 1,
            filter: `brightness(${brightness})`
        } as const;
    };

    // Background images
    // Prefixed with BASE_URL so they resolve when deployed under a sub-path (e.g. GitHub Pages)
    const base = import.meta.env.BASE_URL;
    const backgrounds = [
        `${base}jack-white-ULrJ3TdpMOw-unsplash.jpg`, // Original (Sections 1-3)
        `${base}ryan-searle-qjrjJnFypa0-unsplash.jpg`, // Game Day, News, Courtside (Sections 4-6)
        `${base}ryan-searle-qjrjJnFypa0-unsplash.jpg`, // (Section 5 - Same image)
        `${base}ryan-searle-qjrjJnFypa0-unsplash.jpg`, // (Section 6 - Same image)
        `${base}erik-werlin-4gqELewld-A-unsplash.jpg`, // The Pulse, CTA (Sections 7-8)
        `${base}erik-werlin-4gqELewld-A-unsplash.jpg`, // (Section 8 - Same image)
    ];

    return (
        <div className="relative font-sans text-white overflow-x-hidden">
            {/* Portal Modal */}
            <PortalModal card={selectedPortal} isOpen={!!selectedPortal} onClose={() => setSelectedPortal(null)} />

            {/* Fixed Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo (visible after scrolling) */}
                    <div className={`transition-all duration-500 ${scrollY > 100 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <span className="text-xl font-black tracking-tight ml-8">KorIQ</span>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex gap-3 items-center">
                        {/* Community Button */}
                        <Link
                            to="/community"
                            className="bg-black hover:bg-[#1a1a1a] backdrop-blur-md border border-white/10 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/10"
                        >
                            Community
                        </Link>
                        <div className="relative">
                            <button onClick={() => { setIsLoginMenuOpen(!isLoginMenuOpen); setIsCreateMenuOpen(false); }} className="bg-black hover:bg-[#1a1a1a] backdrop-blur-md border border-white/10 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/10 flex items-center gap-1">
                                Login <svg className={`w-3 h-3 transition-transform duration-200 ${isLoginMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isLoginMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsLoginMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-3 w-40 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown flex flex-col py-1">
                                        <button onClick={() => { onPortalClick('COACH'); setIsLoginMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Coach Login</button>
                                        <button onClick={() => { onPortalClick('STUDENT'); setIsLoginMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Student Login</button>
                                        <button onClick={() => { onPortalClick('CLUB'); setIsLoginMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Club Login</button>
                                        <button onClick={() => { onPortalClick('PLAYER'); setIsLoginMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Player Login</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="relative">
                            <button onClick={() => { setIsCreateMenuOpen(!isCreateMenuOpen); setIsLoginMenuOpen(false); }} className="bg-black hover:bg-[#1a1a1a] backdrop-blur-md border border-white/10 text-white text-sm font-semibold py-2 px-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/10 flex items-center gap-1">
                                Create Account <svg className={`w-3 h-3 transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isCreateMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCreateMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-3 w-40 bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown flex flex-col py-1">
                                        <button onClick={() => { onSignupClick('COACH'); setIsCreateMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">Coach</button>
                                        <button onClick={() => { onSignupClick('STUDENT'); setIsCreateMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Student</button>
                                        <button onClick={() => { onSignupClick('CLUB'); setIsCreateMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Club</button>
                                        <button onClick={() => { onSignupClick('PLAYER'); setIsCreateMenuOpen(false); }} className="text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-t border-white/5">Player</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Parallax Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {backgrounds.map((bg, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${activeBackground === i ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: `url("${bg}")`,
                            transform: `scale(1.1)`, // Removed translateY to prevent image moving off-screen
                        }}
                    />
                ))}

                {/* Global Overlay */}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-1000" />

                {/* Sections 1-3 Overlay (Hero, Hook, Portals) */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 transition-opacity duration-1000 ${activeBackground === 0 ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Section Specific Overlays */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 transition-opacity duration-1000 ${activeBackground >= 1 && activeBackground <= 3 ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Courtside Moodier Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/70 to-black/85 transition-opacity duration-1000 ${activeBackground === 3 ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Pulse & CTA Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 transition-opacity duration-1000 ${activeBackground >= 4 ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* Fixed Bouncing Ball Transition - Clickable when at final position */}
            <div
                className={`animate-subtleBounce ${scrollY >= window.innerHeight * 0.8 ? 'cursor-pointer hover:scale-110 transition-transform' : 'pointer-events-none'}`}
                style={getBallPosition() as any}
                onClick={() => scrollY >= window.innerHeight * 0.8 && setShowGame(true)}
            >
                🎾
            </div>

            {/* "Game time?" text with arrow - appears when ball reaches final position */}
            {scrollY >= window.innerHeight * 0.8 && (
                <div
                    className="fixed animate-blink cursor-pointer hover:text-tennis-400 transition-colors"
                    style={{
                        top: '60px',
                        left: '37px',
                        zIndex: 60,
                    }}
                    onClick={() => setShowGame(true)}
                >
                    <span className="text-white text-xs font-mono flex items-center gap-1 hover:text-tennis-300">
                        <span className="text-tennis-400">↑</span> game time?
                    </span>
                </div>
            )}

            {/* ============ SECTION 1: HERO ============ */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
                {/* Ambient Lights */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-tennis-500 opacity-10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Hero Content */}
                <div className="relative z-10 text-center animate-slideDown">
                    <div className="flex items-center justify-center gap-2">
                        {/* Static Ball - Visible at start */}
                        <div className="animate-subtleBounce mb-2 relative top-1 text-3xl md:text-5xl">
                            🎾
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl">KorIQ</h1>
                    </div>
                    <p className="text-white font-bold tracking-wider text-xl md:text-2xl mt-1 uppercase drop-shadow-md" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Where the game never sleeps</p>
                    <p className="text-gray-300 text-base md:text-lg mt-3 max-w-xl mx-auto font-light">
                        Where clubs, coaches, and players level up together.
                    </p>

                    {/* Live Activity Pulse */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-100/90 shadow-sm">142 users online now</span>
                    </div>
                </div>

                {/* GlassyBall */}
                {/* Center Interactive Area */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full max-w-md my-4">
                    <GlassyBall onClick={handleBallClick} />

                    {/* Fact Popover - Positioned BELOW to avoid covering logo */}
                    <div className={`absolute top-[calc(100%-4rem)] w-full transition-all duration-500 ease-out transform z-20 ${fact && !isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                        {fact && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl text-center relative mt-4">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/10 border-l border-t border-white/20 rotate-45 backdrop-blur-md"></div>
                                <span className="inline-block px-2 py-1 bg-tennis-600 rounded text-[10px] font-bold uppercase tracking-wider mb-2 shadow-lg">{fact.type}</span>
                                <p className="text-lg font-medium leading-relaxed drop-shadow-sm">"{fact.text}"</p>
                            </div>
                        )}
                    </div>

                    <p className={`mt-8 text-sm text-gray-300 font-medium tracking-wide transition-opacity duration-300 drop-shadow-md text-center ${fact ? 'opacity-0' : 'opacity-80'}`}>Tap the ball for a tip</p>
                </div>

                {/* Scroll Indicator - Fixed Centering */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center animate-bounce pointer-events-none">
                    <div className="flex flex-col items-center gap-2 text-white/60">
                        <span className="text-xs uppercase tracking-widest whitespace-nowrap">Scroll to explore</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ============ SECTION 2: THE HOOK ============ */}
            <section ref={section2Ref.ref} className="relative min-h-screen flex items-center justify-center px-6">
                <div className={`text-center max-w-4xl transition-all duration-1000 ${section2Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                        Tennis is <span className="text-transparent bg-clip-text bg-gradient-to-r from-tennis-400 to-blue-400">better together</span>
                    </h2>
                    <p className="mt-6 text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        Max out your performance. Stay connected with the club. Book a lesson with a pro. Join events this weekend. Or meet someone who shares your passion. It all starts here.
                    </p>
                </div>
            </section>

            {/* ============ SECTION 3: PORTAL CARDS ============ */}
            <section ref={section3Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                {/* Blur overlay - Darker for readability */}
                <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>

                <div className={`relative z-10 max-w-6xl w-full transition-all duration-1000 ${section3Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white">Find Your Place</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {PORTAL_CARDS.map((card, i) => (
                            <div
                                key={card.id}
                                className="transition-all duration-500"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <PortalCard card={card} onMoreInfo={() => setSelectedPortal(card)} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 4: GAME DAY ============ */}
            <section ref={section4Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                <div className={`relative z-10 w-full max-w-4xl transition-all duration-1000 ${section4Ref.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                    <div className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white">Never miss a match</h2>
                        <p className="text-gray-400 mt-2 max-w-xl">Tournament schedules, upcoming events, and match results - all in one place. Know what's happening in the tennis world.</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Local Tournaments */}
                            <div>
                                <h3 className="text-xl font-bold text-tennis-400 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                    Local Tournaments
                                </h3>
                                <div className="space-y-3">
                                    {LOCAL_TOURNAMENTS.slice(0, 3).map(t => (
                                        <div key={t.id} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                            <h4 className="font-bold text-white">{t.name}</h4>
                                            <p className="text-sm text-tennis-400">{t.date}</p>
                                            <p className="text-xs text-gray-400">{t.location} - {t.level}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* World Tour */}
                            <div>
                                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    World Tour
                                </h3>
                                <div className="space-y-3">
                                    {WORLD_UPCOMING.map((t, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <h4 className="font-bold text-white">{t.event}</h4>
                                            <p className="text-sm text-gray-400">{t.dates} - {t.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ SECTION 5: NEWS ============ */}
            <section ref={section5Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                <div className={`relative z-10 w-full max-w-4xl transition-all duration-1000 ${section5Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <div className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white">Stay in the loop</h2>
                        <p className="text-gray-400 mt-2 max-w-xl">Tennis news, tips, and stories from the community. Your daily dose of everything tennis.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {NEWS_ARTICLES.map((article, i) => (
                            <div
                                key={article.id}
                                className={`bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group ${section5Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <span className="text-xs text-gray-500 font-mono">{article.time}</span>
                                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-tennis-400 transition-colors">{article.title}</h3>
                                <p className="text-sm text-gray-400 mt-2">{article.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Highlights Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {HIGHLIGHTS.map((item, i) => (
                            <div key={item.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-purple-500/30 p-5 rounded-xl hover:border-purple-400/50 transition-colors cursor-pointer">
                                <span className="text-xs text-purple-400 font-mono">{item.time}</span>
                                <h3 className="text-lg font-bold text-white mt-2">{item.title}</h3>
                                <p className="text-sm text-gray-300 mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 6: COURTSIDE (SHORTS) ============ */}
            <section ref={section6Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

                <div className={`relative z-10 w-full max-w-5xl transition-all duration-1000 ${section6Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <div className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white">Learn from the pros</h2>
                        <p className="text-gray-400 mt-2 max-w-xl">Quick tutorials, tips, and drills from coaches in the community. Watch, learn, improve.</p>
                    </div>

                    {/* Video Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
                        {MOCK_SHORTS.map((video, i) => (
                            <div
                                key={video.id}
                                className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 cursor-pointer group ${section6Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {/* Video Thumbnail */}
                                <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-white">{video.duration}</div>
                                </div>

                                {/* Video Info */}
                                <div className="p-3">
                                    <p className="text-xs text-gray-400 truncate">{video.coach}</p>
                                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-2">{video.title}</h4>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                                            {video.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            {video.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ SECTION 7: THE PULSE ============ */}
            <section ref={section7Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                <div className={`relative z-10 text-center transition-all duration-1000 ${section7Ref.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2">The community is live</h2>
                    <p className="text-gray-400 mb-12">Tennis players are connecting right now. Join them.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Users Online */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="text-5xl md:text-6xl font-black text-green-400 mb-2">
                                    <AnimatedCounter end={142} />
                                </div>
                                <p className="text-gray-300 font-medium">Users Online</p>
                                <div className="mt-4 flex justify-center">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Matches Played */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="text-5xl md:text-6xl font-black text-blue-400 mb-2">
                                    <AnimatedCounter end={8472} />
                                </div>
                                <p className="text-gray-300 font-medium">Matches Played</p>
                                <p className="text-xs text-gray-500 mt-2">This month</p>
                            </div>
                        </div>

                        {/* Coaches Ready */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-tennis-500/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-tennis-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="text-5xl md:text-6xl font-black text-tennis-400 mb-2">
                                    <AnimatedCounter end={47} />
                                </div>
                                <p className="text-gray-300 font-medium">Coaches Ready</p>
                                <p className="text-xs text-gray-500 mt-2">Available to book</p>
                            </div>
                        </div>
                    </div>

                    {/* Network Visualization */}
                    <div className="mt-12 relative h-32 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-tennis-500/50 rounded-full animate-pulse"
                                    style={{
                                        left: `${10 + (i * 4.5)}%`,
                                        top: `${30 + Math.sin(i * 0.8) * 30}%`,
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                ></div>
                            ))}
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute h-px bg-gradient-to-r from-transparent via-tennis-500/30 to-transparent"
                                    style={{
                                        width: `${60 + Math.random() * 100}px`,
                                        left: `${5 + (i * 6)}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        transform: `rotate(${-20 + Math.random() * 40}deg)`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ SECTION 8: FINAL CTA ============ */}
            <section ref={section8Ref.ref} className="relative min-h-screen flex items-center justify-center px-6 py-20">
                <div className={`relative z-10 text-center max-w-2xl transition-all duration-1000 ${section8Ref.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-4">Ready to play?</h2>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">Join the tennis community. It's free.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onSignupClick()}
                            className="px-8 py-4 bg-black text-white font-bold rounded-full text-lg hover:bg-[#1a1a1a] transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
                        >
                            Create Account
                        </button>
                        <button
                            onClick={onLoginClick}
                            className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold rounded-full text-lg hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            Login
                        </button>
                    </div>

                    <p className="mt-12 text-sm text-gray-400 font-medium tracking-wide uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Where the game never sleeps</p>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <p className="text-xs text-white/40 font-light tracking-widest uppercase">v1.0 • Professional Edition</p>
                    </div>
                </div>
            </section>

            {/* Global Styles */}
            <style>{`
                html {
                    scroll-behavior: smooth;
                }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-slideDown { animation: slideDown 0.8s ease-out forwards; }
                .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes subtleBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                .animate-subtleBounce { animation: subtleBounce 2s ease-in-out infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                .animate-blink { animation: blink 3s ease-in-out infinite; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            {/* Tennis Mini-Game Overlay */}
            {showGame && <TennisGame onClose={() => setShowGame(false)} />}
        </div>
    );
};

// --- App Container ---

const AppContent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [targetRole, setTargetRole] = useState<UserRole | undefined>(undefined);
    const [showOnboarding, setShowOnboarding] = useState(false);
    // Supabase mode: load the public directory and restore a persisted session
    // before rendering anything that reads from the data cache.
    const [booting, setBooting] = useState(authService.remote);
    const [bootError, setBootError] = useState<string | null>(null);

    useEffect(() => {
        if (!authService.remote) return;
        let cancelled = false;
        (async () => {
            try {
                await storageService.hydratePublic();
                const restored = await authService.restoreSession();
                if (!cancelled && restored) setUser(restored);
            } catch (err) {
                console.error('[App] bootstrap failed', err);
                if (!cancelled) setBootError(err instanceof Error ? err.message : 'Could not reach the database.');
            } finally {
                if (!cancelled) setBooting(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const handleLoginSuccess = (u: User) => {
        setUser(u);
        setIsAuthModalOpen(false);

        // Check if onboarding is needed
        const needsOnboarding = !storageService.isOnboardingComplete(u.role, u.linkedEntityId);

        if (needsOnboarding) {
            setShowOnboarding(true);
        }

        // Navigate to the appropriate portal
        if (u.role === 'COACH') navigate('/coach');
        else if (u.role === 'STUDENT') navigate('/student');
        else if (u.role === 'PLAYER') navigate('/player');
        else navigate('/club');
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    const handleOnboardingSkip = () => {
        if (user) {
            storageService.skipOnboarding(user.role, user.linkedEntityId);
        }
        setShowOnboarding(false);
    };

    const handleLogout = () => {
        setUser(null);
        setShowOnboarding(false);
        navigate('/');
        authService.logout().catch(err => console.error('[App] logout failed', err));
    };

    const openAuth = (mode: 'LOGIN' | 'SIGNUP', role?: UserRole) => {
        setAuthMode(mode);
        setTargetRole(role);
        setIsAuthModalOpen(true);
    };

    const handlePortalClick = (role: UserRole) => {
        if (user) {
            if (user.role === role) {
                navigate(role === 'COACH' ? '/coach' : role === 'STUDENT' ? '/student' : role === 'PLAYER' ? '/player' : '/club');
            } else {
                alert(`You are currently logged in as a ${user.role}. Please logout to switch accounts.`);
            }
        } else {
            openAuth('LOGIN', role);
        }
    };

    if (booting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-tennis-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-300">Connecting to KorIQ…</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            {bootError && (
                <div className="fixed top-0 inset-x-0 z-[60] bg-red-600 text-white text-xs text-center py-2 px-4">
                    Database unavailable: {bootError}. Some data may not load.
                </div>
            )}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
                targetRole={targetRole}
                onLoginSuccess={handleLoginSuccess}
            />
            {user && showOnboarding && (
                <OnboardingModal
                    isOpen={showOnboarding}
                    user={user}
                    onComplete={handleOnboardingComplete}
                    onSkip={handleOnboardingSkip}
                />
            )}
            <Routes>
                <Route path="/" element={
                    <Landing
                        onLoginClick={() => openAuth('LOGIN')}
                        onSignupClick={(role) => openAuth('SIGNUP', role)}
                        onPortalClick={handlePortalClick}
                    />
                } />
                <Route path="/coach" element={
                    user && user.role === 'COACH' ?
                        <CoachDashboard user={user} onLogout={handleLogout} /> :
                        <Navigate to="/" replace />
                } />
                <Route path="/student" element={
                    user && user.role === 'STUDENT' ?
                        <StudentView user={user} onLogout={handleLogout} /> :
                        <Navigate to="/" replace />
                } />
                <Route path="/player" element={
                    user && user.role === 'PLAYER' ?
                        <PlayerView user={user} onLogout={handleLogout} /> :
                        <Navigate to="/" replace />
                } />
                <Route path="/club" element={
                    user && user.role === 'CLUB' ?
                        <ClubView user={user} onLogout={handleLogout} /> :
                        <Navigate to="/" replace />
                } />
                <Route path="/community/*" element={
                    <CommunityLayout
                        onClose={() => navigate('/')}
                        onLoginClick={() => openAuth('LOGIN', 'PLAYER')}
                        onSignupClick={() => openAuth('SIGNUP', 'PLAYER')}
                    />
                } />
            </Routes>
        </ErrorBoundary>
    );
};

const App = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;
