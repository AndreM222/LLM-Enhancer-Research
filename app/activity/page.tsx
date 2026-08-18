'use client';

import React, { Suspense, useEffect } from 'react';
import ActivityCanvas from '@/components/activity-canvas';
import { Project } from '@/components/cards/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Button } from '@/components/ui/button';
import { getProjects, getActivityForProject, getLogs } from '@/lib/mockApi';
import { FaFileExport } from 'react-icons/fa6';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function ActivityContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projects: Project[] = getProjects();
  const initialProjectId = searchParams.get('project');
  const initialProject = projects.find((p) => p.id === initialProjectId) ?? projects[0];

  const [selectedProject, setSelectedProject] = React.useState<Project | undefined>(initialProject);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedProject?.id) params.set('project', selectedProject.id);
    else params.delete('project');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [selectedProject]);

  const activity = getActivityForProject(selectedProject?.id);
  const logs = getLogs(selectedProject?.id);

  return (
    <div className="h-full w-full space-y-6 overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher
          projects={projects}
          selectedProjectId={selectedProject?.id}
          onChange={(p) => setSelectedProject(p)}
        />
        <Button variant="outline" title="Export activity">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <ActivityCanvas
        initialEdges={activity.edges}
        initialNodes={activity.nodes}
        logs={logs}
        className="h-180"
      />
    </div>
  );
}

export default function Activity() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading activity...
        </div>
      }
    >
      <ActivityContent />
    </Suspense>
  );
}
