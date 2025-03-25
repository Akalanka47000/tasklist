import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@/components';
import { ROUTE_HOME, ROUTE_LOGIN } from '@/constants';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth';
import { filterAndNotifyError } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { default as FormSchema } from './schema';

export function RegisterForm() {
  const navigate = useNavigate();

  const setProfile = useAuthStore((state) => state.setProfile);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: ''
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ confirm_password: _, ...data }: z.infer<typeof FormSchema>) => {
      return await authService.register({ data });
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
        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(registerMutation.mutate as any)}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
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
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            Already have an account?{' '}
            <Link to={ROUTE_LOGIN} className="text-blue-500 underline">
              Login
            </Link>
          </span>
          <Button loading={registerMutation.isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}

export default RegisterForm;
