'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Copy, Trash, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export type Layout = {
  id: string;
  name: string;
  description: string;
  total: number;
};

export function createLayoutsColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void,
  onDuplicate: (id: string) => void
): ColumnDef<Layout>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Layout',
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
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup className="float-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.getValue<string>('id'));
            }}
          >
            <Trash />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(row.getValue<string>('id'));
            }}
          >
            <Copy />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(row.getValue<string>('id'));
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}

export function linkLayoutColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<Layout>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Layout',
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.getValue<string>('id'));
            }}
          >
            <X />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(row.getValue<string>('id'));
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}
