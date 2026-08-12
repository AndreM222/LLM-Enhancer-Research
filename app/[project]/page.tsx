'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field } from '@/components/ui/field';
import { CreateDetectionTable } from '@/components/tables/detection-table';
import { DetectionSession } from '@/components/tables/detection-columns';

import { getDetectionSessionsByProject } from '@/lib/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname, useRouter, useParams } from 'next/navigation';

export default function Project() {
  const router = useRouter();
  const pathname = usePathname();
  const { project } = useParams<{ project: string }>();
  const detectionList: DetectionSession[] = project ? getDetectionSessionsByProject(project) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            This has the list of all sessions of image detections created.
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
                  <SelectItem value="completed">completed</SelectItem>
                  <SelectItem value="review">review</SelectItem>
                  <SelectItem value="processing">processing</SelectItem>
                  <SelectItem value="failed">failed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Field>
              <Input id="input-button-group" placeholder="Type to search..." />
            </Field>
          </div>
          <CreateDetectionTable
            onOpen={(id) => router.push(`${pathname}/${id}`)}
            data={detectionList}
            onDelete={() => console.log('Delete')}
            pageSize={15}
          />
        </CardContent>
      </Card>
    </div>
  );
}
