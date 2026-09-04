/**
 * Analytics Helper Functions for KorIQ
 * Calculates LTV, churn risk, engagement scores, forecasting, etc.
 */

import { Student, Coach, RevenueEntry, Session, ExpenseEntry } from '../types';

// ============================================
// TYPES
// ============================================
export type ChurnRisk = 'low' | 'medium' | 'high';
export type DateRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface StudentAnalytics {
  churnRisk: ChurnRisk;
  churnRiskScore: number; // 0-100
  engagementScore: number; // 0-100
  totalRevenue: number;
  paymentCount: number;
  firstPaymentDate: string | null;
  lastPaymentDate: string | null;
  daysSinceLastPayment: number;
  avgPaymentAmount: number;
}

export interface CoachAnalytics {
  totalStudents: number;
  totalRevenue: number;
  revenuePerHour: number;
  avgRating: number;
  retentionRate: number;
  studentsLeveledUp: number;
  avgStudentLTV: number;
  sessionsCount: number;
  retentionImpact: number; // % difference from club avg
}

export interface RevenueIntelligence {
  revenuePerCourtHour: number;
  revenuePerCoachHour: number;
  avgStudentLTV: number;
  concentrationRisk: {
    topCoachPercent: number;
    topProgramPercent: number;
    isRisky: boolean;
    riskMessage: string;
  };
  byTimeOfDay: { name: string; value: number }[];
  byDayOfWeek: { name: string; value: number }[];
  byStudentLevel: { name: string; value: number }[];
}

export interface ForecastData {
  month: string;
  actual?: number;
  projected?: number;
  lower?: number;
  upper?: number;
}

export interface OpportunityFinder {
  classId: string;
  className: string;
  dayTime: string;
  currentStudents: number;
  capacity: number;
  utilizationPercent: number;
  potentialMonthly: number;
  suggestion: string;
}

// ============================================
// DATE HELPERS
// ============================================
export function getDaysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDateRangeFilter(range: DateRange, customStart?: Date, customEnd?: Date): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);
  
  switch (range) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case 'custom':
      if (customStart && customEnd) {
        return { start: customStart, end: customEnd };
      }
      break;
  }
  
  return { start, end };
}

// ============================================
// STUDENT ANALYTICS
// ============================================
export function calculateStudentAnalytics(
  student: Student,
  revenue: RevenueEntry[],
  sessions: Session[]
): StudentAnalytics {
  // Filter revenue for this student
  const studentRevenue = revenue.filter(r => 
    r.studentId === student.id || r.studentEmail?.toLowerCase() === student.email.toLowerCase()
  );
  
  const totalRevenue = studentRevenue.reduce((sum, r) => sum + r.amount, 0);
  const paymentCount = studentRevenue.length;
  
  // Sort by date
  const sortedPayments = [...studentRevenue].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstPaymentDate = sortedPayments[0]?.date || null;
  const lastPaymentDate = sortedPayments[sortedPayments.length - 1]?.date || null;
  const daysSinceLastPayment = lastPaymentDate ? getDaysAgo(lastPaymentDate) : 999;
  const avgPaymentAmount = paymentCount > 0 ? totalRevenue / paymentCount : 0;
  
  // Calculate churn risk score (0-100, higher = more at risk)
  let churnRiskScore = 0;
  
  // Days since last payment (max 50 points)
  if (daysSinceLastPayment >= 30) churnRiskScore += 50;
  else if (daysSinceLastPayment >= 21) churnRiskScore += 40;
  else if (daysSinceLastPayment >= 14) churnRiskScore += 25;
  else if (daysSinceLastPayment >= 7) churnRiskScore += 10;
  
  // Account status (max 20 points)
  if (student.status === 'Unclaimed') churnRiskScore += 20;
  
  // Payment frequency (max 30 points)
  if (paymentCount === 0) churnRiskScore += 30;
  else if (paymentCount === 1) churnRiskScore += 20;
  else if (paymentCount === 2) churnRiskScore += 10;
  
  // Determine risk level
  let churnRisk: ChurnRisk = 'low';
  if (churnRiskScore >= 60) churnRisk = 'high';
  else if (churnRiskScore >= 30) churnRisk = 'medium';
  
  // Calculate engagement score (0-100, higher = more engaged)
  let engagementScore = 100 - churnRiskScore;
  
  // Boost for claimed accounts
  if (student.status === 'Claimed') engagementScore = Math.min(100, engagementScore + 10);
  
  // Boost for high LTV
  if (totalRevenue > 1000) engagementScore = Math.min(100, engagementScore + 10);
  else if (totalRevenue > 500) engagementScore = Math.min(100, engagementScore + 5);
  
  return {
    churnRisk,
    churnRiskScore,
    engagementScore: Math.max(0, Math.min(100, engagementScore)),
    totalRevenue,
    paymentCount,
    firstPaymentDate,
    lastPaymentDate,
    daysSinceLastPayment,
    avgPaymentAmount
  };
}

// ============================================
// COACH ANALYTICS
// ============================================
export function calculateCoachAnalytics(
  coach: Coach,
  students: Student[],
  revenue: RevenueEntry[],
  sessions: Session[],
  allCoachesAvgRetention: number = 65
): CoachAnalytics {
  // Students assigned to this coach
  const coachStudents = students.filter(s => s.primaryCoachId === coach.id);
  const totalStudents = coachStudents.length;
  
  // Revenue from this coach
  const coachRevenue = revenue.filter(r => r.coachId === coach.id);
  const totalRevenue = coachRevenue.reduce((sum, r) => sum + r.amount, 0);
  
  // Sessions by this coach
  const coachSessions = sessions.filter(s => s.coachId === coach.id);
  const sessionsCount = coachSessions.length;
  const totalHours = coachSessions.reduce((sum, s) => sum + (s.durationMinutes || 60) / 60, 0);
  
  const revenuePerHour = totalHours > 0 ? totalRevenue / totalHours : 0;
  
  // Retention rate (mock: students with claimed status / total)
  const claimedStudents = coachStudents.filter(s => s.status === 'Claimed').length;
  const retentionRate = totalStudents > 0 ? Math.round((claimedStudents / totalStudents) * 100) : 0;
  
  // Students leveled up (REAL calculation using startingNtrp vs currentNtrp)
  const studentsLeveledUp = coachStudents.filter(s => 
    s.startingNtrp && s.startingNtrp !== s.currentNtrp
  ).length;
  
  // Average student LTV
  const studentLTVs = coachStudents.map(s => {
    const studentRev = revenue.filter(r => 
      r.studentId === s.id || r.studentEmail?.toLowerCase() === s.email.toLowerCase()
    );
    return studentRev.reduce((sum, r) => sum + r.amount, 0);
  });
  const avgStudentLTV = studentLTVs.length > 0 
    ? studentLTVs.reduce((a, b) => a + b, 0) / studentLTVs.length 
    : 0;
  
  // Retention impact vs club average
  const retentionImpact = retentionRate - allCoachesAvgRetention;
  
  return {
    totalStudents,
    totalRevenue,
    revenuePerHour: Math.round(revenuePerHour),
    avgRating: coach.rating || 4.0,
    retentionRate,
    studentsLeveledUp,
    avgStudentLTV: Math.round(avgStudentLTV),
    sessionsCount,
    retentionImpact
  };
}

// ============================================
// REVENUE INTELLIGENCE
// ============================================
export function calculateRevenueIntelligence(
  revenue: RevenueEntry[],
  coaches: Coach[],
  students: Student[],
  sessions: Session[]
): RevenueIntelligence {
  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  
  // Revenue per court hour (mock: assume 8 courts, 12 hours/day, 30 days)
  const totalCourtHours = 8 * 12 * 30;
  const revenuePerCourtHour = totalCourtHours > 0 ? Math.round(totalRevenue / totalCourtHours) : 0;
  
  // Revenue per coach hour
  const totalCoachHours = sessions.reduce((sum, s) => sum + (s.durationMinutes || 60) / 60, 0);
  const revenuePerCoachHour = totalCoachHours > 0 ? Math.round(totalRevenue / totalCoachHours) : 0;
  
  // Average Student LTV
  const studentLTVs = students.map(s => {
    const studentRev = revenue.filter(r => 
      r.studentId === s.id || r.studentEmail?.toLowerCase() === s.email.toLowerCase()
    );
    return studentRev.reduce((sum, r) => sum + r.amount, 0);
  }).filter(ltv => ltv > 0);
  const avgStudentLTV = studentLTVs.length > 0 
    ? Math.round(studentLTVs.reduce((a, b) => a + b, 0) / studentLTVs.length)
    : 0;
  
  // Concentration Risk
  const revenueByCoach: Record<string, number> = {};
  coaches.forEach(c => revenueByCoach[c.id] = 0);
  revenue.forEach(r => {
    if (r.coachId && revenueByCoach[r.coachId] !== undefined) {
      revenueByCoach[r.coachId] += r.amount;
    }
  });
  
  const coachRevenues = Object.values(revenueByCoach).sort((a, b) => b - a);
  const topCoachPercent = totalRevenue > 0 && coachRevenues[0] 
    ? Math.round((coachRevenues[0] / totalRevenue) * 100) 
    : 0;
  
  const revenueByType: Record<string, number> = {};
  revenue.forEach(r => {
    revenueByType[r.type] = (revenueByType[r.type] || 0) + r.amount;
  });
  const typeRevenues = Object.values(revenueByType).sort((a, b) => b - a);
  const topProgramPercent = totalRevenue > 0 && typeRevenues[0]
    ? Math.round((typeRevenues[0] / totalRevenue) * 100)
    : 0;
  
  const isRisky = topCoachPercent > 40 || topProgramPercent > 50;
  let riskMessage = '';
  if (topCoachPercent > 40) {
    riskMessage = `${topCoachPercent}% of revenue from top coach - consider diversifying`;
  } else if (topProgramPercent > 50) {
    riskMessage = `${topProgramPercent}% of revenue from one program type`;
  }
  
  // Revenue by time of day (mock distribution)
  const byTimeOfDay = [
    { name: 'Morning (6am-12pm)', value: Math.round(totalRevenue * 0.35) },
    { name: 'Afternoon (12pm-5pm)', value: Math.round(totalRevenue * 0.40) },
    { name: 'Evening (5pm-10pm)', value: Math.round(totalRevenue * 0.25) }
  ];
  
  // Revenue by day of week (mock distribution)
  const byDayOfWeek = [
    { name: 'Mon', value: Math.round(totalRevenue * 0.12) },
    { name: 'Tue', value: Math.round(totalRevenue * 0.14) },
    { name: 'Wed', value: Math.round(totalRevenue * 0.15) },
    { name: 'Thu', value: Math.round(totalRevenue * 0.14) },
    { name: 'Fri', value: Math.round(totalRevenue * 0.13) },
    { name: 'Sat', value: Math.round(totalRevenue * 0.20) },
    { name: 'Sun', value: Math.round(totalRevenue * 0.12) }
  ];
  
  // Revenue by student level (mock distribution)
  const byStudentLevel = [
    { name: 'Beginner (1.0-2.5)', value: Math.round(totalRevenue * 0.30) },
    { name: 'Intermediate (3.0-3.5)', value: Math.round(totalRevenue * 0.35) },
    { name: 'Advanced (4.0-4.5)', value: Math.round(totalRevenue * 0.25) },
    { name: 'Expert (5.0+)', value: Math.round(totalRevenue * 0.10) }
  ];
  
  return {
    revenuePerCourtHour,
    revenuePerCoachHour,
    avgStudentLTV,
    concentrationRisk: {
      topCoachPercent,
      topProgramPercent,
      isRisky,
      riskMessage
    },
    byTimeOfDay,
    byDayOfWeek,
    byStudentLevel
  };
}

// ============================================
// FORECASTING
// ============================================
export function generateRevenueForecast(
  revenue: RevenueEntry[],
  monthsAhead: number = 6
): ForecastData[] {
  const result: ForecastData[] = [];
  const now = new Date();
  
  // Group revenue by month
  const monthlyRevenue: Record<string, number> = {};
  revenue.forEach(r => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + r.amount;
  });
  
  // Get last 6 months of actual data
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleString('default', { month: 'short' });
    result.push({
      month: monthName,
      actual: monthlyRevenue[key] || 0
    });
  }
  
  // Calculate average growth rate
  const actuals = result.filter(r => r.actual && r.actual > 0).map(r => r.actual!);
  const avgMonthly = actuals.length > 0 
    ? actuals.reduce((a, b) => a + b, 0) / actuals.length 
    : 10000;
  const growthRate = 1.05; // 5% monthly growth assumption
  
  // Add forecasted months
  let lastValue = actuals[actuals.length - 1] || avgMonthly;
  for (let i = 1; i <= monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    
    // Apply seasonality (tennis dips in Apr-May and Nov-Dec)
    let seasonalFactor = 1.0;
    const month = d.getMonth();
    if (month === 3 || month === 4) seasonalFactor = 0.85; // Apr-May dip
    if (month === 10 || month === 11) seasonalFactor = 0.90; // Nov-Dec dip
    if (month === 5 || month === 6) seasonalFactor = 1.15; // Jun-Jul peak
    
    const projected = Math.round(lastValue * growthRate * seasonalFactor);
    
    result.push({
      month: monthName,
      projected,
      lower: Math.round(projected * 0.85),
      upper: Math.round(projected * 1.15)
    });
    
    lastValue = projected;
  }
  
  return result;
}

// ============================================
// OPPORTUNITY FINDER
// ============================================
export function findOpportunities(
  sessions: Session[],
  students: Student[]
): OpportunityFinder[] {
  // Mock opportunities - in production, this would analyze actual class schedules
  return [
    {
      classId: 'opp1',
      className: 'Beginner Group',
      dayTime: 'Tuesday 6pm',
      currentStudents: 4,
      capacity: 12,
      utilizationPercent: 33,
      potentialMonthly: 1200,
      suggestion: 'Run "Bring a Friend" promotion for existing students'
    },
    {
      classId: 'opp2',
      className: 'Intermediate Clinic',
      dayTime: 'Saturday 8am',
      currentStudents: 6,
      capacity: 10,
      utilizationPercent: 60,
      potentialMonthly: 800,
      suggestion: 'Target local fitness enthusiasts with social media ads'
    },
    {
      classId: 'opp3',
      className: 'Private Lesson Slots',
      dayTime: 'Wednesday 4-6pm',
      currentStudents: 2,
      capacity: 6,
      utilizationPercent: 33,
      potentialMonthly: 1600,
      suggestion: 'Offer package deals for off-peak private lessons'
    }
  ];
}

// ============================================
// OPERATIONAL EFFICIENCY
// ============================================
export interface OperationalMetrics {
  capacityUtilization: number;
  peakRevenue: number;
  offPeakRevenue: number;
  optimalClassSize: number;
  noShowRate: number;
  waitlistConversion: number;
  sessionsPerMonth: { month: string; group: number; private: number; camp: number }[];
  retentionByLevel: { level: string; rate: number }[];
  retentionByCoach: { coach: string; rate: number }[];
}

export function calculateOperationalMetrics(
  students: Student[],
  coaches: Coach[],
  sessions: Session[],
  revenue: RevenueEntry[]
): OperationalMetrics {
  // Capacity utilization (mock: 75%)
  const capacityUtilization = 75;
  
  // Peak vs off-peak (mock)
  const totalRev = revenue.reduce((sum, r) => sum + r.amount, 0);
  const peakRevenue = Math.round(totalRev * 0.65);
  const offPeakRevenue = Math.round(totalRev * 0.35);
  
  // Optimal class size (mock: 8 students)
  const optimalClassSize = 8;
  
  // No-show rate (mock: 12%)
  const noShowRate = 12;
  
  // Waitlist conversion (mock: 68%)
  const waitlistConversion = 68;
  
  // Sessions per month
  const sessionsPerMonth = [
    { month: 'Jan', group: 45, private: 32, camp: 0 },
    { month: 'Feb', group: 48, private: 35, camp: 0 },
    { month: 'Mar', group: 52, private: 38, camp: 5 },
    { month: 'Apr', group: 50, private: 36, camp: 8 },
    { month: 'May', group: 55, private: 40, camp: 12 },
    { month: 'Jun', group: 60, private: 45, camp: 25 }
  ];
  
  // Retention by level
  const retentionByLevel = [
    { level: 'Beginner (1.0-2.5)', rate: 78 },
    { level: 'Intermediate (3.0-3.5)', rate: 52 },
    { level: 'Advanced (4.0-4.5)', rate: 71 },
    { level: 'Expert (5.0+)', rate: 85 }
  ];
  
  // Retention by coach
  const retentionByCoach = coaches.slice(0, 5).map((c, i) => ({
    coach: c.name,
    rate: 65 + (10 - i * 3) + Math.floor(Math.random() * 10)
  })).sort((a, b) => b.rate - a.rate);
  
  return {
    capacityUtilization,
    peakRevenue,
    offPeakRevenue,
    optimalClassSize,
    noShowRate,
    waitlistConversion,
    sessionsPerMonth,
    retentionByLevel,
    retentionByCoach
  };
}

// ============================================
// BREAK-EVEN ANALYSIS
// ============================================
export interface BreakEvenAnalysis {
  monthlyFixedCosts: number;
  avgRevenuePerStudent: number;
  breakEvenStudents: number;
  currentStudents: number;
  safetyMargin: number;
  projectedAnnualProfit: number;
}

export function calculateBreakEven(
  students: Student[],
  revenue: RevenueEntry[],
  expenses: ExpenseEntry[]
): BreakEvenAnalysis {
  // Monthly fixed costs (from expenses)
  const now = new Date();
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyFixedCosts = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0) || 15000;
  
  // Average revenue per student
  const thisMonthRevenue = revenue.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalMonthlyRevenue = thisMonthRevenue.reduce((sum, r) => sum + r.amount, 0);
  const activeStudents = students.filter(s => s.status === 'Claimed').length || 1;
  const avgRevenuePerStudent = Math.round(totalMonthlyRevenue / activeStudents) || 200;
  
  // Break-even calculation
  const breakEvenStudents = Math.ceil(monthlyFixedCosts / avgRevenuePerStudent);
  const currentStudents = students.length;
  const safetyMargin = Math.round(((currentStudents - breakEvenStudents) / breakEvenStudents) * 100);
  
  // Projected annual profit
  const monthlyProfit = totalMonthlyRevenue - monthlyFixedCosts;
  const projectedAnnualProfit = monthlyProfit * 12;
  
  return {
    monthlyFixedCosts,
    avgRevenuePerStudent,
    breakEvenStudents,
    currentStudents,
    safetyMargin,
    projectedAnnualProfit
  };
}

// ============================================
// AUTO-INSIGHTS GENERATOR
// ============================================
export function generateAutoInsight(
  data: any[],
  dataType: 'revenue' | 'students' | 'sessions' | 'retention',
  comparisonData?: any[]
): string {
  if (!data || data.length === 0) return 'Not enough data to generate insights.';
  
  const currentTotal = data.reduce((sum: number, d: any) => sum + (d.value || d.amount || d.count || 0), 0);
  const previousTotal = comparisonData 
    ? comparisonData.reduce((sum: number, d: any) => sum + (d.value || d.amount || d.count || 0), 0)
    : currentTotal * 0.9;
  
  const changePercent = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  const direction = changePercent >= 0 ? 'up' : 'down';
  
  switch (dataType) {
    case 'revenue':
      if (changePercent > 10) {
        return `📈 Revenue is ${changePercent}% higher than previous period. Strong growth trajectory.`;
      } else if (changePercent < -10) {
        return `📉 Revenue is ${Math.abs(changePercent)}% lower than previous period. Consider promotional activities.`;
      }
      return `📊 Revenue is stable (${changePercent >= 0 ? '+' : ''}${changePercent}% vs previous period).`;
      
    case 'students':
      return `👥 ${data.length} active students. ${changePercent >= 0 ? 'Growing' : 'Declining'} ${Math.abs(changePercent)}% vs previous period.`;
      
    case 'sessions':
      return `🎾 ${data.length} sessions completed. ${direction === 'up' ? 'Increased' : 'Decreased'} activity by ${Math.abs(changePercent)}%.`;
      
    case 'retention':
      const avgRetention = Math.round(currentTotal / data.length);
      return `🔄 Average retention rate: ${avgRetention}%. ${avgRetention > 70 ? 'Excellent!' : avgRetention > 50 ? 'Room for improvement.' : 'Needs attention.'}`;
      
    default:
      return `Data shows ${direction === 'up' ? 'positive' : 'negative'} trend (${changePercent}%).`;
  }
}
