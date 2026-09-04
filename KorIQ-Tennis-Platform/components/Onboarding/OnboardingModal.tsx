import React from 'react';
import { User } from '../../types';
import { PlayerOnboarding } from './PlayerOnboarding.tsx';
import { CoachOnboarding } from './CoachOnboarding.tsx';
import { ClubOnboarding } from './ClubOnboarding.tsx';
import { StudentOnboarding } from './StudentOnboarding.tsx';

interface OnboardingModalProps {
    isOpen: boolean;
    user: User;
    onComplete: () => void;
    onSkip: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
    isOpen, 
    user, 
    onComplete, 
    onSkip 
}) => {
    if (!isOpen) return null;

    const renderOnboarding = () => {
        switch (user.role) {
            case 'PLAYER':
                return (
                    <PlayerOnboarding 
                        entityId={user.linkedEntityId} 
                        onComplete={onComplete} 
                        onSkip={onSkip} 
                    />
                );
            case 'COACH':
                return (
                    <CoachOnboarding 
                        entityId={user.linkedEntityId} 
                        onComplete={onComplete} 
                        onSkip={onSkip} 
                    />
                );
            case 'CLUB':
                return (
                    <ClubOnboarding 
                        entityId={user.linkedEntityId} 
                        onComplete={onComplete} 
                        onSkip={onSkip} 
                    />
                );
            case 'STUDENT':
                return (
                    <StudentOnboarding 
                        entityId={user.linkedEntityId} 
                        onComplete={onComplete} 
                        onSkip={onSkip} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                {renderOnboarding()}
            </div>
        </div>
    );
};
