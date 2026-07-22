'use client';

import LinkGraph from '@/components/linkGraph';
import { TagGroup } from '@/components/tables/tags-columns';
import { CreateTagGroupTable } from '@/components/tables/tags-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function getData(): TagGroup[] {
  return [
    {
      id: '1232',
      name: 'Japanese',
      description: 'Japanese stuff',
      total: 23,
    },
    {
      id: '1235',
      name: 'Scratches',
      description: 'Scratches stuff',
      total: 9,
    },
  ];
}

export default function Tags() {
  const data = getData();

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
        onDuplicate={() => console.log("Duplicate")}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />
      <LinkGraph />
    </div>
  );
}
