import { Projects } from '@/components/project-cards';
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

export default function Home() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex space-x-2">
        <Select defaultValue="none">
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="none">Select Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Field>
          <Input id="input-button-group" placeholder="Type to search..." />
        </Field>

        <Button>Create project</Button>
      </div>
      <Projects />
    </div>
  );
}
