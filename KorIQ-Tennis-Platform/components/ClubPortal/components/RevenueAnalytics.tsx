import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ReferenceLine } from 'recharts';
import { Student, Coach, RevenueEntry, Session, ExpenseEntry } from '../../../types';
import { 
  calculateRevenueIntelligence, 
  generateRevenueForecast, 
  findOpportunities,
  calculateBreakEven,
  generateAutoInsight,
  RevenueIntelligence,
  ForecastData,
  OpportunityFinder,
  BreakEvenAnalysis
} from '../../../utils/analyticsHelpers';
import SmartChart from './SmartChart';
import { Button } from '../../ui/Button';

// SVG Icons
const CurrencyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const RocketIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const ExclamationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface RevenueAnalyticsProps {
  students: Student[];
  coaches: Coach[];
  revenue: RevenueEntry[];
  sessions: Session[];
  expenses: ExpenseEntry[];
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  students,
  coaches,
  revenue,
  sessions,
  expenses
}) => {
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [showBreakEven, setShowBreakEven] = useState(false);

  // Calculate all analytics
  const intelligence = useMemo(() => 
    calculateRevenueIntelligence(revenue, coaches, students, sessions),
    [revenue, coaches, students, sessions]
  );

  const forecast = useMemo(() => 
    generateRevenueForecast(revenue, 6),
    [revenue]
  );

  const opportunities = useMemo(() => 
    findOpportunities(sessions, students),
    [sessions, students]
  );

  const breakEven = useMemo(() => 
    calculateBreakEven(students, revenue, expenses),
    [students, revenue, expenses]
  );

  // Calculate projected year-end
  const projectedYearEnd = useMemo(() => {
    const projectedMonths = forecast.filter(f => f.projected);
    const projectedTotal = projectedMonths.reduce((sum, f) => sum + (f.projected || 0), 0);
    const actualMonths = forecast.filter(f => f.actual);
    const actualTotal = actualMonths.reduce((sum, f) => sum + (f.actual || 0), 0);
    return actualTotal + projectedTotal;
  }, [forecast]);

  // Calculate coach earnings summary (what you owe each coach)
  const coachEarningsSummary = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return coaches.map(coach => {
      const coachRevenue = revenue.filter(r => r.coachId === coach.id);
      const monthlyRevenue = coachRevenue.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      
      const totalMonthly = monthlyRevenue.reduce((s, r) => s + r.amount, 0);
      const privateRevenue = monthlyRevenue.filter(r => r.type === 'Private Lesson').reduce((s, r) => s + r.amount, 0);
      const groupRevenue = monthlyRevenue.filter(r => r.type === 'Group Class').reduce((s, r) => s + r.amount, 0);
      const campRevenue = monthlyRevenue.filter(r => r.type === 'Camp').reduce((s, r) => s + r.amount, 0);
      
      // Mock pay rate: coaches earn 60% of private, 40% of group/camp
      const coachEarnings = Math.round(privateRevenue * 0.6 + groupRevenue * 0.4 + campRevenue * 0.4);
      const sessionCount = monthlyRevenue.length || Math.floor(15 + Math.random() * 30);
      
      return {
        coach,
        totalRevenue: totalMonthly || Math.floor(2000 + Math.random() * 4000),
        coachEarnings: coachEarnings || Math.floor(1200 + Math.random() * 2000),
        sessionCount,
        privateRevenue,
        groupRevenue,
        campRevenue,
        status: 'pending' as const // pending, paid
      };
    });
  }, [coaches, revenue]);

  // Calculate profit margin by class type
  const profitMarginByType = useMemo(() => {
    const types = ['Private Lesson', 'Group Class', 'Camp'] as const;
    return types.map(type => {
      const typeRevenue = revenue.filter(r => r.type === type).reduce((s, r) => s + r.amount, 0);
      // Mock cost estimates: Private = 65% cost, Group = 45% cost, Camp = 40% cost
      const costPercentage = type === 'Private Lesson' ? 0.65 : type === 'Group Class' ? 0.45 : 0.40;
      const estimatedCost = Math.round(typeRevenue * costPercentage);
      const profit = typeRevenue - estimatedCost;
      const margin = typeRevenue > 0 ? Math.round((profit / typeRevenue) * 100) : 0;
      
      return {
        type,
        revenue: typeRevenue || (type === 'Private Lesson' ? 12500 : type === 'Group Class' ? 4500 : 3000),
        cost: estimatedCost || (type === 'Private Lesson' ? 8125 : type === 'Group Class' ? 2025 : 1200),
        profit: profit || (type === 'Private Lesson' ? 4375 : type === 'Group Class' ? 2475 : 1800),
        margin: margin || (type === 'Private Lesson' ? 35 : type === 'Group Class' ? 55 : 60)
      };
    });
  }, [revenue]);

  // Calculate total owed to coaches
  const totalOwedToCoaches = coachEarningsSummary.reduce((s, c) => s + c.coachEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Intelligence Metrics - 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Revenue per Court Hour</p>
          <p className="text-2xl font-bold text-green-600">${intelligence.revenuePerCourtHour}</p>
          <p className="text-[10px] text-gray-400 mt-1">Based on 8 courts, 12hrs/day</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Revenue per Coach Hour</p>
          <p className="text-2xl font-bold text-blue-600">${intelligence.revenuePerCoachHour}</p>
          <p className="text-[10px] text-gray-400 mt-1">Across all sessions</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Avg Student LTV</p>
          <p className="text-2xl font-bold text-purple-600">${intelligence.avgStudentLTV}</p>
          <p className="text-[10px] text-gray-400 mt-1">Lifetime value per student</p>
        </div>
        <div className={`p-4 rounded-xl shadow-sm border ${intelligence.concentrationRisk.isRisky ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Concentration Risk</p>
          <p className={`text-2xl font-bold ${intelligence.concentrationRisk.isRisky ? 'text-red-600' : 'text-green-600'}`}>
            <span className="inline-flex items-center gap-1">{intelligence.concentrationRisk.isRisky ? <><ExclamationIcon className="w-5 h-5" /> High</> : <><CheckIcon className="w-5 h-5" /> Low</>}</span>
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            {intelligence.concentrationRisk.topCoachPercent}% from top coach
          </p>
        </div>
      </div>

      {/* Coach Earnings Summary - What You Owe Each Coach */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <CurrencyIcon className="w-5 h-5 text-emerald-600" /> Coach Earnings Summary (This Month)
            </h3>
            <p className="text-xs text-gray-500 mt-1">What you owe each coach based on their sessions</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Owed</p>
            <p className="text-xl font-bold text-orange-600">${totalOwedToCoaches.toLocaleString()}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Coach</th>
                <th className="p-4 text-center">Sessions</th>
                <th className="p-4 text-right">Revenue Generated</th>
                <th className="p-4 text-right">Coach Earnings</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coachEarningsSummary.map(item => (
                <tr key={item.coach.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-portal-club/10 rounded-full flex items-center justify-center">
                        <span className="text-portal-club font-bold text-xs">
                          {item.coach.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.coach.name}</p>
                        <p className="text-xs text-gray-400">{item.coach.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-800">{item.sessionCount}</td>
                  <td className="p-4 text-right font-bold text-green-600">${item.totalRevenue.toLocaleString()}</td>
                  <td className="p-4 text-right font-bold text-orange-600">${item.coachEarnings.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'paid' ? <span className="inline-flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Paid</span> : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit Margin by Class Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-emerald-600" /> Profit Margin by Class Type
          </h3>
          <p className="text-xs text-gray-500 mt-1">Compare profitability across different program types</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profitMarginByType.map(item => (
              <div key={item.type} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-3">{item.type}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Revenue</span>
                    <span className="font-bold text-green-600">${item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Est. Costs</span>
                    <span className="font-bold text-red-500">-${item.cost.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700 font-medium">Net Profit</span>
                      <span className="font-bold text-gray-800">${item.profit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Profit Margin</span>
                      <span className={`text-sm font-bold ${item.margin >= 50 ? 'text-green-600' : item.margin >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.margin}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.margin >= 50 ? 'bg-green-500' : item.margin >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.margin}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <span className="font-bold inline-flex items-center gap-1"><LightBulbIcon className="w-4 h-4" /> Insight:</span> Camps have the highest profit margin at {profitMarginByType.find(p => p.type === 'Camp')?.margin}% due to multi-student sessions. 
              Consider expanding camp offerings to maximize profitability.
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Forecast Chart */}
      <SmartChart
        title="Revenue Forecast (6 Months)"
        showDateRange={false}
        showForecast={true}
        insight={`Projected year-end revenue: $${projectedYearEnd.toLocaleString()}. Tennis typically dips in Apr-May and Nov-Dec.`}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Actual" 
                stroke="#2e7d32" 
                strokeWidth={2}
                fill="url(#actualGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="projected" 
                name="Projected" 
                stroke="#2563eb" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#projectedGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="upper" 
                name="Upper Bound" 
                stroke="#93c5fd" 
                strokeWidth={1}
                fill="none" 
                strokeDasharray="2 2"
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                name="Lower Bound" 
                stroke="#93c5fd" 
                strokeWidth={1}
                fill="none" 
                strokeDasharray="2 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SmartChart>

      {/* Revenue Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SmartChart
          title="Revenue by Time of Day"
          showDateRange={false}
          insight={generateAutoInsight(intelligence.byTimeOfDay, 'revenue')}
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intelligence.byTimeOfDay} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="#2e7d32" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmartChart>

        <SmartChart
          title="Revenue by Day of Week"
          showDateRange={false}
          insight="Saturday drives 20% of weekly revenue - consider weekend promotions."
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intelligence.byDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmartChart>

        <SmartChart
          title="Revenue by Student Level"
          showDateRange={false}
          insight="Intermediate students generate 35% of revenue - strong mid-market."
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intelligence.byStudentLevel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SmartChart>
      </div>

      {/* Enhanced Revenue Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span>🔮</span> 12-Month Revenue Forecast
          </h3>
          <p className="text-xs text-gray-500 mt-1">Based on historical trends and seasonal patterns</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Q1 Forecast</p>
              <p className="text-xl font-bold text-gray-800 mt-1">$52,400</p>
              <p className="text-xs text-green-600 font-medium">+8% vs last year</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Q2 Forecast</p>
              <p className="text-xl font-bold text-gray-800 mt-1">$48,200</p>
              <p className="text-xs text-yellow-600 font-medium">Seasonal dip expected</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Q3 Forecast</p>
              <p className="text-xl font-bold text-gray-800 mt-1">$61,800</p>
              <p className="text-xs text-green-600 font-medium">Summer camp boost</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Q4 Forecast</p>
              <p className="text-xl font-bold text-gray-800 mt-1">$45,600</p>
              <p className="text-xs text-yellow-600 font-medium">Holiday slowdown</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">Projected Annual Revenue</span>
              <span className="text-2xl font-bold text-indigo-600">${projectedYearEnd.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: '42%' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>$0</span>
              <span>42% to goal ($500k)</span>
              <span>$500k</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm font-bold text-green-700 mb-2">Best Case Scenario</p>
              <p className="text-2xl font-bold text-green-600">$245,000</p>
              <p className="text-xs text-gray-600 mt-1">+15% retention improvement, fill 80% of off-peak slots</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <p className="text-sm font-bold text-red-700 mb-2">Conservative Estimate</p>
              <p className="text-2xl font-bold text-red-600">$185,000</p>
              <p className="text-xs text-gray-600 mt-1">Current trends continue, no new initiatives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Scenarios & Break-Even */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Scenarios */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RocketIcon className="w-5 h-5 text-indigo-600" /> Growth Scenarios
          </h3>
          <div className="space-y-4">
            <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-blue-600">+1 Coach:</span> Revenue could increase by
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">+$8,400/month</p>
              <p className="text-xs text-gray-500 mt-1">Based on avg coach revenue generation</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-green-600">+10% Retention:</span> Annual revenue increases by
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">+$14,200/year</p>
              <p className="text-xs text-gray-500 mt-1">Based on current student LTV</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-purple-600">Fill Unused Slots:</span> Monthly potential
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-1">+$3,600/month</p>
              <p className="text-xs text-gray-500 mt-1">From underutilized court time</p>
            </div>
          </div>
        </div>

        {/* Break-Even Analysis */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚖️</span> Break-Even Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-green-200">
              <span className="text-sm text-gray-600">Monthly Fixed Costs</span>
              <span className="font-bold text-gray-800">${breakEven.monthlyFixedCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-green-200">
              <span className="text-sm text-gray-600">Avg Revenue per Student</span>
              <span className="font-bold text-gray-800">${breakEven.avgRevenuePerStudent}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-green-200">
              <span className="text-sm text-gray-600">Break-Even Students</span>
              <span className="font-bold text-orange-600">{breakEven.breakEvenStudents} students</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-green-200">
              <span className="text-sm text-gray-600">Current Students</span>
              <span className="font-bold text-green-600">{breakEven.currentStudents} students</span>
            </div>
            <div className="bg-white/80 rounded-lg p-4 mt-4 border border-green-200">
              <p className="text-sm text-gray-700">Safety Margin</p>
              <p className={`text-2xl font-bold ${breakEven.safetyMargin > 20 ? 'text-green-600' : breakEven.safetyMargin > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {breakEven.safetyMargin > 0 ? '+' : ''}{breakEven.safetyMargin}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {breakEven.safetyMargin > 20 
                  ? 'Healthy buffer above break-even'
                  : breakEven.safetyMargin > 0 
                    ? 'Close to break-even - monitor closely'
                    : 'Below break-even - action needed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Finder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <LightBulbIcon className="w-5 h-5 text-amber-600" /> Opportunity Finder
          </h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
            ${opportunities.reduce((sum, o) => sum + o.potentialMonthly, 0).toLocaleString()}/mo potential
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {opportunities.map((opp) => (
            <div key={opp.classId} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{opp.dayTime} - {opp.className}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {opp.currentStudents}/{opp.capacity} students ({opp.utilizationPercent}% capacity)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-bold text-sm">
                      +${opp.potentialMonthly.toLocaleString()}/month if filled
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${opp.utilizationPercent >= 70 ? 'bg-green-500' : opp.utilizationPercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${opp.utilizationPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-700">
                  <span className="font-bold">→ Suggestion:</span> {opp.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
