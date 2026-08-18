'use client';

import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';
import { SecretKey, secretKeysColumns } from '@/components/tables/secrets-columns';

export function SecretsKeyTable({
  data,
  pageSize,
  onDelete,
  onEdit,
}: {
  data: SecretKey[];
  pageSize: number;
  onDelete: (id: SecretKey) => void;
  onEdit: (id: SecretKey) => void;
}) {
  const columns = useMemo(() => secretKeysColumns(onEdit, onDelete), [onEdit, onDelete]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onEdit(row)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}
