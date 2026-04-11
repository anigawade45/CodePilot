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
    const { code, language } = req.body;
    const userId = req.user.sub;

    if (!code) return res.status(400).json({ error: "Code is required" });

    // 🏷️ CACHE OPTIMIZATION: Check if this exact code was recently analyzed by this user
    const { data: existingReview, error: cacheError } = await supabase
      .from('reviews')
      .select('*, issues(*)')
      .eq('user_id', userId)
      .eq('code', code) // Direct comparison for simplicity, could use a hash column for speed
      .limit(1)
      .maybeSingle();

    if (existingReview) {
      console.log("⚡ [Cache Hit] Returning previous analysis for identical code.");
      return res.status(200).json({ 
        reviewId: existingReview.id, 
        issues: existingReview.issues,
        cached: true 
      });
    }

    // AI Analysis
    const { issues, meta } = await analyzeCode(code, language || 'javascript');

    // DB: Insert Review Header (Inc metadata if column exists, otherwise just basics)
    let review;
    const { data: initialReview, error: reviewError } = await supabase
      .from('reviews')
      .insert([{ 
        user_id: userId, 
        code, 
        language: language || 'javascript',
        provider: meta.provider,
        prompt_version: meta.promptVersion,
        tokens_used: meta.usage.tokens,
        cost_estimated: meta.usage.estimatedCost
      }])
      .select()
      .single();

    review = initialReview;

    if (reviewError) {
      console.warn("Meta storage failed, falling back to basic insert...");
      // Fallback for older schemas
      const { data: basicReview, error: basicError } = await supabase
        .from('reviews')
        .insert([{ user_id: userId, code, language: language || 'javascript' }])
        .select()
        .single();
      if (basicError) throw basicError;
      review = basicReview;
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
    console.error("Create Review Error:", error);
    res.status(500).json({ error: "Internal Server Error during analysis" });
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
