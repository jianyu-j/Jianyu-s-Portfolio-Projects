import React, { useState } from 'react';
import { Coach, Student, PaymentProcessor } from '../../../types';
import { storageService } from '../../../services/storageService';
import { Button } from '../../ui/Button';

// SVG Icons
const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const CreditCardIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const ClipboardListIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
);

interface ClubGettingStartedWizardProps {
    clubId: string;
    clubName: string;
    coaches: Coach[];
    students: Student[];
    onComplete: () => void;
    onConnectPayment: (processor: PaymentProcessor) => void;
    onAddCoach: () => void;
    onImportCSV: () => void;
    onNavigateToTab: (tab: string) => void;
}

type Step = 'welcome' | 'overview' | 'payment' | 'coaches' | 'students' | 'tour' | 'complete';

const STEPS: Step[] = ['welcome', 'overview', 'payment', 'coaches', 'students', 'tour', 'complete'];

const ClubGettingStartedWizard: React.FC<ClubGettingStartedWizardProps> = ({
    clubId,
    clubName,
    coaches,
    students,
    onComplete,
    onConnectPayment,
    onAddCoach,
    onImportCSV,
    onNavigateToTab
}) => {
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [skippedPayment, setSkippedPayment] = useState(false);

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

    const handleComplete = () => {
        // Mark onboarding as complete
        localStorage.setItem(`koriq_onboarding_${clubId}`, 'complete');
        onComplete();
    };

    const tourFeatures = [
        {
            icon: <ChartBarIcon className="w-6 h-6" />,
            title: 'Dashboard',
            description: 'Your command center. See insights, alerts, and key metrics at a glance.',
            tab: 'DASHBOARD'
        },
        {
            icon: <TrendingUpIcon className="w-6 h-6" />,
            title: 'Reports & Analytics',
            description: 'Deep dive into performance trends, retention, and operational metrics.',
            tab: 'REPORTS'
        },
        {
            icon: <CurrencyIcon className="w-6 h-6" />,
            title: 'Revenue',
            description: 'Track income, expenses, and connect payment processors for live data.',
            tab: 'REVENUE'
        },
        {
            icon: <AcademicCapIcon className="w-6 h-6" />,
            title: 'Coaches',
            description: 'Manage your coaching staff, track performance, and view earnings.',
            tab: 'COACHES'
        },
        {
            icon: <UsersIcon className="w-6 h-6" />,
            title: 'Students',
            description: 'Monitor student progress, identify at-risk members, and track engagement.',
            tab: 'STUDENTS'
        },
        {
            icon: <SparklesIcon className="w-6 h-6" />,
            title: 'AI Assistant',
            description: 'Ask questions in plain English. "How much did Coach Mike earn this month?"',
            tab: null
        }
    ];

    const renderProgressBar = () => (
        <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Getting Started</span>
                <span className="text-xs text-portal-club font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-portal-club to-teal-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between mt-3">
                {STEPS.filter(s => s !== 'welcome' && s !== 'complete').map((step, i) => (
                    <div key={step} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            STEPS.indexOf(currentStep) > STEPS.indexOf(step)
                                ? 'bg-portal-club text-white'
                                : STEPS.indexOf(currentStep) === STEPS.indexOf(step)
                                ? 'bg-portal-club/20 text-portal-club border-2 border-portal-club'
                                : 'bg-gray-200 text-gray-400'
                        }`}>
                            {STEPS.indexOf(currentStep) > STEPS.indexOf(step) ? '✓' : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1 capitalize ${
                            STEPS.indexOf(currentStep) >= STEPS.indexOf(step) ? 'text-portal-club font-medium' : 'text-gray-400'
                        }`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderWelcome = () => (
        <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-portal-club to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
                <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" stroke="currentColor" fill="none" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(90 12 12)" />
                    <ellipse cx="12" cy="12" rx="3" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to KorIQ!</h2>
            <p className="text-gray-600 text-lg mb-2">{clubName}</p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Let's get you set up in just a few minutes. We'll help you connect your data and show you around.
            </p>
            
            {/* Quick Stats Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-4">What you'll unlock:</p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-portal-club">Live</div>
                        <div className="text-xs text-gray-500">Analytics</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-portal-club">AI</div>
                        <div className="text-xs text-gray-500">Assistant</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-portal-club">Auto</div>
                        <div className="text-xs text-gray-500">Insights</div>
                    </div>
                </div>
            </div>
            
            <Button 
                onClick={goNext}
                fullWidth
                className="max-w-md mx-auto text-lg py-4"
            >
                Let's Get Started →
            </Button>
            
            <button 
                onClick={handleComplete}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
                Skip setup, I'll explore on my own
            </button>
        </div>
    );

    const renderOverview = () => (
        <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Here's the Plan</h3>
            <p className="text-gray-600 text-center mb-8">We'll guide you through these steps:</p>
            
            <div className="space-y-4 max-w-lg mx-auto mb-8">
                {[
                    { num: 1, title: 'Connect Payment Processor', desc: 'Link Stripe, Square, or PayPal for live data', icon: <CreditCardIcon className="w-6 h-6 text-portal-club" />, time: '2 min' },
                    { num: 2, title: 'Add Your Coaches', desc: 'Import or add your coaching staff', icon: <AcademicCapIcon className="w-6 h-6 text-portal-club" />, time: '1 min' },
                    { num: 3, title: 'Add Your Students', desc: 'Import from CSV or add manually', icon: <UsersIcon className="w-6 h-6 text-portal-club" />, time: '2 min' },
                    { num: 4, title: 'Quick Feature Tour', desc: 'See what KorIQ can do for you', icon: <MapIcon className="w-6 h-6 text-portal-club" />, time: '1 min' },
                ].map((step) => (
                    <div key={step.num} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-portal-club/30 transition-colors">
                        <div className="w-12 h-12 bg-portal-club/10 rounded-xl flex items-center justify-center">
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-800">{step.title}</h4>
                                <span className="text-xs text-gray-400">~{step.time}</span>
                            </div>
                            <p className="text-sm text-gray-500">{step.desc}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                            {step.num}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex gap-3 max-w-lg mx-auto">
                <Button variant="secondary" onClick={goBack} fullWidth>
                    Back
                </Button>
                <Button onClick={goNext} fullWidth>
                    Start Setup
                </Button>
            </div>
        </div>
    );

    const renderPayment = () => (
        <div className="p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Payment Processor</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    This is the magic step! Connect your payment processor to automatically sync transactions and power your analytics with real data.
                </p>
            </div>
            
            {/* Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                {[
                    { id: 'stripe' as PaymentProcessor, name: 'Stripe', icon: <CreditCardIcon className="w-10 h-10 text-indigo-600" />, color: 'indigo', popular: true },
                    { id: 'square' as PaymentProcessor, name: 'Square', icon: <div className="w-10 h-10 border-2 border-gray-400 rounded-lg" />, color: 'gray', popular: false },
                    { id: 'paypal' as PaymentProcessor, name: 'PayPal', icon: <CurrencyIcon className="w-10 h-10 text-blue-600" />, color: 'blue', popular: false },
                ].map((processor) => (
                    <button
                        key={processor.id}
                        onClick={() => {
                            onConnectPayment(processor.id);
                            goNext();
                        }}
                        className={`relative p-6 rounded-xl border-2 border-gray-200 hover:border-portal-club bg-white transition-all hover:shadow-lg text-center group`}
                    >
                        {processor.popular && (
                            <span className="absolute -top-2 -right-2 bg-portal-club text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                Popular
                            </span>
                        )}
                        <div className="flex justify-center mb-3">{processor.icon}</div>
                        <span className="font-bold text-gray-800 group-hover:text-portal-club">{processor.name}</span>
                    </button>
                ))}
            </div>
            
            {/* Benefits */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-lg mx-auto mb-8">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-blue-600" /> Why connect?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Automatic transaction sync (no manual entry)</li>
                    <li>• Real-time revenue tracking by coach & program</li>
                    <li>• AI-powered insights and forecasting</li>
                    <li>• One-click invoice generation</li>
                </ul>
            </div>
            
            <div className="flex gap-3 max-w-lg mx-auto">
                <Button variant="secondary" onClick={goBack} fullWidth>
                    Back
                </Button>
                <button 
                    onClick={() => {
                        setSkippedPayment(true);
                        goNext();
                    }}
                    className="flex-1 py-3 text-gray-500 hover:text-gray-700 font-medium"
                >
                    Skip for now →
                </button>
            </div>
        </div>
    );

    const renderCoaches = () => (
        <div className="p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AcademicCapIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Coaches</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Add your coaching staff to track their performance, earnings, and student assignments.
                </p>
            </div>
            
            {/* Current Coach Count */}
            <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Coaches in system</p>
                        <p className="text-3xl font-bold text-gray-800">{coaches.length}</p>
                    </div>
                    <div className="opacity-50"><UsersIcon className="w-16 h-16 text-gray-400" /></div>
                </div>
            </div>
            
            {/* Add Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                <button
                    onClick={() => {
                        onAddCoach();
                    }}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-portal-club bg-white transition-all hover:shadow-lg text-center"
                >
                    <span className="text-3xl block mb-2">➕</span>
                    <span className="font-bold text-gray-800 block">Add Coach</span>
                    <span className="text-sm text-gray-500">Add one at a time</span>
                </button>
                <button
                    onClick={() => {
                        onImportCSV();
                    }}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-portal-club bg-white transition-all hover:shadow-lg text-center"
                >
                    <span className="text-3xl block mb-2">📤</span>
                    <span className="font-bold text-gray-800 block">Import CSV</span>
                    <span className="text-sm text-gray-500">Bulk import</span>
                </button>
            </div>
            
            <div className="flex gap-3 max-w-lg mx-auto">
                <Button variant="secondary" onClick={goBack} fullWidth>
                    Back
                </Button>
                <Button onClick={goNext} fullWidth>
                    {coaches.length > 0 ? 'Continue' : 'Skip for now'}
                </Button>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Students</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Import your student roster to track progress, engagement, and identify at-risk members.
                </p>
            </div>
            
            {/* Current Student Count */}
            <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Students in system</p>
                        <p className="text-3xl font-bold text-gray-800">{students.length}</p>
                    </div>
                    <div className="opacity-50"><AcademicCapIcon className="w-16 h-16 text-gray-400" /></div>
                </div>
            </div>
            
            {/* Import Option */}
            <div className="max-w-lg mx-auto mb-8">
                <button
                    onClick={() => {
                        onImportCSV();
                    }}
                    className="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-portal-club bg-gray-50 hover:bg-portal-club/5 transition-all text-center"
                >
                    <span className="block mb-3"><ClipboardListIcon className="w-10 h-10 text-gray-600 mx-auto" /></span>
                    <span className="font-bold text-gray-800 block mb-1">Import from CSV</span>
                    <span className="text-sm text-gray-500 block">
                        Upload a spreadsheet with student names, emails, and payment history
                    </span>
                </button>
            </div>
            
            {/* Tip */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-lg mx-auto mb-8">
                <p className="text-sm text-green-700">
                    <span className="font-bold inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4" /> Pro tip:</span> If you connected a payment processor, students will be automatically created from payment data!
                </p>
            </div>
            
            <div className="flex gap-3 max-w-lg mx-auto">
                <Button variant="secondary" onClick={goBack} fullWidth>
                    Back
                </Button>
                <Button onClick={goNext} fullWidth>
                    {students.length > 0 ? 'Continue' : 'Skip for now'}
                </Button>
            </div>
        </div>
    );

    const renderTour = () => (
        <div className="p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Feature Tour</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                    Here's what KorIQ can do for your club. Click any feature to explore.
                </p>
            </div>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                {tourFeatures.map((feature, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (feature.tab) {
                                onNavigateToTab(feature.tab);
                                onComplete();
                            }
                        }}
                        className="p-4 rounded-xl border border-gray-200 hover:border-portal-club bg-white hover:bg-portal-club/5 transition-all text-left group"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{feature.icon}</span>
                            <div>
                                <h4 className="font-bold text-gray-800 group-hover:text-portal-club">{feature.title}</h4>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="flex gap-3 max-w-lg mx-auto">
                <Button variant="secondary" onClick={goBack} fullWidth>
                    Back
                </Button>
                <Button onClick={goNext} fullWidth>
                    Finish Setup
                </Button>
            </div>
        </div>
    );

    const renderComplete = () => (
        <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircleIcon className="w-14 h-14 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your club portal is ready. Explore your dashboard to see insights and analytics.
            </p>
            
            {/* Setup Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto mb-8">
                <h4 className="font-bold text-gray-800 mb-4">Setup Summary</h4>
                <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Payment Processor</span>
                        <span className={`font-medium ${skippedPayment ? 'text-yellow-600' : 'text-green-600'}`}>
                            {skippedPayment ? '⏸️ Skipped' : '✓ Connected'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Coaches Added</span>
                        <span className="font-medium text-gray-800">{coaches.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Students Added</span>
                        <span className="font-medium text-gray-800">{students.length}</span>
                    </div>
                </div>
            </div>
            
            {/* Next Steps */}
            {skippedPayment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-md mx-auto mb-8">
                    <p className="text-sm text-yellow-700">
                        <span className="font-bold inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4" /> Recommended:</span> Connect a payment processor from Settings → Integrations to unlock live analytics.
                    </p>
                </div>
            )}
            
            <Button 
                onClick={handleComplete}
                fullWidth
                className="max-w-md mx-auto text-lg py-4"
            >
                Go to Dashboard →
            </Button>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 'welcome': return renderWelcome();
            case 'overview': return renderOverview();
            case 'payment': return renderPayment();
            case 'coaches': return renderCoaches();
            case 'students': return renderStudents();
            case 'tour': return renderTour();
            case 'complete': return renderComplete();
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slideDown">
                {/* Progress Bar (not on welcome/complete) */}
                {currentStep !== 'welcome' && currentStep !== 'complete' && renderProgressBar()}
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default ClubGettingStartedWizard;
