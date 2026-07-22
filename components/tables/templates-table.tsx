'use client';

import { useMemo } from 'react';
import {
  createTemplateColumns,
  linkTemplateColumns,
  type Template,
} from '@/components/tables/templates-columns';
import { DataTable } from '@/components/data-table';

export function CreateTemplateTable({
  data,
  onDelete,
  onOpen,
  onDuplicate,
}: {
  data: Template[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const columns = useMemo(
    () => createTemplateColumns(onDelete, onOpen, onDuplicate),
    [onDelete, onOpen, onDuplicate]
  );
  return <DataTable columns={columns} data={data} onRowClick={(row) => onOpen(row.id)} />;
}

export function LinkTemplateTable({
  data,
  onDelete,
  onOpen,
}: {
  data: Template[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkTemplateColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} />;
}
