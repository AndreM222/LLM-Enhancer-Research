'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { getProjectById, getProjectSessionLayouts } from '@/lib/mockApi';
import { PermissionsSection } from './introduction-section';
import { LayoutSection } from './layout-selector-section';
import { CaptureSection } from './action-section';
import { ReviewSection } from './review-input-section';
import { CompleteSection } from './submission-section';

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
  const [captureLayoutId, setCaptureLayoutId] = useState<string>();

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

  const [maxReached, setMaxReached] = useState(0);

  const goToStep = (next: SessionStepId) => {
    const index = steps.findIndex((s) => s.id === next);

    setCurrentStep(next);
    setMaxReached((prev) => Math.max(prev, index));
  };

  const handlePermissionContinue = () => {
    if (!canContinueFromPermissions) {
      setPermissionMessage('Camera and location permissions are required to continue.');
      return;
    }

    goToStep('layout');
  };

  const handleLayoutContinue = () => {
    if (!canContinueFromLayout) return;

    if (captureLayoutId !== selectedLayoutId) {
      setPictures([]);
      setCaptureIndex(0);
      setCaptureLayoutId(selectedLayoutId);
    }

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
                disabled={index > maxReached || currentStep === 'complete'}
                completed={steps.findIndex((item) => item.id === currentStep) > index}
              >
                <StepperTrigger
                  className="w-full justify-start px-2 py-1"
                  onClick={() => goToStep(step.id)}
                >
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
