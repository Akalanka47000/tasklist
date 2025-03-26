export interface FilterOption {
  key: string | number;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label?: string;
  placeholder?: string;
  value?: any;
  options?: FilterOption[];
  regexp?: boolean;
  secondary?: boolean;
  operator?: string;
  inputType?: string;
  showFormLabel?: boolean;
  compoundOperator?: string;
  className?: string;
  virtualized?: boolean;
}

export interface FilterProps {
  definitions: FilterDefinition[];
  setFilters: (filters: Record<string, any>) => void;
  action?: React.ReactNode;
  styles?: {
    root?: string;
    filter?: string;
  };
  drawer?: boolean;
}

export interface FilterContentProps extends Partial<FilterProps> {
  filtersLocalState: FilterDefinition[];
  setFiltersLocalState: (filters: FilterDefinition[]) => void;
}
