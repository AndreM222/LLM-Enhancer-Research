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

export type TagGroupInput = {
  name: string;
  description: string;
};

type Props = {
  onCreate: (data: TagGroupInput) => void;
};

export function CreateTagGroupDialog({ onCreate }: Props) {
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
        <Button>Create Tag Group</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Tag Group</DialogTitle>
            <DialogDescription>
              A tag group is a container for tags. Each tag inside can have its own name, color, and
              description.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <Label htmlFor="tag-group-name">Name</Label>
              <Input
                id="tag-group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Office Supplies"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="tag-group-description">Description</Label>
              <Textarea
                id="tag-group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What kind of detections does this group describe?"
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
