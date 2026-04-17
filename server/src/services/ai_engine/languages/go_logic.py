import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ Go (Golang) Idioms
    checks = [
        (r'panic\(', "Explicit panic detected.", "bug", "high", "Return an error object instead of panicking."),
        (r'interface\{\}', "Empty interface usage.", "style", "medium", "Use specific types or a generic alias ('any' in 1.18+)."),
        (r'go\s+func', "Inline goroutine without sync control.", "performance", "medium", "Ensure WaitGroups or Channels are used for cleanup."),
        (r'init\(\)', "Usage of init() function.", "style", "low", "Better to initialize explicitly to improve testability."),
        (r'defer\s+.*Close\(\)', "Deferred Close() without error check.", "bug", "low", "Wrap in a literal function to handle potential close errors.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
