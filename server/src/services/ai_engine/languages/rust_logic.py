import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ Rust Safety & Pragmas
    checks = [
        (r'unsafe\s+\{', "Unsafe block detected.", "security", "high", "Verify invariants or try to implement using safe abstractions."),
        (r'\.unwrap\(\)', "Explicit unwrap usage (Potential Panic).", "bug", "high", "Use expect() with a message or handle with 'match'/'if let'."),
        (r'\.as_ptr\(\)', "Raw pointer acquisition.", "security", "medium", "Ensure the lifecycle of the pointer is strictly managed."),
        (r'extern\s+["\']C["\']', "FFI Ingress point.", "security", "medium", "Use a safe wrapper for external function calls."),
        (r'todo!\(\)', "Incomplete implementation placeholder.", "style", "low", "Complete the logic before merging into production.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
