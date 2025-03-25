import { Navigate, useLocation } from 'react-router-dom';
import { ROUTE_HOME } from '@/constants';
import { useAuthStore } from '@/store/auth';

export function RedirectIfAuthenticated(Component: React.ElementType) {
  return function () {
    const profile = useAuthStore((state) => state.profile);
    const location = useLocation();
    if (profile) {
      return <Navigate to={ROUTE_HOME} state={{ from: location }} replace />;
    } else {
      return <Component />;
    }
  };
}
