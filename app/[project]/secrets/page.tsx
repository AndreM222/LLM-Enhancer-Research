'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { getSecretKeys, secretKeySettingsOptions } from '@/lib/mockApi';
import { SecretKeyDialog } from '@/components/dialogs/secret-key-dialog';
import { SecretKey } from '@/components/tables/secrets-columns';
import { SecretsKeyTable } from '@/components/tables/secrets-table';

const initialKeys = getSecretKeys();

export default function SecretKeysPage() {
  const [keys, setKeys] = useState<SecretKey[]>(initialKeys);
  const [search, setSearch] = useState('');

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

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<SecretKey | null>(null);

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return keys;
    }

    return keys.filter(
      (key) =>
        key.name.toLowerCase().includes(query) || key.description.toLowerCase().includes(query)
    );
  }, [keys, search]);

  const handleEdit = (key: SecretKey) => {
    setEditingKey(key);
    setEditOpen(true);
  };

  const handleCreate = (created: SecretKey) => {
    setKeys((previous) => [...previous, created]);

    console.log('New secret shown once:', created.id);

    setCreateOpen(false);
  };

  const handleEditSave = (updated: SecretKey) => {
    setKeys((previous) => previous.map((key) => (key.id === updated.id ? updated : key)));

    setEditOpen(false);
    setEditingKey(null);
    toast.success('Secret key updated.');
  };

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
          <div className="flex items-center justify-between gap-3">
            <Input
              placeholder="Search keys..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create secret key
            </Button>
          </div>

          <SecretsKeyTable
            onEdit={handleEdit}
            onDelete={() => console.log('deleted')}
            data={filteredKeys}
            pageSize={15}
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
    </div>
  );
}
