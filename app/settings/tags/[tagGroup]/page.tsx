'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import TagDialog from '@/components/dialogs/tag-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>

            <TagDialog
              mode="add"
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onAdd={(t) => {
                setGroup((prev) => ({ ...prev, tags: [...prev.tags, t] }));
              }}
            />
          </div>

          <CreateTagItemTable
            pageSize={15}
            data={group.tags}
            onEdit={handleEditTag}
            onDelete={handleDeleteTag} // ← was console.log
          />

          {/* Edit dialog */}
          <TagDialog
            mode="edit"
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            initial={editingTag}
            onSave={(t) => {
              setGroup((prev) => ({
                ...prev,
                tags: prev.tags.map((tg) => (tg.id === t.id ? t : tg)),
              }));
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
