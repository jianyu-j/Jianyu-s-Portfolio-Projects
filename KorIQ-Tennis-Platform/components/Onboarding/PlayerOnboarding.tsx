import React, { useState, useEffect } from 'react';
import { NtrpLevel, Player } from '../../types';
import { storageService } from '../../services/storageService';

interface PlayerOnboardingProps {
    entityId: string;
    onComplete: () => void;
    onSkip: () => void;
}

type Step = 'welcome' | 'photo' | 'ntrp' | 'location' | 'availability' | 'complete';

const STEPS: Step[] = ['welcome', 'photo', 'ntrp', 'location', 'availability', 'complete'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

// Cities for datalist
const CITIES = [
    "Vancouver, BC", "Burnaby, BC", "Richmond, BC", "Surrey, BC",
    "North Vancouver, BC", "West Vancouver, BC", "Coquitlam, BC",
    "New Westminster, BC", "Victoria, BC", "Toronto, ON",
    "Calgary, AB", "Montreal, QC"
];

export const PlayerOnboarding: React.FC<PlayerOnboardingProps> = ({ 
    entityId, 
    onComplete, 
    onSkip 
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [player, setPlayer] = useState<Player | null>(null);
    
    // Form states
    const [photoUrl, setPhotoUrl] = useState('');
    const [ntrp, setNtrp] = useState<NtrpLevel>(NtrpLevel.L30);
    const [city, setCity] = useState('');
    const [availability, setAvailability] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const p = storageService.getPlayerById(entityId);
        if (p) {
            setPlayer(p);
            setNtrp(p.currentNtrp);
            setCity(p.city || '');
            setAvailability(p.availability || {});
        }
    }, [entityId]);

    const currentStepIndex = STEPS.indexOf(currentStep);
    const progress = ((currentStepIndex) / (STEPS.length - 1)) * 100;

    const goNext = () => {
        const idx = STEPS.indexOf(currentStep);
        if (idx < STEPS.length - 1) {
            setCurrentStep(STEPS[idx + 1]);
        }
    };

    const goBack = () => {
        const idx = STEPS.indexOf(currentStep);
        if (idx > 0) {
            setCurrentStep(STEPS[idx - 1]);
        }
    };

    const handleSaveAndContinue = () => {
        // Save current step data
        const updates: Partial<Player> = {};
        
        if (currentStep === 'ntrp') {
            updates.currentNtrp = ntrp;
        } else if (currentStep === 'location') {
            updates.city = city;
        } else if (currentStep === 'availability') {
            updates.availability = availability;
        }
        
        if (Object.keys(updates).length > 0) {
            storageService.updatePlayer(entityId, updates);
        }
        
        goNext();
    };

    const handleComplete = () => {
        storageService.completeOnboarding('PLAYER', entityId);
        onComplete();
    };

    const toggleAvailability = (day: string, slot: string) => {
        setAvailability(prev => {
            const daySlots = prev[day] || [];
            const hasSlot = daySlots.includes(slot);
            
            return {
                ...prev,
                [day]: hasSlot 
                    ? daySlots.filter(s => s !== slot)
                    : [...daySlots, slot]
            };
        });
    };

    const renderProgressBar = () => (
        <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Profile Setup</span>
                <span className="text-xs text-tennis-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-tennis-500 to-tennis-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );

    const renderWelcome = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-tennis-400 to-tennis-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🎾</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to KorIQ!</h2>
            <p className="text-gray-600 mb-8">Let's set up your profile so you can start finding hitting partners and improving your game.</p>
            
            <button 
                onClick={goNext}
                className="w-full py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Let's Get Started
            </button>
            
            <button 
                onClick={onSkip}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
                Skip for now
            </button>
        </div>
    );

    const renderPhoto = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Your Photo</h3>
            <p className="text-gray-600 text-sm mb-6">Help other players recognize you on the court!</p>
            
            <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <span className="text-4xl text-gray-400">📷</span>
                            <p className="text-xs text-gray-400 mt-1">Add Photo</p>
                        </div>
                    )}
                </div>
                <input 
                    type="text"
                    placeholder="Paste image URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-2">For demo purposes, paste an image URL</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={handleSaveAndContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderNtrp = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Your NTRP Level</h3>
            <p className="text-gray-600 text-sm mb-6">This helps us match you with players at your skill level.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.values(NtrpLevel).map(level => (
                    <button
                        key={level}
                        onClick={() => setNtrp(level)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                            ntrp === level 
                                ? 'border-tennis-500 bg-tennis-50 text-tennis-700' 
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                    >
                        <span className="font-bold">{level}</span>
                    </button>
                ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                    <span className="font-bold">Tip:</span> Be honest about your level! It ensures better matches and more enjoyable games.
                </p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={handleSaveAndContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderLocation = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Location</h3>
            <p className="text-gray-600 text-sm mb-6">We'll show you players and courts nearby.</p>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">City/Region</label>
                <input 
                    type="text"
                    list="cities"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Vancouver, BC"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500 outline-none"
                />
                <datalist id="cities">
                    {CITIES.map(c => <option key={c} value={c} />)}
                </datalist>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={handleSaveAndContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderAvailability = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Availability</h3>
            <p className="text-gray-600 text-sm mb-6">When are you usually free to play?</p>
            
            <div className="overflow-x-auto mb-6">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-2 text-xs text-gray-500"></th>
                            {DAYS.map(day => (
                                <th key={day} className="p-2 text-xs text-gray-500 font-medium">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TIME_SLOTS.map(slot => (
                            <tr key={slot}>
                                <td className="p-2 text-xs text-gray-600 font-medium">{slot}</td>
                                {DAYS.map(day => {
                                    const isSelected = availability[day]?.includes(slot);
                                    return (
                                        <td key={`${day}-${slot}`} className="p-1">
                                            <button
                                                onClick={() => toggleAvailability(day, slot)}
                                                className={`w-full h-8 rounded transition-all ${
                                                    isSelected 
                                                        ? 'bg-tennis-500 text-white' 
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                {isSelected && '✓'}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={handleSaveAndContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-gray-600 mb-8">Your profile is ready. Start finding hitting partners in your area!</p>
            
            <button 
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-tennis-500 to-tennis-600 hover:from-tennis-600 hover:to-tennis-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Find Your First Hitting Partner
            </button>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome': return renderWelcome();
            case 'photo': return renderPhoto();
            case 'ntrp': return renderNtrp();
            case 'location': return renderLocation();
            case 'availability': return renderAvailability();
            case 'complete': return renderComplete();
            default: return null;
        }
    };

    return (
        <div>
            {currentStep !== 'welcome' && currentStep !== 'complete' && renderProgressBar()}
            {renderStep()}
        </div>
    );
};
