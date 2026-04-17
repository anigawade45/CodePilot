/**
 * 📍 CODEPILOT ROUTE CONSTANTS
 * ----------------------------
 * Centralizing route definitions prevents "Path Drifting" 
 * and makes massive refactors (like multi-tenant support) easy.
 */
export const ROUTES = {
  LANDING: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  NEW_ANALYSIS: '/new',
  HISTORY: '/history',
  REVIEW_DETAIL: '/review/:id',
  SHARED_REVIEW: '/share/:token',
};
