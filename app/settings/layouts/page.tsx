'use client';

import { CreateLayoutDialog, LayoutInput } from '@/components/dialogs/layout-dialog';
import LinkGraph from '@/components/linkGraph';
import { LayoutTableData } from '@/components/tables/layouts-columns';
import { CreateLayoutsTable } from '@/components/tables/layouts-table';
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
import { getProjectLayouts, getProjectLinks } from '@/lib/mockApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const data: LayoutTableData[] = getProjectLayouts();

export default function Layouts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');

  const { nodes, groups, links } = getProjectLinks(undefined, 'layout');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');
    if (status && status !== 'none') params.set('status', status);
    else params.delete('status');

    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search, status]);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    setStatus(searchParams.get('status') ?? 'none');
  }, [searchParams]);

  const handleCreate = (input: LayoutInput) => {
    console.log('Creating layout:', input);

    const tempId = `tg-${Date.now()}`;
    router.push(`${pathname}/${tempId}`);
  };

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
    // status is placeholder - assume all have 'ACTIVE' for now
    const matchesStatus = status === 'none' || (d as any).status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid lg:grid-cols-[1fr_390px] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions Setup</CardTitle>
          <CardDescription>
            Manage the layout of photos needed and ordered for sessions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex space-x-2">
            <Select value={status} onValueChange={setStatus}>
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
              <Input
                id="input-button-group"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
            <CreateLayoutDialog onCreate={handleCreate} />
          </div>

          <CreateLayoutsTable
            data={filtered}
            pageSize={15}
            onDuplicate={() => console.log('Duplicate')}
            onDelete={() => console.log('Deleted')}
            onOpen={(id) => router.push(`${pathname}/${id}`)}
          />
        </CardContent>
      </Card>

      <LinkGraph nodes={nodes} groups={groups} links={links} />
    </div>
  );
}
