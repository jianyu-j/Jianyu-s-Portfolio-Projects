// Mock data extracted from PlayerView.tsx
// This file contains all mock/sample data used in the Player Portal

import { MatchResult, Tournament, MessageThread, Challenge } from '../../../types';

// --- CITIES ---
export const CITIES = [
    "Vancouver, BC", "Burnaby, BC", "Richmond, BC", "Surrey, BC",
    "North Vancouver, BC", "West Vancouver, BC", "Coquitlam, BC",
    "New Westminster, BC", "Victoria, BC", "Toronto, ON",
    "Calgary, AB", "Montreal, QC"
];

// --- PARTNERS ---
export const MOCK_PARTNERS = [
    { 
        id: 1, 
        name: 'Alex Thompson', 
        location: 'Vancouver, BC', 
        ntrp: '3.5', 
        style: 'All-court', 
        availability: 'Weekends, evenings',
        availabilityObj: { Saturday: ['Morning', 'Afternoon'], Sunday: ['Morning'], Wednesday: ['Evening'] }, 
        bio: 'Been playing for 5 years. Looking for regular hitting partners.', 
        img: null, 
        connectionSetting: 'Approval',
        isOnline: true,
        lastActive: 'Now'
    },
    { 
        id: 2, 
        name: 'Maria Garcia', 
        location: 'Burnaby, BC', 
        ntrp: '3.5', 
        style: 'Baseline', 
        availability: 'Weekday mornings',
        availabilityObj: { Monday: ['Morning'], Tuesday: ['Morning'], Thursday: ['Morning'] }, 
        bio: 'Consistent baseliner, love long rallies.', 
        img: null, 
        connectionSetting: 'Auto',
        isOnline: true,
        lastActive: 'Now'
    },
    { 
        id: 3, 
        name: 'James Wilson', 
        location: 'Vancouver, BC', 
        ntrp: '3.0', 
        style: 'Serve & Volley', 
        availability: 'Weekends',
        availabilityObj: { Saturday: ['Morning'], Sunday: ['Morning', 'Afternoon'] }, 
        bio: 'Improving my net game.', 
        img: null, 
        connectionSetting: 'Approval',
        isOnline: false,
        lastActive: '2h ago'
    },
    { 
        id: 4, 
        name: 'Sarah Lee', 
        location: 'Richmond, BC', 
        ntrp: '4.0', 
        style: 'Baseline', 
        availability: 'Evenings', 
        availabilityObj: { Monday: ['Evening'], Wednesday: ['Evening'], Friday: ['Evening'] },
        bio: 'Former college player getting back into it.', 
        img: null, 
        connectionSetting: 'Auto',
        isOnline: false,
        lastActive: '1d ago'
    },
    { 
        id: 5, 
        name: 'David Kim', 
        location: 'Coquitlam, BC', 
        ntrp: '4.5', 
        style: 'All-court', 
        availability: 'Weekend Afternoons',
        availabilityObj: { Saturday: ['Afternoon'], Sunday: ['Afternoon'] }, 
        bio: 'Competitive player looking for matches.', 
        img: null, 
        connectionSetting: 'Approval',
        isOnline: false,
        lastActive: '5m ago'
    },
];

// --- INSTANT MATCH PLAYERS ---
export const MOCK_INSTANT_MATCH_PLAYERS = [
    {
        id: 101,
        name: "Alex Thompson",
        initials: "AT",
        ntrp: "3.5",
        city: "Vancouver, BC",
        isOnline: true,
        lastActive: "2025-01-18T14:30:00Z",
        distance: 2.1,
        availabilityStatus: "Available until 5pm",
        availableAllDay: false,
        limitedAvailability: false,
        rank: 1
    },
    {
        id: 102,
        name: "Maria Garcia",
        initials: "MG",
        ntrp: "3.5",
        city: "Vancouver, BC",
        isOnline: true,
        lastActive: "2025-01-18T15:00:00Z",
        distance: 3.8,
        availabilityStatus: "Available all day",
        availableAllDay: true,
        limitedAvailability: false,
        rank: 5
    },
    {
        id: 103,
        name: "James Wilson",
        initials: "JW",
        ntrp: "3.0",
        city: "Vancouver, BC",
        isOnline: false,
        lastActive: "2025-01-18T13:00:00Z",
        distance: 1.5,
        availabilityStatus: "Available 2-4pm",
        availableAllDay: false,
        limitedAvailability: true,
        availableTime: "2-4pm",
        rank: 12
    }
];

// --- INDEPENDENT COACHES ---
export const MOCK_INDEPENDENT_COACHES = [
    { id: 'ic1', name: 'Coach Sarah Miller', location: 'Vancouver, BC', rating: 4.8, reviews: 23, rate: 60, specialties: ['Serve', 'Juniors', 'Beginners'], bio: '10+ years coaching experience. Certified Tennis Canada coach.', img: '', isOnline: true, lastActive: 'Now' },
    { id: 'ic2', name: 'Coach David Park', location: 'Burnaby, BC', rating: 4.9, reviews: 45, rate: 75, specialties: ['Advanced', 'Strategy'], bio: 'High performance coaching for competitive players.', img: '', isOnline: false, lastActive: '1h ago' },
];

// --- CLUBS LIST ---
export const MOCK_CLUBS_LIST = [
    { id: 'cl1', name: 'Vancouver Tennis Club', location: 'Downtown Vancouver', rating: 4.6, amenities: ['Indoor', 'Outdoor', 'Pro Shop'], programs: ['Adult', 'Junior', 'Competitive'], websiteUrl: 'https://www.vancouvertennisclub.com' },
    { id: 'cl2', name: 'Stanley Park Tennis', location: 'Stanley Park', rating: 4.4, amenities: ['Outdoor', 'Lights', 'Lessons'], programs: ['Adult', 'Junior'], websiteUrl: 'https://www.stanleyparktennis.com' },
    { id: 'cl3', name: 'Burnaby Tennis Club', location: 'Burnaby', rating: 4.7, amenities: ['Indoor', 'Outdoor', 'Gym'], programs: ['Adult', 'Junior', 'Senior'], websiteUrl: 'https://www.burnabytennisclub.com' },
];

// --- LOCAL TOURNAMENTS ---
export const MOCK_LOCAL_TOURNAMENTS: Tournament[] = [
    { id: 't1', name: 'Vancouver Open 3.5', date: 'Jan 25-26, 2025', location: 'Stanley Park Courts', level: 'NTRP 3.5', format: 'Singles & Doubles', fee: '$45', registrationUrl: 'https://www.tennisbc.org' },
    { id: 't2', name: 'BC Winter Championships', date: 'Feb 8-9, 2025', location: 'Burnaby Tennis Club', level: 'NTRP 3.0-4.0', format: 'Singles', fee: '$55', registrationUrl: 'https://www.tennisbc.org' },
];

// --- MATCH RESULTS ---
export const INITIAL_MATCH_RESULTS: MatchResult[] = [
    { id: 'm1', date: 'Jan 10, 2025', opponentName: 'John Smith', tournamentName: 'Vancouver Open 3.5', round: 'Round 1', score: '6-4, 6-2', result: 'W', surface: 'Hard', type: 'Singles' },
    { id: 'm2', date: 'Jan 10, 2025', opponentName: 'Mike Lee', tournamentName: 'Vancouver Open 3.5', round: 'Quarterfinal', score: '4-6, 3-6', result: 'L', surface: 'Hard', type: 'Singles' },
    { id: 'm3', date: 'Dec 28, 2024', opponentName: 'Tom Brown', tournamentName: 'BC Winter Open', round: 'Round 1', score: '7-5, 6-4', result: 'W', surface: 'Indoor', type: 'Singles' },
];

// --- MESSAGES ---
export const INITIAL_MESSAGES: MessageThread[] = [
    { 
        id: 'th1', participantName: 'Coach Sarah Miller', lastMessage: 'Great! Let\'s schedule for Saturday...', lastMessageTime: '2h ago', unread: true, isOnline: true,
        messages: [
            { id: '1', senderName: 'Me', content: 'Hi Coach Sarah! I\'m interested in improving my serve. Are you available this weekend?', timestamp: 'Jan 15, 10:30am', isMe: true },
            { id: '2', senderName: 'Coach Sarah Miller', content: 'Hi! Yes, I have openings Saturday 2pm or Sunday 10am. Which works better for you?', timestamp: 'Jan 15, 11:45am', isMe: false },
            { id: '3', senderName: 'Me', content: 'Saturday 2pm works great! Where should we meet?', timestamp: 'Jan 15, 12:00pm', isMe: true },
            { id: '4', senderName: 'Coach Sarah Miller', content: 'Great! Let\'s schedule for Saturday at Stanley Park courts. See you there!', timestamp: 'Jan 15, 2:15pm', isMe: false },
        ]
    },
    { id: 'th2', participantName: 'Alex Thompson', lastMessage: 'Sounds good, see you at 10am!', lastMessageTime: 'Yesterday', unread: false, isOnline: true, messages: [] },
    { id: 'th3', participantName: 'Maria Garcia', lastMessage: 'Thanks for the game!', lastMessageTime: 'Jan 14', unread: false, isOnline: true, messages: [] },
];

// --- CHALLENGES ---
export const MOCK_CHALLENGES: Challenge[] = [
    { 
        id: 'ch1', fromUserId: '2', fromUserName: 'Maria Garcia', toUserId: 'me', toUserName: 'Me', 
        date: '2025-01-20', time: '18:00', location: 'Burnaby Tennis Club', matchType: 'Friendly', 
        message: 'Up for a game?', status: 'Pending', createdAt: '2025-01-18T10:00:00Z' 
    },
    { 
        id: 'ch2', fromUserId: 'me', fromUserName: 'Me', toUserId: '3', toUserName: 'James Wilson', 
        date: '2025-01-25', time: '10:00', location: 'Stanley Park', matchType: 'Ranking', 
        message: 'Rematch time!', status: 'Accepted', createdAt: '2025-01-17T14:30:00Z' 
    }
];

// --- HEAD TO HEAD ---
export const MOCK_HEAD_TO_HEAD: Record<string, { wins: number, losses: number }> = {
    '1': { wins: 1, losses: 2 }, 
    '2': { wins: 3, losses: 1 }, 
    '3': { wins: 0, losses: 0 }, 
    '4': { wins: 0, losses: 1 }, 
    '5': { wins: 2, losses: 2 }, 
};

// --- LEADERBOARD ---
export const MOCK_LEADERBOARD = [
    { rank: 1, rankChange: 2, id: 'lb1', name: 'Alex Thompson', ntrp: '3.5', wins: 15, losses: 3, points: 1250, img: null },
    { rank: 2, rankChange: 0, id: 'lb2', name: 'Sarah Miller', ntrp: '3.5', wins: 12, losses: 4, points: 1100, img: null },
    { rank: 3, rankChange: -1, id: 'lb3', name: 'Mike Chen', ntrp: '3.5', wins: 10, losses: 3, points: 980, img: null },
    { rank: 4, rankChange: 3, id: 'me', name: 'You (John Smith)', ntrp: '3.5', wins: 8, losses: 5, points: 850, img: null, isCurrentUser: true },
    { rank: 5, rankChange: 0, id: 'lb5', name: 'Maria Garcia', ntrp: '3.5', wins: 7, losses: 4, points: 820, img: null },
    { rank: 6, rankChange: 1, id: 'lb6', name: 'James Wilson', ntrp: '3.0', wins: 7, losses: 5, points: 780, img: null },
    { rank: 7, rankChange: -2, id: 'lb7', name: 'Tom Brown', ntrp: '4.0', wins: 6, losses: 4, points: 720, img: null },
    { rank: 8, rankChange: 0, id: 'lb8', name: 'Lisa Park', ntrp: '3.5', wins: 6, losses: 5, points: 700, img: null },
    { rank: 9, rankChange: 2, id: 'lb9', name: 'David Kim', ntrp: '4.5', wins: 5, losses: 4, points: 650, img: null },
    { rank: 10, rankChange: -1, id: 'lb10', name: 'Emma Lee', ntrp: '3.0', wins: 5, losses: 5, points: 600, img: null },
    { rank: 11, rankChange: 0, id: 'lb11', name: 'Chris P.', ntrp: '3.5', wins: 4, losses: 4, points: 550, img: null },
    { rank: 12, rankChange: 1, id: 'lb12', name: 'Anna K.', ntrp: '3.5', wins: 4, losses: 6, points: 500, img: null },
];

// --- STYLE CONSTANTS ---
export const INPUT_STYLE = "w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-tennis-500 placeholder-gray-400";
export const SELECT_STYLE = "w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-tennis-500";
