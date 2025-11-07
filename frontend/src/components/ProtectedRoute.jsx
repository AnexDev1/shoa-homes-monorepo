import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('ProtectedRoute - Auth:', isAuthenticated, 'User:', user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    console.log('User role is not ADMIN:', user?.role);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
