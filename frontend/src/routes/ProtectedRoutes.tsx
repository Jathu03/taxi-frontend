import { Navigate, Outlet } from 'react-router-dom';
import  { useAuth }  from '@/contexts/AuthContext';

type PrivateRouteProps = {
    allowedRoles: string[];
    
};

export default function PrivateRoute  ({allowedRoles}: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user || !user.isAuthenticated) {
    // Redirect to login if not authenticated

    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return (
      <Outlet />
    
  );
};

