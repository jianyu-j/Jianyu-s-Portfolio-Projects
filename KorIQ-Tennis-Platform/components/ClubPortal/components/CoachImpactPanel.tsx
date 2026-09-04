/**
 * Coach Impact Panel
 * Shows which coaches are driving the most student progress/level-ups
 * Helps clubs identify their most effective coaches
 */

import React, { useMemo } from 'react';
import { Coach, Session, Student, NtrpLevel } from '../../../types';

// SVG Icons
const TrophyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const LightBulbIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

interface CoachImpactPanelProps {
    coaches: Coach[];
    sessions: Session[];
    students: Student[];
}

interface CoachImpactStats {
    coach: Coach;
    studentsLeveledUp: number;
    totalStudents: number;
    levelUpRate: number; // percentage
    avgImprovement: number; // NTRP points
    levelUpDetails: { student: Student; from: string; to: string }[];
}

// Convert NTRP level to numeric value for comparison
const ntrpToNumber = (level: NtrpLevel | string): number => {
    const mapping: Record<string, number> = {
        [NtrpLevel.L10_15]: 1.25,
        [NtrpLevel.L20_25]: 2.25,
        [NtrpLevel.L30]: 3.0,
        [NtrpLevel.L35]: 3.5,
        [NtrpLevel.L40]: 4.0,
        [NtrpLevel.L45]: 4.5,
        [NtrpLevel.L50]: 5.0,
        [NtrpLevel.L55]: 5.5,
        [NtrpLevel.L60]: 6.0,
    };
    return mapping[level] || 3.0;
};

const CoachImpactPanel: React.FC<CoachImpactPanelProps> = ({
    coaches,
    sessions,
    students
}) => {
    // Calculate coach impact on student progress
    const impactData = useMemo(() => {
        const coachStats: CoachImpactStats[] = coaches.map(coach => {
            // Get students assigned to this coach
            const coachStudents = students.filter(s => s.primaryCoachId === coach.id);
            
            // Find students who leveled up (startingNtrp !== currentNtrp)
            const leveledUp = coachStudents.filter(s => 
                s.startingNtrp && s.startingNtrp !== s.currentNtrp
            );

            // Calculate average improvement
            let totalImprovement = 0;
            const levelUpDetails: { student: Student; from: string; to: string }[] = [];

            leveledUp.forEach(student => {
                if (student.startingNtrp) {
                    const improvement = ntrpToNumber(student.currentNtrp) - ntrpToNumber(student.startingNtrp);
                    totalImprovement += improvement;
                    levelUpDetails.push({
                        student,
                        from: student.startingNtrp,
                        to: student.currentNtrp
                    });
                }
            });

            const avgImprovement = leveledUp.length > 0 ? totalImprovement / leveledUp.length : 0;
            const levelUpRate = coachStudents.length > 0 
                ? (leveledUp.length / coachStudents.length) * 100 
                : 0;

            return {
                coach,
                studentsLeveledUp: leveledUp.length,
                totalStudents: coachStudents.length,
                levelUpRate,
                avgImprovement,
                levelUpDetails
            };
        }).filter(c => c.totalStudents > 0);

        // Sort by level-ups (highest first)
        coachStats.sort((a, b) => b.studentsLeveledUp - a.studentsLeveledUp);

        // Calculate totals
        const totalLevelUps = coachStats.reduce((sum, c) => sum + c.studentsLeveledUp, 0);
        const avgLevelUpRate = coachStats.length > 0
            ? coachStats.reduce((sum, c) => sum + c.levelUpRate, 0) / coachStats.length
            : 0;

        return { coachStats, totalLevelUps, avgLevelUpRate };
    }, [coaches, students]);

    if (students.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-yellow-500" /> Coach Impact on Progress
                </h3>
                <p className="text-gray-500 text-center py-8">No student data available yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-yellow-500" /> Coach Impact on Progress
                </h3>
                <p className="text-xs text-gray-500 mt-1">Which coaches are developing players most effectively?</p>
            </div>

            <div className="p-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 uppercase font-bold">Total Level-Ups</p>
                        <p className="text-3xl font-bold text-green-700">{impactData.totalLevelUps}</p>
                        <p className="text-xs text-green-600 mt-1">students progressed</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 uppercase font-bold">Avg Level-Up Rate</p>
                        <p className="text-3xl font-bold text-blue-700">{impactData.avgLevelUpRate.toFixed(0)}%</p>
                        <p className="text-xs text-blue-600 mt-1">of students improved</p>
                    </div>
                </div>

                {/* Coach Leaderboard */}
                <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3">Coach Leaderboard</p>
                    <div className="space-y-3">
                        {impactData.coachStats.map((stat, idx) => {
                            const impactPercent = impactData.totalLevelUps > 0
                                ? (stat.studentsLeveledUp / impactData.totalLevelUps) * 100
                                : 0;

                            return (
                                <div key={stat.coach.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                                idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-gray-300'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{stat.coach.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {stat.totalStudents} students assigned
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">{stat.studentsLeveledUp}</p>
                                            <p className="text-xs text-gray-500">level-ups</p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Impact share</span>
                                            <span>{impactPercent.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{ width: `${impactPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Metrics row */}
                                    <div className="mt-3 flex gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">Rate:</span>
                                            <span className={`font-bold ${stat.levelUpRate >= 50 ? 'text-green-600' : 'text-gray-600'}`}>
                                                {stat.levelUpRate.toFixed(0)}%
                                            </span>
                                        </div>
                                        {stat.avgImprovement > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400">Avg:</span>
                                                <span className="font-bold text-blue-600">
                                                    +{stat.avgImprovement.toFixed(1)} NTRP
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Level-up details */}
                                    {stat.levelUpDetails.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 mb-2">Recent progressions:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {stat.levelUpDetails.slice(0, 3).map((detail, i) => (
                                                    <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                                        {detail.student.name}: {detail.from} → {detail.to}
                                                    </span>
                                                ))}
                                                {stat.levelUpDetails.length > 3 && (
                                                    <span className="text-xs text-gray-400">
                                                        +{stat.levelUpDetails.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Insight */}
                {impactData.coachStats.length >= 2 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-700">
                            <LightBulbIcon className="w-4 h-4 inline mr-1" /> <strong>Insight:</strong>{' '}
                            {impactData.coachStats[0].coach.name}'s students have a {impactData.coachStats[0].levelUpRate.toFixed(0)}% level-up rate.
                            {impactData.coachStats[0].levelUpRate > impactData.avgLevelUpRate && (
                                <> That's {(impactData.coachStats[0].levelUpRate - impactData.avgLevelUpRate).toFixed(0)}% above the club average. Consider having them share their teaching methods.</>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachImpactPanel;
