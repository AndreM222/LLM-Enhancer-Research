'use client';

import { useState, useMemo } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getProjectLinks, getRoles, getUsers } from '@/lib/mockApi';
import { User } from '@/components/tables/users-columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';
import { AccountBanner } from '@/components/account-banner';
import { Role } from './roles/page';

const userData: User[] = getUsers();

export default function Members() {
  const [users, setUsers] = useState<User[]>(userData);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('none');
  const roles: Role[] = getRoles();

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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>Update the workspace role for this member.</DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 py-2">
              <AccountBanner user={editingUser} size="sm" />

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="py-6">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        <div className="flex flex-col justify-start">
                          <span className="mr-auto">{role.name}</span>
                          {role.description && (
                            <span className="mr-auto text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedRole} onClick={handleSaveRole}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <b>{deletingUser?.name}</b> from the workspace. They will
              lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend confirmation */}
      <AlertDialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspendingCurrentlySuspended ? 'Unsuspend' : 'Suspend'} member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuspendingCurrentlySuspended ? (
                <>
                  This will restore full access for <b>{suspendingUser?.name}</b>.
                </>
              ) : (
                <>
                  <b>{suspendingUser?.name}</b> will be limited to read-only access. They won't be
                  able to make any changes until unsuspended.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSuspend}>
              {isSuspendingCurrentlySuspended ? 'Unsuspend' : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
