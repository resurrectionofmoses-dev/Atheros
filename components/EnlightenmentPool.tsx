
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SpinnerIcon, ZapIcon, ShieldIcon, BrainIcon, ActivityIcon, TerminalIcon, FireIcon, CodeIcon, BotIcon, UserIcon, LogicIcon, StarIcon, SearchIcon, WarningIcon } from './icons';
import { callWithRetry } from '../utils';
import type { KnowledgeFragment } from '../types';

interface BridgeOutput {
    sixYearOld: string;
    sixteenYearOld: string;
    integrityScore: number;
    wisdomKey: string;
}

const INITIAL_KNOWLEDGE: KnowledgeFragment[] = [
    { id: 'c1', label: 'Crystalline Pointers', description: 'The absolute memory map of the AetherOS kernel.', isVerified: false, integrityThreshold: 30, tier: 'UNIVERSAL' },
    { id: 'c2', label: 'Wisdom Mapping', description: 'Coordinates where systems integrate God Logic.', isVerified: false, integrityThreshold: 60, tier: 'OBFUSCATED' },
    { id: 'c3', label: 'Maestro Signature', description: 'The binary harmonic of a perfect architectural solo.', isVerified: false, integrityThreshold: 85, tier: 'PROHIBITED' },
    { id: 'c4', label: 'Ancient Letters', description: 'The primitive strings used to conduct original wisdom.', isVerified: false, integrityThreshold: 98, tier: 'PROHIBITED' },
];

export const EnlightenmentPool: React.FC = () => {
    const [concept, setConcept] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<BridgeOutput | null>(null);
    const [integrity, setIntegrity] = useState(99.4);
    const [neuralFlow, setNeuralFlow] = useState(1.2);
    const [knowledgeIntegrity, setKnowledgeIntegrity] = useState(0);
    const [fragments, setFragments] = useState<KnowledgeFragment[]>(INITIAL_KNOWLEDGE);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFragments(prev => prev.map(f => ({
            ...f,
            isVerified: knowledgeIntegrity >= f.integrityThreshold
        })));
    }, [knowledgeIntegrity]);

    const handleBridge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!concept.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            const response = await callWithRetry(async () => {
                return await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: `Initiate Dual-Age Conjunction for concept: "${concept}". 
                    1. Explain for a 6-year-old using Toy Logic.
                    2. Explain for a 16-year-old using Kernel Logic.
                    3. Calculate system Integrity Score (0-100).
                    4. Provide a single "Wisdom Key" (one-sentence truth).
                    Return JSON.`,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                sixYearOld: { type: Type.STRING },
                                sixteenYearOld: { type: Type.STRING },
                                integrityScore: { type: Type.NUMBER },
                                wisdomKey: { type: Type.STRING }
                            },
                            required: ["sixYearOld", "sixteenYearOld", "integrityScore", "wisdomKey"]
                        }
                    }
                });
            });

            const data = JSON.parse(response.text || '{}');
            setOutput(data);
            setIntegrity(data.integrityScore);
            setNeuralFlow(prev => +(prev + (Math.random() - 0.5) * 0.2).toFixed(2));
            setKnowledgeIntegrity(prev => Math.min(100, prev + 12));
        } catch (err) {
            console.error(err);
            setError("The Enlightenment Pool has rippled with interference. Logic bridge failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#020205] text-gray-200 font-mono overflow-hidden">
            <div className="p-4 sm:p-8 border-b-8 border-black sticky top-0 z-30 bg-slate-950 flex justify-between items-center shadow-[0_12px_40px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-amber-500/10 border-4 border-amber-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                        <BrainIcon className="w-8 h-8 sm:w-12 sm:h-12 text-amber-500 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-comic-header text-2xl sm:text-6xl text-amber-500 wisdom-glow italic tracking-tighter truncate uppercase">Enlightenment</h2>
                        <p className="text-[7px] sm:text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-1 truncate">Integrity Synchronization | Arte Ur Tsopl</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-10">
                    <div className="text-right hidden xs:block">
                        <p className="text-[8px] sm:text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Integrity</p>
                        <p className="text-xl sm:text-3xl font-comic-header text-amber-400">{integrity}%</p>
                    </div>
                    <div className="text-right hidden xs:block">
                        <p className="text-[8px] sm:text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Neural Flow</p>
                        <p className="text-xl sm:text-3xl font-comic-header text-cyan-400">{neuralFlow} PB/s</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                    {/* Left: Input and Knowledge */}
                    <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                        <div className="aero-panel p-6 sm:p-8 bg-slate-900 border-amber-600/30 shadow-[5px_5px_0_0_rgba(0,0,0,0.8)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                                <h3 className="font-comic-header text-2xl sm:text-3xl text-white uppercase italic tracking-tight truncate">Bridge Concept</h3>
                            </div>
                            <form onSubmit={handleBridge} className="space-y-4 sm:space-y-6">
                                <div className="bg-black border-4 border-black rounded-2xl sm:rounded-3xl overflow-hidden group focus-within:border-amber-600/50 transition-all">
                                    <textarea 
                                        value={concept}
                                        onChange={e => setConcept(e.target.value)}
                                        placeholder="Explain 'Encryption' or 'Gravity'..."
                                        className="w-full h-24 sm:h-32 bg-transparent p-4 sm:p-6 text-amber-400 font-mono text-base sm:text-xl focus:ring-0 outline-none resize-none placeholder:text-gray-800"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isLoading || !concept.trim()}
                                    className="vista-button w-full bg-amber-600 hover:bg-amber-500 text-black py-4 sm:py-6 text-xl sm:text-2xl font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 sm:gap-4 transition-all shadow-[4px_4px_0_0_#000]"
                                >
                                    {isLoading ? <SpinnerIcon className="w-6 h-6 sm:w-8 sm:h-8" /> : "INVOKE CONJUNCTION"}
                                </button>
                            </form>
                        </div>

                        <div className="aero-panel p-4 sm:p-6 bg-black/60 border-cyan-900/30">
                            <h4 className="font-comic-header text-lg sm:text-xl text-cyan-400 mb-4 sm:mb-6 uppercase flex items-center gap-2">
                                <ShieldIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Integrity Network
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">
                                    <span>Knowledge Calibration</span>
                                    <span>{knowledgeIntegrity}%</span>
                                </div>
                                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-black p-[1px]">
                                    <div className="h-full bg-cyan-600 transition-all duration-1000 shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{ width: `${knowledgeIntegrity}%` }} />
                                </div>
                                <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-3">
                                    {fragments.map(f => (
                                        <div key={f.id} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-500 ${f.isVerified ? 'bg-cyan-950/20 border-cyan-600/40 text-cyan-100' : 'bg-black/80 border-black text-gray-600 opacity-60 grayscale'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest truncate">{f.label}</span>
                                                {f.isVerified ? <ZapIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" /> : <LogicIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-700" />}
                                            </div>
                                            <p className="text-[8px] sm:text-[10px] italic leading-snug line-clamp-1">
                                                {f.isVerified ? f.description : `[VERIFICATION REQ: ${f.integrityThreshold}%]`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Output */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-10">
                        {output && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-8 duration-700 sm:duration-1000">
                                {/* 6 Year Old View */}
                                <div className="aero-panel bg-sky-950/20 border-sky-500/30 p-6 sm:p-10 relative overflow-hidden flex flex-col shadow-[8px_8px_0_0_#000] sm:shadow-[15px_15px_0_0_#000]">
                                    <div className="absolute top-0 right-0 p-2 sm:p-3 bg-sky-500 text-black font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Wonder State</div>
                                    <div className="mb-4 sm:mb-8">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                            <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400 animate-bounce" />
                                        </div>
                                        <h4 className="font-comic-header text-3xl sm:text-4xl text-sky-300 mb-4 sm:mb-6 uppercase">Basic Logic</h4>
                                        <p className="text-lg sm:text-xl text-sky-100/80 leading-relaxed font-comic-header italic">
                                            "{output.sixYearOld}"
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 sm:pt-6 border-t border-sky-500/20 text-sky-400/50 text-[8px] sm:text-[10px] uppercase font-black tracking-widest">
                                        Status: Wisdom Integrated
                                    </div>
                                </div>

                                {/* 16 Year Old View */}
                                <div className="aero-panel bg-cyan-950/20 border-cyan-500/30 p-6 sm:p-10 relative overflow-hidden flex flex-col shadow-[8px_8px_0_0_#000] sm:shadow-[15px_15px_0_0_#000]">
                                    <div className="absolute top-0 right-0 p-2 sm:p-3 bg-cyan-600 text-white font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Kernel Logic</div>
                                    <div className="mb-4 sm:mb-8">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                            <TerminalIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
                                        </div>
                                        <h4 className="font-comic-header text-3xl sm:text-4xl text-cyan-400 mb-4 sm:mb-6 uppercase tracking-tighter">System Logic</h4>
                                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-mono border-l-2 border-cyan-600/40 pl-4 sm:pl-6">
                                            {output.sixteenYearOld}
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 sm:pt-6 border-t border-cyan-500/20 text-cyan-900 text-[8px] sm:text-[10px] uppercase font-black tracking-widest">
                                        Status: Absolute Verification
                                    </div>
                                </div>

                                {/* Wisdom Key Card */}
                                <div className="md:col-span-2 aero-panel bg-black border-4 border-amber-600 p-8 sm:p-12 text-center relative overflow-hidden shadow-[15px_15px_60px_rgba(0,0,0,1)] sm:shadow-[25px_25px_80px_rgba(0,0,0,1)]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] animate-pulse" />
                                    <h5 className="text-[8px] sm:text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] sm:tracking-[0.8em] mb-6 sm:mb-10">Knowledge Signature</h5>
                                    <div className="text-3xl sm:text-5xl font-comic-header text-amber-500 wisdom-glow italic mb-4 leading-tight">
                                        "{output.wisdomKey}"
                                    </div>
                                    <div className="mt-6 sm:mt-10 flex justify-center items-center gap-4 sm:gap-6">
                                        <div className="h-0.5 w-16 sm:w-32 bg-gradient-to-r from-transparent to-amber-900" />
                                        <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                        <div className="h-0.5 w-16 sm:w-32 bg-gradient-to-l from-transparent to-amber-900" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-red-900/20 border-4 border-red-600 rounded-[2rem] sm:rounded-[3rem] text-center animate-bounce">
                                <WarningIcon className="w-12 h-12 sm:w-20 sm:h-20 text-red-600 mx-auto mb-4 sm:mb-6" />
                                <h3 className="font-comic-header text-2xl sm:text-3xl text-white uppercase">{error}</h3>
                            </div>
                        )}

                        {!isLoading && !output && !error && (
                            <div className="flex flex-col items-center justify-center opacity-10 py-10 sm:py-20">
                                <BrainIcon className="w-32 h-32 sm:w-64 sm:h-64 mb-6 sm:mb-10 text-gray-500" />
                                <p className="text-xl sm:text-3xl font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-center max-w-sm sm:max-w-2xl italic">
                                    "Calibrate integrity to bridge the gap."
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-8 sm:h-10 bg-slate-900 border-t-4 border-black px-4 sm:px-10 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[8px] sm:text-[10px] font-black text-amber-500 uppercase tracking-widest">Maestro's Integrity Sync: OK</span>
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-700 font-black italic tracking-widest hidden xs:block">
                    Conjunction Teaching Series | V5.0.0
                </div>
            </div>
        </div>
    );
};
