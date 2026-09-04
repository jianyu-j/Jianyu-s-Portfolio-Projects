import React, { useState, useEffect } from 'react';
import { Coach } from '../../types';
import { storageService } from '../../services/storageService';

interface CoachOnboardingProps {
    entityId: string;
    onComplete: () => void;
    onSkip: () => void;
}

type Step = 'welcome' | 'photo' | 'bio' | 'credentials' | 'specialties' | 'gold' | 'complete';

const STEPS: Step[] = ['welcome', 'photo', 'bio', 'credentials', 'specialties', 'gold', 'complete'];

const SPECIALTIES: string[] = [
    'Forehand', 'Backhand', 'Serve', 'Volley', 'Footwork', 'Strategy',
    'Doubles', 'Singles', 'Juniors', 'Adults', 'Beginners', 'Advanced',
    'Mental Game', 'Fitness', 'Match Play', 'Tournament Prep'
];

const CERTIFICATIONS = [
    'USPTA Certified', 'PTR Certified', 'Tennis Canada Certified',
    'ITF Coaching License', 'USTA High Performance', 'Other'
];

export const CoachOnboarding: React.FC<CoachOnboardingProps> = ({ 
    entityId, 
    onComplete, 
    onSkip 
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [coach, setCoach] = useState<Coach | null>(null);
    
    // Form states
    const [photoUrl, setPhotoUrl] = useState('');
    const [bio, setBio] = useState('');
    const [certifications, setCertifications] = useState<string[]>([]);
    const [customCert, setCustomCert] = useState('');
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [rate, setRate] = useState<number>(60);

    useEffect(() => {
        const c = storageService.getCoachById(entityId);
        if (c) {
            setCoach(c);
            setBio(c.bio || '');
            setSpecialties(c.specialties || []);
            setRate(c.rate || 60);
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
        const updates: Partial<Coach> = {};
        
        if (currentStep === 'bio') {
            updates.bio = bio;
        } else if (currentStep === 'specialties') {
            updates.specialties = specialties;
            updates.rate = rate;
        }
        
        if (Object.keys(updates).length > 0) {
            storageService.updateCoach(entityId, updates);
        }
        
        goNext();
    };

    const handleComplete = () => {
        storageService.completeOnboarding('COACH', entityId);
        onComplete();
    };

    const toggleSpecialty = (specialty: string) => {
        setSpecialties(prev => 
            prev.includes(specialty) 
                ? prev.filter(s => s !== specialty)
                : [...prev, specialty]
        );
    };

    const toggleCertification = (cert: string) => {
        setCertifications(prev => 
            prev.includes(cert) 
                ? prev.filter(c => c !== cert)
                : [...prev, cert]
        );
    };

    const renderProgressBar = () => (
        <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Profile Setup</span>
                <span className="text-xs text-orange-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );

    const renderWelcome = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">👨‍🏫</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Coach!</h2>
            <p className="text-gray-600 mb-8">Set up your profile to get discovered by players looking for coaching.</p>
            
            <button 
                onClick={goNext}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Set Up My Profile
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
            <p className="text-gray-600 text-sm mb-6">A professional photo helps build trust with potential students.</p>
            
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderBio = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Your Bio</h3>
            <p className="text-gray-600 text-sm mb-6">Tell students about your coaching experience and philosophy.</p>
            
            <div className="mb-6">
                <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="I've been coaching tennis for 10 years and specialize in..."
                    rows={5}
                    maxLength={500}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-400">{bio.length}/500</span>
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
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderCredentials = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Your Credentials</h3>
            <p className="text-gray-600 text-sm mb-6">Select your certifications to build credibility.</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
                {CERTIFICATIONS.map(cert => (
                    <button
                        key={cert}
                        onClick={() => toggleCertification(cert)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            certifications.includes(cert)
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                    >
                        {certifications.includes(cert) && '✓ '}{cert}
                    </button>
                ))}
            </div>
            
            {certifications.includes('Other') && (
                <input 
                    type="text"
                    value={customCert}
                    onChange={(e) => setCustomCert(e.target.value)}
                    placeholder="Enter your certification..."
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
            )}
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={goNext}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderSpecialties = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Specialties</h3>
            <p className="text-gray-600 text-sm mb-6">What do you focus on in your coaching? Select all that apply.</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
                {SPECIALTIES.map(specialty => (
                    <button
                        key={specialty}
                        onClick={() => toggleSpecialty(specialty)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                            specialties.includes(specialty)
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {specialty}
                    </button>
                ))}
            </div>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                <input 
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
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
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderGold = () => (
        <div className="p-6">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-6 mb-6 border border-yellow-300">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">👑</span>
                    <div>
                        <h3 className="text-xl font-bold text-yellow-800">Coach Gold</h3>
                        <p className="text-sm text-yellow-700">$3/month</p>
                    </div>
                </div>
                
                <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2 text-sm text-yellow-800">
                        <span className="text-green-600 font-bold">✓</span>
                        <span><strong>Unlimited</strong> private tutorial uploads (Free: 3/month)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-yellow-800">
                        <span className="text-green-600 font-bold">✓</span>
                        <span><strong>Unlimited</strong> new message conversations (Free: 5/month)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-yellow-800">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Priority placement in search results</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-yellow-800">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Gold badge on your profile</span>
                    </li>
                </ul>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={goBack}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button 
                    onClick={goNext}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Complete!</h2>
            <p className="text-gray-600 mb-8">You're ready to start connecting with students and posting tutorials.</p>
            
            <button 
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Post Your First Tutorial
            </button>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome': return renderWelcome();
            case 'photo': return renderPhoto();
            case 'bio': return renderBio();
            case 'credentials': return renderCredentials();
            case 'specialties': return renderSpecialties();
            case 'gold': return renderGold();
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
