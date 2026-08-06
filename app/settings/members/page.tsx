'use client';

import { UsersListTable } from '@/components/tables/users-table';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRoles, getUsers } from '@/lib/mockApi';
import { User } from '@/components/tables/users-columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';

const userData: User[] = getUsers();

export default function Members() {
  const users: User[] = userData;
  const roles = getRoles();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
          <CardDescription>
            Manage the members of the workspace like permissions, suspensions, and deletes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Select defaultValue="none">
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="none">Select Role</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Field>
              <Input id="input-button-group" placeholder="Type to search..." />
            </Field>
          </div>

          <UsersListTable
            data={users}
            pageSize={15}
            isSuspended={false}
            onDelete={() => console.log('Deleted')}
            onSuspended={() => console.log('Suspend')}
            onEdit={() => console.log('Edit')}
          />
        </CardContent>
      </Card>

      <LinkGraph />
    </div>
  );
}
