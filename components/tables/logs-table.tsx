'use client';

import { columns, type Log } from '@/components/tables/logs-columns';
import { DataTable } from '@/components/data-table';
import { getStatusTone } from '@/app/logs/page';

export function LogsTable({
  data,
  pageSize,
  onOpen,
}: {
  data: Log[];
  pageSize: number;
  onOpen: (id: string) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowStatus={(log) => getStatusTone(log.status)}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}
