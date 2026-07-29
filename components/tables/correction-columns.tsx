'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, Info } from 'lucide-react';
import { CircularProgress } from '../ui/circular-progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export type Correction = {
  id: string;
  name: string;
  description: string;
  detections: number;
  corrections: number;
};

export function getCorrectionColumns(onOpen: (id: string) => void): ColumnDef<Correction>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Label',
    },
    {
      accessorKey: 'detections',
      header: 'Detections',
    },
    {
      accessorKey: 'corrections',
      header: 'Corrections',
    },
    {
      accessorKey: 'description',
      header: 'Corrections rate',
      cell: ({ row }) => {
        const { corrections, detections, description } = row.original;

        const normalized: number = (corrections / detections) * 100;

        return (
          <div className="flex space-x-1 items-center">
            <span>{normalized.toFixed(0)}%</span>
            <CircularProgress
              variant="animated"
              size={16}
              strokeWidth={11}
              gaugePrimaryColor={'var(--color-sky-600)'}
              value={normalized}
            />

            {description ?? (
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-3 text-gray-700" />
                </TooltipTrigger>
                <TooltipContent>{description}</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => (
        <ButtonGroup>
          <Button size="xs" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}
