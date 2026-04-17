const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const promptManager = require('../utils/promptManager');

// 📡 Providers Configuration
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const grok = process.env.XAI_API_KEY ? new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
}) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

// 📊 Cost Tracking Constants (Per 1k tokens)
const COST_ESTIMATES = {
    gemini: 0.0001,
    openai: 0.01,
    claude: 0.015,
    grok: 0.005
};

const estimateTokens = (text) => Math.ceil(text.length / 4); // Standard approx

const SYSTEM_PROMPT = `
You are a high-precision AI Code Review API.
Your task is to analyze code and return ONLY a valid JSON array of findings.

JSON Schema:
[
  {
    "line_number": number,
    "category": "bug" | "security" | "performance" | "style",
    "severity": "high" | "medium" | "low",
    "confidence": number (0.0 to 1.0),
    "message": string,
    "suggestion": string
  }
]

Strict Rules:
- NO conversational text.
- NO markdown backticks.
- NO intro or outro.
- If no issues found, return [].
- If language is unclear, use best judgment.
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
        return []; // 🛡️ Resilience: Return empty array instead of null to prevent system crash
    }
};

// 🤖 Provider Methods
const providers = {
    gemini: async (prompt) => {
        if (!genAI) throw new Error("Gemini Key Missing");
        // Enforce JSON Mode for Gemini 2.0
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
    },
    openai: async (prompt) => {
        if (!openai) throw new Error("OpenAI Key Missing");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        return response.choices[0].message.content;
    },
    grok: async (prompt) => {
        if (!grok) throw new Error("Grok Key Missing");
        const response = await grok.chat.completions.create({
            model: "grok-beta",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    },
    claude: async (prompt) => {
        if (!anthropic) throw new Error("Anthropic Key Missing");
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 2048,
            messages: [{ role: "user", content: prompt }],
        });
        return message.content[0].text;
    },
    failover_mock: async (prompt) => {
        // 🛡️ Failover Protocol: High-Fidelity Mock response for system stability
        return JSON.stringify([
            { line_number: 1, category: "style", severity: "low", confidence: 0.5, message: "System operating in failover mode. Results may be limited.", suggestion: "Check API keys or Local LLM status for full analysis." }
        ]);
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
    }
};

/**
 * 🤖 UNIVERSAL ANALYSIS ENGINE (BYOK SUPPORTED)
 * @param {string} code - Source code to analyze
 * @param {string} language - Target language
 * @param {Object} [config] - Optional overrides (provider, model, apiKey)
 */
const analyzeCode = async (code, language, config = {}) => {
    const lines = code.split('\n');
    if (lines.length > 800) throw new Error("File too large. Over 800 lines exceeds safe context.");

    const activePrompt = promptManager.getPrompt();
    
    // 🧠 LANGUAGE-AWARE TUNING
    const languageHints = {
        javascript: "Focus on async/await race conditions, closures, and React re-render loops.",
        python: "Focus on mutability, list comprehensions, and PEP8 semantic violations.",
        java: "Focus on Thread Safety, NullPointer risks, and Stream API efficiency.",
        typescript: "Focus on 'any' type abuse and interface strictness."
    };
    
    const hint = languageHints[language.toLowerCase()] || "General logical consistency and security.";
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nExpertise Overlay: ${hint}\nAdditional Context: ${activePrompt.system}`;
    
    // 🚦 ROUTING LOGIC: LOCAL FIRST = FREE + FAST
    const sequence = config.provider
        ? [config.provider]
        : ['local', 'gemini', 'openai', 'claude', 'grok', 'sovereign']; 

    let lastError = null;

    for (const providerId of sequence) {
        try {
            console.log(`📡 [Pulse Link] Engaging ${providerId} ${config.model ? `(${config.model})` : ''} | Mode: ${config.apiKey ? 'BYOK' : 'SERVER_POOL'}`);

            const userPrompt = `Language: ${language}\nCode:\n${code}`;
            let rawResponse;
            const startTime = Date.now();

            // 🛠️ DYNAMIC INSTANTIATION (For BYOK & Local)
            if (providerId === 'gemini') {
                const runner = config.apiKey ? new GoogleGenerativeAI(config.apiKey) : genAI;
                if (!runner) throw new Error("Gemini Key Missing");
                const model = runner.getGenerativeModel({
                    model: config.model || "gemini-2.0-flash",
                    generationConfig: { responseMimeType: "application/json" },
                    systemInstruction: fullSystemPrompt
                });
                const result = await model.generateContent(userPrompt);
                rawResponse = result.response.text();
            }
            else if (providerId === 'openai' || providerId === 'grok') {
                const base = providerId === 'grok' ? "https://api.x.ai/v1" : undefined;
                const runner = config.apiKey ? new OpenAI({ apiKey: config.apiKey, baseURL: base }) : (providerId === 'grok' ? grok : openai);
                if (!runner) throw new Error(`${providerId} Key Missing`);
                const response = await runner.chat.completions.create({
                    model: config.model || (providerId === 'grok' ? "grok-beta" : "gpt-4o-mini"),
                    messages: [
                        { role: "system", content: fullSystemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1,
                    response_format: providerId === 'openai' ? { type: "json_object" } : undefined
                });
                rawResponse = response.choices[0].message.content;
            }
            else if (providerId === 'claude') {
                const runner = config.apiKey ? new Anthropic({ apiKey: config.apiKey }) : anthropic;
                if (!runner) throw new Error("Anthropic Key Missing");
                const message = await runner.messages.create({
                    model: config.model || "claude-3-5-sonnet-20240620",
                    max_tokens: 2048,
                    system: fullSystemPrompt,
                    messages: [{ role: "user", content: userPrompt }],
                });
                rawResponse = message.content[0].text;
            }
            else if (providerId === 'local') {
                // 🏠 [PRO UPGRADE] STEERING LLM FOR OLLAMA
                const endpoint = config.endpoint || "http://localhost:11434/api/generate";
                const axios = require('axios');

                const possibleModels = [config.model, "codellama", "llama3", "mistral"].filter(Boolean);
                let modelUsed = "unknown";

                const localStrongPrompt = `
You are a strict Code Review API.
Return ONLY a valid JSON array.

[Schema]
[{ "line_number": n, "category": "bug"|"security"|"performance"|"style", "severity": "high"|"medium"|"low", "confidence": float, "message": "...", "suggestion": "..." }]

[Instruction]
- No markdown.
- No intro text.
- If clean, return [].
- Break format = system failure.

${userPrompt}`;

                for (const mName of possibleModels) {
                    try {
                        console.log(`📡 [Sovereign Connect] Targeting Local Model: ${mName}...`);

                        const response = await axios.post(endpoint, {
                            model: mName,
                            prompt: localStrongPrompt,
                            stream: false,
                            options: { temperature: 0.1, num_ctx: 4096 }
                        }, { timeout: 15000 }); // ⚡ Snappier UX
                        
                        rawResponse = response.data.response;
                        console.log(`🧬 [Signal Detected] [${mName}]: Length ${rawResponse?.length || 0}`);

                        modelUsed = mName;
                        if (rawResponse && (rawResponse.includes('[') || rawResponse.includes('{'))) break;
                    } catch (e) {
                        console.warn(`⚠️ [Model Skip] ${mName} error:`, e.message);
                        continue;
                    }
                }

                if (!rawResponse || (!rawResponse.includes('[') && !rawResponse.includes('{'))) {
                    console.log("📡 [Sovereign Pivot] Local LLM signal is unreadable. Engaging Python cluster...");
                    rawResponse = await providers.sovereign(code, language);
                }
            }
            else if (providerId === 'sovereign') {
                rawResponse = await providers.sovereign(code, language);
                if (!rawResponse) throw new Error("Local analyzer returned empty result.");
            }
            else {
                rawResponse = await providers.failover_mock(userPrompt);
            }

            const endTime = Date.now();
            const results = extractJson(rawResponse);

            // 🛡️ SEMANTIC FAILOVER: Loop check
            if (!results || results.length === 0) {
                if (providerId !== 'local' && providerId !== 'sovereign') {
                    throw new Error("Semantic Rupture: Provider returned no valid findings.");
                }
            }

            // 🧠 INTELLIGENT DEDUPLICATION & OVERRIDES
            const uniqueIssues = [];
            const seen = new Set();

            for (let issue of results) {
                // 💥 SECURITY OVERRIDE: Zero-tolerance for low-severity security flags
                if (issue.category === "security" && issue.severity === "low") {
                    issue.severity = "high";
                }

                // 🫧 DEDUPLICATION
                const key = `${issue.line_number}-${issue.message.slice(0, 30)}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueIssues.push(issue);
                }
            }

            // 📊 Metrics Calculation
            const inputTokens = estimateTokens(userPrompt + fullSystemPrompt);
            const outputTokens = estimateTokens(rawResponse);
            const totalTokens = inputTokens + outputTokens;
            const estimatedCost = (totalTokens / 1000) * (COST_ESTIMATES[providerId] || 0.001);

            return {
                issues: uniqueIssues,
                meta: {
                    provider: providerId,
                    model: config.model || (providerId === 'openai' ? 'gpt-4o-mini' : providerId),
                    mode: config.apiKey ? 'BYOK' : 'SERVER_POOL',
                    promptVersion: activePrompt.version,
                    usage: {
                        tokens: totalTokens,
                        estimatedCost: config.apiKey ? 0 : estimatedCost, // $0 if user paid themselves
                        latencyMs: endTime - startTime
                    }
                }
            };
        } catch (error) {
            console.warn(`⚠️ [Provider Bypassed] ${providerId} logic failed:`, error.message);
            lastError = error;
            if (config.provider) break; // Don't failover if user specifically chose this one
            continue;
        }
    }

    throw new Error(`Critical: Intelligence link failed. ${lastError?.message || 'Unknown error'}`);
};

module.exports = { analyzeCode };
