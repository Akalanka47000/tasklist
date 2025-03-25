import { Priority, RecurringInterval, TaskStatus } from "@shared/constants";

declare global {
  interface ITask {
    _id: string | any;
    title: string;
    status: TaskStatus;
    priority: Priority;
    recurring_interval?: RecurringInterval;
    recurring_source?: string | ITask;
    dependencies: Array<string | ITask>;
    user: string | IUser;
    created_at: string;
    updated_at: string;
  }
}

export { };
