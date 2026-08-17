'use client';

import { createRolesColumns, linkRolesColumns, type Role } from '@/components/tables/roles-columns';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';

export function CreateRolesTable({
  data,
  pageSize,
  onDelete,
  onEdit,
}: {
  data: Role[];
  pageSize: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const columns = useMemo(() => createRolesColumns(onDelete, onEdit), [onDelete, onEdit]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onEdit(row.id)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}

export function LinkedRolesTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: Role[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkRolesColumns(onDelete, onOpen), [onDelete, onOpen]);
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
