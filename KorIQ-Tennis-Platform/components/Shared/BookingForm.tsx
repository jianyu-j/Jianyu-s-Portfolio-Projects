import React, { useState } from 'react';
import { LessonType, TimePreference, LessonDuration, NtrpLevel } from '../../types';

interface BookingFormProps {
  coachId: string;
  coachName: string;
  coachRate?: number;
  playerNtrp: NtrpLevel;
  onSubmit: (booking: BookingFormData) => void;
  onClose: () => void;
}

export interface BookingFormData {
  lessonType: LessonType;
  preferredDate: string;
  preferredTime: TimePreference;
  duration: LessonDuration;
  locationPreference: string;
  message: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  coachId,
  coachName,
  coachRate,
  playerNtrp,
  onSubmit,
  onClose,
}) => {
  const [form, setForm] = useState<BookingFormData>({
    lessonType: 'Private',
    preferredDate: '',
    preferredTime: 'Morning',
    duration: '1 hour',
    locationPreference: '',
    message: '',
  });

  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const getDurationPrice = () => {
    if (!coachRate) return null;
    const multipliers: Record<LessonDuration, number> = {
      '30 min': 0.5,
      '1 hour': 1,
      '1.5 hours': 1.5,
      '2 hours': 2,
    };
    return (coachRate * multipliers[form.duration]).toFixed(0);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book a Lesson</h2>
              <p className="text-sm text-gray-500 mt-1">with {coachName}</p>
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

          {/* Progress Steps */}
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Step 1: Lesson Type & Date */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Lesson Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Private', 'Group', 'Evaluation'] as LessonType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, lessonType: type }))}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          form.lessonType === type
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {type === 'Private' && '👤'}
                          {type === 'Group' && '👥'}
                          {type === 'Evaluation' && '📋'}
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{type}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={form.preferredDate}
                    onChange={e => setForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Time *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Morning', 'Afternoon', 'Evening'] as TimePreference[]).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, preferredTime: time }))}
                        className={`py-3 px-4 rounded-xl border-2 text-center transition-all ${
                          form.preferredTime === time
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-gray-900 text-sm">{time}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {time === 'Morning' && '6am-12pm'}
                          {time === 'Afternoon' && '12pm-5pm'}
                          {time === 'Evening' && '5pm-9pm'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Duration & Location */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Duration *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['30 min', '1 hour', '1.5 hours', '2 hours'] as LessonDuration[]).map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, duration }))}
                        className={`py-4 px-4 rounded-xl border-2 text-center transition-all ${
                          form.duration === duration
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{duration}</p>
                        {coachRate && (
                          <p className="text-sm text-gray-500 mt-1">
                            ~${(coachRate * (duration === '30 min' ? 0.5 : duration === '1 hour' ? 1 : duration === '1.5 hours' ? 1.5 : 2)).toFixed(0)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Preference</label>
                  <input
                    type="text"
                    value={form.locationPreference}
                    onChange={e => setForm(prev => ({ ...prev, locationPreference: e.target.value }))}
                    placeholder="e.g., Stanley Park Courts, or leave blank for coach to suggest"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - the coach may suggest a location</p>
                </div>

                {/* Your NTRP */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your NTRP Level</span>
                    <span className="font-semibold text-gray-900">{playerNtrp}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This helps the coach prepare for your lesson</p>
                </div>
              </>
            )}

            {/* Step 3: Message & Review */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message to Coach</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell the coach what you'd like to work on..."
                    maxLength={300}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{form.message.length}/300</p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Coach</span>
                    <span className="text-gray-900 font-medium">{coachName}</span>
                    <span className="text-gray-500">Lesson Type</span>
                    <span className="text-gray-900 font-medium">{form.lessonType}</span>
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900 font-medium">
                      {form.preferredDate ? new Date(form.preferredDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '-'}
                    </span>
                    <span className="text-gray-500">Time</span>
                    <span className="text-gray-900 font-medium">{form.preferredTime}</span>
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-900 font-medium">{form.duration}</span>
                    {coachRate && (
                      <>
                        <span className="text-gray-500">Est. Price</span>
                        <span className="text-gray-900 font-medium">${getDurationPrice()}</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  The coach will review your request and respond within 24-48 hours
                </p>
              </>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3">
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
                disabled={step === 1 && !form.preferredDate}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Send Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
