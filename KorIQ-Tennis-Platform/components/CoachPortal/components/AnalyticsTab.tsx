import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsTabProps {
  coachId: string;
}

// Mock data
const PROFILE_VIEWS_DATA = [
  { date: 'Mon', views: 12 },
  { date: 'Tue', views: 19 },
  { date: 'Wed', views: 15 },
  { date: 'Thu', views: 25 },
  { date: 'Fri', views: 22 },
  { date: 'Sat', views: 30 },
  { date: 'Sun', views: 18 },
];

const TUTORIAL_DATA = [
  { name: 'Topspin Forehand', views: 234, purchases: 12, revenue: 140.40 },
  { name: 'Serve Consistency', views: 189, purchases: 8, revenue: 71.92 },
  { name: 'Volley Basics', views: 156, purchases: 5, revenue: 44.95 },
  { name: 'Footwork Fundamentals', views: 98, purchases: 3, revenue: 26.97 },
];

const RATING_TREND = [
  { month: 'Sep', rating: 4.5 },
  { month: 'Oct', rating: 4.6 },
  { month: 'Nov', rating: 4.7 },
  { month: 'Dec', rating: 4.6 },
  { month: 'Jan', rating: 4.8 },
];

const TRAFFIC_SOURCES = [
  { name: 'Community Search', value: 45, color: '#22C55E' },
  { name: 'Ball Park', value: 28, color: '#3B82F6' },
  { name: 'Courtside', value: 17, color: '#8B5CF6' },
  { name: 'Direct Link', value: 10, color: '#F97316' },
];

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ coachId }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const stats = {
    profileViews: 127,
    profileViewsChange: 23,
    tutorialViews: 89,
    tutorialViewsChange: 15,
    bookingRequests: 12,
    bookingRequestsChange: 8,
    revenue: 247.50,
    revenueChange: 12,
  };

  const bookingStats = {
    total: 12,
    approved: 10,
    declined: 2,
    conversionRate: 83,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Track your profile performance and earnings</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-portal-coach text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'Week' : range === 'month' ? 'Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
            </div>
            <div className={`text-sm font-medium ${stats.profileViewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profileViewsChange >= 0 ? '+' : ''}{stats.profileViewsChange}%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tutorial Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tutorialViews}</p>
            </div>
            <div className={`text-sm font-medium ${stats.tutorialViewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.tutorialViewsChange >= 0 ? '+' : ''}{stats.tutorialViewsChange}%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bookingRequests}</p>
            </div>
            <div className={`text-sm font-medium ${stats.bookingRequestsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.bookingRequestsChange >= 0 ? '+' : ''}{stats.bookingRequestsChange}%
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue (Month)</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue}</p>
            </div>
            <div className={`text-sm font-medium ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PROFILE_VIEWS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#22C55E" 
                strokeWidth={2}
                dot={{ fill: '#22C55E', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#22C55E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Rating Trend</h3>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-gray-900">4.8</span>
              <span className="text-gray-500 text-sm">(23 reviews)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={RATING_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis domain={[4, 5]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#EAB308" 
                strokeWidth={2}
                dot={{ fill: '#EAB308', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#EAB308' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tutorial Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tutorial Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tutorial</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Purchases</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {TUTORIAL_DATA.map((tutorial, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{tutorial.name}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">{tutorial.views}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{tutorial.purchases}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">${tutorial.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="py-3 px-4 font-semibold text-gray-900">Total</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  {TUTORIAL_DATA.reduce((sum, t) => sum + t.views, 0)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  {TUTORIAL_DATA.reduce((sum, t) => sum + t.purchases, 0)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">
                  ${TUTORIAL_DATA.reduce((sum, t) => sum + t.revenue, 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Analytics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{bookingStats.approved}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-500">Declined</p>
              <p className="text-2xl font-bold text-red-600">{bookingStats.declined}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{bookingStats.conversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Where Viewers Found You</h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRAFFIC_SOURCES}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                  >
                    {TRAFFIC_SOURCES.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {TRAFFIC_SOURCES.map((source, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-gray-600 flex-1">{source.name}</span>
                  <span className="text-sm font-medium text-gray-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
