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

const userData: User[] = getUsers();

export default function Members() {
  const users: User[] = userData;
  const roles = getRoles();

  return (
    <div className="space-y-6">
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
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />
    </div>
  );
}
