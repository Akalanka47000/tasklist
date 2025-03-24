import { headers } from '@shared/constants';
import { default as axios } from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    req.headers[headers.correlationId] = window.crypto.randomUUID();
  }
  return req;
});

export function formatError(error: any) {
  if (error.response) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message
    };
  } else if (error.request) {
    return {
      status: error.request?.status,
      message: error.request?.response?.message
    };
  }
  return {
    status: 0,
    message: 'Network Error'
  };
}

instance.interceptors.response.use(
  (res) => res.data,
  async (error: any) => {
    return Promise.reject(formatError(error));
  }
);

export { instance };
