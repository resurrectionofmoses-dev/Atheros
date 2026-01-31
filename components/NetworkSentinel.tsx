import React, { useState, useEffect, useRef } from 'react';
import { TerminalIcon, ShieldIcon, ActivityIcon, SearchIcon, ZapIcon, WarningIcon, SpinnerIcon } from './icons';

interface NetworkNode {
    id: string;
    ip: string;
    status: 'ACTIVE' | 'VULNERABLE' | 'SHADOW';
    label: string;
    threatLevel: number;
}

export const NetworkSentinel: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [logs, setLogs] = useState<string[]>(["[KALI-SENTINEL] v4.2.0-STABLE initialization...", "[OK] Ethernet interface eth0 bound."]);
    const [nodes, setNodes] = useState<NetworkNode[]>([
        { id: '1', ip: '192.168.1.1', status: 'ACTIVE', label: 'Mainframe Gateway', threatLevel: 2 },
        { id: '2', ip: '10.0.0.15', status: 'VULNERABLE', label: 'Operator-PADD', threatLevel: 85 },
        { id: '3', ip: '172.16.2.99', status: 'SHADOW', label: 'Unknown Peer', threatLevel: 44 },
    ]);
    const logEndRef = useRef<HTMLDivElement>(null);

    const startScan = () => {
        setIsScanning(true);
        setLogs(prev => [...prev, "[!] Initiating stealth packet injection...", "[*] Listening on promiscuous mode..."]);
        
        setTimeout(() => {
            setIsScanning(false);
            setLogs(prev => [...prev, "[SUCCESS] Full network topography mapped.", "[INFO] Found 1 critical vulnerability in AetherLink."]);
        }, 4000);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="h-full flex flex-col bg-black/60 p-6 space-y-6 overflow-hidden aero-panel">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-comic-header text-green-400 kali-glow">NETWORK SENTINEL</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Kali Linux Tested | Security Auditor</p>
                </div>
                <button 
                    onClick={startScan}
                    disabled={isScanning}
                    className="vista-button px-6 py-2 rounded-lg bg-green-900/40 text-green-400 font-bold flex items-center gap-2"
                >
                    {isScanning ? <SpinnerIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
                    {isScanning ? 'SCANNING...' : 'STEALTH SCAN'}
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Visual Node Map */}
                <div className="flex-1 bg-black/40 rounded-xl border border-green-500/20 p-4 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--kali-green) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                        {nodes.map(node => (
                            <div key={node.id} className={`p-4 rounded-lg border-2 text-center transition-all ${node.status === 'VULNERABLE' ? 'border-red-500 bg-red-900/20 animate-pulse' : 'border-green-500/50 bg-green-900/10'}`}>
                                <ZapIcon className={`w-8 h-8 mx-auto mb-2 ${node.status === 'VULNERABLE' ? 'text-red-500' : 'text-green-500'}`} />
                                <p className="text-[10px] font-bold text-gray-400">{node.ip}</p>
                                <p className="text-xs font-black uppercase text-white truncate">{node.label}</p>
                                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${node.threatLevel > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${node.threatLevel}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Logs */}
                <div className="lg:w-1/3 bg-black/80 rounded-xl border border-gray-800 p-4 flex flex-col overflow-hidden font-mono text-xs">
                    <div className="flex items-center gap-2 text-gray-500 border-b border-gray-800 pb-2 mb-2">
                        <TerminalIcon className="w-4 h-4" />
                        <span>CONSOLE_FEED: /dev/pts/0</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('[!]') ? 'text-red-400 font-bold' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-gray-400'}`}>
                                {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-900/40 rounded-lg border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <ShieldIcon className="w-8 h-8 text-blue-400" />
                    <div>
                        <p className="text-sm font-bold text-white uppercase">System Integrity: 98.4%</p>
                        <p className="text-[10px] text-gray-500 font-mono">Kernel 5.15.0-kali1-amd64 | No intrusions detected.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Secure Link</span>
                </div>
            </div>
        </div>
    );
};