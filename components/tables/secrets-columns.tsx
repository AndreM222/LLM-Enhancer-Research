import { ColumnDef } from '@tanstack/react-table';
import { Pen, Trash } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '../ui/button-group';

export type SecretKey = {
  id: string;
  name: string;
  description: string;
  prefix: string;
  lastFour: string;
  environment: 'development' | 'staging' | 'production';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
};

function statusVariant(
  status: SecretKey['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'revoked':
      return 'destructive';
    case 'expired':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function secretKeysColumns(
  onEdit: (key: SecretKey) => void,
  onDelete: (key: SecretKey) => void
): ColumnDef<SecretKey>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Key',
      cell: ({ row }) => {
        const key = row.original;

        return (
          <div className="min-w-0">
            <p className="font-medium">{key.name}</p>
            <p className="text-sm text-muted-foreground">{key.description}</p>
            <code className="text-xs text-muted-foreground">
              {key.prefix}••••{key.lastFour}
            </code>
          </div>
        );
      },
    },
    {
      accessorKey: 'environment',
      header: 'Environment',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.environment}
        </Badge>
      ),
    },
    {
      id: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permissions = row.original.permissions;

        return (
          <div className="flex max-w-70 flex-wrap gap-1">
            {permissions.slice(0, 2).map((permission) => (
              <Badge key={permission} variant="secondary">
                {permission}
              </Badge>
            ))}

            {permissions.length > 2 && <Badge variant="outline">+{permissions.length - 2}</Badge>}
          </div>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
      ),
    },
    {
      id: 'lastUsedAt',
      accessorKey: 'lastUsedAt',
      header: 'Last used',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.lastUsedAt ?? 'Never'}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <ButtonGroup>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(row.original);
              }}
              title="Delete key identifier"
            >
              <Trash className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(row.original);
              }}
              title="Open secret key"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>
      ),
    },
  ];
}
