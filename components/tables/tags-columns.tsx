'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Copy, Pen, Trash, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export type TagGroup = {
  id: string;
  name: string;
  description?: string;
  total: number;
};

export type TagItem = {
  id: string;
  name: string;
  description?: string;
  color: string;
};

export function createTagItemColumns(
  onDelete: (id: string) => void,
  onEdit: (id: string) => void
): ColumnDef<TagItem>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tag',
      cell: ({ row }) => {
        const { name, color } = row.original;

        return (
          <span className="flex gap-2 items-center">
            <div style={{ background: color }} className={`h-5 w-5 rounded-full`} /> {name}
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue<string>('description');
        return <div>{description ? description : <span className="font-bold">- - -</span>}</div>;
      },
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup className="float-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.getValue<string>('id'))}
          >
            <Trash />
          </Button>

          <Button size="sm" variant="outline" onClick={() => onEdit(row.getValue<string>('id'))}>
            <Pen />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}

export function createTagsColumns(
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<TagGroup>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tag Group',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue<string>('description');
        return <div>{description ? description : <span className="font-bold">- - -</span>}</div>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <div>{row.getValue<number>('total')}</div>,
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup className="float-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.getValue<string>('id'))}
          >
            <Trash />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onDuplicate(row.getValue<string>('id'))}
          >
            <Copy />
          </Button>

          <Button size="sm" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}

export function linkTagsColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<TagGroup>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Tag Group',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue<string>('description');
        return <div>{description ? description : <span className="font-bold">- - -</span>}</div>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <div>{row.getValue<number>('total')}</div>,
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup className="float-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.getValue<string>('id'))}
          >
            <X />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}
