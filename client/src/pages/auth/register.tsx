import { RegisterForm } from '@/components/auth/register';

export function Register() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[37.375rem] p-6 sm:p-12 pt-0 sm:pt-0">
        <h1>Sign Up</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
