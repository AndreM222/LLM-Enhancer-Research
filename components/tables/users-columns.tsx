'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, Trash, X } from 'lucide-react';

export type User = {
  id: string;
  status: string;
  role: string;
  name: string;
  time: string;
};

export function createUserColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        const variant = (() => {
          switch (status) {
            case 'SENT':
              return 'default';
            case 'REJECTED':
              return 'destructive';
            default:
              return 'outline';
          }
        })();

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup>
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

export function linkUserColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        const variant = (() => {
          switch (status) {
            case 'SENT':
              return 'default';
            case 'REJECTED':
              return 'destructive';
            default:
              return 'outline';
          }
        })();

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup>
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
