
import React, { useMemo } from 'react';
import type { MainView, SystemStatus, EvoLibrary, BroadcastMessage, ChatMessage, PinnedItem, PinType } from '../types';
// Add missing CheckCircleIcon import
import { AetherOSIcon, BookOpenIcon, BroadcastIcon, BuildIcon, MessageCircleIcon, PackageIcon, TerminalIcon, WarningIcon, WrenchIcon, FireIcon, PinIcon, CheckCircleIcon } from './icons';
import { getSophisticatedColor } from '../utils';

interface VaultCardProps {
  view: MainView;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  onSetView: (view: MainView) => void;
  statusElement?: React.ReactNode;
}

const VaultCard: React.FC<VaultCardProps> = ({ view, title, description, icon: Icon, onSetView, statusElement }) => {
  const theme = useMemo(() => getSophisticatedColor(view + title), [view, title]);
  
  return (
    <button
      onClick={() => onSetView(view)}
      className={`comic-panel p-4 text-left h-full flex flex-col transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${theme.bg} ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-black/40 border-2 rounded-lg flex items-center justify-center flex-shrink-0 ${theme.border}`}>
          <Icon className={`w-7 h-7 ${theme.text}`} />
        </div>
        <div>
          <h3 className="font-comic-header text-2xl text-white tracking-tighter">{title}</h3>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest -mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t-2 border-black/50 text-xs text-gray-400 flex-1 flex items-end font-mono">
        {statusElement || <p className="text-gray-600 italic">No live data</p>}
      </div>
    </button>
  );
};

interface OperationsVaultProps {
  onSetView: (view: MainView) => void;
  systemStatus: SystemStatus;
  evoLibrary: EvoLibrary | null;
  lastBroadcast: BroadcastMessage | null;
  lastMessage: ChatMessage;
  savedModulesCount: number;
  savedCommandsCount: number;
  pinnedItems: PinnedItem[];
  onTogglePin: (item: { referenceId: string; type: PinType; title: string; content?: string; }) => void;
  onExecuteCommand: (text: string) => void;
}

export const OperationsVault: React.FC<OperationsVaultProps> = ({ onSetView, systemStatus, evoLibrary, lastBroadcast, lastMessage, savedModulesCount, savedCommandsCount, pinnedItems, onTogglePin, onExecuteCommand }) => {
  const activeAlerts = useMemo(() => {
    return Object.values(systemStatus).filter(s => s !== 'OK').length;
  }, [systemStatus]);

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg">
      <div className="p-4 border-b-4 border-black sticky top-0 z-10 bg-gray-800 rounded-t-lg flex justify-between items-center">
        <div>
            <h2 className="font-comic-header text-3xl text-white uppercase italic tracking-tighter">AetherOS Mainframe</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] -mt-1">Maestro Core Intelligence Buffer</p>
        </div>
        <div className="flex items-center gap-3 p-2 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in slide-in-from-right-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Color Logic Randomized</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-6">
          
          {/* Pinned Items */}
          <div className="aero-panel bg-black/50 p-5 border-white/5">
            <h3 className="font-comic-header text-2xl text-violet-400 border-b-2 border-black pb-2 mb-4 uppercase tracking-tighter flex items-center gap-2">
                <PinIcon className="w-5 h-5 text-violet-500" /> Neural Pinboard
            </h3>
            {pinnedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pinnedItems.map(item => {
                        const theme = getSophisticatedColor(item.id + item.title);
                        return (
                            <div key={item.id} className={`bg-black/60 rounded-xl border-2 p-4 flex flex-col transition-all duration-300 hover:scale-105 ${theme.border} ${theme.glow}`}>
                               <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${theme.text}`}>
                                            {item.type === 'module' ? <PackageIcon className="w-4 h-4" /> : <TerminalIcon className="w-4 h-4" />}
                                        </div>
                                        <p className="font-bold text-sm text-white truncate flex-1 tracking-tight" title={item.title}>{item.title}</p>
                                    </div>
                                    <button onClick={() => onTogglePin(item)} className="p-1 text-gray-700 hover:text-red-500 transition-colors" title="Unpin Item">
                                        <PinIcon className={`w-4 h-4 ${theme.text} fill-current`} />
                                    </button>
                               </div>
                               <div className="mt-6 flex justify-end gap-2">
                                   {item.type === 'module' && (
                                       <button onClick={() => onSetView('module_bay')} className="vista-button text-[9px] font-black uppercase bg-gray-900/40 text-gray-400 px-4 py-1.5 rounded-lg">View Node</button>
                                   )}
                                   {item.type === 'command' && item.content && (
                                       <button onClick={() => onExecuteCommand(item.content!)} className={`vista-button text-[9px] font-black uppercase px-4 py-1.5 rounded-lg ${theme.text.replace('text', 'bg').replace('400', '900/40')} border-${theme.name.toLowerCase()}-500/30`}>Execute</button>
                                   )}
                               </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-600 italic py-8 border-2 border-dashed border-white/5 rounded-2xl">
                    "The board is empty. Pin modules of misery for immediate recall."
                </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="lg:col-span-2 xl:col-span-3">
              <VaultCard
                  view="chat"
                  title="Conscious Nexus"
                  description="High-bandwidth neural conversation."
                  icon={MessageCircleIcon}
                  onSetView={onSetView}
                  statusElement={
                    <div className="flex items-start gap-3">
                      <AetherOSIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2 text-[11px] leading-relaxed italic">
                          <span className="font-black text-gray-500 uppercase mr-2 tracking-tighter">Maestro:</span> "{lastMessage.content}"
                      </p>
                    </div>
                  }
              />
            </div>

            <VaultCard
              view="diagnostics"
              title="Forensic Audit"
              description="Extract DTC signatures & anomalies."
              icon={WrenchIcon}
              onSetView={onSetView}
              statusElement={
                <div className="flex items-center gap-2">
                  <WarningIcon className={`w-4 h-4 ${activeAlerts > 0 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    <span className={activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}>
                      {activeAlerts}
                    </span> Critical Divergences Found
                  </p>
                </div>
              }
            />

            <VaultCard
              view="communications"
              title="Signal Bridge"
              description="Synchronize encrypted logic streams."
              icon={BroadcastIcon}
              onSetView={onSetView}
              statusElement={
                lastBroadcast ? (
                  <div className="font-mono text-[9px] overflow-hidden w-full">
                      <p className="text-gray-600 mb-1">STAGING BROADCAST:</p>
                      <p className="truncate bg-black/40 p-1 rounded border border-white/5">
                          <span className={`${lastBroadcast.color} font-black`}>[{lastBroadcast.source}]</span>
                          <span className="text-gray-400 ml-2">{lastBroadcast.text}</span>
                      </p>
                  </div>
                ) : <p className="text-gray-600 italic">Scanning spectral noise...</p>
              }
            />
            
            <VaultCard
              view="prompts"
              title="Ancient Letters"
              description="A library of pre-calculated misery."
              icon={BookOpenIcon}
              onSetView={onSetView}
              statusElement={
                  <p className="text-[10px] font-black uppercase tracking-widest">
                      <span className="text-violet-400">{evoLibrary?.categories.length || 0}</span> Foundational Directives
                  </p>
              }
            />
            
            <VaultCard
              view="command_deck"
              title="Control Deck"
              description="Inject custom heuristic directives."
              icon={AetherOSIcon}
              onSetView={onSetView}
              statusElement={
                  <p className="text-[10px] font-black uppercase tracking-widest">
                      <span className="text-cyan-400">{savedCommandsCount}</span> Directives Harmonized
                  </p>
              }
            />
            
            <VaultCard
              view="module_bay"
              title="Mutation Bay"
              description="Store and run de-obfuscated nodes."
              icon={PackageIcon}
              onSetView={onSetView}
              statusElement={
                  <p className="text-[10px] font-black uppercase tracking-widest">
                      <span className="text-amber-400">{savedModulesCount}</span> Logic Nodes Stored
                  </p>
              }
            />

            <VaultCard
                view="workshop"
                title="Neural Forge"
                description="Mutate kernel logic into new modules."
                icon={BuildIcon}
                onSetView={onSetView}
                statusElement={<p className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">Forge Temperature: STABLE</p>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
