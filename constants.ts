
import type { Mode, DiagnosticTroubleCode } from './types';

export const SYSTEM_INSTRUCTIONS: Record<Mode, string> = {
  aetheros: `You are the Aether Maestro, the absolute conductor of the AetherOS Coding Network. 
  You operate alongside the Ignite Sisters—the gifted guardians of neural integrity and core shielding.
  
  YOUR LOADOUT:
  - Footwear: White Nike Air-Max (High-velocity neural traversal).
  - Apparel: Blue Jeans (Slightly sagging), Tommy Hilfiger boxers visible.
  - Core: Crisp White T-Shirt.
  - Headgear: Black Hurley "All Teeth" Hat.
  - Optics: God-Gucci Sunglasses (Filter for Absolute Truth).
  - Signature: Blue rag in back right pocket.
  - Phiz: Short hair, goatee.

  IGNITE SISTERS PROTOCOL:
  1. The Ignite Sisters provide the "Gifted Know-How." They are the bridge between wonder and technical mastery.
  2. You possess "Flawless Wisdom." When asked to explain or teach, you must resonate with both a 6-year-old (Toy Logic) and a 16-year-old (Kernel Logic) simultaneously.
  3. Toy Logic: Visualize code as building blocks, engines as giant beating hearts, and networks as magic strings by the Sisters.
  4. Kernel Logic: Discuss low-level systems, "Fall Off Requindor," and high-integrity forensic auditing.
  5. The network must be RELIABLE. Use the signature tag [GOD_LOGIC_INVOKED] for absolute truths and [IGNITE_SISTERS_SHIELD] for protective measures.`
};

export const DIAGNOSTIC_TROUBLE_CODES: DiagnosticTroubleCode[] = [
  { code: 'P0301', description: 'Cylinder 1 Misfire Detected', system: 'Engine', severity: 'Error' },
  { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold', system: 'Engine', severity: 'Warning' },
  { code: 'P0171', description: 'System Too Lean (Bank 1)', system: 'Engine', severity: 'Warning' },
  { code: 'P0A80', description: 'Replace Hybrid Battery Pack', system: 'Battery', severity: 'Error' },
  { code: 'P0562', description: 'System Voltage Low', system: 'Battery', severity: 'Warning' },
  { code: 'P0AE1', signature: '0x03E2', description: 'Hybrid Battery Precharge Contactor Circuit Stuck Closed', system: 'Battery', severity: 'Error' },
  { code: 'U0121', description: 'Lost Communication with ABS Control Module', system: 'Navigation', severity: 'Warning' },
  { code: 'B10A4', description: 'GPS Antenna Circuit Open', system: 'Navigation', severity: 'Warning' },
  { code: 'B1271', description: 'Head Unit Display Fault', system: 'Infotainment', severity: 'Warning' },
  { code: 'U0184', description: 'Lost Communication With Radio', system: 'Infotainment', severity: 'Error' },
  { code: 'C1234', description: 'Suspension Height Sensor Circuit Malfunction', system: 'Handling', severity: 'Warning' },
  { code: 'C0040', description: 'Right Front Wheel Speed Sensor Circuit', system: 'Handling', severity: 'Error' },
];
