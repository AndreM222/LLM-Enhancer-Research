'use client';

import { Suspense, useState, useEffect } from 'react';
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
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ProjectPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { project } = useParams<{ project: string }>();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');

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
            <Select value={status} onValueChange={setStatus}>
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
              <Input
                id="input-button-group"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
            <Button onClick={() => console.log('Creating Session')}>Create session</Button>
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

export default function ProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading project...
        </div>
      }
    >
      <ProjectPageContent />
    </Suspense>
  );
}
