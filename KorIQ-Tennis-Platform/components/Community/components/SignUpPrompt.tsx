import React from 'react';

// Context types for determining which roles to show
export type SignUpContext = 
  | 'default'           // Show all options
  | 'find_player'       // Player only
  | 'book_lesson'       // Player only
  | 'post_tutorial'     // Coach only
  | 'ball_park'         // Player, Coach, or Club
  | 'join_event'        // Player, Coach, or Club
  | 'create_event';     // Player, Coach, or Club

interface SignUpPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'PLAYER' | 'COACH' | 'CLUB') => void;
  onLogin: () => void;
  action?: string;
  context?: SignUpContext;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ 
  isOpen, 
  onClose, 
  onSelectRole, 
  onLogin,
  action = 'continue',
  context = 'default'
}) => {
  if (!isOpen) return null;

  const allRoles = [
    {
      id: 'PLAYER' as const,
      title: 'Player',
      description: 'Find matches, join events, connect with players',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'COACH' as const,
      title: 'Independent Coach',
      description: 'Build your coaching business, post tutorials',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 'CLUB' as const,
      title: 'Club',
      description: 'Manage your club, coaches, and members',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  // Filter roles based on context
  const getRolesForContext = () => {
    switch (context) {
      case 'find_player':
      case 'book_lesson':
        return allRoles.filter(r => r.id === 'PLAYER');
      case 'post_tutorial':
        return allRoles.filter(r => r.id === 'COACH');
      case 'ball_park':
      case 'join_event':
      case 'create_event':
        return allRoles; // All roles can post/join events
      default:
        return allRoles;
    }
  };

  const roles = getRolesForContext();
  const isSingleOption = roles.length === 1;

  // Get context-specific icon and message
  const getContextIcon = () => {
    switch (context) {
      case 'book_lesson':
        return (
          <svg className="w-8 h-8 text-coaches" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'post_tutorial':
        return (
          <svg className="w-8 h-8 text-coaches" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-tennis-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
    }
  };

  const getIconBgColor = () => {
    switch (context) {
      case 'book_lesson':
      case 'post_tutorial':
        return 'bg-green-100';
      default:
        return 'bg-tennis-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${getIconBgColor()} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {getContextIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSingleOption 
                ? `Create a ${roles[0].title} account to ${action}`
                : `Create an account to ${action}`
              }
            </h2>
            <p className="text-gray-500">
              Join the KorIQ community for free
            </p>
          </div>

          {/* Role selection */}
          <div className="space-y-3 mb-6">
            {!isSingleOption && <p className="text-sm font-medium text-gray-700 text-center">I am a:</p>}
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl transition-all group ${
                  isSingleOption ? 'bg-black hover:bg-gray-800 border-black' : ''
                }`}
              >
                {isSingleOption ? (
                  <>
                    <span className="flex-1 text-center font-semibold text-white">
                      Create {role.title} Account
                    </span>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors shadow-sm">
                      {role.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 transition-colors">
                        {role.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {role.description}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Login link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <button
                onClick={onLogin}
                className="text-gray-900 hover:text-black font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default SignUpPrompt;
