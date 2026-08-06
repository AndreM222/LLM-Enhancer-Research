'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AccountBanner, AccountPicture } from '@/components/account-banner';
import { Eye, EyeOff, X } from 'lucide-react';
import { getAccountUser } from '@/lib/mockApi';
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

const user = getAccountUser();

export default function AccountSettingsPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const currentAvatar = preview ?? user.avatar;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [hiddenOldPassword, setHiddenOldPassword] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [passwordError, setPasswordError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const canDelete = deleteConfirm === user.name;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    if (!canDelete) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.error('Account deleted.');
    setDeleteDialogOpen(false);
  };

  const handleSaveAvatar = () => {
    if (!preview) return;
    toast.success('Avatar saved.');
    setPreview(null);
  };

  const handleSaveName = () => {
    if (!name.trim()) return;
    toast.success('Name saved.');
  };

  const handleSaveEmail = () => {
    if (!email.trim()) return;
    toast.success('Email saved.');
  };

  const handleSavePassword = () => {
    setPasswordError('');
    if (!oldPassword) {
      setPasswordError('Enter your old password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    toast.success('Password updated.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <AccountBanner
            user={{ ...user, name: name || user.name, avatar: currentAvatar }}
            size="lg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <AccountPicture name={name || user.name} avatar={currentAvatar} size="sm" />
            <p className="text-xs text-muted-foreground">
              PNG, JPG, or WEBP. Recommended size: 512×512.
            </p>
          </div>
          <div className="rounded-xl border border-dashed p-4">
            <Label htmlFor="avatar-upload" className="mb-3 block text-sm font-medium">
              Attachment
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="max-w-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPreview(URL.createObjectURL(file));
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => setPreview(null)}
              >
                <X className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>PNG, JPG, WEBP. Max 4MB.</CardDescription>
          <Button disabled={!preview} onClick={handleSaveAvatar}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="name"
            value={name || user.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Andre Mossi"
            maxLength={32}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button onClick={handleSaveName} disabled={!name.trim()}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="andre@research.io"
            maxLength={32}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button onClick={handleSaveEmail} disabled={!email.trim()}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Enter your old password to set a new one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="old-password">Old password</Label>
            <div className="relative">
              <Input
                id="old-password"
                type={hiddenOldPassword ? 'password' : 'text'}
                value={oldPassword}
                aria-invalid={!oldPassword && passwordError.length > 0}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setHiddenOldPassword((p) => !p)}
              >
                {hiddenOldPassword ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={hiddenPassword ? 'password' : 'text'}
                value={newPassword}
                aria-invalid={newPassword.length > 0 && newPassword.length < 8}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setHiddenPassword((p) => !p)}
              >
                {hiddenPassword ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Minimum 8 characters.</CardDescription>
          <Button onClick={handleSavePassword}>Save</Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>This action is permanent and cannot be reversed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder={user.name}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>
            Type <b>{user.name}</b> to confirm deletion.
          </CardDescription>
          <Button variant="destructive" disabled={!canDelete} onClick={handleDeleteAccount}>
            Delete Account
          </Button>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <b>{user.name}</b>'s account and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Yes, delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
