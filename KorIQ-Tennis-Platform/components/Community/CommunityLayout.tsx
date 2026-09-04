import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PublicNav from './PublicNav';
import SignUpPrompt from './components/SignUpPrompt';
import Courts from './pages/Courts';
import Coaches from './pages/Coaches';
import CoachProfile from './pages/CoachProfile';
import Clubs from './pages/Clubs';
import ClubProfile from './pages/ClubProfile';
import Players from './pages/Players';
import PlayerProfile from './pages/PlayerProfile';
import BallPark from './pages/BallPark';
import MatchUp from './pages/MatchUp';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import ApplyToHost from './pages/ApplyToHost';

interface CommunityLayoutProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [signUpAction, setSignUpAction] = useState('continue');

  const handleClose = () => {
    navigate('/');
  };

  const handleLoginRequired = (action: string) => {
    setSignUpAction(action);
    setShowSignUpPrompt(true);
  };

  const handleSelectRole = (role: 'PLAYER' | 'COACH' | 'CLUB') => {
    setShowSignUpPrompt(false);
    // This would trigger the signup flow with the selected role
    // For now, we'll just trigger the regular signup
    onSignupClick();
  };

  const handleLogin = () => {
    setShowSignUpPrompt(false);
    onLoginClick();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onClose={handleClose}
      />

      {/* Main content with top padding for fixed nav (two-row header: logo + tabs) */}
      <div className="pt-24">
        <Routes>
          {/* Default redirect to Ball Park */}
          <Route index element={<Navigate to="ball-park" replace />} />

          {/* Courts */}
          <Route path="courts" element={<Courts onLoginRequired={handleLoginRequired} />} />

          {/* Coaches */}
          <Route path="coaches" element={<Coaches onLoginRequired={handleLoginRequired} />} />
          <Route path="coaches/:id" element={<CoachProfile onLoginRequired={handleLoginRequired} />} />

          {/* Clubs */}
          <Route path="clubs" element={<Clubs onLoginRequired={handleLoginRequired} />} />
          <Route path="clubs/:id" element={<ClubProfile onLoginRequired={handleLoginRequired} />} />

          {/* Players */}
          <Route path="players" element={<Players onLoginRequired={handleLoginRequired} />} />
          <Route path="players/:id" element={<PlayerProfile onLoginRequired={handleLoginRequired} />} />

          {/* Ball Park (Social Feed) */}
          <Route path="ball-park" element={<BallPark onLoginRequired={handleLoginRequired} />} />

          {/* Match Up (Partners + Events) */}
          <Route path="match-up" element={<MatchUp onLoginRequired={handleLoginRequired} />} />
          <Route path="match-up/create" element={<CreateEvent onLoginRequired={handleLoginRequired} />} />
          <Route path="match-up/apply-host" element={<ApplyToHost onLoginRequired={handleLoginRequired} />} />
          <Route path="match-up/event/:id" element={<EventDetail onLoginRequired={handleLoginRequired} />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="ball-park" replace />} />
        </Routes>
      </div>

      {/* SignUp Prompt Modal */}
      <SignUpPrompt
        isOpen={showSignUpPrompt}
        onClose={() => setShowSignUpPrompt(false)}
        onSelectRole={handleSelectRole}
        onLogin={handleLogin}
        action={signUpAction}
      />
    </div>
  );
};

export default CommunityLayout;
