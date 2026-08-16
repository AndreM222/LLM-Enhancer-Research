'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CreateInvitationTable } from '@/components/tables/users-table';
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
import { InvitationDialog } from '@/components/dialogs/invitation-dialog';
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
import { getUsers } from '@/lib/mockApi';
import { InviteUserDialog } from '@/components/dialogs/invite-user-dialog';
import { User } from '@/components/tables/users-columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const userData: User[] = getUsers();

const mockUsers: User[] = userData.map((user) => ({
  id: user.id,
  status: user.status,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  time: user.time,
  roleId: (user.roleId as string) ?? 'MEMBER',
}));

function InvitationsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<User[]>(userData);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'none');

  const [openUser, setOpenUser] = useState<User | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');
    if (statusFilter && statusFilter !== 'none') params.set('status', statusFilter);
    else params.delete('status');

    // keep currently open invitation dialog in URL as ?user=ID so links can share
    if (openUser) {
      params.set('user', openUser.id);
    } else {
      params.delete('user');
    }

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search, statusFilter, openUser]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    setStatusFilter(searchParams.get('status') ?? 'none');

    const userParam = searchParams.get('user');
    if (userParam) {
      const user = users.find((u) => u.id === userParam);
      if (user) setOpenUser(user);
    }
  }, [searchParams, users]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus = statusFilter === 'none' || u.status.toUpperCase() === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.roleId?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [users, search, statusFilter]);

  const handleOpen = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) setOpenUser(user);
  };

  const handleResend = (id: string) => {
    const user = users.find((u) => u.id === id);
    toast.success(`Invitation resent to ${user?.email ?? id}.`);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const user = users.find((u) => u.id === deleteId);
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
    setDeleteOpen(false);
    toast.success(`Invitation to ${user?.email ?? deleteId} deleted.`);
  };

  const handleInvite = (payload: User | { emailOrUsername: string; roleId: string }) => {
    if ('emailOrUsername' in payload) {
      const newUser: User = {
        id: `inv-${Date.now()}`,
        email: payload.emailOrUsername,
        name: payload.emailOrUsername,
        username: payload.emailOrUsername,
        roleId: payload.roleId,
        status: 'SENT',
        avatar: '',
        time: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success(`Invitation sent to ${payload.emailOrUsername}.`);
    }
  };

  const handleEditRole = (user: User, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, roleId: newRole as unknown as User['roleId'] } : u
      )
    );
    toast.success(`Role updated to ${newRole} for ${user.email}.`);
  };

  const deletingUser = users.find((u) => u.id === deleteId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invitations list</CardTitle>
          <CardDescription>Send others invitations to workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <Input
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>

            <InviteUserDialog
              existingUsers={mockUsers}
              onInvite={handleInvite}
              onEditRole={handleEditRole}
            />
          </div>

          <CreateInvitationTable
            pageSize={15}
            data={filtered}
            onResend={handleResend}
            onDelete={handleDeleteRequest}
            onOpen={handleOpen}
          />
        </CardContent>
      </Card>

      <InvitationDialog openUser={openUser} onOpenChange={(v) => !v && setOpenUser(null)} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invitation sent to <b>{deletingUser?.email}</b>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function InvitationsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading invitations...
        </div>
      }
    >
      <InvitationsPageContent />
    </Suspense>
  );
}
