import React, { useState } from 'react';
import { PaymentProcessor, ProcessorConnection, SyncEvent } from '../../../types';
import { Button } from '../../ui/Button';

interface SyncLogModalProps {
    processor: PaymentProcessor;
    events: SyncEvent[];
    connection?: ProcessorConnection;
    onClose: () => void;
}

const processorConfig: Record<PaymentProcessor, { name: string; logo: string; color: string }> = {
    stripe: { name: 'Stripe', logo: 'S', color: 'text-indigo-600' },
    square: { name: 'Square', logo: 'Sq', color: 'text-gray-800' },
    paypal: { name: 'PayPal', logo: 'PP', color: 'text-blue-600' }
};

const eventTypeConfig: Record<SyncEvent['eventType'], { icon: string; color: string; bgColor: string }> = {
    payment_received: { icon: '$', color: 'text-green-700', bgColor: 'bg-green-50' },
    refund: { icon: '<-', color: 'text-orange-700', bgColor: 'bg-orange-50' },
    sync_completed: { icon: '✓', color: 'text-blue-700', bgColor: 'bg-blue-50' },
    sync_error: { icon: '!', color: 'text-red-700', bgColor: 'bg-red-50' },
    new_unmapped: { icon: '?', color: 'text-yellow-700', bgColor: 'bg-yellow-50' }
};

// Generate mock sync events
const generateMockEvents = (processor: PaymentProcessor): SyncEvent[] => {
    const now = new Date();
    const events: SyncEvent[] = [];
    
    // Add some sample events
    const sampleEvents = [
        { type: 'payment_received' as const, msg: 'Payment received: $85.00 (Private - Mike)', amount: 8500 },
        { type: 'payment_received' as const, msg: 'Payment received: $45.00 (Group Class)', amount: 4500 },
        { type: 'sync_completed' as const, msg: 'Daily sync completed: 0 errors' },
        { type: 'payment_received' as const, msg: 'Payment received: $85.00 (Private - Sarah)', amount: 8500 },
        { type: 'new_unmapped' as const, msg: 'New payment type detected: "Junior Clinic"' },
        { type: 'payment_received' as const, msg: 'Payment received: $120.00 (Camp Deposit)', amount: 12000 },
        { type: 'refund' as const, msg: 'Refund processed: $45.00', amount: -4500 },
        { type: 'sync_completed' as const, msg: 'Hourly sync completed: 3 new transactions' },
        { type: 'payment_received' as const, msg: 'Payment received: $65.00 (Group Class)', amount: 6500 },
        { type: 'payment_received' as const, msg: 'Payment received: $85.00 (Private - Mike)', amount: 8500 },
    ];

    sampleEvents.forEach((e, i) => {
        events.push({
            id: `evt_${i}`,
            clubId: 'club_1',
            processor,
            eventType: e.type,
            message: e.msg,
            amount: e.amount,
            timestamp: new Date(now.getTime() - i * 45 * 60000).toISOString() // Every 45 mins
        });
    });

    return events;
};

const SyncLogModal: React.FC<SyncLogModalProps> = ({
    processor,
    events: propEvents,
    connection,
    onClose
}) => {
    const [filter, setFilter] = useState<'all' | SyncEvent['eventType']>('all');
    const config = processorConfig[processor];
    
    // Use mock events if none provided
    const events = propEvents.length > 0 ? propEvents : generateMockEvents(processor);

    const filteredEvents = filter === 'all' 
        ? events 
        : events.filter(e => e.eventType === filter);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Group events by date
    const groupedEvents = filteredEvents.reduce((acc, event) => {
        const date = new Date(event.timestamp).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as Record<string, SyncEvent[]>);

    const filterOptions: { value: 'all' | SyncEvent['eventType']; label: string }[] = [
        { value: 'all', label: 'All Events' },
        { value: 'payment_received', label: 'Payments' },
        { value: 'refund', label: 'Refunds' },
        { value: 'sync_completed', label: 'Syncs' },
        { value: 'sync_error', label: 'Errors' },
        { value: 'new_unmapped', label: 'Unmapped' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slideDown">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{config.logo}</span>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{config.name} Sync Log</h2>
                                <p className="text-sm text-gray-500">
                                    {connection?.status === 'connected' 
                                        ? `Last sync: ${formatTime(connection.lastSyncAt || '')}`
                                        : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                            ✕
                        </button>
                    </div>

                    {/* Connection Status */}
                    {connection && (
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                    connection.status === 'connected' ? 'bg-green-500' : 
                                    connection.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                                }`} />
                                <span className="text-sm font-medium text-gray-700">
                                    {connection.status === 'connected' ? 'Live' : 
                                     connection.status === 'error' ? 'Error' : 'Disconnected'}
                                </span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-600">
                                {connection.transactionsSynced.toLocaleString()} transactions synced
                            </span>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                filter === opt.value
                                    ? 'bg-portal-club text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Events List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No Events</h3>
                            <p className="text-gray-500">No sync events match your filter.</p>
                        </div>
                    ) : (
                        Object.entries(groupedEvents).map(([date, dateEvents]) => (
                            <div key={date}>
                                <div className="px-6 py-2 bg-gray-50 border-y border-gray-100 sticky top-0">
                                    <p className="text-xs font-bold text-gray-500 uppercase">
                                        {formatDate(dateEvents[0].timestamp)}
                                    </p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {dateEvents.map(event => {
                                        const typeConfig = eventTypeConfig[event.eventType];
                                        return (
                                            <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${typeConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                                                        <span className="text-sm">{typeConfig.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${typeConfig.color}`}>
                                                            {event.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {formatTime(event.timestamp)}
                                                        </p>
                                                    </div>
                                                    {event.amount && (
                                                        <span className={`text-sm font-bold ${event.amount > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                                            {event.amount > 0 ? '+' : ''}${Math.abs(event.amount / 100).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                    </p>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SyncLogModal;
