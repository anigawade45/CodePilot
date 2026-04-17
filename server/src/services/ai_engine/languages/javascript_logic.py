import re

def check_nesting_depth(line, state):
    state['nesting_level'] += line.count('{') - line.count('}')
    if state['nesting_level'] > 4 and not state['already_flagged']:
        state['already_flagged'] = True
        return {
            "category": "performance", "severity": "high",
            "message": "Critical Complexity: Entry into High Nesting Depth (Callback Hell).",
            "suggestion": "Refactor logic into separate functions or use async/await."
        }
    if state['nesting_level'] <= 4:
        state['already_flagged'] = False
    return None

def check_react_optimization(line):
    """Detects React-specific optimization opportunities."""
    # 🏎️ Inline arrow function in JSX
    if 'onClick={() =>' in line or 'onChange={(e) =>' in line:
        return {
            "category": "performance", "severity": "low",
            "message": "JSX Optimization: Inline arrow function detected in event handler.",
            "suggestion": "Move this logic to a named function using useCallback to prevent unnecessary re-renders."
        }
    return None

def check_component_bloat(code):
    """Detects large components (Full file analysis)."""
    lines = code.split('\n')
    if len(lines) > 200:
        return {
            "line_number": 1,
            "category": "style", "severity": "medium",
            "message": f"Component Bloat: This file is {len(lines)} lines long.",
            "suggestion": "Consider splitting this component into smaller, reusable child components (e.g., ResultHeader, ResultTable)."
        }
    return None

def check_security(line):
    if '.__proto__' in line or '[constructor]' in line:
        return {
            "category": "security", "severity": "critical",
            "message": "Prototype Pollution vulnerability detected.",
            "suggestion": "Use Map objects or Object.create(null) for dynamic key mapping."
        }
    if '.innerHTML' in line:
        return {
            "category": "security", "severity": "high",
            "message": "Unsafe DOM manipulation (XSS Risk).",
            "suggestion": "Use .textContent or a sanitizer library."
        }
    return None

def analyze(code):
    issues = []
    
    # 📊 File-level analysis
    bloat_issue = check_component_bloat(code)
    if bloat_issue:
        issues.append(bloat_issue)

    lines = code.split('\n')
    state = {'nesting_level': 0, 'already_flagged': False}
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Line-by-line checks
        nesting_issue = check_nesting_depth(line, state)
        if nesting_issue:
            nesting_issue["line_number"] = line_num
            issues.append(nesting_issue)

        react_issue = check_react_optimization(line)
        if react_issue:
            react_issue["line_number"] = line_num
            issues.append(react_issue)

        sec_issue = check_security(line)
        if sec_issue:
            sec_issue["line_number"] = line_num
            issues.append(sec_issue)

    return issues
