'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Project, Projects } from '@/components/cards/project-cards';
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
import { toast } from 'sonner';
import {
  CreateProjectInput,
  ProjectCreateDialog,
} from '@/components/dialogs/create-project-dialog';

const allProjects: Project[] = getProjects();

function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [createOpen, setCreateOpen] = useState(false);

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

  const [projects, setProjects] = useState<Project[]>(allProjects);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = status === 'none' || p.state === status;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [projects, status, search]);

  const handleCreate = (input: CreateProjectInput) => {
    const copySource = projects.find((project) => project.id === input.copyFromId);

    const newId = input.name.toLowerCase().replace(/\s+/g, '-');

    const newProject: Project = {
      id: newId,
      name: input.name,
      description: copySource?.description ?? '',
      total: copySource?.total ?? 0,
      state: 'active',
      icon: input.icon,
      color: input.color,
      model: copySource?.model ?? '',
      usage: [
        {
          id: '1',
          name: 'Data Usage',
          description: 'Total data usage of the AI model',
          usedData: 0,
          maxData: 100,
          dataType: 'GB',
        },
        {
          id: '2',
          name: 'Image Optimization',
          description:
            'The number of image transformations that were requested from your Deployments.',
          usedData: 0,
          maxData: 100,
          dataType: 'K',
        },
        {
          id: '3',
          name: 'Fast Memory',
          description: 'Total memory usage for optimization.',
          usedData: 0,
          maxData: 64,
          dataType: 'GB',
        },
        {
          id: '4',
          name: 'Fast Memory',
          description: 'Total memory usage for optimization.',
          usedData: 0,
          maxData: 64,
          dataType: 'GB',
        },
      ],
    };

    setProjects((previous) => [newProject, ...previous]);

    setCreateOpen(false);

    toast.success(`"${newProject.name}" created.`);

    router.push(`/${newId}/settings`);
  };

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
          <Input
            id="input-button-group"
            placeholder="Type to search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>

        <Button onClick={() => setCreateOpen(true)}>Create project</Button>
      </div>

      <Projects data={filtered} />

      <ProjectCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        projects={projects}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading home...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
