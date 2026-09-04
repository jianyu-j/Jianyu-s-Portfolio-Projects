/**
 * Coach Consistency Panel
 * Shows grading calibration metrics across coaches
 * Helps clubs identify if coaches are grading consistently
 */

import React, { useMemo } from 'react';
import { Coach, Session, Student } from '../../../types';

// SVG Icon
const ExclamationIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

interface CoachConsistencyPanelProps {
    coaches: Coach[];
    sessions: Session[];
    students: Student[];
}

interface CoachGradingStats {
    coach: Coach;
    avgScore: number;
    sessionCount: number;
    deviation: number; // From club average
    studentsEvaluated: number;
}

const CoachConsistencyPanel: React.FC<CoachConsistencyPanelProps> = ({
    coaches,
    sessions,
    students
}) => {
    // Calculate grading consistency metrics
    const consistencyData = useMemo(() => {
        if (sessions.length === 0) return { clubAverage: 0, coachStats: [], alerts: [] };

        // Calculate each coach's average evaluation score
        const coachStats: CoachGradingStats[] = coaches.map(coach => {
            const coachSessions = sessions.filter(s => s.coachId === coach.id);
            const avgScore = coachSessions.length > 0
                ? coachSessions.reduce((sum, s) => sum + s.finalScore, 0) / coachSessions.length
                : 0;
            const uniqueStudents = new Set(coachSessions.map(s => s.studentId)).size;

            return {
                coach,
                avgScore,
                sessionCount: coachSessions.length,
                deviation: 0, // Will calculate after club average
                studentsEvaluated: uniqueStudents
            };
        }).filter(c => c.sessionCount > 0);

        // Calculate club average
        const clubAverage = coachStats.length > 0
            ? coachStats.reduce((sum, c) => sum + c.avgScore, 0) / coachStats.length
            : 0;

        // Calculate deviations
        coachStats.forEach(c => {
            c.deviation = c.avgScore - clubAverage;
        });

        // Sort by deviation (highest first)
        coachStats.sort((a, b) => b.deviation - a.deviation);

        // Generate alerts for significant deviations (more than 5 points)
        const alerts: string[] = [];
        const highGraders = coachStats.filter(c => c.deviation > 5);
        const lowGraders = coachStats.filter(c => c.deviation < -5);

        if (highGraders.length > 0 && lowGraders.length > 0) {
            const gap = highGraders[0].avgScore - lowGraders[lowGraders.length - 1].avgScore;
            alerts.push(
                `${highGraders[0].coach.name} and ${lowGraders[lowGraders.length - 1].coach.name} have a ${gap.toFixed(1)} point grading gap. Consider a calibration session.`
            );
        }

        return { clubAverage, coachStats, alerts };
    }, [coaches, sessions]);

    // Find coaches who evaluated the same students for comparison
    const crossEvaluations = useMemo(() => {
        const studentCoachMap: Record<string, { coachId: string; avgScore: number }[]> = {};

        // Group sessions by student
        sessions.forEach(session => {
            if (!studentCoachMap[session.studentId]) {
                studentCoachMap[session.studentId] = [];
            }
            
            const existing = studentCoachMap[session.studentId].find(e => e.coachId === session.coachId);
            if (existing) {
                // Update average
                const coachSessions = sessions.filter(s => s.studentId === session.studentId && s.coachId === session.coachId);
                existing.avgScore = coachSessions.reduce((sum, s) => sum + s.finalScore, 0) / coachSessions.length;
            } else {
                const coachSessions = sessions.filter(s => s.studentId === session.studentId && s.coachId === session.coachId);
                studentCoachMap[session.studentId].push({
                    coachId: session.coachId,
                    avgScore: coachSessions.reduce((sum, s) => sum + s.finalScore, 0) / coachSessions.length
                });
            }
        });

        // Find students with multiple coaches
        const multiCoachStudents = Object.entries(studentCoachMap)
            .filter(([_, coaches]) => coaches.length >= 2)
            .map(([studentId, coachScores]) => {
                const student = students.find(s => s.id === studentId);
                return {
                    student,
                    coachScores: coachScores.map(cs => ({
                        coach: coaches.find(c => c.id === cs.coachId),
                        avgScore: cs.avgScore
                    }))
                };
            })
            .filter(item => item.student);

        return multiCoachStudents;
    }, [sessions, students, coaches]);

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📏</span> Grading Consistency
                </h3>
                <p className="text-gray-500 text-center py-8">No evaluation data available yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span>📏</span> Grading Consistency
                </h3>
                <p className="text-xs text-gray-500 mt-1">Are coaches grading students consistently?</p>
            </div>

            <div className="p-4">
                {/* Club Average */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Club Average Score</p>
                            <p className="text-3xl font-bold text-gray-900">{consistencyData.clubAverage.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold">Total Evaluations</p>
                            <p className="text-2xl font-bold text-gray-600">{sessions.length}</p>
                        </div>
                    </div>
                </div>

                {/* Coach Deviation Chart */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold">Coach Grading Deviation</p>
                    {consistencyData.coachStats.map((stat) => {
                        const isHigh = stat.deviation > 5;
                        const isLow = stat.deviation < -5;
                        const barWidth = Math.min(Math.abs(stat.deviation) * 10, 100);
                        const isPositive = stat.deviation >= 0;

                        return (
                            <div key={stat.coach.id} className="flex items-center gap-3">
                                <div className="w-28 text-sm font-medium text-gray-700 truncate">
                                    {stat.coach.name}
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    {/* Left side (negative) */}
                                    <div className="flex-1 flex justify-end">
                                        {!isPositive && (
                                            <div 
                                                className={`h-6 rounded-l ${isLow ? 'bg-red-400' : 'bg-blue-300'}`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        )}
                                    </div>
                                    {/* Center line */}
                                    <div className="w-px h-8 bg-gray-300" />
                                    {/* Right side (positive) */}
                                    <div className="flex-1">
                                        {isPositive && (
                                            <div 
                                                className={`h-6 rounded-r ${isHigh ? 'bg-yellow-400' : 'bg-green-300'}`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={`w-20 text-right text-sm font-bold ${
                                    isHigh ? 'text-yellow-600' : isLow ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {stat.deviation >= 0 ? '+' : ''}{stat.deviation.toFixed(1)}
                                    {(isHigh || isLow) && <ExclamationIcon className="w-4 h-4 inline ml-1 text-yellow-500" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-300 rounded" />
                        <span>Within range</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded" />
                        <span>Grades high</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-400 rounded" />
                        <span>Grades low</span>
                    </div>
                </div>

                {/* Alerts */}
                {consistencyData.alerts.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                            <ExclamationIcon className="w-5 h-5 text-yellow-600" /> Calibration Alert
                        </p>
                        {consistencyData.alerts.map((alert, i) => (
                            <p key={i} className="text-sm text-yellow-700 mt-2">{alert}</p>
                        ))}
                    </div>
                )}

                {/* Cross-Evaluations (same student, different coaches) */}
                {crossEvaluations.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-3">
                            Multi-Coach Evaluations ({crossEvaluations.length} students)
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {crossEvaluations.slice(0, 5).map((item, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-800 mb-2">
                                        {item.student?.name}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.coachScores.map((cs, i) => (
                                            <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                                {cs.coach?.name}: <strong>{cs.avgScore.toFixed(1)}</strong>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachConsistencyPanel;
