'use client';

import React, { useEffect } from 'react';
import ActivityCanvas from '@/components/activity-canvas';
import { Project } from '@/components/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Button } from '@/components/ui/button';
import { getProjects, getActivityForProject, getLogs } from '@/lib/mockApi';
import { FaFileExport } from 'react-icons/fa6';

export default function Activity() {
  const projects: Project[] = getProjects();
  const [selectedProject, setSelectedProject] = React.useState<Project | undefined>(projects[0]);

  const activity = getActivityForProject(selectedProject?.id);
  const logs = getLogs(selectedProject?.id);

  useEffect(() => {
    console.log('Project Id: ' + selectedProject?.id);
  }, [selectedProject]);

  return (
    <div className="h-full w-full space-y-6 overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} onChange={(p) => setSelectedProject(p)} />

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
