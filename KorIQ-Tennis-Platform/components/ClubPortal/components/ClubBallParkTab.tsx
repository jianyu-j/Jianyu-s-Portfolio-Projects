import React, { useState } from 'react';

interface ClubBallParkTabProps {
  clubId: string;
  clubName: string;
}

type ClubContentVisibility = 'club' | 'both';

interface Post {
  id: string;
  clubId?: string;
  authorId: string;
  authorName: string;
  authorType: 'player' | 'coach' | 'club';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isTutorial?: boolean;
  tutorialId?: string;
  // Ecosystem visibility fields
  visibility?: ClubContentVisibility; // 'club' = club only, 'both' = club + community
}

interface Tutorial {
  id: string;
  coachId: string;
  coachName: string;
  clubId?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  skillLevel: string;
  views: number;
  likes: number;
  // Ecosystem visibility fields
  visibility?: ClubContentVisibility;
}

interface ProfileViewData {
  id: string;
  name: string;
  type: 'player' | 'coach' | 'club';
  bio?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  ntrpLevel?: string;
  courtCount?: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

// Mock tutorials - club-scoped tutorials
const MOCK_CLUB_TUTORIALS: Tutorial[] = [
  {
    id: 'tut-1',
    coachId: 'coach1',
    coachName: 'Coach Mike Chen',
    title: 'Serve Fundamentals for Beginners',
    description: 'Master the basics of a consistent serve with this step-by-step guide.',
    thumbnailUrl: '',
    duration: 15,
    category: 'Serve',
    skillLevel: 'Beginner',
    views: 234,
    likes: 45,
  },
  {
    id: 'tut-2',
    coachId: 'coach2',
    coachName: 'Coach Sarah Mitchell',
    title: 'Two-Handed Backhand Masterclass',
    description: 'Learn the proper technique for a powerful two-handed backhand.',
    thumbnailUrl: '',
    duration: 20,
    category: 'Backhand',
    skillLevel: 'Intermediate',
    views: 189,
    likes: 38,
  },
  {
    id: 'tut-3',
    coachId: 'coach1',
    coachName: 'Coach Mike Chen',
    title: 'Footwork Drills for Net Play',
    description: 'Improve your volleying with these essential footwork exercises.',
    thumbnailUrl: '',
    duration: 12,
    category: 'Footwork',
    skillLevel: 'All Levels',
    views: 156,
    likes: 29,
  },
];

// Mock posts - club's own posts
const MOCK_MY_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'me',
    authorName: '',  // Will be filled with clubName
    authorType: 'club',
    content: 'Reminder: Our annual doubles tournament registration closes this Friday! Sign up now at the front desk or online.',
    likes: 67,
    comments: 8,
    timestamp: '6 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    authorId: 'me',
    authorName: '',
    authorType: 'club',
    content: 'Welcome to our new members who joined this month! We\'re excited to have you as part of our tennis family.',
    likes: 45,
    comments: 12,
    timestamp: 'Yesterday',
    isLiked: false,
  },
  {
    id: '3',
    authorId: 'me',
    authorName: '',
    authorType: 'club',
    content: 'Court maintenance scheduled for next Tuesday (Feb 20th). Courts 1-4 will be unavailable from 8am-12pm.',
    likes: 23,
    comments: 5,
    timestamp: '2 days ago',
    isLiked: false,
  },
];

// Mock all posts - includes posts from coaches and players
const MOCK_ALL_POSTS: Post[] = [
  {
    id: 'all-1',
    authorId: 'coach1',
    authorName: 'Coach Mike Chen',
    authorType: 'coach',
    content: 'Quick tip: Focus on your trophy position before the serve. This one adjustment can add 10mph to your serve!',
    likes: 45,
    comments: 12,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: 'all-2',
    authorId: 'player1',
    authorName: 'Sarah Johnson',
    authorType: 'player',
    content: 'Great session at the club this morning! Thanks @Alex for the match!',
    likes: 23,
    comments: 5,
    timestamp: '4 hours ago',
    isLiked: true,
  },
  {
    id: 'all-3',
    authorId: 'me',
    authorName: '',
    authorType: 'club',
    content: 'Reminder: Our annual doubles tournament registration closes this Friday! Sign up now at the front desk or online.',
    likes: 67,
    comments: 8,
    timestamp: '6 hours ago',
    isLiked: false,
  },
  {
    id: 'all-4',
    authorId: 'coach2',
    authorName: 'Coach Sarah Mitchell',
    authorType: 'coach',
    content: 'New tutorial posted! Master the Topspin Forehand - 15 minute breakdown',
    likes: 89,
    comments: 15,
    timestamp: 'Yesterday',
    isLiked: true,
  },
  {
    id: 'all-5',
    authorId: 'player2',
    authorName: 'Marcus Lee',
    authorType: 'player',
    content: 'Looking for a hitting partner tomorrow afternoon. Anyone free? NTRP 3.5-4.0 preferred!',
    likes: 8,
    comments: 3,
    timestamp: 'Yesterday',
    isLiked: false,
  },
];

// Mock profile data
const MOCK_PROFILES: Record<string, ProfileViewData> = {
  'coach1': {
    id: 'coach1',
    name: 'Coach Mike Chen',
    type: 'coach',
    bio: 'Former ATP player with 10+ years of coaching experience. Specializing in serve technique and mental game.',
    location: 'Vancouver, BC',
    specialties: ['Serve', 'Mental Game', 'Competition'],
    rating: 4.8,
    followerCount: 234,
    followingCount: 45,
    isFollowing: false,
  },
  'coach2': {
    id: 'coach2',
    name: 'Coach Sarah Mitchell',
    type: 'coach',
    bio: 'PTR Certified Professional with a passion for developing junior players and beginners.',
    location: 'Vancouver, BC',
    specialties: ['Beginners', 'Juniors', 'Footwork'],
    rating: 4.9,
    followerCount: 312,
    followingCount: 89,
    isFollowing: true,
  },
  'player1': {
    id: 'player1',
    name: 'Sarah Johnson',
    type: 'player',
    bio: 'Recreational player passionate about improving my game. Always looking for hitting partners!',
    location: 'Vancouver, BC',
    ntrpLevel: '4.0',
    followerCount: 56,
    followingCount: 123,
    isFollowing: false,
  },
  'player2': {
    id: 'player2',
    name: 'Marcus Lee',
    type: 'player',
    bio: 'Weekend warrior. Love doubles and social tennis.',
    location: 'Burnaby, BC',
    ntrpLevel: '3.5',
    followerCount: 34,
    followingCount: 78,
    isFollowing: false,
  },
};

const ClubBallParkTab: React.FC<ClubBallParkTabProps> = ({ clubId, clubName }) => {
  const [filter, setFilter] = useState<'all' | 'my' | 'tutorials'>('all');
  const [myPosts, setMyPosts] = useState<Post[]>(
    MOCK_MY_POSTS.map(p => ({ ...p, authorName: p.authorId === 'me' ? clubName : p.authorName }))
  );
  const [allPosts, setAllPosts] = useState<Post[]>(
    MOCK_ALL_POSTS.map(p => ({ ...p, authorName: p.authorId === 'me' ? clubName : p.authorName }))
  );
  const [tutorials] = useState<Tutorial[]>(MOCK_CLUB_TUTORIALS);
  const [showComposer, setShowComposer] = useState(false);
  const [showTutorialUpload, setShowTutorialUpload] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileViewData | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ProfileViewData>>(MOCK_PROFILES);
  // Visibility selection for posts and tutorials
  const [postVisibility, setPostVisibility] = useState<ClubContentVisibility>('club');
  const [tutorialVisibility, setTutorialVisibility] = useState<ClubContentVisibility>('club');

  const posts = filter === 'my' ? myPosts : filter === 'all' ? allPosts : [];

  const handleLike = (postId: string) => {
    const updatePosts = (postList: Post[]) => 
      postList.map(p => 
        p.id === postId 
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      );
    setMyPosts(updatePosts);
    setAllPosts(updatePosts);
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      clubId,
      authorId: 'me',
      authorName: clubName,
      authorType: 'club',
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
      // Ecosystem visibility - determines if post appears in community feed too
      visibility: postVisibility,
    };

    setMyPosts([newPost, ...myPosts]);
    setAllPosts([newPost, ...allPosts]);
    setNewPostContent('');
    setPostVisibility('club'); // Reset to default
    setShowComposer(false);
  };

  const handleViewProfile = (authorId: string, authorName: string, authorType: 'player' | 'coach' | 'club') => {
    if (authorId === 'me') return; // Don't show profile for own posts
    
    const profile = profiles[authorId];
    if (profile) {
      setSelectedProfile(profile);
    } else {
      // Create a basic profile if not found
      setSelectedProfile({
        id: authorId,
        name: authorName,
        type: authorType,
        followerCount: 0,
        followingCount: 0,
        isFollowing: false,
      });
    }
  };

  const handleFollow = (profileId: string) => {
    setProfiles(prev => ({
      ...prev,
      [profileId]: {
        ...prev[profileId],
        isFollowing: !prev[profileId]?.isFollowing,
        followerCount: prev[profileId]?.isFollowing 
          ? (prev[profileId]?.followerCount || 1) - 1 
          : (prev[profileId]?.followerCount || 0) + 1,
      }
    }));
    if (selectedProfile && selectedProfile.id === profileId) {
      setSelectedProfile(prev => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followerCount: prev.isFollowing ? prev.followerCount - 1 : prev.followerCount + 1,
      } : null);
    }
  };

  const getAuthorBadge = (type: 'player' | 'coach' | 'club') => {
    switch (type) {
      case 'coach':
        return <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Coach</span>;
      case 'club':
        return <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">Club</span>;
      case 'player':
        return <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">Player</span>;
      default:
        return null;
    }
  };

  const getAuthorColor = (type: 'player' | 'coach' | 'club') => {
    switch (type) {
      case 'coach': return 'bg-portal-coach';
      case 'club': return 'bg-portal-club';
      case 'player': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getProfilePosts = (profileId: string) => {
    return allPosts.filter(p => p.authorId === profileId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ball Park</h2>
          <p className="text-sm text-gray-500">Share announcements, updates, and connect with members</p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-portal-club text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'my'
              ? 'bg-portal-club text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setFilter('tutorials')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === 'tutorials'
              ? 'bg-portal-club text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Tutorials
        </button>
      </div>

      {/* Tip Card */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <svg className="w-5 h-5 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Club Posts</h4>
            <p className="text-sm text-gray-600">Posts you create here will appear in the Community Ball Park feed with your club badge. Great for announcements, events, and updates!</p>
          </div>
        </div>
      </div>

      {/* Tutorials Section */}
      {filter === 'tutorials' && (
        <div className="space-y-4">
          {/* Upload Tutorial Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowTutorialUpload(true)}
              className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Tutorial
            </button>
          </div>

          {/* Tutorials Grid */}
          {tutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.map(tutorial => (
                <div key={tutorial.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-portal-club/90 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {tutorial.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded">
                        {tutorial.duration} min
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{tutorial.title}</h4>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{tutorial.coachName}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {tutorial.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {tutorial.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded">
                        {tutorial.category}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        {tutorial.skillLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No tutorials yet</h3>
              <p className="text-sm text-gray-500 mb-4">Upload your first tutorial for club members!</p>
              <button
                onClick={() => setShowTutorialUpload(true)}
                className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg"
              >
                Upload Tutorial
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tutorial Upload Modal */}
      {showTutorialUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Upload Tutorial</h3>
                <button
                  onClick={() => { setShowTutorialUpload(false); setTutorialVisibility('club'); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Visibility Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutorial Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTutorialVisibility('club')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      tutorialVisibility === 'club'
                        ? 'border-portal-club bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-semibold text-gray-900">Club Only</span>
                    </div>
                    <p className="text-xs text-gray-500">Only {clubName} members</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTutorialVisibility('both')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      tutorialVisibility === 'both'
                        ? 'border-portal-club bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-gray-900">Club & Community</span>
                    </div>
                    <p className="text-xs text-gray-500">Visible to everyone</p>
                  </button>
                </div>
              </div>

              {tutorialVisibility === 'both' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-700">
                    <strong>Community Reach:</strong> This tutorial will be available to both club members and the public community.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter tutorial title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe what students will learn..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club">
                    <option>Forehand</option>
                    <option>Backhand</option>
                    <option>Serve</option>
                    <option>Volley</option>
                    <option>Footwork</option>
                    <option>Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-portal-club transition-colors cursor-pointer">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">MP4, MOV up to 500MB</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => { setShowTutorialUpload(false); setTutorialVisibility('club'); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-portal-club text-white rounded-xl font-semibold hover:bg-teal-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {filter !== 'tutorials' && <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <div 
              key={post.id} 
              className={`bg-white border border-gray-200 rounded-xl p-5 border-l-4 hover:shadow-sm transition-shadow ${
                post.authorType === 'coach' ? 'border-l-portal-coach' :
                post.authorType === 'club' ? 'border-l-portal-club' : 'border-l-orange-500'
              }`}
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getAuthorColor(post.authorType)}`}>
                  {post.authorName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewProfile(post.authorId, post.authorName, post.authorType)}
                      className={`font-semibold text-gray-900 hover:underline ${post.authorId === 'me' ? 'cursor-default hover:no-underline' : ''}`}
                      disabled={post.authorId === 'me'}
                    >
                      {post.authorId === 'me' ? clubName : post.authorName}
                    </button>
                    {getAuthorBadge(post.authorType)}
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>
                {post.authorId === 'me' && (
                  <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-club">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-club">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                {post.authorId === 'me' && (
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 ml-auto">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-500 mb-4">Share your first announcement with the community!</p>
            <button
              onClick={() => setShowComposer(true)}
              className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg"
            >
              Create Post
            </button>
          </div>
        )}
      </div>}

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Club Post</h3>
                <button
                  onClick={() => { setShowComposer(false); setPostVisibility('club'); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Visibility Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPostVisibility('club')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      postVisibility === 'club'
                        ? 'border-portal-club bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-semibold text-gray-900">Club Only</span>
                    </div>
                    <p className="text-xs text-gray-500">Only {clubName} members can see this post</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostVisibility('both')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      postVisibility === 'both'
                        ? 'border-portal-club bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-gray-900">Club & Community</span>
                    </div>
                    <p className="text-xs text-gray-500">Visible to club and entire community</p>
                  </button>
                </div>
              </div>

              {/* Preview banner for community */}
              {postVisibility === 'both' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-700">
                    <strong>Community Reach:</strong> This post will appear in both your club feed and the public community Ball Park.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-portal-club rounded-full flex items-center justify-center font-bold text-white">
                  {clubName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{clubName}</p>
                  <p className="text-xs text-gray-500">
                    {postVisibility === 'both' ? 'Posting to Club & Community' : 'Posting to Club Members'}
                  </p>
                </div>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share an announcement, update, or news..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-portal-club focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-2 mt-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => { setShowComposer(false); setPostVisibility('club'); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="flex-1 py-3 bg-portal-club text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile View */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          {/* Header */}
          <div className={`sticky top-0 z-10 border-b ${
            selectedProfile.type === 'coach' ? 'bg-green-50 border-green-200' :
            selectedProfile.type === 'club' ? 'bg-teal-50 border-teal-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="max-w-3xl mx-auto px-4 py-4">
              <button
                onClick={() => setSelectedProfile(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Ball Park
              </button>
              
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl ${getAuthorColor(selectedProfile.type)}`}>
                  {selectedProfile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedProfile.name}</h2>
                    {getAuthorBadge(selectedProfile.type)}
                  </div>
                  {selectedProfile.bio && (
                    <p className="text-sm text-gray-600 mb-2">{selectedProfile.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {selectedProfile.location && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {selectedProfile.location}
                      </span>
                    )}
                    {selectedProfile.ntrpLevel && (
                      <span className="text-orange-600 font-medium">NTRP {selectedProfile.ntrpLevel}</span>
                    )}
                    {selectedProfile.rating && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {selectedProfile.rating}
                      </span>
                    )}
                    {selectedProfile.courtCount && (
                      <span className="text-teal-600 font-medium">{selectedProfile.courtCount} courts</span>
                    )}
                  </div>
                  {selectedProfile.specialties && selectedProfile.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedProfile.specialties.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{selectedProfile.followerCount}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{selectedProfile.followingCount}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(selectedProfile.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedProfile.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : selectedProfile.type === 'coach' ? 'bg-portal-coach text-white hover:bg-green-600' :
                          selectedProfile.type === 'club' ? 'bg-portal-club text-white hover:bg-teal-600' :
                          'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {selectedProfile.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  {selectedProfile.type === 'coach' && (
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Book Lesson
                    </button>
                  )}
                  {selectedProfile.type === 'club' && (
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      View Club
                    </button>
                  )}
                  {selectedProfile.type === 'player' && (
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="max-w-3xl mx-auto px-4 py-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Posts</h3>
            <div className="space-y-4">
              {getProfilePosts(selectedProfile.id).length > 0 ? (
                getProfilePosts(selectedProfile.id).map(post => (
                  <div 
                    key={post.id} 
                    className={`bg-white border border-gray-200 rounded-xl p-5 border-l-4 ${
                      post.authorType === 'coach' ? 'border-l-portal-coach' :
                      post.authorType === 'club' ? 'border-l-portal-club' : 'border-l-orange-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getAuthorColor(post.authorType)}`}>
                        {post.authorName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{post.authorName}</span>
                          {getAuthorBadge(post.authorType)}
                        </div>
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-sm ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-club">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-club">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubBallParkTab;
