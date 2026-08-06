'use client';

import { rolesColumns, type Role } from '@/components/tables/roles-columns';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';

export function RolesTable({
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
  const columns = useMemo(() => rolesColumns(onDelete, onEdit), [onDelete, onEdit]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onEdit(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}
