'use client';

import { useMemo } from 'react';
import {
  createLayoutsColumns,
  linkLayoutColumns,
  type Layout,
} from '@/components/tables/layouts-columns';
import { DataTable } from '@/components/data-table';

export function CreateLayoutsTable({
  data,
  pageSize,
  onDelete,
  onOpen,
  onDuplicate,
}: {
  data: Layout[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const columns = useMemo(
    () => createLayoutsColumns(onDelete, onOpen, onDuplicate),
    [onDelete, onOpen, onDuplicate]
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}

export function LinkLayoutsTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: Layout[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkLayoutColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} pageSize={pageSize} showPaging height={11} />;
}
