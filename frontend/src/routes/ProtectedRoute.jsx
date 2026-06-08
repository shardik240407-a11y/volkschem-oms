import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the user's correct portal
    const portalMap = { admin: '/admin', employee: '/employee', factory_admin: '/factory' };
    return <Navigate to={portalMap[user?.role] || '/login'} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
