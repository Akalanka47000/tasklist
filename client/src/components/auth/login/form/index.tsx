import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components';
import { ROUTE_HOME, ROUTE_REGISTER } from '@/constants';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { filterAndNotifyError } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { default as FormSchema } from './schema';

export function LoginForm() {
  const navigate = useNavigate();

  const setProfile = useAuthStore((state) => state.setProfile);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      return await authService.login({ data });
    },
    onSuccess: (result) => {
      toast.success(result.message);
      setProfile(result.data);
      navigate(ROUTE_HOME);
    },
    onError: filterAndNotifyError
  });

  return (
    <>
      <Form {...form}>
        <form className="w-full flex flex-col gap-6" onSubmit={form.handleSubmit(loginMutation.mutate as any)}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel label="Email" required />
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel label="Password" required />
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            Don&apos;t have an account?{' '}
            <Link to={ROUTE_REGISTER} className="text-blue-500 underline">
              Register
            </Link>
          </span>
          <Button loading={loginMutation.isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

export default LoginForm;
