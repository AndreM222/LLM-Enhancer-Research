'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

import { getSecretKeys, secretKeySettingsOptions } from '@/lib/mockApi';

import { SecretKeyDialog } from '@/components/dialogs/secret-key-dialog';
import { SecretKey } from '@/components/tables/secrets-columns';
import { SecretsKeyTable } from '@/components/tables/secrets-table';

const initialKeys = getSecretKeys();

export default function SecretKeysPage() {
  const [keys, setKeys] = useState<SecretKey[]>(initialKeys);
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<SecretKey | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function emptySecretKey(): SecretKey {
    return {
      id: '',
      name: '',
      description: '',
      permissions: [],
      prefix: '',
      lastFour: '',
      createdAt: '',
      status: 'active',
    };
  }

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return keys;
    }

    return keys.filter(
      (key) =>
        key.name.toLowerCase().includes(query) ||
        key.description.toLowerCase().includes(query) ||
        key.prefix.toLowerCase().includes(query) ||
        key.lastFour.toLowerCase().includes(query)
    );
  }, [keys, search]);

  const handleEdit = (key: SecretKey) => {
    setEditingKey(key);
    setEditOpen(true);
  };

  const handleCreate = (created: SecretKey) => {
    setKeys((previous) => [...previous, created]);

    // The complete secret should only be shown once during creation.
    console.log('New secret created:', created.id);

    setCreateOpen(false);
    toast.success(`Secret key "${created.name}" created.`);
  };

  const handleEditSave = (updated: SecretKey) => {
    setKeys((previous) => previous.map((key) => (key.id === updated.id ? updated : key)));

    setEditOpen(false);
    setEditingKey(null);

    toast.success(`Secret key "${updated.name}" updated.`);
  };

  const handleDeleteRequest = (secretKey: SecretKey) => {
    const key = keys.find((item) => item.id === secretKey.id);

    if (!key) {
      return;
    }

    setDeletingId(secretKey.id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) {
      return;
    }

    const key = keys.find((item) => item.id === deletingId);

    setKeys((previous) => previous.filter((item) => item.id !== deletingId));

    if (editingKey?.id === deletingId) {
      setEditingKey(null);
      setEditOpen(false);
    }

    setDeletingId(null);
    setDeleteOpen(false);

    toast.success(`Secret key "${key?.name ?? 'Key'}" deleted.`);
  };

  const deletingKey = keys.find((key) => key.id === deletingId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your secret keys</CardTitle>
          <CardDescription>
            Keys are shown only by their prefix and last four characters after creation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search keys..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-sm"
            />

            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create secret key
            </Button>
          </div>

          <SecretsKeyTable
            data={filteredKeys}
            pageSize={15}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </CardContent>
      </Card>

      <SecretKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        initial={emptySecretKey()}
        onSave={handleCreate}
        permissionSettings={secretKeySettingsOptions()}
      />

      <SecretKeyDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setEditingKey(null);
          }
        }}
        mode="edit"
        initial={editingKey ?? emptySecretKey()}
        onSave={handleEditSave}
        permissionSettings={secretKeySettingsOptions()}
      />

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setDeletingId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete secret key?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{' '}
              <span className="font-medium text-foreground">
                {deletingKey?.name ?? 'this secret key'}
              </span>{' '}
              ending in{' '}
              <span className="font-mono text-foreground">
                {deletingKey ? `••••${deletingKey.lastFour}` : '••••'}
              </span>
              . Any application using this key will immediately lose access. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
