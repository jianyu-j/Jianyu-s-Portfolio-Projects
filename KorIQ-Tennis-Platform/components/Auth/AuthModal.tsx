
import React, { useState, useEffect } from 'react';
import { UserRole, NtrpLevel, CoachType, Club, Student, Coach } from '../../types';
import { storageService } from '../../services/storageService';
import { authService, AlreadyRegisteredError } from '../../services/authService';

type FoundCoach = Pick<Coach, 'id' | 'name' | 'clubId' | 'coachType' | 'status' | 'joinedDate'>;
type FoundStudent = Pick<Student, 'id' | 'name' | 'status'> & { email?: string };

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'LOGIN' | 'SIGNUP';
    targetRole?: UserRole; // If provided, limits login to this role
    onLoginSuccess: (user: any) => void;
}

// Common input styles for high visibility (Fix 4.1)
const INPUT_STYLE = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500 outline-none transition-colors placeholder-gray-400";
const SELECT_STYLE = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:border-tennis-500 focus:ring-2 focus:ring-tennis-500 outline-none transition-colors";

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'LOGIN', targetRole, onLoginSuccess }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
    const [role, setRole] = useState<UserRole>(targetRole || 'COACH');

    // --- GENERIC STATES ---
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // --- COACH SPECIFIC STATES ---
    const [coachType, setCoachType] = useState<CoachType | null>(null);
    const [loginCoachType, setLoginCoachType] = useState<CoachType | null>(null); // For Login
    const [email, setEmail] = useState(''); // Used for Coach email input
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Club Selection State
    const [clubs, setClubs] = useState<Club[]>([]);
    const [selectedClubId, setSelectedClubId] = useState('');
    const [clubSearchQuery, setClubSearchQuery] = useState('');
    const [showClubOptions, setShowClubOptions] = useState(false);

    // Coach Claiming State
    const [coachSignupState, setCoachSignupState] = useState<'SELECTION' | 'CLUB_EMAIL_CHECK' | 'CLUB_CLAIM_FORM' | 'INDEPENDENT_FORM'>('SELECTION');
    const [foundCoach, setFoundCoach] = useState<FoundCoach | null>(null);

    // --- STUDENT SPECIFIC ---
    const [age, setAge] = useState('');
    const [studentSignupState, setStudentSignupState] = useState<'EMAIL' | 'CREATE' | 'CLAIM'>('EMAIL');
    const [foundStudent, setFoundStudent] = useState<FoundStudent | null>(null);

    // --- PLAYER SPECIFIC ---
    const [city, setCity] = useState('');
    const [ntrp, setNtrp] = useState<NtrpLevel>(NtrpLevel.L10_15);
    const [playerSignupState, setPlayerSignupState] = useState<'DETAILS' | 'CHECK_EMAIL' | 'CREATE_PASSWORD' | 'LINK_ACCOUNT'>('DETAILS');

    // --- GENERIC LOGIN / OTHERS ---
    const [username, setUsername] = useState(''); // Used for generic login & Student/Club signup (acts as Email for student)

    // Data List for Cities (Fix 3.1)
    const CITIES = [
        "Vancouver, BC", "Burnaby, BC", "Richmond, BC", "Surrey, BC",
        "North Vancouver, BC", "West Vancouver, BC", "Coquitlam, BC",
        "New Westminster, BC", "Victoria, BC", "Toronto, ON",
        "Calgary, AB", "Montreal, QC"
    ];

    useEffect(() => {
        setMode(initialMode);
        if (targetRole) setRole(targetRole);

        // Reset states on open
        resetForm();
        setClubs(storageService.getClubs());
    }, [initialMode, targetRole, isOpen]);

    const resetForm = () => {
        setCoachType(null);
        setLoginCoachType(null);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setUsername('');
        setAge('');
        setStudentSignupState('EMAIL');
        setFoundStudent(null);
        setCoachSignupState('SELECTION');
        setFoundCoach(null);
        setSelectedClubId('');
        setClubSearchQuery('');
        setShowClubOptions(false);
        setCity('');
        setNtrp(NtrpLevel.L10_15);
        setPlayerSignupState('DETAILS');
    };

    if (!isOpen) return null;

    const getTitle = () => {
        if (mode === 'SIGNUP') {
            if (role === 'COACH') {
                if (coachSignupState === 'CLUB_EMAIL_CHECK' || coachSignupState === 'CLUB_CLAIM_FORM') return 'Claim Coach Account';
                return 'Create Coach Account';
            }
            if (role === 'STUDENT') return 'Student Portal Signup';
            if (role === 'PLAYER') return 'Create Player Account';
            return 'Welcome';
        }
        if (targetRole) {
            const roleName = targetRole.charAt(0).toUpperCase() + targetRole.slice(1).toLowerCase();
            return `${roleName} Login`;
        }
        return 'Welcome Back';
    };

    // --- VALIDATION HELPERS ---
    const validatePasswordRules = (pwd: string) => {
        return [
            { label: `At least 12 characters (currently ${pwd.length})`, valid: pwd.length >= 12 },
            { label: "Lowercase letter", valid: /[a-z]/.test(pwd) },
            { label: "Uppercase letter", valid: /[A-Z]/.test(pwd) },
            { label: "Number", valid: /[0-9]/.test(pwd) },
            { label: "Symbol (!@#$%^&* etc.)", valid: /[^A-Za-z0-9]/.test(pwd) },
        ];
    };

    const isPasswordValid = (pwd: string) => {
        const rules = validatePasswordRules(pwd);
        return rules.every(r => r.valid);
    };

    const renderPasswordValidation = (pwd: string) => {
        const rules = validatePasswordRules(pwd);
        return (
            <div className="mt-2 space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                {rules.map((rule, i) => (
                    <div key={i} className={`text-xs flex items-center gap-2 ${rule.valid ? 'text-green-400' : 'text-red-400'}`}>
                        <span>{rule.valid ? '✓' : '✗'}</span>
                        <span>{rule.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    const getMatchValidationMessage = (pwd: string, confirm: string) => {
        if (!confirm) return null;
        const isMatch = pwd === confirm;
        return isMatch
            ? <div className="text-green-500 text-xs mt-1">✓ Passwords match</div>
            : <div className="text-red-500 text-xs mt-1">✗ Passwords do not match</div>;
    };

    /** Run an auth action, surfacing errors in the form and closing on success. */
    const submit = async (action: () => Promise<any>) => {
        setError('');
        setBusy(true);
        try {
            const user = await action();
            if (user) {
                onLoginSuccess(user);
                onClose();
            }
        } catch (err) {
            if (err instanceof AlreadyRegisteredError && role === 'PLAYER') {
                // Email already has an account: offer to link a Player profile to it.
                setPlayerSignupState('LINK_ACCOUNT');
                setPassword('');
                setConfirmPassword('');
                setError('');
            } else {
                setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            }
        } finally {
            setBusy(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const identifier = role === 'COACH' ? email : username;

        if (role === 'COACH') {
            if (!loginCoachType) {
                setError('Please select a coach type.');
                return;
            }
            if (loginCoachType === 'Club' && !selectedClubId) {
                setError('Please select your club.');
                return;
            }
        }

        submit(() => authService.login({
            role,
            identifier,
            password,
            coachType: loginCoachType,
            clubId: selectedClubId || undefined,
        }));
    };

    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.includes('@')) {
            setError("Please enter a valid email address.");
            return;
        }

        setBusy(true);
        try {
            const student = await authService.lookupStudent(username);
            if (student) {
                if (student.status === 'Unclaimed') {
                    setFoundStudent({ ...student, email: username });
                    setStudentSignupState('CLAIM');
                } else {
                    setError("⚠️ An account with this email already exists. Please log in.");
                }
            } else {
                setStudentSignupState('CREATE');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lookup failed.');
        } finally {
            setBusy(false);
        }
    };

    const handleCheckCoachEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.includes('@')) {
            setError("Please enter a valid email address.");
            return;
        }

        setBusy(true);
        try {
            const coach = await authService.lookupCoach(email);
            if (coach) {
                if (coach.coachType === 'Club' || coach.coachType === 'Both') {
                    if (coach.status === 'Unclaimed') {
                        setFoundCoach(coach);
                        setCoachSignupState('CLUB_CLAIM_FORM');
                    } else {
                        setError("⚠️ Account already claimed. Please log in instead.");
                    }
                } else {
                    setError("⚠️ Account already exists. Please log in instead.");
                }
            } else {
                setError("❌ No profile found. Please contact your club admin to add you first.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lookup failed.');
        } finally {
            setBusy(false);
        }
    };

    const handlePlayerDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !username.trim() || !city.trim()) {
            setError("All fields are required.");
            return;
        }
        if (!username.includes('@')) {
            setError("Valid email is required.");
            return;
        }

        // Offline mode can tell us up front whether the email is taken.
        // Supabase deliberately hides that, so we find out at sign-up time.
        const exists = authService.accountExists(username);
        if (exists) {
            if (authService.hasRole(username, 'PLAYER')) {
                setError("A Player account with this email already exists. Please log in.");
                return;
            }
            setPlayerSignupState('LINK_ACCOUNT');
        } else {
            setPlayerSignupState('CREATE_PASSWORD');
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (role === 'PLAYER') {
            if (playerSignupState === 'CREATE_PASSWORD') {
                if (!isPasswordValid(password)) { setError("Password does not meet requirements."); return; }
                if (password !== confirmPassword) { setError("Passwords do not match"); return; }
                submit(() => authService.signupPlayer({ name, email: username, city, ntrp, password }));
            } else if (playerSignupState === 'LINK_ACCOUNT') {
                submit(() => authService.signupPlayer({ name, email: username, city, ntrp, password, link: true }));
            }
            return;
        }

        if (!isPasswordValid(password)) {
            setError("Password does not meet requirements.");
            return;
        }

        if (role === 'COACH') {
            if (password !== confirmPassword) { setError("Passwords do not match"); return; }
            if (coachSignupState === 'CLUB_CLAIM_FORM' && foundCoach) {
                submit(() => authService.claimCoach(foundCoach, email, password));
            } else if (coachSignupState === 'INDEPENDENT_FORM') {
                submit(() => authService.signupIndependentCoach({ name, email, phone, password }));
            }

        } else if (role === 'CLUB') {
            if (!name.trim()) { setError("Club name is required"); return; }
            if (!username.trim() || !username.includes('@')) { setError("Valid email is required"); return; }
            submit(() => authService.signupClub({ name, email: username, password }));

        } else if (role === 'STUDENT') {
            if (password !== confirmPassword) { setError("Passwords do not match"); return; }
            if (studentSignupState === 'CLAIM' && foundStudent) {
                submit(() => authService.claimStudent(foundStudent, username, password));
            } else if (studentSignupState === 'CREATE') {
                submit(() => authService.signupStudent({ name, email: username, age: parseInt(age) || 18, password }));
            }
        }
    };

    // --- RENDERERS ---

    const renderPlayerSignup = () => {
        if (playerSignupState === 'DETAILS') {
            return (
                <form onSubmit={handlePlayerDetailsSubmit} className="space-y-4 animate-slideUp">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Full Name *</label>
                        <input type="text" required className={INPUT_STYLE}
                            value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Email *</label>
                        <input type="email" required className={INPUT_STYLE}
                            value={username} onChange={e => setUsername(e.target.value)} placeholder="player@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">City/Location *</label>
                        <input type="text" required list="cities" className={INPUT_STYLE}
                            value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Vancouver, BC" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">NTRP Level *</label>
                        <select
                            value={ntrp}
                            onChange={(e) => setNtrp(e.target.value as NtrpLevel)}
                            className={SELECT_STYLE}
                        >
                            {Object.values(NtrpLevel).map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Continue
                    </button>

                    <button type="button" onClick={() => { setMode('LOGIN'); resetForm(); }} className="w-full text-center text-xs text-gray-500 hover:text-white mt-2">
                        ← Back to Login
                    </button>
                </form>
            );
        }

        if (playerSignupState === 'CREATE_PASSWORD') {
            return (
                <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Create Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                        {renderPasswordValidation(password)}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Confirm Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        {getMatchValidationMessage(password, confirmPassword)}
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Create Account
                    </button>
                </form>
            );
        }

        if (playerSignupState === 'LINK_ACCOUNT') {
            return (
                <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-4 text-center">
                        <p className="text-blue-400 font-bold text-sm mb-1">ℹ️ Account Exists</p>
                        <p className="text-gray-300 text-xs">This email already has an account. Enter your existing password to add a Player profile.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Link & Continue
                    </button>
                </form>
            );
        }

        return null;
    };

    const renderCoachSignup = () => {
        // STEP 1: Selection
        if (coachSignupState === 'SELECTION') {
            return (
                <div className="space-y-6 animate-slideUp">
                    <p className="text-center text-gray-300 text-sm">What type of coach are you?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => { setCoachType('Club'); setCoachSignupState('CLUB_EMAIL_CHECK'); }}
                            className="bg-white/5 border border-white/10 hover:bg-tennis-600 hover:border-tennis-500 rounded-xl p-6 text-center group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                        >
                            <div className="mb-2 group-hover:scale-110 transition-transform"><svg className="w-10 h-10 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                            <div className="font-bold text-white text-sm uppercase tracking-wider">Club Coach</div>
                            <div className="text-[10px] text-gray-400 mt-2 group-hover:text-white/80 leading-tight">
                                I coach at a club and was invited by my club admin
                            </div>
                            <div className="mt-3 py-1 px-2 bg-white/20 rounded text-[10px] font-bold uppercase">Claim Account</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setCoachType('Independent'); setCoachSignupState('INDEPENDENT_FORM'); }}
                            className="bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 rounded-xl p-6 text-center group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                        >
                            <div className="mb-2 group-hover:scale-110 transition-transform"><svg className="w-10 h-10 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <div className="font-bold text-white text-sm uppercase tracking-wider">Independent</div>
                            <div className="text-[10px] text-gray-400 mt-2 group-hover:text-white/80 leading-tight">
                                I coach on my own or privately
                            </div>
                            <div className="mt-3 py-1 px-2 bg-white/20 rounded text-[10px] font-bold uppercase">Create Account</div>
                        </button>
                    </div>
                </div>
            );
        }

        // STEP 2: Club Email Check
        if (coachSignupState === 'CLUB_EMAIL_CHECK') {
            return (
                <form onSubmit={handleCheckCoachEmail} className="space-y-4 animate-slideUp">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10 mb-2">
                        <span className="text-xs text-gray-300">Selected: <span className="font-bold text-white">Club Coach</span></span>
                        <button type="button" onClick={() => setCoachSignupState('SELECTION')} className="text-xs text-tennis-400 hover:text-tennis-300 underline">Change</button>
                    </div>

                    <p className="text-sm text-gray-400">Enter the email your club admin used to add you:</p>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Email *</label>
                        <input type="email" required className={INPUT_STYLE}
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="coach@example.com" />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                            {error.includes("No profile found") && (
                                <button
                                    type="button"
                                    onClick={() => setCoachSignupState('INDEPENDENT_FORM')}
                                    className="block w-full text-center mt-2 text-xs text-tennis-400 hover:text-tennis-300 underline"
                                >
                                    Sign up as Independent Coach instead?
                                </button>
                            )}
                        </div>
                    )}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Find Profile
                    </button>

                    <button type="button" onClick={() => setCoachSignupState('SELECTION')} className="w-full text-center text-xs text-gray-500 hover:text-white mt-2">
                        ← Back
                    </button>
                </form>
            );
        }

        // STEP 3: Club Claim Form
        if (coachSignupState === 'CLUB_CLAIM_FORM' && foundCoach) {
            const clubName = clubs.find(c => c.id === foundCoach.clubId)?.name || 'Unknown Club';
            return (
                <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-4">
                        <p className="text-green-400 font-bold text-sm mb-1">Profile Found!</p>
                        <div className="mt-2 p-2 bg-black/20 rounded space-y-1">
                            <p className="text-xs text-gray-400">Name: <span className="text-white font-bold">{foundCoach.name}</span></p>
                            <p className="text-xs text-gray-400">Club: <span className="text-white font-bold">{clubName}</span></p>
                            <p className="text-xs text-gray-400">Added by: <span className="text-white">Admin on {new Date(foundCoach.joinedDate).toLocaleDateString()}</span></p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Set Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                        {renderPasswordValidation(password)}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Confirm Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        {getMatchValidationMessage(password, confirmPassword)}
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Claim Account
                    </button>
                </form>
            );
        }

        // STEP 4: Independent Coach Form
        return (
            <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10 mb-2">
                    <span className="text-xs text-gray-300">Selected: <span className="font-bold text-white">Independent Coach</span></span>
                    <button type="button" onClick={() => setCoachSignupState('SELECTION')} className="text-xs text-tennis-400 hover:text-tennis-300 underline">Change</button>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Full Name *</label>
                    <input type="text" required className={INPUT_STYLE}
                        value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Email *</label>
                    <input type="email" required className={INPUT_STYLE}
                        value={email} onChange={e => setEmail(e.target.value)} placeholder="coach@example.com" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Phone</label>
                    <input type="tel" className={INPUT_STYLE}
                        value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                        {renderPasswordValidation(password)}
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Confirm *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        {getMatchValidationMessage(password, confirmPassword)}
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95 mt-4">
                    Create Account
                </button>
            </form>
        );
    };

    const renderStudentSignup = () => {
        if (studentSignupState === 'EMAIL') {
            return (
                <form onSubmit={handleCheckEmail} className="space-y-4 animate-slideUp">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Email *</label>
                        <input type="email" required className={INPUT_STYLE}
                            value={username} onChange={e => setUsername(e.target.value)} placeholder="student@example.com" />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Continue
                    </button>
                </form>
            );
        }

        if (studentSignupState === 'CLAIM' && foundStudent) {
            return (
                <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl mb-4">
                        <p className="text-green-400 font-bold text-sm mb-1">✅ Profile Found!</p>
                        <p className="text-gray-300 text-xs">Your coach created a profile for you. Set a password to claim it.</p>
                        <div className="mt-3 p-2 bg-black/20 rounded">
                            <p className="text-xs text-gray-400">Name: <span className="text-white font-bold">{foundStudent.name}</span></p>
                            <p className="text-xs text-gray-400">Email: <span className="text-white font-bold">{foundStudent.email}</span></p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Set Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                        {renderPasswordValidation(password)}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Confirm Password *</label>
                        <input type="password" required className={INPUT_STYLE}
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        {getMatchValidationMessage(password, confirmPassword)}
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                    <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                        Claim Profile
                    </button>
                </form>
            );
        }

        // CREATE
        return (
            <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">{username} <span className="text-green-400">✓</span></span>
                    <button type="button" onClick={() => setStudentSignupState('EMAIL')} className="text-xs text-tennis-400 underline">Change Email</button>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Full Name *</label>
                    <input type="text" required className={INPUT_STYLE}
                        value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Age *</label>
                    <input type="number" required className={INPUT_STYLE}
                        value={age} onChange={e => setAge(e.target.value)} placeholder="18" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Password *</label>
                    <input type="password" required className={INPUT_STYLE}
                        value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    {renderPasswordValidation(password)}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Confirm Password *</label>
                    <input type="password" required className={INPUT_STYLE}
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                    {getMatchValidationMessage(password, confirmPassword)}
                </div>

                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                    Create Account
                </button>
            </form>
        );
    };

    const renderGenericSignup = () => (
        <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">{role === 'CLUB' ? 'Club Name *' : 'Full Name'}</label>
                <input type="text" required className={INPUT_STYLE}
                    value={name} onChange={e => setName(e.target.value)} placeholder={role === 'CLUB' ? 'My Tennis Club' : 'John Doe'} />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">{role === 'CLUB' ? 'Email *' : 'Username'}</label>
                <input type="text" required className={INPUT_STYLE}
                    value={username} onChange={e => setUsername(e.target.value)} placeholder={role === 'CLUB' ? 'club@example.com' : 'username'} />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Password *</label>
                <input type="password" required className={INPUT_STYLE}
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                {renderPasswordValidation(password)}
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

            <button type="submit" disabled={busy} className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95">
                Create Account
            </button>
        </form>
    );

    const renderLogin = () => (
        <form onSubmit={handleLogin} className="space-y-4 animate-slideUp">
            {role === 'COACH' && (
                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2 uppercase font-bold text-center">Log in as:</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => { setLoginCoachType('Club'); setSelectedClubId(''); setError(''); setClubSearchQuery(''); setShowClubOptions(false); }}
                            className={`p-4 rounded-xl border transition-all text-center group ${loginCoachType === 'Club' ? 'bg-tennis-600 border-tennis-500 shadow-lg ring-1 ring-tennis-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="mb-1 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                            <div className={`text-xs font-bold uppercase tracking-wider ${loginCoachType === 'Club' ? 'text-white' : 'text-gray-400'}`}>Club Coach</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginCoachType('Independent'); setSelectedClubId(''); setError(''); }}
                            className={`p-4 rounded-xl border transition-all text-center group ${loginCoachType === 'Independent' ? 'bg-blue-600 border-blue-500 shadow-lg ring-1 ring-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="mb-1 group-hover:scale-110 transition-transform"><svg className="w-6 h-6 mx-auto text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                            <div className={`text-xs font-bold uppercase tracking-wider ${loginCoachType === 'Independent' ? 'text-white' : 'text-gray-400'}`}>Independent</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Club Selection Autocomplete for Club Coach */}
            {role === 'COACH' && loginCoachType === 'Club' && (
                <div className="animate-fadeIn relative">
                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Select Club *</label>
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={clubSearchQuery}
                        onChange={(e) => {
                            setClubSearchQuery(e.target.value);
                            setShowClubOptions(true);
                            setSelectedClubId(''); // Reset selection on type
                        }}
                        onFocus={() => setShowClubOptions(true)}
                        className={INPUT_STYLE}
                    />

                    {showClubOptions && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {clubs.filter(c => c.name.toLowerCase().includes(clubSearchQuery.toLowerCase())).map(club => (
                                <div
                                    key={club.id}
                                    onClick={() => {
                                        setSelectedClubId(club.id);
                                        setClubSearchQuery(club.name);
                                        setShowClubOptions(false);
                                    }}
                                    className="p-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-800 transition-colors"
                                >
                                    {club.name}
                                </div>
                            ))}
                            {clubs.filter(c => c.name.toLowerCase().includes(clubSearchQuery.toLowerCase())).length === 0 && (
                                <div className="p-3 text-sm text-gray-500">No clubs found</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">
                    {role === 'COACH' ? 'Email *' : 'Email *'}
                </label>
                <input
                    type="text"
                    autoComplete="username"
                    required
                    className={INPUT_STYLE}
                    placeholder={role === 'COACH' ? 'coach@example.com' : 'email@example.com'}
                    value={role === 'COACH' ? email : username}
                    onChange={e => role === 'COACH' ? setEmail(e.target.value) : setUsername(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase">Password *</label>
                <input type="password" required className={INPUT_STYLE}
                    value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-400 text-sm">{error}</div>}

            <button type="submit" className="w-full py-3 bg-gradient-to-r from-tennis-600 to-tennis-500 hover:from-tennis-500 hover:to-tennis-400 text-white font-bold rounded-xl shadow-lg shadow-tennis-900/50 transform transition-all active:scale-95" disabled={busy || (role === 'COACH' && !loginCoachType)}>
                Log In
            </button>
        </form>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-md bg-gray-900/90 border border-white/10 rounded-2xl shadow-2xl p-8 text-white overflow-y-auto max-h-[90vh] animate-slideUp">
                {/* Glossy Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tennis-500 to-transparent opacity-50 rounded-t-2xl"></div>

                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-tennis-200">
                        {getTitle()}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
                </div>

                {/* Datalist for Cities */}
                <datalist id="cities">
                    {CITIES.map(c => <option key={c} value={c} />)}
                </datalist>

                {/* Tabs */}
                {!targetRole && mode === 'SIGNUP' && (
                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setRole('COACH')} className={`flex-1 py-3 rounded-xl border transition-all ${role === 'COACH' ? 'bg-tennis-600 border-tennis-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span className="block text-xs font-bold uppercase tracking-wider">Coach</span></button>
                        <button onClick={() => setRole('STUDENT')} className={`flex-1 py-3 rounded-xl border transition-all ${role === 'STUDENT' ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span className="block text-xs font-bold uppercase tracking-wider">Student</span></button>
                        <button onClick={() => setRole('CLUB')} className={`flex-1 py-3 rounded-xl border transition-all ${role === 'CLUB' ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span className="block text-xs font-bold uppercase tracking-wider">Club</span></button>
                        <button onClick={() => setRole('PLAYER')} className={`flex-1 py-3 rounded-xl border transition-all ${role === 'PLAYER' ? 'bg-yellow-600 border-yellow-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><span className="block text-xs font-bold uppercase tracking-wider">Player</span></button>
                    </div>
                )}

                {/* Content */}
                {mode === 'LOGIN'
                    ? renderLogin()
                    : (
                        role === 'COACH' ? renderCoachSignup() :
                            role === 'STUDENT' ? renderStudentSignup() :
                                role === 'PLAYER' ? renderPlayerSignup() :
                                    renderGenericSignup()
                    )
                }

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
                            resetForm();
                        }}
                        className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
                    >
                        {mode === 'LOGIN' ? (role === 'PLAYER' ? "Don't have an account? Create Player Account" : "Don't have an account? Create Account") : "Already have an account? Log In"}
                    </button>
                    {role === 'PLAYER' && mode === 'SIGNUP' && playerSignupState === 'DETAILS' && (
                        <div className="mt-2">
                            <button onClick={() => { setMode('LOGIN'); resetForm(); }} className="text-xs text-gray-500 hover:text-white transition-colors">
                                ← Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
