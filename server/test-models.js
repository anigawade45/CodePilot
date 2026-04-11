const { GoogleGenerativeAI } = require("@google/generative-ai");

async function verifyModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // This bypasses the generateContent call to see what the server actually sees
    const fetch = require('node-fetch'); // or use native fetch in Node 18+
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Available Models:");
    data.models.forEach(m => console.log(m.name));
  } catch (e) {
    console.error("Connection Error:", e);
  }
}
verifyModels();