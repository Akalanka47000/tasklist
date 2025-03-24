import { AxiosRequestConfig } from 'axios';

export interface RequestConfig {
  v?: string;
  options?: AxiosRequestConfig & { _retry?: boolean };
}

export interface RequestCreateConfig extends RequestConfig {
  data: Record<string, any>;
}

export interface RequestUpdateConfig extends RequestConfig {
  id: string;
  data: Record<string, any>;
}

export interface RequestGetByIdConfig extends RequestConfig {
  id: string;
}

export type RequestDeleteConfig = RequestGetByIdConfig;
