import React, { useMemo, useState, useEffect } from 'react';
import { Student, Session, StrokeType, NtrpLevel, PhysicalLogEntry } from '../../types';
import { RadarVis } from '../Charts/RadarVis';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend } from 'recharts';
import { formatDate, identifyWeaknesses, mapScoreToNextLevel, mapScoreToPrevLevel, getNtrpWeights, FUNDAMENTAL_CRITERIA_DESCRIPTIONS, getPhysicalStandards } from '../../utils/calculations';
import { storageService } from '../../services/storageService';

interface StudentAnalyticsProps {
    student: Student;
    sessions: Session[];
}

export const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ student, sessions }) => {
    // ---- STATE FOR FILTERS ----
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
    const [monthFilter, setMonthFilter] = useState<string>('All');
    const [coachFilter, setCoachFilter] = useState<string>('All');
    const [strokeFilter, setStrokeFilter] = useState<string>('Final Score');
    
    // ---- STATE FOR PHYSICAL HISTORY ----
    const [physicalLogs, setPhysicalLogs] = useState<PhysicalLogEntry[]>([]);
    const [physicalView, setPhysicalView] = useState<'Weekly' | 'Monthly'>('Weekly');

    // ---- STATE FOR DETAILS EXPANSION ----
    const [showTennisDetails, setShowTennisDetails] = useState(false);
    const [expandedStroke, setExpandedStroke] = useState<StrokeType | null>(null);
    const [showPhysicalDetails, setShowPhysicalDetails] = useState(false);

    useEffect(() => {
        setPhysicalLogs(storageService.getPhysicalLogs(student.id));
    }, [student.id]);

    // ---- DERIVED DATA ----
    
    // 1. Unique Lists for Dropdowns
    const availableYears = useMemo(() => Array.from(new Set(sessions.map(s => new Date(s.date).getFullYear().toString()))).sort(), [sessions]);
    const availableCoaches = useMemo(() => Array.from(new Set(sessions.map(s => s.coachId))), [sessions]);
    const strokeOptions = ['Final Score', ...Object.values(StrokeType)];

    // 2. Filtered Sessions for Line Chart (NTRP)
    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const date = new Date(s.date);
            const matchesYear = date.getFullYear().toString() === yearFilter;
            const matchesMonth = monthFilter === 'All' || date.toLocaleString('default', { month: 'long' }) === monthFilter;
            const matchesCoach = coachFilter === 'All' || s.coachId === coachFilter;
            return matchesYear && matchesMonth && matchesCoach;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [sessions, yearFilter, monthFilter, coachFilter]);

    // 3. Line Chart Data Mapping (NTRP)
    const lineChartData = useMemo(() => {
        return filteredSessions.map(s => {
            let val = 0;
            switch(strokeFilter) {
                case 'Final Score': val = s.finalScore; break;
                case 'Forehand': val = s.fundamentals.fhScore * 10; break; 
                case 'Backhand': val = s.fundamentals.bhScore * 10; break;
                case 'Serve': val = s.fundamentals.serveScore * 10; break;
                case 'Volley': val = s.fundamentals.volleyScore * 10; break;
            }
            return {
                date: monthFilter === 'All' ? new Date(s.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : new Date(s.date).toLocaleDateString(),
                score: val,
                ntrp: s.ntrpLevel
            };
        });
    }, [filteredSessions, strokeFilter, monthFilter]);

    // 4. Physical Line Chart Data (Raw Entries)
    const physicalChartData = useMemo(() => {
        if (physicalLogs.length === 0) return [];

        // Determine date range based on view
        const now = new Date();
        const cutoffDate = new Date();
        
        if (physicalView === 'Weekly') {
             // Show last 12 weeks of entries to show "Weekly Progression" context
             cutoffDate.setDate(now.getDate() - (12 * 7));
        } else {
             // Show last 12 months of entries to show "Monthly Progression" context
             cutoffDate.setMonth(now.getMonth() - 12);
        }

        // Filter and map raw entries (No averaging)
        return physicalLogs
            .filter(log => new Date(log.date) >= cutoffDate)
            .map(log => ({
                name: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                dateFull: new Date(log.date).toLocaleDateString(),
                sleep: log.sleepHours,
                hydration: log.hydrationCups,
                nutrition: log.nutritionRating,
                cardio: log.cardioMinutes / 60, // Convert to hours for scale
                strength: log.strengthMinutes / 60, // Convert to hours for scale
            }));
    }, [physicalLogs, physicalView]);

    // 5. Current / Latest Stats (NTRP)
    const latestStats = useMemo(() => {
        if (sessions.length === 0) return null;
        const coachSessions: Record<string, Session[]> = {};
        sessions.forEach(s => {
            if (!coachSessions[s.coachId]) coachSessions[s.coachId] = [];
            coachSessions[s.coachId].push(s);
        });
        const latestFromCoaches = Object.values(coachSessions).map(arr => arr[arr.length - 1]);
        
        const count = latestFromCoaches.length;
        const avg = { fh: 0, bh: 0, serve: 0, volley: 0, final: 0 };
        latestFromCoaches.forEach(s => {
            avg.fh += s.fundamentals.fhScore;
            avg.bh += s.fundamentals.bhScore;
            avg.serve += s.fundamentals.serveScore;
            avg.volley += s.fundamentals.volleyScore;
            avg.final += s.finalScore;
        });

        const absoluteLatest = sessions[sessions.length - 1];

        return {
            fh: avg.fh / count,
            bh: avg.bh / count,
            serve: avg.serve / count,
            volley: avg.volley / count,
            finalScore: (avg.final / count).toFixed(1),
            metadata: absoluteLatest
        };
    }, [sessions]);

    // 6. Radar Data - Skills
    const radarDataSkills = useMemo(() => {
        if (!latestStats) return [];
        return [
            { subject: StrokeType.FH, A: latestStats.fh, fullMark: 10 },
            { subject: StrokeType.BH, A: latestStats.bh, fullMark: 10 },
            { subject: StrokeType.Serve, A: latestStats.serve, fullMark: 10 },
            { subject: StrokeType.Volley, A: latestStats.volley, fullMark: 10 },
        ];
    }, [latestStats]);

    // 7. Radar Data - Physical
    const radarDataPhysical = useMemo(() => {
        if (!student.physicalAttributes) return [];
        const p = student.physicalAttributes;
        const isKid = student.age < 10;
        
        return [
            { subject: 'Sleep', A: p.sleepHours, fullMark: 12 },
            { subject: 'Water', A: p.hydrationCups, fullMark: 15 },
            { subject: 'Nutrition', A: p.nutritionRating, fullMark: 10 },
            { subject: isKid ? 'Play' : 'Cardio', A: p.cardioMinutes / (isKid ? 10 : 30), fullMark: 10 },
            { subject: 'Strength', A: p.strengthMinutes / 15, fullMark: 10 },
        ];
    }, [student.physicalAttributes, student.age]);

    // 8. Transition Logic
    const transitionInfo = useMemo(() => {
        if (!latestStats) return null;
        const score = parseFloat(latestStats.finalScore);
        
        const currentLevel = latestStats.metadata.ntrpLevel;
        const currentLevelScore = score; 
        
        let nextLevelScore = 0;
        let showNextLevel = false;

        if (score >= 80) {
            nextLevelScore = mapScoreToNextLevel(score / 10);
            if (nextLevelScore <= 20) {
                showNextLevel = true;
            }
        }

        return { currentLevel, currentLevelScore, showNextLevel, nextLevelScore };
    }, [latestStats]);


    // ---- RENDER HELPERS ----
    const renderDropdowns = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
            <select value={coachFilter} onChange={e => setCoachFilter(e.target.value)} className="p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Coaches (Avg)</option>
                {availableCoaches.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={strokeFilter} onChange={e => setStrokeFilter(e.target.value)} className="p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {strokeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
    );

    const renderTransitionBar = () => {
        if (!transitionInfo) return null;
        return (
            <div className="mb-6 space-y-3">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold">NTRP {transitionInfo.currentLevel}</span>
                        <span>{transitionInfo.currentLevelScore.toFixed(1)} / 100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-tennis-600 h-3 rounded-full transition-all" style={{ width: `${Math.min(transitionInfo.currentLevelScore, 100)}%` }}></div>
                    </div>
                </div>
                
                {transitionInfo.showNextLevel && (
                     <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-tennis-600">Next Level Progress (Unlock Phase)</span>
                            <span>{transitionInfo.nextLevelScore.toFixed(1)} / 20</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-yellow-400 h-3 rounded-full transition-all" style={{ width: `${(transitionInfo.nextLevelScore / 20) * 100}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">* Old level visible until new level reaches 2.0 (20 pts)</p>
                    </div>
                )}
            </div>
        );
    };

    const renderTennisDetails = () => {
        if (!latestStats) return null;
        const weights = getNtrpWeights(latestStats.metadata.ntrpLevel);
        const session = latestStats.metadata;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-tennis-800">Evaluation Details</h3>
                    <button onClick={() => { setShowTennisDetails(false); setExpandedStroke(null); }} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                {/* Section 1: Fundamentals */}
                <div className="mb-6">
                    <h4 className="font-bold text-sm text-gray-700 mb-2 border-b pb-1">1. Fundamentals (Weight: {weights.fund * 100}%)</h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        {Object.values(StrokeType).map(stroke => {
                            const scoreKey = stroke === StrokeType.FH ? 'fhScore' : stroke === StrokeType.BH ? 'bhScore' : stroke === StrokeType.Serve ? 'serveScore' : 'volleyScore';
                            const val = session.fundamentals[scoreKey] as number;
                            return (
                                <button 
                                    key={stroke} 
                                    onClick={() => setExpandedStroke(stroke === expandedStroke ? null : stroke)}
                                    className={`p-3 rounded text-left text-sm flex justify-between items-center ${expandedStroke === stroke ? 'bg-tennis-100 border-tennis-300 ring-1 ring-tennis-500' : 'bg-white border hover:bg-gray-50'}`}
                                >
                                    <span>{stroke}</span>
                                    <span className={`font-bold ${val >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                                        {val.toFixed(1)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {/* Expanded Stroke Details */}
                    {expandedStroke && session.fundamentals[expandedStroke] && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-gray-700 space-y-2 mt-2">
                        <p className="font-bold text-blue-800 text-sm mb-2">{expandedStroke} Breakdown Criteria:</p>
                        {Object.entries(FUNDAMENTAL_CRITERIA_DESCRIPTIONS[expandedStroke]).map(([key, desc]) => (
                             <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-blue-100 pb-1 last:border-0">
                                <span className="font-bold w-20 capitalize text-blue-700">{key}:</span>
                                <span>{desc}</span>
                             </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Section 2: Performance */}
                <div className="mb-6">
                     <h4 className="font-bold text-sm text-gray-700 mb-2 border-b pb-1">2. Performance (Weight: {weights.perf * 100}%)</h4>
                     <p className="text-xs text-gray-500 mb-2">Criteria for NTRP {session.ntrpLevel}</p>
                     <div className="space-y-2">
                        {Object.entries(session.performance.scores).map(([key, score]) => (
                            <div key={key} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                <span>{key}</span>
                                <span className="font-bold">{score.toFixed(1)}</span>
                            </div>
                        ))}
                     </div>
                     <div className="mt-4 text-right font-bold text-sm">Average: {session.performance.average.toFixed(1)}</div>
                </div>

                {/* Section 3: Final Score */}
                <div className="bg-tennis-50 p-4 rounded border border-tennis-100 text-sm">
                    <h4 className="font-bold text-tennis-800">Final Weighted Score</h4>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">({session.fundamentals.average.toFixed(1)} × {weights.fund}) + ({session.performance.average.toFixed(1)} × {weights.perf})</span>
                        <span className="text-2xl font-bold text-tennis-700">{session.finalScore.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            </div>
        );
    };

    const renderPhysicalDetails = () => {
        if (!student.physicalAttributes) return null;
        const p = student.physicalAttributes;
        const s = getPhysicalStandards(student.age);
        const isKid = student.age < 10;
        
        const getStatus = (val: number, target: number) => val >= target ? "text-green-600" : val >= target * 0.8 ? "text-yellow-600" : "text-red-600";
        
        return (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-tennis-800">Physical Analysis</h3>
                    <button onClick={() => setShowPhysicalDetails(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-3">Attribute</th>
                                <th className="p-3">Your Input</th>
                                <th className="p-3">Recommended</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="p-3 font-medium">Sleep</td>
                                <td className={`p-3 font-bold ${getStatus(p.sleepHours, s.sleepHours)}`}>{p.sleepHours} hrs</td>
                                <td className="p-3 text-gray-500">{s.sleepHours}+ hrs</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Hydration</td>
                                <td className={`p-3 font-bold ${getStatus(p.hydrationCups, s.hydrationCups)}`}>{p.hydrationCups} cups</td>
                                <td className="p-3 text-gray-500">{s.hydrationCups}+ cups</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Nutrition</td>
                                <td className={`p-3 font-bold ${getStatus(p.nutritionRating, 8)}`}>{p.nutritionRating}/10</td>
                                <td className="p-3 text-gray-500">8+</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">{isKid ? 'Play' : 'Cardio'}</td>
                                <td className={`p-3 font-bold ${getStatus(p.cardioMinutes, s.cardioMinutes)}`}>{p.cardioMinutes} min</td>
                                <td className="p-3 text-gray-500">{s.cardioMinutes}+ min</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Strength</td>
                                <td className={`p-3 font-bold ${getStatus(p.strengthMinutes, s.strengthMinutes)}`}>{p.strengthMinutes} min</td>
                                <td className="p-3 text-gray-500">{s.strengthMinutes}+ min</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
             </div>
             </div>
        );
    }

    if (!latestStats && !student.physicalAttributes) return <div className="p-4 text-center text-gray-400">No session data available.</div>;

    return (
        <div className="space-y-8">
            {/* Header / Score Card */}
            <div className="bg-tennis-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold">{student.name}</h1>
                    <p className="opacity-90 text-sm">NTRP {latestStats?.metadata.ntrpLevel || student.currentNtrp}</p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-tennis-500 rounded-full opacity-50" />
            </div>
            
            {/* Transition Bars */}
            {renderTransitionBar()}

            {/* Radar Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Tennis Radar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-center mb-1">Tennis Skills</h3>
                    <p className="text-center text-xs text-gray-400 mb-4">Click chart for details</p>
                    {latestStats ? (
                         <RadarVis 
                            data={radarDataSkills} 
                            dataKey="A" 
                            onClick={() => setShowTennisDetails(!showTennisDetails)} 
                        />
                    ) : <p className="text-center text-gray-400 py-10">No evaluation data</p>}
                   
                    {showTennisDetails && renderTennisDetails()}
                </div>

                {/* 2. Physical Radar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-center mb-1">Physical Attributes</h3>
                    <p className="text-center text-xs text-gray-400 mb-4">Click chart for details</p>
                    {student.physicalAttributes ? (
                        <RadarVis 
                            data={radarDataPhysical} 
                            dataKey="A"
                            strokeColor="#2563eb"
                            fillColor="#3b82f6"
                            onClick={() => setShowPhysicalDetails(!showPhysicalDetails)} 
                        />
                    ) : <p className="text-center text-gray-400 py-10">No physical data</p>}
                    
                    {showPhysicalDetails && renderPhysicalDetails()}
                </div>
            </div>

            {/* Line Chart: NTRP History */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Tennis Progression History</h3>
                {renderDropdowns()}
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{fontSize: 10}} interval="preserveStartEnd" />
                            <YAxis domain={[0, 100]} />
                            <ReTooltip />
                            <Line type="monotone" dataKey="score" stroke="#2e7d32" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {latestStats && (
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="font-bold text-sm text-gray-700 mb-2">Gap Analysis</h4>
                        <div className="text-sm text-gray-600">
                            {identifyWeaknesses(latestStats.metadata).map((w, i) => (
                                <span key={i} className="inline-block bg-red-50 text-red-700 px-2 py-1 rounded mr-2 mb-1 text-xs">
                                    Needs work: {w.name} ({w.score.toFixed(1)})
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Line Chart: Physical History */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">Physical Progression History</h3>
                    <select 
                        value={physicalView} 
                        onChange={e => setPhysicalView(e.target.value as any)} 
                        className="p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Weekly">Weekly Progression</option>
                        <option value="Monthly">Monthly Progression</option>
                    </select>
                </div>
                <div className="h-[250px] w-full">
                    {physicalChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={physicalChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis domain={[0, 15]} label={{ value: 'Score / Hours', angle: -90, position: 'insideLeft', fontSize: 10 }}/>
                                <ReTooltip 
                                    labelFormatter={(label, payload) => {
                                        if (payload && payload[0]) return payload[0].payload.dateFull;
                                        return label;
                                    }}
                                />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                                <Line name="Sleep (hrs)" type="monotone" dataKey="sleep" stroke="#8884d8" strokeWidth={2} dot={{r: 3}} />
                                <Line name="Hydration (cups)" type="monotone" dataKey="hydration" stroke="#82ca9d" strokeWidth={2} dot={{r: 3}} />
                                <Line name="Nutrition (1-10)" type="monotone" dataKey="nutrition" stroke="#ffc658" strokeWidth={2} dot={{r: 3}} />
                                <Line name="Cardio (hrs)" type="monotone" dataKey="cardio" stroke="#ff7300" strokeWidth={2} dot={{r: 3}} />
                                <Line name="Strength (hrs)" type="monotone" dataKey="strength" stroke="#000000" strokeWidth={2} dot={{r: 3}} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">No physical logs yet. Update your attributes to see history.</div>
                    )}
                </div>
            </div>
        </div>
    );
};