import React, { useState } from 'react';
import { NtrpLevel, BookingRequest, BookingStatus, Tutorial } from '../../../types';
import BookingForm, { BookingFormData } from '../../Shared/BookingForm';
import TutorialCard from '../../Shared/TutorialCard';

interface CoachesTabProps {
  playerId: string;
  playerName: string;
  playerNtrp?: NtrpLevel;
  onMessageCoach: (coachId: string, coachName: string) => void;
}

interface CoachCard {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  specialties: string[];
  hourlyRate: number;
  city: string;
  bio: string;
  isGold: boolean;
}

// Mock coaches
const MOCK_COACHES: CoachCard[] = [
  {
    id: '1',
    name: 'Coach Mike Chen',
    photo: '',
    rating: 4.9,
    reviews: 87,
    specialties: ['Serve Technique', 'Strategy', 'Advanced Players'],
    hourlyRate: 75,
    city: 'Vancouver, BC',
    bio: '15+ years coaching experience. Former collegiate player.',
    isGold: true,
  },
  {
    id: '2',
    name: 'Coach Sarah Mitchell',
    photo: '',
    rating: 4.8,
    reviews: 54,
    specialties: ['Beginners', 'Juniors', 'Footwork'],
    hourlyRate: 65,
    city: 'Vancouver, BC',
    bio: 'Passionate about helping beginners fall in love with tennis.',
    isGold: false,
  },
  {
    id: '3',
    name: 'Coach David Park',
    photo: '',
    rating: 4.7,
    reviews: 112,
    specialties: ['Competition Prep', 'Mental Game', 'Advanced'],
    hourlyRate: 90,
    city: 'Burnaby, BC',
    bio: 'Certified PTR Pro. Focused on competitive players.',
    isGold: true,
  },
];

// Mock bookings
const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: 'b1',
    playerId: 'me',
    playerName: 'You',
    playerPhoto: '',
    playerNtrp: NtrpLevel.NTRP_3_5,
    coachId: '1',
    coachName: 'Coach Mike Chen',
    lessonType: 'Private',
    preferredDate: '2024-02-20',
    preferredTime: 'Morning',
    duration: 60,
    location: 'Stanley Park Courts',
    message: 'Looking to improve my serve',
    status: 'Approved',
    createdAt: '2024-02-15',
  },
  {
    id: 'b2',
    playerId: 'me',
    playerName: 'You',
    playerPhoto: '',
    playerNtrp: NtrpLevel.NTRP_3_5,
    coachId: '2',
    coachName: 'Coach Sarah Mitchell',
    lessonType: 'Group',
    preferredDate: '2024-02-25',
    preferredTime: 'Afternoon',
    duration: 90,
    location: 'TBD',
    message: 'Interested in the group class',
    status: 'Pending',
    createdAt: '2024-02-16',
  },
];

// Mock purchased tutorials
const MOCK_PURCHASED_TUTORIALS: Tutorial[] = [
  {
    id: 't1',
    coachId: '1',
    coachName: 'Coach Mike Chen',
    coachPhoto: '',
    title: 'Master the Topspin Forehand',
    description: 'Complete breakdown of topspin forehand technique',
    type: 'Private',
    price: 15,
    videoUrl: '',
    thumbnailUrl: '',
    duration: 25,
    category: 'Groundstrokes',
    skillLevel: 'Intermediate',
    views: 1245,
    likes: 89,
    createdAt: '2024-01-10',
    purchasedAt: '2024-02-01',
  },
];

const CoachesTab: React.FC<CoachesTabProps> = ({ playerId, playerName, playerNtrp, onMessageCoach }) => {
  const [activeView, setActiveView] = useState<'browse' | 'bookings' | 'tutorials'>('browse');
  const [coaches] = useState<CoachCard[]>(MOCK_COACHES);
  const [bookings, setBookings] = useState<BookingRequest[]>(MOCK_BOOKINGS);
  const [purchasedTutorials] = useState<Tutorial[]>(MOCK_PURCHASED_TUTORIALS);
  
  const [selectedCoach, setSelectedCoach] = useState<CoachCard | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    specialty: '',
    priceMax: '',
    location: '',
  });

  const filteredCoaches = coaches.filter(c => {
    if (filters.specialty && !c.specialties.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()))) return false;
    if (filters.priceMax && c.hourlyRate > parseInt(filters.priceMax)) return false;
    if (filters.location && !c.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  });

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const upcomingBookings = bookings.filter(b => b.status === 'Approved' && new Date(b.preferredDate) >= new Date());
  const pastBookings = bookings.filter(b => b.status === 'Completed' || (b.status === 'Approved' && new Date(b.preferredDate) < new Date()));

  const handleBookLesson = (formData: BookingFormData) => {
    if (!selectedCoach) return;
    
    const newBooking: BookingRequest = {
      id: `b${Date.now()}`,
      playerId,
      playerName,
      playerPhoto: '',
      playerNtrp: playerNtrp || NtrpLevel.NTRP_3_0,
      coachId: selectedCoach.id,
      coachName: selectedCoach.name,
      lessonType: formData.lessonType,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      duration: formData.duration,
      location: formData.location,
      message: formData.message,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings([newBooking, ...bookings]);
    setShowBookingForm(false);
    setSelectedCoach(null);
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'browse', label: 'Browse Coaches' },
          { id: 'bookings', label: 'My Bookings', count: pendingBookings.length },
          { id: 'tutorials', label: 'Purchased Tutorials', count: purchasedTutorials.length },
        ].map(view => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as typeof activeView)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative ${
              activeView === view.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {view.label}
            {view.count !== undefined && view.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeView === view.id ? 'bg-coaches text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {view.count}
              </span>
            )}
            {activeView === view.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coaches" />
            )}
          </button>
        ))}
      </div>

      {/* Browse Coaches View */}
      {activeView === 'browse' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="text"
              placeholder="Specialty (e.g. Serve)"
              value={filters.specialty}
              onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coaches"
            />
            <select
              value={filters.priceMax}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coaches"
            >
              <option value="">Any Price</option>
              <option value="50">Under $50/hr</option>
              <option value="75">Under $75/hr</option>
              <option value="100">Under $100/hr</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coaches"
            />
          </div>

          {/* Coach Cards */}
          <div className="space-y-4">
            {filteredCoaches.map(coach => (
              <div key={coach.id} className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-coaches hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center font-bold text-coaches text-xl flex-shrink-0">
                    {coach.name.split(' ')[1]?.charAt(0) || coach.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{coach.name}</h4>
                      {coach.isGold && (
                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">GOLD</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {coach.rating} ({coach.reviews})
                      </span>
                      <span>{coach.city}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{coach.bio}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {coach.specialties.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-green-50 text-coaches text-xs rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gray-900">${coach.hourlyRate}</p>
                    <p className="text-xs text-gray-500">per hour</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedCoach(coach);
                      setShowBookingForm(true);
                    }}
                    className="flex-1 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
                  >
                    Book Lesson
                  </button>
                  <button
                    onClick={() => onMessageCoach(coach.id, coach.name)}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                  >
                    Message
                  </button>
                  <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Bookings View */}
      {activeView === 'bookings' && (
        <div className="space-y-6">
          {/* Pending */}
          {pendingBookings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Pending Requests ({pendingBookings.length})
              </h3>
              <div className="space-y-3">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-yellow-400">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.coachName}</h4>
                        <p className="text-sm text-gray-500">{booking.lessonType} Lesson • {booking.duration} min</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                      <p>Time: {booking.preferredTime}</p>
                      <p>Location: {booking.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingBookings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Upcoming Lessons ({upcomingBookings.length})
              </h3>
              <div className="space-y-3">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-coaches">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.coachName}</h4>
                        <p className="text-sm text-gray-500">{booking.lessonType} Lesson • {booking.duration} min</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Confirmed
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <p>Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                      <p>Time: {booking.preferredTime}</p>
                      <p>Location: {booking.location}</p>
                    </div>
                    <button
                      onClick={() => onMessageCoach(booking.coachId, booking.coachName)}
                      className="text-sm text-coaches font-medium hover:underline"
                    >
                      Message Coach →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastBookings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Past Lessons ({pastBookings.length})
              </h3>
              <div className="space-y-3">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 opacity-75">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{booking.coachName}</h4>
                        <p className="text-sm text-gray-500">{booking.lessonType} Lesson • {new Date(booking.preferredDate).toLocaleDateString()}</p>
                      </div>
                      <button className="text-sm text-coaches font-medium hover:underline">
                        Leave Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookings.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No bookings yet</h3>
              <p className="text-sm text-gray-500 mb-4">Book a lesson with a coach to get started!</p>
              <button
                onClick={() => setActiveView('browse')}
                className="px-4 py-2 bg-coaches text-white font-semibold rounded-lg"
              >
                Browse Coaches
              </button>
            </div>
          )}
        </div>
      )}

      {/* Purchased Tutorials View */}
      {activeView === 'tutorials' && (
        <div className="space-y-4">
          {purchasedTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedTutorials.map(tutorial => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  isPurchased={true}
                  onWatch={() => console.log('Watch tutorial:', tutorial.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No tutorials purchased</h3>
              <p className="text-sm text-gray-500 mb-4">Browse coach profiles to find tutorials!</p>
              <button
                onClick={() => setActiveView('browse')}
                className="px-4 py-2 bg-coaches text-white font-semibold rounded-lg"
              >
                Browse Coaches
              </button>
            </div>
          )}
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedCoach && (
        <BookingForm
          coachId={selectedCoach.id}
          coachName={selectedCoach.name}
          coachHourlyRate={selectedCoach.hourlyRate}
          playerId={playerId}
          playerName={playerName}
          playerNtrp={playerNtrp}
          onSubmit={handleBookLesson}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedCoach(null);
          }}
        />
      )}
    </div>
  );
};

export default CoachesTab;
