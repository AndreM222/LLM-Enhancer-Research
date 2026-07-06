'use client';

import { columns, type Role } from '@/components/tables/roles-columns';
import { DataTable } from '@/components/data-table';

export function RolesTable({ data }: { data: Role[] }) {
  return <DataTable columns={columns} data={data} />;
}
