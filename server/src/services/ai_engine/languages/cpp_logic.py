import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ C++ Performance & Memory Safety
    checks = [
        (r'(\+|-|\*|/)\s*=\s*', "Potential overflow in arithmetic.", "performance", "low", "Verify boundary conditions."),
        (r'new\s+', "Manual memory allocation detected.", "security", "high", "Use smart pointers (std::unique_ptr, std::shared_ptr) instead."),
        (r'char\s+.*\s*\[.*\s*\]', "C-style array detected.", "security", "medium", "Use std::array or std::vector for safety."),
        (r'void\*\s+', "Opaque pointer usage.", "style", "medium", "Use typed pointers or templates (std::any for variant logic)."),
        (r'goto\s+', "Legacy jump control flow.", "style", "low", "Replace with structured loops or functions.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
