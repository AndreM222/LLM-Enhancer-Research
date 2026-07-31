'use client';

import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';
import { type Correction, getCorrectionColumns } from './correction-columns';

export function CorrectionsTable({
  data,
  onOpen,
}: {
  data: Correction[];
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => getCorrectionColumns(onOpen), [onOpen]);
  return <DataTable columns={columns} data={data} onRowClick={(row) => onOpen(row.id)} />;
}
