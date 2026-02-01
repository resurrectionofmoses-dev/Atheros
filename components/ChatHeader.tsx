
import React, { useState } from 'react';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';
import { AetherOSIcon } from './icons/AetherOSIcon';
import { SearchIcon } from './icons/SearchIcon';
import { XIcon } from './icons/XIcon';
import { ActivityIcon as DateIcon, StarIcon, FireIcon } from './icons';

interface ChatHeaderProps {
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isTtsEnabled, onToggleTts, searchQuery, onSearchChange, 
  startDate, endDate, onDateChange 
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const isFilterActive = searchQuery || startDate || endDate;

  const setPreset = (days: number | null) => {
    if (days === null) {
        onDateChange('', '');
        return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    onDateChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  return (
    <div className="p-4 border-b-4 border-black sticky top-0 z-30 bg-gray-800 rounded-t-lg shadow-xl">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 border-2 border-black flex-shrink-0 rasta-vibe" data-theme="aetheros">
               <AetherOSIcon className="w-8 h-8 text-black" />
            </div>
            <div className="min-w-0 hidden sm:block">
                <h2 className="font-comic-header text-3xl text-white leading-tight truncate">Conscious Nexus</h2>
                <p className="text-gray-300 text-sm leading-tight truncate -mt-1 uppercase tracking-widest text-[9px] font-black opacity-50">Temporal Logic Interface</p>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-2 sm:px-4">
              <div className="relative w-full max-w-md group">
                  <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-amber-500' : 'text-gray-500'}`} />
                  <input 
                      type="search"
                      placeholder="Scour Neural History..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-full bg-gray-900/80 border-2 border-black rounded-lg py-2 pl-9 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white transition-all placeholder:text-gray-700 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-1.5 rounded-md transition-all ${showFilters ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gray-800 text-gray-500 hover:text-white border border-black'}`}
                        title="Temporal Anchors"
                      >
                        <DateIcon className="w-3.5 h-3.5" />
                      </button>
                      {isFilterActive && (
                          <button 
                            onClick={() => { onSearchChange(''); onDateChange('', ''); }} 
                            className="p-1.5 text-red-500 hover:text-red-400 bg-gray-800 border border-black rounded-md"
                            title="Purge Filters"
                          >
                              <XIcon className="w-3.5 h-3.5" />
                          </button>
                      )}
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-2">
              <button 
                  onClick={onToggleTts}
                  className={`p-2 rounded-full transition-colors duration-200 flex-shrink-0 comic-button ${
                      isTtsEnabled 
                      ? 'text-cyan-900 bg-cyan-400' 
                      : 'text-gray-800 bg-gray-300 hover:bg-gray-100'
                  }`}
                  aria-label={isTtsEnabled ? 'Disable Text-to-Speech' : 'Enable Text-to-Speech'}
              >
                  {isTtsEnabled ? <SpeakerIcon className="w-5 h-5" /> : <SpeakerOffIcon className="w-5 h-5" />}
              </button>
          </div>
        </div>

        {/* Chronos Pointer Panel - Redesigned for Rastafari Intuition */}
        {showFilters && (
          <div className="flex flex-col gap-4 p-4 bg-black/80 rounded-2xl border-4 animate-in slide-in-from-top-2 duration-300 backdrop-blur-md relative overflow-hidden" style={{ borderImage: 'linear-gradient(to right, #ef4444, #fbbf24, #22c55e) 1' }}>
             <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-amber-500/5 to-green-600/5 pointer-events-none" />
             
             <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-600/10 border border-red-600/20">
                        <FireIcon className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Quick Vibe Selection:</span>
                    <div className="flex gap-2">
                        {[
                            { label: "Roots (Past 24h)", days: 1, color: 'hover:bg-red-600' },
                            { label: 'Stride (7d)', days: 7, color: 'hover:bg-amber-500' },
                            { label: 'Genesis (Reset)', days: null, color: 'hover:bg-green-600' }
                        ].map((btn) => (
                            <button 
                                key={btn.label}
                                onClick={() => setPreset(btn.days)}
                                className={`px-3 py-1 bg-gray-900 border border-black rounded text-[9px] font-black uppercase text-gray-400 hover:text-black transition-all ${btn.color}`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/10 border border-green-600/20 rounded-xl">
                   <div className={`w-1.5 h-1.5 rounded-full ${startDate || endDate ? 'bg-green-500 animate-ping' : 'bg-gray-800'}`} />
                   <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">Hereditary Flow: {startDate || endDate ? 'LOCKED' : 'FREE'}</span>
                </div>
             </div>

             <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-3 relative z-10">
                <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <div className="relative flex-1 group">
                        <p className="absolute -top-2 left-3 bg-black px-1 text-[7px] font-black text-red-500 uppercase z-10 group-focus-within:text-red-400 transition-colors">Start Ingress (Red)</p>
                        <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => onDateChange(e.target.value, endDate)}
                            className="w-full bg-gray-900 border-2 border-red-900/40 rounded-lg px-3 py-2 text-xs text-red-400 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>
                    <span className="text-amber-500 font-black text-xl">»</span>
                    <div className="relative flex-1 group">
                        <p className="absolute -top-2 left-3 bg-black px-1 text-[7px] font-black text-green-500 uppercase z-10 group-focus-within:text-green-400 transition-colors">End Egress (Green)</p>
                        <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => onDateChange(startDate, e.target.value)}
                            className="w-full bg-gray-900 border-2 border-green-900/40 rounded-lg px-3 py-2 text-xs text-green-400 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <button 
                    onClick={() => onDateChange('', '')}
                    className="p-2 text-gray-600 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                    <XIcon className="w-3 h-3" /> Reset Chronos
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
