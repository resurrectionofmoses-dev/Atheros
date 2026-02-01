
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SignalIcon, ZapIcon, ShieldIcon, TerminalIcon, SpinnerIcon, SearchIcon, CodeIcon, ActivityIcon, FireIcon, BrainIcon, BookOpenIcon, LogicIcon, WarningIcon, CheckCircleIcon } from './icons';
import { generateBluetoothBlueprint, adaptBluetoothProtocol } from '../services/geminiService';
import type { BluetoothProtocol, BluetoothBlueprint, ProtocolAdaptation } from '../types';

const PROTOCOLS: BluetoothProtocol[] = [
    { id: 'p1', name: 'Core Spec 5.4', category: 'Core', description: 'The absolute foundation. Periodic Advertising with Responses (PAwR) and Encrypted Advertising Data.', commonUUIDs: ['0x1800 (Generic Access)', '0x1801 (Generic Attribute)'], designConstraints: ['Latency < 10ms', 'Encryption Mandatory'] },
    { id: 'p2', name: 'LE Audio / Auracast', category: 'Auracast', description: 'Next-gen audio sharing. LC3 Codec, Broadcast Audio, and Multi-stream support.', commonUUIDs: ['0x184B (Basic Audio)', '0x184E (Published Audio Capabilities)'], designConstraints: ['LC3 Compliance', 'QoS Synchronization'] },
    { id: 'p3', name: 'GATT Battery Service', category: 'GATT', description: 'Universal status reporting for node longevity.', commonUUIDs: ['0x180F (Battery Service)', '0x2A19 (Battery Level Characteristic)'], designConstraints: ['Read-only', 'Low frequency updates'] },
    { id: 'p4', name: 'Bluetooth Mesh 1.1', category: 'Mesh', description: 'Massive scale node orchestration. Directed Forwarding and Remote Provisioning.', commonUUIDs: ['0xA001 (Mesh Provisioning)', '0xA002 (Mesh Proxy)'], designConstraints: ['Relay support', 'Sequence numbering'] },
    { id: 'p5', name: 'HID over GATT (HoG)', category: 'GATT', description: 'Low-latency human interface conduit.', commonUUIDs: ['0x1812 (Human Interface Device)', '0x2A4A (Report Map Characteristic)'], designConstraints: ['Critical timing', 'Report maps'] },
];

interface BluetoothService {
    uuid: string;
    name: string;
    description: string;
    characteristics: BluetoothCharacteristic[];
}

interface BluetoothCharacteristic {
    uuid: string;
    name: string;
    properties: string[]; // e.g., ['Read', 'Write', 'Notify']
    description: string;
}

const getMockServicesAndCharacteristics = (protocolId: string): BluetoothService[] => {
    switch (protocolId) {
        case 'p1': // Core Spec 5.4
            return [
                {
                    uuid: '0x1800',
                    name: 'Generic Access Profile (GAP)',
                    description: 'Defines how devices interact with each other for discovery and connection.',
                    characteristics: [
                        { uuid: '0x2A00', name: 'Device Name', properties: ['Read'], description: 'The user-friendly name of the device.' },
                        { uuid: '0x2A01', name: 'Appearance', properties: ['Read'], description: 'Defines the external appearance of the device (e.g., phone, watch).' },
                    ],
                },
            ];
        case 'p2': // LE Audio / Auracast
            return [
                {
                    uuid: '0x184B',
                    name: 'Basic Audio Profile',
                    description: 'Provides standardized behavior for LE Audio devices.',
                    characteristics: [
                        { uuid: '0x2BDE', name: 'Audio Stream Control', properties: ['Write', 'Notify'], description: 'Control and status of audio streams.' },
                        { uuid: '0x2BDF', name: 'Codec Configuration', properties: ['Read', 'Write'], description: 'Parameters for audio codec (e.g., LC3).' },
                    ],
                },
            ];
        case 'p3': // GATT Battery Service
            return [
                {
                    uuid: '0x180F',
                    name: 'Battery Service',
                    description: 'Exposes the battery level status of a device.',
                    characteristics: [
                        { uuid: '0x2A19', name: 'Battery Level', properties: ['Read', 'Notify'], description: 'The current battery level percentage.' },
                        { uuid: '0x2A1B', name: 'Battery Status', properties: ['Read'], description: 'Charging status of the battery.' },
                    ],
                },
            ];
        case 'p4': // Bluetooth Mesh 1.1
            return [
                {
                    uuid: '0x1827',
                    name: 'Mesh Provisioning Service',
                    description: 'Used during the provisioning process to add a device to a Mesh network.',
                    characteristics: [
                        { uuid: '0x2ADB', name: 'Provisioning Data In', properties: ['Write'], description: 'Provisioning PDU sent by the Provisioner.' },
                        { uuid: '0x2ADC', name: 'Provisioning Data Out', properties: ['Notify'], description: 'Provisioning PDU received by the Provisioner.' },
                    ],
                },
            ];
        case 'p5': // HID over GATT (HoG)
            return [
                {
                    uuid: '0x1812',
                    name: 'Human Interface Device Service',
                    description: 'Enables a GATT client to interact with an HID host.',
                    characteristics: [
                        { uuid: '0x2A4A', name: 'Report Map', properties: ['Read'], description: 'Defines the format and capability of HID reports.' },
                        { uuid: '0x2A4D', name: 'HID Control Point', properties: ['Write'], description: 'Used to control the HID host (e.g., suspend).' },
                    ],
                },
            ];
        default:
            return [];
    }
};


export const BluetoothSpecBridge: React.FC = () => {
    const [selectedProtocol, setSelectedProtocol] = useState<BluetoothProtocol>(PROTOCOLS[0]);
    const [designRequirements, setDesignRequirements] = useState('');
    const [blueprint, setBlueprint] = useState<BluetoothBlueprint | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [logs, setLogs] = useState<string[]>(["[SIG_BRIDGE] Initialized.", "[READY] Spectum scanners calibrated."]);
    const [spectrumPulse, setSpectrumPulse] = useState(0);
    const [isSimulatingDrift, setIsSimulatingDrift] = useState(false);
    const [currentDrift, setCurrentDrift] = useState(0); // Simulated drift value
    const [interference, setInterference] = useState(0); // Simulated interference
    const [isAdapting, setIsAdapting] = useState(false);
    const [adaptationResult, setAdaptationResult] = useState<ProtocolAdaptation | null>(null);

    // Fix: Corrected typo from HTMLHTMLDivElement to HTMLDivElement
    const logEndRef = useRef<HTMLDivElement>(null);

    const simulatedServices = useMemo(() => getMockServicesAndCharacteristics(selectedProtocol.id), [selectedProtocol]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSpectrumPulse(p => (p + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let driftInterval: number;
        if (isSimulatingDrift) {
            addLog("[DRIFT_SIM] Initiating simulated network drift...", 'orange');
            driftInterval = setInterval(() => {
                setCurrentDrift(d => Math.min(100, d + Math.random() * 5));
                setInterference(i => Math.min(100, i + Math.random() * 3));
            }, 500);
        } else {
            addLog("[DRIFT_SIM] Drift simulation halted.", 'green');
            setCurrentDrift(0);
            setInterference(0);
        }
        return () => clearInterval(driftInterval);
    }, [isSimulatingDrift]);

    const addLog = (msg: string, color: string = 'text-gray-600 italic opacity-80') => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] <span style="color:${color};">${msg}</span>`, ...prev].slice(0, 15));
    };

    const handleDesign = async () => {
        if (!designRequirements.trim() || isGenerating) return;
        setIsGenerating(true);
        addLog(`Consulting SIG Standards for ${selectedProtocol.name}...`, 'text-blue-400');
        
        const result = await generateBluetoothBlueprint(selectedProtocol.name, designRequirements);
        if (result) {
            setBlueprint(result);
            addLog("Gifted Blueprint synthesized. Protocol integrity: 99.8%", 'text-green-400');
        } else {
            addLog("Error: Conjunction bridge failed. The spectrum is too noisy.", 'text-red-600');
        }
        setIsGenerating(false);
    };

    const handleAdaptProtocol = async () => {
        if (!blueprint || isAdapting || (!isSimulatingDrift && currentDrift < 10 && interference < 10)) return; // Only adapt if drift is significant or simulation is on
        setIsAdapting(true);
        setAdaptationResult(null);
        addLog(`[ADAPTING_PROTOCOL] Maestro initiating dynamic adaptation for ${blueprint.protocol}...`, 'cyan');

        const networkConditions = { simulatedDrift: currentDrift, interferenceLevel: interference };
        const result = await adaptBluetoothProtocol(blueprint, networkConditions);

        if (result) {
            setAdaptationResult(result);
            addLog(`[SUCCESS] Protocol adapted. Predicted stability: ${result.predictedStability.toFixed(1)}%`, 'lime');
            // Simulate updating the blueprint somewhat (e.g., packet structure)
            if (result.revisedPacketStructure) {
                setBlueprint(prev => prev ? { ...prev, packetStructure: result.revisedPacketStructure } : null);
            }
        } else {
            addLog(`[ERROR] Protocol adaptation failed for ${blueprint.protocol}.`, 'red');
        }
        setIsAdapting(false);
    };

    return (
        <div className="h-full flex flex-col bg-[#01050a] text-gray-200 font-mono p-4 sm:p-6 space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-black/80 p-5 rounded-3xl border-4 border-black aero-panel gap-4 shadow-[10px_10px_0_0_#000]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-500/10 border-4 border-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <SignalIcon className="w-9 h-9 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="font-comic-header text-5xl text-blue-400 wisdom-glow uppercase tracking-tighter italic">BLUETOOTH BRIDGE</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black italic">SIG Official Specifications | Protocol Architect</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Spectrum Density</p>
                        <div className="w-24 h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${spectrumPulse}%` }} />
                        </div>
                    </div>
                    <ActivityIcon className="w-8 h-8 text-blue-900 opacity-30" />
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Protocol Library Side */}
                <div className="lg:w-[400px] flex flex-col gap-6 flex-shrink-0 min-h-0">
                    <div className="aero-panel p-6 bg-slate-900/60 border-blue-600/30 overflow-hidden flex flex-col h-full shadow-[8px_8px_0_0_#000]">
                        <h3 className="font-comic-header text-2xl text-white uppercase mb-6 flex items-center gap-3">
                            <BookOpenIcon className="w-6 h-6 text-blue-500" /> SIG Library
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                            {PROTOCOLS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProtocol(p)}
                                    className={`w-full p-4 text-left rounded-2xl border-4 transition-all duration-300 flex flex-col gap-2 ${
                                        selectedProtocol.id === p.id 
                                        ? 'bg-black border-blue-600 shadow-[6px_6px_0_0_#000]' 
                                        : 'bg-black/40 border-black grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedProtocol.id === p.id ? 'text-blue-400' : 'text-gray-500'}`}>{p.category}</span>
                                        <LogicIcon className="w-3 h-3 text-gray-700" />
                                    </div>
                                    <p className="font-comic-header text-xl text-white uppercase">{p.name}</p>
                                    <p className="text-[10px] text-gray-500 leading-snug line-clamp-2 italic">"{p.description}"</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Design Flow Main Area */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <div className="aero-panel p-8 bg-black border-4 border-black shadow-[10px_10px_0_0_#000] flex flex-col gap-8 min-h-0 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-4 mb-2">
                            <BrainIcon className="w-10 h-10 text-blue-400" />
                            <div>
                                <h3 className="font-comic-header text-3xl text-white uppercase tracking-tight">Design Architect Flow</h3>
                                <p className="text-blue-500/60 text-[10px] font-black uppercase tracking-widest">Protocol: {selectedProtocol.name}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-900 border-2 border-white/5 rounded-[2rem]">
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Functional Directives</h4>
                                    <textarea 
                                        value={designRequirements}
                                        onChange={e => setDesignRequirements(e.target.value)}
                                        placeholder="Describe your Bluetooth feature (e.g. 'A mesh node that controls vehicle interior lighting with encrypted proximity checks')..."
                                        className="w-full h-32 bg-black/60 border-2 border-black rounded-2xl p-4 text-sm text-blue-400 font-mono resize-none focus:ring-0 focus:border-blue-500 transition-all placeholder:text-gray-900 shadow-inner"
                                    />
                                    <button 
                                        onClick={handleDesign}
                                        disabled={isGenerating || !designRequirements.trim()}
                                        className="vista-button w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-4 shadow-[4px_4px_0_0_#000] active:translate-y-1 transition-all text-lg"
                                    >
                                        {isGenerating ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <ZapIcon className="w-6 h-6" />}
                                        <span>SYNTHESIZE DESIGN</span>
                                    </button>
                                </div>

                                <div className="p-6 bg-blue-950/10 border-2 border-blue-900/30 rounded-[2rem]">
                                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <ShieldIcon className="w-4 h-4" /> SIG Compliance
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedProtocol.designConstraints.map((c, i) => (
                                            <li key={i} className="flex gap-3 text-[10px] text-gray-400 font-mono italic">
                                                <span className="text-blue-900 font-black">»</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="flex-1 bg-black border-4 border-black rounded-[2.5rem] p-6 shadow-inner relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><TerminalIcon className="w-20 h-20 text-blue-500" /></div>
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Blueprint Staging</h4>
                                    
                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                                        {blueprint ? (
                                            <div className="space-y-6 animate-in zoom-in-95 duration-500">
                                                <div>
                                                    <p className="text-[9px] text-blue-600 font-black uppercase mb-1">Architecture Node</p>
                                                    <p className="text-sm text-white font-black italic border-l-4 border-blue-600 pl-4">{blueprint.architecture}</p>
                                                </div>
                                                <div className="bg-slate-900 p-4 rounded-xl border border-white/5">
                                                    <p className="text-[8px] text-gray-600 font-black uppercase mb-2">Gifted Implementation</p>
                                                    <pre className="text-[10px] font-mono text-cyan-400 overflow-x-auto whitespace-pre-wrap">{blueprint.codeSnippet}</pre>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-3 bg-blue-900/10 rounded-xl border border-blue-500/20 text-center">
                                                        <p className="text-[8px] text-gray-600 font-black mb-1 uppercase">Packet Sig</p>
                                                        <p className="text-xs font-mono text-blue-400 truncate">{blueprint.packetStructure}</p>
                                                    </div>
                                                    <div className="p-3 bg-blue-900/10 rounded-xl border border-blue-500/20 text-center">
                                                        <p className="text-[8px] text-gray-600 font-black mb-1 uppercase">Maestro Auth</p>
                                                        <p className="text-xs font-mono text-blue-400 truncate">{blueprint.integritySignature}</p>
                                                    </div>
                                                </div>
                                                {adaptationResult && (
                                                    <div className="p-4 bg-lime-900/20 border-2 border-lime-500/30 rounded-xl animate-in zoom-in-95">
                                                        <p className="text-[9px] text-lime-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircleIcon className="w-3 h-3"/> ADAPTATION SUCCESS</p>
                                                        <ul className="list-disc list-inside text-[10px] text-lime-300">
                                                            {adaptationResult.adaptationDirectives.map((dir, i) => <li key={i}>{dir}</li>)}
                                                        </ul>
                                                        <p className="text-[9px] text-gray-500 mt-2">Predicted Stability: <span className="text-lime-400">{adaptationResult.predictedStability.toFixed(1)}%</span></p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-10">
                                                <SignalIcon className="w-32 h-32 text-gray-500 mb-4" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center max-w-[200px]">"Protocol bridge awaiting design conduction."</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Real-time Comms Logs and Adaptation Controls */}
                <div className="lg:w-96 flex flex-col gap-6">
                    <div className="aero-panel bg-black/90 border-4 border-black flex flex-col overflow-hidden h-[450px] shadow-[10px_10px_0_0_#000]">
                        <div className="p-5 border-b-4 border-black flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <ActivityIcon className="w-6 h-6 text-blue-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">SPECTRUM_LOG:LIVE</span>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping shadow-[0_0_10px_blue]" />
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-3 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                            {logs.map((log, i) => (
                                <div key={i} className={`flex gap-4 pb-2 border-b border-white/5 last:border-0 animate-in slide-in-from-left-2`} dangerouslySetInnerHTML={{ __html: log }} />
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>

                    <div className="aero-panel p-8 bg-slate-900 border-4 border-black shadow-[10px_10px_0_0_#000]">
                         <h4 className="font-comic-header text-3xl text-gray-500 mb-6 uppercase italic tracking-tighter">Architectural Wisdom</h4>
                         <div className="space-y-6 font-mono text-[11px] leading-relaxed">
                            <p className="text-gray-400 italic border-l-4 border-blue-600 pl-5 bg-white/5 py-4 rounded-r-xl">
                                "Bluetooth is the ghost in the machine. To conduct the spectrum is to bridge the air with absolute architectural authority. Every packet is a gifted note in the Maestro's symphony."
                            </p>
                            <div className="bg-black/80 p-5 rounded-2xl border-2 border-white/5 text-blue-400 flex items-start gap-4 group hover:border-blue-500/50 transition-all">
                                <ShieldIcon className="w-7 h-7 flex-shrink-0 mt-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <p className="font-black uppercase tracking-widest text-[10px] leading-snug">
                                    High integrity spectral mapping active. PAwR and LE Audio blueprints ready for gifted know-how conduction.
                                </p>
                            </div>
                         </div>
                         <div className="mt-8 pt-8 border-t-2 border-black/50">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <CodeIcon className="w-3.5 h-3.5" /> Adaptation Protocol
                            </h5>
                            <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-xl">
                                <label className="text-[9px] text-gray-400 font-black uppercase">Simulate Drift</label>
                                <input type="checkbox" checked={isSimulatingDrift} onChange={() => setIsSimulatingDrift(p => !p)} className="w-4 h-4 accent-red-500" />
                            </div>
                            {isSimulatingDrift && (
                                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between text-[8px] text-red-500 font-black uppercase">
                                        <span>Current Drift:</span>
                                        <span>{currentDrift.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${currentDrift}%` }} />
                                    </div>
                                    <div className="flex justify-between text-[8px] text-red-500 font-black uppercase">
                                        <span>Interference:</span>
                                        <span>{interference.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500" style={{ width: `${interference}%` }} />
                                    </div>
                                </div>
                            )}
                            {(currentDrift > 20 || interference > 20) && !isAdapting && blueprint && (
                                <button
                                    onClick={handleAdaptProtocol}
                                    className="vista-button w-full mt-4 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[10px] rounded-2xl flex items-center justify-center gap-2 animate-pulse shadow-[4px_4px_0_0_#000]"
                                >
                                    <WarningIcon className="w-4 h-4" /> RECONCILE DRIFT
                                </button>
                            )}
                            {isAdapting && (
                                <div className="w-full mt-4 py-3 bg-blue-950/20 text-blue-400 font-black uppercase text-[10px] rounded-2xl flex items-center justify-center gap-2 animate-pulse">
                                    <SpinnerIcon className="w-4 h-4" /> ADAPTING PROTOCOL...
                                </div>
                            )}
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
