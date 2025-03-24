import { LoginForm } from '@/components/auth/login';

export function Login() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[37.375rem] p-6 sm:p-12">
        <h1>Welcome Back!</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
