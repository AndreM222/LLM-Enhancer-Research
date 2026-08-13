'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { methodVariant } from '@/app/logs/page';

export type LogError = {
  code?: string;
  message: string;
  details?: unknown;
};

export type Log = {
  id: string;
  serviceId: string;
  request: string;
  type: string;
  status: number;
  time: string;
  response?: unknown;
  error?: LogError;
};

export const logColumns: ColumnDef<Log>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type: string = row.original.type;
      return <Badge variant={methodVariant(type)}>{type}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
