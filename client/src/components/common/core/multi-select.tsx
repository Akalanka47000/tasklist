import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button, CommandItem, PopoverTrigger, SelectVirtualized } from '@/components';
import { cn } from '@/utils';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  placeholder?: string;
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading?: boolean;
  endReached?: (index: number) => void;
  searchProps?: {
    value: string;
    onChange: (arg: string) => void;
  };
}

function MultiSelect({
  options,
  placeholder,
  selected,
  onChange,
  isLoading,
  endReached,
  searchProps
}: MultiSelectProps) {
  return (
    <SelectVirtualized
      items={options}
      renderItem={(option: OptionType) => (
        <CommandItem
          key={option.value}
          onSelect={() => {
            onChange(
              selected.includes(option.value)
                ? selected.filter((item) => item !== option.value)
                : [...selected, option.value]
            );
          }}>
          <Check className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
          {option.label}
        </CommandItem>
      )}
      trigger={() => (
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className={`w-full justify-between hover:bg-muted ${selected.length > 1 ? 'h-full' : 'h-10'}`}>
            {selected.length ? (
              <div className="flex gap-1 flex-wrap text-sm font-normal">
                {selected.length} item{selected.length > 1 ? 's' : ''} selected
              </div>
            ) : (
              placeholder && <span className="opacity-50 font-normal text-sm">{placeholder}</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      )}
      endReached={endReached}
      isLoading={isLoading}
      searchProps={searchProps}
    />
  );
}

export { MultiSelect };
