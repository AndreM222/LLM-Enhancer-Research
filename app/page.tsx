'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Project, Projects } from '@/components/project-cards';
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
import { getProjects } from '@/lib/mockApi';

const data: Project[] = getProjects();

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (status && status !== 'none') params.set('status', status);
    else params.delete('status');
    if (search.trim()) params.set('search', search);
    else params.delete('search');

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [status, search]);

  useEffect(() => {
    setStatus(searchParams.get('status') ?? 'none');
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Select value={status} onValueChange={setStatus}>
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
          <Input id="input-button-group" placeholder="Type to search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Field>

        <Button>Create project</Button>
      </div>
      <Projects data={data} />
    </div>
  );
}
