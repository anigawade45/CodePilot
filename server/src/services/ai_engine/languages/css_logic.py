import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ CSS Performance & Modern Syntax
    checks = [
        (r'!important', "!important usage detected.", "style", "medium", "Avoid !important; refactor selector specificity for maintainability."),
        (r'@import\s+', "@import in CSS file.", "performance", "high", "Browser will download files sequentially. Use link tags or a bundler."),
        (r'px;', "Fixed pixel units detected.", "style", "low", "Consider using relative units (rem/em) for better accessibility and responsiveness."),
        (r'float:\s+', "Legacy layout method (float).", "style", "medium", "Use Flexbox or CSS Grid for modern robust layouts."),
        (r'\*\{', "Universal selector performance hit.", "performance", "low", "Scanning every element on the page can impact rendering speed.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
