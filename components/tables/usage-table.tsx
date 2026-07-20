'use client';

import { getUsageColumns, type Usage } from '@/components/tables/usage-columns';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';

export function UsageTable({ data, onOpen }: { data: Usage[]; onOpen: (id: string) => void }) {
  const columns = useMemo(() => getUsageColumns(onOpen), [onOpen]);
  return <DataTable columns={columns} data={data} hideHeader />;
}
