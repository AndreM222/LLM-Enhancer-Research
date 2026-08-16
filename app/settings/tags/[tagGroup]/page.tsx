'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
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

function TagGroupPageContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = pathname.split('/').filter(Boolean).pop() || '';

  // Replace this with real data fetch by id
  const [group, setGroup] = useState<TagGroupDetail>(getTags()[0]);

  const [dialogOpen, setDialogOpen] = useState(searchParams.get('dialog') === 'add-tag');

  const syncTagDialog = (name: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (name) params.set('dialog', name);
    else params.delete('dialog');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  };

  const handleDeleteTag = (id: string) => {
    setGroup((prev) => ({ ...prev, tags: prev.tags.filter((t) => t.id !== id) }));
  };

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(searchParams.get('dialog') === 'edit-tag');

  useEffect(() => {
    setDialogOpen(searchParams.get('dialog') === 'add-tag');
    setEditDialogOpen(searchParams.get('dialog') === 'edit-tag');
  }, [searchParams]);

  const handleEditTag = (id: string) => {
    const tag = group.tags.find((t) => t.id === id);
    if (!tag) return;
    setEditingTag(tag);
    syncTagDialog('edit-tag');
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader setTitle={id} setDescription={`${id} group tag`} setIcon="Tag" />

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
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                syncTagDialog('add-tag');
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tag
            </Button>

            <TagDialog
              mode="add"
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) syncTagDialog(null);
              }}
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
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) syncTagDialog(null);
            }}
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

export default function TagGroupPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading tag group...
        </div>
      }
    >
      <TagGroupPageContent />
    </Suspense>
  );
}
