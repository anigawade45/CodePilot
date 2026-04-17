import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ Kotlin (Android/Backend) Patterns
    checks = [
        (r'!!', "Double bang operator (NPE Risk).", "bug", "high", "Use null safety ?. or Elvis operator ?: instead."),
        (r'GlobalScope', "GlobalScope usage in coroutines.", "performance", "medium", "Use lifecycle-aware scopes (viewModelScope, lifecycleScope) or CoroutineScope(Dispatchers.Main)."),
        (r'delay\(', "Fixed delay in logic.", "performance", "low", "Consider using flow emitters or event-driven triggers."),
        (r'open\s+class', "Leaking inheritance details.", "style", "low", "Verify if the class must be open; default to 'final' if possible."),
        (r'lateinit\s+var', "Uninitialized property access threat.", "bug", "medium", "Verify initialization before access or use delegates (by lazy).")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
