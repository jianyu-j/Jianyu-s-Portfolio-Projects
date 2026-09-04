import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface ClubProfileProps {
  onLoginRequired: (action: string) => void;
}

// Mock club data
const CLUB_DATA = {
  id: '1',
  name: 'Stanley Park Tennis Club',
  address: '610 Pipeline Rd, Vancouver, BC V6G 3E2',
  type: 'public',
  courts: 17,
  surfaces: ['Hard Court'],
  amenities: ['Pro Shop', 'Professional Lessons', 'Tournament Hosting', 'Lighting', 'Restrooms', 'Water Fountains'],
  description: 'Vancouver\'s premier public tennis facility located in the heart of Stanley Park. With 17 hard courts, professional instruction, and year-round programming, we welcome players of all ages and skill levels.',
  hours: {
    weekdays: '6:00 AM - 10:00 PM',
    weekends: '7:00 AM - 9:00 PM',
  },
  contact: {
    phone: '(604) 605-8224',
    email: 'info@stanleyparktennis.ca',
    website: 'https://stanleyparktennis.ca',
  },
  rates: {
    casual: '$12/hour',
    members: '$8/hour',
    lessons: 'From $65/hour',
  },
  coaches: [
    { id: '1', name: 'Sarah Mitchell', specialty: 'Beginners & Juniors' },
    { id: '2', name: 'Marcus Chen', specialty: 'Competition' },
  ],
  programs: [
    'Adult Beginner Clinics',
    'Junior Development Program',
    'Cardio Tennis',
    'Ladies Doubles League',
    'Senior Social Play',
    'Tournament Prep',
  ],
};

const ClubProfile: React.FC<ClubProfileProps> = ({ onLoginRequired }) => {
  const { id } = useParams();
  const club = CLUB_DATA;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link
          to="/community/clubs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clubs
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl h-64 md:h-80 relative overflow-hidden border border-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-32 h-32 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200 capitalize`}>
            {club.type}
          </div>
        </div>
      </div>

      {/* Club Info */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 -mt-20 relative z-10 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{club.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {club.address}
            </span>
            <span className="text-tennis-600 font-medium">{club.courts} courts</span>
          </div>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {club.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            {club.surfaces.map((surface) => (
              <span key={surface} className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-medium">
                {surface}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={club.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-tennis-600 hover:bg-tennis-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Visit Website
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amenities */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {club.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Programs & Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {club.programs.map((program) => (
                  <div key={program} className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700">
                    {program}
                  </div>
                ))}
              </div>
            </div>

            {/* Coaches */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Coaches at this Club</h2>
              <div className="space-y-3">
                {club.coaches.map((coach) => (
                  <Link
                    key={coach.id}
                    to={`/community/coaches/${coach.id}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-tennis-500 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tennis-500 to-tennis-700 flex items-center justify-center text-lg font-bold text-white">
                      {coach.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{coach.name}</p>
                      <p className="text-gray-400 text-sm">{coach.specialty}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hours */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Hours</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Monday - Friday</p>
                  <p className="text-gray-900">{club.hours.weekdays}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Saturday - Sunday</p>
                  <p className="text-gray-900">{club.hours.weekends}</p>
                </div>
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Rates</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Casual Play</span>
                  <span className="text-gray-900 font-medium">{club.rates.casual}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="text-gray-900 font-medium">{club.rates.members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lessons</span>
                  <span className="text-gray-900 font-medium">{club.rates.lessons}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                <a href={`tel:${club.contact.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-tennis-600 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {club.contact.phone}
                </a>
                <a href={`mailto:${club.contact.email}`} className="flex items-center gap-3 text-gray-600 hover:text-tennis-600 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {club.contact.email}
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-tennis-50 border border-tennis-200 rounded-2xl p-6 text-center">
              <p className="text-gray-900 font-medium mb-2">Interested in joining?</p>
              <p className="text-gray-500 text-sm mb-4">Create a free account to get updates and connect with coaches.</p>
              <button
                onClick={() => onLoginRequired('join this club')}
                className="w-full py-3 bg-tennis-600 hover:bg-tennis-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;
