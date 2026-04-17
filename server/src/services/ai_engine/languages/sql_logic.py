import re

def analyze(code):
    issues = []
    lines = code.split('\n')
    
    # 🕵️ SQL Injection & Best Practices
    checks = [
        (r'SELECT\s+\*', "Select * usage detected.", "performance", "medium", "Specify required columns to reduce data transfer and improve index usage."),
        (r'\+.*\'|%.*\'', "Direct string concatenation in query.", "security", "high", "Critical: Use prepared statements or parameterized queries to prevent SQL Injection."),
        (r'DROP\s+TABLE|TRUNCATE', "Destructive DDL detected.", "security", "high", "Ensure this is authorized and protected by confirmation."),
        (r'ORDER\s+BY\s+RAND\(\)', "Non-performant sorting.", "performance", "high", "Scanning large datasets with random sort is extremely slow."),
        (r'LEFT\s+JOIN', "Potential outer join bottleneck.", "performance", "low", "Verify if INNER JOIN is sufficient for the business logic.")
    ]

    for i, line in enumerate(lines):
        line_num = i + 1
        for pattern, msg, cat, sev, sugg in checks:
            if re.search(pattern, line):
                issues.append({
                    "line_number": line_num, "category": cat, "severity": sev, "message": msg, "suggestion": sugg
                })
    return issues
