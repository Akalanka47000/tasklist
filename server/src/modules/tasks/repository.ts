import { head } from 'lodash';
import { default as mongoose } from 'mongoose';
import { Task } from './api/v1/models';
import { errors } from './utils';

export const createTask = (task: Partial<ITask>): Promise<ITask> => {
  return Task.create(task);
};

export const getAllTasks = ({ page, limit, ...options }: mongoose.RetrievalOptions, user: IUser) => {
  options.filter.user = new mongoose.Types.ObjectId(user._id);
  options.include ??= [];
  if (!options.include.includes('dependencies')) options.include.push('dependencies');
  const pipeline = Task.aggregate(Task.aggregateUtils.retrieve(options));
  if (page && limit) {
    return Task.aggregatePaginate(pipeline, { page, limit });
  }
  return pipeline;
};

export const getTaskById = async (id: string, include: string[] = ['dependencies']) => {
  const task = head(
    await Task.aggregate([
      Task.aggregateUtils.match({ _id: new mongoose.Types.ObjectId(id) }),
      ...Task.aggregateUtils.include(include)
    ])
  );
  if (!task) throw errors.task_not_found;
  return task;
};

export const updateTaskById = (id: string, data: Partial<ITask>): Promise<ITask> => {
  return Task.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteTaskById = (id: string) => {
  return Task.findOneAndDelete({ _id: id }).lean();
};

export const getDependantTaskCount = (taskId: string): Promise<number> => {
  return Task.countDocuments({ dependencies: taskId });
};

export const batchProcessRecurringTasks = async (executor: (task: ITask) => void, batchSize = 100): Promise<void> => {
  const stream = Task.find({ recurring_interval: { $exists: true } })
    .batchSize(batchSize)
    .lean()
    .cursor();
  for await (const doc of stream) {
    executor(doc);
  }
};
