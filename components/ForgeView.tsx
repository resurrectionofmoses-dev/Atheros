
import React, { useState, useMemo } from 'react';
import type { ProjectBlueprint, BlueprintStatus, BlueprintPriority } from '../types';
import { BookOpenIcon, ForgeIcon, HammerIcon, SpinnerIcon, XIcon } from './icons';
import { queryKnowledgeCore } from '../services/geminiService';

interface ForgeViewProps {
  blueprints: ProjectBlueprint[];
  onAddBlueprint: (title: string, description: string, priority: BlueprintPriority) => void;
  onUpdateBlueprintStatus: (id: string, status: BlueprintStatus) => void;
  onDeleteBlueprint: (id: string) => void;
}

const priorityMap: Record<BlueprintPriority, { color: string, label: string }> = {
    'Low': { color: 'bg-gray-500', label: 'Low' },
    'Medium': { color: 'bg-sky-500', label: 'Medium' },
    'High': { color: 'bg-yellow-500', label: 'High' },
    'Critical': { color: 'bg-red-500', label: 'Critical' },
};

// Define a consistent order for priorities
const priorityOrder: Record<BlueprintPriority, number> = {
    'Critical': 4,
    'High': 3,
    'Medium': 2,
    'Low': 1,
};

const statusOptions: BlueprintStatus[] = ['Pending', 'In Progress', 'Completed', 'On Hold'];

const formatKnowledgeText = (text: string): string => {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const escapedCode = code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre class="bg-black/50 p-3 my-2 rounded-md border border-black font-mono text-sm overflow-x-auto"><code>${escapedCode}</code></pre>`;
    })
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h3 class="font-comic-header text-xl text-violet-300 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-comic-header text-2xl text-violet-300 mt-4 mb-2 border-b-2 border-black pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-comic-header text-3xl text-white mt-4 mb-2">$1</h1>')
    .replace(/\n/g, '<br />');
};

export const ForgeView: React.FC<ForgeViewProps> = ({ blueprints, onAddBlueprint, onUpdateBlueprintStatus, onDeleteBlueprint }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPriority, setNewPriority] = useState<BlueprintPriority>('Medium');

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [knowledgeResult, setKnowledgeResult] = useState('');
    const [error, setError] = useState('');

    const [sortFilter, setSortFilter] = useState<'All' | BlueprintPriority>('All'); // New state for sorting

    const handleAddBlueprint = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) return;
        onAddBlueprint(newTitle, newDescription, newPriority);
        setNewTitle('');
        setNewDescription('');
        setNewPriority('Medium');
    };

    const handleSearch = async (query?: string) => {
        const finalQuery = query || searchQuery;
        if (!finalQuery.trim()) return;
        
        setIsLoading(true);
        setKnowledgeResult('');
        setError('');
        try {
            let fullResponse = '';
            for await (const chunk of queryKnowledgeCore(finalQuery)) {
                fullResponse += chunk;
                setKnowledgeResult(fullResponse);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to query the knowledge core. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Memoized sorting and filtering logic
    const sortedAndFilteredBlueprints = useMemo(() => {
        let tempBlueprints = [...blueprints];

        if (sortFilter !== 'All') {
            tempBlueprints = tempBlueprints.filter(bp => bp.priority === sortFilter);
        }

        tempBlueprints.sort((a, b) => {
            // Sort by priority (Critical > High > Medium > Low)
            const priorityA = priorityOrder[a.priority];
            const priorityB = priorityOrder[b.priority];
            if (priorityB !== priorityA) {
                return priorityB - priorityA; // Sort by priority descending
            }
            // Secondary sort by timestamp (newest first) if priorities are equal
            return b.timestamp.getTime() - a.timestamp.getTime();
        });

        return tempBlueprints;
    }, [blueprints, sortFilter]);

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-lg">
            <div className="p-4 border-b-4 border-black sticky top-0 z-10 bg-gray-800 rounded-t-lg">
                <h2 className="font-comic-header text-3xl text-white">The Forge</h2>
                <p className="text-gray-400 -mt-1">Project Blueprints & Knowledge Core</p>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
                {/* Blueprints */}
                <div className="lg:w-1/2 flex flex-col gap-4 overflow-hidden">
                    <form onSubmit={handleAddBlueprint} className="comic-panel bg-gray-800/50 p-4">
                        <h3 className="font-comic-header text-2xl text-violet-300 border-b-2 border-black pb-2 mb-3 flex items-center gap-2"><HammerIcon className="w-6 h-6"/>New Blueprint</h3>
                        <div className="space-y-3">
                            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Blueprint Title" className="w-full bg-gray-900/80 border-2 border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description..." className="w-full h-20 bg-gray-900/80 border-2 border-black rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500" required />
                            <div className="flex items-center gap-4">
                                <select value={newPriority} onChange={e => setNewPriority(e.target.value as BlueprintPriority)} className="w-full bg-gray-900/80 border-2 border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-300">
                                    {Object.keys(priorityMap).map(p => <option key={p} value={p}>{priorityMap[p as BlueprintPriority].label} Priority</option>)}
                                </select>
                                <button type="submit" className="comic-button bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 flex-shrink-0">Add Task</button>
                            </div>
                        </div>
                    </form>
                    <div className="flex-1 comic-panel bg-black/50 overflow-hidden flex flex-col">
                         <div className="p-3 border-b-2 border-black flex items-center justify-between">
                            <h3 className="font-comic-header text-2xl text-violet-300">Active Blueprints</h3>
                            <select 
                                value={sortFilter}
                                onChange={e => setSortFilter(e.target.value as 'All' | BlueprintPriority)}
                                className="bg-gray-900/80 border-2 border-black rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-300"
                            >
                                <option value="All">Sort: All</option>
                                <option value="Critical">Sort: Critical</option>
                                <option value="High">Sort: High</option>
                                <option value="Medium">Sort: Medium</option>
                                <option value="Low">Sort: Low</option>
                            </select>
                         </div>
                         <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {sortedAndFilteredBlueprints.length > 0 ? sortedAndFilteredBlueprints.map(bp => (
                                <div key={bp.id} className="bg-gray-800/50 rounded-lg border-2 border-black p-3 fade-in">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-xs font-bold text-white px-2 py-0.5 rounded-full border border-black inline-block ${priorityMap[bp.priority].color}`}>{bp.priority}</div>
                                            <h4 className="font-bold text-lg text-white mt-1 truncate">{bp.title}</h4>
                                        </div>
                                        <button onClick={() => onDeleteBlueprint(bp.id)} className="text-gray-500 hover:text-red-400 p-1"><XIcon className="w-4 h-4" /></button>
                                    </div>
                                    <p className="text-sm text-gray-400 my-2">{bp.description}</p>
                                    <select value={bp.status} onChange={e => onUpdateBlueprintStatus(bp.id, e.target.value as BlueprintStatus)} className="w-full bg-gray-900/80 border-2 border-black rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )) : <div className="text-center text-gray-500 italic p-6">No active blueprints.</div>}
                         </div>
                    </div>
                </div>

                {/* Knowledge Core */}
                <div className="lg:w-1/2 flex flex-col comic-panel bg-black/50 overflow-hidden">
                    <h3 className="font-comic-header text-2xl text-violet-300 border-b-2 border-black p-3 flex items-center gap-2"><BookOpenIcon className="w-6 h-6"/>Knowledge Core</h3>
                    <div className="p-3">
                        <div className="flex gap-2">
                            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Ask about AetherOS development..." className="w-full bg-gray-900/80 border-2 border-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                            <button onClick={() => handleSearch()} className="comic-button bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2">Search</button>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {['Module Architecture', 'API Usage', 'Security Protocols'].map(topic => (
                                <button key={topic} onClick={() => { setSearchQuery(topic); handleSearch(topic); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-full border border-black">{topic}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 border-t-2 border-black">
                        {isLoading && <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-8 h-8 text-violet-400" /></div>}
                        {error && <div className="text-center text-red-400 p-6">{error}</div>}
                        {!isLoading && !error && !knowledgeResult && <div className="text-center text-gray-500 italic p-6">Ask a question to query the knowledge core.</div>}
                        {knowledgeResult && <div className="prose prose-invert prose-sm text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: formatKnowledgeText(knowledgeResult) }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};