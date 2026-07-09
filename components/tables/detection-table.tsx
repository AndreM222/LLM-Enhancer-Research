'use client';

import { DataTable, type RowStatus } from '@/components/data-table';
import { type DetectionSession, createDetectionColumns } from './detection-columns';
import { useMemo } from 'react';

function getRowStatus(session: DetectionSession): RowStatus {
  if (session.status === 'failed') return 'error';
  if (session.status === 'processing') return 'warning';
  if (session.status === 'completed') return 'success';
  return 'default';
}

export function CreateDetectionTable({
  data,
  onDelete,
}: {
  data: DetectionSession[];
  onDelete: (id: string) => void;
}) {
  const columns = useMemo(() => createDetectionColumns(onDelete), [onDelete]);
  return <DataTable columns={columns} data={data} getRowStatus={getRowStatus} />;
}
