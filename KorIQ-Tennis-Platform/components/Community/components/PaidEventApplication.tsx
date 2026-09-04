import React, { useState } from 'react';
import { EventCategory, NtrpLevel } from '../../../types';

interface PaidEventApplicationProps {
  eventCategory: EventCategory;
  onSubmit: (application: PaidEventApplicationData) => void;
  onClose: () => void;
}

export interface PaidEventApplicationData {
  title: string;
  date: string;
  time: string;
  location: string;
  expectedGroupSize: string;
  category: EventCategory;
  theme: string;
  ticketPrice: number;
  minimumAttendees: number;
  description: string;
  hostBio: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
  ntrpMin?: string;
  ntrpMax?: string;
}

const PaidEventApplication: React.FC<PaidEventApplicationProps> = ({
  eventCategory,
  onSubmit,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [acknowledged, setAcknowledged] = useState(false);
  const [form, setForm] = useState<PaidEventApplicationData>({
    title: '',
    date: '',
    time: '',
    location: '',
    expectedGroupSize: '10-20',
    category: eventCategory,
    theme: '',
    ticketPrice: 15,
    minimumAttendees: 5,
    description: '',
    hostBio: '',
    ageRangeMin: undefined,
    ageRangeMax: undefined,
    ntrpMin: '',
    ntrpMax: '',
  });

  const koriqFee = form.ticketPrice * 0.05;
  const hostEarnings = form.ticketPrice - koriqFee;

  const handleSubmit = () => {
    if (!acknowledged) {
      alert('Please acknowledge that you cannot cancel the event once it goes live.');
      return;
    }
    onSubmit(form);
  };

  const getMinDate = () => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return twoWeeksFromNow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apply to Host Paid Event</h2>
              <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-black' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Introduction & Rules */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">Before You Apply</h3>
                    <p className="text-yellow-700 text-sm">Please understand these important rules:</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                    %
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">5% Platform Fee</p>
                    <p className="text-sm text-gray-500">KorIQ takes 5% of ticket sales to cover payment processing and platform costs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Payment 48 Hours Before</p>
                    <p className="text-sm text-gray-500">You'll receive your earnings 48 hours before the event via bank transfer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">You CANNOT Cancel</p>
                    <p className="text-sm text-red-600">Once your event is live, you cannot manually cancel it. The event only auto-cancels if minimum attendees aren't met.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Minimum Required</p>
                    <p className="text-sm text-gray-500">If minimum attendees aren't reached 72 hours before, the event auto-cancels and everyone is refunded.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Valentine's Singles Mixer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue/Location *</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Stanley Park Tennis Club"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Group Size *</label>
                <select
                  value={form.expectedGroupSize}
                  onChange={e => setForm(prev => ({ ...prev, expectedGroupSize: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="10-20">10-20 people</option>
                  <option value="20-30">20-30 people</option>
                  <option value="30-40">30-40 people</option>
                  <option value="custom">Custom (specify in description)</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Theme/Reason *</label>
                <input
                  type="text"
                  required
                  value={form.theme}
                  onChange={e => setForm(prev => ({ ...prev, theme: e.target.value }))}
                  placeholder="Singles mixer, Tournament prep, Social tennis night..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Price & Minimum */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price ($) *</label>
                  <input
                    type="number"
                    required
                    min={5}
                    step={1}
                    value={form.ticketPrice}
                    onChange={e => setForm(prev => ({ ...prev, ticketPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You receive: ${hostEarnings.toFixed(2)} (after 5% fee)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Attendees *</label>
                  <input
                    type="number"
                    required
                    min={2}
                    value={form.minimumAttendees}
                    onChange={e => setForm(prev => ({ ...prev, minimumAttendees: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Event cancels if not reached</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  maxLength={1000}
                  rows={4}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of your event..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              {/* Host Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Host Bio/Experience *</label>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  value={form.hostBio}
                  onChange={e => setForm(prev => ({ ...prev, hostBio: e.target.value }))}
                  placeholder="Why are you qualified to host this event? What's your background?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Warning */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-gray-900 mb-4">Event Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-gray-500">Event</span>
                  <span className="text-gray-900 font-medium">{form.title || '-'}</span>
                  <span className="text-gray-500">Date & Time</span>
                  <span className="text-gray-900 font-medium">{form.date ? new Date(form.date).toLocaleDateString() : '-'} at {form.time || '-'}</span>
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900 font-medium">{form.location || '-'}</span>
                  <span className="text-gray-500">Group Size</span>
                  <span className="text-gray-900 font-medium">{form.expectedGroupSize}</span>
                  <span className="text-gray-500">Ticket Price</span>
                  <span className="text-gray-900 font-medium">${form.ticketPrice}</span>
                  <span className="text-gray-500">Your Earnings</span>
                  <span className="text-gray-900 font-medium">${hostEarnings.toFixed(2)} per ticket</span>
                  <span className="text-gray-500">Min. Attendees</span>
                  <span className="text-gray-900 font-medium">{form.minimumAttendees}</span>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="font-bold text-red-800">IMPORTANT: READ BEFORE CONTINUING</h4>
                </div>
                <div className="text-sm text-red-700 space-y-2">
                  <p>Once your event is approved and goes live:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>You <strong>CANNOT cancel</strong> this event manually</li>
                    <li>The event will only cancel automatically if the minimum attendee count ({form.minimumAttendees}) is not reached 72 hours before</li>
                    <li>You are <strong>committing to host</strong> this event if enough people sign up</li>
                    <li>Make sure you have <strong>secured your venue</strong> before submitting</li>
                  </ul>
                </div>
              </div>

              {/* Acknowledgment */}
              <label className="flex items-start gap-3 p-4 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  <strong>I understand that I cannot cancel this event once it goes live.</strong> I am committing to host this event if the minimum attendees sign up.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 ? false : !form.title || !form.date || !form.ticketPrice}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 1 ? 'I Understand, Continue' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!acknowledged}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaidEventApplication;
