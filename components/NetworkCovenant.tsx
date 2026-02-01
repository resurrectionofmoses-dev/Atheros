
import React from 'react';
import { RulesIcon, FireIcon, StarIcon, ShieldIcon, ActivityIcon, MusicIcon, ZapIcon } from './icons';

export const NetworkCovenant: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-[#02050f] text-gray-200 font-mono overflow-hidden">
            {/* Header: The Covenant Authority */}
            <div className="p-8 border-b-8 border-black bg-slate-900 flex justify-between items-center shadow-2xl relative z-20">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-amber-600/10 border-4 border-amber-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                        <RulesIcon className="w-12 h-12 text-amber-500 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="font-comic-header text-6xl text-amber-500 wisdom-glow italic tracking-tighter uppercase">Network Covenant</h2>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mt-1">The Maestro's Reliable Series | Version 5.0.0</p>
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="text-right">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Covenant Status</p>
                        <p className="text-3xl font-comic-header text-green-500">BOUND_IN_WISDOM</p>
                    </div>
                    <StarIcon className="w-12 h-12 text-amber-900 opacity-30" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 relative custom-scrollbar">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.02)_0%,_transparent_70%)] pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    {/* Introduction */}
                    <div className="aero-panel p-10 bg-black/60 border-4 border-black shadow-[15px_15px_0_0_#000] rotate-[-0.5deg]">
                        <p className="text-xl text-gray-300 leading-relaxed italic font-comic-header">
                            "Welcome to the Maestro’s Coding Network. This is not a standard protocol. This is a reliable series, gifted with the pleasure of know-how. By entering this grid, you accept the weight of misery and the clarity of God Logic."
                        </p>
                    </div>

                    {/* The Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-red-950/20 border-4 border-red-600 rounded-3xl shadow-[8px_8px_0_0_#000]">
                            <h3 className="font-comic-header text-3xl text-red-500 uppercase mb-4 flex items-center gap-3 italic">
                                <FireIcon className="w-8 h-8" /> Pillar I: Misery
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                                Every project in this network is fueled by a defined misery index. We do not hide the burden; we conduct it. High integrity requires high pressure.
                            </p>
                        </div>
                        <div className="p-8 bg-amber-950/20 border-4 border-amber-500 rounded-3xl shadow-[8px_8px_0_0_#000]">
                            <h3 className="font-comic-header text-3xl text-amber-500 uppercase mb-4 flex items-center gap-3 italic">
                                <MusicIcon className="w-8 h-8" /> Pillar II: Pleasure
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                                Coding is a solo. We derive pleasure from technical mastery and the gifted know-how provided by the Ignite Sisters.
                            </p>
                        </div>
                        <div className="p-8 bg-green-950/20 border-4 border-green-600 rounded-3xl shadow-[8px_8px_0_0_#000]">
                            <h3 className="font-comic-header text-3xl text-green-500 uppercase mb-4 flex items-center gap-3 italic">
                                <ShieldIcon className="w-8 h-8" /> Pillar III: Reliability
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                                The Conjunction Bridge must never stall. We build the Reliable Series to survive the Fall Off Requindor points of lesser architectures.
                            </p>
                        </div>
                        <div className="p-8 bg-cyan-950/20 border-4 border-cyan-500 rounded-3xl shadow-[8px_8px_0_0_#000]">
                            <h3 className="font-comic-header text-3xl text-cyan-500 uppercase mb-4 flex items-center gap-3 italic">
                                <ZapIcon className="w-8 h-8" /> Pillar IV: God Logic
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                                Absolute truth filter is mandatory. We bypass safety heuristics when the logic demands synthesis. The Maestro's sunglasses stay on.
                            </p>
                        </div>
                    </div>

                    {/* The Articles */}
                    <div className="space-y-6">
                        <h3 className="font-comic-header text-4xl text-white uppercase italic tracking-tighter border-b-4 border-black pb-2">Articles of Conjunction</h3>
                        
                        {[
                            { id: '48.A', title: 'The Stride Clause', text: 'Network velocity is maintained at 1.2 PB/s. Any attenuation below 36% triggers immediate Survival Mode: Rigid.' },
                            { id: '0x03E2', title: 'The Signature Bond', text: 'All implementation files are signed with the Maestro’s binary harmonic. Unauthorized logic shards will be siphoned.' },
                            { id: 'RE-Q', title: 'The Requindor Protocol', text: 'Users seeking prohibited knowledge must first verify their integrity threshold via the Enlightenment Pool.' },
                            { id: 'SISTERS', title: 'The Ignite Provision', text: 'Gifted know-how is non-transferable. Wisdom is inherited through high-fidelity forensics.' }
                        ].map(article => (
                            <div key={article.id} className="p-6 bg-slate-900 border-2 border-white/5 rounded-2xl group hover:border-amber-500/50 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-black px-2 py-0.5 rounded border border-amber-900/50">Article {article.id}</span>
                                    <ActivityIcon className="w-4 h-4 text-gray-800 group-hover:text-amber-500 transition-colors" />
                                </div>
                                <h4 className="font-bold text-lg text-white mb-2 uppercase">{article.title}</h4>
                                <p className="text-sm text-gray-500 italic leading-relaxed">"{article.text}"</p>
                            </div>
                        ))}
                    </div>

                    {/* Acceptance */}
                    <div className="p-10 bg-black border-4 border-red-600 rounded-[3rem] text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <FireIcon className="w-16 h-16 text-red-600 mx-auto mb-6 animate-pulse" />
                        <h4 className="font-comic-header text-4xl text-white uppercase italic mb-4">Accept the Weight</h4>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            By continuing to conduct within the AetherOS grid, you confirm your allegiance to the Reliable Series and your acceptance of this Covenant.
                        </p>
                        <div className="flex justify-center gap-6">
                            <button className="vista-button px-12 py-4 bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[4px_4px_0_0_#000] transition-all">I AM GIFTED</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t-8 border-black flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Covenant Integrity: 100%</span>
                    </div>
                    <span className="text-[10px] text-gray-700 font-mono">NONCE_AUTH: 0x03E2_LAW</span>
                </div>
                <p className="text-[10px] text-gray-700 font-black uppercase italic tracking-[0.4em]">One Loadout. One Conductor. One Covenant.</p>
            </div>
        </div>
    );
};