'use client';

import { useMemo } from 'react';
import {
  createTagsColumns,
  linkTagsColumns,
  type TagGroup,
} from '@/components/tables/tags-columns';
import { DataTable } from '@/components/data-table';

export function CreateTagGroupTable({
  data,
  onDelete,
  onOpen,
}: {
  data: TagGroup[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => createTagsColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} />;
}

export function LinkTagGroupTable({
  data,
  onDelete,
  onOpen,
}: {
  data: TagGroup[];
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo(() => linkTagsColumns(onDelete, onOpen), [onDelete, onOpen]);
  return <DataTable columns={columns} data={data} />;
}
