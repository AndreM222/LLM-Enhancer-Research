'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type LayoutInput = {
  name: string;
  description: string;
};

type Props = {
  onCreate: (data: LayoutInput) => void;
};

export function CreateLayoutDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Layout</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Layout</DialogTitle>
            <DialogDescription>
              A layout is a container of defined ordered and configured group of pictures which
              define the flow of a new session of detections taking place.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <Label htmlFor="layout-name">Name</Label>
              <Input
                id="layout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Office Supplies"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="layout-description">Description</Label>
              <Textarea
                id="layout-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What kind of detections does this layout describe?"
                rows={3}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
