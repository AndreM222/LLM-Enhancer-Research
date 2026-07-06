import { User } from '@/components/tables/users-columns';
import { UsersTable } from '@/components/tables/users-table';
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
      type: 'GET',
      request: '/api/server/connect',
      status: 'SENT',
      time: new Date().toISOString(),
    },
    {
      id: '731ed57f',
      type: 'DELETE',
      request: '/api/server/user',
      status: 'REJECTED',
      time: new Date().toISOString(),
    },
    {
      id: '728ed54f',
      type: 'DELETE',
      request: '/api/server/user',
      status: 'ACCEPTED',
      time: new Date().toISOString(),
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total users</CardTitle>
            <CardDescription>All accounts in the workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">24</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>Users currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">19</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending invites</CardTitle>
            <CardDescription>Awaiting account acceptance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Users with management access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">2</p>
          </CardContent>
        </Card>
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

      <UsersTable data={data} />
    </div>
  );
}
