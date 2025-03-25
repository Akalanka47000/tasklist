import { RedirectIfAuthenticated } from '@/components/auth';
import { LoginForm } from '@/components/auth/login';

export function Login() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-6 sm:p-12">
        <h1>Welcome Back!</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default RedirectIfAuthenticated(Login);
