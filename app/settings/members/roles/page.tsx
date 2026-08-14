'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getProjectLinks, getProjects, getRoles, roleSettingsOptions } from '@/lib/mockApi';
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
import { CreateRolesTable } from '@/components/tables/roles-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LinkGraph from '@/components/linkGraph';
import { Project, ProjectIcon } from '@/components/project-cards';
import { AddRow } from '@/app/[project]/settings/page';
import { LinkDetectionTable } from '@/components/tables/detection-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SingleSetting, updateSettingValue } from '@/components/tables/settings-columns';
import { SingleSettingsTable } from '@/components/tables/settings-table';

const projectsList: Project[] = getProjects();

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

export default function Members() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [roles, setRoles] = useState<Role[]>(getRoles());
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role>(emptyRole());

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
        projectsList={projectsList}
        roleSettings={roleSettingsOptions()}
      />

      <RoleDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={editingRole}
        onSave={handleSaveEdit}
        mode="edit"
        projectsList={projectsList}
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
