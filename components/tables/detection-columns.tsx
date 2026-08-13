'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { CheckCheck, ChevronRight, CloudSync, Trash, X } from 'lucide-react';
import { Project, ProjectIcon } from '../project-cards';
import { CircularProgress } from '../ui/circular-progress';

export type DetectionSession = {
  id: string;
  projectId: string;
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
    },
    {
      accessorKey: 'images',
      header: 'Images',
    },
    {
      accessorKey: 'type',
      header: 'Detection type',
    },
    {
      accessorKey: 'detections',
      header: 'Detections',
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
      cell: ({ row }) => {
        const id = row.getValue<string>('id');

        return (
          <ButtonGroup className="float-end">
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(id);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}

export function linkedDetectionColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<Project>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const { name: title, icon, color } = row.original;

        return (
          <div className="flex items-center gap-2">
            <ProjectIcon
              icon={icon}
              color={color}
              className="h-7 w-7 rounded-md"
              iconClassName="h-4 w-4"
            />
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'state',
      header: 'State',
      cell: ({ row }) => {
        const { state } = row.original;
        const currState = state === 'online';
        return (
          <CircularProgress
            variant="animated"
            size={30}
            strokeWidth={11}
            showLabel
            renderLabel={() => {
              if (currState) return <CheckCheck className="size-3" />;

              return <CloudSync className="size-3" />;
            }}
            gaugePrimaryColor={currState ? 'var(--color-sky-600)' : 'var(--color-yellow-600)'}
            value={currState ? 100 : 50}
          />
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <ButtonGroup className="float-end">
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(id);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}
