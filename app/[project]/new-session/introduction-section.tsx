'use client';

import { Camera, ChevronRight, CircleAlert, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type PermissionState = {
  camera: boolean;
  location: boolean;
};

export function PermissionsSection({
  permissions,
  message,
  onCameraChange,
  onLocationChange,
  onContinue,
}: {
  permissions: PermissionState;
  message: string;
  onCameraChange: (value: boolean) => void;
  onLocationChange: (value: boolean) => void;
  onContinue: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Allow permissions</CardTitle>
        <CardDescription>
          Camera and location data help us capture better images, associate the session with the
          correct place, and improve detection accuracy. You can manage these permissions in your
          browser settings at any time.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <PermissionRow
          icon={<Camera className="h-5 w-5" />}
          title="Camera access"
          description="Required to capture the pictures defined by the selected layout."
          checked={permissions.camera}
          onCheckedChange={onCameraChange}
        />

        <PermissionRow
          icon={<MapPin className="h-5 w-5" />}
          title="Location access"
          description="Used to associate the session with the capture location and improve context."
          checked={permissions.location}
          onCheckedChange={onLocationChange}
        />

        {message && (
          <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <CircleAlert className="h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onContinue}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PermissionRow({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            'rounded-lg border p-2',
            checked
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {icon}
        </div>

        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  );
}
