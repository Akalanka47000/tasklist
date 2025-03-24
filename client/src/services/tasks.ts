import { ICreateTaskResponse, RequestConfig, RequestCreateConfig } from '@/types';
import { instance } from './core';

function getTasks({ v = 'v1', options }: RequestConfig) {
  return instance.get<IPaginatedAPIResponse<ITask>>(`/api/${v}/tasks`, options);
}

function createTask({ v = 'v1', data, options }: RequestCreateConfig) {
  return instance.post<ICreateTaskResponse>(`/api/${v}/tasks`, data, options);
}

export default { getTasks, createTask };
