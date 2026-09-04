import React from 'react';
import { ProcessorConnection, SyncEvent, PaymentProcessor } from '../../../types';

interface SyncStatusWidgetProps {
    connections: ProcessorConnection[];
    recentEvents: SyncEvent[];
    onViewFullLog: () => void;
}

const processorConfig: Record<PaymentProcessor, { name: string; logo: string }> = {
    stripe: { name: 'Stripe', logo: 'S' },
    square: { name: 'Square', logo: 'Sq' },
    paypal: { name: 'PayPal', logo: 'PP' }
};

// Generate mock recent events if none provided
const generateMockRecentEvents = (): SyncEvent[] => {
    const now = new Date();
    return [
        {
            id: 'evt_1',
            clubId: 'club_1',
            processor: 'stripe' as PaymentProcessor,
            eventType: 'payment_received',
            message: 'Payment received: $85.00 (Private - Mike)',
            amount: 8500,
            timestamp: new Date(now.getTime() - 15 * 60000).toISOString()
        },
        {
            id: 'evt_2',
            clubId: 'club_1',
            processor: 'stripe' as PaymentProcessor,
            eventType: 'payment_received',
            message: 'Payment received: $45.00 (Group Class)',
            amount: 4500,
            timestamp: new Date(now.getTime() - 75 * 60000).toISOString()
        },
        {
            id: 'evt_3',
            clubId: 'club_1',
            processor: 'stripe' as PaymentProcessor,
            eventType: 'payment_received',
            message: 'Payment received: $85.00 (Private - Sarah)',
            amount: 8500,
            timestamp: new Date(now.getTime() - 150 * 60000).toISOString()
        },
        {
            id: 'evt_4',
            clubId: 'club_1',
            processor: 'stripe' as PaymentProcessor,
            eventType: 'sync_completed',
            message: 'Daily sync completed: 0 errors',
            timestamp: new Date(now.getTime() - 540 * 60000).toISOString()
        },
    ];
};

const SyncStatusWidget: React.FC<SyncStatusWidgetProps> = ({
    connections,
    recentEvents,
    onViewFullLog
}) => {
    const events = recentEvents.length > 0 ? recentEvents : generateMockRecentEvents();
    const processors: PaymentProcessor[] = ['stripe', 'square', 'paypal'];

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const getConnectionForProcessor = (processor: PaymentProcessor) => 
        connections.find(c => c.processor === processor);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <span>🔄</span> Live Sync Status
                    </h3>
                    <button 
                        onClick={onViewFullLog}
                        className="text-xs text-portal-club hover:underline font-medium"
                    >
                        View Full Log →
                    </button>
                </div>
            </div>

            {/* Processor Status */}
            <div className="p-4 space-y-2 border-b border-gray-100">
                {processors.map(processor => {
                    const connection = getConnectionForProcessor(processor);
                    const config = processorConfig[processor];
                    const isConnected = connection?.status === 'connected';
                    const lastSync = connection?.lastSyncAt;
                    
                    return (
                        <div key={processor} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    isConnected ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                                <span className="text-sm">{config.logo}</span>
                                <span className="text-sm font-medium text-gray-700">{config.name}</span>
                            </div>
                            <span className={`text-xs ${isConnected ? 'text-gray-500' : 'text-gray-400'}`}>
                                {isConnected 
                                    ? `Last: ${formatTime(lastSync || '')}` 
                                    : 'Not connected'}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Today's Activity */}
            <div className="p-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-3">Today's Activity</p>
                <div className="space-y-3">
                    {events.slice(0, 4).map((event, i) => (
                        <div key={event.id} className="flex items-start gap-3 text-sm">
                            <span className="text-gray-400 text-xs whitespace-nowrap pt-0.5">
                                {formatTime(event.timestamp)}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-700 truncate">{event.message}</p>
                            </div>
                            {event.amount && event.amount > 0 && (
                                <span className="text-green-600 font-medium text-xs">
                                    +${(event.amount / 100).toFixed(0)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default SyncStatusWidget;
