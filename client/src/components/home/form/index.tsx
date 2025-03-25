import { UseFormReturn } from 'react-hook-form';
import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components';
import { useTaskStore } from '@/store/task';
import { cn } from '@/utils';
import { default as DependencyFormField } from './dependencies';
import { FormSchema } from './schema';

export * from './schema';

export default function TaskForm({
  form,
  className
}: {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  className?: string;
}) {
  const selectedTask = useTaskStore((state) => state.selectedTask);
  return (
    <div className={cn('flex flex-col gap-3 sm:gap-4', className)}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel label="Name" required />
            <FormControl>
              <Input type="text" placeholder="Enter task name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="priority"
        render={({ field: { onChange, name, value, disabled } }) => (
          <FormItem>
            <FormLabel label="Priority" required />
            <FormControl>
              <Select
                name={name}
                defaultValue={value !== undefined ? value.toString() : undefined}
                disabled={disabled}
                onValueChange={(value) => onChange(Number(value))}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority)
                    .filter(Number)
                    .map((p) => (
                      <SelectItem key={p} value={String(p)}>
                        {Priority[Number(p)]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedTask && (
        <FormField
          control={form.control}
          name="status"
          render={({ field: { onChange, name, value, disabled } }) => (
            <FormItem>
              <FormLabel label="Status" />
              <FormControl>
                <Select name={name} defaultValue={value} disabled={disabled} onValueChange={onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TaskStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="recurring_interval"
        render={({ field: { onChange, name, value, disabled } }) => (
          <FormItem>
            <FormLabel label="Recurring Interval" />
            <FormControl>
              <Select name={name} defaultValue={value} disabled={disabled} onValueChange={onChange}>
                <SelectTrigger id="recurring_interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RecurringInterval).map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <DependencyFormField form={form} />
    </div>
  );
}
