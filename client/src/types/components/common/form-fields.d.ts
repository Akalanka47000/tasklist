import { UseFormReturn } from 'react-hook-form';

export interface FormFieldProps {
  name?: string;
  form: UseFormReturn<any>;
  params?: Record<string, any>;
}
