'use client';

import { useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  role: (user.role as string) ?? 'MEMBER',
}));

function statusVariant(status: string) {
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
    case 'SENT':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function Members() {
  const [users, setUsers] = useState<User[]>(userData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('none');

  const [openUser, setOpenUser] = useState<User | null>(null);

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
        u.role?.toLowerCase().includes(q);
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

  const handleInvite = (payload: User | { emailOrUsername: string; role: string }) => {
    if ('emailOrUsername' in payload) {
      const newUser: User = {
        id: `inv-${Date.now()}`,
        email: payload.emailOrUsername,
        name: payload.emailOrUsername,
        username: payload.emailOrUsername,
        role: payload.role,
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
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole as unknown as User['role'] } : u))
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

      <Dialog
        open={!!openUser}
        onOpenChange={(v) => {
          if (!v) setOpenUser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitation details</DialogTitle>
            <DialogDescription>Full details for this workspace invitation.</DialogDescription>
          </DialogHeader>

          {openUser && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-medium">{openUser.name || '—'}</p>
                  <p className="text-sm text-muted-foreground">{openUser.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusVariant(openUser.status)}>{openUser.status}</Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium">{openUser.role ?? '—'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Sent at</p>
                  <p className="text-sm">
                    {openUser.time ? new Date(openUser.time).toLocaleString() : '—'}
                  </p>
                </div>
              </div>

              {openUser.status.toUpperCase() === 'REJECTED' && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-1">
                  <p className="text-xs font-medium text-destructive">Rejection reason</p>
                  <p className="text-sm text-muted-foreground">
                    The user declined this invitation.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                {openUser.status.toUpperCase() !== 'ACCEPTED' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleResend(openUser.id);
                      setOpenUser(null);
                    }}
                  >
                    Resend
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOpenUser(null);
                    handleDeleteRequest(openUser.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
