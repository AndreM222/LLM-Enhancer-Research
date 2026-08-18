'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SingleSetting, updateSettingValue } from '@/components/tables/settings-columns';
import { SingleSettingsTable } from '@/components/tables/settings-table';

export type Role = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  permissions: string[];
};

export function RoleDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  mode,
  roleSettings,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Role;
  onSave: (role: Role) => void;
  mode: 'create' | 'edit';
  roleSettings: SingleSetting[];
}) {
  const [form, setForm] = useState<Role>(initial);
  const [settings, setSettings] = useState<SingleSetting[]>(roleSettings);

  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
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

        <ScrollArea className="max-h-170">
          <div className="grid gap-4 py-2 px-2">
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

            <Card className="grid gap-3">
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Allowed activity for this role.</CardDescription>
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {mode === 'create' ? 'Save role' : 'Update role'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
