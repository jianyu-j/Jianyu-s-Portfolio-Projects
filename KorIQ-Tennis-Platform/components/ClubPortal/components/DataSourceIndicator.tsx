import React from 'react';
import { ProcessorConnection, PaymentProcessor } from '../../../types';

interface DataSourceIndicatorProps {
    connections: ProcessorConnection[];
    lastUpdated?: string;
    variant?: 'inline' | 'badge';
}

const processorConfig: Record<PaymentProcessor, { name: string; logo: string; color: string }> = {
    stripe: { name: 'Stripe', logo: 'S', color: 'text-indigo-600' },
    square: { name: 'Square', logo: 'Sq', color: 'text-gray-800' },
    paypal: { name: 'PayPal', logo: 'PP', color: 'text-blue-600' }
};

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
    connections,
    lastUpdated,
    variant = 'inline'
}) => {
    const activeConnections = connections.filter(c => c.status === 'connected');
    
    const formatLastUpdated = () => {
        if (!lastUpdated) return null;
        
        const date = new Date(lastUpdated);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return date.toLocaleDateString();
    };

    if (activeConnections.length === 0) {
        if (variant === 'badge') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Mock Data
                </span>
            );
        }
        return (
            <div className="text-xs text-gray-400">
                Data Source: <span className="font-medium">Demo Data</span>
            </div>
        );
    }

    if (variant === 'badge') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {activeConnections.map(c => processorConfig[c.processor].name).join(' + ')} (Live)
                {lastUpdated && (
                    <span className="text-green-500 ml-1">• {formatLastUpdated()}</span>
                )}
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Data Source:</span>
            <div className="flex items-center gap-1">
                {activeConnections.map((conn, i) => (
                    <React.Fragment key={conn.processor}>
                        {i > 0 && <span className="text-gray-300">+</span>}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 rounded font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {processorConfig[conn.processor].name}
                        </span>
                    </React.Fragment>
                ))}
                <span className="text-green-600 font-medium">(Live)</span>
            </div>
            {lastUpdated && (
                <>
                    <span className="text-gray-300">•</span>
                    <span>Updated {formatLastUpdated()}</span>
                </>
            )}
        </div>
    );
};

export default DataSourceIndicator;
