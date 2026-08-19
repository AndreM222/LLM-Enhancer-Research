'use client';

import {
  Camera,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { SessionLayoutGroup } from '@/lib/mockApi';

export type CapturedPicture = {
  id: string;
  stepId: string;
  title: string;
  src: string;
  capturedAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export function CaptureSection({
  layout,
  captureIndex,
  pictures,
  progress,
  isCapturing,
  onCapture,
  onBack,
  onReview,
}: {
  layout?: SessionLayoutGroup;
  captureIndex: number;
  pictures: CapturedPicture[];
  progress: number;
  isCapturing: boolean;
  onCapture: () => void;
  onBack: () => void;
  onReview: () => void;
}) {
  if (!layout) {
    return null;
  }

  const currentStep = layout.steps[captureIndex];
  const currentPicture = pictures.find((picture) => picture.stepId === currentStep?.id);

  const isComplete = layout.steps
    .filter((step) => step.required)
    .every((step) => pictures.some((picture) => picture.stepId === step.id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Take pictures</CardTitle>
            <CardDescription>
              Follow the layout order and capture each required view.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {captureIndex + 1} / {layout.steps.length}
          </Badge>
        </div>

        <div className="space-y-2 pt-3">
          <div className="flex justify-between text-sm">
            <span>Required pictures</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="relative flex min-h-100 items-center justify-center overflow-hidden rounded-2xl border bg-muted/30">
            {currentPicture ? (
              <img
                src={currentPicture.src}
                alt={currentStep.title}
                className="h-full max-h-125 w-full object-cover"
              />
            ) : (
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium">Camera preview</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your captured image will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge>{currentStep.position}</Badge>
                <h3 className="font-semibold">{currentStep.title}</h3>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{currentStep.description}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium">Processing mode</p>
              <p className="mt-1 text-sm capitalize text-muted-foreground">{currentStep.mode}</p>
            </div>

            <Button className="w-full" onClick={onCapture} disabled={isCapturing}>
              <Camera className="mr-2 h-4 w-4" />
              {isCapturing ? 'Capturing...' : currentPicture ? 'Retake picture' : 'Take picture'}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={onReview} disabled={!isComplete}>
            Review pictures
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
