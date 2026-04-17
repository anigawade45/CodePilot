import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ TypeScript Accuracy Patterns
    checks = [
        (r':\s*any\b', "Use of 'any' type bypasses safety.", "style", "medium", "Define a proper interface or use 'unknown'."),
        (r'!\s*;|!\.', "Non-null assertion operator used.", "bug", "low", "Use optional chaining (?.) for safety."),
        (r'as\s+any', "Forced type casting bypassing compiler.", "style", "high", "Perform type validation or narrow with 'typeof'."),
        (r'enum\s+', "Enum detected (Numeric preference).", "performance", "low", "Consider 'const enum' or Union Types for smaller bundles.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num,
                    "category": cat,
                    "severity": sev,
                    "message": msg,
                    "suggestion": sugg
                })

    return issues
