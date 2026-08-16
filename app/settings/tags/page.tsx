'use client';

import { Suspense, useState, useEffect } from 'react';
import { CreateTagGroupDialog, TagGroupInput } from '@/components/dialogs/tag-group-dialog';
import LinkGraph from '@/components/linkGraph';
import { TagGroup } from '@/components/tables/tags-columns';
import { CreateTagGroupTable } from '@/components/tables/tags-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getProjectLinks, getProjectTags } from '@/lib/mockApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const data: TagGroup[] = getProjectTags();

function TagsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const { nodes, groups, links } = getProjectLinks(undefined, 'tags');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  const handleCreate = (input: TagGroupInput) => {
    console.log('Creating tag group:', input);

    const tempId = `tg-${Date.now()}`;
    router.push(`${pathname}/${tempId}`);
  };

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
    return matchesSearch;
  });

  return (
    <div className="grid lg:grid-cols-[1fr_390px] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Tags</CardTitle>
          <CardDescription>
            Create a tag group to manage list of detections for projects.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2 w-full justify-end">
            <Field>
              <Input
                id="input-button-group"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>

            <CreateTagGroupDialog onCreate={handleCreate} />
          </div>

          <CreateTagGroupTable
            pageSize={15}
            data={filtered}
            onDuplicate={() => console.log('Duplicate')}
            onDelete={() => console.log('Deleted')}
            onOpen={(id) => router.push(`${pathname}/${id}`)}
          />
        </CardContent>
      </Card>
      <LinkGraph className="" nodes={nodes} groups={groups} links={links} />
    </div>
  );
}

export default function TagsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading tags...
        </div>
      }
    >
      <TagsPageContent />
    </Suspense>
  );
}
