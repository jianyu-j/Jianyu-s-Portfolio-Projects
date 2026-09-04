import React, { useState, useEffect } from 'react';
import { Student, Coach, PhysicalAttributes } from '../../types';
import { storageService } from '../../services/storageService';

interface StudentOnboardingProps {
    entityId: string;
    onComplete: () => void;
    onSkip: () => void;
}

type Step = 'welcome' | 'coachInfo' | 'physical' | 'evaluations' | 'complete';

const STEPS: Step[] = ['welcome', 'coachInfo', 'physical', 'evaluations', 'complete'];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({ 
    entityId, 
    onComplete, 
    onSkip 
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [student, setStudent] = useState<Student | null>(null);
    const [coach, setCoach] = useState<Coach | null>(null);
    
    // Physical attributes form
    const [sleepHours, setSleepHours] = useState(8);
    const [hydrationCups, setHydrationCups] = useState(8);
    const [nutritionRating, setNutritionRating] = useState(7);
    const [cardioMinutes, setCardioMinutes] = useState(30);
    const [strengthMinutes, setStrengthMinutes] = useState(30);

    useEffect(() => {
        const s = storageService.getStudentById(entityId);
        if (s) {
            setStudent(s);
            if (s.primaryCoachId) {
                const c = storageService.getCoachById(s.primaryCoachId);
                if (c) setCoach(c);
            }
            if (s.physicalAttributes) {
                setSleepHours(s.physicalAttributes.sleepHours);
                setHydrationCups(s.physicalAttributes.hydrationCups);
                setNutritionRating(s.physicalAttributes.nutritionRating);
                setCardioMinutes(s.physicalAttributes.cardioMinutes);
                setStrengthMinutes(s.physicalAttributes.strengthMinutes);
            }
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

    const handleSavePhysical = () => {
        const physical: PhysicalAttributes = {
            sleepHours,
            hydrationCups,
            nutritionRating,
            cardioMinutes,
            strengthMinutes
        };
        storageService.updateStudent(entityId, { physicalAttributes: physical });
        goNext();
    };

    const handleComplete = () => {
        storageService.completeOnboarding('STUDENT', entityId);
        onComplete();
    };

    const renderProgressBar = () => (
        <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Getting Started</span>
                <span className="text-xs text-blue-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );

    const renderWelcome = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">📚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-8">You're all set to track your tennis journey. Let's get you started!</p>
            
            <button 
                onClick={goNext}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Get Started
            </button>
            
            <button 
                onClick={onSkip}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
                Skip for now
            </button>
        </div>
    );

    const renderCoachInfo = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Assigned Coach</h3>
            <p className="text-gray-600 text-sm mb-6">Here's the coach who will be tracking your progress.</p>
            
            {coach ? (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                            {coach.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">{coach.name}</h4>
                            <p className="text-sm text-gray-600">{coach.email}</p>
                            {coach.specialties && coach.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {coach.specialties.slice(0, 3).map((s, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 text-center">
                    <span className="text-4xl mb-2 block">👤</span>
                    <p className="text-gray-500">No coach assigned yet</p>
                    <p className="text-xs text-gray-400 mt-1">Your club will assign a coach to you soon</p>
                </div>
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
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const renderPhysical = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Update Physical Attributes</h3>
            <p className="text-gray-600 text-sm mb-6">Track your wellness to optimize performance.</p>
            
            <div className="space-y-4 mb-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Sleep (hours)</label>
                        <span className="text-sm text-blue-600 font-bold">{sleepHours}h</span>
                    </div>
                    <input 
                        type="range"
                        min={4}
                        max={12}
                        value={sleepHours}
                        onChange={(e) => setSleepHours(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Hydration (cups)</label>
                        <span className="text-sm text-blue-600 font-bold">{hydrationCups} cups</span>
                    </div>
                    <input 
                        type="range"
                        min={0}
                        max={16}
                        value={hydrationCups}
                        onChange={(e) => setHydrationCups(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Nutrition Rating</label>
                        <span className="text-sm text-blue-600 font-bold">{nutritionRating}/10</span>
                    </div>
                    <input 
                        type="range"
                        min={1}
                        max={10}
                        value={nutritionRating}
                        onChange={(e) => setNutritionRating(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Cardio (min/day)</label>
                        <span className="text-sm text-blue-600 font-bold">{cardioMinutes} min</span>
                    </div>
                    <input 
                        type="range"
                        min={0}
                        max={120}
                        step={5}
                        value={cardioMinutes}
                        onChange={(e) => setCardioMinutes(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Strength Training (min/day)</label>
                        <span className="text-sm text-blue-600 font-bold">{strengthMinutes} min</span>
                    </div>
                    <input 
                        type="range"
                        min={0}
                        max={120}
                        step={5}
                        value={strengthMinutes}
                        onChange={(e) => setStrengthMinutes(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
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
                    onClick={handleSavePhysical}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );

    const renderEvaluations = () => (
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">How Evaluations Work</h3>
            <p className="text-gray-600 text-sm mb-6">Your coach will evaluate your progress after each session.</p>
            
            <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Stroke Analysis</h4>
                            <p className="text-sm text-gray-600">Your forehand, backhand, serve, and volley will be scored on grip, setup, impact, swing, and recovery.</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Performance Metrics</h4>
                            <p className="text-sm text-gray-600">Track your movement, consistency, intensity, and tactical awareness over time.</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📈</span>
                        <div>
                            <h4 className="font-bold text-gray-900">Progress Tracking</h4>
                            <p className="text-sm text-gray-600">See your improvement over sessions with detailed charts and historical data.</p>
                        </div>
                    </div>
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
                    onClick={goNext}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                    Got It!
                </button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Ready!</h2>
            <p className="text-gray-600 mb-8">Your profile is set up. Check back after your next session to see your evaluation!</p>
            
            <button 
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Go to Dashboard
            </button>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome': return renderWelcome();
            case 'coachInfo': return renderCoachInfo();
            case 'physical': return renderPhysical();
            case 'evaluations': return renderEvaluations();
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
