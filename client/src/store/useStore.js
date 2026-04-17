import { create } from 'zustand';

/**
 * 🧠 CODEPILOT CORE STORE
 * -----------------------
 * SESSION TRUTH:
 * We DO NOT persist session/user. Auth state must always be
 * derived from the Supabase singleton to prevent "Stale Session" redirects.
 */
export const useStore = create(
  (set) => ({
    // 🛡️ Auth Sector (Not Persisted)
    user: undefined, 
    session: undefined,

    // 📦 Data Sector (Persisted)
    reviews: [],
    currentReview: null,
    isLoading: false,
    error: null,
    searchQuery: '',

    // 🛰️ Actions
    setSession: (session) => {
      console.log('🔄 [Store] Syncing Session:', session ? 'Identity Found' : 'Identity Cleared');
      set({ 
        session, 
        user: session?.user || null 
      });
    },

    setReviews: (reviews) => set({ reviews }),
    setCurrentReview: (review) => set({ currentReview: review }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    resetReview: () => set({ currentReview: null, error: null }),
  })
);

// Optional: Use persist for UI state only if needed later.
// For now, we keep it pure to resolve the Auth Block.
