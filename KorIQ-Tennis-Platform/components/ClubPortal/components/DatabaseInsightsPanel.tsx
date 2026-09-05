import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Line } from 'recharts';
import { isSupabaseEnabled } from '../../../services/supabaseClient';
import { remoteData } from '../../../services/remoteDataService';

interface Props {
    clubId: string;
}

type CoachImpact = Awaited<ReturnType<typeof remoteData.coachImpact>>[number];
type Monthly = Awaited<ReturnType<typeof remoteData.clubMonthly>>[number];
type Composite = Awaited<ReturnType<typeof remoteData.studentComposite>>[number];
type Benchmark = Awaited<ReturnType<typeof remoteData.levelBenchmarks>>[number];

const fmtMonth = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
const n = (v: number | null | undefined, d = 1) => (v === null || v === undefined ? '—' : Number(v).toFixed(d));

/**
 * Evaluation analytics computed in Postgres (see supabase/migrations: the
 * v_coach_impact, v_club_monthly_evaluations, v_student_composite and
 * v_level_benchmarks views). The component only renders what the database
 * returns; row-level security scopes it to the signed-in club.
 */
const DatabaseInsightsPanel: React.FC<Props> = ({ clubId }) => {
    const [coachImpact, setCoachImpact] = useState<CoachImpact[]>([]);
    const [monthly, setMonthly] = useState<Monthly[]>([]);
    const [composite, setComposite] = useState<Composite[]>([]);
    const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isSupabaseEnabled) return;
        let cancelled = false;
        setLoading(true);
        Promise.all([
            remoteData.coachImpact(clubId),
            remoteData.clubMonthly(clubId),
            remoteData.studentComposite(clubId),
            remoteData.levelBenchmarks(),
        ])
            .then(([ci, mo, co, be]) => {
                if (cancelled) return;
                setCoachImpact(ci);
                setMonthly(mo);
                setComposite(co);
                setBenchmarks(be.filter(b => b.evaluations > 0));
            })
            .catch(err => !cancelled && setError(err instanceof Error ? err.message : 'Failed to load analytics'))
            .finally(() => !cancelled && setLoading(false));
        return () => { cancelled = true; };
    }, [clubId]);

    if (!isSupabaseEnabled) return null;

    const promotionReady = composite.filter(c => c.promotion_ready);
    const evaluated = composite.filter(c => c.evaluation_count > 0);
    const avgImprovement = evaluated.length
        ? evaluated.reduce((s, c) => s + Number(c.improvement ?? 0), 0) / evaluated.length
        : 0;
    const totalEvaluations = monthly.reduce((s, m) => s + Number(m.evaluations), 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Evaluation Analytics</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Computed in Postgres from the evaluations table (SQL views), scoped to this club by row-level security.
                    </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1 whitespace-nowrap">
                    Live database
                </span>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
            {loading && <p className="text-sm text-gray-500">Loading analytics…</p>}

            {!loading && !error && (
                <>
                    {/* KPI strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Kpi label="Evaluations" value={String(totalEvaluations)} sub={`${evaluated.length} students evaluated`} />
                        <Kpi label="Avg improvement" value={`${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}`} sub="first → latest score" />
                        <Kpi label="Promotion ready" value={String(promotionReady.length)} sub="latest score ≥ 80" />
                        <Kpi label="Active coaches" value={String(coachImpact.filter(c => c.evaluation_count > 0).length)} sub="with evaluations" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly volume + average score */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Evaluations per month</h4>
                            <p className="text-[11px] text-gray-400 mb-3 font-mono">v_club_monthly_evaluations</p>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={monthly.map(m => ({ ...m, label: fmtMonth(m.month), avg_score: m.avg_score === null ? null : Number(m.avg_score) }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar yAxisId="left" dataKey="evaluations" name="Evaluations" fill="#3aa54e" radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="avg_score" name="Avg score" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Coach impact */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Coach impact</h4>
                            <p className="text-[11px] text-gray-400 mb-3 font-mono">v_coach_impact</p>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={coachImpact.filter(c => c.evaluation_count > 0).map(c => ({
                                        name: c.coach_name.replace(/^Coach /, ''),
                                        improvement: c.avg_student_improvement === null ? 0 : Number(c.avg_student_improvement),
                                        avg_score: c.avg_score === null ? 0 : Number(c.avg_score),
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="avg_score" name="Avg score" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="improvement" name="Avg student improvement" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Coach table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                                    <th className="py-2 pr-4">Coach</th>
                                    <th className="py-2 pr-4 text-right">Evaluations</th>
                                    <th className="py-2 pr-4 text-right">Students</th>
                                    <th className="py-2 pr-4 text-right">Avg score</th>
                                    <th className="py-2 pr-4 text-right">Avg improvement</th>
                                    <th className="py-2 pr-4 text-right">Improved / repeat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coachImpact.map(c => (
                                    <tr key={c.coach_id} className="border-b border-gray-50">
                                        <td className="py-2 pr-4 font-medium text-gray-800">{c.coach_name} <span className="text-gray-400 text-xs">({c.coach_type})</span></td>
                                        <td className="py-2 pr-4 text-right">{c.evaluation_count}</td>
                                        <td className="py-2 pr-4 text-right">{c.students_evaluated}</td>
                                        <td className="py-2 pr-4 text-right">{n(c.avg_score)}</td>
                                        <td className={`py-2 pr-4 text-right font-semibold ${Number(c.avg_student_improvement ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {c.avg_student_improvement === null ? '—' : `${Number(c.avg_student_improvement) >= 0 ? '+' : ''}${n(c.avg_student_improvement)}`}
                                        </td>
                                        <td className="py-2 pr-4 text-right text-gray-600">{c.students_improved} / {c.students_with_repeat_evals}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Student composite */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Student progress</h4>
                            <p className="text-[11px] text-gray-400 mb-3 font-mono">v_student_composite</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                                            <th className="py-2 pr-3">Student</th>
                                            <th className="py-2 pr-3">Level</th>
                                            <th className="py-2 pr-3 text-right">Evals</th>
                                            <th className="py-2 pr-3 text-right">First → Latest</th>
                                            <th className="py-2 pr-3">Weakest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluated
                                            .sort((a, b) => Number(b.improvement ?? 0) - Number(a.improvement ?? 0))
                                            .map(s => (
                                                <tr key={s.student_id} className="border-b border-gray-50">
                                                    <td className="py-2 pr-3 font-medium text-gray-800">
                                                        {s.name}
                                                        {s.promotion_ready && <span className="ml-2 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 rounded px-1.5 py-0.5">Ready</span>}
                                                    </td>
                                                    <td className="py-2 pr-3 text-gray-600">
                                                        {s.current_ntrp}
                                                        {s.levels_gained > 0 && <span className="ml-1 text-emerald-600 text-xs">▲{s.levels_gained}</span>}
                                                    </td>
                                                    <td className="py-2 pr-3 text-right">{s.evaluation_count}</td>
                                                    <td className="py-2 pr-3 text-right">
                                                        {n(s.first_score)} → <span className="font-semibold">{n(s.latest_score)}</span>
                                                        <span className={`ml-1 text-xs ${Number(s.improvement ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            ({Number(s.improvement ?? 0) >= 0 ? '+' : ''}{n(s.improvement)})
                                                        </span>
                                                    </td>
                                                    <td className="py-2 pr-3 text-gray-600">{s.weakest_stroke ?? '—'}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Level benchmarks */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Peer benchmarks by NTRP level</h4>
                            <p className="text-[11px] text-gray-400 mb-3 font-mono">v_level_benchmarks</p>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={benchmarks.map(b => ({
                                        level: b.ntrp_level,
                                        FH: Number(b.avg_fh ?? 0), BH: Number(b.avg_bh ?? 0),
                                        Serve: Number(b.avg_serve ?? 0), Volley: Number(b.avg_volley ?? 0),
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="FH" fill="#3B82F6" />
                                        <Bar dataKey="BH" fill="#F97316" />
                                        <Bar dataKey="Serve" fill="#8B5CF6" />
                                        <Bar dataKey="Volley" fill="#0D9488" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const Kpi: React.FC<{ label: string; value: string; sub: string }> = ({ label, value, sub }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
);

export default DatabaseInsightsPanel;
