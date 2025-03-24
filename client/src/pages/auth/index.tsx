import { Route } from 'react-router-dom';
import { ROUTE_LOGIN, ROUTE_REGISTER } from '@/constants';
import Login from './login';
import Register from './register';

function Auth() {
  return (
    <>
      <Route path={ROUTE_LOGIN} element={<Login />} />
      <Route path={ROUTE_REGISTER} element={<Register />} />
    </>
  );
}

export default Auth;
