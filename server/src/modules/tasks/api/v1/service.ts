import { default as context } from 'express-http-context';
import { traced } from '@sliit-foss/functions';
import { RetrievalOptions } from 'mongoose';
import { ctxTask } from '../../constants';
import * as repository from '../../repository';
import { errors } from '../../utils';
import { RecurrenceManager } from '../../workers/recurrence-manager';

const layer = 'repository';

export const createTask = (task: Partial<ITask>) => {
  return traced[layer](repository.createTask)(task).then((result) => {
    if (result.recurring_interval) RecurrenceManager.scheduleTaskCreation(result);
    return result;
  });
};

export const getTasks = (retrievalOptions: RetrievalOptions, user: IUser) => {
  return traced[layer](repository.getAllTasks)(retrievalOptions, user);
};

export const getTaskById = (id: string) => repository.getTaskById(id);

export const updateTaskById = (id: string, data: Partial<ITask>) => {
  return traced[layer](repository.updateTaskById)(id, data).then((result) => {
    const existingTask: ITask = context.get(ctxTask);
    if (result && (existingTask.recurring_interval || data.recurring_interval)) {
      RecurrenceManager.rescheduleTaskCreation(result);
    }
    return result;
  });
};

export const deleteTaskById = async (id: string) => {
  const dependentTaskCount = await traced[layer](repository.getDependantTaskCount)(id);
  if (dependentTaskCount) throw errors.task_has_dependencies;
  return traced[layer](repository.deleteTaskById)(id).then((result) => {
    if (result?.recurring_interval) {
      RecurrenceManager.cancelTaskCreation(result);
    }
    return result;
  });
};
