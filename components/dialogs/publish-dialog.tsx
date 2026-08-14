'use client';

import { useState } from 'react';
import { ArrowRight, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getProjects } from '@/lib/mockApi';
import Image from 'next/image';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from '@/components/ui/combobox';

type PublishForm = {
  projectId: string;
  name: string;
  description: string;
  categories: string;
  images: string[];
};

const EMPTY_PUBLISH: PublishForm = {
  projectId: '',
  name: '',
  description: '',
  categories: '',
  images: [],
};

export default function PublishDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [form, setForm] = useState<PublishForm>(EMPTY_PUBLISH);
  const [projectValue, setProjectValue] = useState('');
  const allProjects = getProjects();

  const selectedProject = allProjects.find((p) => p.id === projectValue) ?? null;

  const selectProject = (id: string) => {
    setProjectValue(id);
    const p = allProjects.find((x) => x.id === id);
    if (!p) return;
    setForm((prev) => ({
      ...prev,
      projectId: id,
      name: p.name,
      description: p.description,
    }));
  };

  const addImageUrl = (url: string) => {
    if (!url.trim() || form.images.length >= 4) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
  };

  const removeImage = (i: number) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const [imgInput, setImgInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId) {
      toast.error('Select a project to publish.');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Template name is required.');
      return;
    }
    toast.success(`"${form.name}" published to marketplace.`);
    setForm(EMPTY_PUBLISH);
    setProjectValue('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Publish template</DialogTitle>
            <DialogDescription>
              Share your project configuration with the marketplace. Training images are never
              shared.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label>Project</Label>
              <Combobox value={projectValue} onValueChange={(v) => selectProject(v ?? '')}>
                <ComboboxInput placeholder="Select a project..." />
                <ComboboxContent>
                  <ComboboxList>
                    {!allProjects.length && <ComboboxEmpty>No projects found.</ComboboxEmpty>}
                    {allProjects.map((p) => (
                      <ComboboxItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md bg-${p.color}`} />
                          <span className="flex flex-col">
                            <span>{p.name}</span>
                            <span className="text-xs text-muted-foreground">{p.description}</span>
                          </span>
                        </span>
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {selectedProject && (
                <div className="flex items-center gap-3 rounded-xl border p-3 bg-muted/20">
                  <div className="h-10 w-10 rounded-md bg-muted" />
                  <div>
                    <p className="font-medium">{selectedProject.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tpl-name">Template name</Label>
              <Input
                id="tpl-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Warehouse damage detection"
                maxLength={64}
              />
              <p className="text-xs text-muted-foreground">
                Pre-filled from the project — edit freely.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tpl-desc">Description</Label>
              <Textarea
                id="tpl-desc"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what this template detects and when to use it..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tpl-cats">Categories</Label>
              <Input
                id="tpl-cats"
                value={form.categories}
                onChange={(e) => setForm((p) => ({ ...p, categories: e.target.value }))}
                placeholder="e.g. damage, warehouse, pallets, scratches"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated keywords that describe what this template does — helps others
                discover it.
              </p>
              {form.categories && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {form.categories
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>
                Preview images <span className="text-muted-foreground">(max 4)</span>
              </Label>

              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {form.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square overflow-hidden rounded-xl border"
                    >
                      {/* next/image expects static dimensions; using img for simplicity */}
                      <img src={src} alt="" className="object-cover h-full w-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {form.images.length < 4 && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL..."
                    value={imgInput}
                    onChange={(e) => setImgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImageUrl(imgInput);
                        setImgInput('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      addImageUrl(imgInput);
                      setImgInput('');
                    }}
                    disabled={!imgInput.trim()}
                  >
                    Add
                  </Button>
                  <Button type="button" variant="outline" size="icon" className="shrink-0" disabled>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Add up to 4 preview images. Upload from device coming soon.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              Publish <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
