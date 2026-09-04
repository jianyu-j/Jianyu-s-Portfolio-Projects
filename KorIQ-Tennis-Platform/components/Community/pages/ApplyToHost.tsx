import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApplyToHostProps {
  onLoginRequired: (action: string) => void;
}

const ApplyToHost: React.FC<ApplyToHostProps> = ({ onLoginRequired }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    groupSize: '10-20',
    reason: '',
    ticketPrice: '',
    minimumAttendees: '',
    description: '',
    hostBio: '',
  });

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    onLoginRequired('submit your paid event application');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Host a Paid Event</h1>
            <p className="text-gray-500 mb-8">Apply to host a paid tennis event through KorIQ</p>

            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h2 className="font-bold text-orange-900 mb-4">Before You Apply</h2>
                <div className="space-y-4 text-sm text-orange-800">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>KorIQ takes 5% of ticket sales as a platform fee</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>You will be paid 48 hours before the event</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold">Once your event is live, you CANNOT cancel it</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Event only auto-cancels if minimum attendees is not met by registration deadline (72 hours before event)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">1</span>
                    <span>Submit your application with event details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">2</span>
                    <span>KorIQ reviews and contacts you to finalize details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">3</span>
                    <span>Once approved, your event goes live for registration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">4</span>
                    <span>You receive payment 48 hours before the event</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Details</h1>
            <p className="text-gray-500 mb-8">Tell us about your proposed event</p>

            <form className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Valentine's Tennis Social"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData(f => ({ ...f, time: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Location/Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(f => ({ ...f, location: e.target.value }))}
                  placeholder="Stanley Park Tennis Courts"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <p className="mt-1 text-xs text-gray-400">Make sure you have secured or can secure this venue</p>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Group Size *
                </label>
                <select
                  value={formData.groupSize}
                  onChange={(e) => setFormData(f => ({ ...f, groupSize: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="10-20">10-20 players</option>
                  <option value="20-30">20-30 players</option>
                  <option value="30-40">30-40 players</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Theme / Reason *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Social mixer, training clinic, tournament, etc."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Ticket Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData(f => ({ ...f, ticketPrice: e.target.value }))}
                      placeholder="25"
                      className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Attendees *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minimumAttendees}
                    onChange={(e) => setFormData(f => ({ ...f, minimumAttendees: e.target.value }))}
                    placeholder="10"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your event, what's included, what to expect..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>

              {/* Host Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience / Bio *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.hostBio}
                  onChange={(e) => setFormData(f => ({ ...f, hostBio: e.target.value }))}
                  placeholder="Tell us about your experience hosting events or tennis background..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review & Warning */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h1>
            <p className="text-gray-500 mb-8">Please review your application before submitting</p>

            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Event Name</p>
                    <p className="text-gray-900 font-medium">{formData.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date & Time</p>
                    <p className="text-gray-900 font-medium">{formData.date} at {formData.time || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-gray-900 font-medium">{formData.location || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Group Size</p>
                    <p className="text-gray-900 font-medium">{formData.groupSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Ticket Price</p>
                    <p className="text-gray-900 font-medium">${formData.ticketPrice || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Min. Attendees</p>
                    <p className="text-gray-900 font-medium">{formData.minimumAttendees || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h2 className="font-bold text-red-900">IMPORTANT: READ BEFORE CONTINUING</h2>
                </div>
                <div className="space-y-3 text-sm text-red-800 mb-4">
                  <p>Once your event is approved and goes live:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You <strong>CANNOT</strong> cancel this event manually</li>
                    <li>The event will only be cancelled automatically if the minimum attendee count is not reached by the registration deadline (72 hours before event)</li>
                    <li>You are committing to host this event if enough people sign up</li>
                    <li>Make sure you have secured your venue before submitting</li>
                  </ul>
                </div>
                <p className="text-red-800 text-sm font-medium">
                  By continuing, you acknowledge and accept these terms.
                </p>
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-gray-700 text-sm">
                  I understand that I <strong>cannot cancel</strong> this event once it goes live and I am committing to host if enough people register
                </span>
              </label>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreedToTerms}
                  className={`flex-1 py-4 font-bold rounded-xl transition-colors ${
                    agreedToTerms
                      ? 'bg-orange-500 hover:bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyToHost;
