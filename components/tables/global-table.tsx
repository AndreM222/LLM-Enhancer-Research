'use client';

import { DataTable } from '@/components/data-table';
import {
  getGlobalActivityColumns,
  getServerActivityColumns,
  GlobeActivity,
  linkServerColumns,
  ServerActivity,
} from './global-columns';
import { useMemo } from 'react';

export function GlobalActivityTable({
  data,
  pageSize,
}: {
  data: GlobeActivity[];
  pageSize: number;
}) {
  return (
    <DataTable columns={getGlobalActivityColumns} data={data} pageSize={pageSize} showPaging />
  );
}

export function ServerActivityTable({
  data,
  pageSize,
}: {
  data: ServerActivity[];
  pageSize: number;
}) {
  return (
    <DataTable columns={getServerActivityColumns} data={data} pageSize={pageSize} showPaging />
  );
}

export function LinkServerTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: ServerActivity[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkServerColumns(onDelete, onOpen), [onDelete, onOpen]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}
