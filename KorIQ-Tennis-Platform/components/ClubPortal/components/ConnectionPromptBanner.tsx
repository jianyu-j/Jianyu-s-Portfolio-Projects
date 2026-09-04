import React from 'react';
import { ProcessorConnection } from '../../../types';
import { Button } from '../../ui/Button';

// SVG Icons
const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

interface ConnectionPromptBannerProps {
    connections: ProcessorConnection[];
    onConnect: () => void;
    onDismiss?: () => void;
    variant?: 'full' | 'compact';
}

const ConnectionPromptBanner: React.FC<ConnectionPromptBannerProps> = ({
    connections,
    onConnect,
    onDismiss,
    variant = 'full'
}) => {
    const hasConnection = connections.some(c => c.status === 'connected');
    
    if (hasConnection) return null;

    if (variant === 'compact') {
        return (
            <div className="bg-gradient-to-r from-portal-club/10 to-teal-50 border border-portal-club/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-portal-club/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🔌</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm">Connect your payment processor</p>
                        <p className="text-xs text-gray-500">Unlock real-time analytics with live payment data</p>
                    </div>
                </div>
                <Button onClick={onConnect} className="text-sm">
                    Connect Now
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-portal-club/5 via-teal-50 to-blue-50 border-2 border-dashed border-portal-club/30 rounded-2xl p-8 mb-6">
            <div className="max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6">
                    <ChartBarIcon className="w-10 h-10 text-portal-club" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Unlock Real-Time Analytics
                </h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Connect your payment processor to automatically sync transactions and power your analytics with real data instead of estimates.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: <CurrencyIcon className="w-5 h-5 text-green-600" />, title: 'Live Revenue', desc: 'Real-time payment tracking' },
                        { icon: <AcademicCapIcon className="w-5 h-5 text-orange-600" />, title: 'Coach Earnings', desc: 'Automatic attribution' },
                        { icon: <SparklesIcon className="w-5 h-5 text-purple-600" />, title: 'AI Insights', desc: 'Smart recommendations' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/80 rounded-xl p-4 border border-gray-100">
                            <span className="text-2xl mb-2 block">{item.icon}</span>
                            <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Supported Processors */}
                <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Supports:</span>
                        <span className="font-medium">Stripe</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium">Square</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-medium">PayPal</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                    <Button onClick={onConnect} className="px-8">
                        Connect Payment Processor
                    </Button>
                    {onDismiss && (
                        <button 
                            onClick={onDismiss}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Maybe Later
                        </button>
                    )}
                </div>

                {/* Trust Badge */}
                <p className="text-xs text-gray-400 mt-6">
                    <span className="inline-flex items-center gap-1"><LockClosedIcon className="w-4 h-4" /> We only request read-only access. Your payment data stays secure.</span>
                </p>
            </div>
        </div>
    );
};

export default ConnectionPromptBanner;
