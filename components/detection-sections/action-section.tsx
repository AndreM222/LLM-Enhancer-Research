// components/detection-sections/action-section.tsx

'use client';

import {
  Camera,
  CameraIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Images,
  RotateCcw,
  SwitchCamera,
  Upload,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type {
  LayoutStep,
  SessionLayoutGroup,
} from '@/lib/mockApi';

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

type CaptureSectionProps = {
  layout?: SessionLayoutGroup;
  captureIndex: number;
  pictures: CapturedPicture[];
  progress: number;
  isCapturing: boolean;
  onCapture: (
    image: CapturedPicture,
    step: LayoutStep
  ) => void;
  onBack: () => void;
  onReview: () => void;
  canReview: boolean;
};

type CameraFacing = 'user' | 'environment';

export function CaptureSection({
  layout,
  captureIndex,
  pictures,
  progress,
  isCapturing,
  onCapture,
  onBack,
  onReview,
  canReview,
}: CaptureSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] =
    useState<CameraFacing>('environment');

  const [cameraError, setCameraError] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const currentStep = layout?.steps[captureIndex];

  const currentPicture = pictures.find(
    (picture) => picture.stepId === currentStep?.id
  );

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera access is not available in this browser.'
      );
      return;
    }

    setIsStartingCamera(true);
    setCameraError('');
    setIsCameraReady(false);

    streamRef.current?.getTracks().forEach((track) => track.stop());

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch {
      setCameraError(
        'Unable to access the camera. Check your browser permissions and try again.'
      );
    } finally {
      setIsStartingCamera(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraReady(false);
  }, []);

  useEffect(() => {
    void startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const switchCamera = async () => {
    setFacingMode((previous) =>
      previous === 'environment' ? 'user' : 'environment'
    );
  };

  const getLocation = () => {
    return new Promise<
      CapturedPicture['location']
    >((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => resolve(undefined),
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    });
  };

  const createPicture = async (src: string) => {
    if (!currentStep || isCapturing) {
      return;
    }

    const location = await getLocation();

    onCapture(
      {
        id: `picture-${currentStep.id}-${Date.now()}`,
        stepId: currentStep.id,
        title: currentStep.title,
        src,
        capturedAt: new Date().toISOString(),
        location,
      },
      currentStep
    );
  };

  const takePicture = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !currentStep ||
      isCapturing ||
      !isCameraReady
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const src = canvas.toDataURL('image/jpeg', 0.9);

    await createPicture(src);
  };

  const handleGalleryChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const src = URL.createObjectURL(file);

    await createPicture(src);

    event.target.value = '';
  };

  const goToPreviousStep = () => {
    if (captureIndex > 0) {
      // Parent can update the active index through the thumbnail selection.
      const previousStep = layout?.steps[captureIndex - 1];

      if (previousStep) {
        window.dispatchEvent(
          new CustomEvent('session-capture-step', {
            detail: captureIndex - 1,
          })
        );
      }
    }
  };

  const goToNextStep = () => {
    if (!layout) {
      return;
    }

    if (captureIndex < layout.steps.length - 1) {
      window.dispatchEvent(
        new CustomEvent('session-capture-step', {
          detail: captureIndex + 1,
        })
      );
    }
  };

  if (!layout) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Select a layout before taking pictures.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Take pictures</CardTitle>
            <CardDescription>
              Capture each view in the layout. Select a previous
              picture below to replace it.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {pictures.length} / {layout.steps.length} captured
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Required pictures</span>
            <span className="text-muted-foreground">
              {progress}%
            </span>
          </div>

          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-black shadow-sm sm:aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />

              <canvas ref={canvasRef} className="hidden" />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3">
                <Badge className="bg-black/60 text-white hover:bg-black/60">
                  {facingMode === 'environment'
                    ? 'Back camera'
                    : 'Front camera'}
                </Badge>

                <Badge className="bg-black/60 text-white hover:bg-black/60">
                  Step {captureIndex + 1} of {layout.steps.length}
                </Badge>
              </div>

              {!isCameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6 text-center text-sm text-white">
                  {isStartingCamera
                    ? 'Starting camera...'
                    : cameraError || 'Camera is not ready.'}
                </div>
              )}

              <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/60 sm:inset-14" />

              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-12">
                <Button
                  type="button"
                  size="icon"
                  className="size-16 rounded-full border-4 border-white/80 shadow-xl"
                  onClick={takePicture}
                  disabled={!isCameraReady || isCapturing}
                  aria-label={
                    currentPicture
                      ? 'Replace picture'
                      : 'Take picture'
                  }
                >
                  {isCapturing ? (
                    <span className="size-5 animate-pulse rounded-full bg-current" />
                  ) : (
                    <CameraIcon className="size-7" />
                  )}
                </Button>
              </div>
            </div>

            {cameraError && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <span className="text-muted-foreground">
                  {cameraError}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void startCamera()}
                >
                  Try again
                </Button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 sm:hidden">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={switchCamera}
                aria-label="Switch camera"
              >
                <SwitchCamera className="size-5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Images className="mr-2 size-4" />
                Gallery
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleGalleryChange}
              />
            </div>
          </div>

          <div className="space-y-4">

            <div className="hidden gap-2 sm:flex">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={switchCamera}
              >
                <SwitchCamera className="mr-2 size-4" />
                Switch camera
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Images className="mr-2 size-4" />
                Gallery
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleGalleryChange}
              />
            </div>

            {currentPicture && (
              <div className="overflow-hidden rounded-xl border">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={currentPicture.src}
                    alt={currentPicture.title}
                    className="h-full w-full object-cover"
                  />

                  <Badge className="absolute bottom-2 left-2">
                    Current picture
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-3 p-3">
                  <p className="truncate text-sm text-muted-foreground">
                    Ready to replace if needed
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={takePicture}
                    disabled={!isCameraReady || isCapturing}
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Replace
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <CaptureThumbnailStrip
          layout={layout}
          pictures={pictures}
          activeIndex={captureIndex}
          onSelect={(index) => {
            window.dispatchEvent(
              new CustomEvent('session-capture-step', {
                detail: index,
              })
            );
          }}
        />

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 size-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={captureIndex === 0}
            >
              <ChevronLeft className="mr-2 size-4" />
              Previous
            </Button>

            {captureIndex < layout.steps.length - 1 ? (
              <Button
                onClick={goToNextStep}
                disabled={!currentPicture}
              >
                Next
                <ChevronRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button onClick={onReview} disabled={!canReview}>
                Review pictures
                <ChevronRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CaptureThumbnailStrip({
  layout,
  pictures,
  activeIndex,
  onSelect,
}: {
  layout: SessionLayoutGroup;
  pictures: CapturedPicture[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Capture checklist</p>
          <p className="text-xs text-muted-foreground">
            Select a picture to review or replace it.
          </p>
        </div>

        <Badge variant="outline">
          {pictures.length}/{layout.steps.length}
        </Badge>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {layout.steps.map((step, index) => {
          const picture = pictures.find(
            (item) => item.stepId === step.id
          );

          const isActive = index === activeIndex;

          return (
            <button
              key={step.id}
              type="button"
              className={cn(
                'group relative w-28 shrink-0 overflow-hidden rounded-xl border text-left transition-all',
                'hover:border-primary/70',
                isActive &&
                  'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => onSelect(index)}
              aria-label={`Select ${step.title}`}
            >
              <div className="aspect-square bg-muted">
                {picture ? (
                  <img
                    src={picture.src}
                    alt={step.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="size-5" />
                    <span className="text-[10px]">
                      Not captured
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute left-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/65 text-xs text-white">
                {picture ? (
                  <Check className="size-3.5" />
                ) : (
                  step.position
                )}
              </div>

              <div className="truncate border-t bg-background px-2 py-2 text-xs">
                {step.title}
              </div>

              {!step.required && (
                <span className="absolute right-1 top-1 rounded bg-black/65 px-1 text-[9px] text-white">
                  Optional
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
