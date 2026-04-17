import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ Shell Scripting (Bash/Zsh) Security
    checks = [
        (r'curl\s+.*\s*\|\s*bash', "Pipe to bash detected.", "security", "high", "Never pipe remote scripts directly to shell; audit the script first."),
        (r'chmod\s+777', "Excessive file permissions.", "security", "high", "Restrict permissions to the minimum required (e.g., 755 or 644)."),
        (r'rm\s+-rf\s+/', "Dangerous destructive command.", "security", "high", "Critical: Possible attempt to wipe filesystem."),
        (r'password=.*', "Hardcoded credentials in script.", "security", "medium", "Use environment variables or a secret manager."),
        (r'set\s+-e', "Missing error handling pragma.", "style", "low", "Consider using 'set -e' or 'set -uo pipefail' for safer scripts.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
