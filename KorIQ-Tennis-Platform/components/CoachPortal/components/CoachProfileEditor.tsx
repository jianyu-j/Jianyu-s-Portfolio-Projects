
import React, { useState } from 'react';
import { Coach } from '../../../types';

interface CoachProfileEditorProps {
    coach: Coach;
    onSave?: (updatedCoach: Partial<Coach>) => void;
}

const SPECIALTIES_OPTIONS = [
    'Serve', 'Forehand', 'Backhand', 'Volley', 'Footwork', 
    'Strategy', 'Mental Game', 'Doubles', 'Juniors', 'Beginners', 
    'Advanced', 'Competition Prep', 'Fitness', 'Rehabilitation'
];

const CoachProfileEditor: React.FC<CoachProfileEditorProps> = ({ coach, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: coach.name || '',
        email: coach.email || '',
        phone: coach.phone || '',
        bio: coach.bio || '',
        rate: coach.rate || 60,
        specialties: coach.specialties || [],
    });
    const [saved, setSaved] = useState(false);

    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleSave = () => {
        onSave?.(formData);
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const completeness = [
        formData.name,
        formData.email,
        formData.phone,
        formData.bio,
        formData.specialties.length > 0,
    ].filter(Boolean).length * 20;

    return (
        <div className="space-y-6">
            {/* Profile Completeness */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">
                        Profile Completeness
                    </h3>
                    <span className="text-tennis-600 font-bold">{completeness}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-tennis-500 to-tennis-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${completeness}%` }}
                    ></div>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                    Complete profiles get 3x more student inquiries!
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        <span>👤</span> Profile Information
                    </h3>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="text-tennis-600 text-xs font-bold bg-tennis-50 px-3 py-1.5 rounded-full hover:bg-tennis-100 transition-all border border-tennis-100"
                        >
                            ✏️ Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="text-gray-600 text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="text-white text-xs font-bold bg-tennis-600 px-3 py-1.5 rounded-full hover:bg-tennis-700 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {saved && (
                    <div className="bg-green-50 border-b border-green-100 px-4 py-2 text-green-700 text-sm font-medium flex items-center gap-2">
                        ✅ Profile updated successfully!
                    </div>
                )}

                <div className="p-5 space-y-5">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-tennis-500 to-tennis-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {formData.name.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-xl font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    placeholder="Your name"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-gray-800">{formData.name || 'Add your name'}</h2>
                            )}
                            <p className="text-sm text-tennis-600 font-medium mt-1">
                                {coach.coachType} Coach
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    placeholder="your@email.com"
                                />
                            ) : (
                                <p className="text-gray-800 text-sm">{formData.email || '—'}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    placeholder="(604) 555-0123"
                                />
                            ) : (
                                <p className="text-gray-800 text-sm">{formData.phone || '—'}</p>
                            )}
                        </div>
                    </div>

                    {/* Hourly Rate */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hourly Rate</label>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={formData.rate}
                                    onChange={(e) => setFormData({ ...formData, rate: parseInt(e.target.value) || 0 })}
                                    className="w-24 text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500"
                                    min="0"
                                />
                                <span className="text-gray-500">/hr</span>
                            </div>
                        ) : (
                            <p className="text-gray-800 text-sm font-bold">${formData.rate}/hr</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio</label>
                        {isEditing ? (
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tennis-500 resize-none"
                                placeholder="Tell students about your coaching experience, style, and what makes you unique..."
                            />
                        ) : (
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {formData.bio || <span className="text-gray-400 italic">No bio added yet</span>}
                            </p>
                        )}
                    </div>

                    {/* Specialties */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Specialties</label>
                        {isEditing ? (
                            <div className="flex flex-wrap gap-2">
                                {SPECIALTIES_OPTIONS.map(specialty => (
                                    <button
                                        key={specialty}
                                        onClick={() => handleSpecialtyToggle(specialty)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                            formData.specialties.includes(specialty)
                                                ? 'bg-tennis-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                    >
                                        {formData.specialties.includes(specialty) && '✓ '}{specialty}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {formData.specialties.length > 0 ? (
                                    formData.specialties.map(specialty => (
                                        <span key={specialty} className="px-3 py-1 bg-tennis-50 text-tennis-700 rounded-full text-xs font-medium border border-tennis-100">
                                            {specialty}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm italic">No specialties selected</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachProfileEditor;
