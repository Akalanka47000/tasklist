import type {
  CurrentConfig,
  ICurrentUserResponse,
  ILoginResponse,
  ILogoutResponse,
  IRegisterResponse,
  LoginConfig,
  LogoutConfig,
  RegisterConfig
} from '@/types';
import { instance } from './core';

function login({ v = 'v1', data, options }: LoginConfig) {
  return instance.post<ILoginResponse>(`/api/${v}/auth/login`, data, options);
}

function register({ v = 'v1', data, options }: RegisterConfig) {
  return instance.post<IRegisterResponse>(`/api/${v}/auth/register`, data, options);
}

function current({ v = 'v1', options }: CurrentConfig = {}) {
  return instance.get<ICurrentUserResponse>(`/api/${v}/auth/current`, options);
}

function logout({ v = 'v1', options }: LogoutConfig = {}) {
  return instance.post<ILogoutResponse>(`/api/${v}/auth/logout`, undefined, options);
}

export default {
  login,
  register,
  current,
  logout
};
