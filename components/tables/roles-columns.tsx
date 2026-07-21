'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';

export type Role = {
  id: string;
  name: string;
  isDefault: boolean;
  description: string;
  permissions: string[];
};

export function rolesColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<Role>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Role',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue<string>('description');

        return <div>{description ? description : <span className="font-bold">- - -</span>}</div>;
      },
    },
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }) => {
        const isDefault = row.getValue<boolean>('isDefault');

        return (
          <div>{isDefault ? <Badge>Default</Badge> : <span className="font-bold">- - -</span>}</div>
        );
      },
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const roles = row.getValue<string[]>('permissions');

        let total: number = roles.length;

        return <div>{total}</div>;
      },
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const roleId = row.getValue<string>('id');

        return (
          <ButtonGroup>
            <Button size="sm" variant="destructive" onClick={() => onDelete(roleId)}>
              <Trash />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onOpen(roleId)}>
              <ChevronRight />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}
