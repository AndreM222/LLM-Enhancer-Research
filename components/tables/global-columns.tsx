'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, X } from 'lucide-react';
import Flag from 'react-world-flags';
import { cn } from '@/lib/utils';

export type GlobeActivity = {
  name: string;
  requests: number;
  countryCode: string;
  bandwidth: string;
};

export type ServerActivity = {
  id: string;
  region: string;
  countryCode: string;
  status: 'healthy' | 'degraded' | 'down';
  requests: number;
  dataTransferred: string;
  avgResponseMs: number;
  lat: number;
  lon: number;
};

const STATUS_STYLE: Record<
  ServerActivity['status'],
  { dot: string; text: string; label: string; pulse: boolean }
> = {
  healthy: { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Healthy', pulse: false },
  degraded: { dot: 'bg-amber-500', text: 'text-amber-600', label: 'Degraded', pulse: true },
  down: { dot: 'bg-red-500', text: 'text-red-600', label: 'Down', pulse: true },
};

export function ServerIndicator({ status }: { status: ServerActivity['status'] }) {
  const style = STATUS_STYLE[status];
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        {style.pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              style.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', style.dot)} />
      </span>
      <span className={cn('text-sm font-medium', style.text)}>{style.label}</span>
    </div>
  );
}

export const getGlobalActivityColumns: ColumnDef<GlobeActivity>[] = [
  {
    accessorKey: 'name',
    header: 'Country',
    cell: ({ row }) => {
      const { name, countryCode } = row.original;
      return (
        <span className="gap-2 flex">
          <Flag className="h-4 w-4" code={countryCode} /> {name}
        </span>
      );
    },
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
    id: 'region',
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => {
      const { region, countryCode } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Flag code={countryCode} style={{ width: 20, height: 15, borderRadius: 2 }} />
          <span className="font-medium">{region}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ServerIndicator status={row.original.status} />,
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
      id: 'region',
      accessorKey: 'region',
      header: 'Region',
      cell: ({ row }) => {
        const { region, countryCode } = row.original;
        return (
          <div className="flex items-center gap-2">
            <Flag code={countryCode} style={{ width: 20, height: 15, borderRadius: 2 }} />
            <span className="font-medium">{region}</span>
          </div>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <ServerIndicator status={row.original.status} />,
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup className="float-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original.id);
            }}
          >
            <X />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(row.original.id);
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}
