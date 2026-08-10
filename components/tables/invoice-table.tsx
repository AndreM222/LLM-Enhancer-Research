'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
};

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const type: string = row.original.status;
      return <Badge variant="secondary">{type}</Badge>;
    },
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <Button
          onClick={() => console.log('Printing file ' + id + '...')}
          className="float-end"
          variant="outline"
        >
          <Download /> PDF
        </Button>
      );
    },
  },
];
