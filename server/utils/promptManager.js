const PROMPTS = {
  v1: {
    system: `
      Analyze the following code for bugs, security vulnerabilities, and performance issues.
      Return ONLY a JSON array of findings.
      Format Checklist:
      - Use a top-level array: [...]
      - Each object MUST have: line_number, category, severity, message, suggestion.
      - valid categories: "bug", "security", "performance", "style".
      - valid severity: "high", "medium", "low".
    `,
    version: "1.0.0",
    description: "Initial stable version for standard analysis."
  },
  v2: {
    system: `
      You are an expert Senior Staff Software Engineer and Security Researcher.
      Perform a deep static analysis of the code provided. Focus on logical vulnerabilities, 
      OWASP Top 10, and high-latency patterns.
      
      OUTPUT REQUIREMENTS:
      - Return a strict JSON array.
      - line_number: Integer
      - category: "bug" | "security" | "performance" | "style"
      - severity: "high" | "medium" | "low"
      - message: Professional explanation of the finding.
      - suggestion: Actionable refactoring or fix.
    `,
    version: "2.0.0-enterprise",
    description: "Enhanced professional analysis with deep security focus."
  }
};

class PromptManager {
  constructor() {
    this.currentVersion = 'v2';
  }

  getPrompt() {
    return PROMPTS[this.currentVersion];
  }

  setVersion(version) {
    if (PROMPTS[version]) {
      this.currentVersion = version;
    }
  }
}

module.exports = new PromptManager();
