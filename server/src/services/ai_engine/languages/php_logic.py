import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ PHP Vulnerability & Style Patterns
    checks = [
        (r'\b\$_GET\b|\b\$_POST\b', "Direct global variable access.", "security", "medium", "Use a request object or sanitize inputs explicitly."),
        (r'base64_decode\(', "Common obfuscation method detected.", "security", "high", "Verify source to prevent remote code execution (RCE)."),
        (r'mysql_query\(', "Legacy MySQL extension used.", "security", "high", "Upgrade to PDO or MySQLi with prepared statements."),
        (r'eval\(', "Dangerous function usage.", "security", "high", "Never use eval() with untrusted user input."),
        (r'die\(|exit\(', "Hard exit in modular code.", "style", "low", "Throw an exception or return a response instead.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
