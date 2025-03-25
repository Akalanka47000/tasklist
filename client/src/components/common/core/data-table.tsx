import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Loader2
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components';
import { LIMIT, LIMIT_10, PAGE } from '@/constants';
import { cn } from '@/utils';
import { UseQueryResult } from '@tanstack/react-query';
import {
  Column,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';

export interface DataTableProps {
  columns: any[];
  filters?: React.ReactNode;
  useDataFetcher: {
    fn: <T>(...args: any[]) => UseQueryResult<IPaginatedResponseData<T>>;
    params: Record<string, any>;
    onSuccess?: (data: IPaginatedResponseData<any>) => void;
  };
  pageSize?: number;
  paginate?: boolean;
  className?: string;
  filterContainerClassName?: string;
  endComponentClassName?: string;
  /** A react component which will render on the top right side of the table */
  endComponent?: React.ReactNode;
}

export function DataTable({
  columns,
  filters,
  useDataFetcher,
  pageSize = LIMIT_10,
  paginate = true,
  className,
  filterContainerClassName,
  endComponentClassName,
  endComponent
}: DataTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize
  });

  const { data, isFetching, isLoading } = useDataFetcher.fn({
    ...(paginate && {
      [PAGE]: pagination.pageIndex + 1,
      [LIMIT]: pagination.pageSize
    }),
    params: {
      ...useDataFetcher.params,
      ...sorting.reduce(
        (acc, curr) => {
          acc[`sort[${curr.id}]`] = curr.desc ? -1 : 1;
          return acc;
        },
        {} as Record<string, number>
      )
    }
  });

  useEffect(() => {
    if (paginate) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0
      }));
    }
  }, [useDataFetcher.params, paginate]);

  useEffect(() => {
    if (useDataFetcher.onSuccess && data) useDataFetcher.onSuccess(data);
  }, [useDataFetcher.onSuccess, data]);

  const table = useReactTable({
    data: (paginate ? data?.docs : (data as any)) ?? [],
    columns,
    rowCount: data?.totalDocs ?? (data as any)?.length ?? 0,
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <>
      <div className={cn('h-full w-full flex flex-col gap-4', className)}>
        <div className="flex flex-col gap-4 grow">
          <div className={cn('flex items-center gap-4', filterContainerClassName)}>
            {filters}
            <div className={cn('ml-auto flex items-center justify-end gap-4', endComponentClassName)}>
              {endComponent}
            </div>
          </div>
          <div className="rounded-md border border-border/60">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as any;
                      return (
                        <TableHead
                          key={header.id}
                          className={cn('px-4', meta?.headerClassName, meta?.className)}
                          style={{ minWidth: `${header.column.columnDef.minSize}px` }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton className="w-full h-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  (table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        className={cn('transition duration-150', isFetching && 'opacity-50 pointer-events-none')}
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => {
                          const meta = cell.column.columnDef.meta as any;
                          return (
                            <TableCell key={cell.id} className={cn('px-4', meta?.cellClassName, meta?.className)}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {paginate && (
          <div className="flex items-center justify-end space-x-2">
            {data?.docs && (
              <div className="flex-1 text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + (table.getPageCount() ? 1 : 0)} of{' '}
                {table.getPageCount().toLocaleString()}
              </div>
            )}
            <div className="space-x-2 flex gap-2 mb-4 items-center">
              {isFetching && <Loader2 className="animate-spin" />}
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 w-8 h-8 p-0"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 w-8 h-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                className="gap-2 w-8 h-8 p-0"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                className="gap-2 w-8 h-8 p-0"
                size="sm"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }
  const iconClassName = 'ml-1.5 h-4 w-4';
  const meta = column?.columnDef?.meta as any;
  return (
    <div className={cn('flex items-center space-x-2', className, meta?.headerClassName, meta?.className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className=" h-8 data-[state=open]:bg-accent ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className={iconClassName} />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className={iconClassName} />
            ) : (
              <ChevronsUpDown className={iconClassName} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="min-w-[5rem]">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)} className="flex justify-center">
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)} className="flex justify-center">
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DataTable;
