'use client';

import {
  Check,
  ChevronLeft,
  CircleAlert,
  RotateCcw,
  Upload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { SessionLayoutGroup } from '@/lib/mockApi';
import { CapturedPicture } from './action-section';

export function ReviewSection({
  layout,
  pictures,
  onRetake,
  onBack,
  onSubmit,
}: {
  layout?: SessionLayoutGroup;
  pictures: CapturedPicture[];
  onRetake: (stepId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  if (!layout) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check pictures</CardTitle>
        <CardDescription>
          Review every picture before submitting the session. Retake any picture that is unclear or
          incorrect.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layout.steps.map((step) => {
            const picture = pictures.find((item) => item.stepId === step.id);

            return (
              <div key={step.id} className="overflow-hidden rounded-xl border">
                <div className="aspect-video bg-muted/40">
                  {picture ? (
                    <img
                      src={picture.src}
                      alt={step.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CircleAlert className="h-6 w-6 text-amber-500" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">Picture {step.position}</p>
                    </div>

                    {picture ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Badge variant="destructive">Missing</Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onRetake(step.id)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to pictures
          </Button>

          <Button onClick={onSubmit}>
            <Upload className="mr-2 h-4 w-4" />
            Submit session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
