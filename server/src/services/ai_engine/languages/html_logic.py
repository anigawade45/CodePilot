import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ HTML Structure & Accessibility
    checks = [
        (r'<img(?!.*alt=).*?>', "Missing 'alt' attribute on image.", "style", "medium", "Provide alt text for screen readers (Accessibility)."),
        (r'onclick=', "Inline event handler detected.", "style", "low", "Attach event listeners via JavaScript (Separation of Concerns)."),
        (r'style=', "Inline CSS detected.", "style", "low", "Move styles to a separate CSS file or a <style> block."),
        (r'<meta\s+name=["\']description["\']', "Duplicate meta description check.", "style", "low", "Ensure every page has a unique, high-quality meta description."),
        (r'<input(?!.*id=).*?>', "Input missing ID.", "style", "low", "Use IDs for proper label association (label for='ID').")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
