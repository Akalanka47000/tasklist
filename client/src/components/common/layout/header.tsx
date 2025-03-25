import { HTMLProps } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_REGISTER } from '@/constants';
import { useGetProfile } from '@/hooks/services/auth';
import { authService } from '@/services';
import { resetStores } from '@/store';
import { cn } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Skeleton } from '../core';

export function Header({ className, ...props }: HTMLProps<HTMLHeadElement>) {
  const client = useQueryClient();
  const { data: profile, isLoading } = useGetProfile();

  const navigate = useNavigate();

  const location = useLocation();

  const logout = useMutation({
    mutationFn: () => {
      return authService.logout().then((result) => {
        resetStores();
        client.invalidateQueries({ queryKey: ['auth'] });
        toast.success(result.message);
      });
    }
  });

  const onLogin = () => navigate(ROUTE_LOGIN);

  return (
    <header
      className={cn('w-full h-18 px-8 sm:px-12 flex justify-between items-center bg-black', className)}
      {...props}>
      <Link to={ROUTE_HOME}>
        <h3 className="text-lg md:text-2xl tracking-wider">Task List</h3>
      </Link>
      {location.pathname !== ROUTE_LOGIN &&
        location.pathname !== ROUTE_REGISTER &&
        (isLoading ? (
          <Skeleton className="h-8 sm:h-10 w-36" />
        ) : (
          <Button
            className="w-36 h-8 sm:h-[2.25rem]"
            loading={logout.isPending}
            onClick={profile ? (logout.mutate as any) : onLogin}>
            {profile ? 'Logout' : 'Login'}
          </Button>
        ))}
    </header>
  );
}
