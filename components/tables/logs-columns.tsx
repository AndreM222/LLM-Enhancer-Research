'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';

export type LogError = {
  code?: string;
  message: string;
  details?: unknown;
};

export type Log = {
  id: string;
  request: string;
  type: string;
  status: number;
  time: string;
  response?: unknown;
  error?: LogError;
};

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<number>('status');
      const variant =
        status >= 500
          ? 'destructive'
          : status >= 400
            ? 'secondary'
            : status >= 200 && status < 300
              ? 'default'
              : 'outline';
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
