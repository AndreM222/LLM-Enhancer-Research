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

import { getDetectionSessions } from '@/lib/mockApi';

const detectionList: DetectionSession[] = getDetectionSessions();

export default function Project() {
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
      <CreateDetectionTable data={detectionList} onDeleteAction={() => console.log('Delete')} />
    </div>
  );
}
