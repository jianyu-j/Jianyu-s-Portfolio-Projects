
import React, { useState, useRef, useEffect } from 'react';
import CourtCard from './CourtCard';
import { 
  Court, 
  CITIES, 
  OUTDOOR_COURTS, 
  INDOOR_COURTS, 
  ALL_COURTS,
  getCourtsByCity,
  searchCourts 
} from '../data/courtsData';

type CourtType = 'ALL' | 'OUTDOOR' | 'INDOOR';

const CourtFinder: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState<CourtType>('ALL');
  const [selectedSurface, setSelectedSurface] = useState('Any Surface');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedCourts, setSavedCourts] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter cities based on search
  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Get courts based on type
  const getBaseCourts = (): Court[] => {
    switch (selectedType) {
      case 'OUTDOOR': return OUTDOOR_COURTS;
      case 'INDOOR': return INDOOR_COURTS;
      default: return ALL_COURTS;
    }
  };

  // Apply all filters
  const getFilteredCourts = (): Court[] => {
    let courts = getBaseCourts();
    
    // Filter by city
    if (searchLocation) {
      courts = getCourtsByCity(searchLocation, courts);
    }
    
    // Filter by surface
    if (selectedSurface !== 'Any Surface') {
      courts = courts.filter(c => c.surface === selectedSurface);
    }

    // Add saved status
    courts = courts.map(c => ({
      ...c,
      isSaved: savedCourts.includes(c.id)
    }));
    
    return courts;
  };

  const displayedCourts = getFilteredCourts();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setSearchLocation(city);
    setShowDropdown(false);
  };

  const handleSaveCourt = (courtId: number) => {
    setSavedCourts(prev => 
      prev.includes(courtId) 
        ? prev.filter(id => id !== courtId)
        : [...prev, courtId]
    );
  };

  const surfaces = ['Any Surface', 'Hard', 'Clay', 'Grass', 'Synthetic'];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-7 h-7 text-courts" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Court Finder
        </h2>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'ALL' as CourtType, label: 'All Courts', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )},
          { id: 'OUTDOOR' as CourtType, label: 'Outdoor / Public', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )},
          { id: 'INDOOR' as CourtType, label: 'Indoor / Club', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )},
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
              selectedType === tab.id
                ? 'bg-tennis-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        {/* Location Search with Autocomplete */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1" ref={dropdownRef}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input 
              type="text" 
              value={searchLocation}
              onChange={(e) => {
                setSearchLocation(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500 transition-all"
              placeholder="Search by city..."
            />
            
            {/* City Dropdown */}
            {showDropdown && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {filteredCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-tennis-50 hover:text-tennis-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setSearchLocation('')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 rounded-lg text-sm transition-all"
          >
            Clear
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <select 
            value={selectedSurface}
            onChange={(e) => setSelectedSurface(e.target.value)}
            className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {surfaces.map(opt => <option key={opt}>{opt}</option>)}
          </select>

          <button 
            onClick={() => setShowOpenOnly(!showOpenOnly)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
              showOpenOnly 
                ? 'bg-tennis-50 border-tennis-300 text-tennis-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showOpenOnly ? 'Open Now (On)' : 'Open Now'}
          </button>

          <button className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
            Has Lights
          </button>

          <button className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
            Free Only
          </button>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">
          {displayedCourts.length} {selectedType === 'ALL' ? 'Courts' : selectedType === 'OUTDOOR' ? 'Outdoor Courts' : 'Indoor Courts'} Found
        </p>
        {savedCourts.length > 0 && (
          <span className="text-xs text-tennis-600 font-medium">
            ♥ {savedCourts.length} saved
          </span>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {displayedCourts.map(court => (
          <CourtCard 
            key={court.id} 
            court={court} 
            onSave={() => handleSaveCourt(court.id)}
          />
        ))}
      </div>

      {displayedCourts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium">No courts found</p>
          <p className="text-xs mt-1">Try adjusting your filters or search a different city</p>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CourtFinder;
