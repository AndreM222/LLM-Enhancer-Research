'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarIcon, Check, Copy, Eye, EyeOff, KeyRound } from 'lucide-react';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

import { SingleSetting, updateSettingValue } from '@/components/tables/settings-columns';
import { SingleSettingsTable } from '@/components/tables/settings-table';

export type SecretKeyInput = {
  name: string;
  description: string;
  expiresAt?: string;
  permissions: string[];
};

export type SecretKey = SecretKeyInput & {
  id: string;
  prefix: string;
  lastFour: string;
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked' | 'expired';
};

type SecretKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: SecretKey) => void;
  mode: 'create' | 'edit';
  initial: SecretKey;
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

function permissionsToSettings(permissionSettings: SingleSetting[], permissions: string[]) {
  const permissionSet = new Set(permissions);

  return permissionSettings.map((setting) => {
    if (setting.type !== 'switch') {
      return { ...setting };
    }

    return {
      ...setting,
      value: permissionSet.has(setting.id),
    };
  });
}

function dateToInputValue(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return format(date, 'yyyy-MM-dd');
}

function inputValueToDate(value: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function emptySecretKey(): SecretKey {
  return {
    id: '',
    name: '',
    description: '',
    expiresAt: undefined,
    permissions: [],
    prefix: '',
    lastFour: '',
    createdAt: '',
    status: 'active',
  };
}

export function SecretKeyDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onSave,
  permissionSettings,
}: SecretKeyDialogProps) {
  const [form, setForm] = useState<SecretKey>(emptySecretKey());
  const [settings, setSettings] = useState<SingleSetting[]>([]);
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  const expirationDate = useMemo(() => inputValueToDate(form.expiresAt ?? ''), [form.expiresAt]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextInitial = isCreateMode
      ? emptySecretKey()
      : {
          ...initial,
          permissions: [...initial.permissions],
        };

    setForm(nextInitial);

    setSettings(permissionsToSettings(permissionSettings, nextInitial.permissions));

    setSecret('');
    setShowSecret(false);
  }, [open, mode, initial, permissionSettings, isCreateMode]);

  const handleGenerate = () => {
    if (isEditMode) {
      return;
    }

    setSecret(generateSecretKey());
    toast.success('New secret generated.');
  };

  const handleCopy = async () => {
    if (!secret || isEditMode) {
      return;
    }

    await navigator.clipboard.writeText(secret);
    toast.success('Secret key copied.');
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Key name is required.');
      return;
    }

    if (isCreateMode && !secret) {
      toast.error('Generate the secret key before saving.');
      return;
    }

    const permissions = settingsToPermissions(settings);

    if (isCreateMode) {
      const createdSecret = secret;

      const createdKey: SecretKey = {
        ...form,
        id: `key-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        permissions,
        prefix: createdSecret.slice(0, 8),
        lastFour: createdSecret.slice(-4),
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      onSave(createdKey);
      onOpenChange(false);

      toast.success('Secret key created.');
      return;
    }

    const updatedKey: SecretKey = {
      ...initial,
      name: form.name.trim(),
      description: form.description.trim(),
      expiresAt: form.expiresAt || undefined,
      permissions,
    };

    onSave(updatedKey);
    onOpenChange(false);

    toast.success('Secret key updated.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {isCreateMode ? 'Create secret key' : 'Edit secret key'}
          </DialogTitle>

          <DialogDescription>
            {isCreateMode
              ? 'Create a scoped key for an integration, automation, or external service.'
              : 'Update this key’s name, expiration, description, and permissions.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="grid gap-5 px-2 py-3">
            <div className="grid gap-2">
              <Label htmlFor="secret-key-name">Key name</Label>
              <Input
                id="secret-key-name"
                placeholder="Production detection worker"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secret-key-description">Description</Label>
              <Textarea
                id="secret-key-description"
                placeholder="Used by the production service to submit detection sessions."
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Expiration date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {expirationDate ? (
                      format(expirationDate, 'PPP')
                    ) : (
                      <span className="text-muted-foreground">No expiration date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={(date) => {
                      setForm((previous) => ({
                        ...previous,
                        expiresAt: dateToInputValue(date),
                      }));
                    }}
                  />

                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          expiresAt: undefined,
                        }))
                      }
                    >
                      Remove expiration
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
                  {isCreateMode ? 'Store this key securely' : 'Secret value unavailable'}
                </CardTitle>

                <CardDescription>
                  {isCreateMode
                    ? 'The full secret will only be shown after creation. Store it in an environment variable or secrets manager.'
                    : 'For security, the full secret cannot be viewed again. Create a new key if the original value is lost.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {isCreateMode ? (
                  <>
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
                          {showSecret ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
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
                  </>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                    <Check className="h-4 w-4 text-emerald-500" />

                    <div>
                      <p className="text-sm font-medium">Key already generated</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {initial.prefix}••••{initial.lastFour}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>

              <Button type="button" onClick={handleSave}>
                {isCreateMode ? 'Create secret key' : 'Update key'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
