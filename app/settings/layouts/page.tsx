'use client';

import LinkGraph from '@/components/linkGraph';
import { Layout } from '@/components/tables/layouts-columns';
import { CreateLayoutsTable } from '@/components/tables/layouts-table';
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
import { getProjectLayouts } from '@/lib/mockApi';

const data: Layout[] = getProjectLayouts();

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
        <Button>Create Layout</Button>
      </div>

      <CreateLayoutsTable
        data={data}
        onDuplicate={() => console.log('Duplicate')}
        onDelete={() => console.log('Deleted')}
        onOpen={() => console.log('Opened')}
      />

      <LinkGraph />
    </div>
  );
}
