import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const labelVariants = cva('small font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

const Label = React.forwardRef<
  HTMLLabelElement,
  React.HTMLProps<HTMLLabelElement> & VariantProps<typeof labelVariants> & { label?: string; required?: boolean }
>(({ className, label, required, children, ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants(), className)} {...props}>
    {children ?? label}
    {required && <span className="text-destructive">*</span>}
  </label>
));
Label.displayName = 'Label';

export { Label };
