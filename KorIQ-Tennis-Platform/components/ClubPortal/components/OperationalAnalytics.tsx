import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ComposedChart, Area } from 'recharts';
import { Student, Coach, Session, RevenueEntry, ExpenseEntry } from '../../../types';
import { calculateOperationalMetrics, OperationalMetrics } from '../../../utils/analyticsHelpers';
import SmartChart from './SmartChart';

// SVG Icons
const FireIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
);

const TrendingDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const LightningBoltIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

interface OperationalAnalyticsProps {
  students: Student[];
  coaches: Coach[];
  sessions: Session[];
  revenue: RevenueEntry[];
  expenses: ExpenseEntry[];
}

const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({
  students,
  coaches,
  sessions,
  revenue,
  expenses
}) => {
  // Calculate operational metrics
  const metrics = useMemo(() => 
    calculateOperationalMetrics(students, coaches, sessions, revenue),
    [students, coaches, sessions, revenue]
  );

  // Find the level with highest drop-off
  const worstRetentionLevel = useMemo(() => {
    const sorted = [...metrics.retentionByLevel].sort((a, b) => a.rate - b.rate);
    return sorted[0];
  }, [metrics.retentionByLevel]);

  // Find the best performing coach for retention
  const bestRetentionCoach = useMemo(() => {
    const sorted = [...metrics.retentionByCoach].sort((a, b) => b.rate - a.rate);
    return sorted[0];
  }, [metrics.retentionByCoach]);

  return (
    <div className="space-y-6">
      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Capacity Utilization</p>
          <p className="text-2xl font-bold text-blue-600">{metrics.capacityUtilization}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${metrics.capacityUtilization >= 80 ? 'bg-green-500' : metrics.capacityUtilization >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${metrics.capacityUtilization}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Peak Revenue</p>
          <p className="text-2xl font-bold text-green-600">${(metrics.peakRevenue / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-gray-400">65% of total</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Off-Peak Revenue</p>
          <p className="text-2xl font-bold text-orange-600">${(metrics.offPeakRevenue / 1000).toFixed(1)}k</p>
          <p className="text-[10px] text-gray-400">35% of total</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Optimal Class Size</p>
          <p className="text-2xl font-bold text-purple-600">{metrics.optimalClassSize}</p>
          <p className="text-[10px] text-gray-400">Best revenue + satisfaction</p>
        </div>
        
        <div className={`p-4 rounded-xl shadow-sm border ${metrics.noShowRate > 15 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">No-Show Rate</p>
          <p className={`text-2xl font-bold ${metrics.noShowRate > 15 ? 'text-red-600' : 'text-gray-600'}`}>{metrics.noShowRate}%</p>
          <p className="text-[10px] text-gray-400">
            ~${Math.round(metrics.noShowRate * revenue.reduce((s, r) => s + r.amount, 0) / 100 / 12).toLocaleString()}/mo lost
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Waitlist Conversion</p>
          <p className="text-2xl font-bold text-green-600">{metrics.waitlistConversion}%</p>
          <p className="text-[10px] text-gray-400">Waitlist → Enrolled</p>
        </div>
      </div>

      {/* Session Volume Chart */}
      <SmartChart
        title="Session Volume by Month"
        showDateRange={true}
        showGroupBy={true}
        insight={`Peak session volume in ${metrics.sessionsPerMonth[metrics.sessionsPerMonth.length - 1]?.month}. Summer camps drive significant volume.`}
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={metrics.sessionsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="group" name="Group Classes" stackId="a" fill="#2e7d32" radius={[0, 0, 0, 0]} />
              <Bar dataKey="private" name="Private Lessons" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
              <Bar dataKey="camp" name="Camps" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="group" name="Group Trend" stroke="#166534" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SmartChart>

      {/* Retention Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retention by Level */}
        <SmartChart
          title="Retention by Student Level"
          showDateRange={false}
          insight={worstRetentionLevel 
            ? `${worstRetentionLevel.level} has highest drop-off (${worstRetentionLevel.rate}%). Investigate intermediate programming.`
            : 'No retention data available.'
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.retentionByLevel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="level" type="category" width={120} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Retention']} />
                <Bar 
                  dataKey="rate" 
                  fill="#2e7d32"
                  radius={[0, 4, 4, 0]}
                >
                  {metrics.retentionByLevel.map((entry, index) => (
                    <rect
                      key={`rect-${index}`}
                      fill={entry.rate >= 70 ? '#2e7d32' : entry.rate >= 50 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmartChart>

        {/* Retention by Coach */}
        <SmartChart
          title="Retention by Coach"
          showDateRange={false}
          insight={bestRetentionCoach 
            ? `${bestRetentionCoach.coach} leads with ${bestRetentionCoach.rate}% retention. Consider having them mentor others.`
            : 'No retention data available.'
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.retentionByCoach}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="coach" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Retention']} />
                <Bar 
                  dataKey="rate" 
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                >
                  {metrics.retentionByCoach.map((entry, index) => (
                    <rect
                      key={`rect-${index}`}
                      fill={entry.rate >= 70 ? '#2e7d32' : entry.rate >= 50 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmartChart>
      </div>

      {/* Peak vs Off-Peak Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">⏰ Peak vs Off-Peak Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Peak Hours */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-green-600" /> Peak Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Weekday Evenings</span>
                <span className="font-bold text-green-600">5pm - 8pm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Saturday Morning</span>
                <span className="font-bold text-green-600">8am - 12pm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Sunday Morning</span>
                <span className="font-bold text-green-600">9am - 11am</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-xs text-green-700">
                <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Tip:</strong> Consider premium pricing for peak slots
              </p>
            </div>
          </div>

          {/* Off-Peak Hours */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
              <TrendingDownIcon className="w-5 h-5 text-orange-600" /> Off-Peak Hours
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Weekday Mornings</span>
                <span className="font-bold text-orange-600">6am - 9am</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Weekday Afternoons</span>
                <span className="font-bold text-orange-600">1pm - 4pm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Sunday Afternoon</span>
                <span className="font-bold text-orange-600">2pm - 5pm</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-orange-200">
              <p className="text-xs text-orange-700">
                <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Tip:</strong> Target retirees & flexible workers
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-blue-600" /> Recommendations
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700">Add "Early Bird" discount for 6-8am slots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700">Partner with local businesses for corporate lunch classes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700">Introduce "Happy Hour Tennis" packages</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overall Retention Trend */}
      <SmartChart
        title="Overall Retention Trend"
        showDateRange={true}
        showTrendLine={true}
        insight="Retention has been stable around 65-70%. Focus on intermediate level to improve overall numbers."
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { month: 'Jan', retention: 62, target: 70 },
              { month: 'Feb', retention: 65, target: 70 },
              { month: 'Mar', retention: 68, target: 70 },
              { month: 'Apr', retention: 64, target: 70 },
              { month: 'May', retention: 67, target: 70 },
              { month: 'Jun', retention: 71, target: 70 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 80]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number) => [`${value}%`, '']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="retention" 
                name="Actual Retention" 
                stroke="#2e7d32" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Target" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SmartChart>

      {/* Why This Beats Spreadsheets */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <LightningBoltIcon className="w-5 h-5 text-yellow-500" /> Why KorIQ Beats Spreadsheets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { feature: 'Link payment to student & coach', spreadsheet: 'Manual lookup', koriq: 'Automatic' },
            { feature: 'Calculate coach profitability', spreadsheet: 'Complex formulas', koriq: 'One click' },
            { feature: 'Predict next month revenue', spreadsheet: 'Very hard', koriq: 'Built-in' },
            { feature: 'See churn risk students', spreadsheet: 'Impossible', koriq: 'Retention alerts' },
            { feature: 'Compare year over year', spreadsheet: 'Manual setup', koriq: 'Instant' },
            { feature: 'Identify growth opportunities', spreadsheet: 'Hours of work', koriq: 'Auto-generated' }
          ].map((row, idx) => (
            <div key={idx} className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-2">{row.feature}</p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-xs text-red-400 font-bold">Excel</p>
                  <p className="text-sm text-white/80">{row.spreadsheet}</p>
                </div>
                <span className="text-white/40">→</span>
                <div className="text-center">
                  <p className="text-xs text-green-400 font-bold">KorIQ</p>
                  <p className="text-sm text-white font-bold">{row.koriq}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationalAnalytics;
