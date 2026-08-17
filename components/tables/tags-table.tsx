'use client';

import { useMemo } from 'react';
import {
  createTagItemColumns,
  createTagsColumns,
  linkTagsColumns,
  TagItem,
  type TagGroup,
} from '@/components/tables/tags-columns';
import { DataTable } from '@/components/data-table';

export function CreateTagGroupTable({
  data,
  pageSize,
  onDelete,
  onOpen,
  onDuplicate,
}: {
  data: TagGroup[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const columns = useMemo(
    () => createTagsColumns(onDelete, onDuplicate, onOpen),
    [onDelete, onDuplicate, onOpen]
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}

export function CreateTagItemTable({
  data,
  pageSize,
  onDelete,
  onEdit,
}: {
  data: TagItem[];
  pageSize: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const columns = useMemo(() => createTagItemColumns(onDelete, onEdit), [onDelete, onEdit]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onEdit(row.id)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}

export function LinkTagGroupTable({
  data,
  pageSize,
  onDelete,
  onOpen,
}: {
  data: TagGroup[];
  pageSize: number;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkTagsColumns(onDelete, onOpen), [onDelete, onOpen]);
  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => onOpen(row.id)}
      pageSize={pageSize}
      showPaging
      height={12}
    />
  );
}
