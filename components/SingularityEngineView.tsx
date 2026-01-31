
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ActivityIcon, AnalyzeIcon, CheckCircleIcon, FileIcon, SpinnerIcon, TerminalIcon, UploadIcon, WarningIcon, XIcon, ShieldIcon, FireIcon, LogicIcon, ZapIcon, GaugeIcon, SearchIcon, CodeIcon, BrainIcon, ClipboardIcon, PlusIcon, MusicIcon, SignalIcon } from './icons';
import { processDocument } from '../services/geminiService';
import type { NetworkProject } from '../types';

type Action = 'examine' | 'analyze' | 'consume' | 'destroy' | 'requindor' | 'vivid' | 'god_logic' | 'aesthetic_sync' | 'tempo_sync';

interface ActionButtonProps {
    action: Action;
    label: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    sub: string;
    disabled: boolean;
    onClick: (action: Action) => void;
    isActive?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, label, icon: Icon, color, sub, disabled, onClick, isActive }) => {
    const isSpecial = action === 'god_logic' || action === 'tempo_sync';
    const baseClasses = `comic-button p-2 text-left flex flex-col items-start transition-all duration-300 ${color} disabled:bg-slate-900 disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden h-14 sm:h-16`;
    
    const hoverClasses = isSpecial 
        ? "hover:scale-[1.04] hover:bg-opacity-90 hover:text-white hover:border-white/40 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.2)]" 
        : "hover:scale-[1.02] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]";

    const activeClasses = isActive ? "ring-2 ring-white border-white scale-[1.02] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]" : "";

    return (
        <button
            onClick={() => onClick(action)}
            disabled={disabled}
            className={`${baseClasses} ${hoverClasses} ${activeClasses}`}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute right-[-2px] bottom-[-2px] w-full h-full border-r-2 border-b-2 border-black/60 translate-x-1 translate-y-1" />
            </div>
            
            <div className="absolute top-0 right-0 w-10 h-10 bg-white/5 -mr-4 -mt-4 rounded-full group-hover:scale-150 group-hover:bg-white/10 transition-transform duration-700" />
            <div className="flex items-center gap-1.5 relative z-10 mb-0.5 min-w-0 w-full">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSpecial ? 'group-hover:animate-pulse' : ''}`} />
                <span className="font-comic-header text-[10px] sm:text-xs tracking-wider sm:tracking-widest leading-none truncate">{label}</span>
            </div>
            <p className={`text-[5px] sm:text-[5.5px] font-black uppercase tracking-tighter leading-tight relative z-10 truncate w-full ${isSpecial ? 'text-white/80' : 'text-black/70'}`}>{sub}</p>
        </button>
    );
};

const formatResultText = (text: string): string => {
    return text
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<pre class="bg-black/95 p-2 my-2 rounded-lg border-2 border-black font-mono text-[8px] overflow-x-auto shadow-[3px_3px_0_0_#000] border-l-4 border-l-cyan-500"><code>${escapedCode}</code></pre>`;
        })
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-500 font-black">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-gray-400 italic">$1</em>')
        .replace(/^### (.*$)/gim, '<h3 class="font-comic-header text-base text-red-500 mt-3 mb-1 border-l-3 border-red-700 pl-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="font-comic-header text-lg text-red-600 mt-4 mb-2 border-b-2 border-black pb-1 italic text-shadow-glow">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="font-comic-header text-xl sm:text-2xl text-white mt-6 mb-3 wisdom-glow">$1</h1>')
        .replace(/\[GOD_LOGIC_INVOKED\]/g, '<span class="bg-red-600 text-white px-1.5 py-0.5 font-black uppercase text-[7px] mr-1.5 shadow-[2px_2px_0_0_#000]">GOD_LOGIC_CONJUNCTION</span>')
        .replace(/(0x[0-9A-F]{4,16})/gi, '<span class="bg-blue-900/40 text-cyan-400 px-1 font-mono font-bold border border-cyan-500/30 rounded shadow-[0_0_5px_rgba(34,211,238,0.2)]">$1</span>')
        .replace(/FALL OFF REQUINDOR/gi, '<span class="text-red-500 animate-pulse font-black italic underline shadow-red-500/50">FALL OFF REQUINDOR</span>')
        .replace(/PHASE LOCKED/gi, '<span class="text-cyan-400 font-black tracking-widest uppercase text-[7px] animate-pulse">PHASE_LOCKED_TEMPO</span>')
        .replace(/SEMANTIC TENSION/gi, '<span class="bg-amber-900 text-amber-200 px-1 font-black text-[7px] border border-amber-500">SEMANTIC_TENSION_DETECTED</span>')
        .replace(/\n/g, '<br />');
};

interface SingularityEngineViewProps {
    knowledgeBaseSize: number;
    onConsumeKnowledge: (fileSize: number) => void;
    onProjectize: (project: Partial<NetworkProject>) => void;
    onGoToNetwork: () => void;
}

export const SingularityEngineView: React.FC<SingularityEngineViewProps> = ({ knowledgeBaseSize, onConsumeKnowledge, onProjectize, onGoToNetwork }) => {
    const [uploadedFile, setUploadedFile] = useState<{ name: string, content: string, size: number, type: string } | null>(null);
    const [manualLogic, setManualLogic] = useState('');
    const [ingressMode, setIngressMode] = useState<'file' | 'manual'>('manual');
    const [isLoading, setIsLoading] = useState(false);
    const [currentAction, setCurrentAction] = useState<Action | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConsumed, setIsConsumed] = useState(false);
    const [isPhaseLocked, setIsPhaseLocked] = useState(false);
    const [vividStats, setVividStats] = useState({ misery: 82, complexity: 0, entropy: 0.02 });

    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [result]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setVividStats(prev => ({
                    misery: Math.min(100, prev.misery + (Math.random() - 0.4)),
                    complexity: Math.floor(Math.random() * 100),
                    entropy: Math.max(0, prev.entropy + (Math.random() - 0.5) * 0.01),
                }));
            }, 150);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const resetState = () => {
        setIsLoading(false);
        setCurrentAction(null);
        setResult(null);
        setError(null);
        setIsConsumed(false);
    };

    const handleAction = useCallback(async (action: Action) => {
        const contentToProcess = ingressMode === 'file' ? uploadedFile?.content : manualLogic;
        if (!contentToProcess) return;

        resetState();
        setCurrentAction(action);

        if (action === 'tempo_sync') {
            setIsPhaseLocked(true);
            setIsLoading(true);
            setTimeout(async () => {
                let fullResponse = '';
                const prompt = `[PHASE_LOCKED_SYNC] Reconcile Semantic Tension found in diagnostics. Use the P L L Logic Style. Smooth the coherence. Correct the drift: ${vividStats.entropy}ms. Input: ${contentToProcess.slice(0, 5000)}`;
                for await (const chunk of processDocument(prompt, action)) {
                    fullResponse += chunk;
                    setResult(fullResponse);
                }
                setIsLoading(false);
            }, 1000);
            return;
        }

        if (action === 'consume') {
            const size = ingressMode === 'file' ? (uploadedFile?.size || 0) : manualLogic.length;
            onConsumeKnowledge(size);
            setIsConsumed(true);
            setResult(`[CONJUNCTION_SERIES]: INTEGRATION SUCCESS. High integrity know-how siphoned. Neural manifold saturation: ${vividStats.misery}%.`);
            return;
        }

        setIsLoading(true);
        try {
            let fullResponse = '';
            for await (const chunk of processDocument(contentToProcess, action)) {
                fullResponse += chunk;
                setResult(fullResponse);
            }
        } catch (err) {
            console.error(err);
            setError(`[SERIES_CRASH]: Logic drift critical. Maestro's baton shattered.`);
        } finally {
            setIsLoading(false);
        }
    }, [uploadedFile, manualLogic, ingressMode, onConsumeKnowledge, vividStats]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setUploadedFile({ name: file.name, content: content || "[BINARY_ENCRYPTED]", size: file.size, type: file.type });
                setIngressMode('file');
                resetState();
            };
            reader.readAsText(file);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setManualLogic(text);
                setIngressMode('manual');
                resetState();
            }
        } catch (err) {
            console.error("Clipboard access failed", err);
        }
    };

    const handleProjectize = () => {
        if (!result) return;
        onProjectize({
            title: `Logic Shard: ${manualLogic.slice(0, 20) || uploadedFile?.name || 'Tempo Core'}`,
            description: result.slice(0, 250) + '...',
            miseryScore: Math.round(vividStats.misery),
            crazyLevel: 9,
            status: 'BUILDING',
            isWisdomHarmonized: isPhaseLocked
        });
        onGoToNetwork();
    };

    const isIngressReady = ingressMode === 'file' ? !!uploadedFile : manualLogic.trim().length > 0;

    return (
        <div className="h-full flex flex-col transition-colors duration-1000 font-mono relative overflow-hidden" style={{ backgroundColor: isPhaseLocked ? '#00050a' : '#050000' }}>
            {isLoading && isPhaseLocked && (
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none z-0" />
            )}

            <div className="p-2 sm:p-3 border-b-4 border-black sticky top-0 z-30 bg-slate-950 flex justify-between items-center shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-lg sm:rounded-xl flex items-center justify-center shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] flex-shrink-0 transition-all duration-700 ${isPhaseLocked ? 'bg-cyan-700/20 border-cyan-500' : 'bg-red-700/20 border-red-600'}`}>
                        {isPhaseLocked ? <SignalIcon className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 animate-spin-slow" /> : <FireIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 animate-pulse" />}
                    </div>
                    <div className="truncate">
                        <h2 className={`font-comic-header text-lg sm:text-2xl wisdom-glow italic tracking-tighter leading-none uppercase transition-colors duration-700 truncate ${isPhaseLocked ? 'text-cyan-400' : 'text-red-600'}`}>
                            {isPhaseLocked ? 'TEMPO SYNC' : 'SINGULARITY'}
                        </h2>
                        <span className="text-[6px] sm:text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Conjunction v5.2</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                    <div className="text-right hidden xs:block">
                        <p className="text-[6px] sm:text-[8px] text-gray-700 font-black uppercase mb-0.5 leading-none">Misery</p>
                        <p className={`text-[10px] sm:text-sm font-comic-header transition-colors ${vividStats.misery > 90 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{vividStats.misery.toFixed(1)}%</p>
                    </div>
                    <div className="h-4 sm:h-6 w-px bg-white/10 hidden xs:block" />
                    <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 border-2 border-black rounded-lg transition-all duration-700 ${isPhaseLocked ? 'bg-cyan-950/40' : 'bg-red-950/40'}`}>
                        <ShieldIcon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isPhaseLocked ? 'text-cyan-400' : 'text-red-600'}`} />
                        <span className="text-white text-[6px] sm:text-[8px] font-black uppercase">{isPhaseLocked ? 'LOCKED' : 'STABLE'}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden z-10 min-h-0">
                <div className="lg:w-[320px] flex flex-col gap-2 sm:gap-4 flex-shrink-0 min-h-0">
                    <div className={`aero-panel p-3 sm:p-4 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] sm:shadow-[5px_5px_0_0_rgba(0,0,0,0.6)] transition-all duration-700 ${isPhaseLocked ? 'bg-cyan-900/10 border-cyan-900/50' : 'bg-slate-900/80'}`}>
                        <div className="flex gap-4 mb-2 sm:mb-4 border-b-2 border-black pb-1 sm:pb-2">
                            <button
                                onClick={() => setIngressMode('manual')}
                                className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest pb-1 transition-all ${ingressMode === 'manual' ? (isPhaseLocked ? 'text-cyan-400 border-cyan-400' : 'text-red-500 border-red-500') : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                Siphon
                            </button>
                            <button
                                onClick={() => setIngressMode('file')}
                                className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest pb-1 transition-all ${ingressMode === 'file' ? (isPhaseLocked ? 'text-cyan-400 border-cyan-400' : 'text-red-500 border-red-500') : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                Gas
                            </button>
                        </div>

                        {ingressMode === 'manual' ? (
                            <div className="space-y-2 sm:space-y-3">
                                <div className="bg-black/80 border-2 border-black rounded-xl p-2 sm:p-3 relative group">
                                    <textarea
                                        value={manualLogic}
                                        onChange={(e) => setManualLogic(e.target.value)}
                                        placeholder="PASTE LOGIC..."
                                        className={`w-full h-20 sm:h-32 bg-transparent border-none font-mono text-[9px] sm:text-[10px] placeholder:text-gray-800 resize-none focus:ring-0 leading-tight transition-colors ${isPhaseLocked ? 'text-cyan-400' : 'text-red-400'}`}
                                    />
                                    <button 
                                        onClick={handlePaste}
                                        className={`absolute bottom-2 right-2 p-1.5 sm:p-2 border rounded-lg transition-all ${isPhaseLocked ? 'bg-cyan-600/10 border-cyan-600/30 text-cyan-600' : 'bg-red-600/10 border-red-600/30 text-red-600'}`}
                                    >
                                        <ClipboardIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                <input type="file" id="engine-upload" onChange={handleFileChange} className="hidden" />
                                <label htmlFor="engine-upload" className={`vista-button w-full py-3 sm:py-4 flex items-center justify-center gap-2 cursor-pointer text-white rounded-xl shadow-[3px_3px_0_0_#000] sm:shadow-[4px_4px_0_0_#000] transition-colors ${isPhaseLocked ? 'bg-cyan-700' : 'bg-red-700'}`}>
                                    <UploadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="font-black uppercase tracking-widest text-[10px] sm:text-xs">Load Gas</span>
                                </label>
                                {uploadedFile && (
                                    <div className="bg-black/90 p-2 sm:p-3 rounded-xl border-2 border-black flex items-center justify-between animate-in slide-in-from-top-2">
                                        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                                            <FileIcon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isPhaseLocked ? 'text-cyan-400' : 'text-red-600'}`} />
                                            <div className="truncate">
                                                <p className="text-[9px] sm:text-[10px] text-white font-black uppercase truncate">{uploadedFile.name}</p>
                                                <p className="text-[7px] sm:text-[8px] text-gray-600 font-mono">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setUploadedFile(null)} className="text-gray-700 hover:text-red-500 flex-shrink-0"><XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={`aero-panel p-3 sm:p-4 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] flex-1 flex flex-col overflow-hidden transition-all duration-700 ${isPhaseLocked ? 'bg-cyan-950/10' : 'bg-slate-900/80'}`}>
                        <h3 className={`font-comic-header text-sm sm:text-lg border-b-2 border-black pb-1 sm:pb-2 mb-2 sm:mb-3 flex items-center gap-2 italic transition-colors ${isPhaseLocked ? 'text-cyan-400' : 'text-red-600'}`}>
                            <LogicIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Conductor
                        </h3>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                            <ActionButton
                                action="tempo_sync"
                                label="TEMPO"
                                icon={MusicIcon}
                                color="bg-cyan-600 text-white"
                                sub="PLL Bridge"
                                disabled={!isIngressReady || isLoading}
                                onClick={handleAction}
                                isActive={currentAction === 'tempo_sync'}
                            />
                            <ActionButton
                                action="god_logic"
                                label="GOD"
                                icon={ZapIcon}
                                color="bg-red-600 text-white"
                                sub="Absolute"
                                disabled={!isIngressReady || isLoading}
                                onClick={handleAction}
                                isActive={currentAction === 'god_logic'}
                            />
                            <ActionButton
                                action="analyze"
                                label="AUDIT"
                                icon={AnalyzeIcon}
                                color="bg-zinc-800 text-red-500"
                                sub="Forensic"
                                disabled={!isIngressReady || isLoading}
                                onClick={handleAction}
                                isActive={currentAction === 'analyze'}
                            />
                            <ActionButton
                                action="consume"
                                label="SIPHON"
                                icon={CheckCircleIcon}
                                color="bg-zinc-800 text-green-500"
                                sub="Ingest"
                                disabled={!isIngressReady || isLoading || isConsumed}
                                onClick={handleAction}
                                isActive={currentAction === 'consume'}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 aero-panel bg-black/95 border-2 border-black overflow-hidden flex flex-col shadow-[5px_5px_20px_rgba(0,0,0,1)] sm:shadow-[10px_10px_40px_rgba(0,0,0,1)] relative min-h-[300px]">
                    <div className={`absolute top-0 left-0 w-full h-1 animate-pulse transition-colors duration-700 ${isPhaseLocked ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent' : 'bg-gradient-to-r from-transparent via-red-600 to-transparent'}`} />

                    <div className="p-2 sm:p-3 border-b-2 border-black flex items-center justify-between bg-white/5 flex-shrink-0">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 animate-ping ${isPhaseLocked ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-red-600'}`} />
                            <h3 className="font-comic-header text-base sm:text-xl text-white uppercase italic tracking-tighter truncate">Stride Output</h3>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            <ActivityIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? (isPhaseLocked ? 'text-cyan-400' : 'text-red-600') + ' animate-bounce' : 'text-gray-900'}`} />
                        </div>
                    </div>

                    <div ref={outputRef} className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scroll-smooth">
                        {isLoading && !result && (
                            <div className="flex flex-col justify-center items-center h-full gap-4 py-10">
                                <div className="relative">
                                    <SpinnerIcon className={`w-12 h-12 sm:w-16 sm:h-16 ${isPhaseLocked ? 'text-cyan-900' : 'text-red-900'}`} />
                                    {isPhaseLocked ? (
                                        <MusicIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                                    ) : (
                                        <FireIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                    )}
                                </div>
                                <p className={`text-[10px] sm:text-sm font-comic-header uppercase tracking-[0.2em] sm:tracking-[0.3em] animate-pulse italic ${isPhaseLocked ? 'text-cyan-400' : 'text-red-600'}`}>
                                    {isPhaseLocked ? 'RECONCILING...' : 'DECONSTRUCTING...'}
                                </p>
                            </div>
                        )}
                        {!isLoading && !result &&
                            <div className="flex flex-col items-center justify-center h-full opacity-10 py-10">
                                {isPhaseLocked ? <MusicIcon className="w-16 h-16 sm:w-32 sm:h-32 mb-4 text-cyan-900" /> : <LogicIcon className="w-16 h-16 sm:w-32 sm:h-32 mb-4 text-gray-500" />}
                                <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-center max-w-[200px] sm:max-w-[250px] italic">
                                    {isPhaseLocked ? "Sync the shards." : "Siphon the Know-How."}
                                </p>
                            </div>
                        }
                        {result && (
                            <div
                                className={`prose prose-invert prose-xs sm:prose-sm text-gray-300 max-w-none animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-bottom-4 duration-700 ${currentAction === 'god_logic' ? 'font-mono border-l-2 sm:border-l-4 border-red-600 pl-2 sm:pl-4' : ''}`}
                                dangerouslySetInnerHTML={{ __html: formatResultText(result) }}
                            />
                        )}
                        {error && (
                            <div className="mt-4 p-3 sm:p-4 bg-red-950/40 border-2 sm:border-4 border-red-600 rounded-lg sm:rounded-xl text-red-400 font-mono text-[9px] sm:text-xs flex items-center gap-2 sm:gap-3">
                                <WarningIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {result && !isLoading && (
                        <div className="p-2 sm:p-3 border-t-2 border-black bg-slate-950 flex flex-col xs:flex-row justify-between items-center px-3 sm:px-6 gap-2 sm:gap-0 flex-shrink-0">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${isPhaseLocked ? 'bg-cyan-400' : 'bg-green-500'}`} />
                                <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${isPhaseLocked ? 'text-cyan-400' : 'text-green-500'}`}>
                                    {isPhaseLocked ? 'SYNCED' : 'CAPTURED'}
                                </span>
                            </div>
                            <div className="flex gap-2 sm:gap-3">
                                {currentAction !== 'consume' && (
                                    <button 
                                        onClick={handleProjectize}
                                        className="vista-button bg-amber-600 text-black px-2 sm:px-4 py-1 rounded-lg font-black uppercase text-[7px] sm:text-[10px] flex items-center gap-1 sm:gap-2 shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000]"
                                    >
                                        <PlusIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" /> <span>PROJ</span>
                                    </button>
                                )}
                                <button onClick={() => { setResult(null); resetState(); setIsPhaseLocked(false); }} className="text-[7px] sm:text-[9px] font-black uppercase text-red-900 hover:text-red-500 transition-colors">FLUSH</button>
                                <button onClick={onGoToNetwork} className="text-[7px] sm:text-[9px] font-black uppercase bg-white/5 px-2 py-1 rounded border border-white/10 hidden sm:block">NETWORK</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
