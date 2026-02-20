import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isPathAllowed } from '@/lib/permissionUtils';

type PrivateRouteProps = {
  allowedRoles: string[];
};

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role not allowed by static config
    return <Navigate to="/unauthorized" replace />;
  }

  // Dynamic Permission Check
  if (!isPathAllowed(location.pathname, user.role)) {
    // Redirect to unauthorized page if access is revoked in Settings
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

