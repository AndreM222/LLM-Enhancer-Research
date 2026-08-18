'use client';

import {
  Check,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function CompleteSection({
  projectId,
  projectName,
  onReturn,
}: {
  projectId: string;
  projectName: string;
  onReturn: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-100 flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <Check className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold">Session submitted</h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your pictures were submitted successfully to{' '}
          <span className="font-medium text-foreground">{projectName}</span>. Detection processing
          can continue in the background.
        </p>

        <Button className="mt-6" onClick={onReturn}>
          Return to project
        </Button>

        <p className="mt-3 text-xs text-muted-foreground">Project: {projectId}</p>
      </CardContent>
    </Card>
  );
}
