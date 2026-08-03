'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, X } from 'lucide-react';

export type GlobeActivity = {
  name: string;
  requests: number;
  bandwidth: string;
};

export type ServerActivity = {
  id: string;
  region: string;
  status: string;
  requests: number;
  dataTransferred: string;
  avgResponseMs: number;
  lat: number;
  lon: number;
};

export const getGlobalActivityColumns: ColumnDef<GlobeActivity>[] = [
  {
    accessorKey: 'name',
    header: 'Country',
  },
  {
    accessorKey: 'requests',
    header: 'Requests',
  },
  {
    accessorKey: 'bandwidth',
    header: 'Bandwidth',
  },
];

export const getServerActivityColumns: ColumnDef<ServerActivity>[] = [
  {
    accessorKey: 'region',
    header: 'Region',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'requests',
    header: 'Requests',
  },
  {
    accessorKey: 'dataTransferred',
    header: 'Data transferred',
  },
  {
    accessorKey: 'avgResponseMs',
    header: 'Avg. response time',
  },
];

export function linkServerColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<ServerActivity>[] {
  return [
    {
      accessorKey: 'region',
      header: 'Region',
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
