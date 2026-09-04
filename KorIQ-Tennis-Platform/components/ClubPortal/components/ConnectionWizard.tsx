import React, { useState, useEffect } from 'react';
import { PaymentProcessor, ProcessorConnection } from '../../../types';
import { Button } from '../../ui/Button';

// SVG Icons
const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const SparklesIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const LockClosedIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

interface ConnectionWizardProps {
    processor: PaymentProcessor;
    clubId: string;
    onComplete: (connection: ProcessorConnection) => void;
    onClose: () => void;
}

type WizardStep = 'welcome' | 'permissions' | 'connecting' | 'success';

const processorConfig: Record<PaymentProcessor, {
    name: string;
    logo: string;
    color: string;
    bgColor: string;
    borderColor: string;
    oauthUrl: string;
}> = {
    stripe: {
        name: 'Stripe',
        logo: 'S',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        oauthUrl: 'https://connect.stripe.com/oauth/authorize'
    },
    square: {
        name: 'Square',
        logo: 'Sq',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-300',
        oauthUrl: 'https://connect.squareup.com/oauth2/authorize'
    },
    paypal: {
        name: 'PayPal',
        logo: 'PP',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        oauthUrl: 'https://www.paypal.com/signin/authorize'
    }
};

const ConnectionWizard: React.FC<ConnectionWizardProps> = ({
    processor,
    clubId,
    onComplete,
    onClose
}) => {
    const [step, setStep] = useState<WizardStep>('welcome');
    const [syncProgress, setSyncProgress] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const config = processorConfig[processor];

    // Simulate OAuth and sync process
    useEffect(() => {
        if (step === 'connecting') {
            // Simulate connection delay
            const connectTimer = setTimeout(() => {
                // Simulate sync progress
                let progress = 0;
                const syncInterval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(syncInterval);
                        // Generate mock transaction count
                        setTransactionCount(Math.floor(Math.random() * 1500) + 500);
                        setTimeout(() => setStep('success'), 500);
                    }
                    setSyncProgress(Math.min(progress, 100));
                    setTransactionCount(Math.floor((progress / 100) * (Math.random() * 1500 + 500)));
                }, 200);
            }, 1500);

            return () => clearTimeout(connectTimer);
        }
    }, [step]);

    const handleConnect = () => {
        // In real implementation, this would redirect to OAuth
        // For now, simulate the process
        setStep('connecting');
    };

    const handleComplete = () => {
        const newConnection: ProcessorConnection = {
            id: `conn_${Date.now()}`,
            clubId,
            processor,
            status: 'connected',
            accountName: processor === 'stripe' ? 'Precision Tennis Inc.' : 
                         processor === 'square' ? 'Vancouver Tennis Club' : 
                         'Tennis Academy PayPal',
            accountId: `acct_${Math.random().toString(36).substr(2, 9)}`,
            connectedAt: new Date().toISOString(),
            lastSyncAt: new Date().toISOString(),
            transactionsSynced: transactionCount
        };
        onComplete(newConnection);
    };

    const renderWelcome = () => (
        <div className="text-center">
            <div className={`w-20 h-20 ${config.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <span className="text-4xl">{config.logo}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Connect to {config.name}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Link your {config.name} account to automatically sync payment data and unlock powerful analytics.
            </p>

            {/* Benefits */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                <h4 className="font-bold text-gray-800 mb-4">What you'll get:</h4>
                <div className="space-y-3">
                    {[
                        { icon: <ChartBarIcon className="w-5 h-5 text-portal-club" />, text: 'Real-time revenue analytics' },
                        { icon: <AcademicCapIcon className="w-5 h-5 text-orange-600" />, text: 'Coach performance tracking' },
                        { icon: <TrendingUpIcon className="w-5 h-5 text-blue-600" />, text: 'Student insights & churn prediction' },
                        { icon: <SparklesIcon className="w-5 h-5 text-purple-600" />, text: 'AI-powered recommendations' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
                <Button variant="secondary" fullWidth onClick={onClose}>
                    Cancel
                </Button>
                <Button fullWidth onClick={() => setStep('permissions')}>
                    Continue
                </Button>
            </div>
        </div>
    );

    const renderPermissions = () => (
        <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LockClosedIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Secure Connection
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We request <strong>read-only</strong> access to your transactions. We can never modify your {config.name} account.
            </p>

            {/* Permissions List */}
            <div className={`${config.bgColor} rounded-xl p-6 mb-8 text-left max-w-md mx-auto border ${config.borderColor}`}>
                <h4 className={`font-bold ${config.color} mb-4 flex items-center gap-2`}>
                    <span>{config.logo}</span>
                    {config.name} Permissions
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm text-gray-700">View transaction history</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm text-gray-700">View customer information</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm text-gray-700">Receive real-time payment notifications</span>
                    </div>
                    <hr className="border-gray-200 my-3" />
                    <div className="flex items-center gap-3">
                        <span className="text-red-500">✕</span>
                        <span className="text-sm text-gray-500">Cannot process payments</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-red-500">✕</span>
                        <span className="text-sm text-gray-500">Cannot modify your account</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-red-500">✕</span>
                        <span className="text-sm text-gray-500">Cannot issue refunds</span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
                You'll be redirected to {config.name} to authorize. You can disconnect anytime.
            </p>

            <div className="flex gap-3 max-w-md mx-auto">
                <Button variant="secondary" fullWidth onClick={() => setStep('welcome')}>
                    Back
                </Button>
                <Button fullWidth onClick={handleConnect}>
                    Connect to {config.name}
                </Button>
            </div>
        </div>
    );

    const renderConnecting = () => (
        <div className="text-center">
            <div className={`w-20 h-20 ${config.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse`}>
                <span className="text-4xl">{config.logo}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {syncProgress < 30 ? 'Connecting...' : 'Syncing Your Data'}
            </h2>
            <p className="text-gray-500 mb-8">
                {syncProgress < 30 
                    ? `Establishing secure connection with ${config.name}...`
                    : 'Importing your transaction history...'}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-portal-club transition-all duration-300 rounded-full"
                        style={{ width: `${syncProgress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    {syncProgress.toFixed(0)}% complete
                </p>
            </div>

            {syncProgress > 30 && (
                <div className="bg-gray-50 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-sm text-gray-600">
                        <span className="font-bold text-portal-club">{transactionCount.toLocaleString()}</span> transactions found
                    </p>
                </div>
            )}
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {config.name} Connected!
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Your account has been successfully linked. We've imported your payment history.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Transactions Synced</p>
                    <p className="text-2xl font-bold text-green-600">{transactionCount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                    <p className="text-2xl font-bold text-blue-600">● Live</p>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-8 max-w-md mx-auto border border-yellow-200 text-left">
                <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-yellow-600" /> Next Step: Map Your Payments
                </h4>
                <p className="text-sm text-yellow-700">
                    Help us understand your payment descriptions by linking them to coaches and program types.
                </p>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
                <Button variant="secondary" fullWidth onClick={onClose}>
                    Do This Later
                </Button>
                <Button fullWidth onClick={handleComplete}>
                    Continue to Mapping
                </Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideDown">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                            <span className="text-lg">{config.logo}</span>
                        </div>
                        <span className="font-bold text-gray-800">Connect {config.name}</span>
                    </div>
                    {step !== 'connecting' && (
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                            ✕
                        </button>
                    )}
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 py-4 border-b border-gray-100 bg-gray-50">
                    {(['welcome', 'permissions', 'connecting', 'success'] as WizardStep[]).map((s, i) => (
                        <div
                            key={s}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                step === s 
                                    ? 'bg-portal-club w-6' 
                                    : (['welcome', 'permissions', 'connecting', 'success'].indexOf(step) > i)
                                        ? 'bg-portal-club'
                                        : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="p-8">
                    {step === 'welcome' && renderWelcome()}
                    {step === 'permissions' && renderPermissions()}
                    {step === 'connecting' && renderConnecting()}
                    {step === 'success' && renderSuccess()}
                </div>
            </div>
        </div>
    );
};

export default ConnectionWizard;
