import React, { useState } from 'react';
import { Tutorial, TutorialCategory, TutorialSkillLevel, TutorialType, CoachSubscription } from '../../../types';

interface TutorialsTabProps {
  coachId: string;
  coachName: string;
  subscription: CoachSubscription;
  onUpgradeClick: () => void;
}

// Mock tutorials
const MOCK_TUTORIALS: Tutorial[] = [
  {
    id: '1',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    title: 'Master the Topspin Forehand',
    description: 'Learn the fundamentals of generating topspin on your forehand for more consistent and powerful shots.',
    videoUrl: '',
    thumbnailUrl: '',
    type: 'Public',
    category: 'Forehand',
    skillLevel: 'Intermediate',
    duration: 12,
    views: 1250,
    likes: 89,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    title: 'Serve Consistency Secrets',
    description: 'My proven technique for hitting consistent first serves under pressure.',
    videoUrl: '',
    thumbnailUrl: '',
    type: 'Private',
    price: 14.99,
    category: 'Serve',
    skillLevel: 'Advanced',
    duration: 25,
    views: 340,
    likes: 45,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

const TutorialsTab: React.FC<TutorialsTabProps> = ({ coachId, coachName, subscription, onUpgradeClick }) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>(MOCK_TUTORIALS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    type: 'Public' as TutorialType,
    price: 5,
    category: 'Forehand' as TutorialCategory,
    skillLevel: 'All Levels' as TutorialSkillLevel,
  });

  const filteredTutorials = tutorials.filter(t => {
    if (filter === 'all') return true;
    return t.type.toLowerCase() === filter;
  });

  const privateTutorialsCount = tutorials.filter(t => t.type === 'Private').length;
  const isAtLimit = subscription.plan === 'Free' && privateTutorialsCount >= 3;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadForm.type === 'Private' && isAtLimit) {
      alert('You\'ve reached your private tutorial limit. Upgrade to Coach Gold for unlimited tutorials.');
      return;
    }

    const newTutorial: Tutorial = {
      id: Date.now().toString(),
      coachId,
      coachName,
      title: uploadForm.title,
      description: uploadForm.description,
      videoUrl: uploadForm.videoUrl,
      type: uploadForm.type,
      price: uploadForm.type === 'Private' ? uploadForm.price : undefined,
      category: uploadForm.category,
      skillLevel: uploadForm.skillLevel,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTutorials(prev => [newTutorial, ...prev]);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      videoUrl: '',
      type: 'Public',
      price: 5,
      category: 'Forehand',
      skillLevel: 'All Levels',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      setTutorials(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Tutorials</h2>
          <p className="text-sm text-gray-500">Create and manage your video tutorials</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Tutorial
        </button>
      </div>

      {/* Usage Indicator (Free Tier) */}
      {subscription.plan === 'Free' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Private Tutorials</p>
                <p className="text-sm text-gray-500">{privateTutorialsCount}/3 used this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${privateTutorialsCount >= 3 ? 'bg-red-500' : 'bg-portal-coach'}`}
                  style={{ width: `${(privateTutorialsCount / 3) * 100}%` }}
                />
              </div>
              {isAtLimit && (
                <button
                  onClick={onUpgradeClick}
                  className="text-sm font-semibold text-portal-coach hover:underline"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'public', 'private'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-portal-coach text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && ` (${tutorials.filter(t => t.type.toLowerCase() === f).length})`}
          </button>
        ))}
      </div>

      {/* Tutorial Grid */}
      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutorials.map(tutorial => (
            <div
              key={tutorial.id}
              className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors cursor-pointer">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                {/* Type badge */}
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
                  tutorial.type === 'Public' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-black text-white'
                }`}>
                  {tutorial.type === 'Public' ? 'FREE' : `$${tutorial.price}`}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{tutorial.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tutorial.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {tutorial.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {tutorial.likes}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full">{tutorial.skillLevel}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tutorial.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No tutorials yet</h3>
          <p className="text-gray-500 mb-4">Upload your first tutorial to start sharing your knowledge</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Upload Tutorial
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Upload Tutorial</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-portal-coach transition-colors cursor-pointer">
                  <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">MP4, MOV up to 500MB</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Or paste video URL:</p>
                  <input
                    type="url"
                    value={uploadForm.videoUrl}
                    onChange={e => setUploadForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={uploadForm.title}
                  onChange={e => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Master the Topspin Forehand"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">{uploadForm.title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  value={uploadForm.description}
                  onChange={e => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What will viewers learn from this tutorial?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{uploadForm.description.length}/500</p>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutorial Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadForm(prev => ({ ...prev, type: 'Public' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      uploadForm.type === 'Public'
                        ? 'border-portal-coach bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Public (Free)</p>
                    <p className="text-xs text-gray-500 mt-1">Shows everywhere, free to watch</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadForm(prev => ({ ...prev, type: 'Private' }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      uploadForm.type === 'Private'
                        ? 'border-portal-coach bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isAtLimit && uploadForm.type !== 'Private' ? 'opacity-50' : ''}`}
                    disabled={isAtLimit && uploadForm.type !== 'Private'}
                  >
                    <p className="font-semibold text-gray-900">Private (Paid)</p>
                    <p className="text-xs text-gray-500 mt-1">On your profile only, you set price</p>
                    {isAtLimit && <p className="text-xs text-red-500 mt-1">Limit reached</p>}
                  </button>
                </div>
              </div>

              {/* Price (for Private) */}
              {uploadForm.type === 'Private' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    step={0.01}
                    value={uploadForm.price}
                    onChange={e => setUploadForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum $5. You receive ${(uploadForm.price * 0.9).toFixed(2)} (after 10% KorIQ fee)
                  </p>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={uploadForm.category}
                  onChange={e => setUploadForm(prev => ({ ...prev, category: e.target.value as TutorialCategory }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent"
                >
                  <option value="Forehand">Forehand</option>
                  <option value="Backhand">Backhand</option>
                  <option value="Serve">Serve</option>
                  <option value="Volley">Volley</option>
                  <option value="Footwork">Footwork</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level *</label>
                <select
                  required
                  value={uploadForm.skillLevel}
                  onChange={e => setUploadForm(prev => ({ ...prev, skillLevel: e.target.value as TutorialSkillLevel }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Publish Tutorial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialsTab;
