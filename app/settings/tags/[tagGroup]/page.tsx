'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
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
import { CreateTagItemTable } from '@/components/tables/tags-table';
import { PageHeader } from '@/components/app-navigation';
import { getTags } from '@/lib/mockApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type Tag = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type TagGroupDetail = {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
};

export default function TagGroupPage() {
  const pathname = usePathname();
  const id = pathname.split('/').filter(Boolean).pop() || '';

  // Replace this with real data fetch by id
  const [group, setGroup] = useState<TagGroupDetail>(getTags()[0]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  const handleAddTag = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    const newTag: Tag = {
      id: `t-${Date.now()}`,
      name: tagName.trim(),
      description: tagDescription.trim(),
      color: tagColor,
    };

    setGroup((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
    setTagName('');
    setTagDescription('');
    setTagColor('#3b82f6');
    setDialogOpen(false);
  };

  const handleDeleteTag = (id: string) => {
    setGroup((prev) => ({ ...prev, tags: prev.tags.filter((t) => t.id !== id) }));
  };

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditTag = (id: string) => {
    const tag = group.tags.find((t) => t.id === id);
    if (!tag) return;
    setEditingTag(tag);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setGroup((prev) => ({
      ...prev,
      tags: prev.tags.map((t) => (t.id === editingTag.id ? editingTag : t)),
    }));
    setEditDialogOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader setTitle={id} setDescription={`${id} group tag`} setIcon={<Tag />} />

      <Card>
        <CardHeader>
          <CardTitle>Project identity</CardTitle>
          <CardDescription>Edit the tag group name and description.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input id="tag-group-name" placeholder={id} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input id="tag-group-description" placeholder={`${id} group tag`} />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>Please use 32 characters at maximum.</CardDescription>
          <Button>Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Create a tag for the capable detections in projects.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Field>
              <Input id="input-button-group" placeholder="Type to search..." />
            </Field>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-106.25">
                <form onSubmit={handleAddTag}>
                  <DialogHeader>
                    <DialogTitle>Add Tag to Group</DialogTitle>
                    <DialogDescription>
                      Define a new detection tag inside this group.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <Field>
                      <Label htmlFor="tag-name">Name</Label>
                      <Input
                        id="tag-name"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="e.g. Clip"
                        required
                      />
                    </Field>

                    <Field>
                      <Label htmlFor="tag-description">Description</Label>
                      <Textarea
                        id="tag-description"
                        value={tagDescription}
                        onChange={(e) => setTagDescription(e.target.value)}
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
                          value={tagColor}
                          onChange={(e) => setTagColor(e.target.value)}
                          className="h-9 w-12 cursor-pointer rounded border bg-transparent p-0"
                        />
                        <Input
                          value={tagColor}
                          onChange={(e) => setTagColor(e.target.value)}
                          className="w-28"
                          maxLength={7}
                          placeholder="#000000"
                        />
                      </div>
                    </Field>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Tag</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <CreateTagItemTable
            pageSize={15}
            data={group.tags}
            onEdit={handleEditTag}
            onDelete={handleDeleteTag} // ← was console.log
          />

          {/* Edit dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-106.25">
              <form onSubmit={handleSaveEdit}>
                <DialogHeader>
                  <DialogTitle>Edit Tag</DialogTitle>
                  <DialogDescription>Update the tag details.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Field>
                    <Label htmlFor="edit-tag-name">Name</Label>
                    <Input
                      id="edit-tag-name"
                      value={editingTag?.name ?? ''}
                      onChange={(e) =>
                        setEditingTag((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                      }
                      placeholder="e.g. Clip"
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="edit-tag-description">Description</Label>
                    <Textarea
                      id="edit-tag-description"
                      value={editingTag?.description ?? ''}
                      onChange={(e) =>
                        setEditingTag((prev) =>
                          prev ? { ...prev, description: e.target.value } : prev
                        )
                      }
                      placeholder="What does this tag detect?"
                      rows={3}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="edit-tag-color">Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="edit-tag-color"
                        type="color"
                        value={editingTag?.color ?? '#3b82f6'}
                        onChange={(e) =>
                          setEditingTag((prev) =>
                            prev ? { ...prev, color: e.target.value } : prev
                          )
                        }
                        className="h-9 w-12 cursor-pointer rounded border bg-transparent p-0"
                      />
                      <Input
                        value={editingTag?.color ?? ''}
                        onChange={(e) =>
                          setEditingTag((prev) =>
                            prev ? { ...prev, color: e.target.value } : prev
                          )
                        }
                        className="w-28"
                        maxLength={7}
                        placeholder="#000000"
                      />
                    </div>
                  </Field>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
