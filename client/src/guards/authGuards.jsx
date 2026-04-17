import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

/**
 * 💂‍♂️ CENTRALIZED AUTH GUARDS
 * --------------------------
 * Reusable security bouncers for route management.
 */

// 1. PUBLIC ONLY (e.g., Landing, Auth)
// Keeps logged-in users away from guest pages.
/* eslint-disable react/prop-types */
import { memo } from 'react';
export const PublicRoute = memo(({ session, children }) => {
  if (session) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
});
PublicRoute.displayName = 'PublicRoute';

// 2. PROTECTED WRAPPER (e.g., Dashboard, Analysis)
// Forces guests back to the auth page.
/* eslint-disable react/prop-types */
export const ProtectedLayout = ({ session, SplashComponent }) => {
  if (session === undefined) return SplashComponent;
  if (!session) return <Navigate to={ROUTES.AUTH} replace />;
  return <Outlet />;
};
