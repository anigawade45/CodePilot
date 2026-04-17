import sys
import json
import importlib
import os

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing language or code"}))
        return

    language = sys.argv[1].lower()
    code = sys.argv[2]
    
    # 📡 Dispatcher: Route to specialized language logic
    try:
        # Mapping common aliases
        lang_map = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'cs': 'csharp',
            'kt': 'kotlin'
        }
        lang_file = lang_map.get(language, language)
        
        module_name = f"languages.{lang_file}_logic"
        
        # Dynamic Import
        try:
            lang_module = importlib.import_module(module_name)
            issues = lang_module.analyze(code)
        except ImportError:
            # Fallback for unsupported languages
            issues = [{
                "line_number": 1,
                "category": "system",
                "severity": "low",
                "message": f"Sovereign Engine: Specialized logic for {language} is in progress.",
                "suggestion": "Check back for the next engine update."
            }]

        print(json.dumps(issues))

    except Exception as e:
        print(json.dumps([{
            "line_number": 0,
            "category": "error",
            "severity": "high",
            "message": f"Engine Crash: {str(e)}",
            "suggestion": "Notify system administrator."
        }]))

if __name__ == "__main__":
    # Ensure the script can find its modules
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    main()
