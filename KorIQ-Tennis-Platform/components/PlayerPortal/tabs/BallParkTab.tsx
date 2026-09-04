import React, { useState } from 'react';

interface BallParkTabProps {
  playerId: string;
  playerName: string;
}

interface Post {
  id: string;
  clubId?: string; // For club ecosystem - posts scoped to specific club
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
  tutorialPrice?: number;
  // Ecosystem visibility fields
  visibility?: 'club' | 'both'; // Only for club content
  clubName?: string; // For branding when club content is shared to community
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

// Mock posts
const MOCK_POSTS: Post[] = [
  {
    id: '1',
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
    id: '2',
    authorId: 'player1',
    authorName: 'Sarah Johnson',
    authorType: 'player',
    content: 'Great session at Stanley Park this morning! Thanks @Alex for the match!',
    likes: 23,
    comments: 5,
    timestamp: '4 hours ago',
    isLiked: true,
  },
  {
    id: '3',
    authorId: 'club1',
    authorName: 'Vancouver Tennis Club',
    authorType: 'club',
    content: 'Reminder: Our annual doubles tournament registration closes this Friday! Sign up now at the front desk or online.',
    likes: 67,
    comments: 8,
    timestamp: '6 hours ago',
    isLiked: false,
  },
  {
    id: '4',
    authorId: 'me',
    authorName: 'You',
    authorType: 'player',
    content: 'Looking for a hitting partner tomorrow afternoon. Anyone free? NTRP 3.5-4.0 preferred!',
    likes: 8,
    comments: 3,
    timestamp: 'Yesterday',
    isLiked: false,
  },
  {
    id: '5',
    authorId: 'coach2',
    authorName: 'Coach Sarah Mitchell',
    authorType: 'coach',
    content: 'New tutorial posted! Master the Topspin Forehand - 15 minute breakdown',
    likes: 89,
    comments: 15,
    timestamp: 'Yesterday',
    isLiked: true,
    isTutorial: true,
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
  'club1': {
    id: 'club1',
    name: 'Vancouver Tennis Club',
    type: 'club',
    bio: 'Premier tennis facility in downtown Vancouver. 12 courts, professional instruction, and vibrant community.',
    location: 'Vancouver, BC',
    courtCount: 12,
    followerCount: 1245,
    followingCount: 0,
    isFollowing: true,
  },
};

const BallParkTab: React.FC<BallParkTabProps> = ({ playerId, playerName }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const [showComposer, setShowComposer] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileViewData | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ProfileViewData>>(MOCK_PROFILES);

  // Community ecosystem filtering:
  // Only show posts that are either:
  // 1. Pure community posts (no clubId)
  // 2. Club posts explicitly shared to community (visibility === 'both')
  const communityPosts = posts.filter(p => !p.clubId || p.visibility === 'both');
  
  const filteredPosts = filter === 'my' 
    ? communityPosts.filter(p => p.authorId === 'me')
    : communityPosts;

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: 'me',
      authorName: playerName,
      authorType: 'player',
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
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

  const getProfilePosts = (profileId: string) => {
    // Only show community-visible posts for this profile
    return communityPosts.filter(p => p.authorId === profileId);
  };

  // Get display name with club branding if applicable
  const getDisplayName = (post: Post) => {
    if (post.authorId === 'me') return playerName;
    // Show club branding for club content shared to community
    if (post.clubName && post.visibility === 'both') {
      return `${post.authorName} • ${post.clubName}`;
    }
    return post.authorName;
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Ball Park</h2>
        <button
          onClick={() => setShowComposer(true)}
          className="px-4 py-2 bg-ballpark text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-ballpark text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'my'
              ? 'bg-ballpark text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          My Posts
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
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
                      className={`font-semibold text-gray-900 hover:underline text-left ${post.authorId === 'me' ? 'cursor-default hover:no-underline' : ''}`}
                      disabled={post.authorId === 'me'}
                    >
                      {getDisplayName(post)}
                    </button>
                    {getAuthorBadge(post.authorType)}
                  </div>
                  <span className="text-xs text-gray-500">{post.timestamp}</span>
                </div>
                {post.isTutorial && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                    FREE TUTORIAL
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Tutorial Preview */}
              {post.isTutorial && (
                <div className="mb-4 bg-gray-100 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-24 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Watch Tutorial</p>
                    <p className="text-sm text-gray-500">15 min • Intermediate</p>
                  </div>
                </div>
              )}

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
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
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
            <p className="text-sm text-gray-500 mb-4">Be the first to share something!</p>
            <button
              onClick={() => setShowComposer(true)}
              className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
            >
              Create Post
            </button>
          </div>
        )}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Post</h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                  {playerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{playerName}</p>
                  <p className="text-xs text-gray-500">Posting to Ball Park</p>
                </div>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind? Share tips, ask questions, or find partners..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-2 mt-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowComposer(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500">
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

export default BallParkTab;
