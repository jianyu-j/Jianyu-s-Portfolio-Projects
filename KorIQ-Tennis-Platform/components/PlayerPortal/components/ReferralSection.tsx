
import React, { useState } from 'react';

const mockReferral = {
  code: 'JOHN2025',
  url: 'koriq.app/join/JOHN2025',
  friendsJoined: 3,
  badgeEarned: 'Connector',
};

const ReferralSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { code, url, friendsJoined, badgeEarned } = mockReferral;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-5 mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2 relative z-10">
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> Invite Friends
      </h3>

      <p className="text-gray-600 text-sm mb-4 relative z-10">
        Share KorIQ with your tennis friends!
      </p>

      {/* Referral Code Display */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4 relative z-10 shadow-sm">
        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Your referral code: <span className="text-purple-600">{code}</span></p>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
          <code className="flex-1 text-tennis-600 font-mono text-sm truncate">{url}</code>
          <button 
            onClick={handleCopy}
            className="text-gray-500 hover:text-tennis-600 transition-colors p-1.5 bg-white rounded border border-gray-200 hover:border-tennis-300"
            title="Copy to clipboard"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2 text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <span className="text-sm"><strong>{friendsJoined}</strong> friends joined using your code</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-700 mb-5 relative z-10">
        <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
        <span className="text-sm">You've earned: <span className="text-yellow-600 font-bold">"{badgeEarned}"</span> badge</span>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-4 gap-2 relative z-10">
        <button className="bg-black hover:bg-gray-800 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
          <span>𝕏</span>
        </button>
        <button className="bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
          <span>📘</span>
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
          <span>📸</span>
        </button>
        <button 
          onClick={handleCopy}
          className="bg-tennis-600 hover:bg-tennis-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ReferralSection;
