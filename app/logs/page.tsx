import { type Log } from '@/components/logs-columns';
import { LogsTable } from '@/components/tables/logs-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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

function getData(): Log[] {
  return [
    {
      id: '728ed52f',
      type: 'GET',
      request: '/api/server/connect',
      status: 200,
      time: new Date().toISOString(),
    },
    {
      id: '728ed54f',
      type: 'DELETE',
      request: '/api/server/user',
      status: 500,
      time: new Date().toISOString(),
    },
  ];
}

export default function Logs() {
  const data = getData();
  return (
    <div className="space-y-6">
      <div className="flex space-x-1">
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
          <ButtonGroup>
            <Input id="input-button-group" placeholder="Type to search..." />
            <Button variant="outline">Search</Button>
          </ButtonGroup>
        </Field>
      </div>
      <LogsTable data={data} />
    </div>
  );
}
