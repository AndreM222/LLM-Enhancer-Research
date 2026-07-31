'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, Pause, RotateCcw, Trash, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { pictureFallback } from '../user-button';

export type User = {
  id: string;
  status: string;
  role: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  time: string;
};

export function createInvitationColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        const variant = (() => {
          switch (status) {
            case 'SENT':
              return 'default';
            case 'REJECTED':
              return 'destructive';
            default:
              return 'outline';
          }
        })();

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const { id, status } = row.original;

        return (
          <ButtonGroup className="float-end">
            <Button size="sm" variant="destructive" onClick={() => onDelete(id)}>
              <Trash />
            </Button>
            {status.toUpperCase() !== 'ACCEPTED' && (
              <Button size="sm" variant="outline" onClick={() => onDelete(id)}>
                <RotateCcw />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onOpen(id)}>
              <ChevronRight />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}

export function usersListColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => {
        const { name, email, avatarUrl } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <Avatar className={cn('rounded-full')}>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className={cn('rounded-full')}>
                {pictureFallback(name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className={'truncate font-medium'}>{name}</span>
              <span className={'truncate text-muted-foreground'}>{email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const { role } = row.original;

        return <Badge variant="outline">{role}</Badge>;
      },
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
            <Trash />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(row.getValue<string>('id'))}>
            <Pause />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpen(row.getValue<string>('id'))}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
  ];
}

export function linkUserColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        const variant = (() => {
          switch (status) {
            case 'SENT':
              return 'default';
            case 'REJECTED':
              return 'destructive';
            default:
              return 'outline';
          }
        })();

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'role',
      header: 'Role',
    },
    {
      accessorKey: 'time',
      header: 'Time',
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
