import React, { useState } from 'react';
import { CommunityEvent, EventType, EventCategory, NtrpLevel } from '../../../types';

interface EventFormProps {
  eventCategory: EventCategory;
  hostId: string;
  hostName: string;
  hostType: 'Player' | 'Coach' | 'Club';
  onSubmit: (event: Partial<CommunityEvent>) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventCategory,
  hostId,
  hostName,
  hostType,
  onSubmit,
  onClose,
}) => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    groupSize: '5-10',
    reason: 'Social',
    ageRangeMin: '',
    ageRangeMax: '',
    ntrpMin: '',
    ntrpMax: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Partial<CommunityEvent> = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      hostId,
      hostName,
      hostType,
      eventType: 'Free',
      category: eventCategory,
      maxAttendees: getMaxAttendees(form.groupSize),
      currentAttendees: 0,
      attendeeIds: [],
      waitlistIds: [],
      ageRangeMin: form.ageRangeMin ? parseInt(form.ageRangeMin) : undefined,
      ageRangeMax: form.ageRangeMax ? parseInt(form.ageRangeMax) : undefined,
      ntrpMin: form.ntrpMin as NtrpLevel | undefined,
      ntrpMax: form.ntrpMax as NtrpLevel | undefined,
      isApproved: true, // Free events are auto-approved
      createdAt: new Date().toISOString(),
    };

    onSubmit(newEvent);
  };

  const getMaxAttendees = (size: string): number => {
    switch (size) {
      case '2-4': return 4;
      case '5-10': return 10;
      case '10-20': return 20;
      case '20+': return 50;
      case 'unlimited': return 999;
      default: return 10;
    }
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
        <div className="p-6 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Create Free Event</h2>
              <p className="text-white/80 text-sm mt-1">
                Match Up Event
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Saturday Morning Social Hit"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Stanley Park Courts, Vancouver"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group Size *</label>
            <div className="grid grid-cols-5 gap-2">
              {['2-4', '5-10', '10-20', '20+', 'unlimited'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, groupSize: size }))}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    form.groupSize === size
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size === 'unlimited' ? '∞' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Event Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Reason *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Train', 'Social', 'Meet New People'].map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, reason }))}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    form.reason === reason
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* NTRP Range (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NTRP Range (Optional)</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={form.ntrpMin}
                onChange={e => setForm(prev => ({ ...prev, ntrpMin: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Any Min</option>
                {Object.values(NtrpLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <select
                value={form.ntrpMax}
                onChange={e => setForm(prev => ({ ...prev, ntrpMax: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Any Max</option>
                {Object.values(NtrpLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              maxLength={500}
              rows={4}
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell people what to expect at your event..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length}/500</p>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-3 text-white rounded-xl font-semibold transition-colors bg-black hover:bg-gray-800"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
