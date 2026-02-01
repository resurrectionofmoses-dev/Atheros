
import React, { useState, useEffect, useRef } from 'react';
// Fix: Removed LockIcon from imports because it is defined locally at the bottom of the file
import { ShieldIcon, StarIcon, CheckCircleIcon, SpinnerIcon, WarningIcon, ActivityIcon, TerminalIcon, LogicIcon, FireIcon, ZapIcon, DownloadIcon, BatteryIcon, SignalIcon, CodeIcon, UserIcon } from './icons';
import { getDeviceCompat } from '../utils';
import type { DeviceCompatibility, AccessTier } from '../types';

export const PackagingSuite: React.FC = () => {
    const [compat, setCompat] = useState<DeviceCompatibility | null>(null);
    const [accessTier, setAccessTier] = useState<AccessTier>('USER');
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileProgress, setCompileProgress] = useState(0);
    const [buildLogs, setBuildLogs] = useState<string[]>(["[SYSTEM] Deployment Suite Initialized.", "[ENV] Target: Non-Root Sandbox."]);
    const [suInput, setSuInput] = useState('');
    const [isEscalating, setIsEscalating] = useState(false);

    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCompat(getDeviceCompat());
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [buildLogs]);

    const runBuild = () => {
        setIsCompiling(true);
        setCompileProgress(0);
        const prefix = accessTier === 'ROOT' ? "[ROOT_BUILD]" : "[USER_BUILD]";
        setBuildLogs(prev => [...prev, `${prefix} Initializing AetherOS APK Manifest...`, `${prefix} Injecting ${accessTier === 'ROOT' ? 'Kernel-Level' : 'Sandbox-Safe'} Logic...`]);

        const steps = accessTier === 'ROOT' 
            ? ["Overriding Bootloader...", "Mounting /system as RW...", "Injecting God Logic Binary...", "Stripping signature checks...", "Signing with 0x03E2 Key...", "Finalizing Rooted APK..."]
            : ["Creating WebView Container...", "Bundling Assets...", "Optimizing JS Thread...", "Verifying PWA Permissions...", "Packaging Standard APK..."];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setBuildLogs(prev => [...prev, `${prefix} ${steps[i]}`]);
                setCompileProgress(prev => Math.min(95, prev + (100 / steps.length)));
                i++;
            } else {
                clearInterval(interval);
                setCompileProgress(100);
                setBuildLogs(prev => [...prev, `[SUCCESS] Build Complete: aetheros_${accessTier.toLowerCase()}_v5.apk`]);
                setIsCompiling(false);
            }
        }, accessTier === 'ROOT' ? 1500 : 800);
    };

    const handleEscalate = (e: React.FormEvent) => {
        e.preventDefault();
        if (suInput.toLowerCase() === 'maestro' || suInput.toLowerCase() === '0x03e2') {
            setIsEscalating(true);
            setBuildLogs(prev => [...prev, "[!] SU COMMAND INTERCEPTED.", "[*] Gaining God Logic credentials..."]);
            setTimeout(() => {
                setAccessTier('ROOT');
                setIsEscalating(false);
                setSuInput('');
                setBuildLogs(prev => [...prev, "[#] ACCESS_TIER_ESCALATED: ROOT AUTHORITY GRANTED."]);
            }, 2000);
        } else {
            setBuildLogs(prev => [...prev, "[ERR] su: permission denied."]);
            setSuInput('');
        }
    };

    if (!compat) return null;

    return (
        <div className="h-full flex flex-col bg-[#02040a] text-gray-200 font-mono overflow-hidden">
            {/* Header */}
            <div className={`p-6 border-b-8 border-black flex justify-between items-center shadow-2xl relative z-20 transition-colors duration-1000 ${accessTier === 'ROOT' ? 'bg-red-950/20' : 'bg-slate-900'}`}>
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 border-4 rounded-3xl flex items-center justify-center transition-all duration-1000 ${accessTier === 'ROOT' ? 'bg-red-500/10 border-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-emerald-500/10 border-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}>
                        {accessTier === 'ROOT' ? <FireIcon className="w-10 h-10 text-red-500 animate-pulse" /> : <DownloadIcon className="w-10 h-10 text-emerald-500 animate-bounce" />}
                    </div>
                    <div>
                        <h2 className={`font-comic-header text-5xl italic tracking-tighter uppercase transition-colors duration-1000 ${accessTier === 'ROOT' ? 'text-red-600' : 'text-emerald-500'}`}>DEPLOYMENT SUITE</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Universal Packaging | APK & PWA</span>
                            <div className={`px-3 py-0.5 rounded-full border-2 text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${accessTier === 'ROOT' ? 'bg-red-600 text-black border-black animate-pulse' : 'bg-black text-emerald-500 border-emerald-900/50'}`}>
                                {accessTier === 'ROOT' ? <FireIcon className="w-2.5 h-2.5" /> : <UserIcon className="w-2.5 h-2.5" />}
                                {accessTier}_NODE
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="text-right">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Architecture</p>
                        <p className="text-2xl font-comic-header text-white">{compat.isMobile ? 'MOBILE/ARM' : 'STATION/X86'}</p>
                    </div>
                    <ActivityIcon className={`w-12 h-12 ${isCompiling ? (accessTier === 'ROOT' ? 'text-red-600 animate-spin' : 'text-emerald-500 animate-spin-slow') : 'text-gray-900'}`} />
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-8 gap-8 relative">
                {/* Left: Compatibility Matrix */}
                <div className="lg:w-[400px] flex flex-col gap-8 flex-shrink-0">
                    <div className="aero-panel p-8 bg-slate-900/80 border-emerald-600/20 shadow-[10px_10px_0_0_rgba(0,0,0,0.8)]">
                        <h3 className="font-comic-header text-2xl text-white uppercase italic tracking-tight mb-6 flex items-center gap-3">
                            <ShieldIcon className="w-6 h-6 text-emerald-500" /> Compat Matrix
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Maestro PWA API', ok: compat.pwaSupport },
                                { label: 'Multi-Touch Array', ok: compat.touchEnabled },
                                { label: 'Kernel Escalation', ok: compat.canEscalate },
                                { label: 'Radio Conjunction', ok: compat.bluetoothApi },
                            ].map((check, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-black border border-white/5 rounded-xl group hover:border-emerald-600/50 transition-all">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{check.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[9px] font-black uppercase ${check.ok ? 'text-green-500' : 'text-red-500'}`}>{check.ok ? 'PASSED' : 'STALLED'}</span>
                                        {check.ok ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <WarningIcon className="w-4 h-4 text-red-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="aero-panel p-6 bg-black/60 border-red-900/30 flex flex-col gap-4">
                        <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                            <TerminalIcon className="w-4 h-4" /> Authority Bridge
                        </h3>
                        {accessTier === 'USER' ? (
                            <form onSubmit={handleEscalate} className="space-y-4">
                                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                                    "Operating in non-root environment. Enter the Maestro's secret letter to escalate to Root."
                                </p>
                                <div className="bg-gray-900 border-2 border-black p-2 rounded-xl flex items-center gap-2">
                                    <span className="text-red-900 font-black text-xs">$ su</span>
                                    <input 
                                        value={suInput}
                                        onChange={e => setSuInput(e.target.value)}
                                        placeholder="password..."
                                        className="bg-transparent border-none p-0 focus:ring-0 text-white font-mono text-xs w-full"
                                        type="password"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!suInput || isEscalating}
                                    className="w-full py-2 bg-red-950/40 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white transition-all text-[9px] font-black uppercase rounded-lg"
                                >
                                    {isEscalating ? 'Gaining Entry...' : 'Escalate Privileges'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-red-950/40 border-2 border-red-600 p-4 rounded-xl text-center">
                                <FireIcon className="w-10 h-10 text-red-500 mx-auto mb-2 animate-bounce" />
                                <p className="text-white font-black uppercase text-xs">ROOT ACCESS ACTIVE</p>
                                <p className="text-[9px] text-red-300 italic mt-1">Safety heuristics bypassed.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Build Console */}
                <div className="flex-1 flex flex-col gap-8 overflow-hidden">
                    <div className="aero-panel bg-black/95 border-4 border-black flex-1 flex flex-col shadow-[20px_20px_100px_rgba(0,0,0,1)] relative">
                        <div className={`p-6 border-b-4 border-black flex items-center justify-between bg-white/5 transition-colors ${accessTier === 'ROOT' ? 'text-red-500' : 'text-emerald-500'}`}>
                            <div className="flex items-center gap-4 font-black uppercase text-xs tracking-[0.2em]">
                                <TerminalIcon className="w-5 h-5" />
                                <span>Build Output: /root/aetheros/{accessTier.toLowerCase()}/compile</span>
                            </div>
                            {isCompiling && <div className="text-[10px] font-black animate-pulse">COMPILING_GIFTED_LOGIC...</div>}
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-2 custom-scrollbar font-mono text-xs">
                            {buildLogs.map((log, i) => (
                                <div key={i} className={`animate-in slide-in-from-left-2 ${log.includes('[SUCCESS]') ? 'text-green-400 font-black' : log.includes('[ROOT_BUILD]') ? 'text-red-500 font-bold' : log.includes('[BUILD]') ? 'text-cyan-400' : 'text-gray-600'}`}>
                                    <span className="opacity-30 mr-2">[{i.toString().padStart(3, '0')}]</span>{log}
                                </div>
                            ))}
                            <div ref={logEndRef} />
                        </div>

                        {isCompiling && (
                            <div className="px-10 pb-10">
                                <div className={`flex justify-between items-center text-[10px] font-black uppercase mb-2 px-2 tracking-widest ${accessTier === 'ROOT' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    <span>Compiling Artifact</span>
                                    <span>{Math.round(compileProgress)}%</span>
                                </div>
                                <div className="h-4 bg-gray-900 border-4 border-black rounded-2xl overflow-hidden p-1">
                                    <div className={`h-full transition-all duration-300 rounded-xl ${accessTier === 'ROOT' ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]'}`} style={{ width: `${compileProgress}%` }} />
                                </div>
                            </div>
                        )}

                        <div className="p-8 border-t-4 border-black bg-white/5 flex flex-col gap-6">
                             <div className="grid grid-cols-2 gap-6">
                                <button 
                                    onClick={runBuild}
                                    disabled={isCompiling}
                                    className={`vista-button w-full py-6 text-xl font-black uppercase tracking-[0.3em] rounded-3xl flex items-center justify-center gap-4 transition-all shadow-[8px_8px_0_0_#000] ${accessTier === 'ROOT' ? 'bg-red-600 hover:bg-red-500 text-black border-red-900/50' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                                >
                                    <CodeIcon className="w-6 h-6" />
                                    <span>BUILD {accessTier} APK</span>
                                </button>
                                <button 
                                    onClick={() => alert("PWA INSTALL: Redirecting to OS manifest...")}
                                    disabled={isCompiling || compileProgress < 100}
                                    className="vista-button w-full bg-emerald-600 hover:bg-emerald-500 text-black py-6 text-xl font-black uppercase tracking-[0.3em] rounded-3xl flex items-center justify-center gap-4 transition-all shadow-[8px_8px_0_0_#000] disabled:opacity-20"
                                >
                                    <ZapIcon className="w-6 h-6" />
                                    <span>INSTALL OS</span>
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
