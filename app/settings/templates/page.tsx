'use client';

import LinkGraph from '@/components/linkGraph';
import { Template } from '@/components/tables/templates-columns';
import { CreateTemplateTable } from '@/components/tables/templates-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getData(): Template[] {
  return [
    {
      id: '1232',
      name: 'Cars',
      description: 'Analyzing cars',
      total: 11,
    },
    {
      id: '1235',
      name: 'Drawings',
      description: 'Analyzing strokes',
      total: 9,
    },
  ];
}

export default function Templates() {
  const data = getData();

  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end">
        <Button>Create Template</Button>
      </div>

      <div className="flex space-x-1">
        <Select defaultValue="none">
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="none">Select Status</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Field>
          <ButtonGroup>
            <Input id="input-button-group" placeholder="Type to search..." />
            <Button variant="outline">Search</Button>
          </ButtonGroup>
        </Field>
      </div>

      <CreateTemplateTable
        data={data}
        onDuplicate={() => console.log("Duplicatr")}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />

      <LinkGraph />
    </div>
  );
}
