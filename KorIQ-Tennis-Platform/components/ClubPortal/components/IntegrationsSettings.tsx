import React, { useState } from 'react';
import { ProcessorConnection, PaymentProcessor, SyncEvent, Coach } from '../../../types';
import ProcessorCard from './ProcessorCard';
import ConnectionWizard from './ConnectionWizard';
import SyncLogModal from './SyncLogModal';
import { Button } from '../../ui/Button';

// SVG Icons
const BuildingIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const BellIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const ExclamationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

interface IntegrationsSettingsProps {
    clubId: string;
    coaches: Coach[];
    connections: ProcessorConnection[];
    syncEvents: SyncEvent[];
    onConnectionChange: (connections: ProcessorConnection[]) => void;
}

type SettingsTab = 'integrations' | 'profile' | 'notifications';

const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({
    clubId,
    connections,
    syncEvents,
    onConnectionChange,
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('integrations');
    const [showWizard, setShowWizard] = useState(false);
    const [wizardProcessor, setWizardProcessor] = useState<PaymentProcessor | null>(null);
    const [showSyncLog, setShowSyncLog] = useState(false);
    const [syncLogProcessor, setSyncLogProcessor] = useState<PaymentProcessor | null>(null);
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState<PaymentProcessor | null>(null);

    // Profile form state
    const [clubName, setClubName] = useState('Vancouver Tennis Club');
    const [clubEmail, setClubEmail] = useState('info@vancouvertennisclub.com');
    const [clubPhone, setClubPhone] = useState('(604) 555-0123');
    const [clubAddress, setClubAddress] = useState('123 Tennis Drive, Vancouver, BC V6B 1A1');

    const processors: PaymentProcessor[] = ['stripe', 'square', 'paypal'];

    const getConnection = (processor: PaymentProcessor) => 
        connections.find(c => c.processor === processor);

    const handleConnect = (processor: PaymentProcessor) => {
        setWizardProcessor(processor);
        setShowWizard(true);
    };

    const handleDisconnect = (processor: PaymentProcessor) => {
        setShowDisconnectConfirm(processor);
    };

    const confirmDisconnect = () => {
        if (showDisconnectConfirm) {
            const updated = connections.filter(c => c.processor !== showDisconnectConfirm);
            onConnectionChange(updated);
            setShowDisconnectConfirm(null);
        }
    };

    const handleViewSyncLog = (processor: PaymentProcessor) => {
        setSyncLogProcessor(processor);
        setShowSyncLog(true);
    };

    const handleWizardComplete = (newConnection: ProcessorConnection) => {
        const existing = connections.filter(c => c.processor !== newConnection.processor);
        onConnectionChange([...existing, newConnection]);
        setShowWizard(false);
        setWizardProcessor(null);
    };

    const connectedCount = connections.filter(c => c.status === 'connected').length;
    const totalTransactions = connections.reduce((sum, c) => sum + c.transactionsSynced, 0);

    const tabConfig = [
        { id: 'integrations' as SettingsTab, label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
        { id: 'profile' as SettingsTab, label: 'Club Profile', icon: <BuildingIcon className="w-4 h-4" /> },
        { id: 'notifications' as SettingsTab, label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Club Settings</h2>
            </div>

            {/* Settings Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {tabConfig.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 -mb-px ${
                                activeTab === tab.id
                                    ? 'border-portal-club text-gray-900 bg-gray-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            {/* Header Stats */}
                            <div className="bg-gradient-to-r from-portal-club/10 to-teal-50 rounded-xl p-6 border border-portal-club/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg mb-1">Payment Integrations</h3>
                                        <p className="text-sm text-gray-600">
                                            Connect your payment processors to unlock real-time analytics
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Connected</p>
                                                <p className="text-2xl font-bold text-portal-club">{connectedCount}/3</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Transactions</p>
                                                <p className="text-2xl font-bold text-gray-800">{totalTransactions.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Processor Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {processors.map(processor => (
                                    <ProcessorCard
                                        key={processor}
                                        processor={processor}
                                        connection={getConnection(processor)}
                                        onConnect={handleConnect}
                                        onDisconnect={handleDisconnect}
                                        onViewSyncLog={handleViewSyncLog}
                                    />
                                ))}
                            </div>

                            {/* Help Section */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <LightBulbIcon className="w-5 h-5 text-blue-600" /> How It Works
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { step: '1', title: 'Connect', desc: 'Securely link your payment processor via OAuth' },
                                        { step: '2', title: 'Auto-Sync', desc: 'Transactions sync automatically with coach & class data' },
                                        { step: '3', title: 'Analyze', desc: 'Get real-time insights, revenue tracking, and optimization recommendations' },
                                    ].map(item => (
                                        <div key={item.step} className="text-center">
                                            <div className="w-8 h-8 bg-portal-club text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                                                {item.step}
                                            </div>
                                            <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Auto-Create Accounts Info */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <span>🔄</span> Automatic Account Creation
                                </h4>
                                <p className="text-sm text-blue-700 mb-3">
                                    When a new student or coach appears in your payment data, we'll automatically create an "Unclaimed" 
                                    account for them and send an invitation email to claim their profile.
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 text-portal-club rounded" />
                                        <span className="text-blue-800">Auto-create student accounts</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 text-portal-club rounded" />
                                        <span className="text-blue-800">Send invitation emails</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                                <div className="w-24 h-24 bg-portal-club rounded-xl flex items-center justify-center text-white">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{clubName}</h3>
                                    <p className="text-gray-500">Club ID: {clubId}</p>
                                    <button className="mt-2 text-sm text-portal-club hover:underline">Change Logo</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Club Name</label>
                                    <input 
                                        type="text" 
                                        value={clubName}
                                        onChange={(e) => setClubName(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-club focus:border-portal-club outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={clubEmail}
                                        onChange={(e) => setClubEmail(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-club focus:border-portal-club outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={clubPhone}
                                        onChange={(e) => setClubPhone(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-club focus:border-portal-club outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Address</label>
                                    <input 
                                        type="text" 
                                        value={clubAddress}
                                        onChange={(e) => setClubAddress(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-portal-club focus:border-portal-club outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <p className="text-gray-600 text-sm">Configure when and how you receive notifications.</p>
                            
                            <div className="space-y-4">
                                {[
                                    { id: 'new_student', label: 'New Student Sign-ups', desc: 'Get notified when a new student registers', default: true },
                                    { id: 'payment_received', label: 'Payment Received', desc: 'Notify when a payment is processed', default: true },
                                    { id: 'at_risk', label: 'At-Risk Student Alerts', desc: 'Alert when a student becomes inactive', default: true },
                                    { id: 'sync_complete', label: 'Sync Completed', desc: 'Notify when payment processor sync finishes', default: false },
                                    { id: 'weekly_summary', label: 'Weekly Summary', desc: 'Receive a weekly performance summary', default: true },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-portal-club/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-portal-club"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <Button>Save Preferences</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Connection Wizard Modal */}
            {showWizard && wizardProcessor && (
                <ConnectionWizard
                    processor={wizardProcessor}
                    clubId={clubId}
                    onComplete={handleWizardComplete}
                    onClose={() => {
                        setShowWizard(false);
                        setWizardProcessor(null);
                    }}
                />
            )}

            {/* Sync Log Modal */}
            {showSyncLog && syncLogProcessor && (
                <SyncLogModal
                    processor={syncLogProcessor}
                    events={syncEvents.filter(e => e.processor === syncLogProcessor)}
                    connection={getConnection(syncLogProcessor)}
                    onClose={() => {
                        setShowSyncLog(false);
                        setSyncLogProcessor(null);
                    }}
                />
            )}

            {/* Disconnect Confirmation Modal */}
            {showDisconnectConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slideDown">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ExclamationIcon className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Disconnect {showDisconnectConfirm.charAt(0).toUpperCase() + showDisconnectConfirm.slice(1)}?</h3>
                            <p className="text-gray-500 text-sm">
                                This will stop syncing new transactions. Historical data will be preserved.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                fullWidth 
                                onClick={() => setShowDisconnectConfirm(null)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="danger" 
                                fullWidth 
                                onClick={confirmDisconnect}
                            >
                                Disconnect
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegrationsSettings;
