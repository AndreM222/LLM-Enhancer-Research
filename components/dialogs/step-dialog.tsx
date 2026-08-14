'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

export type CaptureMode = 'detection' | 'ocr';

export type StepForm = {
  title: string;
  description: string;
  thumbnail: string;
  required: boolean;
  mode: CaptureMode;
};

export default function StepDialog({
  open,
  onOpenChange,
  form,
  setForm,
  isEditing,
  handleSubmit,
  closeDialog,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: StepForm;
  setForm: (f: StepForm) => void;
  isEditing: boolean;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  closeDialog: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit capture step' : 'Add capture step'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label htmlFor="step-title">Title</Label>
              <Input
                id="step-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Front of package"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="step-description">Description</Label>
              <Textarea
                id="step-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain what the user should capture."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="step-thumbnail">Thumbnail URL</Label>
              <Input
                id="step-thumbnail"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://example.com/example.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Optional example image to guide the person taking the picture.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="step-mode">Processing mode</Label>
              <Select
                value={form.mode}
                onValueChange={(v) => setForm({ ...form, mode: v as CaptureMode })}
              >
                <SelectTrigger id="step-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detection">Detection</SelectItem>
                  <SelectItem value="ocr">OCR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <Label htmlFor="step-required">Required picture</Label>
                <p className="text-xs text-muted-foreground">
                  Users must complete this step before continuing.
                </p>
              </div>
              <Switch
                id="step-required"
                checked={form.required}
                onCheckedChange={(v) => setForm({ ...form, required: v as boolean })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit">{isEditing ? 'Save changes' : 'Add picture'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
