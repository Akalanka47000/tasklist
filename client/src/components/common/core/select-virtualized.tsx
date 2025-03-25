import * as React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Loader2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from './command';
import { Popover, PopoverContent } from './popover';

interface SelectVirtualizedContentProps {
  items?: any[];
  trigger: React.ComponentType;
  renderItem: (item: any) => React.ReactElement;
  filterFn?: (item: any, search: string) => boolean;
  isLoading?: boolean;
  endReached?: (index: number) => void;
  searchProps?: {
    value: string;
    onChange: (arg: string) => void;
  };
}

export const SelectVirtualized = ({
  trigger: Trigger,
  items,
  renderItem,
  filterFn,
  isLoading,
  endReached,
  searchProps
}: SelectVirtualizedContentProps) => {
  const [search, setSearch] = React.useState('');

  const filteredItems = React.useMemo(() => {
    if (!search || searchProps?.value) return items;
    return items?.filter((i: any) =>
      filterFn
        ? filterFn(i, search)
        : i?.name?.toLowerCase().includes(search.toLowerCase()) ||
          i?.label?.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const loader = React.useMemo(() => {
    if (!isLoading) return <></>;
    return (
      <span className="flex w-full p-2 justify-center items-center">
        <Loader2 className="animate-spin *:!bg-[rgb(var(--foreground))]" />
      </span>
    );
  }, [isLoading]);

  const value = searchProps?.value ?? search;

  const onValueChange = searchProps?.onChange ?? setSearch;

  return (
    <Popover modal>
      <Trigger />
      <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
        <Command shouldFilter={false} className="w-full">
          <CommandInput value={value} onValueChange={onValueChange} placeholder="Search..." />
          <CommandList className="h-[10rem]">
            <CommandEmpty className="flex justify-center items-center h-[10rem] w-full">
              {isLoading ? loader : (filteredItems?.length ?? 0) > 0 ? '' : 'No records found'}
            </CommandEmpty>
            <CommandGroup>
              {(filteredItems?.length || 0) > 0 && (
                <Virtuoso
                  style={{ height: '10rem' }}
                  className="overflow-hidden w-full"
                  totalCount={filteredItems?.length || 0}
                  item={(index: number) => {
                    const item = filteredItems?.[index];
                    if (!item) return <React.Fragment />;
                    return renderItem(item);
                  }}
                  endReached={endReached}
                  footer={isLoading ? () => loader : undefined}
                />
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
