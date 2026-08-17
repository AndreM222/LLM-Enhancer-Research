'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { getSecretKeys, secretKeySettingsOptions } from '@/lib/mockApi';
import { SecretKeyDialog, CreatedSecretKey } from '@/components/dialogs/secret-key-dialog';
import { SecretKey } from '@/components/tables/secrets-columns';
import { SecretsKeyTable } from '@/components/tables/secrets-table';

const initialKeys = getSecretKeys();

export default function SecretKeysPage() {
  const [keys, setKeys] = useState<SecretKey[]>(initialKeys);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filteredKeys = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return keys;
    }

    return keys.filter(
      (key) =>
        key.name.toLowerCase().includes(query) ||
        key.description.toLowerCase().includes(query) ||
        key.environment.toLowerCase().includes(query)
    );
  }, [keys, search]);

  const handleSave = (created: CreatedSecretKey) => {
    const tableKey: SecretKey = {
      id: created.id,
      name: created.name,
      description: created.description,
      prefix: created.prefix,
      lastFour: created.lastFour,
      environment: created.environment,
      createdAt: created.createdAt,
      expiresAt: created.expiresAt,
      status: created.status,
      permissions: created.permissions,
    };

    setKeys((previous) => [...previous, tableKey]);

    console.log('Store this secret securely:', created.secret);

    toast.success('Secret key added.');
  };

  const handleOpen = (key: SecretKey) => {
    toast.info(`Opening ${key.name}.`);
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
            onEdit={handleOpen}
            onDelete={() => console.log('deleted')}
            data={filteredKeys}
            pageSize={15}
          />
        </CardContent>
      </Card>

      <SecretKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSave}
        permissionSettings={secretKeySettingsOptions()}
      />
    </div>
  );
}
