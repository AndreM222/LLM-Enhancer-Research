'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { CircularProgress } from '../ui/circular-progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export type Usage = {
  id: string;
  name: string;
  description: string;
  usedData: number;
  maxData: number;
  dataType: string;
};

export function getUsageColumns(): ColumnDef<Usage>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { usedData, maxData } = row.original;

        const normalized: number = (usedData / maxData) * 100;

        return (
          <CircularProgress
            variant="animated"
            size={16}
            strokeWidth={11}
            gaugePrimaryColor={'var(--color-sky-600)'}
            value={normalized}
          />
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const { name, description } = row.original;

        return (
          <span className="flex gap-1 items-center">
            {name}
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3 text-gray-700" />
              </TooltipTrigger>
              <TooltipContent>{description}</TooltipContent>
            </Tooltip>
          </span>
        );
      },
    },
    {
      accessorKey: 'usedData',
      header: 'Data',
      cell: ({ row }) => {
        const { usedData, maxData, dataType } = row.original;

        return (
          <span>
            {usedData}
            {dataType} / {maxData}
            {dataType}
          </span>
        );
      },
    },
  ];
}
