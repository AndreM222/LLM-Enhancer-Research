'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
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
import { ChangeRoleDialog } from '@/components/dialogs/change-role-dialog';
import { MemberConfirmDialog } from '@/components/dialogs/member-confirm-dialog';
import { getProjectLinks, getRoles, getUsers } from '@/lib/mockApi';
import { User } from '@/components/tables/users-columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';
import { Role } from './roles/page';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const userData: User[] = getUsers();
const roles: Role[] = getRoles();

function MembersPageContent() {
  const [users, setUsers] = useState<User[]>(userData);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [roleFilter, setRoleFilter] = useState('none');

  const { nodes, groups, links } = getProjectLinks(undefined, 'users');

  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState(roles.at(0)?.name);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole =
        roleFilter === 'none' || roles.find((r) => r.id === roleFilter)?.name === u.roleId;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.roleId?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter, roles]);

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setEditingUser(user);
    setSelectedRole((user.roleId as string) ?? roles.at(0)?.name);
    setEditOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingUser || !selectedRole) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, roleId: selectedRole as unknown as User['roleId'] } : u
      )
    );
    toast.success(`Role updated to ${selectedRole} for ${editingUser.name}.`);
    setEditOpen(false);
    setEditingUser(null);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    const user = users.find((u) => u.id === deletingId);
    setUsers((prev) => prev.filter((u) => u.id !== deletingId));
    setDeletingId(null);
    setDeleteOpen(false);
    toast.success(`${user?.name ?? 'User'} removed from workspace.`);
  };

  const handleSuspendRequest = (id: string) => {
    setSuspendingId(id);
    setSuspendOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (!suspendingId) return;
    const user = users.find((u) => u.id === suspendingId);
    const isSuspended = (user as any)?.suspended ?? false;
    setUsers((prev) =>
      prev.map((u) => (u.id === suspendingId ? { ...u, suspended: !isSuspended } : u))
    );
    setSuspendingId(null);
    setSuspendOpen(false);
    toast.success(`${user?.name ?? 'User'} ${isSuspended ? 'unsuspended' : 'suspended'}.`);
  };

  const deletingUser = users.find((u) => u.id === deletingId);
  const suspendingUser = users.find((u) => u.id === suspendingId);
  const isSuspendingCurrentlySuspended = (suspendingUser as any)?.suspended ?? false;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (roleFilter !== 'none') {
      params.set('role', roleFilter);
    } else {
      params.delete('role');
    }

    // keep the currently open edit user in the URL so links can open the same dialog
    if (editOpen && editingUser) {
      params.set('user', editingUser.id);
    } else {
      params.delete('user');
    }

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
      scroll: false,
    });
  }, [search, roleFilter, editOpen, editingUser]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');

    // if a ?user=ID param is present, open the change-role dialog for that user
    const userParam = searchParams.get('user');
    if (userParam) {
      const user = users.find((u) => u.id === userParam);
      if (user) {
        setEditingUser(user);
        setSelectedRole((user.roleId as string) ?? roles.at(0)?.name);
        setEditOpen(true);
      }
    }
  }, [searchParams, users]);

  return (
    <div className="grid lg:grid-cols-[1fr_390px] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
          <CardDescription>
            Manage the members of the workspace like permissions, suspensions, and deletes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
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
              <Input
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
          </div>

          <UsersListTable
            data={filtered}
            pageSize={15}
            isSuspended={false}
            onDelete={handleDeleteRequest}
            onSuspended={handleSuspendRequest}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <LinkGraph nodes={nodes} groups={groups} links={links} />

      <ChangeRoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        editingUser={editingUser}
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={(v) => setSelectedRole(v)}
        onSave={handleSaveRole}
      />

      {/* Delete confirmation */}
      <MemberConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remove member?"
        description={
          <>
            This will permanently remove <b>{deletingUser?.name}</b> from the workspace. This action
            cannot be undone.
          </>
        }
        actionLabel="Delete"
        onConfirm={handleConfirmDelete}
        destructive
      />

      {/* Suspend confirmation */}
      <MemberConfirmDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title={isSuspendingCurrentlySuspended ? 'Unsuspend member?' : 'Suspend member?'}
        description={
          isSuspendingCurrentlySuspended ? (
            'This will restore the member to active state.'
          ) : (
            <>
              <b>{suspendingUser?.name}</b> will be limited to read-only access. They won't be able
              to make any changes until unsuspended.
            </>
          )
        }
        actionLabel={isSuspendingCurrentlySuspended ? 'Unsuspend' : 'Suspend'}
        onConfirm={handleConfirmSuspend}
      />
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading members...
        </div>
      }
    >
      <MembersPageContent />
    </Suspense>
  );
}
