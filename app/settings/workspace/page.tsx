'use client';

import { useState } from 'react';
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

const workspace: Workspace = getWorkspace()[0];

export default function GeneralSettingsPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const currentWorkspace = preview ?? workspace.logo;

  return (
    <div className="space-y-6">
      <Card className="py-6 px-2">
        <CardContent className="space-y-4">
          <WorkspaceBanner workspace={workspace} size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <AccountPicture name={workspace.name} avatar={currentWorkspace} size="sm" />

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WEBP. Recommended size: 512×512.
              </p>
            </div>
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
                  const url = URL.createObjectURL(file);
                  setPreview(url);
                }}
              />

              <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="workspace-name" placeholder={workspace.name} />
        </CardContent>
        <CardFooter>
          <CardDescription>Please use 35 characters at maximum.</CardDescription>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex w-full items-stretch overflow-hidden rounded-lg border">
              <div className="flex items-center border-r bg-muted px-4 text-sm text-muted-foreground">
                hexel.com/
              </div>

              <Input
                className="flex-1 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                id="workspace-url"
                placeholder={workspace.name.replace(' ', '-')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription>Please use 48 characters at maximum.</CardDescription>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
