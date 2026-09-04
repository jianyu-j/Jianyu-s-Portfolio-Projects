import React, { useState, useMemo } from 'react';
import { Student, Coach, RevenueEntry, Session, ClubSessionPeriod } from '../../../types';
import { Button } from '../../ui/Button';

// ============================================
// TYPES
// ============================================
type InsightCategory = 'urgent' | 'attention' | 'wins' | 'opportunities';
type TimeFilter = 'today' | 'week' | 'month' | '30days' | 'quarter';

interface Insight {
  id: string;
  category: InsightCategory;
  iconType: 'warning' | 'alert' | 'chart-down' | 'chart-up' | 'mail' | 'clipboard' | 'star' | 'users' | 'trophy' | 'dollar' | 'gift' | 'book' | 'clock';
  title: string;
  description: string;
  action?: string;
  actionLabel?: string;
  data?: any;
  onClick?: () => void;
}

interface AtRiskStudent {
  student: Student;
  daysSinceSeen: number;
  ltv: number;
  riskLevel: 'high' | 'medium';
  suggestedAction: string;
}

interface InsightsPanelProps {
  students: Student[];
  coaches: Coach[];
  revenue: RevenueEntry[];
  sessions: Session[];
  clubSessions: ClubSessionPeriod[];
  onViewStudent?: (student: Student) => void;
  onViewCoach?: (coach: Coach) => void;
  onNavigateToTab?: (tab: string) => void;
}

// ============================================
// ICON COMPONENT
// ============================================
const InsightIcon: React.FC<{ type: Insight['iconType']; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  switch (type) {
    case 'warning':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'alert':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'chart-down':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    case 'chart-up':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'mail':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'star':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'users':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'trophy':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    case 'dollar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'gift':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      );
    case 'book':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'clock':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function getDaysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function getDateRange(filter: TimeFilter): { start: Date; end: Date } {
  const now = new Date();
  const end = now;
  let start = new Date();
  
  switch (filter) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth(), 1);
      break;
    case '30days':
      start.setDate(now.getDate() - 30);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
  }
  
  return { start, end };
}

function getLastMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start, end };
}

function calculateLTV(studentId: string, revenue: RevenueEntry[]): number {
  return revenue
    .filter(r => r.studentId === studentId)
    .reduce((sum, r) => sum + r.amount, 0);
}

// ============================================
// COMPONENT
// ============================================
const InsightsPanel: React.FC<InsightsPanelProps> = ({
  students,
  coaches,
  revenue,
  sessions,
  clubSessions,
  onViewStudent,
  onViewCoach,
  onNavigateToTab
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [expandedCategory, setExpandedCategory] = useState<InsightCategory | null>('urgent');
  const [showAtRiskDetail, setShowAtRiskDetail] = useState(false);
  const [contactedStudents, setContactedStudents] = useState<Set<string>>(new Set());

  // ============================================
  // CALCULATE INSIGHTS
  // ============================================
  const insights = useMemo(() => {
    const result: Insight[] = [];
    const { start: periodStart } = getDateRange(timeFilter);
    const { start: lastMonthStart, end: lastMonthEnd } = getLastMonthRange();
    
    // Current period revenue
    const currentRevenue = revenue
      .filter(r => new Date(r.date) >= periodStart)
      .reduce((sum, r) => sum + r.amount, 0);
    
    // Last month revenue (for comparison)
    const lastMonthRevenue = revenue
      .filter(r => {
        const d = new Date(r.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, r) => sum + r.amount, 0);
    
    // This month revenue
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    const thisMonthRevenue = revenue
      .filter(r => new Date(r.date) >= thisMonthStart)
      .reduce((sum, r) => sum + r.amount, 0);

    // ==========================================
    // URGENT INSIGHTS
    // ==========================================
    
    // At-risk students (no payment/activity in 14+ days)
    const atRiskStudents = students.filter(s => {
      const lastPayment = revenue
        .filter(r => r.studentId === s.id || r.studentEmail === s.email)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (!lastPayment) return true;
      return getDaysAgo(lastPayment.date) >= 14;
    });
    
    const highRiskCount = atRiskStudents.filter(s => {
      const lastPayment = revenue.find(r => r.studentId === s.id || r.studentEmail === s.email);
      return !lastPayment || getDaysAgo(lastPayment?.date || s.joinedDate || '2020-01-01') >= 21;
    }).length;
    
    if (atRiskStudents.length > 0) {
      result.push({
        id: 'churn-risk',
        category: 'urgent',
        iconType: 'warning',
        title: `${atRiskStudents.length} student${atRiskStudents.length > 1 ? 's' : ''} at churn risk`,
        description: `${highRiskCount} high risk, ${atRiskStudents.length - highRiskCount} medium risk`,
        action: 'Review and reach out to at-risk students',
        actionLabel: 'View Details',
        data: { atRiskStudents },
        onClick: () => setShowAtRiskDetail(true)
      });
    }
    
    // Coach rating dropped
    coaches.forEach(coach => {
      if (coach.rating && coach.rating < 4.0) {
        result.push({
          id: `coach-rating-${coach.id}`,
          category: 'urgent',
          iconType: 'chart-down',
          title: `${coach.name}'s rating needs attention`,
          description: `Current rating: ${coach.rating?.toFixed(1)} stars`,
          action: 'Review recent feedback and schedule 1:1',
          actionLabel: 'View Coach',
          onClick: () => onViewCoach?.(coach)
        });
      }
    });
    
    // Revenue crisis
    if (lastMonthRevenue > 0 && thisMonthRevenue < lastMonthRevenue * 0.7) {
      const dropPercent = Math.round((1 - thisMonthRevenue / lastMonthRevenue) * 100);
      result.push({
        id: 'revenue-crisis',
        category: 'urgent',
        iconType: 'alert',
        title: `Revenue down ${dropPercent}% vs last month`,
        description: `$${thisMonthRevenue.toLocaleString()} vs $${lastMonthRevenue.toLocaleString()} last month`,
        action: 'Review retention and run re-engagement campaign',
        actionLabel: 'View Revenue',
        onClick: () => onNavigateToTab?.('REVENUE')
      });
    }

    // ==========================================
    // ATTENTION INSIGHTS
    // ==========================================
    
    // Revenue below target (< 90% of last month)
    if (lastMonthRevenue > 0 && thisMonthRevenue < lastMonthRevenue * 0.9 && thisMonthRevenue >= lastMonthRevenue * 0.7) {
      const percentOfTarget = Math.round((thisMonthRevenue / lastMonthRevenue) * 100);
      result.push({
        id: 'revenue-below-target',
        category: 'attention',
        iconType: 'chart-down',
        title: `Revenue at ${percentOfTarget}% of last month`,
        description: 'Consider promotional activities to boost enrollment',
        action: 'Run a referral or "bring a friend" campaign',
        actionLabel: 'View Revenue',
        onClick: () => onNavigateToTab?.('REVENUE')
      });
    }
    
    // Unclaimed accounts
    const unclaimedStudents = students.filter(s => s.status === 'Unclaimed');
    if (unclaimedStudents.length > 0) {
      result.push({
        id: 'unclaimed-accounts',
        category: 'attention',
        iconType: 'mail',
        title: `${unclaimedStudents.length} unclaimed student account${unclaimedStudents.length > 1 ? 's' : ''}`,
        description: 'Students can claim accounts to access their profiles',
        action: 'Send reminder emails to claim accounts',
        actionLabel: 'View Students',
        onClick: () => onNavigateToTab?.('STUDENTS')
      });
    }
    
    // CSV Import students without activity
    const csvStudentsNoActivity = students.filter(s => 
      s.createdFrom === 'CSV Import' && 
      !sessions.some(sess => sess.studentId === s.id)
    );
    if (csvStudentsNoActivity.length > 0) {
      result.push({
        id: 'csv-no-activity',
        category: 'attention',
        iconType: 'clipboard',
        title: `${csvStudentsNoActivity.length} imported student${csvStudentsNoActivity.length > 1 ? 's' : ''} with no sessions`,
        description: 'Students from CSV import haven\'t been scheduled yet',
        action: 'Schedule onboarding sessions',
        actionLabel: 'View Students',
        onClick: () => onNavigateToTab?.('STUDENTS')
      });
    }

    // ==========================================
    // WINS INSIGHTS
    // ==========================================
    
    // Revenue growth
    if (lastMonthRevenue > 0 && thisMonthRevenue > lastMonthRevenue * 1.1) {
      const growthPercent = Math.round((thisMonthRevenue / lastMonthRevenue - 1) * 100);
      result.push({
        id: 'revenue-growth',
        category: 'wins',
        iconType: 'chart-up',
        title: `Revenue up ${growthPercent}% vs last month!`,
        description: `$${thisMonthRevenue.toLocaleString()} this month`,
        action: 'Keep momentum going with testimonial collection'
      });
    }
    
    // High-rated coaches
    coaches.forEach(coach => {
      if (coach.rating && coach.rating >= 4.8) {
        result.push({
          id: `coach-star-${coach.id}`,
          category: 'wins',
          iconType: 'star',
          title: `${coach.name} is a star performer!`,
          description: `${coach.rating.toFixed(1)} star rating${coach.reviewCount ? ` (${coach.reviewCount} reviews)` : ''}`,
          action: 'Consider having them mentor other coaches',
          actionLabel: 'View Coach',
          onClick: () => onViewCoach?.(coach)
        });
      }
    });
    
    // New students this period
    const newStudents = students.filter(s => {
      if (!s.joinedDate) return false;
      return new Date(s.joinedDate) >= periodStart;
    });
    if (newStudents.length >= 3) {
      result.push({
        id: 'new-students',
        category: 'wins',
        iconType: 'users',
        title: `${newStudents.length} new students joined!`,
        description: `Growing your community this ${timeFilter === 'week' ? 'week' : 'period'}`,
        action: 'Ensure smooth onboarding experience'
      });
    }
    
    // Active student base
    const activeStudents = students.filter(s => s.status === 'Claimed');
    if (activeStudents.length > 0) {
      const claimRate = Math.round((activeStudents.length / students.length) * 100);
      if (claimRate >= 70) {
        result.push({
          id: 'engagement-rate',
          category: 'wins',
          iconType: 'trophy',
          title: `${claimRate}% student engagement rate`,
          description: `${activeStudents.length} of ${students.length} students are actively engaged`,
          action: 'Maintain engagement with regular communication'
        });
      }
    }

    // ==========================================
    // OPPORTUNITIES INSIGHTS
    // ==========================================
    
    // Untapped time slots (mock calculation)
    const unusedSlotPotential = 2400;
    result.push({
      id: 'unused-slots',
      category: 'opportunities',
      iconType: 'dollar',
      title: `~$${unusedSlotPotential.toLocaleString()}/month potential from unused court time`,
      description: 'Peak unused slots: Saturday 8-10am, Wednesday 4-6pm',
      action: 'Consider promotions for these time slots',
      actionLabel: 'View Schedule'
    });
    
    // High-value students for referrals
    const highValueStudents = students.filter(s => {
      const ltv = calculateLTV(s.id, revenue);
      return ltv > 500 && s.status === 'Claimed';
    });
    if (highValueStudents.length > 0) {
      result.push({
        id: 'referral-candidates',
        category: 'opportunities',
        iconType: 'gift',
        title: `${highValueStudents.length} students ideal for referral program`,
        description: 'High-engagement students with strong LTV',
        action: 'Launch a "refer a friend" incentive',
        actionLabel: 'View Students',
        onClick: () => onNavigateToTab?.('STUDENTS')
      });
    }
    
    // Beginners ready for level-up
    const beginnersCount = students.filter(s => 
      s.currentNtrp === '1.0-1.5' || s.currentNtrp === '2.0-2.5'
    ).length;
    if (beginnersCount > 5) {
      result.push({
        id: 'upsell-intermediate',
        category: 'opportunities',
        iconType: 'book',
        title: `${beginnersCount} beginner students could advance`,
        description: 'Consider intermediate program promotion',
        action: 'Run a "Next Level" workshop or camp'
      });
    }
    
    return result;
  }, [students, coaches, revenue, sessions, timeFilter, onViewCoach, onNavigateToTab]);

  // Group insights by category
  const groupedInsights = useMemo(() => {
    return {
      urgent: insights.filter(i => i.category === 'urgent'),
      attention: insights.filter(i => i.category === 'attention'),
      wins: insights.filter(i => i.category === 'wins'),
      opportunities: insights.filter(i => i.category === 'opportunities')
    };
  }, [insights]);

  // At-risk students detail
  const atRiskStudentsDetail = useMemo((): AtRiskStudent[] => {
    return students
      .map(student => {
        const studentRevenue = revenue.filter(r => 
          r.studentId === student.id || r.studentEmail === student.email
        );
        const lastPayment = studentRevenue
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        const daysSinceSeen = lastPayment 
          ? getDaysAgo(lastPayment.date) 
          : getDaysAgo(student.joinedDate || '2020-01-01');
        
        const ltv = studentRevenue.reduce((sum, r) => sum + r.amount, 0);
        
        if (daysSinceSeen < 14) return null;
        
        return {
          student,
          daysSinceSeen,
          ltv,
          riskLevel: daysSinceSeen >= 21 ? 'high' : 'medium',
          suggestedAction: daysSinceSeen >= 21 ? 'Personal outreach' : 'Check-in message'
        };
      })
      .filter((s): s is AtRiskStudent => s !== null)
      .sort((a, b) => b.daysSinceSeen - a.daysSinceSeen);
  }, [students, revenue]);

  const handleMarkContacted = (studentId: string) => {
    setContactedStudents(prev => new Set([...prev, studentId]));
  };

  const categoryConfig = {
    urgent: { 
      label: 'Urgent', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200', 
      textColor: 'text-red-700',
      iconBg: 'bg-red-100',
      activeBg: 'bg-red-600',
      dotColor: 'bg-red-500'
    },
    attention: { 
      label: 'Attention', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-700',
      iconBg: 'bg-amber-100',
      activeBg: 'bg-amber-500',
      dotColor: 'bg-amber-500'
    },
    wins: { 
      label: 'Wins', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-200', 
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      activeBg: 'bg-emerald-600',
      dotColor: 'bg-emerald-500'
    },
    opportunities: { 
      label: 'Opportunities', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-100',
      activeBg: 'bg-blue-600',
      dotColor: 'bg-blue-500'
    }
  };

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-portal-club to-teal-600 p-4 flex justify-between items-center">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Insights & Alerts
          </h3>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-gray-800"
          >
            {timeFilterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 border-b border-gray-200">
          {(Object.keys(categoryConfig) as InsightCategory[]).map(cat => {
            const config = categoryConfig[cat];
            const count = groupedInsights[cat].length;
            const isExpanded = expandedCategory === cat;
            
            return (
              <button
                key={cat}
                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                className={`
                  p-3 text-center transition-all border-b-2 relative
                  ${isExpanded 
                    ? `${config.bgColor} border-b-current ${config.textColor}` 
                    : 'border-transparent hover:bg-gray-50 text-gray-600'}
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span className="text-xs font-semibold">{config.label}</span>
                  </div>
                  <span className={`
                    text-lg font-bold
                    ${isExpanded ? config.textColor : count > 0 ? 'text-gray-900' : 'text-gray-400'}
                  `}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Content */}
        {expandedCategory && (
          <div className={`p-4 ${categoryConfig[expandedCategory].bgColor}`}>
            {groupedInsights[expandedCategory].length === 0 ? (
              <div className="text-center py-8">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${categoryConfig[expandedCategory].iconBg} flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${categoryConfig[expandedCategory].textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  {expandedCategory === 'urgent' 
                    ? 'No urgent issues! Great job keeping things running smoothly.'
                    : expandedCategory === 'attention'
                    ? 'Nothing needs immediate attention.'
                    : expandedCategory === 'wins'
                    ? 'Keep working hard - wins are coming!'
                    : 'No new opportunities detected this period.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedInsights[expandedCategory].map(insight => {
                  const config = categoryConfig[insight.category];
                  return (
                    <div 
                      key={insight.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <InsightIcon type={insight.iconType} className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                          <p className="text-sm text-gray-500 mt-0.5">{insight.description}</p>
                          {insight.action && (
                            <p className="text-sm text-gray-600 mt-2 flex items-start gap-1.5">
                              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span className="text-gray-500">{insight.action}</span>
                            </p>
                          )}
                        </div>
                        {insight.actionLabel && insight.onClick && (
                          <Button 
                            variant="secondary" 
                            className="text-xs whitespace-nowrap flex-shrink-0"
                            onClick={insight.onClick}
                          >
                            {insight.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Collapsed Summary */}
        {!expandedCategory && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Click a category above to see details
          </div>
        )}
      </div>

      {/* At-Risk Students Detail Modal */}
      {showAtRiskDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                At-Risk Students
              </h3>
              <button 
                onClick={() => setShowAtRiskDetail(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {atRiskStudentsDetail.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium">No at-risk students! Great retention.</p>
                </div>
              ) : (
                atRiskStudentsDetail.map(({ student, daysSinceSeen, ltv, riskLevel, suggestedAction }) => (
                  <div 
                    key={student.id}
                    className={`
                      rounded-lg p-4 border-2 transition-all
                      ${contactedStudents.has(student.id) 
                        ? 'bg-gray-50 border-gray-200 opacity-60' 
                        : riskLevel === 'high' 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-amber-50 border-amber-200'}
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          riskLevel === 'high' ? 'bg-red-100' : 'bg-amber-100'
                        }`}>
                          <svg className={`w-5 h-5 ${riskLevel === 'high' ? 'text-red-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            {student.name}
                            {contactedStudents.has(student.id) && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Contacted
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Last seen: {daysSinceSeen} days ago • LTV: ${ltv.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Suggested:</span> {suggestedAction}
                          </p>
                        </div>
                      </div>
                      
                      {!contactedStudents.has(student.id) && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button 
                            variant="secondary" 
                            className="text-xs"
                            onClick={() => {
                              window.open(`mailto:${student.email}?subject=We miss you at the club!`);
                            }}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </Button>
                          <Button 
                            className="text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleMarkContacted(student.id)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark Contacted
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {contactedStudents.size} of {atRiskStudentsDetail.length} contacted
                </p>
                <Button variant="secondary" onClick={() => setShowAtRiskDetail(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InsightsPanel;
