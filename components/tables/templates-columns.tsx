'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Trash, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export type Template = {
  id: string;
  name: string;
  description: string;
  total: number;
};

export function createTemplateColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<Template>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Template Name',
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
        <ButtonGroup className="-mx-7">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.getValue<string>('id'))}
          >
            <Trash />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}

export function linkTemplateColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<Template>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Template Name',
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
        <ButtonGroup className="-mx-7">
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
