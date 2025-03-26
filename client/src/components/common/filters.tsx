import { useCallback, useEffect, useState } from 'react';
import { default as debounce } from 'lodash/debounce';
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react';
import {
  Button,
  CommandItem,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  PopoverClose,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectVirtualized
} from '@/components';
import { CASE_INSENSITIVE_REGEX, dataAttributes, EQ, FILTER, SECONDARY_FILTER } from '@/constants';
import { useMediaQuery } from '@/hooks';
import { FilterContentProps, FilterDefinition, FilterOption, FilterProps } from '@/types';
import { cn } from '@/utils';

export function prepaginateFilters(filters: Record<string, any> = {}) {
  if (!Object.keys(filters).some((key) => key.includes(SECONDARY_FILTER))) {
    filters['prepaginate'] = true;
  }
  return filters;
}

export function computeFilters(filters: FilterDefinition[]) {
  return filters.reduce((acc: Record<string, any>, curr) => {
    const key = `${curr.secondary ? SECONDARY_FILTER : FILTER}[${curr.compoundOperator ?? curr.key}]`;
    if (curr.value) {
      const value = (curr.regexp ? CASE_INSENSITIVE_REGEX : curr.operator || EQ).replace(':value', curr.value);
      if (curr.compoundOperator) {
        if (!acc[key]) {
          acc[key] = `${curr.key}=${value}`;
        } else {
          acc[key] = `${acc[key]},${curr.key}=${value}`;
        }
      } else {
        acc[key] = value;
      }
    } else {
      if (!curr.compoundOperator) {
        delete acc[key];
      }
    }
    return acc;
  }, {});
}

function getFilterName(filter: FilterDefinition) {
  return filter.compoundOperator ? `${filter.key}-${filter.label ?? filter.placeholder}` : filter.key;
}

export function FilterContent({
  filtersLocalState,
  setFiltersLocalState,
  action,
  styles = {},
  drawer
}: FilterContentProps) {
  const onBaseFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltersLocalState(
      filtersLocalState.map((filter) => {
        if (getFilterName(filter) === e.target.name) filter.value = e.target.value;
        return filter;
      })
    );
  };

  const onFilterChange = useCallback(drawer ? onBaseFilterChange : debounce(onBaseFilterChange, 300), [
    filtersLocalState,
    drawer
  ]);

  return (
    <div className={cn('w-full flex flex-col justify-start items-center gap-6', styles.root)}>
      {action}
      {filtersLocalState.map((filter, index) => {
        return (
          <div key={`filter-${filter.key}-${index}`} className={cn('w-full', styles.filter, filter.className)}>
            <div className="w-full flex flex-col">
              {filter.showFormLabel && <label className="text-xs pb-1.5">{filter.label ?? filter.placeholder} </label>}
              {filter.options ? (
                filter.virtualized ? (
                  <SelectVirtualized
                    items={filter.options}
                    renderItem={(option: any) => (
                      <PopoverClose className="w-full">
                        <CommandItem
                          className="text-left"
                          onSelect={() => {
                            onFilterChange({
                              target: {
                                name: getFilterName(filter),
                                value: option.key
                              }
                            } as any);
                          }}>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4 shrink-0',
                              filter.value === option.key ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      </PopoverClose>
                    )}
                    trigger={() => (
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between sm:px-3">
                          <span className="grow truncate text-left">
                            {filter.value
                              ? filter.options?.find((item) => item.key === filter.value)?.label
                              : (filter.placeholder ?? 'Select')}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    )}
                    filterFn={(item: FilterOption, search: string) =>
                      item.label.toLowerCase().includes(search.toLowerCase())
                    }
                  />
                ) : (
                  <Select
                    name={filter.key}
                    value={drawer ? filter.value : undefined}
                    onValueChange={(value: string) => {
                      onFilterChange({
                        target: {
                          name: getFilterName(filter),
                          value: value
                        }
                      } as any);
                    }}>
                    <SelectTrigger id={filter.key}>
                      <SelectValue placeholder={filter.placeholder ?? filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.key} value={option.key as any}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              ) : (
                <Input
                  value={drawer ? filter.value : undefined}
                  placeholder={filter.placeholder ?? `Search by ${filter.label?.toLowerCase()}`}
                  name={getFilterName(filter)}
                  type={filter.inputType}
                  onChange={onFilterChange}
                  {...{ [dataAttributes.testId]: `filter-${filter.key}` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Filters({ drawer, definitions, setFilters, ...props }: FilterProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  const [filtersLocalState, setFiltersLocalState] = useState(JSON.parse(JSON.stringify(definitions)));

  useEffect(() => {
    if (!drawer) {
      setFilters(computeFilters(filtersLocalState));
    }
  }, [filtersLocalState, drawer]);

  useEffect(() => {
    if (definitions.length !== filtersLocalState.length) {
      setFiltersLocalState(JSON.parse(JSON.stringify(definitions)));
    }
  }, [definitions, filtersLocalState]);

  if (!drawer) {
    return (
      <FilterContent
        {...props}
        styles={{
          ...props.styles,
          root: cn(props.styles?.root, 'md:flex-row'),
          filter: cn(props.styles?.filter, 'max-w-sm self-start')
        }}
        filtersLocalState={filtersLocalState}
        setFiltersLocalState={setFiltersLocalState}
      />
    );
  }

  function onApply() {
    setFilters(computeFilters(filtersLocalState));
  }

  function onReset() {
    setFiltersLocalState([...definitions]);
    setFilters({});
  }

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-10 p-0 sm:p-0 shrink-0">
          <Filter className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[calc(100dvh-1.5rem)] sm:max-h-full sm:h-full w-full sm:w-[400px] sm:right-0 sm:rounded-none">
        <div className="overflow-y-auto h-full flex flex-col relative">
          <DrawerHeader className="bg-background rounded-t-lg sticky top-0 container max-w-screen-xl z-10 border-b border-border/60">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerClose asChild>
              <Button size="sm" className="w-[1.125rem] h-[1.125rem] p-0 absolute top-4 right-4" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <FilterContent
            {...props}
            drawer
            styles={{
              ...props.styles,
              root: cn(props.styles?.root, 'gap-3 p-4'),
              filter: cn(props.styles?.filter)
            }}
            filtersLocalState={filtersLocalState}
            setFiltersLocalState={setFiltersLocalState}
          />
          <DrawerFooter className="flex-col-reverse sm:flex-row container max-w-screen-xl sticky bottom-0 border-t border-border/60 bg-background">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline" onClick={onReset}>
                Reset
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button className="w-full" onClick={onApply}>
                Apply
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default Filters;
