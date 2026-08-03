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

export function GlobalActivityTable({ data }: { data: GlobeActivity[] }) {
  return <DataTable columns={getGlobalActivityColumns} data={data} />;
}

export function ServerActivityTable({ data }: { data: ServerActivity[] }) {
  return <DataTable columns={getServerActivityColumns} data={data} />;
}

export function LinkServerTable({
  data,
  onDelete,
  onOpen,
}: {
  data: ServerActivity[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkServerColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} onRowClick={(row) => onOpen(row.id)} />;
}
