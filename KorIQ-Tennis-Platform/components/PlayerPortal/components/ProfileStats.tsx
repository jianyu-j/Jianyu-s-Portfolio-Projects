
import React from 'react';

const mockStats = {
  views: 23,
  viewsChange: 5, // positive = up, negative = down
};

const ProfileStats: React.FC = () => {
  const { views, viewsChange } = mockStats;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      {/* Profile Views Section */}
      <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2 mb-3">
        <span>👁️</span> Profile Views
      </h3>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-gray-900">{views}</span>
        <span className="text-gray-500 text-sm">views this week</span>
      </div>

      <p className={`text-sm font-medium ${viewsChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {viewsChange >= 0 ? '↑' : '↓'} {Math.abs(viewsChange)} more than last week
      </p>
    </div>
  );
};

export default ProfileStats;
