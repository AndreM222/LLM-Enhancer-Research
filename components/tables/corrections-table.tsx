'use client';

import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';
import { type Correction, getCorrectionColumns } from '@/components/tables/correction-columns';

export function CorrectionsTable({
  data,
  pageSize,
  onOpen,
}: {
  data: Correction[];
  pageSize: number;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => getCorrectionColumns(onOpen), [onOpen]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      hideHeader
      showPaging
    />
  );
}
