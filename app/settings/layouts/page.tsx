'use client';

import LinkGraph from '@/components/linkGraph';
import { Layout } from '@/components/tables/layouts-columns';
import { CreateLayoutsTable } from '@/components/tables/layouts-table';
import { Button } from '@/components/ui/button';
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
import { getProjectLayouts } from '@/lib/mockApi';
import { usePathname, useRouter } from 'next/navigation';

const data: Layout[] = getProjectLayouts();

export default function Layouts() {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions Setup</CardTitle>
          <CardDescription>
            Manage the layout of photos needed and ordered for sessions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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
            pageSize={15}
            onDuplicate={() => console.log('Duplicate')}
            onDelete={() => console.log('Deleted')}
            onOpen={(id) => router.push(`${pathName}/${id}`)}
          />
        </CardContent>
      </Card>

      <LinkGraph />
    </div>
  );
}
