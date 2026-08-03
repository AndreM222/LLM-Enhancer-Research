'use client';

import { ColumnDef } from '@tanstack/react-table';

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
