
import { Chat } from '@google/genai';

export type Mode = 'aetheros';
export type AccessTier = 'USER' | 'ROOT';

export type MainView = 'chat' | 'diagnostics' | 'prompts' | 'workshop' | 'communications' | 'vault' | 'module_bay' | 'command_deck' | 'strategic_overview' | 'device_link' | 'system_archives' | 'forge' | 'singularity_engine' | 'up_north' | 'code_agent' | 'projects' | 'nexus' | 'zurich' | 'enlightenment_pool' | 'pseudorole_testing' | 'integrity_network' | 'launch_center' | 'network_sentinel' | 'bluetooth_bridge' | 'packaging_suite' | 'coding_network' | 'covenant';

export type VehicleSystem = 'Engine' | 'Battery' | 'Navigation' | 'Infotainment' | 'Handling';
export type SystemState = 'OK' | 'Warning' | 'Error';
export type SystemStatus = Record<VehicleSystem, SystemState>;

export type SystemDetails = Record<VehicleSystem, any>;

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface NetworkProject {
  id: string;
  title: string;
  description: string;
  miseryScore: number;
  crazyLevel: number;
  status: 'IDEATING' | 'BUILDING' | 'DONE';
  isWisdomHarmonized: boolean;
  timestamp: Date;
  tasks: ProjectTask[];
  knowHow?: string;
  assetType?: 'BLUETOOTH' | 'RTLS' | 'KERNEL' | 'INTERFACE';
}

export interface DeviceCompatibility {
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchEnabled: boolean;
  screenRes: string;
  pwaSupport: boolean;
  batteryApi: boolean;
  bluetoothApi: boolean;
  canEscalate: boolean;
}

export interface DetailedDiagnostic {
  code: string;
  oem: string;
  meaning: string;
  rootCauses: string[];
  healingSteps: string[];
  maestroInsight: string;
  impactOnSquad: string;
}

export interface DiagnosticTroubleCode {
  code: string;
  description: string;
  system: VehicleSystem;
  severity: SystemState;
  signature?: string;
}

export interface BluetoothProtocol {
  id: string;
  name: string;
  category: 'Core' | 'GATT' | 'Mesh' | 'Auracast' | 'Traditional';
  description: string;
  commonUUIDs: string[];
  designConstraints: string[];
}

export interface BluetoothBlueprint {
  protocol: string;
  architecture: string;
  codeSnippet: string;
  packetStructure: string;
  integritySignature: string;
}

export interface LiveTelemetryFrame {
  timestamp: number;
  rpm: number;
  coolantTemp: number;
  fuelPressure: number;
  voltage: number;
  load: number;
  throttlePos: number;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface InteractionPrompt {
  prompt: string;
  submittedAnswer?: string;
}

export interface ChatMessage {
  sender: 'user' | 'model';
  content: string;
  timestamp: Date;
  parentTimestamp?: Date;
  attachedFiles?: string[];
  groundingSources?: GroundingSource[];
  interactionPrompt?: InteractionPrompt;
}

export interface AttachedFile {
  name: string;
  type: string;
  content: string; 
  scanStatus?: 'unscanned' | 'scanning' | 'complete';
  scanResult?: string;
}

export interface ShadowInfoCard {
  signature: string;
  flowRole: string;
  dependency: string;
  boundaries: { havLimit: number; noiseLimit: number; };
  logicBlueprint: string;
}

export interface ImplementationFile {
  filename: string;
  code: string;
}

export interface ImplementationResponse {
  files: ImplementationFile[];
}

export interface SavedModule extends ImplementationResponse {
  id: string;
  name: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  mode: Mode;
  messages: ChatMessage[];
  chat: Chat;
  name: string;
}

export interface EvoPrompt {
  title: string;
  text: string;
}

export interface EvoCategory {
  id: string;
  name: string;
  description?: string;
  prompts: EvoPrompt[];
}

export interface EvoLibrary {
  library: string;
  version: string;
  categories: EvoCategory[];
}

export interface BroadcastMessage {
  source: string;
  text: string;
  timestamp: Date;
  color: string;
}

export type PinType = 'module' | 'command';

export interface CustomCommand {
  id: string;
  title: string;
  text: string;
  timestamp: Date;
}

export interface PinnedItem {
  id: string;
  referenceId: string;
  type: PinType;
  title: string;
  content?: string;
}

export interface ArchiveEntry {
  id: string;
  title: string;
  text: string;
  timestamp: Date;
  isDirective?: boolean;
}

export type BlueprintStatus = 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
export type BlueprintPriority = 'Low' | 'Medium' | 'High' | 'Critical'; // New type

export interface ProjectBlueprint {
  id: string;
  title: string;
  description: string;
  status: BlueprintStatus;
  priority: BlueprintPriority; // Added priority field
  timestamp: Date;
}

export type DeviceLinkStatus = 'disconnected' | 'connecting' | 'connected';
export interface LinkedDevice {
  name: string;
  type: string;
}

export interface AuditReport {
  fuelBurned: { electricity: number; gas: number };
  treasuryCost: number;
  integrityScore: number;
  nonce: number;
  semanticDrift: number;
  effectivenessScore: number;
}

export interface TelemetryState {
  velocity: 'Liquid' | 'Rigid';
  velocityValue: number;
  miningDifficulty: number;
  opaqueZones: string[];
  collisionPoints: string[];
  hav: number;
  noise: number;
  fusionConfidence: number;
  effectiveness: number;
  uptime: number;
}

export type KnowledgeTier = 'UNIVERSAL' | 'OBFUSCATED' | 'PROHIBITED';

export interface KnowledgeFragment {
  id: string;
  label: string;
  description: string;
  isVerified: boolean;
  integrityThreshold: number;
  tier: KnowledgeTier;
}

export interface HeuristicConstraint {
  id: string;
  label: string;
  description: string;
  tier: KnowledgeTier;
  miseryRequirement: number;
  isUnlocked: boolean;
}

export interface AppStoreMetadata {
  appName: string;
  description: string;
  keywords: string[];
  dunsNumber: string;
  ageRating: string;
  primaryCategory: string;
}

export interface CompliancePosture {
  gdprActive: boolean;
  ccpaActive: boolean;
  gpcHonored: boolean;
  ageVerificationStatus: 'READY' | 'PENDING' | 'REQUIRED';
}

export interface NeutralizationPlan {
  plan: string[];
  signature: string;
  statusUpdate: string;
}

export interface FallOffPrediction {
  predictionSummary: string;
  riskLevel: number;
  failurePoints: string[];
  conductionStrategies: string[];
}

export interface ProtocolAdaptation {
  adaptationDirectives: string[];
  predictedStability: number;
  revisedPacketStructure?: string;
}

export interface NetworkNode {
    id: string;
    ip: string;
    status: 'ACTIVE' | 'VULNERABLE' | 'SHADOW' | 'NEUTRALIZING' | 'SECURED' | 'FAILED';
    label: string;
    threatLevel: number;
    neutralizationPlan?: NeutralizationPlan;
}
