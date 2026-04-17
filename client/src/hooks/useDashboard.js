import { useState, useCallback, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { reviewService } from '../services/api';

/**
 * 🛰️ GLOBAL INVESTIGATION HOOK [SOVEREIGN v1.0]
 * --------------------------------------------
 * - Centralized Hydration: Syncs local state with global intelligence repository
 * - Atomic Filtering: Memoized search logic across multiple layers
 * - Fault Tolerance: Silent recovery on network interference
 */
export const useDashboard = () => {
  const { reviews, setReviews, setLoading, isLoading, searchQuery } = useStore();
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🧠 MEMOIZED SELECTION: Derived logic for investigation filtering
  const filteredReviews = useMemo(() => {
    if (!Array.isArray(reviews)) return [];
    const q = (searchQuery || '').toLowerCase();
    
    return reviews.filter(r =>
      r.language?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q) ||
      r.code?.toLowerCase().includes(q)
    );
  }, [reviews, searchQuery]);

  // 🔄 HYDRATION CIRCUIT
  const refresh = useCallback(async (showLoading = true) => {
    let ignore = false;
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await reviewService.getReviews();
      if (!ignore) setReviews(data || []);
    } catch (err) {
      if (!ignore) {
        console.error("Dashboard Sync Failed:", err);
        setError("Database Link Unstable: Failed to resolve analysis cluster.");
      }
    } finally {
      if (!ignore) setLoading(false);
    }
    return () => { ignore = true; };
  }, [setLoading, setReviews]);

  useEffect(() => {
    const unsub = refresh();
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [refresh]);

  // 🧨 PURGE LOGIC
  const purgeReview = useCallback(async (id) => {
    if (!id || isDeleting) return false;
    try {
      setIsDeleting(true);
      await reviewService.deleteReview(id);
      setReviews(prev => (prev || []).filter(r => r.id !== id));
      return true;
    } catch (err) {
      console.error("Purge Protocol Failed:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, setReviews]);

  return {
    reviews,
    filteredReviews,
    isLoading,
    isDeleting,
    error,
    refresh,
    purgeReview
  };
};
