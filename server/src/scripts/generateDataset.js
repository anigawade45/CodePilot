const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * 🛰️ CodePilot Dataset Synthesizer
 * -------------------------------
 * This script extracts your successful code reviews from Supabase 
 * and formats them into a JSONL dataset for fine-tuning your AI model in Google Colab.
 */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function generateDataset() {
  console.log('🚀 Initializing Deep-Join Synthesis...');

  try {
    // 1. Fetch reviews with their related issues
    // Supabase syntax for join: table(column1, column2, related_table(columnA, columnB))
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        code,
        language,
        issues (
          line_number,
          category,
          severity,
          message,
          suggestion
        )
      `);

    if (error) throw error;
    
    // Filter out reviews that don't have issues (empty analyses aren't good for training)
    const validReviews = reviews.filter(r => r.issues && r.issues.length > 0);

    if (validReviews.length === 0) {
      console.log('⚠️ No training data (reviews with issues) found in database. Run some analyses first!');
      return;
    }

    console.log(`📊 Found ${validReviews.length} high-quality training samples.`);

    // 2. Format into Alpaca JSONL style
    const datasetPath = path.join(__dirname, '../../dataset.jsonl');
    const stream = fs.createWriteStream(datasetPath);

    validReviews.forEach((rev) => {
      // Reconstruct the full analysis JSON that the AI should output
      const trainingSample = {
        instruction: `Analyze this ${rev.language} code for bugs, security issues, and style improvements.`,
        input: rev.code,
        output: JSON.stringify(rev.issues) // This is the exact format we want the AI to learn
      };

      // Write as a single line JSON
      stream.write(JSON.stringify(trainingSample) + '\n');
    });

    stream.end();

    console.log('✅ SYNTHESIS COMPLETE!');
    console.log(`📁 Your training brain: ${datasetPath}`);
    console.log('💡 NEXT STEP: Upload this file to your Google Colab "T4 GPU" session.');

  } catch (err) {
    console.error('❌ Synthesis Failed:', err.message);
  }
}

generateDataset();
