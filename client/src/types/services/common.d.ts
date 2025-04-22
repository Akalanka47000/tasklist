import { AxiosRequestConfig } from 'axios';

export interface RequestConfig {
  v?: string;
  options?: AxiosRequestConfig & { _retry?: boolean };
}

export interface RequestCreateConfig<T = Record<string, any>> extends RequestConfig {
  data: T;
}

export interface RequestUpdateConfig<T = Record<string, any>> extends RequestConfig {
  id: string;
  data: T;
}

export interface RequestGetByIdConfig extends RequestConfig {
  id: string;
}

export interface RequestDeleteConfig extends RequestConfig {
  id: string;
}
