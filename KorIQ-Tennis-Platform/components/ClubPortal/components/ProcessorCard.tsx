import React from 'react';
import { ProcessorConnection, PaymentProcessor, ConnectionStatus } from '../../../types';
import { Button } from '../../ui/Button';

interface ProcessorCardProps {
    processor: PaymentProcessor;
    connection?: ProcessorConnection;
    onConnect: (processor: PaymentProcessor) => void;
    onDisconnect: (processor: PaymentProcessor) => void;
    onViewSyncLog: (processor: PaymentProcessor) => void;
}

const processorConfig: Record<PaymentProcessor, {
    name: string;
    logo: string;
    color: string;
    bgColor: string;
    description: string;
}> = {
    stripe: {
        name: 'Stripe',
        logo: 'S',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'Most popular for tennis clubs'
    },
    square: {
        name: 'Square',
        logo: 'Sq',
        color: 'text-gray-800',
        bgColor: 'bg-gray-50',
        description: 'Great for in-person payments'
    },
    paypal: {
        name: 'PayPal',
        logo: 'PP',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Trusted worldwide payments'
    }
};

const statusConfig: Record<ConnectionStatus, {
    label: string;
    dotColor: string;
    textColor: string;
}> = {
    connected: {
        label: 'Connected',
        dotColor: 'bg-green-500',
        textColor: 'text-green-600'
    },
    disconnected: {
        label: 'Not Connected',
        dotColor: 'bg-gray-400',
        textColor: 'text-gray-500'
    },
    error: {
        label: 'Connection Error',
        dotColor: 'bg-red-500',
        textColor: 'text-red-600'
    },
    syncing: {
        label: 'Syncing...',
        dotColor: 'bg-yellow-500 animate-pulse',
        textColor: 'text-yellow-600'
    }
};

const ProcessorCard: React.FC<ProcessorCardProps> = ({
    processor,
    connection,
    onConnect,
    onDisconnect,
    onViewSyncLog
}) => {
    const config = processorConfig[processor];
    const isConnected = connection?.status === 'connected' || connection?.status === 'syncing';
    const status = connection?.status || 'disconnected';
    const statusCfg = statusConfig[status];

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatLastSync = (dateStr?: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
        return formatDate(dateStr);
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${isConnected ? 'ring-2 ring-green-100' : ''}`}>
            {/* Header */}
            <div className={`p-4 ${config.bgColor} border-b border-gray-100`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{config.logo}</span>
                    <div>
                        <h3 className={`font-bold text-lg ${config.color}`}>{config.name}</h3>
                        <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dotColor}`}></span>
                    <span className={`text-sm font-medium ${statusCfg.textColor}`}>
                        {statusCfg.label}
                    </span>
                </div>

                {isConnected && connection ? (
                    <>
                        {/* Connection Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Account</span>
                                <span className="font-medium text-gray-800">{connection.accountName || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Connected</span>
                                <span className="font-medium text-gray-800">{formatDate(connection.connectedAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Last Sync</span>
                                <span className="font-medium text-gray-800">{formatLastSync(connection.lastSyncAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Transactions</span>
                                <span className="font-bold text-portal-club">{connection.transactionsSynced.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {connection.lastError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-red-700">{connection.lastError}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button 
                                variant="secondary" 
                                fullWidth
                                className="text-xs"
                                onClick={() => onViewSyncLog(processor)}
                            >
                                View Sync Log
                            </Button>
                            <button
                                onClick={() => onDisconnect(processor)}
                                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors w-full"
                            >
                                Disconnect
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Benefits */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-green-500">✓</span>
                                <span>Automatic payment sync</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-green-500">✓</span>
                                <span>Real-time analytics</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-green-500">✓</span>
                                <span>Read-only access (secure)</span>
                            </div>
                        </div>

                        {/* Connect Button */}
                        <Button 
                            fullWidth 
                            onClick={() => onConnect(processor)}
                            className={config.processor === 'stripe' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                        >
                            Connect {config.name}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProcessorCard;
