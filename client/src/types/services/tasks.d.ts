import { Tasks } from 'server';
import { RequestCreateConfig, RequestUpdateConfig } from './common';

export interface CreateTaskConfig extends RequestCreateConfig<Tasks.V1.ICreateTaskRequest> {}

export type ICreateTaskResponse = IAPIResponse<ITask>;

export interface UpdateTaskConfig extends RequestUpdateConfig<Tasks.V1.IUpdateTaskRequest> {}

export type IUpdateTaskResponse = IAPIResponse<ITask>;
