/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

/**
 * 🛡️ PROTECTED ROUTE SHIELD
 * ------------------------
 * Ensures that only authenticated users can access the route.
 * If no session is found, it performs a seamless redirect to the Landing/Auth page.
 */
function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
