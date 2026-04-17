import { useState, useMemo, useCallback } from 'react';
import { useDashboard } from './useDashboard';

/**
 * 🛰️ HISTORY AUDIT HOOK [ORACLE v1.0]
 * -----------------------------------
 * - Extends Dashboard logic with advanced filtering and sorting.
 * - Provides audit-level statistics for the history view.
 */
export const useHistory = () => {
  const { reviews, isLoading, isDeleting, purgeReview, refresh } = useDashboard();
  
  // 🎚️ STATE LAYERS
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, score-desc, score-asc
  const [filterLang, setFilterLang] = useState('all');

  // 🧪 DERIVED STATISTICS
  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) return { total: 0, avgScore: 0, languages: [] };
    
    const langs = [...new Set(reviews.map(r => r.language).filter(Boolean))];
    const scores = reviews.map(r => r.score || 0).filter(s => s > 0);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    
    return {
      total: reviews.length,
      avgScore,
      languages: langs
    };
  }, [reviews]);

  // 🔍 ADVANCED FILTERING & SORTING CIRCUIT
  const historyReviews = useMemo(() => {
    if (!reviews) return [];
    
    // 1. Filter by language
    let processed = reviews.filter(r => 
      filterLang === 'all' || r.language === filterLang
    );

    // 2. Apply Sorting
    processed.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'score-desc':
          return (b.score || 0) - (a.score || 0);
        case 'score-asc':
          return (a.score || 0) - (b.score || 0);
        case 'date-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return processed;
  }, [reviews, filterLang, sortBy]);

  return {
    historyReviews,
    stats,
    isLoading,
    isDeleting,
    sortBy,
    setSortBy,
    filterLang,
    setFilterLang,
    purgeReview,
    refresh
  };
};
