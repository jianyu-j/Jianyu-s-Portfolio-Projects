
import React, { useState } from 'react';

interface ProfileCompletenessProps {
  onScrollToBio?: () => void;
  onNavigateToCourtFinder?: () => void;
}

const mockProfileData = {
  hasPhoto: false,
  hasBio: false,
  hasPreferredCourts: false,
  hasAvailability: true,
  hasNtrp: true,
};

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ 
  onScrollToBio,
  onNavigateToCourtFinder 
}) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [profileData, setProfileData] = useState(mockProfileData);

  // Calculate completeness
  const items = Object.values(profileData);
  const completedCount = items.filter(Boolean).length;
  const completeness = Math.round((completedCount / items.length) * 100);

  // Get missing items
  const getMissingItems = () => {
    const missing: { label: string; action: () => void }[] = [];
    if (!profileData.hasPhoto) {
      missing.push({ label: 'Add a profile photo', action: () => setShowPhotoUpload(true) });
    }
    if (!profileData.hasBio) {
      missing.push({ label: 'Write a bio', action: () => onScrollToBio?.() });
    }
    if (!profileData.hasPreferredCourts) {
      missing.push({ label: 'Add your preferred courts', action: () => onNavigateToCourtFinder?.() });
    }
    return missing;
  };

  const missingItems = getMissingItems();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, this would upload to storage
      console.log('Uploading file:', file.name);
      setProfileData(prev => ({ ...prev, hasPhoto: true }));
      setShowPhotoUpload(false);
    }
  };

  if (completeness === 100) {
    return (
      <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-5 mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="text-green-800 font-bold text-sm">Profile Complete!</h3>
            <p className="text-green-600 text-xs">You're all set to connect with players.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide">
            Profile Completeness
          </h3>
          <span className="text-tennis-600 font-bold text-lg">{completeness}% Complete</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-tennis-500 to-tennis-600 h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${completeness}%` }}
          ></div>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Complete your profile to get more connection requests!
        </p>

        {missingItems.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase mb-3">Missing:</p>
            <ul className="space-y-2">
              {missingItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-yellow-500 text-xs">•</span>
                  {item.label}
                  <button 
                    onClick={item.action}
                    className="ml-auto text-tennis-600 text-xs font-bold hover:underline bg-tennis-50 px-3 py-1 rounded-full border border-tennis-100 hover:bg-tennis-100 transition-colors"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideDown">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Upload Profile Photo</h3>
              <button 
                onClick={() => setShowPhotoUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-tennis-400 transition-colors">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  📷
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Drag & drop your photo here, or click to browse
                </p>
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <span className="inline-block bg-tennis-600 hover:bg-tennis-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
                    Choose Photo
                  </span>
                </label>
                <p className="text-gray-400 text-xs mt-4">
                  JPG, PNG or GIF • Max 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ProfileCompleteness;
