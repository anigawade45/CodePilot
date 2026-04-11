const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found in .env file");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    console.log("--- Available Models for your Key ---");
    data.models.forEach(model => {
      console.log(`Model ID: ${model.name.replace('models/', '')}`);
      console.log(`Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---');
    });
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

listModels();