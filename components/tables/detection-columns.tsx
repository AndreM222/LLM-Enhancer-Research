'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, Trash } from 'lucide-react';

export type DetectionSession = {
  id: string;
  images: number;
  type: string;
  detections: number;
  status: 'processing' | 'completed' | 'failed' | 'review';
  time: string;
};

function statusVariant(status: DetectionSession['status']) {
  switch (status) {
    case 'completed':
      return 'default';
    case 'processing':
      return 'secondary';
    case 'review':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function createDetectionColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<DetectionSession>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Session',
      cell: ({ row }) => (
        <div className="font-medium tabular-nums">{row.getValue<string>('id')}</div>
      ),
    },
    {
      accessorKey: 'images',
      header: 'Images',
      cell: ({ row }) => <Badge variant="outline">{row.getValue<number>('images')}</Badge>,
    },
    {
      accessorKey: 'type',
      header: 'Detection type',
      cell: ({ row }) => <span className="text-sm">{row.getValue<string>('type')}</span>,
    },
    {
      accessorKey: 'detections',
      header: 'Detections',
      cell: ({ row }) => <Badge variant="outline">{row.getValue<number>('detections')}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<DetectionSession['status']>('status');
        return <Badge variant={statusVariant(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'time',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue<string>('time')}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.getValue<string>('id'))}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}
