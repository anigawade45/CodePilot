import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ Ruby & Rails Patterns
    checks = [
        (r'\.send\(', "Dynamic method invocation with .send.", "security", "medium", "Use .public_send or define a whitelist of allowed methods."),
        (r'self\.all', "Potential N+1 query source.", "performance", "high", "Ensure eager loading (includes, joins) is used in controllers."),
        (r'eval\s', "Dangerous use of eval detected.", "security", "high", "Avoid eval with user input; use safer meta-programming."),
        (r'attr_accessor\s+:password', "Plaintext password persistence threat.", "security", "high", "Use has_secure_password (bcrypt) for authentication storage."),
        (r'\.map\.flatten', "Inefficient nested mapping.", "performance", "low", "Use .flat_map for better memory performance.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
