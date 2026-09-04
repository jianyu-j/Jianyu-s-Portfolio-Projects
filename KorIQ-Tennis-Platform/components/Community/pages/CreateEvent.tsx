import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateEventProps {
  onLoginRequired: (action: string) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ onLoginRequired }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    groupSize: '1v1',
    reason: 'social',
    ntrpLevel: '',
    ageRange: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginRequired('create an event');
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Free Event</h1>
          <p className="text-gray-500 mb-8">Organize a tennis meetup for the community</p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Sunday Morning Doubles"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData(f => ({ ...f, time: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(f => ({ ...f, location: e.target.value }))}
                placeholder="Stanley Park Tennis Courts"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
              />
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Size *
              </label>
              <select
                value={formData.groupSize}
                onChange={(e) => setFormData(f => ({ ...f, groupSize: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
              >
                <option value="1v1">1-on-1</option>
                <option value="doubles">Doubles (4 players)</option>
                <option value="10-20">10-20 players</option>
                <option value="20-30">20-30 players</option>
                <option value="30-40">30-40 players</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason / Purpose *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Train', 'Social', 'Meet someone new'].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, reason: reason.toLowerCase() }))}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      formData.reason === reason.toLowerCase()
                        ? 'bg-tennis-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* NTRP Level (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NTRP Level Range (Optional)
              </label>
              <input
                type="text"
                value={formData.ntrpLevel}
                onChange={(e) => setFormData(f => ({ ...f, ntrpLevel: e.target.value }))}
                placeholder="e.g., 3.5-4.0"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
              />
            </div>

            {/* Age Range (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range (Optional)
              </label>
              <input
                type="text"
                value={formData.ageRange}
                onChange={(e) => setFormData(f => ({ ...f, ageRange: e.target.value }))}
                placeholder="e.g., 25-40"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                placeholder="Tell people what to expect at your event..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500/20 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-tennis-600 hover:bg-tennis-500 text-white font-bold rounded-xl transition-colors"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
