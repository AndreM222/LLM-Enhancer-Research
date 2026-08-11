'use client';

import { getUsageColumns, type Usage } from '@/components/tables/usage-columns';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';

export function UsageTable({
  data,
  pageSize,
}: {
  data: Usage[];
  pageSize: number;
}) {
  const columns = useMemo(() => getUsageColumns(), []);
  return (
    <DataTable
      columns={columns}
      data={data}
      hideHeader
      pageSize={pageSize}
    />
  );
}
