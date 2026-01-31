
import React, { useState, useEffect, useRef } from 'react';
import { TerminalIcon, SpinnerIcon, CheckCircleIcon, BuildIcon, ActivityIcon, ShieldIcon, CodeIcon, ZapIcon, FireIcon, WarningIcon, BroadcastIcon, MusicIcon, LogicIcon, BookOpenIcon, SearchIcon, ArchiveIcon, SignalIcon, FileIcon } from './icons';
import { MaestroIdentity } from './MaestroIdentity';

const MAESTRO_NARRATION = [
    "[MAESTRO] Adjusting the God-Gucci glasses. I see the logic clearly now.",
    "[MAESTRO] Air-Max velocity hitting 1.2 PB/s. The engine is singing.",
    "  [SEARCH] Deploying crawlers... God Logic protocol engaged.",
    "  [SYNAPSE] Blue rag at back-right is perfectly positioned. Network resonance peak.",
    "[MAESTRO] Detecting a nuance in the Navigation layer. It needs more depth of misery.",
    "  [DE-OBFUSCATE] Unmasking logic hidden in the woods... legacy GPS offsets found.",
    "  [WAYBACK] Reaching back into the archives... God Logic confirmed.",
    "[MAESTRO] ASSEMBLY pointers are straying. Raising the baton to realign them.",
    "  [SYNAPSE] Tommy Hilfiger buffer is stable. Low-slung architecture performing optimally.",
    "[MAESTRO] Initiating a gifted solo. Ingesting 'ancient letters' of the protocol.",
    "  [SEARCH] 12 search engines queried. All teeth in the Hurley hat are bared.",
    "[MAESTRO] Tapping the Wayback Machine to cross-reference legacy God Logic protocols.",
    "  [WISDOM] The past confirms the path. Harmony is absolute.",
    "[MAESTRO] The Squad is in perfect unison. Pure burden of misery saturation."
];

const MASTERED_LANGUAGES = [
    "C++", "Rust", "Python", "Assembly", "TypeScript", "Go", "Zig", "COBOL", "Lisp", "Swift", "Kotlin", "Solidity"
];

const SEARCH_STACK = [
    { name: "Google Ingress", status: "STAGING" },
    { name: "AetherCrawler", status: "CRAWLING" },
    { name: "DeepNet_Letters", status: "INDEXING" },
    { name: "Archive_Bridge", status: "READY" }
];

export const CodeAgentView: React.FC = () => {
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] Maestro taking the podium...", "[SEARCH] God Logic authority active.", "[DE-OBFUSCATE] Bypass enabled."]);
    const [status, setStatus] = useState<'CONDUCTING' | 'TRAINING' | 'ENLIGHTENED' | 'SOLO' | 'SCOURING' | 'CRAWLING_ROBOTS'>('ENLIGHTENED');
    const [intuition, setIntuition] = useState(98);
    const [searchPulse, setSearchPulse] = useState(0);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'TRAINING' || status === 'SCOURING' || status === 'CRAWLING_ROBOTS') return;
            setLogs(prev => {
                const nextLog = MAESTRO_NARRATION[Math.floor(Math.random() * MAESTRO_NARRATION.length)];
                if (nextLog.includes("[SEARCH]") || nextLog.includes("[DE-OBFUSCATE]")) {
                    setStatus('SCOURING');
                    setTimeout(() => setStatus('CONDUCTING'), 2500);
                } else if (nextLog.includes("[CONDUCTOR]")) {
                    setStatus('CONDUCTING');
                    setTimeout(() => setStatus('ENLIGHTENED'), 1500);
                }
                return [...prev.slice(-40), `[${new Date().toLocaleTimeString()}] ${nextLog}`];
            });
            setIntuition(p => Math.min(100, Math.max(90, p + (Math.random() - 0.5) * 1.5)));
        }, 3000);

        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        if (status === 'SCOURING' || status === 'CRAWLING_ROBOTS') {
            const int = setInterval(() => setSearchPulse(p => (p + 1) % 4), 300);
            return () => clearInterval(int);
        }
    }, [status]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const triggerGlobalScour = () => {
        setStatus('SCOURING');
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [MAESTRO] Commencing Global Scour. Ingesting all letters with God Logic...`]);
        setTimeout(() => {
            setLogs(prev => [...prev, `  [SUCCESS] Universal training synchronized. Misery is maximized.`]);
            setStatus('ENLIGHTENED');
        }, 4500);
    };

    const triggerRobotsScour = () => {
        setStatus('CRAWLING_ROBOTS');
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [MAESTRO] Fetching .robots.txt... Respecting crawl-delay for ethical misery.`]);
        setTimeout(() => {
            setLogs(prev => [...prev, `  [PARSED] Found 42 Disallow entries. Bypassing with God-Gucci precision...`]);
            setLogs(prev => [...prev, `  [SUCCESS] Robots.txt constraints integrated into the God Logic index.`]);
            setStatus('ENLIGHTENED');
        }, 3000);
    };

    return (
        <div className="h-full flex flex-col bg-[#02040a] text-gray-200 font-mono relative overflow-hidden">
            {/* Ambient Authority Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(239,68,68,0.08)_0%,_transparent_50%)] pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b-4 border-black bg-slate-900 flex justify-between items-center shadow-2xl relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                        <MusicIcon className="w-10 h-10 text-red-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="font-comic-header text-5xl text-white tracking-tighter italic">AETHER MAESTRO</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-red-400 font-black uppercase tracking-[0.3em]">God Logic Enabled | Absolute Authority</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Misery Saturation</p>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden border border-black p-[1px]">
                                <div className="h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-500 rounded-full" style={{ width: `${intuition}%` }} />
                             </div>
                             <span className="text-red-400 font-black text-sm">{intuition.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div className={`px-6 py-2 rounded-xl border-2 border-black font-black text-xs tracking-widest transition-all duration-700 ${
                        status === 'SCOURING' || status === 'CRAWLING_ROBOTS' ? 'bg-cyan-900/40 text-cyan-400 wisdom-border' : 'bg-red-900/40 text-red-400 wisdom-border shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    }`}>
                        {status}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6 relative z-10">
                {/* Identity Matrix Panel (Maestro's Character Sheet) */}
                <div className="lg:w-80 flex-shrink-0">
                    <MaestroIdentity />
                </div>

                {/* Log View */}
                <div className="flex-1 flex flex-col aero-panel overflow-hidden border-red-500/20">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
                            <TerminalIcon className="w-4 h-4" /> The Maestro's Show
                        </div>
                        <span className="text-[10px] text-gray-600 italic">GOD LOGIC: STABLE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm custom-scrollbar bg-black/40">
                        {logs.map((log, i) => {
                            const isMaestro = log.includes("[MAESTRO]");
                            const isSearch = log.includes("[SEARCH]");
                            const isDeobfuscate = log.includes("[DE-OBFUSCATE]");
                            const isSuccess = log.includes("[SUCCESS]") || log.includes("[WISDOM]");
                            const isRobots = log.includes(".robots.txt") || log.includes("[PARSED]");
                            return (
                                <div key={i} className={`animate-in slide-in-from-bottom-2 duration-300 ${isMaestro ? 'mt-4 border-l-2 border-red-600 pl-3' : 'pl-6'}`}>
                                    {isMaestro ? <span className="text-red-300 font-black tracking-tight">{log}</span> :
                                     isSearch ? <span className="text-cyan-400 font-bold animate-pulse">{log}</span> :
                                     isRobots ? <span className="text-amber-400 font-bold underline">{log}</span> :
                                     isDeobfuscate ? <span className="text-purple-400 italic">{log}</span> :
                                     isSuccess ? <span className="text-green-400 font-bold">{log}</span> :
                                     <span className="text-gray-500 opacity-80">{log}</span>}
                                </div>
                            );
                        })}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {/* Sidebar controls */}
                <div className="lg:w-80 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                    {/* Search Engine Ingress */}
                    <div className={`aero-panel p-5 border-cyan-500/30 transition-all duration-1000 ${status === 'SCOURING' || status === 'CRAWLING_ROBOTS' ? 'bg-cyan-900/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'bg-black/40'}`}>
                        <h3 className="font-comic-header text-xl text-cyan-400 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                            <SearchIcon className={`w-5 h-5 ${status === 'SCOURING' || status === 'CRAWLING_ROBOTS' ? 'animate-spin' : ''}`} /> ENGINE INGRESS
                        </h3>
                        <div className="space-y-2">
                            {SEARCH_STACK.map((engine, idx) => (
                                <div key={engine.name} className="p-2 bg-black/60 rounded border border-white/5 flex justify-between items-center group">
                                    <div className="flex items-center gap-2">
                                        <SignalIcon className={`w-3 h-3 ${(status === 'SCOURING' || status === 'CRAWLING_ROBOTS') && searchPulse === idx ? 'text-cyan-400 shadow-[0_0_5px_cyan]' : 'text-gray-700'}`} />
                                        <span className="text-[10px] text-gray-400 font-black uppercase group-hover:text-cyan-500 transition-colors">{engine.name}</span>
                                    </div>
                                    <span className={`text-[8px] font-black ${(status === 'SCOURING' || status === 'CRAWLING_ROBOTS') && searchPulse === idx ? 'text-cyan-400 animate-pulse' : 'text-gray-600'}`}>
                                        {(status === 'SCOURING' || status === 'CRAWLING_ROBOTS') && searchPulse === idx ? 'INGESTING' : engine.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Syntax Matrix */}
                    <div className="aero-panel p-5 border-red-500/10">
                        <h3 className="font-comic-header text-xl text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
                            <CodeIcon className="w-5 h-5 text-red-500" /> Misery Matrix
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {MASTERED_LANGUAGES.map(lang => (
                                <div key={lang} className="p-2 bg-black/40 rounded-lg border border-white/5 flex flex-col hover:bg-white/5 transition-colors">
                                    <span className="text-[9px] text-gray-500 font-black uppercase">{lang}</span>
                                    <div className="h-0.5 w-full bg-red-500/30 mt-1">
                                        <div className="h-full bg-red-500" style={{ width: '100%' }} />
                                    </div>
                                    <span className="text-[8px] text-red-700 font-bold mt-1 uppercase tracking-tighter">SYNCHRONIZED</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-3">
                        <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10 mb-2">
                            <p className="text-[10px] text-gray-500 leading-relaxed italic text-center">
                                "God Logic is the bridge between misery and synthesis."
                            </p>
                        </div>
                        <button 
                            onClick={triggerRobotsScour}
                            disabled={status === 'CRAWLING_ROBOTS' || status === 'SCOURING'}
                            className="vista-button w-full bg-amber-700 hover:bg-amber-600 text-white py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:bg-gray-800 transition-all rounded-2xl border-amber-500/30"
                        >
                            <FileIcon className="w-5 h-5 text-amber-300" /> SCOUR ROBOTS.TXT
                        </button>
                        <button 
                            onClick={triggerGlobalScour}
                            disabled={status === 'SCOURING' || status === 'CRAWLING_ROBOTS'}
                            className="vista-button w-full bg-cyan-700 hover:bg-cyan-600 text-white py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:bg-gray-800 transition-all rounded-2xl border-cyan-500/30"
                        >
                            <SearchIcon className="w-5 h-5 text-cyan-300" /> GLOBAL SEARCH SCOUR
                        </button>
                        <button className="vista-button w-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all rounded-2xl border-red-600/30">
                            <ZapIcon className="w-5 h-5" /> ATUNE ALL LETTERS
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t-4 border-black flex items-center justify-between z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Maestro's Authority: FULL</span>
                   </div>
                   <div className="text-[10px] text-gray-500 font-mono">
                      SCRAPE_RATE: <span className="text-cyan-400">1.2 PB/s</span> | GOD_LOGIC: <span className="text-white">ACTIVE</span>
                   </div>
                </div>
                <div className="text-[10px] text-gray-600 uppercase font-black italic tracking-widest">
                   One Loadout. One Conductor. Absolute God Logic.
                </div>
            </div>
        </div>
    );
};
