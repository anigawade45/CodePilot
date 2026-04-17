import ast

class SovereignVisitor(ast.NodeVisitor):
    def __init__(self):
        self.issues = []

    def visit_FunctionDef(self, node):
        # 1. 🧠 Parameter Complexity
        if len(node.args.args) > 5:
            self.issues.append({
                "line_number": node.lineno,
                "category": "style",
                "severity": "medium",
                "message": f"High Cognitive Load: Function '{node.name}' has {len(node.args.args)} arguments.",
                "suggestion": "Refactor into an object/dataclass or use **kwargs."
            })

        # 2. ☣️ Mutable Default Arguments
        for default in node.args.defaults:
            if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                self.issues.append({
                    "line_number": node.lineno,
                    "category": "bug",
                    "severity": "critical",
                    "message": "Mutable Default Argument: This will share state across all function calls.",
                    "suggestion": "Use 'default=None' and initialize inside the function."
                })
        
        # 3. 🌊 Function Length (Max 50 lines)
        length = node.end_lineno - node.lineno
        if length > 50:
            self.issues.append({
                "line_number": node.lineno,
                "category": "performance",
                "severity": "medium",
                "message": f"God Function Detected: '{node.name}' is {length} lines long.",
                "suggestion": "Decompose into smaller, single-responsibility functions."
            })

        self.generic_visit(node)

    def visit_ExceptHandler(self, node):
        # 4. 🔕 Silent Failures
        if node.type is None:
             self.issues.append({
                "line_number": node.lineno,
                "category": "bug",
                "severity": "high",
                "message": "Dangerous Exception Handling: Bare 'except:' caught.",
                "suggestion": "Catch specific exceptions (e.g., ValueError) to avoid swallowing system signals."
            })
        self.generic_visit(node)

    def visit_Call(self, node):
        # 5. 🛡️ Security: OS Injection
        if isinstance(node.func, ast.Attribute) and node.func.attr == 'system':
            self.issues.append({
                "line_number": node.lineno,
                "category": "security",
                "severity": "high",
                "message": "OS Shell Injection Risk: os.system() detected.",
                "suggestion": "Use the 'subprocess' module with shell=False for safer execution."
            })
        self.generic_visit(node)

def analyze(code):
    try:
        tree = ast.parse(code)
        visitor = SovereignVisitor()
        visitor.visit(tree)
        return visitor.issues
    except SyntaxError as e:
        return [{
            "line_number": e.lineno,
            "category": "bug",
            "severity": "critical",
            "message": f"Syntax Error: {e.msg}",
            "suggestion": "Fix the syntax to allow structural analysis."
        }]
