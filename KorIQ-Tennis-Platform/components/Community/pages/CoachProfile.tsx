import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm, { BookingFormData } from '../../Shared/BookingForm';
import TutorialCard from '../../Shared/TutorialCard';
import { Tutorial, NtrpLevel } from '../../../types';

interface CoachProfileProps {
  onLoginRequired: (action: string, context?: { role?: string }) => void;
  isAuthenticated?: boolean;
  currentUser?: {
    id: string;
    name: string;
    ntrpLevel?: NtrpLevel;
  };
  onMessageCoach?: (coachId: string, coachName: string) => void;
}

// Mock coach data - in real app, would fetch based on ID
const COACH_DATA = {
  id: '1',
  name: 'Sarah Mitchell',
  photo: null,
  location: 'Vancouver, BC',
  ntrpLevel: 'PTR Certified Professional',
  specialties: ['Beginners', 'Juniors', 'Technique', 'Footwork'],
  rating: 4.9,
  reviewCount: 127,
  bio: 'Former WTA player with 15 years of coaching experience. I specialize in building strong fundamentals and competitive play for all ages. My approach focuses on developing proper technique from day one while keeping lessons fun and engaging.',
  hourlyRate: 85,
  isIndependent: false,
  clubName: 'Stanley Park Tennis Club',
  experience: '15+ years',
  certifications: ['PTR Professional', 'USPTA Certified', 'First Aid/CPR'],
  coachingStyle: 'Patient and detail-oriented. I believe in building a strong foundation before advancing to complex tactics. Every player is unique, and I tailor my approach to individual learning styles.',
  availability: 'Mon-Fri: 7am-7pm, Sat: 8am-2pm',
  languages: ['English', 'French'],
  isGold: true,
  reviews: [
    { id: 1, author: 'Mike T.', rating: 5, text: 'Sarah is amazing! My backhand has improved so much after just a few lessons.', date: '2 weeks ago', verified: true },
    { id: 2, author: 'Jennifer L.', rating: 5, text: 'Great with kids. My daughter looks forward to every lesson.', date: '1 month ago', verified: true },
    { id: 3, author: 'Robert K.', rating: 4, text: 'Very professional and knowledgeable. Highly recommend.', date: '2 months ago', verified: false },
  ],
};

// Mock tutorials for this coach
const COACH_TUTORIALS: Tutorial[] = [
  {
    id: 't1',
    coachId: '1',
    coachName: 'Sarah Mitchell',
    title: 'Master the Topspin Forehand',
    description: 'Learn the proper technique for generating heavy topspin on your forehand. Perfect for intermediate players looking to add more power and consistency.',
    videoUrl: '',
    thumbnailUrl: '',
    type: 'Public',
    category: 'Forehand',
    skillLevel: 'Intermediate',
    views: 1234,
    likes: 89,
    duration: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    coachId: '1',
    coachName: 'Sarah Mitchell',
    title: 'Serve Consistency Secrets',
    description: 'My proven 3-step system for developing a reliable, powerful serve. Includes drills you can practice on your own.',
    videoUrl: '',
    thumbnailUrl: '',
    type: 'Private',
    price: 12.99,
    category: 'Serve',
    skillLevel: 'All Levels',
    views: 567,
    likes: 45,
    duration: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    coachId: '1',
    coachName: 'Sarah Mitchell',
    title: 'Footwork Fundamentals',
    description: 'Essential footwork patterns every tennis player should know. Improve your court coverage and balance.',
    videoUrl: '',
    thumbnailUrl: '',
    type: 'Public',
    category: 'Footwork',
    skillLevel: 'Beginner',
    views: 892,
    likes: 67,
    duration: 12,
    createdAt: new Date().toISOString(),
  },
];

const CoachProfile: React.FC<CoachProfileProps> = ({ 
  onLoginRequired, 
  isAuthenticated = false,
  currentUser,
  onMessageCoach,
}) => {
  const { id } = useParams();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'tutorials' | 'reviews'>('about');

  // In real app, fetch coach data based on id
  const coach = COACH_DATA;

  const handleBookLesson = () => {
    if (!isAuthenticated) {
      onLoginRequired('book a lesson', { role: 'player' });
      return;
    }
    setShowBookingForm(true);
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      onLoginRequired('message this coach', { role: 'player' });
      return;
    }
    if (onMessageCoach) {
      onMessageCoach(coach.id, coach.name);
    }
  };

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log('Booking submitted:', data);
    // In real app, send to API
    setShowBookingForm(false);
    setBookingSubmitted(true);
    // Auto-hide success message after 5 seconds
    setTimeout(() => setBookingSubmitted(false), 5000);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Success Message */}
      {bookingSubmitted && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Booking Request Sent!</p>
              <p className="text-sm text-green-600">{coach.name} will respond soon. Check your Messages for updates.</p>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/community/coaches"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Coaches
        </Link>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-coaches to-green-700 flex items-center justify-center text-5xl font-bold text-white">
                {coach.name.charAt(0)}
              </div>
              {coach.isGold && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-black text-gray-900">{coach.name}</h1>
                {coach.isGold && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    GOLD
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <span className="text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {coach.location}
                </span>
                <span className="text-coaches font-medium">{coach.ntrpLevel}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                {renderStars(coach.rating)}
                <span className="text-gray-900 font-bold">{coach.rating}</span>
                <span className="text-gray-400">({coach.reviewCount} reviews)</span>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {coach.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${coach.hourlyRate}<span className="text-gray-400 font-normal text-base">/hour</span>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleBookLesson}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book Lesson
                  </button>
                  <button
                    onClick={handleMessage}
                    className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex gap-1 border-b border-gray-200">
          {[
            { id: 'about', label: 'About', count: null },
            { id: 'tutorials', label: 'Tutorials', count: COACH_TUTORIALS.length },
            { id: 'reviews', label: 'Reviews', count: coach.reviewCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1.5 text-gray-400">({tab.count})</span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coaches" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'about' && (
              <>
                {/* About */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed">{coach.bio}</p>
                </div>

                {/* Coaching Style */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Coaching Style</h2>
                  <p className="text-gray-600 leading-relaxed">{coach.coachingStyle}</p>
                </div>
              </>
            )}

            {activeTab === 'tutorials' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Tutorials by {coach.name.split(' ')[0]}</h2>
                </div>
                
                {COACH_TUTORIALS.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {COACH_TUTORIALS.map((tutorial) => (
                      <TutorialCard
                        key={tutorial.id}
                        tutorial={tutorial}
                        showCoachInfo={false}
                        onWatch={() => {
                          if (!isAuthenticated && tutorial.type === 'Private') {
                            onLoginRequired('purchase this tutorial', { role: 'player' });
                          }
                        }}
                        onPurchase={() => {
                          if (!isAuthenticated) {
                            onLoginRequired('purchase this tutorial', { role: 'player' });
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No tutorials yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {coach.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                          {review.author.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900 font-medium">{review.author}</p>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Verified Lesson
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs">{review.date}</p>
                        </div>
                        <div className="ml-auto">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-gray-500 text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Experience</p>
                  <p className="text-gray-900">{coach.experience}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Availability</p>
                  <p className="text-gray-900 text-sm">{coach.availability}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Languages</p>
                  <p className="text-gray-900">{coach.languages.join(', ')}</p>
                </div>
                {coach.clubName && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Club</p>
                    <p className="text-coaches">{coach.clubName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-2">
                {coach.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-coaches" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            {!isAuthenticated && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <p className="text-gray-900 font-medium mb-2">Ready to improve your game?</p>
                <p className="text-gray-500 text-sm mb-4">Create a free account to message {coach.name.split(' ')[0]} and book lessons.</p>
                <button
                  onClick={() => onLoginRequired('connect with this coach', { role: 'player' })}
                  className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Get Started Free
                </button>
              </div>
            )}

            {/* Quick Book Card (Authenticated) */}
            {isAuthenticated && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Quick Book</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Request a lesson with {coach.name.split(' ')[0]}. They typically respond within 24 hours.
                </p>
                <button
                  onClick={handleBookLesson}
                  className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Lesson - ${coach.hourlyRate}/hr
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          coachId={coach.id}
          coachName={coach.name}
          coachRate={coach.hourlyRate}
          playerNtrp={currentUser?.ntrpLevel}
          onSubmit={handleBookingSubmit}
          onClose={() => setShowBookingForm(false)}
        />
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CoachProfile;
