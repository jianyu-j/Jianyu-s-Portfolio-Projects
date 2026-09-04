import React, { useState } from 'react';
import { CoachType } from '../../types';
import { Button } from '../ui/Button';

interface AddCoachModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; email: string; phone: string; coachType: CoachType }) => void;
}

export const AddCoachModal: React.FC<AddCoachModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    
    // NEW: Success state
    const [isSuccess, setIsSuccess] = useState(false);
    const [addedCoachEmail, setAddedCoachEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (name.length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }

        // Trigger parent save (creates db entry)
        onSave({ name, email, phone, coachType: 'Club' });
        
        // Show success screen instead of closing immediately
        setAddedCoachEmail(email);
        setIsSuccess(true);
    };

    const handleClose = () => {
        // Reset and close
        setIsSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        onClose();
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
                <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slideDown p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        ✓
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Coach Added Successfully</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                        <p className="text-sm text-gray-500 mb-1">Coach profile created for:</p>
                        <p className="font-bold text-gray-800">📧 {addedCoachEmail}</p>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        An invite link has been sent to their email. They can click the link to set up their password and access their account.
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                        ⏳ Status: Waiting for coach to claim
                    </div>

                    <Button fullWidth onClick={handleClose}>Done</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Add New Coach</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tennis-500 outline-none transition-all placeholder-gray-400"
                            placeholder="e.g. John Smith"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                        <input 
                            type="email" 
                            required
                            className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tennis-500 outline-none transition-all placeholder-gray-400"
                            placeholder="coach@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                        <input 
                            type="tel" 
                            className="w-full p-3 bg-white text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tennis-500 outline-none transition-all placeholder-gray-400"
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
                        <Button type="submit" fullWidth>Add Coach</Button>
                    </div>
                </form>
            </div>
             <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};