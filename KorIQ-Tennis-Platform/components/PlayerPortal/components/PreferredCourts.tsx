
import React, { useState } from 'react';
import { Court, ALL_COURTS, CITIES } from '../data/courtsData';

interface PreferredCourt {
  id: number;
  name: string;
  city: string;
  type: 'Indoor' | 'Outdoor';
  isPrimary: boolean;
}

const mockPreferredCourts: PreferredCourt[] = [
  { id: 1, name: 'Stanley Park Tennis Courts', city: 'Vancouver, BC', type: 'Outdoor', isPrimary: true },
  { id: 102, name: 'Jericho Tennis Club', city: 'Vancouver, BC', type: 'Indoor', isPrimary: false },
];

const PreferredCourts: React.FC = () => {
  const [courts, setCourts] = useState<PreferredCourt[]>(mockPreferredCourts);
  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Indoor' | 'Outdoor'>('All');

  // Filter available courts (exclude already added ones)
  const getAvailableCourts = (): Court[] => {
    const addedIds = courts.map(c => c.id);
    let available = ALL_COURTS.filter(c => !addedIds.includes(c.id));
    
    if (searchQuery) {
      available = available.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCity !== 'All') {
      available = available.filter(c => c.city === selectedCity);
    }
    
    if (selectedType !== 'All') {
      available = available.filter(c => c.type === selectedType);
    }
    
    return available;
  };

  const handleAddCourt = (court: Court) => {
    const newCourt: PreferredCourt = {
      id: court.id,
      name: court.name,
      city: court.city,
      type: court.type,
      isPrimary: courts.length === 0,
    };
    setCourts([...courts, newCourt]);
    setIsAddingCourt(false);
    setSearchQuery('');
  };

  const handleRemove = (id: number) => {
    setCourts(prev => prev.filter(c => c.id !== id));
  };

  const handleSetPrimary = (id: number) => {
    setCourts(prev => prev.map(c => ({ ...c, isPrimary: c.id === id })));
  };

  const availableCourts = getAvailableCourts();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Preferred Courts
          </h3>
          <button 
            onClick={() => setIsAddingCourt(true)}
            className="text-tennis-600 text-xs font-bold bg-tennis-50 px-3 py-1.5 rounded-full hover:bg-tennis-100 transition-all border border-tennis-100"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {courts.map((court) => (
            <div 
              key={court.id} 
              className={`
                rounded-xl p-4 border transition-all relative group
                ${court.isPrimary 
                  ? 'bg-tennis-50/50 border-tennis-200' 
                  : 'bg-gray-50 border-gray-100 hover:border-gray-200'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-tennis-500" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M12 2c-2.5 2.5-2.5 6.5 0 10s2.5 7.5 0 10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M2 12c2.5-2.5 6.5-2.5 10 0s7.5 2.5 10 0" /></svg>
                    <h4 className="text-gray-800 font-bold text-sm">{court.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      court.type === 'Outdoor' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {court.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs ml-7">{court.city}</p>
                  {court.isPrimary && (
                    <span className="inline-block ml-7 mt-2 text-tennis-700 text-[10px] font-bold uppercase tracking-wider bg-tennis-100 px-2 py-0.5 rounded flex items-center gap-0.5 w-fit">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Your primary court
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!court.isPrimary && (
                    <button 
                      onClick={() => handleSetPrimary(court.id)}
                      className="text-gray-400 hover:text-yellow-500 p-1"
                      title="Set as primary"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  )}
                  <button 
                    onClick={() => handleRemove(court.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {courts.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <svg className="w-8 h-8 mx-auto mb-2 text-tennis-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M12 2c-2.5 2.5-2.5 6.5 0 10s2.5 7.5 0 10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M2 12c2.5-2.5 6.5-2.5 10 0s7.5 2.5 10 0" /></svg>
              <p className="text-sm">No preferred courts added yet</p>
              <button 
                onClick={() => setIsAddingCourt(true)}
                className="mt-2 text-tennis-600 text-xs font-bold hover:underline"
              >
                Add your first court →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Court Modal */}
      {isAddingCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-gray-800">Add Preferred Court</h3>
              <button 
                onClick={() => { setIsAddingCourt(false); setSearchQuery(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100 space-y-3 flex-shrink-0">
              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                placeholder="Search courts..."
              />
              
              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                >
                  <option value="All">All Cities</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
                  className="bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                >
                  <option value="All">All Types</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Indoor">Indoor</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs text-gray-500 font-bold uppercase mb-3">
                {availableCourts.length} courts available
              </p>
              <div className="space-y-2">
                {availableCourts.map(court => (
                  <button
                    key={court.id}
                    onClick={() => handleAddCourt(court)}
                    className="w-full text-left bg-gray-50 hover:bg-tennis-50 border border-gray-100 hover:border-tennis-200 rounded-lg p-3 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-tennis-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M12 2c-2.5 2.5-2.5 6.5 0 10s2.5 7.5 0 10" /><path fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" d="M2 12c2.5-2.5 6.5-2.5 10 0s7.5 2.5 10 0" /></svg>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 text-sm group-hover:text-tennis-700">{court.name}</h4>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            court.type === 'Outdoor' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {court.type}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">{court.city} • {court.courtCount} courts</p>
                      </div>
                      <span className="text-tennis-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Add
                      </span>
                    </div>
                  </button>
                ))}
                
                {availableCourts.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    <p className="text-sm">No courts found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreferredCourts;
