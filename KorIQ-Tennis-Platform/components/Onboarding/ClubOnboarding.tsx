import React, { useState, useEffect } from 'react';
import { Club, Coach } from '../../types';
import { storageService } from '../../services/storageService';

interface ClubOnboardingProps {
    entityId: string;
    onComplete: () => void;
    onSkip: () => void;
}

type Step = 'welcome' | 'cover' | 'description' | 'amenities' | 'addCoach' | 'complete';

const STEPS: Step[] = ['welcome', 'cover', 'description', 'amenities', 'addCoach', 'complete'];

const AMENITIES = [
    { id: 'indoor', label: 'Indoor Courts', icon: '🏠' },
    { id: 'outdoor', label: 'Outdoor Courts', icon: '☀️' },
    { id: 'lights', label: 'Lighted Courts', icon: '💡' },
    { id: 'clay', label: 'Clay Courts', icon: '🟤' },
    { id: 'hard', label: 'Hard Courts', icon: '⬜' },
    { id: 'grass', label: 'Grass Courts', icon: '🟢' },
    { id: 'proshop', label: 'Pro Shop', icon: '🛍️' },
    { id: 'locker', label: 'Locker Rooms', icon: '🚿' },
    { id: 'parking', label: 'Free Parking', icon: '🅿️' },
    { id: 'cafe', label: 'Cafe/Restaurant', icon: '☕' },
    { id: 'fitness', label: 'Fitness Center', icon: '💪' },
    { id: 'ballmachine', label: 'Ball Machines', icon: '🎾' },
];

export const ClubOnboarding: React.FC<ClubOnboardingProps> = ({ 
    entityId, 
    onComplete, 
    onSkip 
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [club, setClub] = useState<Club | null>(null);
    
    // Form states
    const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    
    // Add Coach form
    const [coachName, setCoachName] = useState('');
    const [coachEmail, setCoachEmail] = useState('');

    useEffect(() => {
        const c = storageService.getClubById(entityId);
        if (c) {
            setClub(c);
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
        // Save data as needed
        goNext();
    };

    const handleAddCoach = () => {
        if (coachName && coachEmail) {
            const newCoach: Coach = {
                id: `c_${Date.now()}`,
                name: coachName,
                email: coachEmail,
                clubId: entityId,
                coachType: 'Club',
                status: 'Unclaimed',
                joinedDate: new Date().toISOString()
            };
            storageService.addCoach(newCoach);
            setCoachName('');
            setCoachEmail('');
        }
        goNext();
    };

    const handleComplete = () => {
        storageService.completeOnboarding('CLUB', entityId);
        onComplete();
    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenityId) 
                ? prev.filter(a => a !== amenityId)
                : [...prev, amenityId]
        );
    };

    const renderProgressBar = () => (
        <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Club Setup</span>
                <span className="text-xs text-purple-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );

    const renderWelcome = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🏟️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-8">Let's set up your club listing so players can discover you.</p>
            
            <button 
                onClick={goNext}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Set Up My Club
            </button>
            
            <button 
                onClick={onSkip}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
                Skip for now
            </button>
        </div>
    );

    const renderCover = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Cover Photo</h3>
            <p className="text-gray-600 text-sm mb-6">Show off your facilities with a great cover photo!</p>
            
            <div className="mb-6">
                <div className="w-full h-40 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden">
                    {coverPhotoUrl ? (
                        <img src={coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <span className="text-4xl text-gray-400">🖼️</span>
                            <p className="text-sm text-gray-400 mt-2">Add Cover Photo</p>
                        </div>
                    )}
                </div>
                <input 
                    type="text"
                    placeholder="Paste image URL..."
                    value={coverPhotoUrl}
                    onChange={(e) => setCoverPhotoUrl(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
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
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderDescription = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Description</h3>
            <p className="text-gray-600 text-sm mb-6">Tell players what makes your club special.</p>
            
            <div className="mb-6">
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Our club offers world-class facilities including..."
                    rows={5}
                    maxLength={1000}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">{description.length}/1000</span>
                </div>
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
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderAmenities = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Amenities</h3>
            <p className="text-gray-600 text-sm mb-6">Select the amenities your club offers.</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6 max-h-64 overflow-y-auto">
                {AMENITIES.map(amenity => (
                    <button
                        key={amenity.id}
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                            selectedAmenities.includes(amenity.id)
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-xl mr-2">{amenity.icon}</span>
                        <span className={`text-sm ${selectedAmenities.includes(amenity.id) ? 'text-purple-700 font-medium' : 'text-gray-700'}`}>
                            {amenity.label}
                        </span>
                    </button>
                ))}
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
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderAddCoach = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Your First Coach</h3>
            <p className="text-gray-600 text-sm mb-6">Invite a coach to your club. They'll receive an email to claim their profile.</p>
            
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coach Name</label>
                    <input 
                        type="text"
                        value={coachName}
                        onChange={(e) => setCoachName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coach Email</label>
                    <input 
                        type="email"
                        value={coachEmail}
                        onChange={(e) => setCoachEmail(e.target.value)}
                        placeholder="coach@example.com"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                    <span className="font-bold">Tip:</span> You can add more coaches later from your dashboard.
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
                    onClick={handleAddCoach}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    {coachName && coachEmail ? 'Add & Continue' : 'Skip for Now'}
                </button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Club Setup Complete!</h2>
            <p className="text-gray-600 mb-8">Your club listing is live. Players can now discover your facility.</p>
            
            <button 
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Go to Dashboard
            </button>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome': return renderWelcome();
            case 'cover': return renderCover();
            case 'description': return renderDescription();
            case 'amenities': return renderAmenities();
            case 'addCoach': return renderAddCoach();
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
