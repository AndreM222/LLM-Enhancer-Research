'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  Plus,
  ScanText,
  Settings2,
  Tag,
  Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import StepDialog from '@/components/dialogs/step-dialog';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/app-navigation';
import { ButtonGroup } from '@/components/ui/button-group';
import { toast } from 'sonner';
import { getSessionsData } from '@/lib/mockApi';

type CaptureMode = 'detection' | 'ocr';

type LayoutStep = {
  id: string;
  position: number;
  title: string;
  description: string;
  thumbnail?: string;
  required: boolean;
  mode: CaptureMode;
};

export type Layout = {
  id: string;
  layoutStep: LayoutStep[];
};

type StepForm = {
  title: string;
  description: string;
  thumbnail: string;
  required: boolean;
  mode: CaptureMode;
};
const EMPTY_FORM: StepForm = {
  title: '',
  description: '',
  thumbnail: '',
  required: true,
  mode: 'detection',
};

function getModeLabel(mode: CaptureMode) {
  return mode === 'ocr' ? 'OCR' : 'Detection';
}
function getModeDescription(mode: CaptureMode) {
  return mode === 'ocr'
    ? 'Extract text from the captured image.'
    : 'Find configured tags and objects in the image.';
}

function LayoutManagerPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [steps, setSteps] = useState<LayoutStep[]>(getSessionsData()[0].steps);
  const [form, setForm] = useState<StepForm>(EMPTY_FORM);
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('dialog') === 'step');

  useEffect(() => {
    setDialogOpen(searchParams.get('dialog') === 'step');
  }, [searchParams]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const isEditing = editingStepId !== null;

  const reorder = (newSteps: LayoutStep[]) => newSteps.map((s, i) => ({ ...s, position: i + 1 }));

  const swap = (id: string, dir: 'up' | 'down') => {
    setSteps((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return reorder(next);
    });
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setSteps((prev) => {
      const from = prev.findIndex((s) => s.id === draggedId);
      const to = prev.findIndex((s) => s.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return reorder(next);
    });
    setDraggedId(null);
    setDragOverId(null);
  };

  const deleteStep = (id: string) => {
    setSteps((prev) => reorder(prev.filter((s) => s.id !== id)));
    toast.success('Step removed.');
  };

  const syncLayoutDialog = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) params.set('dialog', 'step');
    else params.delete('dialog');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const openCreate = () => {
    setEditingStepId(null);
    setForm(EMPTY_FORM);
    syncLayoutDialog(true);
    setDialogOpen(true);
  };
  const openEdit = (step: LayoutStep) => {
    setEditingStepId(step.id);
    setForm({
      title: step.title,
      description: step.description,
      thumbnail: step.thumbnail ?? '',
      required: step.required,
      mode: step.mode,
    });
    syncLayoutDialog(true);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    syncLayoutDialog(false);
    setEditingStepId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingStepId) {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === editingStepId
            ? {
                ...s,
                title: form.title.trim(),
                description: form.description.trim(),
                thumbnail: form.thumbnail.trim(),
                required: form.required,
                mode: form.mode,
              }
            : s
        )
      );
      toast.success('Step updated.');
    } else {
      setSteps((prev) =>
        reorder([
          ...prev,
          {
            id: `step-${Date.now()}`,
            position: 0,
            title: form.title.trim(),
            description: form.description.trim(),
            thumbnail: form.thumbnail.trim(),
            required: form.required,
            mode: form.mode,
          },
        ])
      );
      toast.success('Step added.');
    }
    closeDialog();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        setIcon="LayoutTemplate"
        setTitle="Session layout"
        setDescription="Define the pictures users must capture for this session."
      />

      <Button variant="outline" onClick={openCreate}>
        <Plus className="mr-2 h-4 w-4" /> Add picture
      </Button>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Capture steps</CardTitle>
                <CardDescription>
                  {steps.length} picture{steps.length === 1 ? '' : 's'} requested in sequence.
                </CardDescription>
              </div>
              <Badge variant="secondary">{steps.filter((s) => s.required).length} required</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {steps.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">No capture steps yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add the first picture users should provide.
                </p>
                <Button className="mt-4" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" /> Add picture
                </Button>
              </div>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    layoutId={step.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    draggable
                    onDragStart={() => setDraggedId(step.id)}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setDragOverId(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverId(step.id);
                    }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={() => handleDrop(step.id)}
                    className={[
                      'group flex gap-3 rounded-xl border bg-card p-4 transition-colors',
                      draggedId === step.id ? 'opacity-40 scale-95' : '',
                      dragOverId === step.id && draggedId !== step.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/40',
                    ].join(' ')}
                    style={{ cursor: draggedId === step.id ? 'grabbing' : 'default' }}
                  >
                    {/* grip + position */}
                    <div className="flex w-8 shrink-0 flex-col items-center gap-1">
                      <motion.div
                        className="rounded-md p-1 text-muted-foreground hover:bg-muted cursor-grab active:cursor-grabbing"
                        whileTap={{ scale: 0.9 }}
                      >
                        <GripVertical className="h-5 w-5" />
                      </motion.div>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {step.position}
                      </span>
                    </div>

                    {/* thumbnail + info */}
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="hidden h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 sm:flex">
                        {step.thumbnail ? (
                          <img src={step.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{step.title}</h3>
                          <Badge variant={step.required ? 'default' : 'outline'}>
                            {step.required ? 'Required' : 'Optional'}
                          </Badge>
                          <Badge variant="secondary">
                            {step.mode === 'ocr' ? (
                              <ScanText className="mr-1 h-3 w-3" />
                            ) : (
                              <Tag className="mr-1 h-3 w-3" />
                            )}
                            {getModeLabel(step.mode)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {step.description || 'No description provided.'}
                        </CardDescription>
                        <CardDescription className="text-xs">
                          {getModeDescription(step.mode)}
                        </CardDescription>
                      </div>
                    </div>

                    {/* controls */}
                    <div className="shrink-0 items-start gap-1 space-y-2 block sm:flex">
                      <div className="items-center gap-1">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => swap(step.id, 'up')}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={index === steps.length - 1}
                            onClick={() => swap(step.id, 'down')}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </ButtonGroup>
                      </div>

                      <ButtonGroup>
                        <Button variant="outline" size="icon" onClick={() => openEdit(step)}>
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </CardContent>

          <CardFooter className="mt-auto">
            <CardDescription>
              Drag a step to change the order, or use the arrow controls.
            </CardDescription>
          </CardFooter>
        </Card>

        {/* sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capture preview</CardTitle>
              <CardDescription>
                This is the order users will see when creating detections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    layoutId={`preview-${step.id}`}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{step.title}</p>
                      <CardDescription className="text-xs">
                        {step.required ? 'Required' : 'Optional'} · {getModeLabel(step.mode)}
                      </CardDescription>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {steps.length === 0 && (
                <p className="text-sm text-muted-foreground">Your capture flow is empty.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing modes</CardTitle>
              <CardDescription>Choose what happens after each picture is captured.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3">
                <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Detection</p>
                  <CardDescription>
                    Finds configured tags such as boxes, clips, pencils, or papers.
                  </CardDescription>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <ScanText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">OCR</p>
                  <CardDescription>
                    Reads and extracts text from the captured image.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StepDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) syncLayoutDialog(false);
        }}
        form={form}
        setForm={(f) => setForm(f)}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        closeDialog={closeDialog}
      />
    </div>
  );
}

export default function LayoutManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading layout...
        </div>
      }
    >
      <LayoutManagerPageContent />
    </Suspense>
  );
}
