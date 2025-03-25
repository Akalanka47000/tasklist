import { ListTodo } from 'lucide-react';
import { RedirectIfAuthenticated } from '@/components/auth';
import { LoginForm } from '@/components/auth/login';

export function Login() {
  return (
    <div className="container flex justify-center p-10 sm:p-12">
      <div className="card w-full">
        <ListTodo className="mx-auto text-md p-2 border-2 rounded-sm" size={50} />
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <h1>Welcome!</h1>
          <h3>Back</h3>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default RedirectIfAuthenticated(Login);
