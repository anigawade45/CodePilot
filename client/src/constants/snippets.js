export const EXAMPLE_SNIPPETS = {
  javascript: `// ⚠️ VULNERABLE JAVASCRIPT SNIPPET
function handleUserLogin(username, password) {
  // SQL Injection Vulnerability
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  db.execute(query);
  
  // XSS Vulnerability
  document.getElementById('welcome-msg').innerHTML = "Welcome back, " + username;
  
  // Performance: Inefficient loop
  for(let i = 0; i < 1000; i++) {
    const data = fetch('https://api.example.com/check/' + i);
    console.log(data);
  }
}`,

  python: `# ⚠️ VULNERABLE PYTHON SNIPPET
import os

def process_image(filename):
    # Command Injection Vulnerability
    os.system("convert " + filename + " output.jpg")
    
    # Insecure usage of eval
    config = eval(input("Enter config dict: "))
    
    # Bug: Division by zero risk
    def calculate_ratio(a, b):
        return a / b
        
    calculate_ratio(10, 0)`,

  typescript: `// ⚠️ VULNERABLE TYPESCRIPT SNIPPET
interface User {
  id: string;
  role: 'admin' | 'user';
}

function processAdminAction(user: any) {
  // Type Safety: Using 'any' defeats the purpose
  // Security: No role check
  console.log("deleting database...");
  
  // Race condition risk
  let counter = 0;
  async function increment() {
    const current = counter;
    await new Promise(r => setTimeout(r, 10));
    counter = current + 1;
  }
}`
};
