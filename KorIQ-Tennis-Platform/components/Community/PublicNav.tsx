import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PublicNavProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onClose: () => void;
}

const PublicNav: React.FC<PublicNavProps> = ({ onLoginClick, onSignupClick, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/community/courts', label: 'Courts', color: 'courts' },
    { path: '/community/coaches', label: 'Coaches', color: 'coaches' },
    { path: '/community/clubs', label: 'Clubs', color: 'clubs' },
    { path: '/community/players', label: 'Players', color: 'players' },
    { path: '/community/ball-park', label: 'Ball Park', color: 'ballpark' },
    { path: '/community/match-up', label: 'Match Up', color: 'matchup' },
  ];

  // Get accent color classes for each tab
  const getTabAccentColor = (colorKey: string) => {
    const colors: Record<string, { border: string; text: string; bg: string }> = {
      courts: { border: 'border-courts', text: 'text-courts', bg: 'bg-courts' },
      coaches: { border: 'border-coaches', text: 'text-coaches', bg: 'bg-coaches' },
      clubs: { border: 'border-clubs', text: 'text-clubs', bg: 'bg-clubs' },
      players: { border: 'border-players', text: 'text-players', bg: 'bg-players' },
      ballpark: { border: 'border-ballpark', text: 'text-ballpark', bg: 'bg-ballpark' },
      matchup: { border: 'border-matchup', text: 'text-matchup', bg: 'bg-matchup' },
    };
    return colors[colorKey] || colors.courts;
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top row: Logo and Auth buttons */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <button
            onClick={onClose}
            className="text-xl font-black tracking-tight text-gray-900 hover:text-tennis-600 transition-colors"
          >
            KorIQ
          </button>

          {/* Right side - Auth buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Horizontal scrollable tabs - works on all screen sizes */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 -mb-px scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item) => {
            const accent = getTabAccentColor(item.color);
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                  active
                    ? `${accent.border} text-gray-900`
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;
