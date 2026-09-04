
import React, { useState } from 'react';
import { Coach } from '../../../types';

interface CoachLocationSettingsProps {
    coach: Coach;
    onSave?: (locations: ServiceLocation[]) => void;
}

interface ServiceLocation {
    id: number;
    name: string;
    address: string;
    city: string;
    type: 'Home Court' | 'Club' | 'Public' | 'Travel';
    isPrimary: boolean;
    travelRadius?: number;
}

const MOCK_LOCATIONS: ServiceLocation[] = [
    { id: 1, name: 'Stanley Park Tennis Courts', address: '8901 Stanley Park Dr', city: 'Vancouver, BC', type: 'Public', isPrimary: true },
    { id: 2, name: 'Jericho Tennis Club', address: '3837 Point Grey Rd', city: 'Vancouver, BC', type: 'Club', isPrimary: false },
];

const CITIES = [
    "Vancouver, BC", "Burnaby, BC", "Richmond, BC", "Surrey, BC",
    "North Vancouver, BC", "West Vancouver, BC", "Coquitlam, BC",
    "New Westminster, BC"
];

const CoachLocationSettings: React.FC<CoachLocationSettingsProps> = ({ coach, onSave }) => {
    const [locations, setLocations] = useState<ServiceLocation[]>(MOCK_LOCATIONS);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [travelRadius, setTravelRadius] = useState(10);
    const [willTravel, setWillTravel] = useState(true);
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        city: 'Vancouver, BC',
        type: 'Public' as ServiceLocation['type'],
    });

    const handleAddLocation = () => {
        if (!newLocation.name.trim()) return;
        
        const location: ServiceLocation = {
            id: Date.now(),
            ...newLocation,
            isPrimary: locations.length === 0,
        };
        
        setLocations([...locations, location]);
        setNewLocation({ name: '', address: '', city: 'Vancouver, BC', type: 'Public' });
        setIsAddingLocation(false);
    };

    const handleRemoveLocation = (id: number) => {
        setLocations(locations.filter(l => l.id !== id));
    };

    const handleSetPrimary = (id: number) => {
        setLocations(locations.map(l => ({ ...l, isPrimary: l.id === id })));
    };

    return (
        <div className="space-y-6">
            {/* Service Area Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        <span>📍</span> Service Area
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Define where you offer coaching services</p>
                </div>

                <div className="p-5 space-y-4">
                    {/* Travel Settings */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Will travel to students</h4>
                                <p className="text-xs text-gray-500">Offer lessons at student's preferred location</p>
                            </div>
                            <button
                                onClick={() => setWillTravel(!willTravel)}
                                className={`w-12 h-6 rounded-full transition-colors ${willTravel ? 'bg-tennis-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${willTravel ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>

                        {willTravel && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                    Travel Radius: {travelRadius} km
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={travelRadius}
                                    onChange={(e) => setTravelRadius(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tennis-600"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>1 km</span>
                                    <span>50 km</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Base City */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Base City</label>
                        <select className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500">
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Coaching Locations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                            <span>🎾</span> Coaching Locations
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Courts where you regularly teach</p>
                    </div>
                    <button 
                        onClick={() => setIsAddingLocation(true)}
                        className="text-tennis-600 text-xs font-bold bg-tennis-50 px-3 py-1.5 rounded-full hover:bg-tennis-100 transition-all border border-tennis-100"
                    >
                        + Add Location
                    </button>
                </div>

                <div className="p-5 space-y-3">
                    {locations.map(location => (
                        <div 
                            key={location.id}
                            className={`rounded-xl p-4 border transition-all relative group ${
                                location.isPrimary 
                                    ? 'bg-tennis-50/50 border-tennis-200' 
                                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🎾</span>
                                        <h4 className="text-gray-800 font-bold text-sm">{location.name}</h4>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                            location.type === 'Public' ? 'bg-blue-100 text-blue-700' :
                                            location.type === 'Club' ? 'bg-purple-100 text-purple-700' :
                                            location.type === 'Home Court' ? 'bg-green-100 text-green-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {location.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-xs ml-7">{location.address}</p>
                                    <p className="text-gray-400 text-xs ml-7">{location.city}</p>
                                    {location.isPrimary && (
                                        <span className="inline-block ml-7 mt-2 text-tennis-700 text-[10px] font-bold uppercase tracking-wider bg-tennis-100 px-2 py-0.5 rounded">
                                            ⭐ Primary Location
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!location.isPrimary && (
                                        <button 
                                            onClick={() => handleSetPrimary(location.id)}
                                            className="text-gray-400 hover:text-tennis-600 p-1 text-xs"
                                            title="Set as primary"
                                        >
                                            ⭐
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleRemoveLocation(location.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {locations.length === 0 && (
                        <div className="text-center py-6 text-gray-400">
                            <p className="text-2xl mb-2">📍</p>
                            <p className="text-sm">No coaching locations added</p>
                            <button 
                                onClick={() => setIsAddingLocation(true)}
                                className="mt-2 text-tennis-600 text-xs font-bold hover:underline"
                            >
                                Add your first location →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Location Modal */}
            {isAddingLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Add Coaching Location</h3>
                            <button 
                                onClick={() => setIsAddingLocation(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location Name *</label>
                                <input
                                    type="text"
                                    value={newLocation.name}
                                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                    className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    placeholder="e.g., Stanley Park Tennis Courts"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                                <input
                                    type="text"
                                    value={newLocation.address}
                                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                    className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                    <select
                                        value={newLocation.city}
                                        onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                                        className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    >
                                        {CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select
                                        value={newLocation.type}
                                        onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as ServiceLocation['type'] })}
                                        className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    >
                                        <option value="Public">Public</option>
                                        <option value="Club">Club</option>
                                        <option value="Home Court">Home Court</option>
                                        <option value="Travel">Travel</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button 
                                    onClick={() => setIsAddingLocation(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAddLocation}
                                    disabled={!newLocation.name.trim()}
                                    className="flex-1 bg-tennis-600 hover:bg-tennis-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:bg-gray-300"
                                >
                                    Add Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoachLocationSettings;
