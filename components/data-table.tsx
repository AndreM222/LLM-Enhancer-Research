'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { useMemo, useState } from 'react';

const rowStatusVariants = cva('transition-colors', {
  variants: {
    status: {
      default: '',
      success: ['bg-emerald-500/10', 'hover:bg-emerald-500/20'].join(' '),
      warning: ['bg-amber-500/10', 'hover:bg-amber-500/20'].join(' '),
      error: ['bg-red-500/10', 'hover:bg-red-500/20'].join(' '),
      info: ['bg-blue-500/10', 'hover:bg-blue-500/20'].join(' '),
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

export type RowStatus = VariantProps<typeof rowStatusVariants>['status'];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowStatus?: (row: TData) => RowStatus;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  hideHeader,
  data,
  height = 9,
  getRowStatus,
  onRowClick,
  pageSize,
  showPaging,
}: {
  hideHeader?: boolean;
  pageSize?: number;
  showPaging?: boolean;
  height?: number;
} & DataTableProps<TData, TValue>) {
  const [page, setPage] = useState(0);

  const pageItems = useMemo(
    () => (pageSize ? data.slice(page * pageSize, page * pageSize + pageSize) : data),
    [data, page, pageSize]
  );

  const table = useReactTable({
    data: pageItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fillerCount = pageSize
    ? pageItems.length > 0
      ? pageSize - pageItems.length
      : pageSize - 1
    : 0;

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className={cn(hideHeader && 'hidden')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <>
            {table.getRowModel().rows.map((row) => {
              const status = getRowStatus?.(row.original);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    rowStatusVariants({ status }),
                    onRowClick && 'cursor-pointer',
                    `h-${height}`
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {!table.getRowModel().rows?.length && (
              <TableRow className="border-b-0">
                <TableCell colSpan={columns.length} className={`h-${height} text-center`}>
                  No results.
                </TableCell>
              </TableRow>
            )}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <TableRow
                key={`filler-${i}`}
                className={`h-${height} pointer-events-none border-b-0`}
              >
                <TableCell colSpan={columns.length} />
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
      {showPaging && pageSize && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <Button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <span>
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} of {data.length}
          </span>
          <Button
            disabled={(page + 1) * pageSize >= data.length}
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
