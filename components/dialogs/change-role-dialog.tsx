'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccountBanner } from '@/components/account-banner';
import { Role } from '@/app/settings/members/roles/page';
import { User } from '@/components/tables/users-columns';

export function ChangeRoleDialog({
  open,
  onOpenChange,
  editingUser,
  roles,
  selectedRole,
  setSelectedRole,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingUser: User | null;
  roles: Role[];
  selectedRole?: string | undefined;
  setSelectedRole: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>Update the workspace role for this member.</DialogDescription>
        </DialogHeader>

        {editingUser && (
          <div className="space-y-4 py-2">
            <AccountBanner user={editingUser} size="sm" />

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex flex-col justify-start">
                        <span className="mr-auto">{role.name}</span>
                        {role.description && (
                          <span className="mr-auto text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled={!selectedRole} onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
