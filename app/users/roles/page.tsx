'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RolesTable } from '@/components/tables/roles-table';
import { Role } from '@/components/tables/roles-columns';
import { Field } from '@/components/ui/field';
import { ButtonGroup } from '@/components/ui/button-group';

function getData(): Role[] {
  return [
    {
      id: '124123',
      name: 'Admin',
      description: 'Full access to the workspace.',
      isDefault: false,
      permissions: ['Manage users', 'Edit prompts', 'View analytics', 'Change settings'],
    },
    {
      id: '124124',
      name: 'Editor',
      description: 'Can edit prompts and review corrections.',
      isDefault: true,
      permissions: ['Edit prompts', 'Review corrections', 'View analytics'],
    },
    {
      id: '124125',
      name: 'Viewer',
      description: 'Read-only access to reports and dashboards.',
      isDefault: false,
      permissions: ['View analytics'],
    },
  ];
}

const permissions = [
  'Manage users',
  'Edit prompts',
  'Review corrections',
  'View analytics',
  'Export data',
  'Change settings',
];

export default function RolesPage() {
  const [open, setOpen] = useState(false);
  const data = getData();

  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create role</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create role</DialogTitle>
              <DialogDescription>
                Define a new role and assign the permissions it should receive.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role name</Label>
                <Input id="role-name" placeholder="Research Editor" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role-description">Description</Label>
                <Input
                  id="role-description"
                  placeholder="Can edit prompts and review corrections."
                />
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Default role</p>
                    <p className="text-sm text-muted-foreground">
                      Assigned automatically when inviting new users.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Permissions</Label>
                <div className="space-y-3 rounded-lg border p-4">
                  {permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{permission}</p>
                        <p className="text-sm text-muted-foreground">
                          Allow this role to {permission.toLowerCase()}.
                        </p>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Save role</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Field>
        <ButtonGroup>
          <Input id="input-button-group" placeholder="Type to search..." />
          <Button variant="outline">Search</Button>
        </ButtonGroup>
      </Field>

      <RolesTable
        data={data}
        onDelete={() => console.log('delete')}
        onOpen={() => console.log('open')}
      />
    </div>
  );
}
