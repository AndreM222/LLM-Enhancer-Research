'use client';

import { useState } from 'react';
import { UserRole, MockUser as DialogMockUser } from '@/components/dialogs/invite-user-dialog';
import { CreateInvitationTable, UsersListTable } from '@/components/tables/users-table';
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
import { InviteUserDialog } from '@/components/dialogs/invite-user-dialog';
import { User } from '@/components/tables/users-columns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Map your existing User type to the dialog’s MockUser type
const data: User[] = getUsers();
const mockUsers: DialogMockUser[] = data.map((user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  role: (user.role as UserRole) ?? 'MEMBER',
}));

export default function Users() {
  const [users, setUsers] = useState<User[]>(data);
  const roles = getRoles();

  const handleInvite = (payload: DialogMockUser | { emailOrUsername: string; role: UserRole }) => {
    console.log('Invite payload:', payload);
  };

  const handleEditRole = (user: DialogMockUser, newRole: UserRole) => {
    console.log('Edit role:', user, '->', newRole);
    // Update local state mock:
    setUsers((prev) =>
      prev.map((currUser) =>
        currUser.id === user.id
          ? { ...currUser, role: newRole as unknown as User['role'] }
          : currUser
      )
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="none">
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="none">Select Role</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
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
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <div className="flex items-center gap-2">
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
              <Input id="input-button-group" placeholder="Type to search..." />
            </Field>

            <InviteUserDialog
              existingUsers={mockUsers}
              onInvite={handleInvite}
              onEditRole={handleEditRole}
            />
          </div>

          <CreateInvitationTable
            data={users}
            onDelete={() => console.log('Deleted')}
            onOpen={() => console.log('Opened')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
