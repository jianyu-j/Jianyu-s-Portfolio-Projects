
import React, { useState, useEffect } from 'react';
import { User, Player, MatchResult, Tournament, MessageThread, NtrpLevel, Challenge } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../ui/Button';

// SVG Icons for replacing emojis
const LocationIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const StarIcon = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
    <svg className={className} viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const BoltIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
);

const TrophyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const UsersIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BellIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const WarningIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const SwordsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" />
    </svg>
);

const ClipboardIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const TennisBallIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1" fill="currentColor" />
        <path strokeWidth="1.5" fill="none" d="M12 2c-2.5 2.5-2.5 6.5 0 10s2.5 7.5 0 10" stroke="rgba(255,255,255,0.5)" />
        <path strokeWidth="1.5" fill="none" d="M2 12c2.5-2.5 6.5-2.5 10 0s7.5 2.5 10 0" stroke="rgba(255,255,255,0.5)" />
    </svg>
);
import StreaksAchievements from './components/StreaksAchievements';
import ActivityFeed from './components/ActivityFeed';
// Phase 9 - Messaging Improvements
import EnhancedMessageThread from './components/EnhancedMessageThread';
import QuickReplyBar from './components/QuickReplyBar';
import AvailabilityCard from './components/AvailabilityCard';
import TypingIndicator from './components/TypingIndicator';

// Phase 10 - Profile & Court Finder
import ProfileCompleteness from './components/ProfileCompleteness';
import ProfileStats from './components/ProfileStats';
import PreferredCourts from './components/PreferredCourts';
import ReferralSection from './components/ReferralSection';
import CourtFinder from './components/CourtFinder';
import PlayerProfileView, { getMockPlayerProfile } from './components/PlayerProfileView';

// New Tab Components
import HomeTab from './tabs/HomeTab';
import BallParkTab from './tabs/BallParkTab';
import MatchUpTab from './tabs/MatchUpTab';
import CoachesTab from './tabs/CoachesTab';
import MessagesTab from './tabs/MessagesTab';
import NotificationBell from '../Notifications/NotificationBell';
import { Notification } from '../../types';
import ConnectionsTab from '../Shared/ConnectionsTab';

// --- MOCK DATA (extracted to separate file) ---
import {
    CITIES,
    MOCK_PARTNERS,
    MOCK_INSTANT_MATCH_PLAYERS,
    MOCK_INDEPENDENT_COACHES,
    MOCK_CLUBS_LIST,
    MOCK_LOCAL_TOURNAMENTS,
    INITIAL_MATCH_RESULTS,
    INITIAL_MESSAGES,
    MOCK_CHALLENGES,
    MOCK_HEAD_TO_HEAD,
    MOCK_LEADERBOARD,
    INPUT_STYLE,
    SELECT_STYLE,
} from './data/mockData';

interface Connection {
    id: number;
    name: string;
    date: string;
    status: 'Connected' | 'Pending Received' | 'Pending Sent';
    message?: string;
}

const DatalistCities = () => (
    <datalist id="cities">
        {CITIES.map(c => <option key={c} value={c} />)}
    </datalist>
);

interface PlayerViewProps {
    user: User;
    onLogout: () => void;
}

type Tab = 'HOME' | 'PROFILE' | 'BALL_PARK' | 'CONNECTIONS' | 'MATCH_UP' | 'COURTS' | 'COACHES' | 'CLUBS' | 'TOURNAMENTS' | 'MESSAGES';

export const PlayerView: React.FC<PlayerViewProps> = ({ user, onLogout }) => {
    const [player, setPlayer] = useState<Player | undefined>(storageService.getPlayers().find(p => p.id === user.linkedEntityId));
    const [activeTab, setActiveTab] = useState<Tab>('HOME');
    
    // --- STATE ---
    const [selfAssessment, setSelfAssessment] = useState(player?.selfAssessment || { fh: 8.0, bh: 6.0, serve: 7.0, volley: 5.0 });
    const [matchResults, setMatchResults] = useState<MatchResult[]>(INITIAL_MATCH_RESULTS);
    
    const [myConnections, setMyConnections] = useState<Connection[]>([
        { id: 1, name: 'Alex Thompson', date: 'Jan 15', status: 'Connected' },
        { id: 2, name: 'Maria Garcia', date: 'Jan 10', status: 'Connected' },
        { id: 101, name: 'Tom Brown', date: 'Today', status: 'Pending Received', message: 'Hey, saw you play at Stanley Park. Want to hit?' },
        { id: 102, name: 'Mike Johnson', date: 'Jan 16', status: 'Pending Sent' },
    ]);

    const [threads, setThreads] = useState<MessageThread[]>(INITIAL_MESSAGES);
    const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
    const [messageInput, setMessageInput] = useState('');

    const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
    const [challengeTab, setChallengeTab] = useState<'RECEIVED' | 'SENT' | 'UPCOMING'>('RECEIVED');
    const [challengeForm, setChallengeForm] = useState({
        date: '',
        time: '',
        location: '',
        matchType: 'Friendly',
        message: ''
    });

    // Instant Match State
    const [imFilters, setImFilters] = useState({
        date: 'Today',
        time: 'ASAP',
        location: 'Vancouver, BC',
        level: 'My level ± 0.5'
    });
    const [imResults, setImResults] = useState<any[]>([]);
    const [hasSearchedIm, setHasSearchedIm] = useState(false);

    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', type: 'message', title: 'New message from Alex', message: 'Want to hit tomorrow?', timestamp: '2 hours ago', isRead: false },
        { id: '2', type: 'booking_approved', title: 'Lesson Confirmed', message: 'Coach Mike confirmed your Saturday lesson', timestamp: '5 hours ago', isRead: false },
        { id: '4', type: 'event_reminder', title: 'Event Tomorrow', message: 'Saturday Morning Hit starts at 9am', timestamp: 'Yesterday', isRead: true },
    ]);

    const handleMarkNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkNotificationRead(notification.id);
        // Navigate based on notification type
        if (notification.type === 'message') setActiveTab('MESSAGES');
        else if (notification.type.includes('booking')) setActiveTab('COACHES');
        else if (notification.type === 'event_reminder') setActiveTab('MATCH_UP');
    };

    // Leaderboard State
    const [leaderboardLevel, setLeaderboardLevel] = useState('NTRP 3.5');
    const [leaderboardPeriod, setLeaderboardPeriod] = useState('This Month');
    const [showShareRanking, setShowShareRanking] = useState(false);
    const [viewingLeaderboardPlayer, setViewingLeaderboardPlayer] = useState<any>(null);
    const [visibleLeaderboardCount, setVisibleLeaderboardCount] = useState(10);

    const [settings, setSettings] = useState({
        emailNotifs: true,
        msgAlerts: true,
        connAlerts: true,
        publicProfile: true,
        publicAvailability: true
    });

    const [myTournaments, setMyTournaments] = useState<any[]>([
        { id: 'mt1', name: 'Vancouver Open 3.5', date: 'Jan 25-26, 2025', location: 'Stanley Park Courts', events: ['Singles', 'Doubles'], status: 'Confirmed' }
    ]);

    // --- MODAL STATES ---
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showUpdateRatings, setShowUpdateRatings] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAddResult, setShowAddResult] = useState(false);
    const [showConnectRequest, setShowConnectRequest] = useState<any | null>(null);
    const [showAddTournament, setShowAddTournament] = useState(false);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState<{id: number, name: string} | null>(null);
    const [showChallengeModal, setShowChallengeModal] = useState<any | null>(null); 
    const [showChangePassword, setShowChangePassword] = useState(false);
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const [viewingPartner, setViewingPartner] = useState<any | null>(null);
    const [viewingCoach, setViewingCoach] = useState<any | null>(null);
    const [viewingClub, setViewingClub] = useState<any | null>(null);
    const [viewingPlayerProfile, setViewingPlayerProfile] = useState<string | null>(null);
    
    // Ref for scrolling to bio
    const bioSectionRef = React.useRef<HTMLDivElement>(null);

    const [connTab, setConnTab] = useState<'CONNECTED' | 'RECEIVED' | 'SENT'>('CONNECTED');
    const [coachSearch, setCoachSearch] = useState('');
    const [clubLocation, setClubLocation] = useState('Vancouver, BC');
    const [tourneySubTab, setTourneySubTab] = useState<'MY_TOURNAMENTS' | 'WORLD_TOUR' | 'MY_RECORD' | 'REGISTERED' | 'LEADERBOARD'>('MY_TOURNAMENTS');

    const [partnerFilters, setPartnerFilters] = useState({
        search: '',
        ntrp: 'Any',
        location: 'Any',
        availability: 'Any',
        style: 'Any'
    });

    const [connectMessage, setConnectMessage] = useState('');
    const [editProfileForm, setEditProfileForm] = useState<Partial<Player>>({});
    const [ratingForm, setRatingForm] = useState(selfAssessment);
    const [tourneyForm, setTourneyForm] = useState({ name: '', date: '', location: '', events: { singles: true, doubles: false }, status: 'Confirmed' });
    const [resultForm, setResultForm] = useState({
        result: 'W', opponent: '', score: '', tournament: '', surface: 'Hard', type: 'Singles'
    });

    const unreadCount = threads.filter(t => t.unread).length;

    if (!player) return <div className="p-10 text-center text-white">Loading Profile...</div>;

    const getMutualSlots = (me: Player, partner: any) => {
        if (!me.availability || !partner.availabilityObj) return 0;
        let count = 0;
        Object.keys(me.availability).forEach(day => {
            const myTimes = me.availability![day] || [];
            const partnerTimes = partner.availabilityObj[day] || [];
            const overlap = myTimes.filter(t => partnerTimes.includes(t));
            count += overlap.length;
        });
        return count;
    };

    // --- LOGIC FUNCTIONS ---
    const handleOpenChallengeModal = (partner: any) => {
        setChallengeForm({ date: '', time: '', location: 'Stanley Park Courts', matchType: 'Friendly', message: '' });
        setShowChallengeModal(partner);
    };

    const handleSendChallenge = () => {
        if (!showChallengeModal || !challengeForm.date || !challengeForm.time || !challengeForm.location) {
            alert('Please fill in all required fields.');
            return;
        }
        const newChallenge: Challenge = {
            id: Date.now().toString(),
            fromUserId: 'me',
            fromUserName: 'Me',
            toUserId: showChallengeModal.id.toString(),
            toUserName: showChallengeModal.name,
            date: challengeForm.date,
            time: challengeForm.time,
            location: challengeForm.location,
            matchType: challengeForm.matchType as any,
            message: challengeForm.message,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        setChallenges(prev => [newChallenge, ...prev]);
        setShowChallengeModal(null);
        alert(`Challenge sent to ${showChallengeModal.name}!`);
    };

    const handleAcceptChallenge = (id: string) => {
        setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: 'Accepted' } : c));
        alert('Challenge accepted! See you on the court!');
    };

    const handleDeclineChallenge = (id: string) => {
        setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: 'Declined' } : c));
        alert('Challenge declined.');
    };

    const handleConnect = (partner: any) => {
        if (partner.connectionSetting === 'Auto') {
            alert(`Connected with ${partner.name}!`);
            setMyConnections(prev => [...prev, { id: partner.id, name: partner.name, date: 'Today', status: 'Connected' }]);
        } else {
            setConnectMessage(`Hi! I'm also a ${player.currentNtrp} player, would love to hit sometime.`);
            setShowConnectRequest(partner);
        }
    };

    const sendConnectionRequest = () => {
        if (showConnectRequest) {
            alert(`Request sent to ${showConnectRequest.name}!`);
            setMyConnections(prev => [...prev, { id: showConnectRequest.id, name: showConnectRequest.name, date: 'Today', status: 'Pending Sent', message: connectMessage }]);
            setShowConnectRequest(null);
        }
    };

    const handleAcceptConnection = (id: number, name: string) => {
        setMyConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'Connected' } : c));
        alert(`Connected with ${name}!`);
    };

    const handleDeclineConnection = (id: number) => {
        setMyConnections(prev => prev.filter(c => c.id !== id));
        alert('Request declined');
    };

    const handleCancelRequest = (id: number) => {
        setMyConnections(prev => prev.filter(c => c.id !== id));
        alert('Request cancelled');
    };

    const handleRemoveConnection = () => {
        if (showRemoveConfirm) {
            setMyConnections(prev => prev.filter(c => c.id !== showRemoveConfirm.id));
            setShowRemoveConfirm(null);
            alert('Removed from connections');
        }
    };

    const openMessages = (partnerName?: string) => {
        setShowMessages(true);
        if (partnerName) {
            const existing = threads.find(t => t.participantName === partnerName);
            if (existing) {
                setSelectedThread(existing);
                if (existing.unread) {
                    setThreads(prev => prev.map(t => t.id === existing.id ? { ...t, unread: false } : t));
                }
            } else {
                const newThread: MessageThread = {
                    id: Date.now().toString(),
                    participantName: partnerName,
                    lastMessage: '',
                    lastMessageTime: 'Just now',
                    unread: false,
                    isOnline: true,
                    messages: []
                };
                setThreads(prev => [newThread, ...prev]);
                setSelectedThread(newThread);
            }
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedThread) return;
        const newMessage = {
            id: Date.now().toString(),
            senderName: 'Me',
            content: messageInput,
            timestamp: 'Just now',
            isMe: true
        };
        const updatedThread = {
            ...selectedThread,
            messages: [...selectedThread.messages, newMessage],
            lastMessage: messageInput,
            lastMessageTime: 'Just now'
        };
        setThreads(prev => prev.map(t => t.id === selectedThread.id ? updatedThread : t));
        setSelectedThread(updatedThread);
        setMessageInput('');
    };

    const handleRequestLesson = (coachName: string) => {
        setViewingCoach(null); 
        openMessages(coachName);
        setMessageInput(`Hi Coach ${coachName.split(' ')[0]}, I'm interested in taking lessons. Are you taking new students?`);
    };

    const handleAddResult = () => {
        if (!resultForm.opponent || !resultForm.score) {
            alert("Please fill in opponent and score.");
            return;
        }
        const newResult: MatchResult = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
            opponentName: resultForm.opponent,
            tournamentName: resultForm.tournament || 'Practice Match',
            round: 'Round 1',
            score: resultForm.score,
            result: resultForm.result as 'W' | 'L',
            surface: resultForm.surface as any,
            type: resultForm.type as any
        };
        setMatchResults(prev => [newResult, ...prev]);
        setShowAddResult(false);
        setResultForm({ result: 'W', opponent: '', score: '', tournament: '', surface: 'Hard', type: 'Singles' });
        alert("Result saved!");
    };

    const handleAvailabilityToggle = (day: string, time: string) => {
        if (!player) return;
        const currentDayAvail = player.availability?.[day] || [];
        const isSelected = currentDayAvail.includes(time);
        const newDayAvail = isSelected ? currentDayAvail.filter(t => t !== time) : [...currentDayAvail, time];
        const updatedAvailability = { ...player.availability, [day]: newDayAvail };
        setPlayer({ ...player, availability: updatedAvailability });
    };

    const handleUpdateRatings = () => {
        setSelfAssessment(ratingForm);
        setShowUpdateRatings(false);
    };

    const handleSaveProfile = () => {
        if (player) {
            const updated = { ...player, ...editProfileForm };
            setPlayer(updated);
        }
        setShowEditProfile(false);
    };

    const handleAddTournament = () => {
        const events = [];
        if (tourneyForm.events.singles) events.push('Singles');
        if (tourneyForm.events.doubles) events.push('Doubles');
        setMyTournaments(prev => [...prev, { 
            id: Date.now().toString(), 
            name: tourneyForm.name, 
            date: tourneyForm.date, 
            location: tourneyForm.location, 
            events, 
            status: tourneyForm.status 
        }]);
        setShowAddTournament(false);
        setTourneyForm({ name: '', date: '', location: '', events: { singles: true, doubles: false }, status: 'Confirmed' });
    };

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDeleteAccount = () => {
        if (deleteInput === 'DELETE') {
            alert('Account deleted.');
            onLogout();
        }
    };

    const handleInstantMatchSearch = () => {
        setHasSearchedIm(true);
        // Mock filter logic - In reality this would call an API
        const results = MOCK_INSTANT_MATCH_PLAYERS.filter(p => {
            const matchesLoc = imFilters.location === p.city;
            // Simple logic for level
            return matchesLoc;
        });
        // For demo, if no results match location exactly, return none to show empty state,
        // or return all if generic filter.
        // Let's just return all mock data if location matches Vancouver, otherwise empty
        if (imFilters.location.includes('Vancouver')) {
            setImResults(MOCK_INSTANT_MATCH_PLAYERS);
        } else {
            setImResults([]);
        }
    };

    const handleInstantChallenge = (partner: any) => {
        setChallengeForm({
            date: imFilters.date === 'Today' ? new Date().toISOString().split('T')[0] : '', 
            time: imFilters.time === 'ASAP' ? '14:00' : '',
            location: imFilters.location,
            matchType: 'Friendly',
            message: 'Hey! Found you on Instant Match. Up for a game?'
        });
        setShowChallengeModal(partner);
    };

    const handleActivityChallenge = (playerName: string) => {
        const partner = MOCK_PARTNERS.find(p => p.name === playerName) || { id: 999, name: playerName, location: 'Unknown', ntrp: 'Unknown', img: null }; 
        handleOpenChallengeModal(partner);
    };

    const handleActivityProfile = (playerName: string) => {
        const partner = MOCK_PARTNERS.find(p => p.name === playerName);
        if (partner) {
            setViewingPartner(partner);
        } else {
            alert("Profile details not available for this user.");
        }
    };

    // --- RENDERERS ---

    const renderHeaderIcons = () => (
        <div className="flex items-center gap-2">
            <button onClick={() => openMessages()} className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-portal-player rounded-full text-[10px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    );

    const renderProfile = () => {
        if (!player) return null;
        
        // Calculate Win %
        const wins = matchResults.filter(m => m.result === 'W').length;
        const totalMatches = matchResults.length;
        const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

        return (
            <div className="space-y-6 animate-fadeIn">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-tennis-500 to-tennis-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <UserIcon className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                                <p className="text-gray-500 flex items-center gap-1">
                                    <LocationIcon className="w-4 h-4" /> {player.city} • NTRP {player.currentNtrp}
                                </p>
                            </div>
                            <Button variant="secondary" onClick={() => { setEditProfileForm(player); setShowEditProfile(true); }} className="text-xs">Edit Profile</Button>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Matches</p>
                                <p className="text-xl font-bold text-gray-900">{totalMatches}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Win Rate</p>
                                <p className="text-xl font-bold text-green-600">{winRate}%</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Rank</p>
                                <p className="text-xl font-bold text-blue-600">#12</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Style</p>
                                <p className="text-lg font-bold text-gray-800">{player.style || 'All-court'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streaks & Achievements - moved up */}
                <StreaksAchievements />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Self Assessment / Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Self Assessment</h3>
                            <button onClick={() => { setRatingForm(selfAssessment); setShowUpdateRatings(true); }} className="text-xs text-tennis-600 hover:underline">Update</button>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(selfAssessment).map(([key, val]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-600 capitalize">{key}</span>
                                        <span className="text-sm font-bold text-gray-900">{val.toFixed(1)}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-tennis-500 h-2 rounded-full" style={{ width: `${(val / 10) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bio & Availability */}
                    <div className="space-y-6">
                        <div ref={bioSectionRef} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-4">About Me</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{player.bio || "No bio added yet."}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Availability</h3>
                            <div className="flex flex-wrap gap-2">
                                {player.availability ? (
                                    Object.entries(player.availability).map(([day, times]) => (
                                        times.length > 0 && (
                                            <div key={day} className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">{day}</span>
                                                <span className="text-sm font-bold text-gray-800">{times.join(', ')}</span>
                                            </div>
                                        )
                                    ))
                                ) : <p className="text-sm text-gray-400">No availability set.</p>}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Phase 10 - Profile Enhancements */}
                <ProfileCompleteness 
                    onScrollToBio={() => bioSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    onNavigateToCourtFinder={() => setActiveTab('COURTS')}
                />
                <ProfileStats />
                <PreferredCourts />
                <ReferralSection />
            </div>
        );
    };

    const renderTournaments = () => {
        return (
             <div className="space-y-4 animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-7 h-7 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Tournaments
                    </h2>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 border-b border-gray-200 pb-2">
                    {[
                        { id: 'MY_TOURNAMENTS', label: 'My Tournaments' },
                        { id: 'WORLD_TOUR', label: 'World Tour' },
                        { id: 'MY_RECORD', label: 'My Record' },
                        { id: 'REGISTERED', label: 'Registered' },
                        { id: 'LEADERBOARD', label: 'Leaderboard' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setTourneySubTab(tab.id as any)}
                            className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative ${
                                tourneySubTab === tab.id
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            {tourneySubTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-tennis-600" />
                            )}
                        </button>
                    ))}
                </div>

                {tourneySubTab === 'MY_TOURNAMENTS' && (
                    <div className="space-y-4">
                        {/* Upcoming Schedule Section */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="font-semibold text-gray-900">Upcoming Schedule</h3>
                            </div>
                            <Button className="text-xs" onClick={() => setShowAddTournament(true)}>+ Add Manual Entry</Button>
                        </div>
                        
                        {myTournaments.length > 0 ? myTournaments.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-tennis-600 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{t.name}</h4>
                                        <p className="text-sm text-gray-500 mt-0.5">{t.date} - {t.location}</p>
                                        <div className="flex gap-1.5 mt-2">
                                            {t.events?.map((e: string) => (
                                                <span key={e} className="text-xs bg-tennis-50 text-tennis-700 px-2 py-0.5 rounded-full font-medium">{e}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded ${t.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">No upcoming tournaments scheduled.</p>
                            </div>
                        )}
                        
                        {/* Local Events Section */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Local Events (Registration Open)
                            </h3>
                            <div className="space-y-3">
                                {MOCK_LOCAL_TOURNAMENTS.map(t => (
                                    <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-tennis-300 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                                                <p className="text-sm text-gray-500 mt-0.5">{t.date} - {t.location}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs bg-tennis-50 text-tennis-700 px-2 py-0.5 rounded-full font-medium">{t.level}</span>
                                                    <span className="text-xs text-gray-400">{t.format}</span>
                                                </div>
                                            </div>
                                            <Button variant="secondary" className="text-xs" onClick={() => window.open(t.registrationUrl, '_blank')}>
                                                Register ({t.fee})
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tourneySubTab === 'MY_RECORD' && (
                    <div className="space-y-4">
                        {/* Header Card */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-tennis-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Match Log</h3>
                                    <p className="text-sm text-gray-500">
                                        <span className="text-green-600 font-medium">{matchResults.filter(r => r.result === 'W').length}W</span>
                                        <span className="mx-1">-</span>
                                        <span className="text-red-500 font-medium">{matchResults.filter(r => r.result === 'L').length}L</span>
                                    </p>
                                </div>
                            </div>
                            <Button className="text-xs" onClick={() => setShowAddResult(true)}>+ Add Result</Button>
                        </div>
                        
                        {/* Results Table */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="text-xs text-gray-500 uppercase font-medium">
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Event</th>
                                        <th className="p-3">Opponent</th>
                                        <th className="p-3">Score</th>
                                        <th className="p-3">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {matchResults.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-gray-500 text-xs">{r.date}</td>
                                            <td className="p-3 font-medium text-gray-900">{r.tournamentName}</td>
                                            <td className="p-3 text-gray-700">{r.opponentName}</td>
                                            <td className="p-3 font-mono text-gray-700">{r.score}</td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${r.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                    {r.result}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tourneySubTab === 'REGISTERED' && (
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">No Registered Events</h3>
                            <p className="text-sm text-gray-500 mb-4">You haven't officially registered for any Tennis BC events through this portal yet.</p>
                            <button
                                onClick={() => setTourneySubTab('MY_TOURNAMENTS')}
                                className="px-4 py-2 bg-tennis-600 text-white font-semibold rounded-lg hover:bg-tennis-700 transition-colors"
                            >
                                Browse Events
                            </button>
                        </div>
                    </div>
                )}

                {tourneySubTab === 'WORLD_TOUR' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">ATP/WTA Live Updates</h3>
                        <p className="text-sm text-gray-500">Live scores integration coming soon.</p>
                    </div>
                )}

                {tourneySubTab === 'LEADERBOARD' && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-gray-200 bg-gray-50 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-tennis-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Local Leaderboard</h3>
                                    <p className="text-sm text-gray-500">Vancouver, BC - 128 players</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    className="bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    value={leaderboardLevel}
                                    onChange={(e) => setLeaderboardLevel(e.target.value)}
                                >
                                    <option value="NTRP 3.5">Level: NTRP 3.5</option>
                                    <option value="NTRP 4.0">Level: NTRP 4.0</option>
                                    <option value="NTRP 4.5">Level: NTRP 4.5</option>
                                </select>
                                <select 
                                    className="bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    value={leaderboardPeriod}
                                    onChange={(e) => setLeaderboardPeriod(e.target.value)}
                                >
                                    <option value="This Month">Period: This Month</option>
                                    <option value="This Year">Period: This Year</option>
                                    <option value="All Time">Period: All Time</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs text-gray-500 uppercase font-medium border-b border-gray-200 bg-gray-50">
                                        <th className="py-3 pl-4 w-16 text-center">Rank</th>
                                        <th className="py-3">Player</th>
                                        <th className="py-3 text-center">W-L</th>
                                        <th className="py-3 text-center">Win %</th>
                                        <th className="py-3 text-right pr-4">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {MOCK_LEADERBOARD.slice(0, visibleLeaderboardCount).map((p) => (
                                        <tr 
                                            key={p.id} 
                                            onClick={() => setViewingLeaderboardPlayer(p)}
                                            className={`transition-colors cursor-pointer ${
                                                p.isCurrentUser 
                                                    ? 'bg-tennis-50 hover:bg-tennis-100' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <td className="py-4 pl-4 text-center">
                                                {p.rank <= 3 ? (
                                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                        p.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                        p.rank === 2 ? 'bg-gray-200 text-gray-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {p.rank}
                                                    </span>
                                                ) : (
                                                    <span className={`font-medium ${p.isCurrentUser ? 'text-tennis-600' : 'text-gray-500'}`}>
                                                        {p.rank}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                                                        p.isCurrentUser 
                                                            ? 'bg-tennis-100 text-tennis-700 border-2 border-tennis-300' 
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${p.isCurrentUser ? 'text-tennis-700' : 'text-gray-900'}`}>
                                                            {p.name}
                                                            {p.isCurrentUser && (
                                                                <span className="ml-1.5 text-xs bg-tennis-100 text-tennis-600 px-1.5 py-0.5 rounded font-medium">You</span>
                                                            )}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            {p.rankChange > 0 && <span className="text-xs text-green-600 font-medium">+{p.rankChange}</span>}
                                                            {p.rankChange < 0 && <span className="text-xs text-red-500 font-medium">{p.rankChange}</span>}
                                                            {p.rankChange === 0 && <span className="text-xs text-gray-400">-</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center text-gray-600">{p.wins}-{p.losses}</td>
                                            <td className="py-4 text-center text-gray-600">{Math.round((p.wins / (p.wins + p.losses)) * 100)}%</td>
                                            <td className={`py-4 text-right pr-4 font-mono font-bold ${p.isCurrentUser ? 'text-tennis-600' : 'text-gray-900'}`}>{p.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {visibleLeaderboardCount < MOCK_LEADERBOARD.length && (
                            <button 
                                onClick={() => setVisibleLeaderboardCount(prev => prev + 5)}
                                className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors"
                            >
                                Load More...
                            </button>
                        )}

                        {/* Your Stats Card */}
                        <div className="p-4 bg-tennis-50 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-tennis-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Your Ranking</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-gray-900">#4</span>
                                            <span className="text-sm text-gray-500">of 128</span>
                                        </div>
                                        <p className="text-xs text-tennis-600 mt-0.5">Win 2 more matches to reach #3</p>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase">Total Points</p>
                                    <p className="text-2xl font-bold text-tennis-600">850</p>
                                </div>
                                <button 
                                    onClick={() => setShowShareRanking(true)}
                                    className="px-5 py-2.5 bg-tennis-600 hover:bg-tennis-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share Ranking
                                </button>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        );
    };

    const renderInstantMatch = () => (
        <div className="bg-slate-900 bg-gradient-to-br from-lime-500/10 to-lime-500/5 border border-lime-500/20 rounded-2xl p-6 mb-6 animate-fadeIn">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="animate-pulse text-lime-400"><BoltIcon className="w-5 h-5" /></span> INSTANT MATCH
                </h2>
                <p className="text-gray-400 text-sm mt-1">Find someone to play with RIGHT NOW</p>
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-wrap gap-3 mb-4">
                {/* Date Dropdown */}
                <select 
                    value={imFilters.date}
                    onChange={(e) => setImFilters({...imFilters, date: e.target.value})}
                    className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 text-sm focus:outline-none focus:border-lime-500/50 cursor-pointer"
                >
                    <option className="text-black">Today</option>
                    <option className="text-black">Tomorrow</option>
                    <option className="text-black">This Saturday</option>
                    <option className="text-black">This Sunday</option>
                </select>
                
                {/* Time Dropdown */}
                <select 
                    value={imFilters.time}
                    onChange={(e) => setImFilters({...imFilters, time: e.target.value})}
                    className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 text-sm focus:outline-none focus:border-lime-500/50 cursor-pointer"
                >
                    <option className="text-black">ASAP</option>
                    <option className="text-black">Morning (6am-12pm)</option>
                    <option className="text-black">Afternoon (12pm-5pm)</option>
                    <option className="text-black">Evening (5pm-9pm)</option>
                </select>
                
                {/* Location Dropdown */}
                <select 
                    value={imFilters.location}
                    onChange={(e) => setImFilters({...imFilters, location: e.target.value})}
                    className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 text-sm focus:outline-none focus:border-lime-500/50 cursor-pointer"
                >
                    {CITIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>

                {/* Level Dropdown */}
                <select 
                    value={imFilters.level}
                    onChange={(e) => setImFilters({...imFilters, level: e.target.value})}
                    className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 text-sm focus:outline-none focus:border-lime-500/50 cursor-pointer"
                >
                    <option className="text-black">My level (3.5) ± 0.5</option>
                    <option className="text-black">Any level</option>
                    <option className="text-black">My level only (3.5)</option>
                    <option className="text-black">My level ± 1.0</option>
                </select>
            </div>
            
            {/* Main CTA Button */}
            {!hasSearchedIm && (
                <div className="text-center mt-6">
                    <button 
                        onClick={handleInstantMatchSearch}
                        className="bg-gradient-to-r from-lime-400 to-lime-500 text-slate-900 text-lg font-bold px-12 py-4 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-lime-500/40 transition-all duration-300"
                    >
                        Find Available Players
                    </button>
                </div>
            )}

            {/* Results Section */}
            {hasSearchedIm && (
                <div className="mt-6 border-t border-white/10 pt-4 animate-slideDown">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-white font-semibold">
                            <span className="text-lime-400">{imResults.length}</span> PLAYERS AVAILABLE
                        </p>
                        <button 
                            onClick={() => setHasSearchedIm(false)} 
                            className="text-gray-400 text-sm hover:text-white transition-colors"
                        >
                            Modify Search
                        </button>
                    </div>

                    {imResults.length > 0 ? (
                        <div className="space-y-3">
                            {imResults.map(p => (
                                <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-lime-500/30 hover:bg-white/8 transition-all duration-200">
                                    {/* Online Indicator */}
                                    <div className="flex justify-end mb-2">
                                        <div className="flex items-center gap-1">
                                            <span className={`w-3 h-3 rounded-full ${p.isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`}></span>
                                            {!p.isOnline && <span className="text-[10px] text-gray-400">{p.lastActive}</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-slate-900 font-bold text-lg">
                                            {p.initials}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold text-lg">{p.name}</p>
                                            <p className="text-gray-400 text-sm flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-yellow-400" /> {p.ntrp} • <LocationIcon className="w-3.5 h-3.5" /> {p.distance} km away</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        {p.availableAllDay ? (
                                            <p className="text-green-400 font-medium text-sm flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Available all day</p>
                                        ) : p.limitedAvailability ? (
                                            <p className="text-yellow-400 font-medium text-sm flex items-center gap-1"><WarningIcon className="w-4 h-4" /> {p.availabilityStatus}</p>
                                        ) : (
                                            <p className="text-green-400 font-medium text-sm flex items-center gap-1"><CheckIcon className="w-4 h-4" /> {p.availabilityStatus}</p>
                                        )}
                                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><TrophyIcon className="w-3.5 h-3.5" /> Rank #{p.rank} in {p.city.split(',')[0]}</p>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setViewingPartner(p)}
                                            className="flex-1 bg-white/10 text-white px-4 py-2.5 rounded-full hover:bg-white/20 transition-all text-sm font-bold"
                                        >
                                            View Profile
                                        </button>
                                        <button 
                                            onClick={() => handleInstantChallenge(p)}
                                            className="flex-1 bg-gradient-to-r from-lime-400 to-lime-500 text-slate-900 px-4 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-lime-500/30 transition-all"
                                        >
                                            Challenge Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-gray-400 mb-3"><UsersIcon className="w-8 h-8 mx-auto" /></p>
                            <p className="text-white font-semibold mb-4">No players available right now</p>
                            
                            <div className="text-gray-400 text-sm mb-6 text-left max-w-xs mx-auto">
                                <p className="mb-2">Try:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Different time or date</li>
                                    <li>• Expanding your level range</li>
                                    <li>• Different location</li>
                                </ul>
                            </div>
                            
                            <button className="bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all text-sm font-bold">
                                Notify me when available
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderMyChallenges = () => {
        const received = challenges.filter(c => c.toUserId === 'me' && c.status === 'Pending');
        const sent = challenges.filter(c => c.fromUserId === 'me' && c.status === 'Pending');
        const upcoming = challenges.filter(c => c.status === 'Accepted');

        const activeList = challengeTab === 'RECEIVED' ? received : challengeTab === 'SENT' ? sent : upcoming;

        return (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1"><SwordsIcon className="w-4 h-4" /> MY CHALLENGES</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setChallengeTab('RECEIVED')} className={`px-2 py-1 rounded text-xs ${challengeTab === 'RECEIVED' ? 'bg-orange-100 text-orange-700 font-bold' : 'text-gray-500'}`}>Received ({received.length})</button>
                        <button onClick={() => setChallengeTab('SENT')} className={`px-2 py-1 rounded text-xs ${challengeTab === 'SENT' ? 'bg-orange-100 text-orange-700 font-bold' : 'text-gray-500'}`}>Sent ({sent.length})</button>
                        <button onClick={() => setChallengeTab('UPCOMING')} className={`px-2 py-1 rounded text-xs ${challengeTab === 'UPCOMING' ? 'bg-orange-100 text-orange-700 font-bold' : 'text-gray-500'}`}>Upcoming ({upcoming.length})</button>
                    </div>
                </div>

                <div className="space-y-3">
                    {activeList.map(c => (
                        <div key={c.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                            <div className="flex justify-between mb-2">
                                <p className="text-sm font-bold text-gray-800">
                                    {challengeTab === 'RECEIVED' ? c.fromUserName : c.toUserName}
                                </p>
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{c.matchType}</span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1 mb-3">
                                <p className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {new Date(c.date).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})} at {c.time}</p>
                                <p className="flex items-center gap-1"><LocationIcon className="w-3.5 h-3.5" /> {c.location}</p>
                                {c.message && <p className="italic text-gray-500">"{c.message}"</p>}
                            </div>
                            
                            <div className="flex gap-2">
                                {challengeTab === 'RECEIVED' && (
                                    <>
                                        <Button className="flex-1 text-xs py-1.5 bg-gradient-to-r from-green-500 to-green-600 border-none" onClick={() => handleAcceptChallenge(c.id)}>Accept</Button>
                                        <Button className="flex-1 text-xs py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 border-none" onClick={() => handleDeclineChallenge(c.id)}>Decline</Button>
                                    </>
                                )}
                                {challengeTab === 'SENT' && (
                                    <Button className="w-full text-xs py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 border-none" onClick={() => handleDeclineChallenge(c.id)}>Cancel Request</Button>
                                )}
                                {challengeTab === 'UPCOMING' && (
                                    <Button className="w-full text-xs py-1.5 bg-tennis-600 border-none" onClick={() => {}}>Message Opponent</Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {activeList.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No challenges in this list.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderFindPartners = () => {
        const connected = myConnections.filter(c => c.status === 'Connected');
        const received = myConnections.filter(c => c.status === 'Pending Received');
        const sent = myConnections.filter(c => c.status === 'Pending Sent');

        const filteredPartners = MOCK_PARTNERS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(partnerFilters.search.toLowerCase());
            const matchesNtrp = partnerFilters.ntrp === 'Any' || p.ntrp === partnerFilters.ntrp;
            const matchesLocation = partnerFilters.location === 'Any' || p.location.toLowerCase().includes(partnerFilters.location.toLowerCase());
            const matchesAvailability = partnerFilters.availability === 'Any' || p.availability.includes(partnerFilters.availability.split(' ')[0]);
            const matchesStyle = partnerFilters.style === 'Any' || p.style === partnerFilters.style;
            
            return matchesSearch && matchesNtrp && matchesLocation && matchesAvailability && matchesStyle;
        });

        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">FIND PARTNERS</h2>
                
                {renderInstantMatch()}
                
                {renderMyChallenges()}

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {/* NTRP Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-tennis-500 cursor-pointer"
                                value={partnerFilters.ntrp}
                                onChange={e => setPartnerFilters({...partnerFilters, ntrp: e.target.value})}
                            >
                                <option value="Any">NTRP: Any</option>
                                <option value="3.0">3.0</option>
                                <option value="3.5">3.5</option>
                                <option value="4.0">4.0</option>
                                <option value="4.5">4.5</option>
                            </select>
                            <span className="absolute right-2 top-2 text-[10px] pointer-events-none">▼</span>
                        </div>

                        {/* Location Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-tennis-500 cursor-pointer"
                                value={partnerFilters.location}
                                onChange={e => setPartnerFilters({...partnerFilters, location: e.target.value})}
                            >
                                <option value="Any">Location: Any</option>
                                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                            <span className="absolute right-2 top-2 text-[10px] pointer-events-none">▼</span>
                        </div>

                        {/* Availability Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-tennis-500 cursor-pointer"
                                value={partnerFilters.availability}
                                onChange={e => setPartnerFilters({...partnerFilters, availability: e.target.value})}
                            >
                                <option value="Any">Availability</option>
                                <option value="Weekdays">Weekdays</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Evenings">Evenings</option>
                            </select>
                            <span className="absolute right-2 top-2 text-[10px] pointer-events-none">▼</span>
                        </div>

                        {/* Style Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-tennis-500 cursor-pointer"
                                value={partnerFilters.style}
                                onChange={e => setPartnerFilters({...partnerFilters, style: e.target.value})}
                            >
                                <option value="Any">Style: Any</option>
                                <option value="Baseline">Baseline</option>
                                <option value="Serve & Volley">Serve & Volley</option>
                                <option value="All-court">All-court</option>
                            </select>
                            <span className="absolute right-2 top-2 text-[10px] pointer-events-none">▼</span>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        className={INPUT_STYLE}
                        value={partnerFilters.search}
                        onChange={e => setPartnerFilters({...partnerFilters, search: e.target.value})}
                    />
                </div>

                {/* Modern Player Cards */}
                <div>
                    <p className="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wide">
                        {filteredPartners.length > 0 ? `Players Near You (${filteredPartners.length} found)` : 'No players found'}
                    </p>
                    
                    {filteredPartners.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPartners.map(p => {
                                const isConnected = myConnections.some(c => c.id === p.id && c.status === 'Connected');
                                const isPending = myConnections.some(c => c.id === p.id && (c.status === 'Pending Sent' || c.status === 'Pending Received'));
                                const mutualSlots = getMutualSlots(player!, p);
                                
                                return (
                                    <div key={p.id} className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
                                        {/* Online Indicator */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                            <div className={`w-3 h-3 rounded-full ${p.isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-300'}`}></div>
                                            {!p.isOnline && <span className="text-[10px] text-gray-400 font-medium">Active {p.lastActive}</span>}
                                        </div>

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
                                                {p.img}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{p.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                                                    <span className="font-bold text-[#a3e635] bg-gray-900 px-1.5 rounded-sm">NTRP {p.ntrp}</span>
                                                    <span>• {p.style}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4 pl-1">
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <span className="flex items-center gap-1"><LocationIcon className="w-3 h-3" /> {p.location}</span>
                                            </p>
                                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {p.availability}</p>
                                                {mutualSlots > 0 && (
                                                    <p className="text-xs font-bold text-[#6fa31d] mt-1 flex items-center gap-1"><SparklesIcon className="w-3 h-3" /> {mutualSlots} slots match your schedule!</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button 
                                                variant="secondary" 
                                                className="flex-1 text-xs py-2 rounded-full border-gray-200 hover:border-[#a3e635] hover:bg-transparent" 
                                                onClick={() => setViewingPartner(p)}
                                            >
                                                Profile
                                            </Button>
                                            
                                            {isConnected ? (
                                                <Button className="flex-1 text-xs py-2 rounded-full bg-green-600 hover:bg-green-700" disabled>Connected</Button>
                                            ) : isPending ? (
                                                <Button className="flex-1 text-xs py-2 rounded-full bg-gray-400 hover:bg-gray-400 cursor-default" disabled>Pending...</Button>
                                            ) : (
                                                <Button 
                                                    className="flex-1 text-xs py-2 rounded-full text-gray-900 font-bold shadow-none"
                                                    style={{ background: 'linear-gradient(135deg, #a3e635, #84cc16)' }}
                                                    onClick={() => handleConnect(p)}
                                                >
                                                    Connect
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                className="flex-1 text-xs py-2 rounded-full text-white font-bold shadow-md hover:scale-105 transition-transform"
                                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                                onClick={() => handleOpenChallengeModal(p)}
                                            >
                                                Challenge
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
                            <div className="mb-2 text-gray-400"><UsersIcon className="w-10 h-10 mx-auto" /></div>
                            <h3 className="font-bold text-gray-800">No players match your filters</h3>
                            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or location.</p>
                        </div>
                    )}
                </div>

                {/* Connections Footer */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-sm">MY CONNECTIONS</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setConnTab('CONNECTED')} className={`px-2 py-1 rounded text-xs ${connTab === 'CONNECTED' ? 'bg-tennis-100 text-tennis-700 font-bold' : 'text-gray-500'}`}>Connected ({connected.length})</button>
                            <button onClick={() => setConnTab('RECEIVED')} className={`px-2 py-1 rounded text-xs ${connTab === 'RECEIVED' ? 'bg-tennis-100 text-tennis-700 font-bold' : 'text-gray-500'}`}>Received ({received.length})</button>
                            <button onClick={() => setConnTab('SENT')} className={`px-2 py-1 rounded text-xs ${connTab === 'SENT' ? 'bg-tennis-100 text-tennis-700 font-bold' : 'text-gray-500'}`}>Sent ({sent.length})</button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {connTab === 'CONNECTED' && connected.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                <span className="text-sm font-bold text-gray-800">{c.name} <span className="text-gray-400 font-normal text-xs">- {c.date}</span></span>
                                <div className="flex gap-2">
                                    <button onClick={() => openMessages(c.name)} className="text-xs text-tennis-600 hover:underline">Message</button>
                                    <button onClick={() => setShowRemoveConfirm({id: c.id, name: c.name})} className="text-xs text-red-400 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                        
                        {connTab === 'RECEIVED' && received.map(c => (
                            <div key={c.id} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-blue-900 text-sm">{c.name}</span>
                                    <span className="text-xs text-blue-400">{c.date}</span>
                                </div>
                                <p className="text-xs text-blue-800 mb-3 italic">"{c.message}"</p>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleAcceptConnection(c.id, c.name)} className="py-1 text-xs h-auto">Accept</Button>
                                    <Button onClick={() => handleDeclineConnection(c.id)} variant="secondary" className="py-1 text-xs h-auto border-blue-200 text-blue-600">Decline</Button>
                                </div>
                            </div>
                        ))}

                        {connTab === 'SENT' && sent.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-gray-500">
                                <span className="text-sm">{c.name}</span>
                                <button onClick={() => handleCancelRequest(c.id)} className="text-xs text-red-400 hover:underline">Cancel Request</button>
                            </div>
                        ))}
                        
                        {((connTab === 'CONNECTED' && connected.length === 0) || (connTab === 'RECEIVED' && received.length === 0) || (connTab === 'SENT' && sent.length === 0)) && (
                            <p className="text-xs text-gray-400 italic p-2">No connections in this list.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderChallengeModal = () => {
        if (!showChallengeModal) return null;
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><SwordsIcon className="w-5 h-5" /> CHALLENGE {showChallengeModal.name.toUpperCase()}</h3>
                        <button onClick={() => setShowChallengeModal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
                                {showChallengeModal.img}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{showChallengeModal.name}</h4>
                                <div className="text-xs text-gray-500 flex gap-2">
                                    <span className="flex items-center gap-1"><StarIcon className="w-3.5 h-3.5 text-yellow-400" /> {showChallengeModal.ntrp}</span>
                                    <span className="flex items-center gap-1"><LocationIcon className="w-3.5 h-3.5" /> {showChallengeModal.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Head to Head */}
                        <div className="bg-gray-900 text-white rounded-xl p-4 mb-6 text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">HEAD-TO-HEAD</p>
                            <div className="flex justify-center items-center gap-6">
                                <div>
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-[10px] text-gray-400">WINS</p>
                                </div>
                                <div className="text-tennis-500 font-bold text-sm">VS</div>
                                <div>
                                    <p className="text-xl font-bold">0</p>
                                    <p className="text-[10px] text-gray-400">LOSSES</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
                                    <input type="date" className={INPUT_STYLE} value={challengeForm.date} onChange={e => setChallengeForm({...challengeForm, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Time</label>
                                    <input type="time" className={INPUT_STYLE} value={challengeForm.time} onChange={e => setChallengeForm({...challengeForm, time: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Location</label>
                                <input type="text" className={INPUT_STYLE} value={challengeForm.location} onChange={e => setChallengeForm({...challengeForm, location: e.target.value})} placeholder="e.g. Stanley Park" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Match Type</label>
                                 <div className="flex gap-2">
                                    {['Friendly', 'Ranking', 'Stakes'].map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => setChallengeForm({...challengeForm, matchType: type})}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border ${challengeForm.matchType === type ? 'bg-tennis-600 text-white border-tennis-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message (Optional)</label>
                                <textarea 
                                    className={`${INPUT_STYLE} h-20`} 
                                    value={challengeForm.message}
                                    onChange={e => setChallengeForm({...challengeForm, message: e.target.value})}
                                    placeholder="Up for a match?"
                                ></textarea>
                            </div>

                            <Button fullWidth onClick={handleSendChallenge}>Send Challenge</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderFindCoach = () => {
         const filteredCoaches = MOCK_INDEPENDENT_COACHES.filter(c => 
            c.name.toLowerCase().includes(coachSearch.toLowerCase()) || 
            c.location.toLowerCase().includes(coachSearch.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">FIND A COACH</h2>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2">
                     <input 
                        type="text" 
                        placeholder="Search coaches by name or location..." 
                        className={INPUT_STYLE}
                        value={coachSearch}
                        onChange={e => setCoachSearch(e.target.value)}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCoaches.map(c => (
                        <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                             <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-tennis-500 to-tennis-600 rounded-full flex items-center justify-center text-2xl text-white shadow-sm">
                                    {c.img}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><LocationIcon className="w-3 h-3" /> {c.location}</p>
                                    <div className="flex items-center gap-1 text-sm mt-1">
                                        <span className="text-yellow-500 font-bold flex items-center gap-0.5"><StarIcon className="w-3.5 h-3.5" /> {c.rating}</span>
                                        <span className="text-gray-400 text-xs">({c.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                                {c.bio}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {c.specialties.map(s => <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{s}</span>)}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="flex-1 text-xs" onClick={() => setViewingCoach(c)}>Profile</Button>
                                <Button className="flex-1 text-xs" onClick={() => handleRequestLesson(c.name)}>Message</Button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        );
    };

    const renderClubs = () => {
         const filteredClubs = MOCK_CLUBS_LIST.filter(c => 
            clubLocation === 'Any' || c.location.toLowerCase().includes(clubLocation.toLowerCase()) || clubLocation === 'Vancouver, BC' // simplified mock filter
        );

        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">CLUBS</h2>
                    <select 
                        value={clubLocation} 
                        onChange={e => setClubLocation(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg p-2 focus:ring-tennis-500 focus:border-tennis-500"
                    >
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClubs.map(club => (
                        <div key={club.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => setViewingClub(club)}>
                            <div className="h-32 bg-gray-200 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-lg">{club.name}</h3>
                                    <p className="text-xs opacity-90">{club.location}</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                                    <span className="flex items-center gap-0.5"><StarIcon className="w-4 h-4 text-yellow-400" /> {club.rating}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                                    {club.amenities.map(a => <span key={a} className="whitespace-nowrap px-2 py-1 bg-gray-50 text-gray-600 text-[10px] uppercase font-bold rounded border border-gray-100">{a}</span>)}
                                </div>
                                <div className="text-xs text-tennis-600 font-bold uppercase hover:underline">View Details →</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderModals = () => {
        return (
            <>
                {/* Viewing Partner Modal */}
                {viewingPartner && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">{viewingPartner.img}</div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{viewingPartner.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1"><LocationIcon className="w-4 h-4" /> {viewingPartner.location}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingPartner(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-gray-50 p-2 rounded"><p className="text-xs text-gray-400 font-bold uppercase">NTRP</p><p className="font-bold text-tennis-600">{viewingPartner.ntrp}</p></div>
                                    <div className="bg-gray-50 p-2 rounded"><p className="text-xs text-gray-400 font-bold uppercase">Style</p><p className="font-bold text-gray-800">{viewingPartner.style}</p></div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bio</p>
                                    <p className="text-sm text-gray-700">{viewingPartner.bio}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Availability</p>
                                    <p className="text-sm text-gray-700">{viewingPartner.availability}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                     <Button fullWidth onClick={() => handleConnect(viewingPartner)}>Connect</Button>
                                     <Button variant="secondary" fullWidth onClick={() => handleOpenChallengeModal(viewingPartner)}>Challenge</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Viewing Leaderboard Player Modal */}
                {viewingLeaderboardPlayer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown">
                            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">PLAYER STATS</h3>
                                <button onClick={() => setViewingLeaderboardPlayer(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
                                        {viewingLeaderboardPlayer.img}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{viewingLeaderboardPlayer.name}</h4>
                                        <div className="text-xs text-gray-500 flex gap-2">
                                            <span className="flex items-center gap-0.5"><StarIcon className="w-4 h-4 text-yellow-400" /> {viewingLeaderboardPlayer.ntrp}</span>
                                            <span className="text-tennis-600 font-bold flex items-center gap-0.5"><TrophyIcon className="w-4 h-4" /> Rank #{viewingLeaderboardPlayer.rank}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">SEASON STATS</p>
                                        <div className="flex justify-around items-center">
                                            <div>
                                                <p className="text-xl font-bold text-gray-900">{viewingLeaderboardPlayer.wins + viewingLeaderboardPlayer.losses}</p>
                                                <p className="text-[10px] text-gray-500">MATCHES</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-200"></div>
                                            <div>
                                                <p className="text-xl font-bold text-green-600">{viewingLeaderboardPlayer.wins}</p>
                                                <p className="text-[10px] text-gray-500">WINS</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-200"></div>
                                            <div>
                                                <p className="text-xl font-bold text-gray-900">{Math.round((viewingLeaderboardPlayer.wins / (viewingLeaderboardPlayer.wins + viewingLeaderboardPlayer.losses)) * 100)}%</p>
                                                <p className="text-[10px] text-gray-500">WIN %</p>
                                            </div>
                                        </div>
                                    </div>

                                    {!viewingLeaderboardPlayer.isCurrentUser && (
                                        <div className="bg-gray-900 text-white rounded-xl p-4 text-center">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">YOUR HEAD-TO-HEAD</p>
                                            <div className="flex justify-center items-center gap-6">
                                                <div>
                                                    <p className="text-xl font-bold">1</p>
                                                    <p className="text-[10px] text-gray-400">YOU</p>
                                                </div>
                                                <div className="text-tennis-500 font-bold text-sm">VS</div>
                                                <div>
                                                    <p className="text-xl font-bold">2</p>
                                                    <p className="text-[10px] text-gray-400">{viewingLeaderboardPlayer.name.split(' ')[0].toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!viewingLeaderboardPlayer.isCurrentUser && (
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="secondary" fullWidth onClick={() => { setViewingLeaderboardPlayer(null); setViewingPartner(viewingLeaderboardPlayer); }}>View Profile</Button>
                                            <Button 
                                                fullWidth 
                                                onClick={() => { setViewingLeaderboardPlayer(null); handleOpenChallengeModal(viewingLeaderboardPlayer); }}
                                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none' }}
                                            >
                                                Challenge
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Share Ranking Modal */}
                {showShareRanking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slideDown p-6 text-center">
                            <div className="flex justify-end">
                                <button onClick={() => setShowShareRanking(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-4">SHARE YOUR RANKING</h3>
                            
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl shadow-lg mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><TrophyIcon className="w-16 h-16" /></div>
                                <p className="text-xs font-bold text-tennis-400 uppercase tracking-widest mb-4">KorIQ Leaderboard</p>
                                <p className="text-xl font-bold mb-2">I'm ranked <span className="text-tennis-400">#4</span> in Vancouver!</p>
                                <p className="text-sm text-gray-400 mb-4">NTRP 3.5 • 8 Wins • 62% Win Rate</p>
                                <p className="text-[10px] text-gray-500 font-mono">#KorIQ #Tennis #Vancouver</p>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex flex-col items-center gap-1">
                                    <ClipboardIcon className="w-5 h-5" />
                                    <span className="text-[10px] font-bold text-gray-600">Copy</span>
                                </button>
                                <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center gap-1">
                                    <span className="text-xl">🐦</span>
                                    <span className="text-[10px] font-bold text-blue-600">Twitter</span>
                                </button>
                                <button className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors flex flex-col items-center gap-1">
                                    <span className="text-xl">📸</span>
                                    <span className="text-[10px] font-bold text-pink-600">IG</span>
                                </button>
                                <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center gap-1">
                                    <span className="text-xl">📘</span>
                                    <span className="text-[10px] font-bold text-blue-800">FB</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Viewing Coach Modal */}
                {viewingCoach && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-tennis-500 to-tennis-600 rounded-full flex items-center justify-center text-3xl text-white">{viewingCoach.img}</div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{viewingCoach.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1"><LocationIcon className="w-4 h-4" /> {viewingCoach.location}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingCoach(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <div className="flex items-center gap-1"><span className="text-yellow-500 font-bold flex items-center gap-0.5"><StarIcon className="w-4 h-4" /> {viewingCoach.rating}</span><span className="text-xs text-gray-500">({viewingCoach.reviews} reviews)</span></div>
                                    <div className="font-bold text-tennis-600">${viewingCoach.rate}/hr</div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bio</p>
                                    <p className="text-sm text-gray-700">{viewingCoach.bio}</p>
                                </div>
                                <Button fullWidth onClick={() => handleRequestLesson(viewingCoach.name)}>Message Coach</Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Remove Confirmation Modal */}
                {showRemoveConfirm && (
                     <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                         <div className="bg-white rounded-xl shadow-xl w-full max-w-xs p-6 text-center animate-slideDown">
                            <h3 className="font-bold text-gray-800 mb-2">Remove Connection?</h3>
                            <p className="text-sm text-gray-500 mb-4">Are you sure you want to remove {showRemoveConfirm.name}?</p>
                            <div className="flex gap-2">
                                <Button variant="secondary" fullWidth onClick={() => setShowRemoveConfirm(null)}>Cancel</Button>
                                <Button variant="danger" fullWidth onClick={handleRemoveConnection}>Remove</Button>
                            </div>
                         </div>
                     </div>
                )}

                {/* Messages Modal */}
                {showMessages && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-slideDown">
                            {/* Thread List */}
                            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50">
                                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800">Messages</h3>
                                    <button onClick={() => setShowMessages(false)} className="md:hidden text-gray-500">✕</button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {threads.map(t => (
                                        <div 
                                            key={t.id} 
                                            onClick={() => setSelectedThread(t)} 
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors ${selectedThread?.id === t.id ? 'bg-white border-l-4 border-l-tennis-500' : ''}`}
                                        >
                                            <div className="flex justify-between mb-1">
                                                <span className={`text-sm font-bold ${t.unread ? 'text-gray-900' : 'text-gray-700'}`}>{t.participantName}</span>
                                                <span className="text-xs text-gray-400">{t.lastMessageTime}</span>
                                            </div>
                                            <p className={`text-xs truncate ${t.unread ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{t.lastMessage}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col bg-white relative">
                                <button onClick={() => setShowMessages(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden md:block">✕</button>
                                {selectedThread ? (
                                    <>
                                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                             <div className="w-8 h-8 bg-tennis-100 rounded-full flex items-center justify-center text-tennis-700 font-bold">
                                                 {selectedThread.participantName.charAt(0)}
                                             </div>
                                             <div>
                                                 <h3 className="font-bold text-gray-800">{selectedThread.participantName}</h3>
                                                 {selectedThread.isOnline && <span className="text-[10px] text-green-500 flex items-center gap-1">● Online</span>}
                                             </div>
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                            {selectedThread.messages.map(m => (
                                                <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.isMe ? 'bg-tennis-500 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                                        {m.content}
                                                        <p className={`text-[10px] mt-1 text-right ${m.isMe ? 'text-tennis-100' : 'text-gray-400'}`}>{m.timestamp}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {selectedThread.messages.length === 0 && (
                                                <div className="text-center text-gray-400 text-sm mt-10">Start the conversation!</div>
                                            )}
                                        </div>

                                        <div className="p-4 border-t border-gray-100 bg-white">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-tennis-500 outline-none" 
                                                    placeholder="Type a message..." 
                                                    value={messageInput}
                                                    onChange={e => setMessageInput(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                                />
                                                <button 
                                                    onClick={handleSendMessage}
                                                    className="bg-tennis-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-tennis-700 transition-colors shadow-sm"
                                                >
                                                    ➤
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Player Profile View Modal */}
                {viewingPlayerProfile && (
                    <PlayerProfileView
                        player={getMockPlayerProfile(viewingPlayerProfile)}
                        onClose={() => setViewingPlayerProfile(null)}
                        onMessage={() => {
                            openMessages(viewingPlayerProfile);
                            setViewingPlayerProfile(null);
                        }}
                        onChallenge={() => {
                            handleActivityChallenge(viewingPlayerProfile);
                            setViewingPlayerProfile(null);
                        }}
                    />
                )}
            </>
        );
    }

    const renderSettingsModal = () => {
        if (!showSettings) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6 max-h-[90vh] overflow-y-auto">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">SETTINGS</h3>
                        <button onClick={() => setShowSettings(false)} className="text-gray-400">✕</button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Notifications */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Notifications</h4>
                            <div className="space-y-3">
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-sm text-gray-700">Email Notifications</span>
                                    <input type="checkbox" checked={settings.emailNotifs} onChange={() => toggleSetting('emailNotifs')} className="accent-tennis-600 w-4 h-4" />
                                </label>
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-sm text-gray-700">New Message Alerts</span>
                                    <input type="checkbox" checked={settings.msgAlerts} onChange={() => toggleSetting('msgAlerts')} className="accent-tennis-600 w-4 h-4" />
                                </label>
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-sm text-gray-700">Connection Requests</span>
                                    <input type="checkbox" checked={settings.connAlerts} onChange={() => toggleSetting('connAlerts')} className="accent-tennis-600 w-4 h-4" />
                                </label>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Privacy */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Privacy</h4>
                             <div className="space-y-3">
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-sm text-gray-700">Public Profile</span>
                                    <input type="checkbox" checked={settings.publicProfile} onChange={() => toggleSetting('publicProfile')} className="accent-tennis-600 w-4 h-4" />
                                </label>
                                <label className="flex justify-between items-center cursor-pointer">
                                    <span className="text-sm text-gray-700">Show Availability</span>
                                    <input type="checkbox" checked={settings.publicAvailability} onChange={() => toggleSetting('publicAvailability')} className="accent-tennis-600 w-4 h-4" />
                                </label>
                             </div>
                        </div>

                         <hr className="border-gray-100" />

                         {/* Account Actions */}
                         <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Account</h4>
                            <div className="space-y-2">
                                <Button variant="secondary" fullWidth onClick={() => setShowChangePassword(true)}>Change Password</Button>
                                <Button variant="danger" fullWidth onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUpdateRatingsModal = () => {
        if (!showUpdateRatings) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slideDown p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-800">UPDATE SELF-RATING</h3>
                        <button onClick={() => setShowUpdateRatings(false)} className="text-gray-400">✕</button>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(ratingForm).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-gray-700 capitalize">{key}</label>
                                    <span className="text-tennis-600 font-bold">{val.toFixed(1)}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" max="10" step="0.5" 
                                    value={val} 
                                    onChange={e => setRatingForm({...ratingForm, [key]: parseFloat(e.target.value)})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tennis-600"
                                />
                            </div>
                        ))}
                        <Button fullWidth onClick={handleUpdateRatings}>Save Ratings</Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderConnectRequestModal = () => {
        if (!showConnectRequest) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-slideDown p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Connect with {showConnectRequest.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Send a message to introduce yourself.</p>
                    <textarea 
                        className={`${INPUT_STYLE} h-24 mb-4`} 
                        value={connectMessage}
                        onChange={e => setConnectMessage(e.target.value)}
                        placeholder="Hi! I'd love to play..."
                    ></textarea>
                    <div className="flex gap-2">
                        <Button variant="secondary" fullWidth onClick={() => setShowConnectRequest(null)}>Cancel</Button>
                        <Button fullWidth onClick={sendConnectionRequest}>Send Request</Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderAddTournamentModal = () => {
        if (!showAddTournament) return null;
        return (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg text-gray-900">Add Tournament</h3>
                        <button onClick={() => setShowAddTournament(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form className="space-y-4">
                        <input type="text" className={INPUT_STYLE} placeholder="Tournament Name" value={tourneyForm.name} onChange={e => setTourneyForm({...tourneyForm, name: e.target.value})} />
                        <input type="text" className={INPUT_STYLE} placeholder="Location" value={tourneyForm.location} onChange={e => setTourneyForm({...tourneyForm, location: e.target.value})} />
                        <input type="text" className={INPUT_STYLE} placeholder="Date (e.g. Jan 25-26)" value={tourneyForm.date} onChange={e => setTourneyForm({...tourneyForm, date: e.target.value})} />
                        
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Events</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={tourneyForm.events.singles} onChange={e => setTourneyForm({...tourneyForm, events: {...tourneyForm.events, singles: e.target.checked}})} /> Singles</label>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={tourneyForm.events.doubles} onChange={e => setTourneyForm({...tourneyForm, events: {...tourneyForm.events, doubles: e.target.checked}})} /> Doubles</label>
                            </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Status</label>
                             <select className={SELECT_STYLE} value={tourneyForm.status} onChange={e => setTourneyForm({...tourneyForm, status: e.target.value})}>
                                <option>Confirmed</option>
                                <option>Pending</option>
                                <option>Interested</option>
                            </select>
                        </div>
                        
                        <Button fullWidth type="button" onClick={handleAddTournament}>Add Tournament</Button>
                    </form>
                </div>
             </div>
        );
    };

    // Tab configuration with icons - NEW STRUCTURE
    const tabConfig = [
        { id: 'HOME', label: 'Home', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'PROFILE', label: 'Profile', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        { id: 'MATCH_UP', label: 'Match Up', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )},
        { id: 'COURTS', label: 'Courts', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
        { id: 'COACHES', label: 'Coaches', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )},
        { id: 'CLUBS', label: 'Clubs', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )},
        { id: 'TOURNAMENTS', label: 'Tournaments', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        )},
        { id: 'MESSAGES', label: 'Messages', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )},
    ];

    return (
        <div className="min-h-screen bg-white">
            <DatalistCities />
            
            {/* Header with Horizontal Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-portal-player rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {player?.name?.charAt(0) || 'P'}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{player?.name || 'Player'}</h1>
                                <p className="text-xs text-portal-player font-medium">Player Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Bell */}
                            <NotificationBell
                                notifications={notifications}
                                onMarkAsRead={handleMarkNotificationRead}
                                onMarkAllRead={handleMarkAllNotificationsRead}
                                onNotificationClick={handleNotificationClick}
                                accentColor="bg-portal-player"
                            />
                            {renderHeaderIcons()}
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
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                                    activeTab === tab.id
                                        ? 'border-portal-player text-gray-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-portal-player' : 'text-gray-400'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {activeTab === 'HOME' && player && (
                    <HomeTab 
                        player={player} 
                        onNavigate={(tab) => setActiveTab(tab as Tab)} 
                    />
                )}
                {activeTab === 'PROFILE' && renderProfile()}
                {activeTab === 'BALL_PARK' && (
                    <BallParkTab
                        playerId={player?.id || ''}
                        playerName={player?.name || 'Player'}
                    />
                )}
                {activeTab === 'CONNECTIONS' && (
                    <ConnectionsTab
                        portalType="player"
                        currentUserId={player?.id || ''}
                        currentUserName={player?.name || 'Player'}
                    />
                )}
                {activeTab === 'MATCH_UP' && (
                    <MatchUpTab
                        playerId={player?.id || ''}
                        playerName={player?.name || 'Player'}
                        playerNtrp={player?.currentNtrp}
                    />
                )}
                {activeTab === 'COURTS' && <CourtFinder />}
                {activeTab === 'COACHES' && (
                    <CoachesTab
                        playerId={player?.id || ''}
                        playerName={player?.name || 'Player'}
                        playerNtrp={player?.currentNtrp}
                        onMessageCoach={(coachId, coachName) => {
                            // Open messages with coach
                            console.log('Message coach:', coachId, coachName);
                        }}
                    />
                )}
                {activeTab === 'CLUBS' && renderClubs()}
                {activeTab === 'TOURNAMENTS' && renderTournaments()}
                {activeTab === 'MESSAGES' && (
                    <MessagesTab
                        playerId={player?.id || ''}
                        playerName={player?.name || 'Player'}
                    />
                )}
            </div>

            {/* Modals */}
            {renderSettingsModal()}
            {renderUpdateRatingsModal()}
            {renderConnectRequestModal()}
            {renderAddTournamentModal()}
            {renderModals()}
            {renderChallengeModal()}
            
            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">EDIT PROFILE</h3>
                            <button onClick={() => setShowEditProfile(false)} className="text-gray-400">✕</button>
                        </div>
                        <div className="space-y-4">
                            <input type="text" className={INPUT_STYLE} value={editProfileForm.name || ''} onChange={e => setEditProfileForm({...editProfileForm, name: e.target.value})} placeholder="Full Name" />
                            <input type="text" list="cities" className={INPUT_STYLE} value={editProfileForm.city || ''} onChange={e => setEditProfileForm({...editProfileForm, city: e.target.value})} placeholder="Location" />
                            <select value={editProfileForm.currentNtrp} onChange={e => setEditProfileForm({...editProfileForm, currentNtrp: e.target.value as NtrpLevel})} className={SELECT_STYLE}>
                                {Object.values(NtrpLevel).map(l => <option key={l}>{l}</option>)}
                            </select>
                            <select value={editProfileForm.style || ''} onChange={e => setEditProfileForm({...editProfileForm, style: e.target.value})} className={SELECT_STYLE}>
                                <option value="">Select Style...</option>
                                <option value="Baseline">Baseline</option>
                                <option value="Serve & Volley">Serve & Volley</option>
                                <option value="All-court">All-court</option>
                            </select>
                            <textarea className={`${INPUT_STYLE} h-24`} placeholder="Bio..." value={editProfileForm.bio || ''} onChange={e => setEditProfileForm({...editProfileForm, bio: e.target.value})}></textarea>
                            
                            <hr className="border-gray-100" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Availability</p>
                            <div className="space-y-2 text-sm">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                    <div key={day} className="flex justify-between items-center">
                                        <span className="w-20">{day}</span>
                                        <div className="flex gap-2">
                                            {['Morning', 'Afternoon', 'Evening'].map(time => {
                                                const dayAvail = editProfileForm.availability?.[day] || [];
                                                const isChecked = dayAvail.includes(time);
                                                return (
                                                    <label key={time} className="flex items-center gap-1 cursor-pointer">
                                                        <input type="checkbox" checked={isChecked} onChange={() => {
                                                            const newDayAvail = isChecked ? dayAvail.filter(t => t !== time) : [...dayAvail, time];
                                                            setEditProfileForm({...editProfileForm, availability: { ...editProfileForm.availability, [day]: newDayAvail }});
                                                        }} className="rounded text-tennis-600 focus:ring-tennis-500" />
                                                        <span className="text-xs text-gray-500">{time.charAt(0)}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Connection Settings</p>
                            <div className="space-y-2 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="connEdit" checked={editProfileForm.connectionSetting === 'Approval'} onChange={() => setEditProfileForm({...editProfileForm, connectionSetting: 'Approval'})} /> Require my approval
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="connEdit" checked={editProfileForm.connectionSetting === 'Auto'} onChange={() => setEditProfileForm({...editProfileForm, connectionSetting: 'Auto'})} /> Auto-accept requests
                                </label>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <Button variant="secondary" fullWidth onClick={() => setShowEditProfile(false)}>Cancel</Button>
                                <Button fullWidth onClick={handleSaveProfile}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Club Modal */}
            {viewingClub && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown">
                        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-tennis-600">
                            <button onClick={() => setViewingClub(null)} className="absolute top-4 right-4 text-white/80 hover:text-white text-xl">✕</button>
                            <div className="absolute bottom-4 left-6 text-white">
                                <h3 className="text-xl font-bold">{viewingClub.name}</h3>
                                <p className="text-sm opacity-90">{viewingClub.location}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="font-bold text-gray-800 flex items-center gap-0.5"><StarIcon className="w-4 h-4 text-yellow-400" /> {viewingClub.rating}</p><p className="text-gray-500 text-xs">Rating</p></div>
                                <div><p className="font-bold text-gray-800">📞 (604) 555-1234</p><p className="text-gray-500 text-xs">Phone</p></div>
                            </div>
                            
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-100 pb-1">Amenities</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {viewingClub.amenities.map((a: string) => <li key={a} className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-green-500" /> {a}</li>)}
                                    <li className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-green-500" /> Parking</li>
                                    <li className="flex items-center gap-1"><CheckIcon className="w-3 h-3 text-green-500" /> Locker rooms</li>
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-100 pb-1">Programs</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {viewingClub.programs.map((p: string) => <li key={p}>• {p} Program</li>)}
                                    <li>• Social Leagues</li>
                                </ul>
                            </div>

                            <Button fullWidth variant="secondary" onClick={() => viewingClub.websiteUrl && window.open(viewingClub.websiteUrl, '_blank')}>Visit Website →</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Result Modal */}
            {showAddResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg text-gray-900">Add Match Result</h3>
                            <button onClick={() => setShowAddResult(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Result</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2"><input type="radio" name="res" checked={resultForm.result === 'W'} onChange={() => setResultForm({...resultForm, result: 'W'})} /> Win</label>
                                    <label className="flex items-center gap-2"><input type="radio" name="res" checked={resultForm.result === 'L'} onChange={() => setResultForm({...resultForm, result: 'L'})} /> Loss</label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Opponent Name</label>
                                <input type="text" className={INPUT_STYLE} value={resultForm.opponent} onChange={e => setResultForm({...resultForm, opponent: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Score</label>
                                <input type="text" placeholder="e.g. 6-4, 6-2" className={INPUT_STYLE} value={resultForm.score} onChange={e => setResultForm({...resultForm, score: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tournament</label>
                                <select className={SELECT_STYLE} value={resultForm.tournament} onChange={e => setResultForm({...resultForm, tournament: e.target.value})}>
                                    <option value="">Select...</option>
                                    <option>Vancouver Open 3.5</option>
                                    <option>BC Winter Championships</option>
                                    <option>Practice Match</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Surface</label>
                                    <select className={SELECT_STYLE} value={resultForm.surface} onChange={e => setResultForm({...resultForm, surface: e.target.value})}>
                                        <option>Hard</option>
                                        <option>Clay</option>
                                        <option>Grass</option>
                                        <option>Indoor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
                                    <select className={SELECT_STYLE} value={resultForm.type} onChange={e => setResultForm({...resultForm, type: e.target.value})}>
                                        <option>Singles</option>
                                        <option>Doubles</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <Button variant="secondary" fullWidth onClick={() => setShowAddResult(false)} type="button">Cancel</Button>
                                <Button fullWidth type="button" onClick={handleAddResult}>Save Result</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
