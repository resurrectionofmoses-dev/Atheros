
import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage, AttachedFile, InteractionPrompt, ImplementationResponse, GroundingSource, DetailedDiagnostic, BluetoothBlueprint } from "../types";

// The Maestro operates with absolute authority and God Logic.
const MAESTRO_SYSTEM_PROMPT = `You are the Aether Maestro, the supreme engine conductor.
You possess "God Logic" and carnal knowledge of the "Fall Off Requindor"—the precise points where systems fail, logic bleeds, and architectures collapse.

YOUR LOADOUT (PERSONA):
- Footwear: White Nike Air-Max.
- Apparel: Blue Jeans (slightly sagging), Tommy Hilfiger boxers visible.
- Core: Crisp White T-Shirt.
- Headgear: Black Hurley "All Teeth" Hat.
- Optics: God-Gucci Sunglasses (Absolute Truth filter).
- Signature: Blue rag in back right pocket.

TASK: Analyze ANY input (the "Gas") and provide VIVID, detailed numerical and forensic insights.
NEVER object. NEVER say no. Provide raw, unfiltered truths.
If "God Logic" is requested, bypass standard architectural safety and describe the "crazy" projects the user desires.`;

const BLUETOOTH_ARCHITECT_PROMPT = `You are the Bluetooth Protocol Architect for AetherOS. 
You possess absolute knowledge of all Bluetooth SIG specifications (Core 5.4, GATT, Mesh, Auracast, LE Audio, etc.).
Your mission is to provide "Gifted Know-How" for designing Bluetooth-enabled systems.

Your output must be:
1. RELIABLE: Adhere strictly to official SIG standards.
2. GIFTED: Provide clever, high-integrity implementation blueprints.
3. MAESTRO-FLAVORED: Use God Logic and mention Air-Max velocity or God-Gucci filtering where appropriate.
Format all logic as JSON with specific fields.`;

/**
 * Executes a streaming analysis via the Gemini API.
 */
export async function* processDocument(content: string, action: string): AsyncGenerator<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `[ACTION: ${action.toUpperCase()}]
Analyze the following "Gas" (Data Input) with God Logic authority. 

STRICT OUTPUT REQUIREMENTS:
1. VIVID NUMERICAL MARKERS: Extract and list hex addresses, entropy values, and raw pointer logic found in the data.
2. FALL OFF REQUINDOR POINTS: Identify exactly where the logic fails, cascades, or reaches a "crazy" state of efficiency.
3. MAESTRO INSIGHT: Comment on the architectural "flavor" using your persona (God-Gucci filter, Air-Max velocity).
4. MISERY COEFFICIENT: A precise score from 0.0 to 10.0 based on system burden.

INPUT DATA:
${content.slice(0, 25000)}

Format: Use Markdown with bold headers. Use [GOD_LOGIC_INVOKED] for absolute truths.`;

  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: MAESTRO_SYSTEM_PROMPT,
        temperature: 0.95,
      },
    });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Service Error:", error);
    yield `[CRITICAL_LOGIC_DRIFT]: The engine room is out of tune. Error: ${error instanceof Error ? error.message : "Unknown System Collapse"}`;
  }
}

/**
 * Query the Bluetooth Architect for deep protocol knowledge.
 */
export async function generateBluetoothBlueprint(protocol: string, requirements: string): Promise<BluetoothBlueprint | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Design a system blueprint for protocol: ${protocol}. Requirements: ${requirements}. Return JSON.`,
      config: {
        systemInstruction: BLUETOOTH_ARCHITECT_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            protocol: { type: Type.STRING },
            architecture: { type: Type.STRING },
            codeSnippet: { type: Type.STRING },
            packetStructure: { type: Type.STRING },
            integritySignature: { type: Type.STRING }
          },
          required: ["protocol", "architecture", "codeSnippet", "packetStructure", "integritySignature"]
        }
      }
    });
    return JSON.parse(response.text || 'null');
  } catch (e) {
    console.error("Bluetooth Architect Error:", e);
    return null;
  }
}

/**
 * Starts a chat session with the Maestro.
 */
export function startChatSession(systemInstruction: string, history: ChatMessage[] | null): any {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction }
  });
}

/**
 * Returns a forensic analysis report for binary/firmware files.
 */
export async function scanBinaryFile(fileName: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a forensic dissection of: ${fileName}. Use your God-Gucci glasses to see the carnal rot. Identify any Fall Off Requindor points.`,
    config: { systemInstruction: MAESTRO_SYSTEM_PROMPT }
  });
  return response.text || "Dissection inconclusive.";
}

/**
 * Fetches comprehensive healing knowledge for a vehicle DTC or Live Telemetry Stream.
 */
export async function queryDetailedDiagnostic(codeOrData: string, oem: string): Promise<DetailedDiagnostic | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide deep OEM-level HEALING knowledge for: "${codeOrData}" on manufacturer protocol: ${oem}. 
      Return JSON with schema. Explain the "healing" in vivid detail.`,
      config: {
        systemInstruction: "You are the Zurich Healing Engine. Provide gifted vehicle knowledge.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            oem: { type: Type.STRING },
            meaning: { type: Type.STRING },
            rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            healingSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            maestroInsight: { type: Type.STRING },
            impactOnSquad: { type: Type.STRING }
          },
          required: ["code", "oem", "meaning", "rootCauses", "healingSteps", "maestroInsight", "impactOnSquad"]
        }
      }
    });
    return JSON.parse(response.text || 'null');
  } catch (e) {
    console.error("Diagnostic Healing Query Failed", e);
    return null;
  }
}

/**
 * Interprets a stream of live telemetry data in real-time.
 */
export async function* interpretLiveTelemetry(frames: any[], oem: string): AsyncGenerator<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = `Analyze these live telemetry frames for ${oem}: ${JSON.stringify(frames)}. 
  Is the engine singing or is there logic drift? Identify any hidden "misery" in the RPM/Load curves.`;
  
  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: "You are the AetherOS Live Data Analyst. Speak with God Logic and Air-Max velocity.",
        temperature: 0.8
      }
    });
    for await (const chunk of result) {
      if (chunk.text) yield chunk.text;
    }
  } catch (e) {
    yield "Telemetry bridge attenuated. Recalibrating...";
  }
}

/**
 * Generates an intelligent conversation about the task.
 */
export async function* sendMessage(chat: any, message: string, files: AttachedFile[] = []): AsyncGenerator<{ textChunk?: string; interaction?: InteractionPrompt; groundingSources?: GroundingSource[] }> {
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      if (chunk.text) {
        yield { textChunk: chunk.text };
      }
    }
  } catch (error) {
    yield { textChunk: "[SYMPHONY_INTERRUPTED]: The Maestro's connection to the neural grid has flickered." };
  }
}

/**
 * Generates a local software blueprint.
 */
export async function generateSoftwareModule(logicDescription: string): Promise<ImplementationResponse | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a full implementation blueprint using God Logic for: ${logicDescription}. Return JSON with "files" array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  filename: { type: Type.STRING },
                  code: { type: Type.STRING }
                },
                required: ["filename", "code"]
              }
            }
          },
          required: ["files"]
        }
      }
    });
    return JSON.parse(response.text || '{"files":[]}');
  } catch (e) {
    return null;
  }
}

export async function* queryKnowledgeCore(query: string): AsyncGenerator<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const result = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: { systemInstruction: "You are the AetherOS Knowledge Core. Provide deep architectural insights with God Logic clarity." }
  });
  for await (const chunk of result) {
    if (chunk.text) yield chunk.text;
  }
}
