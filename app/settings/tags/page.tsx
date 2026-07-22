'use client';

import LinkGraph from '@/components/linkGraph';
import { TagGroup } from '@/components/tables/tags-columns';
import { CreateTagGroupTable } from '@/components/tables/tags-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { getProjectTags } from '@/lib/mockApi';

const data: TagGroup[] = getProjectTags();

export default function Tags() {
  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end">
        <Button>Create Tag</Button>
      </div>

      <Field>
        <ButtonGroup>
          <Input id="input-button-group" placeholder="Type to search..." />
          <Button variant="outline">Search</Button>
        </ButtonGroup>
      </Field>

      <CreateTagGroupTable
        data={data}
        onDuplicate={() => console.log('Duplicate')}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />
      <LinkGraph />
    </div>
  );
}
