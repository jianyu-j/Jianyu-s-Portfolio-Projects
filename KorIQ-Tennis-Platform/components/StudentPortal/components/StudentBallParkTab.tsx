import React, { useState } from 'react';

interface StudentBallParkTabProps {
  studentId: string;
  studentName: string;
  clubId: string;
  clubName: string;
}

interface Post {
  id: string;
  clubId: string;
  authorId: string;
  authorName: string;
  authorType: 'player' | 'coach' | 'club' | 'student';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isTutorial?: boolean;
}

interface Tutorial {
  id: string;
  coachId: string;
  coachName: string;
  clubId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number;
  category: string;
  skillLevel: string;
  views: number;
  likes: number;
}

interface ProfileViewData {
  id: string;
  name: string;
  type: 'player' | 'coach' | 'club' | 'student';
  bio?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  ntrpLevel?: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

// Mock club tutorials
const MOCK_CLUB_TUTORIALS: Tutorial[] = [
  {
    id: 'tut-1',
    coachId: 'coach1',
    coachName: 'Coach Mike Chen',
    clubId: 'club1',
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
    clubId: 'club1',
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
    clubId: 'club1',
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

// Mock posts scoped to club
const createMockClubPosts = (studentName: string, clubId: string): Post[] => [
  {
    id: 'all-1',
    clubId,
    authorId: 'coach1',
    authorName: 'Coach Mike Chen',
    authorType: 'coach',
    content: 'Great session with the intermediate group today! Focus on footwork and split steps.',
    likes: 12,
    comments: 3,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: 'all-2',
    clubId,
    authorId: 'me',
    authorName: studentName,
    authorType: 'student',
    content: 'Thanks Coach Mike for the great lesson today! Finally getting my serve over the net consistently!',
    likes: 8,
    comments: 2,
    timestamp: '4 hours ago',
    isLiked: false,
  },
  {
    id: 'all-3',
    clubId,
    authorId: 'club1',
    authorName: 'Vancouver Tennis Academy',
    authorType: 'club',
    content: 'Reminder: Club tournament registration closes Friday! All students are encouraged to participate.',
    likes: 23,
    comments: 5,
    timestamp: '6 hours ago',
    isLiked: true,
  },
  {
    id: 'all-4',
    clubId,
    authorId: 'coach2',
    authorName: 'Coach Sarah Mitchell',
    authorType: 'coach',
    content: 'New drill video posted! Check out the "Quick Feet" footwork drill in the Tutorials section.',
    likes: 15,
    comments: 4,
    timestamp: 'Yesterday',
    isLiked: true,
    isTutorial: true,
  },
  {
    id: 'all-5',
    clubId,
    authorId: 'student2',
    authorName: 'Jake Thompson',
    authorType: 'student',
    content: 'Looking for a hitting partner this Saturday morning. Anyone available? I\'m working on my serve.',
    likes: 5,
    comments: 3,
    timestamp: 'Yesterday',
    isLiked: false,
  },
];

const MOCK_PROFILES: Record<string, ProfileViewData> = {
  'coach1': {
    id: 'coach1',
    name: 'Coach Mike Chen',
    type: 'coach',
    bio: 'Head coach with 10+ years of experience.',
    specialties: ['Serve', 'Strategy', 'Mental Game'],
    rating: 4.9,
    followerCount: 189,
    followingCount: 34,
    isFollowing: true,
  },
  'coach2': {
    id: 'coach2',
    name: 'Coach Sarah Mitchell',
    type: 'coach',
    bio: 'PTR Certified with 8 years experience.',
    specialties: ['Juniors', 'Footwork', 'Mental Game'],
    rating: 4.9,
    followerCount: 156,
    followingCount: 45,
    isFollowing: false,
  },
  'student2': {
    id: 'student2',
    name: 'Jake Thompson',
    type: 'student',
    bio: 'Tennis enthusiast, learning every day.',
    ntrpLevel: '3.5',
    followerCount: 18,
    followingCount: 32,
    isFollowing: false,
  },
};

const StudentBallParkTab: React.FC<StudentBallParkTabProps> = ({ studentId, studentName, clubId, clubName }) => {
  const [filter, setFilter] = useState<'all' | 'my' | 'tutorials'>('all');
  const [allPosts, setAllPosts] = useState<Post[]>(createMockClubPosts(studentName, clubId));
  const [tutorials] = useState<Tutorial[]>(MOCK_CLUB_TUTORIALS.filter(t => t.clubId === clubId));
  const [showComposer, setShowComposer] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileViewData | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ProfileViewData>>(MOCK_PROFILES);

  const myPosts = allPosts.filter(p => p.authorId === 'me');
  const posts = filter === 'my' ? myPosts : filter === 'all' ? allPosts : [];

  const handleLike = (postId: string) => {
    setAllPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      clubId,
      authorId: 'me',
      authorName: studentName,
      authorType: 'student',
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      isLiked: false,
    };

    setAllPosts([newPost, ...allPosts]);
    setNewPostContent('');
    setShowComposer(false);
  };

  const handleViewProfile = (authorId: string, authorName: string, authorType: Post['authorType']) => {
    if (authorId === 'me') return;
    
    const profile = profiles[authorId];
    if (profile) {
      setSelectedProfile(profile);
    } else {
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

  const getAuthorBadge = (type: Post['authorType']) => {
    switch (type) {
      case 'coach':
        return <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Coach</span>;
      case 'club':
        return <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">Club</span>;
      case 'student':
        return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">Student</span>;
      case 'player':
        return <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">Player</span>;
      default:
        return null;
    }
  };

  const getAuthorColor = (type: Post['authorType']) => {
    switch (type) {
      case 'coach': return 'bg-portal-coach';
      case 'club': return 'bg-portal-club';
      case 'student': return 'bg-portal-student';
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
          <p className="text-sm text-gray-500">Connect with your {clubName} community</p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="px-4 py-2 bg-portal-student text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </button>
      </div>

      {/* Club Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-portal-student" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Your Club Feed</h4>
            <p className="text-sm text-gray-600">Connect with coaches and fellow students at {clubName}. Ask questions, share progress, and find hitting partners!</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-portal-student text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'my'
              ? 'bg-portal-student text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setFilter('tutorials')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            filter === 'tutorials'
              ? 'bg-portal-student text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Tutorials
        </button>
      </div>

      {/* Tutorials Section */}
      {filter === 'tutorials' && (
        <div className="space-y-4">
          {tutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.map(tutorial => (
                <div key={tutorial.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-portal-student/90 rounded-full flex items-center justify-center">
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
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
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
              <p className="text-sm text-gray-500">Your coaches will upload tutorials here soon!</p>
            </div>
          )}
        </div>
      )}

      {/* Posts */}
      {filter !== 'tutorials' && (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <div 
                key={post.id} 
                className={`bg-white border border-gray-200 rounded-xl p-5 border-l-4 hover:shadow-sm transition-shadow ${
                  post.authorType === 'coach' ? 'border-l-portal-coach' :
                  post.authorType === 'club' ? 'border-l-portal-club' :
                  post.authorType === 'student' ? 'border-l-portal-student' : 'border-l-orange-500'
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
                        {post.authorId === 'me' ? studentName : post.authorName}
                      </button>
                      {getAuthorBadge(post.authorType)}
                      {post.authorId === 'me' && (
                        <span className="text-xs text-gray-400">(You)</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  {post.isTutorial && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
                      TUTORIAL
                    </span>
                  )}
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
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-student">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
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
              <p className="text-sm text-gray-500 mb-4">Be the first to share something with the club!</p>
              <button
                onClick={() => setShowComposer(true)}
                className="px-4 py-2 bg-portal-student text-white font-semibold rounded-lg"
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      )}

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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">
                  <strong>Club-Only:</strong> Your post will be visible to coaches and students at {clubName}.
                </p>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-portal-student rounded-full flex items-center justify-center font-bold text-white">
                  {studentName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{studentName}</p>
                  <p className="text-xs text-gray-500">Posting to {clubName}</p>
                </div>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Ask a question, share your progress, or find a hitting partner..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-portal-student focus:border-transparent resize-none"
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
                onClick={() => setShowComposer(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="flex-1 py-3 bg-portal-student text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className={`sticky top-0 z-10 border-b ${
            selectedProfile.type === 'coach' ? 'bg-green-50 border-green-200' :
            selectedProfile.type === 'club' ? 'bg-teal-50 border-teal-200' :
            selectedProfile.type === 'student' ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
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
                    {selectedProfile.ntrpLevel && (
                      <span className="text-portal-student font-medium">NTRP {selectedProfile.ntrpLevel}</span>
                    )}
                    {selectedProfile.rating && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {selectedProfile.rating}
                      </span>
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
                        : 'bg-portal-student text-white hover:bg-blue-600'
                    }`}
                  >
                    {selectedProfile.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Posts</h3>
            <div className="space-y-4">
              {getProfilePosts(selectedProfile.id).length > 0 ? (
                getProfilePosts(selectedProfile.id).map(post => (
                  <div 
                    key={post.id} 
                    className={`bg-white border border-gray-200 rounded-xl p-5 border-l-4 ${
                      post.authorType === 'coach' ? 'border-l-portal-coach' :
                      post.authorType === 'club' ? 'border-l-portal-club' :
                      post.authorType === 'student' ? 'border-l-portal-student' : 'border-l-orange-500'
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
                      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-portal-student">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments}
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

export default StudentBallParkTab;
