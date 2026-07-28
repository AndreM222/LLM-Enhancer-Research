import { Log } from '@/components/tables/logs-columns';
import { LogsTable } from '@/components/tables/logs-table';
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
import { getLogs } from '@/lib/mockApi';

const data: Log[] = getLogs();

export default function Logs() {
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
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="300">400</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Field>
          <Input id="input-button-group" placeholder="Type to search..." />
        </Field>
      </div>
      <LogsTable data={data} />
    </div>
  );
}
