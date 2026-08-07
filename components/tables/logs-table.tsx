'use client';

import { columns, type Log } from '@/components/tables/logs-columns';
import { DataTable, type RowStatus } from '@/components/data-table';

function getRowStatus(log: Log): RowStatus {
  if (log.status >= 500) return 'error';
  if (log.status >= 400) return 'warning';
  if (log.status >= 200 && log.status < 300) return 'success';
  return 'default';
}

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
      getRowStatus={getRowStatus}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}
