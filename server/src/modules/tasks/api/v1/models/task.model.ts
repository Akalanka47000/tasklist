import mongoose from 'mongoose';
import { audit, AuditType, schemaOptions } from '@/database/mongo';
import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.NotDone,
      index: true
    },
    priority: {
      type: Number,
      enum: Object.values(Priority).filter(Number),
      required: true,
      index: true
    },
    recurring_interval: {
      type: String,
      enum: Object.values(RecurringInterval),
      index: true
    },
    recurring_source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      index: true
    },
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        index: true
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  schemaOptions
);

TaskSchema.index({ created_at: -1 });

TaskSchema.plugin(audit, {
  types: [AuditType.Edit, AuditType.Delete]
});

export const Task = mongoose.paginatedModel<ITask>('Task', TaskSchema);

export default Task;
