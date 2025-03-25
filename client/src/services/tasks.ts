import {
  ICreateTaskResponse,
  IUpdateTaskResponse,
  RequestConfig,
  RequestCreateConfig,
  RequestDeleteConfig,
  RequestUpdateConfig
} from '@/types';
import { instance } from './core';

function getTasks({ v = 'v1', options }: RequestConfig) {
  return instance.get<unknown, IPaginatedAPIResponse<ITask>>(`/api/${v}/tasks`, options);
}

function createTask({ v = 'v1', data, options }: RequestCreateConfig) {
  return instance.post<unknown, ICreateTaskResponse>(`/api/${v}/tasks`, data, options);
}

function updateTask({ v = 'v1', id, data, options }: RequestUpdateConfig) {
  return instance.patch<unknown, IUpdateTaskResponse>(`/api/${v}/tasks/${id}`, data, options);
}

function deleteTask({ v = 'v1', id, options }: RequestDeleteConfig) {
  return instance.delete<unknown, ICreateTaskResponse>(`/api/${v}/tasks/${id}`, options);
}

export default { getTasks, createTask, updateTask, deleteTask };
