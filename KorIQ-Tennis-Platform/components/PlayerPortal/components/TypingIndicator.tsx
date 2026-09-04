
import React from 'react';

interface TypingIndicatorProps {
  name?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-xs italic p-1 animate-fadeIn">
      <div className="flex gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      {name && <span>{name} is typing...</span>}
    </div>
  );
};

export default TypingIndicator;
