
import React, { useState, useMemo } from 'react';
import type { SystemStatus, VehicleSystem, SystemState, SystemDetails, MainView } from '../types';
import { EngineIcon, BatteryIcon, NavigationIcon, InfotainmentIcon, ChevronDownIcon, WarningIcon, WrenchIcon, ServerIcon, ThermometerIcon, ZapIcon, SignalIcon, MusicIcon, BookOpenIcon, BuildIcon, BroadcastIcon, PackageIcon, AetherOSIcon, FireIcon, ShareIcon, ArchiveIcon, SteeringWheelIcon, SuspensionIcon, TractionIcon, ForgeIcon, ActivityIcon, TerminalIcon, CodeIcon, ShieldIcon, SearchIcon, LogicIcon, BrainIcon, UserIcon, StarIcon, DownloadIcon, RulesIcon } from './icons';

interface SidebarProps {
  systemStatus: SystemStatus;
  systemDetails: SystemDetails;
  currentView: MainView;
  onSetView: (view: MainView) => void;
}

const systemDetailsMap: Record<VehicleSystem, { icon: React.FC<{className?: string}> }> = {
    'Engine': { icon: EngineIcon },
    'Battery': { icon: BatteryIcon },
    'Navigation': { icon: NavigationIcon },
    'Infotainment': { icon: InfotainmentIcon },
    'Handling': { icon: SteeringWheelIcon },
};

const operations: { view: MainView; text: string; icon: React.FC<{className?: string}> }[] = [
    { view: 'coding_network', text: 'Coding Grid', icon: CodeIcon },
    { view: 'covenant', text: 'Network Covenant', icon: RulesIcon },
    { view: 'launch_center', text: 'Deployment Center', icon: DownloadIcon },
    { view: 'packaging_suite', text: 'Packaging Suite', icon: PackageIcon },
    { view: 'code_agent', text: 'Maestro Solo', icon: MusicIcon },
    { view: 'enlightenment_pool', text: 'Conjunction Pool', icon: BrainIcon },
    { view: 'integrity_network', text: 'Sisters: Wisdom', icon: ShieldIcon },
    { view: 'strategic_overview', text: 'Sisters: Shield', icon: FireIcon },
    { view: 'network_sentinel', text: 'Kali Sentinel', icon: SearchIcon },
    { view: 'zurich', text: 'Zurich Bridge', icon: SignalIcon },
    { view: 'bluetooth_bridge', text: 'Bluetooth SIG', icon: BroadcastIcon },
    { view: 'pseudorole_testing', text: 'Persona Stress', icon: UserIcon },
    { view: 'projects', text: 'Crazy Projects', icon: CodeIcon },
    { view: 'nexus', text: 'Nexus Series', icon: LogicIcon },
    { view: 'vault', text: 'Mainframe Vault', icon: ServerIcon },
    { view: 'diagnostics', text: 'Forensic Audit', icon: WrenchIcon },
    { view: 'device_link', text: 'Device Link', icon: ShareIcon },
    { view: 'workshop', text: 'Neural Workshop', icon: BuildIcon },
    { view: 'forge', text: 'Blueprints Forge', icon: ForgeIcon },
    { view: 'singularity_engine', text: 'Singularity Engine', icon: ActivityIcon },
    { view: 'up_north', text: 'Kinetic Up North', icon: ZapIcon },
    { view: 'module_bay', text: 'Mutation Bay', icon: PackageIcon },
    { view: 'communications', text: 'Signal Comms', icon: BroadcastIcon },
    { view: 'system_archives', text: 'System Archives', icon: ArchiveIcon },
];

const OverallStatus: React.FC<{ status: SystemStatus }> = ({ status }) => {
    const overall = useMemo(() => {
        const statuses = Object.values(status);
        if (statuses.includes('Error')) {
            return { label: 'CRITICAL', color: 'bg-red-500', textColor: 'text-red-400' };
        }
        if (statuses.includes('Warning')) {
            return { label: 'CONJUNCTIVE', color: 'bg-blue-500', textColor: 'text-blue-400' };
        }
        return { label: 'ENLIGHTENED', color: 'bg-red-600', textColor: 'text-red-400' };
    }, [status]);

    return (
        <div className="p-4 mb-6 bg-black/60 rounded-2xl border-2 border-red-900/30 aero-panel">
            <h3 className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-[0.3em]">Conjunction State</h3>
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${overall.color} shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-black animate-pulse`} />
                <span className={`font-comic-header text-2xl font-bold ${overall.textColor} tracking-wider`}>{overall.label}</span>
            </div>
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ systemStatus, systemDetails, currentView, onSetView }) => {
  return (
    <aside className="w-64 h-full p-4 flex-shrink-0 flex flex-col overflow-y-auto bg-black/80 rounded-none border-r-4 border-black shadow-[10px_0_30px_rgba(0,0,0,0.8)] z-50 custom-scrollbar">
      <div className="mb-4 text-center">
          <p className="text-[8px] font-black text-red-500 uppercase tracking-[0.5em] mb-1">AetherOS Conjunctions</p>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-red-900 to-transparent" />
      </div>
      
      <OverallStatus status={systemStatus} />
      
      <div className="mb-8 px-2">
        <h2 className="font-comic-header text-2xl text-red-500 mb-5 tracking-widest wisdom-glow uppercase italic">SQUAD_CONTROL</h2>
        <ul className="space-y-3">
          {(Object.keys(systemStatus) as VehicleSystem[]).map(systemName => {
            const Icon = systemDetailsMap[systemName].icon;
            const status = systemStatus[systemName];
            return (
              <li key={systemName} className="group">
                <button 
                    onClick={() => {}} 
                    className="w-full p-3 flex items-center justify-between text-left transition-all hover:translate-x-1 bg-black/40 border-2 border-black rounded-xl hover:border-red-900/50"
                >
                    <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{systemName}</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'OK' ? 'bg-red-600' : 'bg-amber-500'} shadow-[0_0_5px_currentColor]`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto pt-6 border-t-2 border-black px-2">
            <h3 className="font-comic-header text-xl text-blue-500 mb-5 tracking-wider uppercase">Conjunction Series</h3>
            <div className="space-y-2 pb-4">
                {operations.map(({ view, text, icon: Icon }) => {
                    const isActive = currentView === view;
                    const isSisters = view === 'integrity_network' || view === 'strategic_overview';
                    const isSpecial = view === 'launch_center' || view === 'network_sentinel' || view === 'packaging_suite' || view === 'coding_network' || view === 'covenant';
                    const isBlue = view === 'bluetooth_bridge';
                    
                    return (
                        <button
                            key={view}
                            onClick={() => onSetView(view)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl vista-button transition-all text-left ${
                                isActive
                                    ? (isBlue ? 'bg-blue-900/60 text-white border-blue-500' : isSisters ? 'bg-cyan-900/60 text-white border-cyan-500' : 'bg-red-700/60 text-white border-red-500')
                                    : 'bg-black/40 text-gray-500 border-black'
                            } hover:scale-[1.02]`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'wisdom-glow text-white' : (isBlue ? 'text-blue-800' : isSisters ? 'text-cyan-800' : isSpecial ? (view === 'covenant' ? 'text-amber-500' : 'text-emerald-700') : 'text-gray-700')}`} />
                            <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isActive ? 'text-white' : ''}`}>{text}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    </aside>
  );
};