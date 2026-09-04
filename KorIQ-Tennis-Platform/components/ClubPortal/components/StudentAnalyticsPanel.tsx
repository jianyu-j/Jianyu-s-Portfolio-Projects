import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { Student, RevenueEntry, Session } from '../../../types';
import { calculateStudentAnalytics, StudentAnalytics, getDaysAgo } from '../../../utils/analyticsHelpers';
import { Button } from '../../ui/Button';

// SVG Icons
const UsersIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChartBarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CreditCardIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ClipboardListIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

// ============================================
// TYPES
// ============================================
type StudentFilter = 'all' | 'highRisk' | 'unclaimed' | 'topPayers' | 'newThisMonth';

interface StudentWithAnalytics extends Student {
  analytics: StudentAnalytics;
}

interface StudentAnalyticsPanelProps {
  students: Student[];
  revenue: RevenueEntry[];
  sessions: Session[];
  onViewStudent?: (student: Student) => void;
}

// ============================================
// COMPONENT
// ============================================
const StudentAnalyticsPanel: React.FC<StudentAnalyticsPanelProps> = ({
  students,
  revenue,
  sessions,
  onViewStudent
}) => {
  const [filter, setFilter] = useState<StudentFilter>('all');
  const [sortBy, setSortBy] = useState<'name' | 'churnRisk' | 'engagement' | 'revenue'>('churnRisk');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedStudent, setSelectedStudent] = useState<StudentWithAnalytics | null>(null);

  // Calculate analytics for all students
  const studentsWithAnalytics: StudentWithAnalytics[] = useMemo(() => {
    return students.map(student => ({
      ...student,
      analytics: calculateStudentAnalytics(student, revenue, sessions)
    }));
  }, [students, revenue, sessions]);

  // Filter students
  const filteredStudents = useMemo(() => {
    let result = [...studentsWithAnalytics];
    
    switch (filter) {
      case 'highRisk':
        result = result.filter(s => s.analytics.churnRisk === 'high' || s.analytics.churnRisk === 'medium');
        break;
      case 'unclaimed':
        result = result.filter(s => s.status === 'Unclaimed');
        break;
      case 'topPayers':
        result = result.filter(s => s.analytics.totalRevenue > 500);
        break;
      case 'newThisMonth':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(s => s.joinedDate && new Date(s.joinedDate) >= thirtyDaysAgo);
        break;
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'churnRisk':
          comparison = a.analytics.churnRiskScore - b.analytics.churnRiskScore;
          break;
        case 'engagement':
          comparison = a.analytics.engagementScore - b.analytics.engagementScore;
          break;
        case 'revenue':
          comparison = a.analytics.totalRevenue - b.analytics.totalRevenue;
          break;
      }
      return sortDir === 'desc' ? -comparison : comparison;
    });
    
    return result;
  }, [studentsWithAnalytics, filter, sortBy, sortDir]);

  // Calculate funnel data
  const funnelData = useMemo(() => {
    const total = students.length;
    const claimed = students.filter(s => s.status === 'Claimed').length;
    const active = studentsWithAnalytics.filter(s => s.analytics.daysSinceLastPayment < 30).length;
    const retained = studentsWithAnalytics.filter(s => s.analytics.paymentCount >= 3).length;
    const leveledUp = Math.floor(retained * 0.4); // Mock
    
    return [
      { name: 'Trial/New', value: total, fill: '#e5e7eb' },
      { name: 'Enrolled', value: claimed, fill: '#93c5fd' },
      { name: 'Active', value: active, fill: '#86efac' },
      { name: 'Retained', value: retained, fill: '#2e7d32' },
      { name: 'Level Up', value: leveledUp, fill: '#7c3aed' }
    ];
  }, [students, studentsWithAnalytics]);

  // Summary stats
  const stats = useMemo(() => {
    const highRisk = studentsWithAnalytics.filter(s => s.analytics.churnRisk === 'high').length;
    const mediumRisk = studentsWithAnalytics.filter(s => s.analytics.churnRisk === 'medium').length;
    const avgEngagement = Math.round(studentsWithAnalytics.reduce((sum, s) => sum + s.analytics.engagementScore, 0) / studentsWithAnalytics.length);
    const totalRevenue = studentsWithAnalytics.reduce((sum, s) => sum + s.analytics.totalRevenue, 0);
    
    return { highRisk, mediumRisk, avgEngagement, totalRevenue };
  }, [studentsWithAnalytics]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const getChurnRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">🔴 High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">🟡 Medium</span>;
      default:
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">🟢 Low</span>;
    }
  };

  const getEngagementBar = (score: number) => {
    const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-xs text-gray-600">{score}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
          <p className="text-[10px] text-red-600 uppercase font-bold mb-1">At Risk</p>
          <p className="text-2xl font-bold text-red-600">{stats.highRisk + stats.mediumRisk}</p>
          <p className="text-[10px] text-red-500">{stats.highRisk} high, {stats.mediumRisk} medium</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
          <p className="text-[10px] text-blue-600 uppercase font-bold mb-1">Avg Engagement</p>
          <p className="text-2xl font-bold text-blue-600">{stats.avgEngagement}/100</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
          <p className="text-[10px] text-green-600 uppercase font-bold mb-1">Total Student Revenue</p>
          <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Student Journey Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-gray-600" /> Student Journey Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [value, 'Students']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {funnelData.map((stage, idx) => {
              const prevValue = idx > 0 ? funnelData[idx - 1].value : stage.value;
              const dropOff = prevValue > 0 ? Math.round(((prevValue - stage.value) / prevValue) * 100) : 0;
              
              return (
                <div key={stage.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.fill }} />
                    <span className="font-medium text-sm">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-800">{stage.value}</span>
                    {idx > 0 && dropOff > 0 && (
                      <span className="text-xs text-red-500 ml-2">↓ {dropOff}%</span>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
              <p className="text-xs text-blue-700">
                <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Insight:</strong> {funnelData[2].value > 0 && funnelData[3].value > 0 
                  ? `${Math.round((funnelData[3].value / funnelData[2].value) * 100)}% of active students are retained.`
                  : 'Not enough data to calculate retention.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table with Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><UsersIcon className="w-5 h-5 text-gray-600" /> Student Analytics</h3>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as StudentFilter)}
              className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-tennis-500"
            >
              <option value="all">All Students ({students.length})</option>
              <option value="highRisk">High Churn Risk ({stats.highRisk + stats.mediumRisk})</option>
              <option value="unclaimed">Unclaimed Accounts</option>
              <option value="topPayers">Top Payers (&gt;$500)</option>
              <option value="newThisMonth">New This Month</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th 
                  className="p-3 font-bold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Student {sortBy === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 font-bold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('churnRisk')}
                >
                  Churn Risk {sortBy === 'churnRisk' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 font-bold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('engagement')}
                >
                  Engagement {sortBy === 'engagement' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 font-bold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('revenue')}
                >
                  Revenue {sortBy === 'revenue' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-3 font-bold text-gray-600">Last Active</th>
                <th className="p-3 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.slice(0, 20).map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {getChurnRiskBadge(student.analytics.churnRisk)}
                  </td>
                  <td className="p-3">
                    {getEngagementBar(student.analytics.engagementScore)}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-green-600">
                      ${student.analytics.totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({student.analytics.paymentCount} payments)
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs ${student.analytics.daysSinceLastPayment > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                      {student.analytics.daysSinceLastPayment === 999 
                        ? 'Never' 
                        : `${student.analytics.daysSinceLastPayment} days ago`}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button 
                      variant="secondary" 
                      className="text-xs"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length > 20 && (
          <div className="p-4 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing 20 of {filteredStudents.length} students</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-tennis-600 to-emerald-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">{selectedStudent.name}</h3>
                <p className="text-sm text-white/80">{selectedStudent.email}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Churn Risk</p>
                  <div className="mt-1">{getChurnRiskBadge(selectedStudent.analytics.churnRisk)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Engagement</p>
                  <p className="text-xl font-bold text-blue-600">{selectedStudent.analytics.engagementScore}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">${selectedStudent.analytics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><CreditCardIcon className="w-4 h-4 text-gray-600" /> Payment History</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Payments</span>
                    <span className="font-bold">{selectedStudent.analytics.paymentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Payment</span>
                    <span className="font-bold">${Math.round(selectedStudent.analytics.avgPaymentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">First Payment</span>
                    <span className="font-medium">{selectedStudent.analytics.firstPaymentDate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Payment</span>
                    <span className="font-medium">{selectedStudent.analytics.lastPaymentDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><ClipboardListIcon className="w-4 h-4 text-gray-600" /> Student Info</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="font-bold">{selectedStudent.currentNtrp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`font-bold ${selectedStudent.status === 'Claimed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Joined</span>
                    <span className="font-medium">{selectedStudent.joinedDate || 'N/A'}</span>
                  </div>
                  {selectedStudent.createdFrom && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created From</span>
                      <span className="font-medium">{selectedStudent.createdFrom}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedStudent(null)}>Close</Button>
              <Button onClick={() => { onViewStudent?.(selectedStudent); setSelectedStudent(null); }}>
                Full Profile →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalyticsPanel;
