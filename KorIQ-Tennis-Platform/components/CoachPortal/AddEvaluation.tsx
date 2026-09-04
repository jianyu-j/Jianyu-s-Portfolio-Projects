import React, { useState, useEffect } from 'react';
import { Student, NtrpLevel, StrokeType, FundamentalsInput, PerformanceInput, SessionType, Session } from '../../types';
import { Button } from '../ui/Button';
import { storageService } from '../../services/storageService';
import { calculateFundamentalsAverage, calculateFinalScore, getCriteriaForLevel } from '../../utils/calculations';

interface AddEvaluationProps {
    student: Student;
    onComplete: () => void;
}

const STROKES = [StrokeType.FH, StrokeType.BH, StrokeType.Serve, StrokeType.Volley];
const FUNDAMENTAL_PARTS = ['grip', 'setup', 'impact', 'swing', 'recovery'] as const;

export const AddEvaluation: React.FC<AddEvaluationProps> = ({ student, onComplete }) => {
    const [availableLevels, setAvailableLevels] = useState<NtrpLevel[]>([]);
    const [selectedNtrp, setSelectedNtrp] = useState<NtrpLevel>(student.currentNtrp);
    
    const [selectedStrokes, setSelectedStrokes] = useState<StrokeType[]>([]);
    const [fundamentals, setFundamentals] = useState<FundamentalsInput>({});
    
    const [sessionType, setSessionType] = useState<SessionType>('INDEPENDENT');

    // Dynamic Performance Criteria
    const [perfCriteria, setPerfCriteria] = useState<string[]>([]);
    const [performanceScores, setPerformanceScores] = useState<PerformanceInput>({});
    
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load & Level Lock Logic
    useEffect(() => {
        const sessions = storageService.getSessions(student.id);
        const allLevels = Object.values(NtrpLevel);
        
        if (sessions.length === 0) {
            // First evaluation: Allow coach to select any level
            setAvailableLevels(allLevels);
            setSelectedNtrp(student.currentNtrp);
        } else {
            // Subsequent: Locked unless threshold reached
            const latestSession = sessions[sessions.length - 1];
            const lockedLevel = latestSession.ntrpLevel;
            
            // Check threshold (score >= 80 i.e., 8.0)
            if (latestSession.finalScore >= 80) {
                // Unlock current AND next level
                const currentIndex = allLevels.indexOf(lockedLevel);
                const nextLevel = allLevels[currentIndex + 1];
                const allowed = [lockedLevel];
                if (nextLevel) allowed.push(nextLevel);
                
                setAvailableLevels(allowed);
                // Default to next level if available, else current
                setSelectedNtrp(nextLevel || lockedLevel);
            } else {
                setAvailableLevels([lockedLevel]);
                setSelectedNtrp(lockedLevel);
            }
        }
    }, [student.id, student.currentNtrp]);

    useEffect(() => {
        const criteria = getCriteriaForLevel(selectedNtrp);
        setPerfCriteria(criteria);
        // Initialize scores to 5.0
        const initialScores: PerformanceInput = {};
        criteria.forEach(c => initialScores[c] = 5.0);
        setPerformanceScores(initialScores);
    }, [selectedNtrp]);

    const toggleStrokeSelection = (stroke: StrokeType) => {
        setSelectedStrokes(prev => 
            prev.includes(stroke) 
                ? prev.filter(s => s !== stroke) 
                : [...prev, stroke]
        );
        
        // Initialize fundamental object if selecting with default 5.0 scores
        if (!fundamentals[stroke]) {
            setFundamentals(prev => ({
                ...prev,
                [stroke]: { grip: 5, setup: 5, impact: 5, swing: 5, recovery: 5 }
            }));
        }
    };

    const handleFundamentalSliderChange = (stroke: StrokeType, part: keyof typeof fundamentals[typeof stroke], value: number) => {
        setFundamentals(prev => ({
            ...prev,
            [stroke]: {
                ...prev[stroke]!,
                [part]: value
            }
        }));
    };

    const handlePerfChange = (criterion: string, value: number) => {
        setPerformanceScores(prev => ({ ...prev, [criterion]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const fundStats = calculateFundamentalsAverage(fundamentals);
        
        // Performance Average calculation
        const scores = Object.values(performanceScores) as number[];
        const perfAverage = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        
        const finalScore = calculateFinalScore(selectedNtrp, fundStats.average, perfAverage);

        const newSession = {
            id: Date.now().toString(),
            studentId: student.id,
            coachId: 'c1', // Mock logged in coach
            date: new Date().toISOString(),
            ntrpLevel: selectedNtrp,
            classType: '1-on-1',
            sessionType: sessionType,
            durationMinutes: 60,
            fundamentals: {
                fhScore: fundStats.fh,
                bhScore: fundStats.bh,
                serveScore: fundStats.serve,
                volleyScore: fundStats.volley,
                average: fundStats.average
            },
            performance: {
                scores: performanceScores,
                average: perfAverage
            },
            finalScore,
            notes
        };

        storageService.addSession(newSession as any);
        setTimeout(() => {
            setIsSubmitting(false);
            onComplete();
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">1. Session Details</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NTRP Level</label>
                            <select 
                                value={selectedNtrp} 
                                onChange={(e) => setSelectedNtrp(e.target.value as NtrpLevel)}
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tennis-500"
                            >
                                {availableLevels.length > 0 ? (
                                    availableLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))
                                ) : (
                                    <option value={selectedNtrp}>{selectedNtrp}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                            <select 
                                value={sessionType} 
                                onChange={(e) => setSessionType(e.target.value as SessionType)}
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tennis-500"
                            >
                                <option value="INDEPENDENT">Independent</option>
                                <option value="CLUB">Club</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">2. Fundamentals (TPA)</h3>
                <p className="text-xs text-gray-500 mb-4">Rate stroke components 1-10. Unselected stroke = 0.</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {STROKES.map(stroke => (
                        <button
                            key={stroke}
                            type="button"
                            onClick={() => toggleStrokeSelection(stroke)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedStrokes.includes(stroke)
                                    ? 'bg-tennis-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {stroke}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {selectedStrokes.map(stroke => (
                        <div key={stroke} className="border-t pt-4 animate-fadeIn">
                            <h4 className="font-semibold text-tennis-700 mb-3">{stroke}</h4>
                            <div className="space-y-4">
                                {FUNDAMENTAL_PARTS.map(part => {
                                    const val = fundamentals[stroke]?.[part] || 5;
                                    return (
                                        <div key={part}>
                                            <div className="flex justify-between mb-1">
                                                <label className="capitalize text-xs font-medium text-gray-600">{part}</label>
                                                <span className="text-tennis-600 text-xs font-bold">{val.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="0.1"
                                                value={val}
                                                onChange={(e) => handleFundamentalSliderChange(stroke, part, parseFloat(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tennis-600"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">3. Performance (Required)</h3>
                <p className="text-xs text-gray-500 mb-4">Evaluate based on NTRP {selectedNtrp} criteria.</p>
                <div className="space-y-6">
                    {perfCriteria.map((criterion) => (
                        <div key={criterion}>
                            <div className="flex justify-between mb-2">
                                <label className="capitalize text-sm font-medium text-gray-700">{criterion}</label>
                                <span className="text-tennis-600 font-bold">{(performanceScores[criterion] || 5).toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="0.1"
                                value={performanceScores[criterion] || 5}
                                onChange={(e) => handlePerfChange(criterion, parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tennis-600"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="block font-bold text-gray-800 mb-2">Notes</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 h-24 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tennis-500"
                    placeholder="Session feedback..."
                />
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Submit Evaluation'}
            </Button>
        </form>
    );
};