'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ImagePlus,
  MapPin,
  RotateCcw,
  Upload,
} from 'lucide-react';

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { getProjectById, getProjectSessionLayouts, SessionLayoutGroup } from '@/lib/mockApi';

type SessionStepId = 'permissions' | 'layout' | 'capture' | 'review' | 'complete';

type PermissionState = {
  camera: boolean;
  location: boolean;
};

type CapturedPicture = {
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

const steps = [
  {
    id: 'permissions',
    title: 'Permissions',
    description: 'Allow camera and location access',
  },
  {
    id: 'layout',
    title: 'Layout',
    description: 'Choose a capture layout',
  },
  {
    id: 'capture',
    title: 'Take pictures',
    description: 'Capture each required view',
  },
  {
    id: 'review',
    title: 'Check pictures',
    description: 'Review before submitting',
  },
  {
    id: 'complete',
    title: 'Completed',
    description: 'Session submitted',
  },
] satisfies {
  id: SessionStepId;
  title: string;
  description: string;
}[];

function formatPermissionError(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return 'Permission was denied. Enable it in your browser settings and try again.';
    }

    if (error.name === 'NotFoundError') {
      return 'No camera was found on this device.';
    }
  }

  return 'Permission could not be requested.';
}

export default function NewSession() {
  const router = useRouter();
  const params = useParams<{ project: string }>();
  const projectId = params.project;

  const project = getProjectById(projectId);

  const layouts = useMemo(() => {
    return getProjectSessionLayouts(projectId);
  }, [projectId]);

  const [currentStep, setCurrentStep] = useState<SessionStepId>('permissions');

  const [permissions, setPermissions] = useState<PermissionState>({
    camera: false,
    location: false,
  });

  const [permissionMessage, setPermissionMessage] = useState('');

  const [selectedLayoutId, setSelectedLayoutId] = useState('');

  useEffect(() => {
    setSelectedLayoutId((currentId) => {
      if (currentId && layouts.some((layout) => layout.id === currentId)) {
        return currentId;
      }

      return layouts[0]?.id ?? '';
    });
  }, [layouts]);

  const selectedLayout = layouts.find((layout) => layout.id === selectedLayoutId);

  const [pictures, setPictures] = useState<CapturedPicture[]>([]);
  const [captureIndex, setCaptureIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const currentCaptureStep = selectedLayout?.steps[captureIndex];

  const requiredPictureCount = selectedLayout?.steps.filter((step) => step.required).length ?? 0;

  const capturedRequiredCount = selectedLayout
    ? selectedLayout.steps.filter(
        (step) => step.required && pictures.some((picture) => picture.stepId === step.id)
      ).length
    : 0;

  const captureProgress =
    requiredPictureCount === 0
      ? 0
      : Math.round((capturedRequiredCount / requiredPictureCount) * 100);

  const requestCameraPermission = async () => {
    try {
      setPermissionMessage('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissions((previous) => ({
        ...previous,
        camera: true,
      }));
    } catch (error) {
      setPermissionMessage(formatPermissionError(error));
    }
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setPermissionMessage('Location services are not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissions((previous) => ({
          ...previous,
          location: true,
        }));
        setPermissionMessage('');
      },
      () => {
        setPermissionMessage(
          'Location permission was denied. Enable it in your browser settings and try again.'
        );
      }
    );
  };

  const canContinueFromPermissions = permissions.camera && permissions.location;

  const canContinueFromLayout = Boolean(selectedLayout && selectedLayout.steps.length > 0);

  const canContinueFromCapture =
    requiredPictureCount > 0 && capturedRequiredCount === requiredPictureCount;

  const goToStep = (step: SessionStepId) => {
    setCurrentStep(step);
  };

  const handlePermissionContinue = () => {
    if (!canContinueFromPermissions) {
      setPermissionMessage('Camera and location permissions are required to continue.');
      return;
    }

    goToStep('layout');
  };

  const handleLayoutContinue = () => {
    if (!canContinueFromLayout) {
      return;
    }

    setCaptureIndex(0);
    setPictures([]);
    goToStep('capture');
  };

  const capturePicture = async () => {
    if (!currentCaptureStep || isCapturing) {
      return;
    }

    setIsCapturing(true);

    let location:
      | {
          latitude: number;
          longitude: number;
        }
      | undefined;

    if (permissions.location) {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve();
          },
          () => resolve()
        );
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const picture: CapturedPicture = {
      id: `picture-${Date.now()}`,
      stepId: currentCaptureStep.id,
      title: currentCaptureStep.title,
      src: '/session-preview.jpg',
      capturedAt: new Date().toISOString(),
      location,
    };

    setPictures((previous) => [
      ...previous.filter((item) => item.stepId !== currentCaptureStep.id),
      picture,
    ]);

    setIsCapturing(false);

    if (captureIndex < (selectedLayout?.steps.length ?? 1) - 1) {
      setCaptureIndex((previous) => previous + 1);
    }
  };

  const retakePicture = (stepId: string) => {
    const index = selectedLayout?.steps.findIndex((step) => step.id === stepId) ?? -1;

    if (index < 0) {
      return;
    }

    setPictures((previous) => previous.filter((picture) => picture.stepId !== stepId));

    setCaptureIndex(index);
    goToStep('capture');
  };

  const handleSubmit = () => {
    if (!canContinueFromCapture) {
      return;
    }

    console.log('Submitting session:', {
      projectId,
      layoutId: selectedLayoutId,
      pictures,
      permissions,
    });

    goToStep('complete');
  };

  if (!project) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>The project you are trying to use does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>Return home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create detection session</h1>
          <Badge variant="outline">{project.name}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Follow the steps to capture and submit the pictures required for this project.
        </p>
      </div>

      <Stepper
        steps={steps}
        value={currentStep}
        onValueChange={(value) => setCurrentStep(value as SessionStepId)}
        responsive
        className="space-y-8"
      >
        <StepperNav className="rounded-xl border bg-card p-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex min-w-0 flex-1">
              <StepperItem
                stepId={step.id}
                completed={steps.findIndex((item) => item.id === currentStep) > index}
              >
                <StepperTrigger className="w-full justify-start px-2 py-1">
                  <StepperIndicator>{index + 1}</StepperIndicator>

                  <div className="hidden min-w-0 text-left md:block">
                    <StepperTitle>{step.title}</StepperTitle>
                    <StepperDescription>{step.description}</StepperDescription>
                  </div>
                </StepperTrigger>

                {index < steps.length - 1 && <StepperSeparator />}
              </StepperItem>
            </div>
          ))}
        </StepperNav>

        <StepperPanel>
          <StepperContent value="permissions">
            <PermissionsSection
              permissions={permissions}
              message={permissionMessage}
              onCameraChange={(value) => {
                if (value) {
                  requestCameraPermission();
                } else {
                  setPermissions((previous) => ({
                    ...previous,
                    camera: false,
                  }));
                }
              }}
              onLocationChange={(value) => {
                if (value) {
                  requestLocationPermission();
                } else {
                  setPermissions((previous) => ({
                    ...previous,
                    location: false,
                  }));
                }
              }}
              onContinue={handlePermissionContinue}
            />
          </StepperContent>

          <StepperContent value="layout">
            <LayoutSection
              layouts={layouts}
              selectedLayoutId={selectedLayoutId}
              onLayoutChange={setSelectedLayoutId}
              onBack={() => goToStep('permissions')}
              onContinue={handleLayoutContinue}
            />
          </StepperContent>

          <StepperContent value="capture">
            <CaptureSection
              layout={selectedLayout}
              captureIndex={captureIndex}
              pictures={pictures}
              progress={captureProgress}
              isCapturing={isCapturing}
              onCapture={capturePicture}
              onBack={() => goToStep('layout')}
              onReview={() => goToStep('review')}
            />
          </StepperContent>

          <StepperContent value="review">
            <ReviewSection
              layout={selectedLayout}
              pictures={pictures}
              onRetake={retakePicture}
              onBack={() => goToStep('capture')}
              onSubmit={handleSubmit}
            />
          </StepperContent>

          <StepperContent value="complete">
            <CompleteSection
              projectId={projectId}
              projectName={project.name}
              onReturn={() => router.push(`/${projectId}`)}
            />
          </StepperContent>
        </StepperPanel>
      </Stepper>
    </div>
  );
}

function PermissionsSection({
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

function LayoutSection({
  layouts,
  selectedLayoutId,
  onLayoutChange,
  onBack,
  onContinue,
}: {
  layouts: SessionLayoutGroup[];
  selectedLayoutId: string;
  onLayoutChange: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a layout</CardTitle>
        <CardDescription>
          Select the ordered picture layout you want to use for this session.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {layouts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">No layouts available</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a layout to this project before creating a session.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedLayoutId}
            onValueChange={onLayoutChange}
            className="grid gap-3 md:grid-cols-2"
          >
            {layouts.map((layout) => (
              <Label
                key={layout.id}
                htmlFor={layout.id}
                className={cn(
                  'cursor-pointer rounded-xl border p-4 transition-colors',
                  selectedLayoutId === layout.id && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem id={layout.id} value={layout.id} className="mt-1" />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{layout.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{layout.description}</p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      <Badge variant="secondary">{layout.steps.length} pictures</Badge>

                      <Badge variant="outline">
                        {layout.steps.filter((step) => step.required).length} required
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      {layout.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px]">
                            {step.position}
                          </span>
                          <span>{step.title}</span>
                          {!step.required && <span className="ml-auto">Optional</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={onContinue} disabled={layouts.length === 0}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CaptureSection({
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

function ReviewSection({
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

function CompleteSection({
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
