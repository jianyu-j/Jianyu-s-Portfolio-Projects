/**
 * Autosave Indicator Component
 * Shows visual feedback for autosave status
 */

import React from 'react';
import { AutosaveStatus } from '../../services/autosaveService';
import { useAutosaveStatus } from '../../hooks/useAutosave';

interface AutosaveIndicatorProps {
  status?: AutosaveStatus;
  showAlways?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

// Single status indicator
export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({ 
  status, 
  showAlways = false,
  className = '',
  size = 'sm'
}) => {
  // Don't show if idle and not forced
  if (!showAlways && status === 'idle') return null;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-3 py-1';

  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          text: 'Unsaved changes...',
          classes: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        };
      case 'saving':
        return {
          icon: '💾',
          text: 'Saving...',
          classes: 'bg-blue-50 text-blue-600 border-blue-200',
        };
      case 'saved':
        return {
          icon: '✓',
          text: 'Saved',
          classes: 'bg-green-50 text-green-600 border-green-200',
        };
      case 'error':
        return {
          icon: '⚠️',
          text: 'Save failed',
          classes: 'bg-red-50 text-red-600 border-red-200',
        };
      default:
        return {
          icon: '○',
          text: 'Ready',
          classes: 'bg-gray-50 text-gray-400 border-gray-200',
        };
    }
  };

  const { icon, text, classes } = getStatusDisplay();

  return (
    <div 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        transition-all duration-300 animate-fadeIn
        ${sizeClasses} ${classes} ${className}
      `}
    >
      <span className={status === 'saving' ? 'animate-pulse' : ''}>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

// Global status indicator (shows overall save status)
export const GlobalAutosaveIndicator: React.FC<{
  position?: 'top-right' | 'bottom-right' | 'inline';
  className?: string;
}> = ({ position = 'inline', className = '' }) => {
  const { isSaving, hasError, allSaved, statuses } = useAutosaveStatus();

  // Don't show if nothing has been registered
  if (Object.keys(statuses).length === 0) return null;

  const getGlobalStatus = (): AutosaveStatus => {
    if (hasError) return 'error';
    if (isSaving) return 'saving';
    if (allSaved) return 'saved';
    return 'idle';
  };

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'inline': '',
  };

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      <AutosaveIndicator status={getGlobalStatus()} showAlways={isSaving || hasError} />
    </div>
  );
};

// Compact dot indicator (minimal UI)
export const AutosaveDot: React.FC<{ status?: AutosaveStatus }> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'saving':
        return 'bg-blue-400 animate-pulse';
      case 'saved':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <span 
      className={`inline-block w-2 h-2 rounded-full ${getColor()} transition-colors duration-300`}
      title={status || 'idle'}
    />
  );
};

// Toast notification for save events
export const AutosaveToast: React.FC<{
  status: AutosaveStatus;
  message?: string;
  onClose?: () => void;
}> = ({ status, message, onClose }) => {
  if (status === 'idle') return null;

  const getToastStyle = () => {
    switch (status) {
      case 'saved':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'saving':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const defaultMessages: Record<AutosaveStatus, string> = {
    pending: 'Changes pending...',
    saving: 'Saving changes...',
    saved: 'Changes saved!',
    error: 'Failed to save',
    idle: '',
  };

  return (
    <div className={`
      fixed bottom-4 right-4 z-50
      px-4 py-3 rounded-lg shadow-lg
      flex items-center gap-3
      animate-slideUp
      ${getToastStyle()}
    `}>
      <span>{message || defaultMessages[status]}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
};

// Styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
  .animate-slideUp { animation: slideUp 0.3s ease-out; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default AutosaveIndicator;
