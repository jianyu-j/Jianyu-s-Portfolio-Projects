import React from 'react';
import { Tutorial } from '../../types';

interface TutorialCardProps {
  tutorial: Tutorial;
  onWatch?: () => void;
  onPurchase?: () => void;
  showCoachInfo?: boolean;
  isOwned?: boolean;
  compact?: boolean;
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  onWatch,
  onPurchase,
  showCoachInfo = true,
  isOwned = false,
  compact = false,
}) => {
  const isPrivate = tutorial.type === 'Private';
  const canWatch = !isPrivate || isOwned;

  const handleClick = () => {
    if (canWatch && onWatch) {
      onWatch();
    } else if (isPrivate && !isOwned && onPurchase) {
      onPurchase();
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className="flex gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="relative w-24 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
              <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          {/* Type badge */}
          {isPrivate && !isOwned && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-black text-white text-[10px] font-bold rounded">
              ${tutorial.price}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{tutorial.title}</h4>
          {showCoachInfo && (
            <p className="text-xs text-gray-500 mt-0.5">{tutorial.coachName}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{tutorial.skillLevel}</span>
            {tutorial.duration && (
              <span className="text-xs text-gray-400">{tutorial.duration} min</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
        {tutorial.thumbnailUrl ? (
          <img 
            src={tutorial.thumbnailUrl} 
            alt={tutorial.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            {canWatch ? (
              <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
        </div>

        {/* Type badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow ${
          isPrivate 
            ? isOwned ? 'bg-green-500 text-white' : 'bg-black text-white'
            : 'bg-green-500 text-white'
        }`}>
          {isPrivate ? (isOwned ? 'OWNED' : `$${tutorial.price}`) : 'FREE'}
        </span>

        {/* Duration badge */}
        {tutorial.duration && (
          <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
            {tutorial.duration} min
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{tutorial.title}</h3>
        
        {showCoachInfo && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-coaches rounded-full flex items-center justify-center text-white text-xs font-bold">
              {tutorial.coachName.charAt(0)}
            </div>
            <span className="text-sm text-gray-600">{tutorial.coachName}</span>
          </div>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{tutorial.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {tutorial.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {tutorial.likes}
            </span>
          </div>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {tutorial.skillLevel}
          </span>
        </div>

        {/* CTA Button */}
        {isPrivate && !isOwned && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase?.();
            }}
            className="w-full mt-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Purchase - ${tutorial.price}
          </button>
        )}
      </div>
    </div>
  );
};

export default TutorialCard;
