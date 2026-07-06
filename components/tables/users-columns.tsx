'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';

export type User = {
  id: string;
  request: string;
  type: string;
  status: string;
  time: string;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    accessorKey: 'request',
    header: 'Request',
  },
];
