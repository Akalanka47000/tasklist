import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';
import { faker } from '@faker-js/faker';

export const mockTask = () =>
  ({
    _id: faker.string.hexadecimal({ length: 24, prefix: '' }),
    title: faker.lorem.sentence(),
    priority: faker.helpers.arrayElement(Object.values(Priority).filter(Number)),
    status: faker.helpers.arrayElement(Object.values(TaskStatus)),
    recurring_interval: faker.helpers.arrayElement(Object.values(RecurringInterval)),
    dependencies: [],
    user: faker.string.hexadecimal({ length: 24, prefix: '' }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString()
  }) as ITask;

const mockTasks = Array.from({ length: 10 }, mockTask);

export const mockEmptyTaskListReponse: IPaginatedAPIResponse<ITask> = {
  data: {
    docs: [],
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null
  },
  message: 'Tasks fetched successfully!'
};

export const mockTaskListReponse: IPaginatedAPIResponse<ITask> = {
  data: {
    docs: mockTasks,
    totalDocs: 50,
    limit: 10,
    page: 1,
    totalPages: 5,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 1
  },
  message: 'Tasks fetched successfully!'
};

export const mockFilteredTaskListReponse: IPaginatedAPIResponse<ITask> = {
  data: {
    docs: mockTasks.splice(0, 3),
    totalDocs: 3,
    limit: 10,
    page: 1,
    totalPages: 5,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: 1
  },
  message: 'Tasks fetched successfully!'
};
