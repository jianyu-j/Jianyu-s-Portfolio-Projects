
import React from 'react';

interface QuickReplyBarProps {
  onReply: (text: string) => void;
}

const quickReplies = [
  { text: 'Sounds good!' },
  { text: "I'm in!" },
  { text: 'When works for you?' },
  { text: 'Where should we play?' },
  { text: 'Let me check my schedule' },
  { text: "Can't make it, sorry!" },
];

const QuickReplyBar: React.FC<QuickReplyBarProps> = ({ onReply }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar mask-gradient">
      {quickReplies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onReply(reply.text)}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs whitespace-nowrap border border-white/20 transition-all active:scale-95 shadow-sm backdrop-blur-sm"
        >
          {reply.text}
        </button>
      ))}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default QuickReplyBar;
