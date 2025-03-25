import { traced } from '@sliit-foss/functions';
import { RetrievalOptions } from 'mongoose';
import * as repository from '../../repository';

const layer = 'repository';

export const createTask = async (task: ITask) => {
  return traced[layer](repository.createTask)(task);
};

export const getTasks = (retrievalOptions: RetrievalOptions, user:IUser) => {
  return traced[layer](repository.getAllTasks)(retrievalOptions, user);
};

export const getTaskById = (id: string) => repository.getTaskById(id);

export const updateTaskById = async (id: string, data: Partial<ITask>) => {
  return traced[layer](repository.updateTaskById)(id, data);
};

export const deleteTaskById = (id: string) => {
  return traced[layer](repository.deleteTaskById)(id);
};
