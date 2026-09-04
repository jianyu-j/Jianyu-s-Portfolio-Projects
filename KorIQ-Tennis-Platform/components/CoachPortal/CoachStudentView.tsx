import React, { useEffect, useState, useMemo } from 'react';
import { Student, Session, CoachRating, Coach } from '../../types';
import { storageService } from '../../services/storageService';
import { Button } from '../ui/Button';
import { StudentAnalytics } from '../Shared/StudentAnalytics';

interface CoachStudentViewProps {
    student: Student;
    onBack: () => void;
    onEvaluate: () => void;
    viewMode?: 'COACH' | 'CLUB' | 'CLUB_COACH'; // Added CLUB_COACH for club employees
}

type StudentViewTab = 'PROGRESS' | 'EVALUATIONS' | 'COACH_HISTORY' | 'FEEDBACK';

export const CoachStudentView: React.FC<CoachStudentViewProps> = ({ student, onBack, onEvaluate, viewMode = 'COACH' }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [allClubSessions, setAllClubSessions] = useState<Session[]>([]);
    const [feedback, setFeedback] = useState<CoachRating[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [activeTab, setActiveTab] = useState<StudentViewTab>('PROGRESS');

    useEffect(() => {
        // Get sessions for this student
        setSessions(storageService.getSessions(student.id));

        // For club views, also get all club sessions and coaches
        if (viewMode === 'CLUB' || viewMode === 'CLUB_COACH') {
            setFeedback(storageService.getStudentRatings(student.id));
            setCoaches(storageService.getCoaches());
            // Get all sessions to show multi-coach data
            const allSessions = storageService.getSessions();
            setAllClubSessions(allSessions.filter(s => s.studentId === student.id));
        }
    }, [student.id, viewMode]);

    // Calculate multi-coach average score
    const multiCoachData = useMemo(() => {
        if (allClubSessions.length === 0) return null;

        // Group sessions by coach
        const coachSessions: Record<string, Session[]> = {};
        allClubSessions.forEach(session => {
            if (!coachSessions[session.coachId]) {
                coachSessions[session.coachId] = [];
            }
            coachSessions[session.coachId].push(session);
        });

        // Calculate average score per coach
        const coachAverages = Object.entries(coachSessions).map(([coachId, sessions]) => {
            const coach = coaches.find(c => c.id === coachId);
            const avgScore = sessions.reduce((sum, s) => sum + s.finalScore, 0) / sessions.length;
            const latestSession = sessions.sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
            return {
                coachId,
                coachName: coach?.name || session.coachName || 'Unknown Coach',
                sessionCount: sessions.length,
                avgScore,
                latestSession,
                firstSession: sessions.sort((a, b) => 
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )[0]
            };
        });

        // Calculate combined average
        const combinedAvg = coachAverages.length > 0
            ? coachAverages.reduce((sum, c) => sum + c.avgScore, 0) / coachAverages.length
            : 0;

        // Sort by session count (primary coach first)
        coachAverages.sort((a, b) => b.sessionCount - a.sessionCount);

        return {
            coachAverages,
            combinedAvg,
            totalSessions: allClubSessions.length,
            uniqueCoaches: coachAverages.length
        };
    }, [allClubSessions, coaches]);

    // Tab configuration for club coach view
    const tabs: { id: StudentViewTab; label: string; show: boolean }[] = [
        { id: 'PROGRESS', label: 'Progress', show: true },
        { id: 'EVALUATIONS', label: 'All Evaluations', show: viewMode === 'CLUB_COACH' || viewMode === 'CLUB' },
        { id: 'COACH_HISTORY', label: 'Coach History', show: viewMode === 'CLUB_COACH' || viewMode === 'CLUB' },
        { id: 'FEEDBACK', label: 'Feedback', show: viewMode === 'CLUB' }
    ].filter(t => t.show);

    // Render Evaluations Tab
    const renderEvaluationsTab = () => {
        if (!multiCoachData || allClubSessions.length === 0) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-center py-8">No evaluations yet.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Combined Score Display */}
                <div className="bg-gradient-to-r from-tennis-600 to-tennis-700 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-tennis-100 text-sm uppercase font-bold">Combined Score</p>
                            <p className="text-4xl font-bold">{multiCoachData.combinedAvg.toFixed(1)}</p>
                            <p className="text-tennis-200 text-sm mt-1">
                                Average across {multiCoachData.uniqueCoaches} coach{multiCoachData.uniqueCoaches > 1 ? 'es' : ''}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-tennis-100 text-sm uppercase font-bold">Total Sessions</p>
                            <p className="text-3xl font-bold">{multiCoachData.totalSessions}</p>
                        </div>
                    </div>

                    {/* Coach breakdown */}
                    {multiCoachData.coachAverages.length > 1 && (
                        <div className="mt-4 pt-4 border-t border-tennis-500 flex flex-wrap gap-4">
                            {multiCoachData.coachAverages.map(ca => (
                                <div key={ca.coachId} className="bg-white/10 px-3 py-2 rounded-lg">
                                    <p className="text-sm font-medium">{ca.coachName}</p>
                                    <p className="text-lg font-bold">{ca.avgScore.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Evaluations List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">All Evaluations</h3>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {allClubSessions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(session => {
                                const coach = coaches.find(c => c.id === session.coachId);
                                return (
                                    <div key={session.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {coach?.name || session.coachName || 'Unknown Coach'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(session.date).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-tennis-600">
                                                    {session.finalScore.toFixed(1)}
                                                </p>
                                                <p className="text-xs text-gray-500">NTRP {session.ntrpLevel}</p>
                                            </div>
                                        </div>

                                        {/* Fundamentals breakdown */}
                                        <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                                            <div className="bg-gray-50 p-2 rounded text-center">
                                                <p className="text-gray-500">FH</p>
                                                <p className="font-bold text-gray-700">{session.fundamentals.fhScore.toFixed(1)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded text-center">
                                                <p className="text-gray-500">BH</p>
                                                <p className="font-bold text-gray-700">{session.fundamentals.bhScore.toFixed(1)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded text-center">
                                                <p className="text-gray-500">Serve</p>
                                                <p className="font-bold text-gray-700">{session.fundamentals.serveScore.toFixed(1)}</p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded text-center">
                                                <p className="text-gray-500">Volley</p>
                                                <p className="font-bold text-gray-700">{session.fundamentals.volleyScore.toFixed(1)}</p>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {session.notes && (
                                            <p className="mt-3 text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                                                "{session.notes}"
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Coach History Tab
    const renderCoachHistoryTab = () => {
        if (!multiCoachData || multiCoachData.coachAverages.length === 0) {
            return (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-center py-8">No coaching history yet.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span>👥</span> Coaching History
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {multiCoachData.uniqueCoaches} coach{multiCoachData.uniqueCoaches > 1 ? 'es have' : ' has'} worked with {student.name}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {multiCoachData.coachAverages.map((ca, idx) => {
                            const isPrimary = idx === 0;
                            const sessionDates = allClubSessions
                                .filter(s => s.coachId === ca.coachId)
                                .map(s => new Date(s.date))
                                .sort((a, b) => a.getTime() - b.getTime());
                            const firstDate = sessionDates[0];
                            const lastDate = sessionDates[sessionDates.length - 1];

                            // Find focus areas (strokes with highest scores)
                            const coachSessions = allClubSessions.filter(s => s.coachId === ca.coachId);
                            const avgFH = coachSessions.reduce((sum, s) => sum + s.fundamentals.fhScore, 0) / coachSessions.length;
                            const avgBH = coachSessions.reduce((sum, s) => sum + s.fundamentals.bhScore, 0) / coachSessions.length;
                            const avgServe = coachSessions.reduce((sum, s) => sum + s.fundamentals.serveScore, 0) / coachSessions.length;
                            const avgVolley = coachSessions.reduce((sum, s) => sum + s.fundamentals.volleyScore, 0) / coachSessions.length;
                            
                            const strokes = [
                                { name: 'Forehand', score: avgFH },
                                { name: 'Backhand', score: avgBH },
                                { name: 'Serve', score: avgServe },
                                { name: 'Volley', score: avgVolley }
                            ].sort((a, b) => b.score - a.score);

                            return (
                                <div key={ca.coachId} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                isPrimary ? 'bg-tennis-100 text-tennis-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                <span className="font-bold">{ca.coachName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-800">{ca.coachName}</p>
                                                    {isPrimary && (
                                                        <span className="text-xs bg-tennis-100 text-tennis-700 px-2 py-0.5 rounded-full font-medium">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {ca.sessionCount} session{ca.sessionCount > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-800">{ca.avgScore.toFixed(1)}</p>
                                            <p className="text-xs text-gray-500">avg score</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                        <span>First:</span>
                                        <span className="font-medium text-gray-700">
                                            {firstDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-gray-300">│</span>
                                        <span>Last:</span>
                                        <span className="font-medium text-gray-700">
                                            {lastDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Focus areas */}
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-1">Focus areas:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {strokes.slice(0, 2).map(s => (
                                                <span key={s.name} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                    {s.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Insight */}
                {multiCoachData.uniqueCoaches > 1 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-700">
                            💡 <strong>Insight:</strong> {student.name} has been trained by multiple coaches. 
                            {multiCoachData.coachAverages[0].coachName} is the primary coach with {multiCoachData.coachAverages[0].sessionCount} sessions.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Render Feedback Tab (for Club Admin)
    const renderFeedbackTab = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Feedback Given By This Student</h3>
            {feedback.length > 0 ? (
                <div className="space-y-4">
                    {feedback.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(r => {
                        const coachName = coaches.find(c => c.id === r.coachId)?.name || 'Unknown Coach';
                        return (
                            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <p className="text-xs text-gray-500 mb-1">To: <span className="font-bold text-gray-700">{coachName}</span></p>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-yellow-500 text-sm">{'⭐'.repeat(r.rating)}</span>
                                    <span className="font-bold text-gray-800 text-sm">{r.rating.toFixed(1)}</span>
                                    <span className="text-gray-600 text-sm italic">"{r.comment}"</span>
                                </div>
                                <p className="text-[10px] text-gray-400">{new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic">No feedback given yet.</p>
            )}
        </div>
    );

    return (
        <div className={viewMode === 'COACH' ? "pb-20" : "pb-6"}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={onBack}>← Back</Button>
                <div className="text-right">
                    <h2 className="font-bold text-gray-800">{student.name}</h2>
                    <p className="text-xs text-gray-500">NTRP {student.currentNtrp} • Age {student.age}</p>
                </div>
            </div>

            {/* Tabs - Only show for Club views */}
            {tabs.length > 1 && (
                <div className="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200 -mb-px">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                                activeTab === tab.id
                                    ? 'border-tennis-600 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Tab Content */}
            {activeTab === 'PROGRESS' && (
                <StudentAnalytics student={student} sessions={sessions} />
            )}
            {activeTab === 'EVALUATIONS' && renderEvaluationsTab()}
            {activeTab === 'COACH_HISTORY' && renderCoachHistoryTab()}
            {activeTab === 'FEEDBACK' && renderFeedbackTab()}

            {/* Evaluate Button - Only for COACH view */}
            {viewMode === 'COACH' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 w-full md:max-w-7xl mx-auto z-50">
                    <Button fullWidth onClick={onEvaluate} className="h-12 text-lg shadow-lg">
                        + New Evaluation
                    </Button>
                </div>
            )}

            {/* Evaluate Button - For Club Coach view */}
            {viewMode === 'CLUB_COACH' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 w-full md:max-w-7xl mx-auto z-50">
                    <Button fullWidth onClick={onEvaluate} className="h-12 text-lg shadow-lg">
                        + New Evaluation
                    </Button>
                </div>
            )}
        </div>
    );
};