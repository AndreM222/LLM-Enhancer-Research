'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../ui/badge';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';
import { ChevronRight, Pause, Pen, Play, RotateCcw, Trash, X } from 'lucide-react';
import { AccountPicture } from '../account-banner';

export type User = {
  id: string;
  status: string;
  roleId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  time: string;
};

export function createInvitationColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void,
  onResend: (id: string) => void
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
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              <Trash />
            </Button>
            {status.toUpperCase() !== 'ACCEPTED' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onResend(id);
                }}
              >
                <RotateCcw />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(id);
              }}
            >
              <ChevronRight />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}

export function usersListColumns(
  isSuspended: boolean,
  onDelete: (id: string) => void,
  onOpen: (id: string) => void,
  onSuspended: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => {
        const { name, email, avatar: avatarUrl } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <AccountPicture name={name} avatar={avatarUrl} size="sm" />
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
        const { roleId: role } = row.original;

        return <Badge variant="outline">{role}</Badge>;
      },
    },
    {
      accessorKey: 'id',
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
              <Trash />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSuspended(row.getValue<string>('id'));
              }}
            >
              {isSuspended ? <Play /> : <Pause />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(id);
              }}
            >
              <Pen />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}

export function linkUserColumns(
  onDelete: (id: string) => void,
  onOpen: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => {
        const { name, email, avatar: avatarUrl } = row.original;
        return (
          <div className="flex gap-2 items-center">
            <AccountPicture name={name} avatar={avatarUrl} size="sm" />
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
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
    {
      accessorKey: 'id',
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
              <X />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(id);
              }}
            >
              <ChevronRight />
            </Button>
          </ButtonGroup>
        );
      },
    },
  ];
}
