'use client';

import LinkGraph from '@/components/linkGraph';
import { Template } from '@/components/tables/templates-columns';
import { CreateTemplateTable } from '@/components/tables/templates-table';
import { Button } from '@/components/ui/button';
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
import { getProjectTemplates } from '@/lib/mockApi';

const data: Template[] = getProjectTemplates();

export default function Layouts() {
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
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
          <Input id="input-button-group" placeholder="Type to search..." />
        </Field>
        <Button>Create Template</Button>
      </div>

      <CreateTemplateTable
        data={data}
        onDuplicate={() => console.log('Duplicatr')}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />

      <LinkGraph />
    </div>
  );
}
