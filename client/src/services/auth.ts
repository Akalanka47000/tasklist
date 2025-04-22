import type {
  ICurrentUserResponse,
  ILoginResponse,
  IRegisterResponse,
  LoginConfig,
  RegisterConfig,
  RequestConfig
} from '@/types';
import { instance } from './core';

function login({ v = 'v1', data, options }: LoginConfig) {
  return instance.post<unknown, ILoginResponse>(`/api/${v}/auth/login`, data, options);
}

function register({ v = 'v1', data, options }: RegisterConfig) {
  return instance.post<unknown, IRegisterResponse>(`/api/${v}/auth/register`, data, options);
}

function current({ v = 'v1', options }: RequestConfig = {}) {
  return instance.get<unknown, ICurrentUserResponse>(`/api/${v}/auth/current`, options);
}

function logout({ v = 'v1', options }: RequestConfig = {}) {
  return instance.post<unknown, IAPIResponse>(`/api/${v}/auth/logout`, undefined, options);
}

export default {
  login,
  register,
  current,
  logout
};
