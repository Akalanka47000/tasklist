import { RecurringInterval } from '@shared/constants';
import { traced } from '@sliit-foss/functions';
import { moduleLogger } from '@sliit-foss/module-logger';
import { default as schedule } from 'node-schedule';
import { redis, Redlock } from '@/database/redis';
import { batchProcessRecurringTasks, createTask } from '../repository';

const logger = moduleLogger('Recurrence-Manager');

export class RecurrenceManager {
  /**
   * Locks and resynchronizes all recurring task creations on server startup. The lock prevents the same task from being scheduled multiple times.
   */
  static initialize() {
    redis.lockdown(`initialize-recurring-task-creation`, async (lock: Redlock.Lock) => {
      if (lock.attempts > 1) return;
      logger.info(`Syncing recurring tasks`);
      await schedule.gracefulShutdown();
      batchProcessRecurringTasks(this.scheduleTaskCreation);
    });
  }

  /**
   * Schedules a recurring task to be created based on a given task
   * @param task The base task details to be cloned.
   */
  static scheduleTaskCreation(task: ITask) {
    if (!task.recurring_interval) {
      return logger.warn(`Skipping recurring task creation since there is no recurrence interval specified`);
    }
    const createdTime = new Date(task.created_at);
    const rule = new schedule.RecurrenceRule();
    switch (task.recurring_interval) {
      case RecurringInterval.Daily:
        rule.hour = createdTime.getHours();
        rule.minute = createdTime.getMinutes();
        rule.second = createdTime.getSeconds();
        break;

      case RecurringInterval.Weekly:
        rule.dayOfWeek = createdTime.getDay(); // 0-6 (Sunday-Saturday)
        rule.hour = createdTime.getHours();
        rule.minute = createdTime.getMinutes();
        rule.second = createdTime.getSeconds();
        break;

      case RecurringInterval.Monthly:
        rule.date = createdTime.getDate();
        rule.hour = createdTime.getHours();
        rule.minute = createdTime.getMinutes();
        rule.second = createdTime.getSeconds();
        break;

      default:
        logger.warn('Unsupported interval type:', task.recurring_interval);
        return;
    }
    schedule.scheduleJob(task._id.toString(), rule, () => {
      traced['schedule'](createTask)({
        title: task.title,
        user: task.user,
        priority: task.priority,
        recurring_source: task._id,
        dependencies: task.dependencies
      });
    });
  }

  /**
   * Reschedules a recurring task to be created based on a given task
   * @param task The updated task details to be cloned.
   */
  static rescheduleTaskCreation(task: ITask) {
    const cancelled = this.cancelTaskCreation(task);
    if (!cancelled) {
      logger.error(`Failed to cancel task creation during rescehdule ${task._id}`);
      return;
    }
    this.scheduleTaskCreation(task);
  }

  /**
   * Cancels the given recurring task's schedule job
   * @param task The task details to be canceled.
   */
  static cancelTaskCreation(task: ITask) {
    return schedule.cancelJob(schedule.scheduledJobs[task._id]);
  }
}

RecurrenceManager.initialize();
