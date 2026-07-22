'use client';

import { User } from '@/components/tables/users-columns';
import { CreateUsersTable } from '@/components/tables/users-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

function getData(): User[] {
  return [
    {
      id: '728ed52f',
      name: 'David',
      role: 'Japan',
      status: 'SENT',
      time: '2026-07-07T18:00:00.000Z',
    },
    {
      id: '731ed57f',
      name: 'Stephanie',
      role: 'Scratches',
      status: 'REJECTED',
      time: '2026-07-07T17:30:00.000Z',
    },
    {
      id: '728ed54f',
      name: 'Jerry',
      role: 'Scratches',
      status: 'ACCEPTED',
      time: '2026-07-07T16:45:00.000Z',
    },
  ];
}

export default function Users() {
  const data = getData();
  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end">
        <Button>Invite user</Button>
      </div>

      <div className="flex space-x-1">
        <Select defaultValue="none">
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="none">Select Status</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Field>
          <ButtonGroup>
            <Input id="input-button-group" placeholder="Type to search..." />
            <Button variant="outline">Search</Button>
          </ButtonGroup>
        </Field>
      </div>

      <CreateUsersTable
        data={data}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />
    </div>
  );
}
