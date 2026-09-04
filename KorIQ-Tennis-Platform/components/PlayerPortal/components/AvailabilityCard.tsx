
import React, { useState } from 'react';

export interface AvailabilityData {
  saturday: string[];
  sunday: string[];
  weekdays: boolean;
}

interface AvailabilityCardProps {
  mode: 'view' | 'select';
  data?: AvailabilityData;
  onShare?: (data: AvailabilityData) => void;
  onClose?: () => void;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ mode, data, onShare, onClose }) => {
  const [selection, setSelection] = useState<AvailabilityData>({
    saturday: ['Morning'],
    sunday: [],
    weekdays: false,
  });

  const toggleTime = (day: 'saturday' | 'sunday', time: string) => {
    setSelection(prev => {
      const list = prev[day];
      return {
        ...prev,
        [day]: list.includes(time) ? list.filter(t => t !== time) : [...list, time]
      };
    });
  };

  if (mode === 'view' && data) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-white/10 w-64 shadow-lg">
        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-white font-bold text-xs uppercase tracking-wide">My Availability</span>
        </div>
        <div className="space-y-2 text-sm">
          {data.saturday.length > 0 && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-bold uppercase w-16 pt-0.5">Sat</span>
              <span className="text-white flex-1 text-right bg-white/5 px-2 py-0.5 rounded">{data.saturday.join(', ')}</span>
            </div>
          )}
          {data.sunday.length > 0 && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-bold uppercase w-16 pt-0.5">Sun</span>
              <span className="text-white flex-1 text-right bg-white/5 px-2 py-0.5 rounded">{data.sunday.join(', ')}</span>
            </div>
          )}
          {data.weekdays && (
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs font-bold uppercase w-16 pt-0.5">Wkdays</span>
              <span className="text-[#a3e635] flex-1 text-right font-bold">Evenings</span>
            </div>
          )}
          {!data.saturday.length && !data.sunday.length && !data.weekdays && (
             <p className="text-gray-500 text-center italic text-xs">No specific slots selected</p>
          )}
        </div>
      </div>
    );
  }

  // Select Mode (Modal Content)
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-white/10 w-full max-w-sm shadow-2xl animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Share Availability
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl">✕</button>
      </div>
      
      <div className="space-y-5 mb-6">
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold mb-2 ml-1">Saturday</p>
          <div className="flex gap-2">
            {['Morning', 'Afternoon', 'Evening'].map(t => (
              <button
                key={t}
                onClick={() => toggleTime('saturday', t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                  selection.saturday.includes(t)
                    ? 'bg-[#a3e635] text-slate-900 border-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs uppercase font-bold mb-2 ml-1">Sunday</p>
          <div className="flex gap-2">
            {['Morning', 'Afternoon', 'Evening'].map(t => (
              <button
                key={t}
                onClick={() => toggleTime('sunday', t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                  selection.sunday.includes(t)
                    ? 'bg-[#a3e635] text-slate-900 border-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input 
            type="checkbox" 
            checked={selection.weekdays}
            onChange={(e) => setSelection({...selection, weekdays: e.target.checked})}
            className="w-5 h-5 rounded border-gray-600 bg-slate-800 text-[#a3e635] focus:ring-[#a3e635] accent-[#a3e635]"
          />
          <span className="text-gray-300 text-sm font-medium">Available Weekday Evenings</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onClose} 
          className="flex-1 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors hover:bg-white/5 rounded-xl"
        >
          Cancel
        </button>
        <button 
          onClick={() => onShare && onShare(selection)} 
          className="flex-1 py-3 bg-[#a3e635] hover:bg-[#84cc16] text-slate-900 font-bold rounded-xl text-sm shadow-lg hover:shadow-[#a3e635]/20 transition-all transform active:scale-95"
        >
          Send Availability
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCard;
