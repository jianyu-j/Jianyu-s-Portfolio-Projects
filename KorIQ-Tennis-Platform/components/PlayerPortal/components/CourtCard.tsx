
import React from 'react';
import { Court } from '../data/courtsData';

// SVG Icons
const LocationIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const LightBulbIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CourtIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const CurrencyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SunIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BuildingIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

interface CourtCardProps {
  court: Court;
  onSave?: () => void;
  compact?: boolean;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onSave, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-gray-800 font-bold text-sm">{court.name}</h4>
            <p className="text-gray-500 text-xs mt-0.5">{court.city} • {court.type}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            court.type === 'Outdoor' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {court.type}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              court.type === 'Outdoor' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {court.type === 'Outdoor' ? 'Outdoor' : 'Indoor'}
            </span>
            {court.isPublic && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                Public
              </span>
            )}
          </div>
          <h3 className="text-gray-800 font-bold text-lg leading-tight group-hover:text-tennis-600 transition-colors">
            {court.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <LocationIcon className="w-4 h-4" /> {court.distance ? `${court.distance} away • ` : ''}{court.city}
          </p>
        </div>
        {onSave && (
          <button 
            onClick={onSave}
            className={`text-xl transition-transform active:scale-90 p-1 rounded-full hover:bg-gray-100 ${
              court.isSaved ? 'text-red-500' : 'text-gray-300 hover:text-gray-500'
            }`}
            title={court.isSaved ? 'Remove from saved' : 'Save court'}
          >
            {court.isSaved ? '♥' : '♡'}
          </button>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <CourtIcon className="w-4 h-4" />
          <span>{court.courtCount} courts • {court.surface}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <LightBulbIcon className="w-4 h-4" />
          <span className={court.hasLights ? 'text-green-600' : 'text-gray-400'}>
            {court.hasLights ? 'Lights available' : 'No lights'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CurrencyIcon className="w-4 h-4" />
          <span className={court.price === 'Free' ? 'text-green-600 font-medium' : ''}>{court.price}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <ClockIcon className="w-4 h-4" />
          <span>{court.hours}</span>
        </div>
      </div>

      {/* Amenities */}
      {court.amenities && court.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {court.amenities.slice(0, 4).map(amenity => (
            <span key={amenity} className="text-[10px] font-medium px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-100">
              {amenity}
            </span>
          ))}
          {court.amenities.length > 4 && (
            <span className="text-[10px] font-medium px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">
              +{court.amenities.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-5">
        <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200 flex items-center gap-0.5">
          <StarIcon className="w-3.5 h-3.5" /> {court.rating}
        </div>
        <span className="text-gray-400 text-xs">({court.reviewCount} reviews)</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold transition-all border border-gray-200">
          Directions
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold transition-all border border-gray-200">
          {court.phone ? 'Call' : 'Info'}
        </button>
        <button className="flex-1 bg-tennis-600 hover:bg-tennis-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm">
          {court.isPublic ? 'Check In' : 'Book'}
        </button>
      </div>
    </div>
  );
};

export default CourtCard;
