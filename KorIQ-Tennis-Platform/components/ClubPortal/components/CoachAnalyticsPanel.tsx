import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Student, Coach, RevenueEntry, Session } from '../../../types';
import { calculateCoachAnalytics, CoachAnalytics } from '../../../utils/analyticsHelpers';
import SmartChart from './SmartChart';
import { Button } from '../../ui/Button';

// SVG Icons
const StarIcon = ({ className = "w-5 h-5", filled = false }: { className?: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
  </svg>
);

// ============================================
// TYPES
// ============================================
interface CoachWithAnalytics extends Coach {
  analytics: CoachAnalytics;
}

interface CoachAnalyticsPanelProps {
  coaches: Coach[];
  students: Student[];
  revenue: RevenueEntry[];
  sessions: Session[];
  onViewCoach?: (coach: Coach) => void;
}

// ============================================
// COMPONENT
// ============================================
const CoachAnalyticsPanel: React.FC<CoachAnalyticsPanelProps> = ({
  coaches,
  students,
  revenue,
  sessions,
  onViewCoach
}) => {
  const [compareCoach1, setCompareCoach1] = useState<string>('');
  const [compareCoach2, setCompareCoach2] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [sortBy, setSortBy] = useState<'revenue' | 'retention' | 'rating' | 'students'>('revenue');

  // Calculate analytics for all coaches
  const coachesWithAnalytics: CoachWithAnalytics[] = useMemo(() => {
    const avgRetention = 65; // Club average
    return coaches.map(coach => ({
      ...coach,
      analytics: calculateCoachAnalytics(coach, students, revenue, sessions, avgRetention)
    }));
  }, [coaches, students, revenue, sessions]);

  // Sort coaches for profitability table
  const sortedCoaches = useMemo(() => {
    return [...coachesWithAnalytics].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.analytics.totalRevenue - a.analytics.totalRevenue;
        case 'retention':
          return b.analytics.retentionRate - a.analytics.retentionRate;
        case 'rating':
          return b.analytics.avgRating - a.analytics.avgRating;
        case 'students':
          return b.analytics.totalStudents - a.analytics.totalStudents;
        default:
          return 0;
      }
    });
  }, [coachesWithAnalytics, sortBy]);

  // Performance trend data (mock - last 6 months)
  const performanceTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const data: any = { month };
      coachesWithAnalytics.slice(0, 4).forEach(coach => {
        // Mock rating data with slight variations
        const baseRating = coach.analytics.avgRating;
        const variation = (Math.random() - 0.5) * 0.4;
        data[coach.name] = Math.max(3.5, Math.min(5, baseRating + variation)).toFixed(1);
      });
      return data;
    });
  }, [coachesWithAnalytics]);

  // Get comparison coaches
  const coach1 = coachesWithAnalytics.find(c => c.id === compareCoach1);
  const coach2 = coachesWithAnalytics.find(c => c.id === compareCoach2);

  // Radar chart data for comparison
  const comparisonRadarData = useMemo(() => {
    if (!coach1 || !coach2) return [];
    
    const normalize = (value: number, max: number) => Math.round((value / max) * 100);
    
    return [
      { 
        metric: 'Students', 
        [coach1.name]: normalize(coach1.analytics.totalStudents, 20),
        [coach2.name]: normalize(coach2.analytics.totalStudents, 20)
      },
      { 
        metric: 'Revenue', 
        [coach1.name]: normalize(coach1.analytics.totalRevenue, 50000),
        [coach2.name]: normalize(coach2.analytics.totalRevenue, 50000)
      },
      { 
        metric: 'Retention', 
        [coach1.name]: coach1.analytics.retentionRate,
        [coach2.name]: coach2.analytics.retentionRate
      },
      { 
        metric: 'Rating', 
        [coach1.name]: normalize(coach1.analytics.avgRating, 5) ,
        [coach2.name]: normalize(coach2.analytics.avgRating, 5)
      },
      { 
        metric: 'Level-Ups', 
        [coach1.name]: normalize(coach1.analytics.studentsLeveledUp, 10),
        [coach2.name]: normalize(coach2.analytics.studentsLeveledUp, 10)
      }
    ];
  }, [coach1, coach2]);

  const COLORS = ['#2e7d32', '#f59e0b', '#2563eb', '#9333ea', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Coaches</p>
          <p className="text-2xl font-bold text-gray-900">{coaches.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
          <p className="text-[10px] text-green-600 uppercase font-bold mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ${coachesWithAnalytics.reduce((sum, c) => sum + c.analytics.totalRevenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
          <p className="text-[10px] text-blue-600 uppercase font-bold mb-1">Avg Retention</p>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(coachesWithAnalytics.reduce((sum, c) => sum + c.analytics.retentionRate, 0) / coaches.length)}%
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
          <p className="text-[10px] text-yellow-600 uppercase font-bold mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-600">
<span className="inline-flex items-center gap-1">{(coachesWithAnalytics.reduce((sum, c) => sum + c.analytics.avgRating, 0) / coaches.length).toFixed(1)} <StarIcon className="w-5 h-5 text-yellow-400" filled /></span>
          </p>
        </div>
      </div>

      {/* Coach Comparison Tool */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span>⚔️</span> Coach Comparison
          </h3>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <select
              value={compareCoach1}
              onChange={(e) => setCompareCoach1(e.target.value)}
              className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-tennis-500"
            >
              <option value="">Select Coach 1</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === compareCoach2}>{c.name}</option>
              ))}
            </select>
            <span className="text-gray-400 font-bold">VS</span>
            <select
              value={compareCoach2}
              onChange={(e) => setCompareCoach2(e.target.value)}
              className="flex-1 min-w-[150px] border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-tennis-500"
            >
              <option value="">Select Coach 2</option>
              {coaches.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === compareCoach1}>{c.name}</option>
              ))}
            </select>
            <Button 
              onClick={() => setShowComparison(true)}
              disabled={!compareCoach1 || !compareCoach2}
              className={!compareCoach1 || !compareCoach2 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Compare
            </Button>
          </div>

          {/* Comparison Results */}
          {showComparison && coach1 && coach2 && (
            <div className="mt-6 space-y-6">
              {/* Radar Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={comparisonRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name={coach1.name} dataKey={coach1.name} stroke="#2e7d32" fill="#2e7d32" fillOpacity={0.3} />
                      <Radar name={coach2.name} dataKey={coach2.name} stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Side by Side Stats */}
                <div className="space-y-3">
                  {[
                    { label: 'Students', v1: coach1.analytics.totalStudents, v2: coach2.analytics.totalStudents, format: (v: number) => v },
                    { label: 'Revenue', v1: coach1.analytics.totalRevenue, v2: coach2.analytics.totalRevenue, format: (v: number) => `$${v.toLocaleString()}` },
                    { label: 'Revenue/Hour', v1: coach1.analytics.revenuePerHour, v2: coach2.analytics.revenuePerHour, format: (v: number) => `$${v}` },
                    { label: 'Retention Rate', v1: coach1.analytics.retentionRate, v2: coach2.analytics.retentionRate, format: (v: number) => `${v}%` },
                    { label: 'Rating', v1: coach1.analytics.avgRating, v2: coach2.analytics.avgRating, format: (v: number) => v.toFixed(1) },
                    { label: 'Students Leveled Up', v1: coach1.analytics.studentsLeveledUp, v2: coach2.analytics.studentsLeveledUp, format: (v: number) => v },
                    { label: 'Avg Student LTV', v1: coach1.analytics.avgStudentLTV, v2: coach2.analytics.avgStudentLTV, format: (v: number) => `$${v}` }
                  ].map(row => {
                    const winner = row.v1 > row.v2 ? 1 : row.v2 > row.v1 ? 2 : 0;
                    return (
                      <div key={row.label} className="flex items-center gap-2 text-sm">
                        <div className={`flex-1 text-right p-2 rounded ${winner === 1 ? 'bg-green-100 font-bold text-green-700' : 'bg-gray-50'}`}>
                          {row.format(row.v1)}
                        </div>
                        <div className="w-24 text-center text-gray-500 text-xs font-medium">
                          {row.label}
                        </div>
                        <div className={`flex-1 text-left p-2 rounded ${winner === 2 ? 'bg-blue-100 font-bold text-blue-700' : 'bg-gray-50'}`}>
                          {row.format(row.v2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insight */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Insight:</strong> {coach1.analytics.retentionRate > coach2.analytics.retentionRate 
                    ? `${coach1.name}'s students stay ${coach1.analytics.retentionRate - coach2.analytics.retentionRate}% longer on average.`
                    : `${coach2.name}'s students stay ${coach2.analytics.retentionRate - coach1.analytics.retentionRate}% longer on average.`}
                  {' '}Consider having them share best practices.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Trend Chart */}
      <SmartChart
        title="Coach Performance Trend"
        showDateRange={true}
        showTrendLine={true}
        insight="Coach performance is tracked bi-weekly. Consistent ratings indicate stable teaching quality."
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {coachesWithAnalytics.slice(0, 4).map((coach, idx) => (
                <Line 
                  key={coach.id}
                  type="monotone" 
                  dataKey={coach.name} 
                  stroke={COLORS[idx]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SmartChart>

      {/* Coach Profitability Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><CurrencyIcon className="w-5 h-5 text-green-600" /> Coach Profitability</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value="revenue">Revenue</option>
              <option value="retention">Retention</option>
              <option value="rating">Rating</option>
              <option value="students">Students</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-bold text-gray-600">Coach</th>
                <th className="p-3 text-right font-bold text-gray-600">Revenue</th>
                <th className="p-3 text-right font-bold text-gray-600">Rev/Hour</th>
                <th className="p-3 text-right font-bold text-gray-600">Students</th>
                <th className="p-3 text-right font-bold text-gray-600">Retention</th>
                <th className="p-3 text-right font-bold text-gray-600">Rating</th>
                <th className="p-3 text-center font-bold text-gray-600">Trend</th>
                <th className="p-3 text-right font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedCoaches.map((coach, idx) => {
                // Mock cost and profit
                const cost = Math.round(coach.analytics.totalRevenue * 0.4);
                const profit = coach.analytics.totalRevenue - cost;
                const margin = coach.analytics.totalRevenue > 0 
                  ? Math.round((profit / coach.analytics.totalRevenue) * 100) 
                  : 0;
                
                return (
                  <tr key={coach.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold`} style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{coach.name}</p>
                          <p className="text-xs text-gray-400">{coach.coachType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-green-600">
                      ${coach.analytics.totalRevenue.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      ${coach.analytics.revenuePerHour}/hr
                    </td>
                    <td className="p-3 text-right text-gray-600">
                      {coach.analytics.totalStudents}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${coach.analytics.retentionRate >= 70 ? 'text-green-600' : coach.analytics.retentionRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {coach.analytics.retentionRate}%
                      </span>
                      {coach.analytics.retentionImpact !== 0 && (
                        <span className={`text-xs ml-1 ${coach.analytics.retentionImpact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ({coach.analytics.retentionImpact > 0 ? '+' : ''}{coach.analytics.retentionImpact}%)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-bold text-yellow-600 inline-flex items-center gap-1">{coach.analytics.avgRating.toFixed(1)} <StarIcon className="w-4 h-4 text-yellow-400" filled /></span>
                    </td>
                    <td className="p-3 text-center">
                      {/* Mock trend */}
                      {idx % 3 === 0 ? (
                        <TrendingUpIcon className="w-4 h-4 text-green-500 inline" />
                      ) : idx % 3 === 1 ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <TrendingDownIcon className="w-4 h-4 text-red-500 inline" />
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="secondary" 
                        className="text-xs"
                        onClick={() => onViewCoach?.(coach)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workload Balance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Workload Balance</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coachesWithAnalytics.map(c => ({
              name: c.name,
              sessions: c.analytics.sessionsCount,
              students: c.analytics.totalStudents
            }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" name="Sessions" fill="#2e7d32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="students" name="Students" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Insight:</strong> Even workload distribution helps prevent burnout and ensures consistent quality.
            {sortedCoaches[0]?.analytics.sessionsCount > sortedCoaches[sortedCoaches.length - 1]?.analytics.sessionsCount * 2 && 
              ` Consider redistributing some sessions from ${sortedCoaches[0]?.name}.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachAnalyticsPanel;
