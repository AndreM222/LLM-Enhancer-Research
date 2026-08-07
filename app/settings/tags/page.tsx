'use client';

import { CreateTagGroupDialog, TagGroupInput } from '@/components/dialogs/tag-group-dialog';
import LinkGraph from '@/components/linkGraph';
import { TagGroup } from '@/components/tables/tags-columns';
import { CreateTagGroupTable } from '@/components/tables/tags-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getProjectTags } from '@/lib/mockApi';
import { usePathname, useRouter } from 'next/navigation';

const data: TagGroup[] = getProjectTags();

export default function Tags() {
  const router = useRouter();
  const pathname = usePathname();

  const handleCreate = (input: TagGroupInput) => {
    console.log('Creating tag group:', input);

    const tempId = `tg-${Date.now()}`;
    router.push(`${pathname}/${tempId}`);
  };

  return (
    <div className="space-y-6">
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
              <Input id="input-button-group" placeholder="Type to search..." />
            </Field>

            <CreateTagGroupDialog onCreate={handleCreate} />
          </div>

          <CreateTagGroupTable
            pageSize={15}
            data={data}
            onDuplicate={() => console.log('Duplicate')}
            onDelete={() => console.log('Deleted')}
            onOpen={(id) => router.push(`${pathname}/${id}`)}
          />
        </CardContent>
      </Card>
      <LinkGraph />
    </div>
  );
}
