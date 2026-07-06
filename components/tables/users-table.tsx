'use client';

import { columns, type User } from '@/components/tables/users-columns';
import { DataTable, type RowStatus } from '@/components/data-table';

function getRowStatus(user: User): RowStatus {
  if (user.status === 'REJECTED') return 'error';
  if (user.status === 'SENT') return 'warning';
  return 'default';
}

export function UsersTable({ data }: { data: User[] }) {
  return <DataTable columns={columns} data={data} getRowStatus={getRowStatus} />;
}
