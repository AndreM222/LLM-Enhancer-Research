'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AccountBanner, pictureFallback } from '@/components/user-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';

const user = {
  name: 'Jacke Myres',
  email: 'Jacke@gmail.com',
  avatar: 'https://github.com/shadcn.png',
};

export default function AccountSettingsPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const currentAvatar = preview ?? user.avatar;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <AccountBanner user={user} size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentAvatar} alt={user.name} />
              <AvatarFallback>{pictureFallback(user.name)}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WEBP. Recommended size: 512×512.
              </p>
            </div>
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
          <Input id="name" placeholder="Andre Mossi" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="email" type="email" placeholder="andre@research.io" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Enter your old password to set a new one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="old-password">Old password</Label>
            <Input id="old-password" type="password" placeholder="••••••••" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save account</Button>
      </div>
    </div>
  );
}
