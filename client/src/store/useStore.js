import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  session: null,
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  setSession: (session) => set({ 
    session, 
    user: session?.user || null 
  }),

  setReviews: (reviews) => set({ reviews }),

  setCurrentReview: (review) => set({ currentReview: review }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetReview: () => set({ currentReview: null, error: null }),

  setAuthToken: (token) => {
     // Optional: store token for non-axios use
  }
}));
