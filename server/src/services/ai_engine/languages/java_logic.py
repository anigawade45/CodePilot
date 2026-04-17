import re

def check_memory_leaks(line):
    if re.search(r'static\s+.*List|static\s+.*Map', line):
        return {
            "category": "performance", "severity": "high",
            "message": "Potential Memory Leak: Static collection detected.",
            "suggestion": "Static collections grow indefinitely. Ensure they are cleared regularly."
        }
    return None

def check_security(line):
    if re.search(r'String\s+.*password\s*=\s*".+"', line, re.IGNORECASE):
        return {
            "category": "security", "severity": "critical",
            "message": "Hardcoded Secret: Password detected in source code.",
            "suggestion": "Move secrets to environment variables or a KeyVault."
        }
    return None

def check_concurrency(line):
    if 'SimpleDateFormat' in line:
        return {
            "category": "bug", "severity": "medium",
            "message": "Thread Safety Risk: SimpleDateFormat is not thread-safe.",
            "suggestion": "Use java.time.format.DateTimeFormatter (Java 8+) instead."
        }
    return None

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        detectors = [check_memory_leaks, check_security, check_concurrency]
        for detect in detectors:
            issue = detect(line)
            if issue:
                issue["line_number"] = line_num
                issues.append(issue)

    return issues
