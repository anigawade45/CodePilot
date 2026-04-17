import sys
import json
import ast
import re

def analyze_python(code):
    issues = []
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            # Check for eval() - Security
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'eval':
                issues.append({
                    "line_number": node.lineno,
                    "category": "security",
                    "severity": "high",
                    "message": "Dangerous use of eval() detected.",
                    "suggestion": "Use literal_eval or a safer alternative to parse input."
                })
            
            # Check for broad exceptions
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                issues.append({
                    "line_number": node.lineno,
                    "category": "style",
                    "severity": "medium",
                    "message": "Broad exception clause detected.",
                    "suggestion": "Specify the exact exception type (e.g., except ValueError:) to avoid masking bugs."
                })
    except SyntaxError as e:
        issues.append({
            "line_number": e.lineno,
            "category": "bug",
            "severity": "high",
            "message": f"Syntax Error: {e.msg}",
            "suggestion": "Fix the syntax error to allow further analysis."
        })
    return issues

def analyze_javascript(code):
    issues = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Check for 'var' usage
        if re.search(r'\bvar\b', line):
            issues.append({
                "line_number": line_num,
                "category": "style",
                "severity": "low",
                "message": "Legacy 'var' keyword used.",
                "suggestion": "Use 'let' or 'const' for better scoping."
            })
            
        # Check for innerHTML
        if '.innerHTML' in line:
            issues.append({
                "line_number": line_num,
                "category": "security",
                "severity": "high",
                "message": "Potential XSS via .innerHTML usage.",
                "suggestion": "Use .textContent or .innerText to prevent script injection."
            })

        # Check for console.log
        if 'console.log' in line:
            issues.append({
                "line_number": line_num,
                "category": "style",
                "severity": "low",
                "message": "Production code contains console.log.",
                "suggestion": "Remove logging or use a professional logging library."
            })

    return issues

def main():
    if len(sys.argv) < 3:
        print(json.dumps([]))
        return

    language = sys.argv[1].lower()
    code = sys.argv[2]
    
    analysis = []
    if language == 'python':
        analysis = analyze_python(code)
    elif language in ['javascript', 'typescript']:
        analysis = analyze_javascript(code)
    else:
        # Generic regex-based checks for other languages
        if 'TODO' in code:
            analysis.append({
                "line_number": 1,
                "category": "style",
                "severity": "low",
                "message": "Unresolved TODO found in code.",
                "suggestion": "Complete the task or track it in your project management tool."
            })

    print(json.dumps(analysis))

if __name__ == "__main__":
    main()
