import { ListTodo } from 'lucide-react';
import { RedirectIfAuthenticated } from '@/components/auth';
import { RegisterForm } from '@/components/auth/register';

export function Register() {
  return (
    <div className="container flex justify-center px-10 sm:px-12 pt-0 sm:pt-0">
      <div className="card w-full">
        <ListTodo className="mx-auto text-md p-2 border-2 rounded-sm" size={50} />
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <h1>Sign Up</h1>
          <h6>To access your tasks from anywhere</h6>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RedirectIfAuthenticated(Register);
