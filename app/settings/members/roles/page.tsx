'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getRoles, getRolePermissions } from '@/lib/mockApi';
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
import { Switch } from '@/components/ui/switch';
import { RolesTable } from '@/components/tables/roles-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';

const PERMISSIONS = getRolePermissions();

export type Role = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  permissions: string[];
};

function emptyRole(): Role {
  return {
    id: '',
    name: '',
    description: '',
    isDefault: false,
    permissions: [],
  };
}

function RoleDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  mode,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Role;
  onSave: (role: Role) => void;
  mode: 'create' | 'edit';
}) {
  const [form, setForm] = useState<Role>(initial);

  // reset form when dialog opens with new initial value
  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };

  const togglePermission = (p: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(p)
        ? prev.permissions.filter((x) => x !== p)
        : [...prev.permissions, p],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Role name is required.');
      return;
    }
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-200">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create role' : 'Edit role'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a new role and assign the permissions it should receive.'
              : 'Update the role details and permissions.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="role-name">Role name</Label>
            <Input
              id="role-name"
              placeholder="Research Editor"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role-description">Description</Label>
            <Input
              id="role-description"
              placeholder="Can edit prompts and review corrections."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default role</p>
                <p className="text-sm text-muted-foreground">
                  Assigned automatically when inviting new users.
                </p>
              </div>
              <Switch
                checked={form.isDefault}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isDefault: v }))}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Permissions</Label>
            <div className="space-y-3 rounded-lg border p-4">
              {PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{permission}</p>
                    <p className="text-sm text-muted-foreground">
                      Allow this role to {permission.toLowerCase()}.
                    </p>
                  </div>
                  <Switch
                    checked={form.permissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{mode === 'create' ? 'Save role' : 'Update role'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Members() {
  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role>(emptyRole());

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const handleCreate = (role: Role) => {
    const newRole = { ...role, id: `role-${Date.now()}` };
    setRoles((prev) => [...prev, newRole]);
    toast.success(`Role "${role.name}" created.`);
  };

  const handleEdit = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (!role) return;
    setEditingRole(role);
    setEditOpen(true);
  };

  const handleSaveEdit = (updated: Role) => {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    toast.success(`Role "${updated.name}" updated.`);
  };

  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    const role = roles.find((r) => r.id === deletingId);
    setRoles((prev) => prev.filter((r) => r.id !== deletingId));
    setDeletingId(null);
    setDeleteOpen(false);
    toast.success(`Role "${role?.name}" deleted.`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Roles List</CardTitle>
          <CardDescription>Manage, delete and create users roles permissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full justify-end space-x-2">
            <Field>
              <Input
                id="search"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>

            <Button onClick={() => setCreateOpen(true)}>Create role</Button>
          </div>

          <RolesTable
            pageSize={15}
            data={filtered}
            onDelete={handleDeleteRequest}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <LinkGraph />

      <RoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={emptyRole()}
        onSave={handleCreate}
        mode="create"
      />

      <RoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={editingRole}
        onSave={handleSaveEdit}
        mode="edit"
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role{' '}
              <b>{roles.find((r) => r.id === deletingId)?.name}</b> and remove it from all users.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
