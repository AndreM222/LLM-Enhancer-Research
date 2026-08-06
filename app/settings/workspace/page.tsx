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
import { X } from 'lucide-react';
import { AccountPicture } from '@/components/account-banner';
import { WorkspaceBanner } from '@/components/workspace-banner';
import { getWorkspace, Workspace } from '@/lib/mockApi';
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

const initialWorkspace: Workspace = getWorkspace()[0];

export default function GeneralSettingsPage() {
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [preview, setPreview] = useState<string | null>(null);
  const currentLogo = preview ?? workspace.logo;

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const canDelete = deleteConfirm === workspace.name;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteWorkspace = () => {
    if (!canDelete) return;
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.error('Workspace deleted.');
    setDeleteDialogOpen(false);
  };

  const handleSaveLogo = () => {
    if (!preview) return;
    setWorkspace((prev) => ({ ...prev, logo: preview }));
    setPreview(null);
    toast.success('Logo saved.');
  };

  const handleSaveName = () => {
    if (!name.trim()) return;
    setWorkspace((prev) => ({ ...prev, name }));
    toast.success('Name saved.');
  };

  const handleSaveUrl = () => {
    if (!url.trim()) return;
    toast.success('Workspace URL saved.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <WorkspaceBanner
            workspace={{ ...workspace, name: name || workspace.name, logo: currentLogo }}
            size="lg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <AccountPicture name={name || workspace.name} avatar={currentLogo} size="sm" />
            <p className="text-xs text-muted-foreground">
              PNG, JPG, or WEBP. Recommended size: 512×512.
            </p>
          </div>
          <div className="rounded-xl border border-dashed p-4">
            <Label htmlFor="logo-upload" className="mb-3 block text-sm font-medium">
              Attachment
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                id="logo-upload"
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
          <Button disabled={!preview} onClick={handleSaveLogo}>
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
            id="workspace-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={initialWorkspace.name}
            maxLength={32}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button disabled={!name.trim()} onClick={handleSaveName}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-stretch overflow-hidden rounded-lg border">
            <div className="flex items-center border-r bg-muted px-4 text-sm text-muted-foreground">
              hexel.com/
            </div>
            <Input
              className="flex-1 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              id="workspace-url"
              value={url}
              onChange={(e) => setUrl(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder={initialWorkspace.name.replace(' ', '-').toLowerCase()}
              maxLength={32}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button disabled={!url.trim()} onClick={handleSaveUrl}>
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Workspace</CardTitle>
          <CardDescription>This action is permanent and cannot be reversed.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder={workspace.name}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>
            Type <b>{workspace.name}</b> to confirm deletion.
          </CardDescription>
          <Button variant="destructive" disabled={!canDelete} onClick={handleDeleteWorkspace}>
            Delete Workspace
          </Button>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <b>{workspace.name}</b>'s workspace and all associated
                  data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleConfirmDelete}
                >
                  Yes, delete workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
