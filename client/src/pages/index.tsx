import { Route, Routes, useLocation } from 'react-router-dom';
import { ROUTE_HOME } from '@/constants';
import { NotFound } from './404';
import { default as AuthRoutes } from './auth';
import { Home } from './home';

const Pages = () => {
  const location = useLocation();
  return (
    <Routes location={location}>
      <AuthRoutes />
      <Route path={ROUTE_HOME} element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Pages;
