import React, { useState } from 'react';

// ============================================
// TYPES
// ============================================
interface Streak {
  current: number;
  best: number;
  goal: number;
}

interface WeeklyChallenge {
  title: string;
  progress: number;
  goal: number;
  daysLeft: number;
  reward: string;
}

interface Badge {
  icon: string;
  name: string;
  earned: boolean;
  date?: string;
  description?: string;
  progress?: number;
  goal?: number;
}

interface StreaksAchievementsProps {
  streaks?: {
    playingStreak: Streak;
    winStreak: Streak;
  };
  weeklyChallenge?: WeeklyChallenge;
  badges?: Badge[];
}

// Badge icon helper - returns SVG based on badge type
const getBadgeIcon = (name: string, className: string = "w-6 h-6") => {
  const iconMap: Record<string, JSX.Element> = {
    "First Match": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
    "7-Day Streak": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    "5-Win Streak": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    "Level Up": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    "10 Friends": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "Local Legend": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "Early Bird": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    "Sharpshooter": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    "Century Club": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    "Champion": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    "All-Star": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    "Ironman": (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };
  
  return iconMap[name] || (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
};

// ============================================
// MOCK DATA (used if no props provided)
// ============================================
const defaultStreaks = {
  playingStreak: { current: 7, best: 12, goal: 10 },
  winStreak: { current: 3, best: 5, goal: 10 },
};

const defaultWeeklyChallenge = {
  title: "Play 3 matches this week",
  progress: 2,
  goal: 3,
  daysLeft: 4,
  reward: "Weekend Warrior",
};

const defaultBadges: Badge[] = [
  { icon: "match", name: "First Match", earned: true, date: "Jan 5, 2025", description: "Play your first match" },
  { icon: "streak", name: "7-Day Streak", earned: true, date: "Jan 10, 2025", description: "Play 7 days in a row" },
  { icon: "trophy", name: "5-Win Streak", earned: true, date: "Jan 12, 2025", description: "Win 5 matches in a row" },
  { icon: "star", name: "Level Up", earned: true, date: "Jan 8, 2025", description: "Improve your NTRP rating" },
  { icon: "friends", name: "10 Friends", earned: true, date: "Jan 15, 2025", description: "Connect with 10 players" },
  { icon: "location", name: "Local Legend", earned: true, date: "Jan 14, 2025", description: "Play at 5 different courts" },
  { icon: "sun", name: "Early Bird", earned: true, date: "Jan 11, 2025", description: "Play a match before 8am" },
  { icon: "target", name: "Sharpshooter", earned: true, date: "Jan 13, 2025", description: "Win 3 tiebreaks" },
  { icon: "chart", name: "Century Club", earned: false, description: "Win 100 matches", progress: 12, goal: 100 },
  { icon: "crown", name: "Champion", earned: false, description: "Win a tournament", progress: 0, goal: 1 },
  { icon: "allstar", name: "All-Star", earned: false, description: "Reach top 10 in leaderboard", progress: 4, goal: 10 },
  { icon: "bolt", name: "Ironman", earned: false, description: "Play 30 days in a row", progress: 7, goal: 30 },
];

// ============================================
// COMPONENT
// ============================================
const StreaksAchievements: React.FC<StreaksAchievementsProps> = ({
  streaks = defaultStreaks,
  weeklyChallenge = defaultWeeklyChallenge,
  badges = defaultBadges,
}) => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  
  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  return (
    <>
      {/* ===== MAIN SECTION ===== */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 mt-6 border border-gray-200 shadow-sm bg-slate-900">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
          STREAKS & ACHIEVEMENTS
        </h2>

        {/* ===== CURRENT STREAKS ===== */}
        <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
          <h3 className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-1">
            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            CURRENT STREAKS
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Playing Streak */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Playing Streak</p>
              <p className="text-3xl font-bold text-white mt-1">
                {streaks.playingStreak.current} 
                <span className="text-lg text-gray-400 font-normal"> days</span>
              </p>
              
              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-500"
                  style={{ width: `${(streaks.playingStreak.current / streaks.playingStreak.goal) * 100}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Best: {streaks.playingStreak.best} days</p>
            </div>
            
            {/* Win Streak */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Win Streak
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {streaks.winStreak.current} 
                <span className="text-lg text-gray-400 font-normal"> wins</span>
              </p>
              
              {/* Progress Bar */}
              <div className="h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(streaks.winStreak.current / streaks.winStreak.goal) * 100}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Best: {streaks.winStreak.best} wins</p>
            </div>
          </div>
        </div>

        {/* ===== WEEKLY CHALLENGE ===== */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-purple-300 text-sm font-semibold">WEEKLY CHALLENGE</p>
              <p className="text-white font-medium mt-1">{weeklyChallenge.title}</p>
            </div>
            <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">
              {weeklyChallenge.daysLeft} days left
            </span>
          </div>
          
          {/* Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Progress</span>
              <span className="text-white font-semibold">{weeklyChallenge.progress}/{weeklyChallenge.goal}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.goal) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Reward */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Reward:</span>
            <span className="text-amber-400 font-medium">"{weeklyChallenge.reward}" badge</span>
          </div>
        </div>

        {/* ===== BADGES EARNED ===== */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">BADGES EARNED</h3>
            <span className="text-gray-400 text-sm">{earnedBadges.length}/{badges.length}</span>
          </div>
          
          {/* Badges Grid */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            {badges.slice(0, 10).map((badge, i) => (
              <div 
                key={i}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer
                  transition-all duration-200 hover:scale-105 border
                  ${badge.earned 
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30' 
                    : 'bg-white/5 opacity-40 border-white/5'}
                `}
                title={badge.name}
              >
                <span className={`${badge.earned ? 'text-yellow-400' : 'text-gray-500'}`}>{getBadgeIcon(badge.name, "w-6 h-6")}</span>
                <span className="text-xs text-gray-300 mt-1 text-center truncate w-full">{badge.name}</span>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <button 
            onClick={() => setShowAllBadges(true)}
            className="w-full text-lime-400 text-sm hover:text-lime-300 transition-colors py-2"
          >
            View All Badges →
          </button>
        </div>
      </div>

      {/* ===== ALL BADGES MODAL ===== */}
      {showAllBadges && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-white/10 animate-slideDown">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-lg">ALL BADGES</h3>
              <button 
                onClick={() => setShowAllBadges(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {/* Earned Section */}
              <div className="mb-6">
                <p className="text-lime-400 font-semibold text-sm mb-3">EARNED ({earnedBadges.length})</p>
                <div className="space-y-2">
                  {earnedBadges.map((badge, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10">
                      <span className="text-yellow-400">{getBadgeIcon(badge.name, "w-8 h-8")}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{badge.name}</p>
                        <p className="text-gray-400 text-sm">{badge.description}</p>
                      </div>
                      <p className="text-gray-500 text-xs">Earned {badge.date}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Locked Section */}
              <div>
                <p className="text-gray-400 font-semibold text-sm mb-3">LOCKED ({lockedBadges.length})</p>
                <div className="space-y-2">
                  {lockedBadges.map((badge, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center gap-3 opacity-60 border border-white/10">
                      <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <div className="flex-1">
                        <p className="text-white font-medium">{badge.name}</p>
                        <p className="text-gray-400 text-sm">{badge.description}</p>
                        {badge.progress !== undefined && badge.goal !== undefined && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gray-500 rounded-full"
                                style={{ width: `${(badge.progress / badge.goal) * 100}%` }}
                              />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{badge.progress}/{badge.goal}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StreaksAchievements;