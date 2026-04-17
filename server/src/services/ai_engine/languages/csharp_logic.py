import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ C# (.NET) Patterns
    checks = [
        (r'\.Result\b|\.Wait\(\)', "Blocking async code detected.", "performance", "high", "Use 'await' keyword to prevent thread stagnation."),
        (r'new\s+List<dynamic>', "Dynamic typing reduces safety.", "style", "low", "Use strong typing or defined interfaces."),
        (r'void\s+async', "Async void method (Global Error Risk).", "bug", "high", "Methods should return Task or Task<T> unless it's an event handler."),
        (r'Thread\.Sleep', "Thread blocking.", "performance", "medium", "Use Task.Delay() instead."),
        (r'HttpContext\.Current', "Legacy singleton access.", "style", "medium", "Inject IHttpContextAccessor via Dependency Injection.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
