const { analyzeCode } = require('../services/aiService');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const crypto = require('crypto');

// 1. Create Review (POST /api/review)
const createReview = async (req, res) => {
  try {
    const { code, language, aiConfig } = req.body;
    const userId = req.user.sub;

    if (!code) return res.status(400).json({ error: "Code is required" });

    // 🏷️ CACHE OPTIMIZATION: Check if this exact code was recently analyzed by this user
    const { data: existingReview, error: cacheError } = await supabase
      .from('reviews')
      .select('*, issues(*)')
      .eq('user_id', userId)
      .eq('code', code) 
      .limit(1)
      .maybeSingle();

    if (existingReview && !aiConfig) {
      console.log("⚡ [Cache Hit] Returning previous analysis for identical code.");
      return res.status(200).json({ 
        reviewId: existingReview.id, 
        issues: existingReview.issues,
        cached: true 
      });
    }

    // 🧠 AI Analysis (Supports local Sovereign models & BYOK)
    const analysisResult = await analyzeCode(code, language || 'javascript', aiConfig || {});
    
    if (!analysisResult || !analysisResult.issues) {
      console.error("❌ [AI Signal Rupture] Analysis service failed to return valid findings.");
      return res.status(422).json({ error: "The intelligence engine failed to generate a valid report. Please retry." });
    }

    const { issues, meta = {} } = analysisResult;
    const usage = meta.usage || { tokens: 0, estimatedCost: 0 };

    // DB: Insert Review Header with recursive fallback protection
    let review;
    const { data: initialReview, error: reviewError } = await supabase
      .from('reviews')
      .insert([{ 
        user_id: userId, 
        code, 
        language: language || 'javascript',
        provider: meta.provider || 'unknown',
        prompt_version: meta.promptVersion || '1.0.0',
        tokens_used: usage.tokens || 0,
        cost_estimated: usage.estimatedCost || 0
      }])
      .select()
      .maybeSingle();

    if (reviewError || !initialReview) {
      console.warn("⚠️ [Meta Incompatibility] Basic storage fallback triggered:", reviewError?.message);
      const { data: basicReview, error: basicError } = await supabase
        .from('reviews')
        .insert([{ user_id: userId, code, language: language || 'javascript' }])
        .select()
        .maybeSingle();
      
      if (basicError) throw basicError;
      review = basicReview;
    } else {
      review = initialReview;
    }

    // DB: Insert Issues (Normalized)
    if (issues.length > 0) {
      const issuesToInsert = issues.map(issue => ({
        review_id: review.id,
        line_number: issue.line_number,
        category: issue.category,
        severity: issue.severity,
        message: issue.message,
        suggestion: issue.suggestion
      }));

      const { error: issuesError } = await supabase
        .from('issues')
        .insert(issuesToInsert);

      if (issuesError) console.error("Error inserting issues:", issuesError);
    }

    res.status(201).json({ reviewId: review.id, issues, meta });
  } catch (error) {
    console.error("🔥🔥 [SYSTEM CRASH] Critical Analysis Error:", error.message);
    res.status(500).json({ 
      error: "Internal Server Error during analysis", 
      detail: error.message 
    });
  }
};

// 2. Get Reviews (GET /api/reviews)
const getReviews = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { data, error } = await supabase
      .from('reviews')
      .select('*, issues(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Single Review (GET /api/review/:id)
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*, issues(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: "Review not found" });
  }
};

// 4. Delete Review (DELETE /api/review/:id)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Share Review (POST /api/review/:id/share)
const shareReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('shared_reviews')
      .insert([{ review_id: id }])
      .select()
      .single();

    if (error) throw error;
    res.json({ public_token: data.public_token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get Shared Review (Public) (GET /api/share/:token)
const getSharedReview = async (req, res) => {
  try {
    const { token } = req.params;
    const { data: shared, error: sharedError } = await supabase
      .from('shared_reviews')
      .select('review_id')
      .eq('public_token', token)
      .single();

    if (sharedError || !shared) return res.status(404).json({ error: "Link expired" });

    const { data, error } = await supabase
      .from('reviews')
      .select('*, issues(*)')
      .eq('id', shared.review_id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load shared analysis" });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
  shareReview,
  getSharedReview
};
