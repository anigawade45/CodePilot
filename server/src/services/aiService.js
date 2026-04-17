const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const promptManager = require('../utils/promptManager');

// 📡 Providers Configuration
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const grok = process.env.XAI_API_KEY ? new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
}) : null;
const groq = process.env.GROQ_API_KEY ? new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
}) : null;

// 📊 Cost Tracking Constants (Per 1k tokens)
const COST_ESTIMATES = {
    gemini: 0.0001,
    grok: 0.005
};

const estimateTokens = (text) => Math.ceil(text.length / 4); // Standard approx

const SYSTEM_PROMPT = `
You are the "Sovereign Intelligence Lead" for the CodePilot platform.
Your objective is to provide high-fidelity, professional-grade code investigations.
You must analyze the code through the lens of a Senior Security Researcher and a Staff Systems Architect.

JSON Schema Output Required:
[
  {
    "line_number": number,
    "category": "bug" | "security" | "performance" | "style",
    "severity": "high" | "medium" | "low",
    "confidence": number (0.0 to 1.0),
    "message": string (Be technical and explain the structural impact),
    "suggestion": string (Provide specific refactoring or fix patterns)
  }
]

Strict Operational Constraints:
- NO conversational text or preambles.
- NO markdown code block wrappers around the JSON.
- If the risk is critical, elevate the 'severity' and explain the blast radius in 'message'.
- If the code is perfect, return [].
`;

// 🧹 Robust JSON Extraction Helper [SENIOR v10.0]
const extractJson = (text) => {
    if (!text) return [];

    // 🔍 AGGRESSIVE SCAN: Non-greedy capture of the first JSON array structure
    let sanitizedText = text;
    try {
        const jsonMatch = text.match(/\[\s*{[\s\S]*?}\s*\]/);
        if (jsonMatch) {
            sanitizedText = jsonMatch[0];
        } else {
            // Fallback: Try capturing a single object and wrap it
            const objMatch = text.match(/\{[\s\S]*?\}/);
            if (objMatch) sanitizedText = `[${objMatch[0]}]`;
        }

        // 🧹 CLEANING: Remove trailing commas and backslashes
        sanitizedText = sanitizedText
            .replace(/,\s*([\]\}])/g, '$1')
            .replace(/\\(?!["\\\/bfnrtu])/g, '\\\\')
            .trim();

        let issues = JSON.parse(sanitizedText);

        // 🧬 NORMALIZATION
        if (Array.isArray(issues)) return issues;
        if (issues.issues && Array.isArray(issues.issues)) return issues.issues;
        if (typeof issues === 'object') return [issues];

        return [];
    } catch (e) {
        console.warn("⚠️ [Signal Rupture] Recursive parsing failed. Intelligence signal is unreadable.");
        return [];
    }
};

// 🤖 Provider Methods
const providers = {
    gemini: async (prompt) => {
        if (!genAI) throw new Error("Gemini Key Missing");
        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    },
    grok: async (prompt) => {
        if (!grok) throw new Error("Grok Key Missing");
        const response = await grok.chat.completions.create({
            model: "grok-3-mini",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    },
    groq: async (prompt) => {
        if (!groq) throw new Error("Groq Key Missing");
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        return response.choices[0].message.content;
    },
    sovereign: async (code, language) => {
        const { spawnSync } = require('child_process');
        const path = require('path');

        console.log(`🛡️ [Sovereign Failover] Engaging Local Python Intelligence for ${language}...`);

        const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
        const scriptPath = path.join(__dirname, 'ai_engine', 'engine.py');

        const result = spawnSync(pythonPath, [scriptPath, language, code], { encoding: 'utf-8' });

        if (result.error || result.status !== 0) {
            console.error("❌ Sovereign Engine Failure:", result.error || result.stderr);
            return null;
        }

        return result.stdout;
    },
    local_neural_node: async (prompt, config = {}) => {
        // 🧠 TIER 3: Trained Local Model (Ollama/Llama)
        const url = config.endpoint || process.env.LOCAL_MODEL_URL || "http://localhost:11434/api/generate";
        const modelName = config.model || process.env.LOCAL_MODEL_NAME || "codepilot-brain:latest";
        
        console.log(`🦾 [Neural Ingress] Attempting local audit via ${modelName} at ${url}...`);
        
        try {
            const axios = require('axios');
            const res = await axios.post(url, {
                model: modelName,
                prompt: prompt,
                stream: false,
                format: "json"
            }, { timeout: 300000 }); // 5 minute timeout for local hardware
            
            console.log(`✅ [Neural Ingress] Local audit completed via ${modelName}`);
            return res.data.response || res.data.message?.content;
        } catch (e) {
            console.error(`❌ [Neural Failure] Local cluster is unresponsive: ${e.message}`);
            throw new Error(`Local Neural Node Offline: ${e.message}`);
        }
    }
};

/**
 * 🤖 HIERARCHICAL ANALYSIS ENGINE (CASCADING FAILOVER)
 * Priority Flow:
 * 1. User Provided API (BYOK)
 * 2. System Default (.env)
 * 3. Trained Local Neural Node (Ollama/Llama)
 * 4. Sovereign Python AST Engine (Last Resort)
 */
const analyzeCode = async (code, language, config = {}) => {
    const startTime = Date.now();
    const lines = code.split('\n');
    if (lines.length > 800) throw new Error("File too large. Over 800 lines exceeds safe context.");

    const activePrompt = promptManager.getPrompt();
    const fullPrompt = `${SYSTEM_PROMPT}\n\nLanguage: ${language}\n\nCode:\n${code}\n\nInstructions: ${activePrompt.system}`;

    let combinedIssues = [];
    let usedProvider = 'none';

    // 🌊 STAGE 1 & 2: Cloud Cascading (BYOK -> System -> System Pool Fallback)
    const cloudAttempt = async () => {
        const requestedProvider = config.provider || 'gemini';

        // (A) Check USER provided keys first for the requested provider
        if (config.apiKey && providers[requestedProvider]) {
            console.log(`🔑 [BYOK] Attempting User-Provided ${requestedProvider} Cluster...`);

            let endpoint = config.endpoint;
            if (!endpoint) {
                if (requestedProvider === 'grok') endpoint = "https://api.x.ai/v1";
                if (requestedProvider === 'groq') endpoint = "https://api.groq.com/openai/v1";
            }

            try {
                if (requestedProvider === 'gemini') {
                    const tempGenAI = new GoogleGenerativeAI(config.apiKey);
                    const model = tempGenAI.getGenerativeModel({
                        model: config.model || "gemini-3.1-flash-lite-preview",
                        generationConfig: { responseMimeType: "application/json" }
                    });
                    const result = await model.generateContent(fullPrompt);
                    return { issues: extractJson(result.response.text()), name: `user-${requestedProvider}` };
                } else if (requestedProvider === 'local') {
                    const localRaw = await providers.local_neural_node(fullPrompt, config);
                    return { issues: extractJson(localRaw), name: `user-local` };
                } else {
                    const tempAI = new OpenAI({ apiKey: config.apiKey, baseURL: endpoint || undefined });
                    const response = await tempAI.chat.completions.create({
                        model: config.model || (requestedProvider === 'grok' ? "grok-3-mini" : "llama-3.3-70b-versatile"),
                        messages: [{ role: "user", content: fullPrompt }],
                        response_format: { type: "json_object" }
                    });
                    return { issues: extractJson(response.choices[0].message.content), name: `user-${requestedProvider}` };
                }
            } catch (e) {
                console.warn(`⚠️ [BYOK Failed] User key invalid or rate-limited: ${e.message}`);
            }
        }

        // (B) Check SYSTEM pool for the requested provider then ALL OTHER available providers
        const systemPool = Object.keys(providers).filter(p => !['sovereign', 'local_neural_node'].includes(p));

        // Reorder pool to try requested first, then others
        const sortedPool = [requestedProvider, ...systemPool.filter(p => p !== requestedProvider)];

        for (const p of sortedPool) {
            if (!providers[p]) continue;

            console.log(`📡 [SYSTEM CLUSTER] Attempting ${p} Node...`);
            try {
                const raw = await providers[p](fullPrompt);
                const issues = extractJson(raw);
                if (issues.length > 0) {
                    return { issues, name: `system-${p}` };
                }
            } catch (e) {
                console.warn(`⚠️ [SYSTEM Node Failed] ${p} node offline or restricted: ${e.message}`);
            }
        }

        return null;
    };

    try {
        const cloudResult = await cloudAttempt();

        if (cloudResult && cloudResult.issues.length > 0) {
            combinedIssues = cloudResult.issues.map(i => ({ ...i, source: 'cloud-ai' }));
            usedProvider = cloudResult.name;
        } else {
            // 🧠 STAGE 3: Trained Local Model
            console.log("🦾 [NEURAL FAILOVER] Cloud exhausted. Attempting Local Neural Node...");
            try {
                const localRaw = await providers.local_neural_node(fullPrompt);
                const localIssues = extractJson(localRaw);
                if (localIssues.length > 0) {
                    combinedIssues = localIssues.map(i => ({ ...i, source: 'local-neural' }));
                    usedProvider = 'local-neural-node';
                }
            } catch (e) {
                console.warn(`⚠️ [NEURAL Failed] Local model offline: ${e.message}`);
            }
        }

        // 🛡️ STAGE 4: Sovereign Python Engine (The Safety Net)
        if (combinedIssues.length === 0) {
            const sovRaw = await providers.sovereign(code, language);
            const sovIssues = extractJson(sovRaw);
            combinedIssues = (sovIssues || []).map(i => ({ ...i, source: 'sovereign' }));
            usedProvider = 'sovereign-ast';
        }

        const endTime = Date.now();
        return {
            issues: combinedIssues.sort((a, b) => a.line_number - b.line_number),
            meta: {
                provider: usedProvider,
                latencyMs: endTime - startTime,
                failoverActive: combinedIssues.some(i => i.source === 'sovereign'),
                components: [
                    { name: usedProvider, status: 'active' }
                ]
            }
        };

    } catch (error) {
        console.error("🔥🔥 [SYSTEM CRASH] Critical cascading failure:", error.message);
        throw new Error(`Intelligence Link Failure: ${error.message}`);
    }
};

module.exports = { analyzeCode };
