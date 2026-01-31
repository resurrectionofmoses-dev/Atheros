
import React from 'react';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';
import { AetherOSIcon } from './icons/AetherOSIcon';
import { SearchIcon } from './icons/SearchIcon';
import { XIcon } from './icons/XIcon';

interface ChatHeaderProps {
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isTtsEnabled, onToggleTts, searchQuery, onSearchChange }) => {
  return (
    <div className="p-4 border-b-4 border-black sticky top-0 z-10 bg-gray-800 rounded-t-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300 border-2 border-black flex-shrink-0" data-theme="aetheros">
             <AetherOSIcon className="w-8 h-8 text-black" />
          </div>
          <div className="min-w-0">
              <h2 className="font-comic-header text-3xl text-white leading-tight truncate">AetherOS</h2>
              <p className="text-gray-300 text-sm leading-tight truncate -mt-1">Vehicle Control Interface</p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input 
                    type="search"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-900/80 border-2 border-black rounded-lg py-1.5 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
                />
                {searchQuery && (
                    <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white">
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
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
    </div>
  );
};
