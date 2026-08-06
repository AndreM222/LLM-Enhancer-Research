'use client';

import {
  createInvitationColumns,
  linkUserColumns,
  usersListColumns,
  type User,
} from '@/components/tables/users-columns';
import { DataTable, type RowStatus } from '@/components/data-table';
import { useMemo } from 'react';

function getRowStatus(user: User): RowStatus {
  if (user.status === 'REJECTED') return 'error';
  if (user.status === 'SENT') return 'warning';
  return 'default';
}

export function CreateInvitationTable({
  data,
  pageSize,
  onDelete,
  onOpen,
  onResend,
}: {
  data: User[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onResend: (id: string) => void;
}) {
  const columns = useMemo(
    () => createInvitationColumns(onDelete, onOpen, onResend),
    [onDelete, onOpen, onResend]
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowStatus={getRowStatus}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}

export function UsersListTable({
  data,
  pageSize,
  isSuspended,
  onDelete,
  onEdit,
  onSuspended,
}: {
  data: User[];
  pageSize: number;
  isSuspended: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSuspended: (id: string) => void;
}) {
  const columns = useMemo(
    () => usersListColumns(isSuspended, onDelete, onEdit, onSuspended),
    [isSuspended, onDelete, onEdit, onSuspended]
  );
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

export function LinkUsersTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: User[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkUserColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} pageSize={pageSize} showPaging height={11} />;
}
