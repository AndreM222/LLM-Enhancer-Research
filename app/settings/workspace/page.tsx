'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { pictureFallback } from '@/components/user-button';
import { WorkspaceBanner } from '@/components/workspace-banner';

const workspace = {
  name: 'Damage Visualizer',
  logo: '',
};

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
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentWorkspace} alt={workspace.name} />
              <AvatarFallback>{pictureFallback(workspace.name)}</AvatarFallback>
            </Avatar>

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
      </Card>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
