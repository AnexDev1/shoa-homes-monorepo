import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = ['ADMIN'] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user's role is allowed for the current route
  const isAllowed = allowedRoles.some((role) => user?.role === role);

  if (!isAllowed) {
    // Redirect to home if not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
