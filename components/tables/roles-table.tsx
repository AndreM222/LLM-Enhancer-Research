'use client';

import { rolesColumns, type Role } from '@/components/tables/roles-columns';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';

export function RolesTable({
  data,
  onDelete,
  onOpen,
}: {
  data: Role[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => rolesColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} onRowClick={(row) => onOpen(row.id)} />;
}
