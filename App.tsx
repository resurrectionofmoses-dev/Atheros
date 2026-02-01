

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from '@google/genai';
import { ChatView } from './components/ChatView';
import { InputBar } from './components/InputBar';
import type { ChatMessage, AttachedFile, ChatSession, SystemStatus, VehicleSystem, SystemState, SystemDetails, MainView, EvoLibrary, ImplementationResponse, BroadcastMessage, SavedModule, CustomCommand, PinnedItem, ArchiveEntry, ProjectBlueprint, NetworkProject, BlueprintPriority } from './types';
import { SYSTEM_INSTRUCTIONS } from './constants';
import { startChatSession, sendMessage, scanBinaryFile, generateSoftwareModule } from './services/geminiService';
import { ChatHeader } from './components/ChatHeader';
import { Launchpad } from './components/Launchpad';
import { Sidebar } from './components/Sidebar';
import { isBinaryFile } from './utils';
import { DiagnosticsCenter } from './components/DiagnosticsCenter';
import { EvoPromptsView } from './components/EvoPromptsView';
import { SoftwareWorkshop } from './components/SoftwareWorkshop';
import { CommunicationsView } from './components/CommunicationsView';
import { OperationsVault } from './components/OperationsVault';
import { ModuleBay } from './components/ModuleBay';
import { CommandDeck } from './components/CommandDeck';
import { StrategicOverview } from './components/StrategicOverview';
import { DeviceLinkView } from './components/DeviceLinkView';
import { SystemArchives } from './components/SystemArchives';
import { ForgeView } from './components/ForgeView';
import { SingularityEngineView } from './components/SingularityEngineView';
import { UpNorthProtocol } from './components/UpNorthProtocol';
import { CodeAgentView } from './components/CodeAgentView';
import { ProjectNetwork } from './components/ProjectNetwork';
import { WisdomNexus } from './components/WisdomNexus';
import { ZurichBridge } from './components/ZurichBridge';
import { EnlightenmentPool } from './components/EnlightenmentPool';
import { PseudoRoleTesting } from './components/PseudoRoleTesting';
import { IntegrityNetworkView } from './components/IntegrityNetworkView';
import { LaunchCenterView } from './components/LaunchCenterView';
import { NetworkSentinel } from './components/NetworkSentinel';
import { BluetoothSpecBridge } from './components/BluetoothSpecBridge';
import { PackagingSuite } from './components/PackagingSuite';
import { CodingNetworkView } from './components/CodingNetworkView';
import { NetworkCovenant } from './components/NetworkCovenant';

// --- LocalStorage Keys ---
const SESSION_KEY = 'aetherosSession';
const MODULES_KEY = 'aetherosModules';
const COMMANDS_KEY = 'aetherosCommands';
const PINS_KEY = 'aetherosPins';
const ARCHIVES_KEY = 'aetherosArchives';
const BLUEPRINTS_KEY = 'aetherosBlueprints';
const KNOWLEDGE_BASE_KEY = 'aetherosKnowledgeBase';
const PROJECTS_KEY = 'aetherosProjects';
const VIEW_KEY = 'aetherosCurrentView';
const STATUS_KEY = 'aetherosSystemStatus';
const DETAILS_KEY = 'aetherosSystemDetails';
const START_DATE_KEY = 'aetherosStartDate';
const END_DATE_KEY = 'aetherosEndDate';

// --- LocalStorage Helpers ---
const loadSessionFromStorage = (): ChatSession | null => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const s = JSON.parse(saved) as any;
    return {
      ...s,
      messages: s.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        parentTimestamp: msg.parentTimestamp ? new Date(msg.parentTimestamp) : undefined
      })),
      chat: startChatSession(SYSTEM_INSTRUCTIONS.aetheros, s.messages)
    };
  } catch (error) {
    return null;
  }
};

const saveSessionToStorage = (session: ChatSession | null) => {
  if (!session) return;
  try {
    const { chat, ...rest } = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(rest));
  } catch (error) {}
};

// --- App Component ---
const App: React.FC = () => {
  // UI and Interaction State
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Hereditary Date State
  const [startDate, setStartDate] = useState<string>(() => localStorage.getItem(START_DATE_KEY) || '');
  const [endDate, setEndDate] = useState<string>(() => localStorage.getItem(END_DATE_KEY) || '');
  
  // Persistent Navigation State
  const [currentView, setCurrentView] = useState<MainView>(() => {
    const saved = localStorage.getItem(VIEW_KEY);
    return (saved as MainView) || 'vault';
  });

  // Persistent System State
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(() => {
    const saved = localStorage.getItem(STATUS_KEY);
    return saved ? JSON.parse(saved) : {
      'Engine': 'OK', 'Battery': 'OK', 'Navigation': 'OK', 'Infotainment': 'OK', 'Handling': 'OK',
    };
  });

  const [systemDetails, setSystemDetails] = useState<SystemDetails>(() => {
    const saved = localStorage.getItem(DETAILS_KEY);
    return saved ? JSON.parse(saved) : {
      'Engine': { temperature: 90 }, 'Battery': { voltage: 14.4 }, 'Navigation': { signal: 'Strong' },
      'Infotainment': { media: 'Starlight Cruiser - Galaxy Funk' },
      'Handling': { suspensionMode: 'Comfort', tractionControl: 'Enabled' },
    };
  });

  // Content Libraries
  const [evoLibrary, setEvoLibrary] = useState<EvoLibrary | null>(null);
  const [commandToInject, setCommandToInject] = useState<string | null>(null);
  const [lastBroadcast, setLastBroadcast] = useState<BroadcastMessage | null>(null);
  const [savedModules, setSavedModules] = useState<SavedModule[]>([]);
  const [customCommands, setCustomCommands] = useState<CustomCommand[]>([]);
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [projectBlueprints, setProjectBlueprints] = useState<ProjectBlueprint[]>([]);
  const [knowledgeBaseSize, setKnowledgeBaseSize] = useState<number>(0);
  const [networkProjects, setNetworkProjects] = useState<NetworkProject[]>([]);
  
  // External Device State
  const [deviceLinkStatus, setDeviceLinkStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [linkedDevice, setLinkedDevice] = useState<any | null>(null);

  // Initial Data Loading
  useEffect(() => {
    fetch('./evo.json').then(r => r.json()).then(setEvoLibrary).catch(console.error);
    
    // Restore or Initialize Session
    const restoredSession = loadSessionFromStorage();
    setSession(restoredSession || {
      id: uuidv4(),
      mode: 'aetheros',
      messages: [{ 
        sender: 'model', 
        content: "The stage is set. Silence in the pit... The Aether Maestro has arrived. All systems are harmonized. How shall we conduct the squad today?", 
        timestamp: new Date() 
      }],
      chat: startChatSession(SYSTEM_INSTRUCTIONS.aetheros, []),
      name: 'AetherOS',
    });

    // Restore Collections
    setSavedModules(JSON.parse(localStorage.getItem(MODULES_KEY) || '[]').map((m:any) => ({...m, timestamp: new Date(m.timestamp)})));
    setCustomCommands(JSON.parse(localStorage.getItem(COMMANDS_KEY) || '[]').map((c:any) => ({...c, timestamp: new Date(c.timestamp)})));
    setPinnedItems(JSON.parse(localStorage.getItem(PINS_KEY) || '[]'));
    setArchives(JSON.parse(localStorage.getItem(ARCHIVES_KEY) || '[]').map((a:any) => ({...a, timestamp: new Date(a.timestamp)})));
    setProjectBlueprints(JSON.parse(localStorage.getItem(BLUEPRINTS_KEY) || '[]').map((b:any) => ({...b, timestamp: new Date(b.timestamp)})));
    setKnowledgeBaseSize(parseInt(localStorage.getItem(KNOWLEDGE_BASE_KEY) || '0', 10));
    
    // Restore Network Projects
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    if (savedProjects) {
        setNetworkProjects(JSON.parse(savedProjects).map((p: any) => ({ ...p, timestamp: new Date(p.timestamp) })));
    } else {
        setNetworkProjects([
            { id: '1', title: 'GATT_Forensic_Sensor', description: 'Real-time telemetry via custom GATT service. 128-bit UUID conduction.', miseryScore: 92, crazyLevel: 9, status: 'BUILDING', isWisdomHarmonized: true, timestamp: new Date(), assetType: 'BLUETOOTH', tasks: [{ id: 't1', text: 'Define 128-bit Base UUID', completed: true }, { id: 't2', text: 'Implement Notify on Stress Characteristic', completed: false }] },
            { id: '2', title: 'RTLS_Visual_Pulse', description: 'Dashboard showing asset coordinates with dynamic label updating. Low latency drift.', miseryScore: 48, crazyLevel: 7, status: 'IDEATING', isWisdomHarmonized: false, timestamp: new Date(), assetType: 'RTLS', tasks: [{ id: 't3', text: 'Map XYZ Coordinate Plane', completed: false }] },
            { id: '3', title: 'GAP_Advertising_Maestro', description: 'Periodic advertising with PAwR encrypted data packets.', miseryScore: 99, crazyLevel: 5, status: 'DONE', isWisdomHarmonized: true, timestamp: new Date(), assetType: 'BLUETOOTH', tasks: [{ id: 't4', text: 'Setup PAwR timing parameters', completed: true }] },
        ]);
    }
  }, []);

  // Persistent State Sync Effects
  useEffect(() => { saveSessionToStorage(session); }, [session]);
  useEffect(() => { localStorage.setItem(MODULES_KEY, JSON.stringify(savedModules)); }, [savedModules]);
  useEffect(() => { localStorage.setItem(COMMANDS_KEY, JSON.stringify(customCommands)); }, [customCommands]);
  useEffect(() => { localStorage.setItem(PINS_KEY, JSON.stringify(pinnedItems)); }, [pinnedItems]);
  useEffect(() => { localStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives)); }, [archives]);
  useEffect(() => { localStorage.setItem(BLUEPRINTS_KEY, JSON.stringify(projectBlueprints)); }, [projectBlueprints]);
  useEffect(() => { localStorage.setItem(KNOWLEDGE_BASE_KEY, knowledgeBaseSize.toString()); }, [knowledgeBaseSize]);
  useEffect(() => { localStorage.setItem(PROJECTS_KEY, JSON.stringify(networkProjects)); }, [networkProjects]);
  useEffect(() => { localStorage.setItem(VIEW_KEY, currentView); }, [currentView]);
  useEffect(() => { localStorage.setItem(STATUS_KEY, JSON.stringify(systemStatus)); }, [systemStatus]);
  useEffect(() => { localStorage.setItem(DETAILS_KEY, JSON.stringify(systemDetails)); }, [systemDetails]);
  
  // Sync Hereditary Dates
  useEffect(() => { localStorage.setItem(START_DATE_KEY, startDate); }, [startDate]);
  useEffect(() => { localStorage.setItem(END_DATE_KEY, endDate); }, [endDate]);

  const handleSendMessage = useCallback(async (text: string) => {
    if ((!text.trim() && attachedFiles.length === 0) || isLoading || !session) return;
    setInputText('');
    setIsLoading(true);
    const userMessage: ChatMessage = { sender: 'user', content: text, timestamp: new Date(), attachedFiles: attachedFiles.map(f => f.name) };
    const modelPlaceholder: ChatMessage = { sender: 'model', content: '', timestamp: new Date() };
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, userMessage, modelPlaceholder] } : null);
    try {
      let fullResponse = '';
      const stream = sendMessage(session.chat, text, attachedFiles);
      for await (const update of stream) {
        if (update.textChunk) {
            fullResponse += update.textChunk;
            setSession(prev => {
                if(!prev) return null;
                const newMsgs = [...prev.messages];
                newMsgs[newMsgs.length - 1].content = fullResponse;
                return { ...prev, messages: newMsgs };
            });
        }
      }
    } catch (error) {
      setSession(prev => {
        if(!prev) return null;
        const newMsgs = [...prev.messages];
        newMsgs[newMsgs.length - 1].content = "The Maestro signals an interruption. Retrying the symphony...";
        return { ...prev, messages: newMsgs };
      });
    } finally {
      setIsLoading(false);
      setAttachedFiles([]);
    }
  }, [isLoading, attachedFiles, session]);

  const renderMainView = () => {
    if (!session) return null;
    // Special check for fresh session (only one model message) to show Launchpad
    if (session.messages.length <= 1 && currentView === 'vault') return <Launchpad />;

    switch (currentView) {
        case 'covenant': return <NetworkCovenant />;
        case 'coding_network': return <CodingNetworkView projects={networkProjects} setProjects={setNetworkProjects} onNavigateToAgent={() => setCurrentView('code_agent')} />;
        case 'packaging_suite': return <PackagingSuite />;
        case 'launch_center': return <LaunchCenterView />;
        case 'network_sentinel': return <NetworkSentinel />;
        case 'integrity_network': return <IntegrityNetworkView />;
        case 'pseudorole_testing': return <PseudoRoleTesting />;
        case 'enlightenment_pool': return <EnlightenmentPool />;
        case 'nexus': return <WisdomNexus />;
        case 'zurich': return <ZurichBridge />;
        case 'bluetooth_bridge': return <BluetoothSpecBridge />;
        case 'diagnostics': return <DiagnosticsCenter onSetView={setCurrentView} />;
        case 'prompts': return evoLibrary ? <EvoPromptsView library={evoLibrary} onSelectPrompt={(p, c) => { if(c.id === 'communications') { setCommandToInject(p.text); setCurrentView('communications'); } else { setCurrentView('chat'); handleSendMessage(p.text); } }} /> : null;
        case 'workshop': return <SoftwareWorkshop onGenerate={async (logic) => {
            const res = await generateSoftwareModule(logic);
            if (res) setSavedModules(p => [...p, { id: uuidv4(), name: logic.slice(0, 30), timestamp: new Date(), ...res }]);
            return res;
        }} />;
        case 'communications': return <CommunicationsView injectedCommand={commandToInject} onCommandInjected={() => setCommandToInject(null)} onNewBroadcast={setLastBroadcast} />;
        case 'vault': return <OperationsVault onSetView={setCurrentView} systemStatus={systemStatus} evoLibrary={evoLibrary} lastBroadcast={lastBroadcast} lastMessage={session.messages[session.messages.length - 1]} savedModulesCount={savedModules.length} savedCommandsCount={customCommands.length} pinnedItems={pinnedItems} onTogglePin={p => setPinnedItems(prev => prev.find(x => x.referenceId === p.referenceId) ? prev.filter(x => x.referenceId !== p.referenceId) : [...prev, {...p, id: uuidv4()}])} onExecuteCommand={t => { setCurrentView('chat'); handleSendMessage(t); }} />;
        case 'module_bay': return <ModuleBay modules={savedModules} onDeleteModule={id => setSavedModules(p => p.filter(m => m.id !== id))} pinnedItems={pinnedItems} onTogglePin={p => setPinnedItems(prev => prev.find(x => x.referenceId === p.referenceId) ? prev.filter(x => x.referenceId !== p.referenceId) : [...prev, {...p, id: uuidv4()}])} />;
        case 'command_deck': return <CommandDeck commands={customCommands} onAddCommand={(t, tx) => setCustomCommands(p => [...p, {id: uuidv4(), title: t, text: tx, timestamp: new Date()}])} onDeleteCommand={id => setCustomCommands(p => p.filter(c => c.id !== id))} onExecuteCommand={t => { setCurrentView('chat'); handleSendMessage(t); }} pinnedItems={pinnedItems} onTogglePin={p => setPinnedItems(prev => prev.find(x => x.referenceId === p.referenceId) ? prev.filter(x => x.referenceId !== p.referenceId) : [...prev, {...p, id: uuidv4()}])} />;
        case 'strategic_overview': return <StrategicOverview />;
        case 'device_link': return <DeviceLinkView status={deviceLinkStatus} device={linkedDevice} onConnect={() => { setLinkedDevice({name: "Operator PADD", type: "Phone"}); setDeviceLinkStatus('connected'); }} onDisconnect={() => { setLinkedDevice(null); setDeviceLinkStatus('disconnected'); }} lastModule={savedModules[0]} />;
        case 'system_archives': return <SystemArchives archives={archives} onAddArchive={(t, tx) => setArchives(p => [...p, {id: uuidv4(), title: t, text: tx, timestamp: new Date()}])} onDeleteArchive={id => setArchives(p => p.filter(a => a.id !== id))} />;
        case 'forge': return <ForgeView blueprints={projectBlueprints} onAddBlueprint={(t, d, p: BlueprintPriority) => setProjectBlueprints(prev => [...prev, {id: uuidv4(), title: t, description: d, priority: p, status: 'Pending', timestamp: new Date()}])} onUpdateBlueprintStatus={(id, s) => setProjectBlueprints(p => p.map(b => b.id === id ? {...b, status: s} : b))} onDeleteBlueprint={id => setProjectBlueprints(p => p.filter(b => b.id !== id))} />;
        case 'singularity_engine': return <SingularityEngineView knowledgeBaseSize={knowledgeBaseSize} onConsumeKnowledge={s => setKnowledgeBaseSize(p => p + s)} onProjectize={p => {}} onGoToNetwork={() => setCurrentView('projects')} />;
        case 'up_north': return <UpNorthProtocol onSetView={setCurrentView} />;
        case 'code_agent': return <CodeAgentView />;
        case 'projects': return <ProjectNetwork projects={networkProjects} onDeleteProject={id => setNetworkProjects(prev => prev.filter(p => p.id !== id))} />;
        case 'chat':
        default:
            return (
              <>
                <ChatHeader 
                  isTtsEnabled={isTtsEnabled} 
                  onToggleTts={() => setIsTtsEnabled(p => !p)} 
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery}
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }}
                />
                <ChatView 
                  messages={session.messages} 
                  isLoading={isLoading} 
                  searchQuery={searchQuery} 
                  startDate={startDate} 
                  endDate={endDate} 
                  onInteractionSubmit={() => {}} 
                />
                <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} inputText={inputText} setInputText={setInputText} isRecording={isRecording} onToggleRecording={() => {}} attachedFiles={attachedFiles} onFilesChange={async (f: FileList | null) => { if(f) { const res = await Promise.all(Array.from(f).map(async (file: File) => ({ name: file.name, type: file.type, content: await new Promise<string>(r => { const rd = new FileReader(); rd.onload = () => r((rd.result as string).split(',')[1]); rd.readAsDataURL(file); }), scanStatus: isBinaryFile(file.name) ? 'unscanned' : undefined } as AttachedFile))); setAttachedFiles(res); } }} onRemoveFile={n => setAttachedFiles(p => p.filter(x => x.name !== n))} onScanFile={async (n) => { setAttachedFiles(p => p.map(x => x.name === n ? {...x, scanStatus: 'scanning'} : x)); const res = await scanBinaryFile(n); setAttachedFiles(p => p.map(x => x.name === n ? {...x, scanStatus: 'complete', scanResult: res} : x)); }} />
              </>
            );
    }
  };

  return (
    <div className="h-screen w-full font-sans text-gray-200">
      <div className="flex h-full overflow-hidden">
        <Sidebar systemStatus={systemStatus} systemDetails={systemDetails} currentView={currentView} onSetView={setCurrentView} />
        <main className="flex-1 h-full overflow-hidden relative bg-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(59,130,246,0.02)_0%,_transparent_50%)] pointer-events-none" />
          {renderMainView()}
        </main>
      </div>
    </div>
  );
};

export default App;