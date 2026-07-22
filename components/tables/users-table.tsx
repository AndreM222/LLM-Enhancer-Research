'use client';

import { createUserColumns, linkUserColumns, type User } from '@/components/tables/users-columns';
import { DataTable, type RowStatus } from '@/components/data-table';
import { useMemo } from 'react';

function getRowStatus(user: User): RowStatus {
  if (user.status === 'REJECTED') return 'error';
  if (user.status === 'SENT') return 'warning';
  return 'default';
}

export function CreateUsersTable({
  data,
  onDelete,
  onOpen,
}: {
  data: User[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => createUserColumns(onDelete, onOpen), [onDelete, onOpen]);
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowStatus={getRowStatus}
      onRowClick={(row) => onOpen(row.id)}
    />
  );
}

export function LinkUsersTable({
  data,
  onDelete,
  onOpen,
}: {
  data: User[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkUserColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} getRowStatus={getRowStatus} />;
}
