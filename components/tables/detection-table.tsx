'use client';

import { DataTable, type RowStatus } from '@/components/data-table';
import { type DetectionSession, createDetectionColumns } from './detection-columns';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

function getRowStatus(session: DetectionSession): RowStatus {
  if (session.status === 'failed') return 'error';
  if (session.status === 'processing') return 'warning';
  if (session.status === 'completed') return 'success';
  return 'default';
}

export function CreateDetectionTable({
  data,
  onDeleteAction: onDelete,
}: {
  data: DetectionSession[];
  onDeleteAction: (id: string) => void;
}) {
  const columns = useMemo(() => createDetectionColumns(onDelete), [onDelete]);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowStatus={getRowStatus}
      onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
    />
  );
}
