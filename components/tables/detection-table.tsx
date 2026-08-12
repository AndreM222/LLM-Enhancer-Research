'use client';

import { DataTable, type RowStatus } from '@/components/data-table';
import {
  type DetectionSession,
  createDetectionColumns,
  linkedDetectionColumns,
} from './detection-columns';
import { useMemo } from 'react';
import { Project } from '../project-cards';

function getRowStatus(session: DetectionSession): RowStatus {
  if (session.status === 'failed') return 'error';
  if (session.status === 'processing') return 'warning';
  return 'default';
}

export function CreateDetectionTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: DetectionSession[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => createDetectionColumns(onDelete, onOpen), [onDelete, onOpen]);

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

export function LinkDetectionTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: Project[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkedDetectionColumns(onDelete, onOpen), [onDelete, onOpen]);

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={11}
    />
  );
}
