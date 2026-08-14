'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type Tag = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export default function TagDialog({
  mode = 'add',
  open,
  onOpenChange,
  initial,
  onAdd,
  onSave,
}: {
  mode?: 'add' | 'edit';
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Tag | null;
  onAdd?: (t: Tag) => void;
  onSave?: (t: Tag) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setColor(initial.color);
    } else {
      setName('');
      setDescription('');
      setColor('#3b82f6');
    }
  }, [initial, open]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const t: Tag = {
      id: `t-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color,
    };
    onAdd?.(t);
    onOpenChange(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initial) return;
    const t: Tag = { ...initial, name: name.trim(), description: description.trim(), color };
    onSave?.(t);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={mode === 'add' ? handleAdd : handleSave}>
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? 'Add Tag to Group' : 'Edit Tag'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Field>
              <Label htmlFor="tag-name">Name</Label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clip"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="tag-description">Description</Label>
              <Textarea
                id="tag-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this tag detect?"
                rows={3}
              />
            </Field>

            <Field>
              <Label htmlFor="tag-color">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  id="tag-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border bg-transparent p-0"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-28"
                  maxLength={7}
                  placeholder="#000000"
                />
              </div>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'add' ? 'Add Tag' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
