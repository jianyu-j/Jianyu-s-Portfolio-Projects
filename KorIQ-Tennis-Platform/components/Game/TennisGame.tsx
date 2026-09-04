// TennisGame.tsx - Wrapper that uses the simplified implementation
import React from 'react';
import SimpleTennisGame from './SimpleTennisGame';

interface TennisGameProps {
  onClose: () => void;
}

const TennisGame: React.FC<TennisGameProps> = ({ onClose }) => {
  return <SimpleTennisGame onClose={onClose} />;
};

export default TennisGame;
