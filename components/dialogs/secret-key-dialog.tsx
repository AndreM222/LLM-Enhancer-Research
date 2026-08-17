'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Copy, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { SingleSetting, updateSettingValue } from '@/components/tables/settings-columns';
import { SingleSettingsTable } from '@/components/tables/settings-table';

export type SecretKeyInput = {
  name: string;
  description: string;
  environment: 'development' | 'staging' | 'production';
  expiresAt?: string;
  permissions: string[];
};

export type CreatedSecretKey = SecretKeyInput & {
  id: string;
  prefix: string;
  lastFour: string;
  secret: string;
  createdAt: string;
  status: 'active';
};

type SecretKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: CreatedSecretKey) => void;
  permissionSettings: SingleSetting[];
};

function generateSecretKey() {
  const randomPart = Math.random().toString(36).slice(2).padEnd(32, '0');

  return `sk_live_${randomPart}`;
}

function settingsToPermissions(settings: SingleSetting[]) {
  return settings
    .filter((setting) => setting.type === 'switch' && setting.value === true)
    .map((setting) => setting.id);
}

export function SecretKeyDialog({
  open,
  onOpenChange,
  onSave,
  permissionSettings,
}: SecretKeyDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<SecretKeyInput['environment']>('development');
  const [expiresAt, setExpiresAt] = useState('');
  const [settings, setSettings] = useState<SingleSetting[]>(permissionSettings);
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName('');
    setDescription('');
    setEnvironment('development');
    setExpiresAt('');
    setSettings(
      permissionSettings.map((setting) => ({
        ...setting,
      }))
    );
    setSecret('');
    setShowSecret(false);
  }, [open, permissionSettings]);

  const handleGenerate = () => {
    setSecret(generateSecretKey());
  };

  const handleCopy = async () => {
    if (!secret) return;

    await navigator.clipboard.writeText(secret);
    toast.success('Secret key copied.');
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Key name is required.');
      return;
    }

    if (!secret) {
      toast.error('Generate the secret key before saving.');
      return;
    }

    const created: CreatedSecretKey = {
      id: `key-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      environment,
      expiresAt: expiresAt || undefined,
      permissions: settingsToPermissions(settings),
      prefix: secret.slice(0, 8),
      lastFour: secret.slice(-4),
      secret,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    onSave(created);
    onOpenChange(false);
    toast.success('Secret key created.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Create secret key
          </DialogTitle>
          <DialogDescription>
            Create a scoped key for an integration, automation, or external service.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="grid gap-5 px-2 py-3">
            <div className="grid gap-2">
              <Label htmlFor="secret-key-name">Key name</Label>
              <Input
                id="secret-key-name"
                placeholder="Production detection worker"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secret-key-description">Description</Label>
              <Textarea
                id="secret-key-description"
                placeholder="Used by the production service to submit detection sessions."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="secret-key-environment">Environment</Label>

                <Select
                  value={environment}
                  onValueChange={(value) => setEnvironment(value as SecretKeyInput['environment'])}
                >
                  <SelectTrigger id="secret-key-environment">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="secret-key-expiration">Expiration date</Label>
                <Input
                  id="secret-key-expiration"
                  type="date"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Only selected permissions will be available to this key.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <SingleSettingsTable
                  data={settings}
                  onChange={(id, value) =>
                    setSettings((previous) => updateSettingValue(previous, id, value))
                  }
                />
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Store this key securely
                </CardTitle>
                <CardDescription>
                  The full secret will only be shown after creation. Store it in an environment
                  variable or secrets manager.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button type="button" variant="outline" onClick={handleGenerate}>
                  {secret ? 'Regenerate key' : 'Generate secret key'}
                </Button>

                {secret && (
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      type={showSecret ? 'text' : 'password'}
                      value={secret}
                      className="font-mono"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSecret((value) => !value)}
                      title={showSecret ? 'Hide secret' : 'Show secret'}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      title="Copy secret"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button type="button" onClick={handleSave}>
                Create secret key
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
