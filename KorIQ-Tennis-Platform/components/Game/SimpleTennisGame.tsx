import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// TYPES
// ============================================
type GameState = 'MENU' | 'SERVING' | 'PLAYING' | 'POINT_SCORED' | 'GAME_WON' | 'SET_OVER' | 'MATCH_OVER';
type Difficulty = 'easy' | 'medium' | 'hard';
type ShotType = 'drive' | 'lob' | 'slice' | 'power';

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    height: number;
    vHeight: number;
    trail: { x: number; y: number; height: number }[];
}

interface TennisScore {
    points: number[]; // [player, opponent] - 0, 1, 2, 3 = 0, 15, 30, 40
    games: number[];  // [player, opponent]
    sets: number[];   // [player, opponent]
    isDeuce: boolean;
    advantage: 'player' | 'opponent' | null;
}

// ============================================
// CONSTANTS
// ============================================
const COURT_WIDTH = 320;
const COURT_HEIGHT = 480;
const BALL_SIZE = 22;
const RACKET_WIDTH = 70;
const HIT_ZONE_HEIGHT = 140; // Much larger hit zone

const POINT_NAMES = ['0', '15', '30', '40'];

const DIFFICULTY_CONFIG = {
    easy: { 
        npcSpeed: 1.2, 
        ballSpeed: 3.5, 
        npcError: 0.7, 
        npcMissChance: 0.4, 
        hitRange: 50,
        reactionDelay: 0.25, // 25% chance to freeze
        npcAnticipation: 0, // Doesn't anticipate
    },
    medium: { 
        npcSpeed: 2.2, 
        ballSpeed: 4.5, 
        npcError: 0.35, 
        npcMissChance: 0.2, 
        hitRange: 45,
        reactionDelay: 0.12,
        npcAnticipation: 0.3,
    },
    hard: { 
        npcSpeed: 3.2, 
        ballSpeed: 5.5, 
        npcError: 0.15, 
        npcMissChance: 0.08, 
        hitRange: 40,
        reactionDelay: 0.05,
        npcAnticipation: 0.6,
    },
};

// ============================================
// MAIN COMPONENT
// ============================================
interface SimpleTennisGameProps {
    onClose: () => void;
}

const SimpleTennisGame: React.FC<SimpleTennisGameProps> = ({ onClose }) => {
    // Game state
    const [gameState, setGameState] = useState<GameState>('MENU');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [isPlayerServing, setIsPlayerServing] = useState(true);

    // Tennis score
    const [score, setScore] = useState<TennisScore>({
        points: [0, 0],
        games: [0, 0],
        sets: [0, 0],
        isDeuce: false,
        advantage: null,
    });

    // Rally tracking
    const [rallyCount, setRallyCount] = useState(0);
    const [lastShotType, setLastShotType] = useState<ShotType | null>(null);
    const [showShotFeedback, setShowShotFeedback] = useState<string | null>(null);

    // Ball state
    const [ball, setBall] = useState<Ball>({
        x: COURT_WIDTH / 2,
        y: COURT_HEIGHT - 80,
        vx: 0,
        vy: 0,
        height: 20,
        vHeight: 0,
        trail: [],
    });

    // Racket positions
    const [playerX, setPlayerX] = useState(COURT_WIDTH / 2);
    const [npcX, setNpcX] = useState(COURT_WIDTH / 2);
    const [npcTargetX, setNpcTargetX] = useState(COURT_WIDTH / 2);

    // Input tracking
    const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
    const [canHit, setCanHit] = useState(false);
    const [hitWindow, setHitWindow] = useState(false); // Shows "sweet spot" indicator

    // Refs
    const gameLoopRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ============================================
    // SCORE HELPERS
    // ============================================
    const getPointDisplay = (playerPoints: number, opponentPoints: number, isDeuce: boolean, advantage: 'player' | 'opponent' | null) => {
        if (isDeuce) {
            if (advantage === 'player') return 'AD - 40';
            if (advantage === 'opponent') return '40 - AD';
            return 'DEUCE';
        }
        return `${POINT_NAMES[playerPoints]} - ${POINT_NAMES[opponentPoints]}`;
    };

    const getGameStatus = () => {
        const { games, sets } = score;
        if (sets[0] === 1 && sets[1] === 1) return 'Final Set!';
        if (games[0] >= 3 && games[0] > games[1]) return 'Game Point!';
        if (games[1] >= 3 && games[1] > games[0]) return 'Break Point!';
        return null;
    };

    // ============================================
    // GAME SETUP
    // ============================================
    const startGame = (diff: Difficulty) => {
        setDifficulty(diff);
        setScore({
            points: [0, 0],
            games: [0, 0],
            sets: [0, 0],
            isDeuce: false,
            advantage: null,
        });
        setIsPlayerServing(true);
        setRallyCount(0);
        resetForServe(true);
        setGameState('SERVING');
    };

    const resetForServe = useCallback((playerServing: boolean) => {
        setBall({
            x: COURT_WIDTH / 2,
            y: playerServing ? COURT_HEIGHT - 60 : 60,
            vx: 0,
            vy: 0,
            height: 20,
            vHeight: 0,
            trail: [],
        });
        setPlayerX(COURT_WIDTH / 2);
        setNpcX(COURT_WIDTH / 2);
        setNpcTargetX(COURT_WIDTH / 2);
        setCanHit(false);
        setHitWindow(false);
        setRallyCount(0);
        setLastShotType(null);
    }, []);

    // ============================================
    // SERVE
    // ============================================
    const serve = useCallback((targetSide: 'left' | 'right' | 'center' = 'center') => {
        const config = DIFFICULTY_CONFIG[difficulty];
        let direction = 0;
        if (targetSide === 'left') direction = -1.5;
        else if (targetSide === 'right') direction = 1.5;
        else direction = (Math.random() - 0.5) * 2;

        if (isPlayerServing) {
            setBall(prev => ({
                ...prev,
                vx: direction * 1.5,
                vy: -config.ballSpeed * 0.9,
                vHeight: 2.5,
                trail: [],
            }));
            setShowShotFeedback('Serve!');
            setTimeout(() => setShowShotFeedback(null), 500);
        } else {
            // NPC serve - less accurate on easy
            const npcDirection = direction + (Math.random() - 0.5) * config.npcError * 2;
            setBall(prev => ({
                ...prev,
                vx: npcDirection * 1.5,
                vy: config.ballSpeed * 0.9,
                vHeight: 2.5,
                trail: [],
            }));
        }
        setRallyCount(1);
        setGameState('PLAYING');
    }, [difficulty, isPlayerServing]);

    // Auto-serve for NPC
    useEffect(() => {
        if (gameState === 'SERVING' && !isPlayerServing) {
            const timer = setTimeout(() => serve('center'), 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, isPlayerServing, serve]);

    // ============================================
    // HIT BALL FUNCTION
    // ============================================
    const hitBall = useCallback((shotType: ShotType, direction: number) => {
        const config = DIFFICULTY_CONFIG[difficulty];
        setLastShotType(shotType);
        setRallyCount(prev => prev + 1);

        let speed = config.ballSpeed;
        let loft = 2.5;
        let feedbackText = '';

        switch (shotType) {
            case 'drive':
                speed *= 1.1;
                loft = 2;
                feedbackText = 'Drive!';
                break;
            case 'lob':
                speed *= 0.7;
                loft = 5;
                feedbackText = 'Lob!';
                break;
            case 'slice':
                speed *= 0.85;
                loft = 1.5;
                feedbackText = 'Slice!';
                break;
            case 'power':
                speed *= 1.4;
                loft = 2.5;
                feedbackText = 'POWER!';
                break;
        }

        setBall(prev => ({
            ...prev,
            vx: direction * 3,
            vy: -speed,
            height: 20,
            vHeight: loft,
            trail: [],
        }));

        setShowShotFeedback(feedbackText);
        setTimeout(() => setShowShotFeedback(null), 400);
        setCanHit(false);
        setHitWindow(false);
    }, [difficulty]);

    // ============================================
    // GAME LOOP
    // ============================================
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const config = DIFFICULTY_CONFIG[difficulty];
        const GRAVITY = 0.12;
        const BOUNCE = 0.5;

        const loop = () => {
            setBall(prev => {
                let { x, y, vx, vy, height, vHeight, trail } = prev;

                // Update trail
                trail = [...trail, { x, y, height }].slice(-8);

                // Move ball
                x += vx;
                y += vy;
                height += vHeight;
                vHeight -= GRAVITY;

                // Ball bounces on ground
                if (height <= 0) {
                    height = 0;
                    vHeight = Math.abs(vHeight) * BOUNCE;

                    // Check if ball is out of bounds (wide)
                    if (x < 15 || x > COURT_WIDTH - 15) {
                        const winner = vy > 0 ? 'player' : 'opponent';
                        scorePoint(winner === 'player');
                        return { ...prev, vy: 0, vx: 0 };
                    }
                }

                // Wall bounces
                if (x < 15 || x > COURT_WIDTH - 15) {
                    vx = -vx * 0.7;
                    x = x < 15 ? 15 : COURT_WIDTH - 15;
                }

                // Ball passed player (bottom) - opponent scores
                if (y > COURT_HEIGHT - 10 && height < 35) {
                    scorePoint(false);
                    return { ...prev, vy: 0, vx: 0 };
                }

                // Ball passed opponent (top) - player scores
                if (y < 10 && height < 35) {
                    scorePoint(true);
                    return { ...prev, vy: 0, vx: 0 };
                }

                // Check if ball is in player's hitting zone (MUCH larger)
                const inHitZone = y > COURT_HEIGHT - HIT_ZONE_HEIGHT && vy > 0 && height < 60;
                const inSweetSpot = y > COURT_HEIGHT - 100 && y < COURT_HEIGHT - 40 && height < 45;
                
                if (inHitZone) {
                    setCanHit(true);
                    setHitWindow(inSweetSpot);
                } else if (vy < 0) {
                    setCanHit(false);
                    setHitWindow(false);
                }

                // NPC AI
                if (vy < 0) {
                    // Reaction delay
                    const shouldMove = Math.random() > config.reactionDelay;
                    
                    if (shouldMove) {
                        // Calculate where ball will land
                        const timeToReach = (80 - y) / Math.abs(vy);
                        const predictedX = x + vx * timeToReach * config.npcAnticipation;
                        
                        // Add tracking error
                        const trackingError = (Math.random() - 0.5) * config.npcError * 120;
                        const targetX = predictedX + trackingError;
                        
                        setNpcTargetX(targetX);
                    }

                    // Move towards target
                    setNpcX(current => {
                        const diff = npcTargetX - current;
                        const move = Math.sign(diff) * Math.min(Math.abs(diff), config.npcSpeed);
                        return Math.max(40, Math.min(COURT_WIDTH - 40, current + move));
                    });

                    // NPC attempts to hit ball
                    if (y < 90 && y > 30 && height < 50) {
                        const distanceToBall = Math.abs(x - npcX);
                        
                        if (distanceToBall < config.hitRange) {
                            // Check if NPC misses
                            const willMiss = Math.random() < config.npcMissChance;
                            
                            if (!willMiss) {
                                // NPC returns the ball
                                const hitAngle = (x - npcX) / config.hitRange;
                                const npcShotType = Math.random();
                                let returnSpeed = config.ballSpeed;
                                let returnLoft = 2.5;
                                
                                // NPC shot variety
                                if (npcShotType < 0.1) {
                                    returnSpeed *= 1.3; // Power shot
                                    returnLoft = 2;
                                } else if (npcShotType < 0.3) {
                                    returnSpeed *= 0.7; // Lob
                                    returnLoft = 4.5;
                                }

                                setRallyCount(prev => prev + 1);
                                
                                return {
                                    ...prev,
                                    x,
                                    y: 85,
                                    vx: hitAngle * 2.5 + (Math.random() - 0.5) * 1.5,
                                    vy: returnSpeed,
                                    height: 20,
                                    vHeight: returnLoft,
                                    trail: [],
                                };
                            }
                        }
                    }
                }

                return { x, y, vx: vx * 0.997, vy, height, vHeight, trail };
            });

            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, difficulty, npcX, npcTargetX]);

    // ============================================
    // SCORING (Real Tennis)
    // ============================================
    const scorePoint = (playerWon: boolean) => {
        setScore(prev => {
            const newScore = { ...prev };
            const winner = playerWon ? 0 : 1;
            const loser = playerWon ? 1 : 0;

            // Handle deuce/advantage
            if (prev.isDeuce) {
                if (prev.advantage === (playerWon ? 'player' : 'opponent')) {
                    // Won from advantage - win the game
                    return handleGameWon(newScore, winner);
                } else if (prev.advantage) {
                    // Lost from advantage - back to deuce
                    newScore.advantage = null;
                } else {
                    // Won from deuce - get advantage
                    newScore.advantage = playerWon ? 'player' : 'opponent';
                }
            } else {
                // Normal scoring
                newScore.points[winner]++;

                // Check for deuce
                if (newScore.points[0] >= 3 && newScore.points[1] >= 3) {
                    newScore.isDeuce = true;
                    newScore.points = [3, 3];
                }
                // Check for game won
                else if (newScore.points[winner] >= 4) {
                    return handleGameWon(newScore, winner);
                }
            }

            return newScore;
        });

        // Show feedback
        const feedback = playerWon 
            ? (rallyCount > 5 ? 'Great Rally!' : 'Point!') 
            : (rallyCount > 5 ? 'Long Rally...' : 'Lost Point');
        setShowShotFeedback(feedback);
        setGameState('POINT_SCORED');

        // Continue after delay
        setTimeout(() => {
            setShowShotFeedback(null);
            // Check if game/set/match is over based on updated score
            setScore(currentScore => {
                if (currentScore.sets[0] >= 2 || currentScore.sets[1] >= 2) {
                    setGameState('MATCH_OVER');
                } else {
                    resetForServe(isPlayerServing);
                    setGameState('SERVING');
                }
                return currentScore;
            });
        }, 1500);
    };

    const handleGameWon = (currentScore: TennisScore, winner: number): TennisScore => {
        const newScore = { ...currentScore };
        newScore.games[winner]++;
        newScore.points = [0, 0];
        newScore.isDeuce = false;
        newScore.advantage = null;

        // Check for set won (first to 4 games for quick play)
        if (newScore.games[winner] >= 4 && newScore.games[winner] - newScore.games[1 - winner] >= 2) {
            newScore.sets[winner]++;
            newScore.games = [0, 0];
            
            // Switch serve after set
            setIsPlayerServing(prev => !prev);
        }

        return newScore;
    };

    // ============================================
    // INPUT HANDLING
    // ============================================
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * COURT_WIDTH;
        const y = (e.clientY - rect.top) / rect.height * COURT_HEIGHT;

        // Serve on tap
        if (gameState === 'SERVING' && isPlayerServing) {
            const side = x < COURT_WIDTH / 3 ? 'left' : x > COURT_WIDTH * 2 / 3 ? 'right' : 'center';
            serve(side);
            return;
        }

        setTouchStart({ x, y, time: Date.now() });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * COURT_WIDTH;

        // Move player racket
        if (gameState === 'PLAYING' || gameState === 'SERVING') {
            setPlayerX(Math.max(40, Math.min(COURT_WIDTH - 40, x)));
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!touchStart || !containerRef.current || !canHit) {
            setTouchStart(null);
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const endX = (e.clientX - rect.left) / rect.width * COURT_WIDTH;
        const endY = (e.clientY - rect.top) / rect.height * COURT_HEIGHT;

        const dx = endX - touchStart.x;
        const dy = endY - touchStart.y;
        const dt = Date.now() - touchStart.time;
        const swipeSpeed = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 1) * 10;

        // Check if player is close enough to ball (generous hit zone)
        const distanceToBall = Math.abs(ball.x - playerX);
        if (distanceToBall < RACKET_WIDTH && ball.y > COURT_HEIGHT - HIT_ZONE_HEIGHT) {
            const hitAngle = (ball.x - playerX) / RACKET_WIDTH + (dx / 100);

            // Determine shot type based on gesture
            let shotType: ShotType = 'drive';
            if (dy < -30 && swipeSpeed > 3) {
                shotType = 'power'; // Fast upward swipe
            } else if (dy > 20) {
                shotType = 'lob'; // Downward swipe = lob
            } else if (Math.abs(dx) > 40 && swipeSpeed < 2) {
                shotType = 'slice'; // Slow horizontal = slice
            }

            hitBall(shotType, hitAngle);
        }

        setTouchStart(null);
    };

    // Also handle tap to hit (simpler input)
    const handleTap = () => {
        if (!canHit || gameState !== 'PLAYING') return;
        
        const distanceToBall = Math.abs(ball.x - playerX);
        if (distanceToBall < RACKET_WIDTH && ball.y > COURT_HEIGHT - HIT_ZONE_HEIGHT) {
            const hitAngle = (ball.x - playerX) / RACKET_WIDTH;
            hitBall('drive', hitAngle);
        }
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
            <div
                ref={containerRef}
                className="relative bg-gradient-to-b from-green-700 to-green-800 rounded-xl overflow-hidden shadow-2xl touch-none select-none"
                style={{ 
                    width: `${COURT_WIDTH}px`, 
                    height: `${COURT_HEIGHT}px`, 
                    maxHeight: '90vh', 
                    maxWidth: '90vw', 
                    aspectRatio: `${COURT_WIDTH}/${COURT_HEIGHT}` 
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={handleTap}
            >
                {/* Court surface */}
                <div className="absolute inset-3 bg-blue-500 rounded-lg border-4 border-white">
                    {/* Net */}
                    <div className="absolute left-0 right-0 top-1/2 h-1.5 bg-white -translate-y-1/2 shadow-lg" />
                    {/* Service boxes */}
                    <div className="absolute left-1/2 top-[20%] bottom-[20%] w-0.5 bg-white/60 -translate-x-1/2" />
                    <div className="absolute left-3 right-3 top-[20%] h-0.5 bg-white/60" />
                    <div className="absolute left-3 right-3 bottom-[20%] h-0.5 bg-white/60" />
                    {/* Baseline markers */}
                    <div className="absolute left-1/2 top-2 w-3 h-0.5 bg-white -translate-x-1/2" />
                    <div className="absolute left-1/2 bottom-2 w-3 h-0.5 bg-white -translate-x-1/2" />
                </div>

                {/* Net visual */}
                <div className="absolute left-3 right-3 top-1/2 h-4 -translate-y-1/2 bg-gradient-to-b from-gray-100 to-gray-300 rounded-sm shadow-md z-10 opacity-90" />

                {/* NPC Racket */}
                <div
                    className="absolute h-5 -translate-x-1/2 z-20 transition-all duration-75"
                    style={{ width: `${RACKET_WIDTH}px`, left: `${npcX}px`, top: '28px' }}
                >
                    <div className="w-full h-full bg-gradient-to-b from-red-400 to-red-600 rounded-full border-2 border-red-800 shadow-lg" />
                </div>

                {/* Player Racket */}
                <div
                    className="absolute h-5 -translate-x-1/2 z-20 transition-all duration-75"
                    style={{ width: `${RACKET_WIDTH}px`, left: `${playerX}px`, bottom: '28px' }}
                >
                    <div className={`w-full h-full rounded-full border-2 shadow-lg transition-colors ${
                        hitWindow 
                            ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600' 
                            : 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800'
                    }`} />
                </div>

                {/* Hit zone indicator when ball is coming */}
                {canHit && gameState === 'PLAYING' && (
                    <div 
                        className="absolute left-3 right-3 border-2 border-dashed border-yellow-400/50 rounded-lg z-5 pointer-events-none"
                        style={{ bottom: '20px', height: `${HIT_ZONE_HEIGHT - 20}px` }}
                    />
                )}

                {/* Ball trail */}
                {gameState !== 'MENU' && ball.trail.map((pos, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-300/30 z-25 pointer-events-none"
                        style={{
                            width: `${BALL_SIZE * 0.6}px`,
                            height: `${BALL_SIZE * 0.6}px`,
                            left: `${pos.x - BALL_SIZE * 0.3}px`,
                            top: `${pos.y - BALL_SIZE * 0.3 - pos.height}px`,
                            opacity: (i + 1) / ball.trail.length * 0.4,
                        }}
                    />
                ))}

                {/* Ball */}
                {gameState !== 'MENU' && (
                    <div
                        className="absolute rounded-full z-30 pointer-events-none"
                        style={{
                            width: `${BALL_SIZE}px`,
                            height: `${BALL_SIZE}px`,
                            left: `${ball.x - BALL_SIZE / 2}px`,
                            top: `${ball.y - BALL_SIZE / 2 - ball.height}px`,
                            background: 'linear-gradient(135deg, #DFFF00 0%, #9ACD32 100%)',
                            border: '2px solid #228B22',
                            boxShadow: `0 ${ball.height / 3}px ${ball.height / 2}px rgba(0,0,0,0.3)`,
                            transform: `scale(${1 - ball.height * 0.002})`,
                        }}
                    />
                )}

                {/* Ball shadow */}
                {gameState !== 'MENU' && (
                    <div
                        className="absolute rounded-full bg-black/25 blur-sm z-5 pointer-events-none"
                        style={{
                            width: `${BALL_SIZE * 0.7}px`,
                            height: `${BALL_SIZE * 0.35}px`,
                            left: `${ball.x - BALL_SIZE * 0.35}px`,
                            top: `${ball.y - BALL_SIZE * 0.18}px`,
                            transform: `scale(${1 + ball.height * 0.008})`,
                        }}
                    />
                )}

                {/* Score Display - Tennis Style */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-lg text-white z-40">
                    <div className="flex items-center gap-3 text-xs">
                        <div className="text-center">
                            <div className="text-green-400 font-bold">YOU</div>
                            <div className="font-mono">{score.sets[0]}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-400 text-[10px]">SETS</div>
                            <div className="text-lg font-bold">{score.games[0]} - {score.games[1]}</div>
                            <div className="text-yellow-400 font-bold text-sm">
                                {getPointDisplay(score.points[0], score.points[1], score.isDeuce, score.advantage)}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-red-400 font-bold">OPP</div>
                            <div className="font-mono">{score.sets[1]}</div>
                        </div>
                    </div>
                    {getGameStatus() && (
                        <div className="text-center text-[10px] text-yellow-300 font-bold mt-0.5">
                            {getGameStatus()}
                        </div>
                    )}
                </div>

                {/* Rally Counter */}
                {gameState === 'PLAYING' && rallyCount > 1 && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/40 px-2 py-0.5 rounded text-white text-xs z-40">
                        Rally: {rallyCount}
                    </div>
                )}

                {/* Shot Feedback */}
                {showShotFeedback && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-black z-50 animate-bounce drop-shadow-lg">
                        {showShotFeedback}
                    </div>
                )}

                {/* MENU */}
                {gameState === 'MENU' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50">
                        <div className="text-6xl mb-2">🎾</div>
                        <h1 className="text-3xl font-black text-white mb-1">TENNIS</h1>
                        <p className="text-gray-400 text-xs mb-4">First to 2 sets wins!</p>
                        
                        <div className="flex flex-col gap-2 w-40">
                            <button
                                onClick={() => startGame('easy')}
                                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-400 hover:to-green-500 transition-all"
                            >
                                Easy
                            </button>
                            <button
                                onClick={() => startGame('medium')}
                                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all"
                            >
                                Medium
                            </button>
                            <button
                                onClick={() => startGame('hard')}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-400 hover:to-red-500 transition-all"
                            >
                                Hard
                            </button>
                        </div>
                        
                        <div className="mt-4 text-gray-500 text-[10px] text-center max-w-[200px]">
                            <p>Tap/swipe to hit</p>
                            <p>Swipe up fast = Power</p>
                            <p>Swipe down = Lob</p>
                        </div>
                        
                        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-sm">
                            Close
                        </button>
                    </div>
                )}

                {/* SERVING */}
                {gameState === 'SERVING' && isPlayerServing && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-40">
                        <div className="text-white text-lg font-bold animate-pulse mb-1">TAP TO SERVE</div>
                        <div className="text-gray-300 text-[10px]">Tap left, center, or right</div>
                    </div>
                )}

                {/* Hit Prompt */}
                {canHit && gameState === 'PLAYING' && (
                    <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 text-sm font-bold z-40 ${
                        hitWindow ? 'text-yellow-300 animate-pulse scale-110' : 'text-white/70'
                    }`}>
                        {hitWindow ? 'NOW!' : 'Ready...'}
                    </div>
                )}

                {/* POINT_SCORED */}
                {gameState === 'POINT_SCORED' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="text-center">
                            <p className="text-4xl font-black text-white animate-bounce">
                                {score.isDeuce ? (score.advantage ? 'ADVANTAGE' : 'DEUCE') : 'POINT!'}
                            </p>
                            {rallyCount > 5 && (
                                <p className="text-yellow-400 text-sm mt-1">{rallyCount} shot rally!</p>
                            )}
                        </div>
                    </div>
                )}

                {/* MATCH_OVER */}
                {gameState === 'MATCH_OVER' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-50">
                        <div className="text-5xl mb-3">
                            {score.sets[0] > score.sets[1] ? '🏆' : '😤'}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">
                            {score.sets[0] > score.sets[1] ? 'YOU WIN!' : 'GAME OVER'}
                        </h2>
                        <p className="text-xl text-gray-300 mb-1">
                            {score.sets[0]} - {score.sets[1]} sets
                        </p>
                        <p className="text-sm text-gray-400 mb-6">
                            Final game: {score.games[0]} - {score.games[1]}
                        </p>
                        <button
                            onClick={() => setGameState('MENU')}
                            className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-all"
                        >
                            Play Again
                        </button>
                        <button onClick={onClose} className="mt-3 text-gray-400 hover:text-white">
                            Exit
                        </button>
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-1 right-1 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 z-50 text-sm"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default SimpleTennisGame;
