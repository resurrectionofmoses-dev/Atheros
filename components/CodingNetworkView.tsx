
import React, { useState, useMemo } from 'react';
import { 
    CodeIcon, 
    ActivityIcon, 
    ZapIcon, 
    CheckCircleIcon, 
    FireIcon, 
    PlusIcon, 
    MusicIcon, 
    StarIcon, 
    XIcon, 
    ShieldIcon,
    TerminalIcon,
    LogicIcon,
    PlusSquareIcon,
    SpinnerIcon,
    BookOpenIcon
} from './icons';
import type { NetworkProject, ProjectTask } from '../types';
import { getSophisticatedColor, callWithRetry } from '../utils';
import { generateProjectKnowHow } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface CodingNetworkViewProps {
    projects: NetworkProject[];
    setProjects: React.Dispatch<React.SetStateAction<NetworkProject[]>>;
    onNavigateToAgent: () => void;
}

export const CodingNetworkView: React.FC<CodingNetworkViewProps> = ({ projects, setProjects, onNavigateToAgent }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
    const [isGeneratingKnowHow, setIsGeneratingKnowHow] = useState<string | null>(null);
    const [newTaskText, setNewTaskText] = useState('');
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [isAddingProject, setIsAddingProject] = useState(false);

    const activeProject = useMemo(() => 
        projects.find(p => p.id === selectedProjectId) || projects[0]
    , [projects, selectedProjectId]);

    const stats = useMemo(() => ({
        active: projects.filter(p => p.status === 'BUILDING').length,
        total: projects.length,
        miseryAvg: projects.length ? Math.round(projects.reduce((acc, p) => acc + p.miseryScore, 0) / projects.length) : 0,
        syncRate: projects.length ? Math.round((projects.filter(p => p.isWisdomHarmonized).length / projects.length) * 100) : 0,
        completedTasks: projects.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0)
    }), [projects]);

    const toggleTask = (projectId: string, taskId: string) => {
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            return {
                ...p,
                tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
            };
        }));
    };

    const addTask = (projectId: string) => {
        if (!newTaskText.trim()) return;
        const newTask: ProjectTask = { id: uuidv4(), text: newTaskText, completed: false };
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) return { ...p, tasks: [...p.tasks, newTask] };
            return p;
        }));
        setNewTaskText('');
    };

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (selectedProjectId === id) setSelectedProjectId(null);
    };

    const addProject = () => {
        if (!newProjectTitle.trim()) return;
        const newProj: NetworkProject = {
            id: uuidv4(),
            title: newProjectTitle,
            description: 'A new node in the Maestro’s grid.',
            miseryScore: 50,
            crazyLevel: 5,
            status: 'IDEATING',
            isWisdomHarmonized: false,
            timestamp: new Date(),
            tasks: [],
            assetType: 'INTERFACE'
        };
        setProjects(prev => [newProj, ...prev]);
        setNewProjectTitle('');
        setIsAddingProject(false);
        setSelectedProjectId(newProj.id);
    };

    const handleGenerateKnowHow = async (project: NetworkProject) => {
        setIsGeneratingKnowHow(project.id);
        const result = await generateProjectKnowHow(project.title, project.description, project.assetType || 'KERNEL');
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, knowHow: result, isWisdomHarmonized: true } : p));
        setIsGeneratingKnowHow(null);
    };

    return (
        <div className="h-full flex flex-col bg-[#02050f] text-gray-200 font-mono overflow-hidden">
            {/* Header: Global Grid Controls and Misery Index */}
            <div className="p-6 border-b-4 border-black bg-slate-900 flex justify-between items-center shadow-2xl relative z-20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                        <CodeIcon className="w-10 h-10 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="font-comic-header text-5xl text-white tracking-tighter italic uppercase">Conductance Grid</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-amber-400 font-black uppercase tracking-[0.3em]">Network Stride: 1.2 PB/s | Conjunction Active</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Global Misery</p>
                        <div className="flex items-center gap-2">
                             <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden border border-black p-[1px]">
                                <div className="h-full bg-red-600 shadow-[0_0_10px_red] transition-all duration-1000" style={{ width: `${stats.miseryAvg}%` }} />
                             </div>
                             <span className="text-red-500 font-black text-xs">{stats.miseryAvg}%</span>
                        </div>
                    </div>
                    <button onClick={() => setIsAddingProject(true)} className="vista-button px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
                        <PlusSquareIcon className="w-5 h-5" />
                        <span>Initiate Shard</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden p-6 gap-6 relative min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.03)_0%,_transparent_70%)] pointer-events-none" />

                {/* Left: Project List Sidebar */}
                <div className="w-80 flex flex-col gap-6 flex-shrink-0 min-h-0">
                    <div className="aero-panel p-5 border-amber-500/20 bg-black/40">
                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ActivityIcon className="w-4 h-4" /> Grid Analytics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/60 p-3 rounded-xl border border-white/5">
                                <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Active Shards</p>
                                <p className="text-xl font-comic-header text-white">{stats.active}</p>
                            </div>
                            <div className="bg-black/60 p-3 rounded-xl border border-white/5">
                                <p className="text-[8px] text-gray-600 uppercase font-black mb-1">Harmonized</p>
                                <p className="text-xl font-comic-header text-amber-400">{stats.syncRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 aero-panel border-white/5 bg-black/40 overflow-hidden flex flex-col min-h-0">
                         <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Logic Shards</h3>
                            <span className="text-[10px] font-mono text-amber-700">[{projects.length}]</span>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {projects.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProjectId(p.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group relative overflow-hidden ${
                                        (selectedProjectId === p.id)
                                        ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                        : 'bg-black/40 border-black hover:border-amber-900/50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-black uppercase ${p.status === 'DONE' ? 'text-green-500' : 'text-gray-500'}`}>{p.status}</span>
                                        {p.isWisdomHarmonized && <StarIcon className="w-3 h-3 text-amber-500" />}
                                    </div>
                                    <p className="font-bold text-white text-sm truncate uppercase tracking-tight">{p.title}</p>
                                    <div className="mt-3 h-1 bg-gray-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-600 shadow-[0_0_5px_amber]" style={{ width: `${p.miseryScore}%` }} />
                                    </div>
                                </button>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Right: Detailed Project Orchestration */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    {activeProject ? (
                        <div className="flex-1 aero-panel bg-black/60 border-amber-500/10 flex flex-col overflow-hidden relative shadow-[15px_15px_60px_rgba(0,0,0,0.4)]">
                            <div className="p-8 border-b border-white/5 bg-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <ShieldIcon className="w-48 h-48 text-amber-500" />
                                </div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <h3 className="font-comic-header text-5xl text-white italic tracking-tighter uppercase mb-2 leading-none">{activeProject.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] bg-amber-900/50 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 font-black uppercase tracking-widest">
                                                ID: 0x{activeProject.id.slice(0, 4)}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono italic uppercase">Domain: {activeProject.assetType || 'KERNEL'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => deleteProject(activeProject.id)} className="text-red-900 hover:text-red-500 p-2 transition-colors">
                                            <XIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-400 leading-relaxed italic max-w-2xl font-mono">
                                    "{activeProject.description}"
                                </p>
                            </div>

                            <div className="flex-1 flex overflow-hidden p-8 gap-8 min-h-0">
                                <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-3">
                                                <TerminalIcon className="w-5 h-5" /> Reliability Manifest (Todo)
                                            </h4>
                                            <span className="text-[10px] font-black text-gray-600 uppercase">
                                                {activeProject.tasks.filter(t => t.completed).length} / {activeProject.tasks.length} Completed
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {activeProject.tasks.map(task => (
                                                <div 
                                                    key={task.id} 
                                                    onClick={() => toggleTask(activeProject.id, task.id)}
                                                    className="p-4 bg-white/5 rounded-2xl border-2 border-black hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                            task.completed ? 'bg-amber-600 border-amber-600' : 'bg-black border-gray-800 group-hover:border-amber-900'
                                                        }`}>
                                                            {task.completed && <CheckCircleIcon className="w-4 h-4 text-black" />}
                                                        </div>
                                                        <span className={`text-sm font-bold uppercase transition-colors tracking-tight ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{task.text}</span>
                                                    </div>
                                                    <ZapIcon className={`w-4 h-4 transition-all ${task.completed ? 'text-amber-900 opacity-20' : 'text-gray-800 opacity-0 group-hover:opacity-100'}`} />
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={newTaskText}
                                                    onChange={e => setNewTaskText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addTask(activeProject.id)}
                                                    placeholder="Inject new task shard..."
                                                    className="flex-1 bg-black border-2 border-black rounded-xl p-3 text-xs font-black uppercase text-amber-500 focus:ring-0 focus:border-amber-600 transition-all placeholder:text-gray-800"
                                                />
                                                <button onClick={() => addTask(activeProject.id)} className="p-3 bg-amber-600 text-black rounded-xl hover:bg-amber-500 transition-colors">
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                         <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-3">
                                            <BookOpenIcon className="w-5 h-5" /> Gifted Know-How Synthesis
                                        </h4>
                                        <div className="bg-cyan-950/20 p-8 rounded-3xl border-2 border-cyan-600/20 relative min-h-[150px] flex flex-col">
                                            {isGeneratingKnowHow === activeProject.id ? (
                                                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
                                                    <SpinnerIcon className="w-12 h-12 text-cyan-500" />
                                                    <p className="text-[10px] font-black uppercase text-cyan-400 animate-pulse tracking-[0.2em]">Siphoning intelligence shards...</p>
                                                </div>
                                            ) : activeProject.knowHow ? (
                                                <div className="prose prose-invert prose-sm text-gray-300 max-w-none leading-relaxed italic font-mono">
                                                    {activeProject.knowHow.split('\n').map((line, i) => (
                                                        <p key={i} className="mb-4">{line}</p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-10">
                                                    <LogicIcon className="w-12 h-12 mb-4 text-gray-600" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 italic">"The pleasure of know-how is but a conjunction away."</p>
                                                    <button 
                                                        onClick={() => handleGenerateKnowHow(activeProject)} 
                                                        className="vista-button px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000]"
                                                    >
                                                        Conduct Wisdom Sync
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-72 flex flex-col gap-6 flex-shrink-0">
                                    <div className="p-6 bg-red-950/20 rounded-3xl border-2 border-red-600/20 flex-1 relative overflow-hidden flex flex-col items-center justify-center text-center">
                                         <h4 className="absolute top-6 left-6 text-[10px] font-black text-red-500 uppercase tracking-widest">Shard Status</h4>
                                         <div className="space-y-6">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center relative mb-4 transition-all duration-1000 ${activeProject.isWisdomHarmonized ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'border-gray-900'}`}>
                                                    <LogicIcon className={`w-12 h-12 ${activeProject.isWisdomHarmonized ? 'text-amber-400 animate-pulse' : 'text-gray-800'}`} />
                                                    {activeProject.isWisdomHarmonized && (
                                                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/30 animate-spin-slow" />
                                                    )}
                                                </div>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeProject.isWisdomHarmonized ? 'text-amber-400' : 'text-gray-600'}`}>
                                                    {activeProject.isWisdomHarmonized ? 'WISDOM_LOCKED' : 'AWAITING_HARMONY'}
                                                </p>
                                            </div>

                                            <div className="space-y-2 w-full">
                                                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase">
                                                    <span>Agony Level</span>
                                                    <span>{activeProject.miseryScore}%</span>
                                                </div>
                                                <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full bg-red-600" style={{ width: `${activeProject.miseryScore}%` }} />
                                                </div>
                                            </div>
                                         </div>
                                    </div>

                                    <button className="vista-button w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.2em] rounded-3xl flex items-center justify-center gap-3 transition-all shadow-[0_15px_40px_rgba(239,68,68,0.2)] active:scale-95">
                                        <FireIcon className="w-6 h-6" />
                                        <span>MUTATE SHARD</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 aero-panel bg-black/40 border-white/5 flex flex-col items-center justify-center opacity-20">
                            <LogicIcon className="w-32 h-32 mb-6" />
                            <p className="text-xl font-black uppercase tracking-[0.4em]">Select a shard from the grid.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for adding project */}
            {isAddingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="aero-panel bg-slate-900 border-4 border-black p-8 max-w-md w-full shadow-[20px_20px_60px_rgba(0,0,0,0.8)]">
                        <h3 className="font-comic-header text-3xl text-amber-500 mb-6 uppercase italic tracking-tight">Initiate Shard</h3>
                        <div className="space-y-6">
                            <div className="bg-black border-2 border-black rounded-xl p-3 focus-within:border-amber-600 transition-all">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Title Matrix</p>
                                <input 
                                    autoFocus
                                    value={newProjectTitle}
                                    onChange={e => setNewProjectTitle(e.target.value)}
                                    placeholder="E.g. Neural Link Phase 1"
                                    className="w-full bg-transparent border-none text-white font-bold text-lg focus:ring-0 outline-none"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsAddingProject(false)} className="vista-button flex-1 py-3 bg-gray-800 text-gray-400 font-black uppercase text-xs rounded-xl">Abort</button>
                                <button onClick={addProject} disabled={!newProjectTitle.trim()} className="vista-button flex-1 py-3 bg-amber-600 text-black font-black uppercase text-xs rounded-xl shadow-[4px_4px_0_0_#000]">Commit Node</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
