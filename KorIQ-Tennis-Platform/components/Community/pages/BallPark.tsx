import React, { useState } from 'react';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isCoach?: boolean;
  };
  content: string;
  media?: { type: 'image' | 'video'; url: string }[];
  tutorial?: {
    title: string;
    isPrivate: boolean;
    thumbnail: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface BallParkProps {
  onLoginRequired: (action: string) => void;
}

// Mock posts data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { id: '1', name: 'Alex Thompson', isCoach: false },
    content: 'Just hit 100 consecutive forehands without missing! My consistency is finally improving. Thanks to everyone who gave me tips on my footwork.',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: '2',
    author: { id: '2', name: 'Coach Sarah Mitchell', isCoach: true },
    content: 'New tutorial: Master the one-handed backhand slice. This shot is underrated for recreational players!',
    tutorial: {
      title: 'One-Handed Backhand Slice Masterclass',
      isPrivate: false,
      thumbnail: '/tutorial-thumb.jpg',
    },
    timestamp: '4 hours ago',
    likes: 67,
    comments: 15,
    isLiked: false,
  },
  {
    id: '3',
    author: { id: '3', name: 'Jennifer Lee' },
    content: 'Looking for doubles partners this weekend at Stanley Park! NTRP 3.5-4.0 preferred. DM me if interested.',
    timestamp: '5 hours ago',
    likes: 12,
    comments: 6,
    isLiked: false,
  },
  {
    id: '4',
    author: { id: '4', name: 'Coach Marcus Chen', isCoach: true },
    content: 'Advanced serve technique breakdown for competitive players. Learn the trophy position secrets the pros use.',
    tutorial: {
      title: 'Pro Serve Secrets: Trophy Position',
      isPrivate: true,
      thumbnail: '/tutorial-thumb-2.jpg',
    },
    timestamp: '6 hours ago',
    likes: 89,
    comments: 23,
    isLiked: false,
  },
  {
    id: '5',
    author: { id: '5', name: 'Mike Rodriguez' },
    content: 'Finally broke 4.0 NTRP! Been grinding for 2 years. Next goal: compete in local tournaments. Any recommendations for beginner-friendly tournaments in Vancouver?',
    timestamp: '8 hours ago',
    likes: 156,
    comments: 42,
    isLiked: false,
  },
  {
    id: '6',
    author: { id: '6', name: 'Emma Watson' },
    content: 'Beautiful morning session at Jericho. Nothing beats playing with the ocean view. Who else loves early morning tennis?',
    media: [{ type: 'image', url: '/court-sunrise.jpg' }],
    timestamp: '10 hours ago',
    likes: 78,
    comments: 19,
    isLiked: false,
  },
];

const BallPark: React.FC<BallParkProps> = ({ onLoginRequired }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [postContent, setPostContent] = useState('');

  const handleLike = (postId: string) => {
    onLoginRequired('like this post');
  };

  const handleComment = (postId: string) => {
    onLoginRequired('comment on this post');
  };

  const handleShare = (postId: string) => {
    onLoginRequired('share this post');
  };

  const handlePost = () => {
    onLoginRequired('create a post');
  };

  const handleViewProfile = (authorId: string) => {
    onLoginRequired('view this profile');
  };

  const handleWatchTutorial = (isPrivate: boolean) => {
    if (isPrivate) {
      onLoginRequired('watch this tutorial');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Ball Park
          </h1>
          <p className="text-gray-600">
            The tennis community feed - share, connect, engage
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Composer */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-ballpark rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-ballpark">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <textarea
                placeholder="What's happening on court?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onClick={handlePost}
                className="w-full resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
                rows={2}
              />
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={handlePost}
                    className="p-2 rounded-lg text-gray-400 hover:text-ballpark hover:bg-purple-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePost}
                    className="p-2 rounded-lg text-gray-400 hover:text-ballpark hover:bg-purple-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  className="px-4 py-2 bg-ballpark hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 border-l-4 border-l-ballpark rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-4">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => handleViewProfile(post.author.id)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-ballpark to-purple-700 flex items-center justify-center text-white font-bold"
                  >
                    {post.author.name.charAt(0)}
                  </button>
                  <div>
                    <button
                      onClick={() => handleViewProfile(post.author.id)}
                      className="font-semibold text-gray-900 hover:text-ballpark transition-colors flex items-center gap-1"
                    >
                      {post.author.name}
                      {post.author.isCoach && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-ballpark text-xs font-bold rounded">
                          Coach
                        </span>
                      )}
                    </button>
                    <p className="text-xs text-ballpark/70">{post.timestamp}</p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>

                {/* Tutorial Card */}
                {post.tutorial && (
                  <div
                    onClick={() => handleWatchTutorial(post.tutorial!.isPrivate)}
                    className="relative bg-gray-100 rounded-xl overflow-hidden mb-3 cursor-pointer group"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-ballpark ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {post.tutorial.isPrivate && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <p className="font-semibold">Login to watch</p>
                          <p className="text-sm text-white/70">Private tutorial</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-semibold">{post.tutorial.title}</p>
                      <p className="text-white/70 text-sm">
                        {post.tutorial.isPrivate ? 'Private Tutorial' : 'Public Tutorial'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Media */}
                {post.media && (
                  <div className="rounded-xl overflow-hidden mb-3 bg-gray-100">
                    {post.media.map((item, i) => (
                      <div key={i} className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                        <svg className="w-12 h-12 text-ballpark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-ballpark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => handleComment(post.id)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-ballpark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-ballpark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <button className="px-6 py-2.5 text-ballpark border border-purple-200 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BallPark;
