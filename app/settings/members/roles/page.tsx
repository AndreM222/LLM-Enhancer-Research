'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getProjectLinks, getRoles, roleSettingsOptions } from '@/lib/mockApi';
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
import { CreateRolesTable } from '@/components/tables/roles-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';

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

import { RoleDialog } from '@/components/dialogs/role-dialog';

function RolesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role>(emptyRole());

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');

    // reflect the currently edited role in the URL so it can be opened by link
    if (editOpen && editingRole?.id) {
      params.set('role', editingRole.id);
    } else {
      params.delete('role');
    }

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search, editOpen, editingRole]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');

    const roleParam = searchParams.get('role');
    if (roleParam) {
      const role = roles.find((r) => r.id === roleParam);
      if (role) {
        setEditingRole(role);
        setEditOpen(true);
      }
    }
  }, [searchParams, roles]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { nodes, groups, links } = getProjectLinks(undefined, 'roles');

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
    <div className="grid lg:grid-cols-[1fr_390px] gap-6">
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

          <CreateRolesTable
            pageSize={15}
            data={filtered}
            onDelete={handleDeleteRequest}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <LinkGraph nodes={nodes} groups={groups} links={links} />

      <RoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={emptyRole()}
        onSave={handleCreate}
        mode="create"
        roleSettings={roleSettingsOptions()}
      />

      <RoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={editingRole}
        onSave={handleSaveEdit}
        mode="edit"
        roleSettings={roleSettingsOptions()}
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

export default function RolesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading roles...
        </div>
      }
    >
      <RolesPageContent />
    </Suspense>
  );
}
