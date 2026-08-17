'use client';

import React, { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ProjectSwitcher } from '@/components/project-switcher';
import { getProjects } from '@/lib/mockApi';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const projects = useMemo(() => getProjects(), []);

  const selectedProject = projects.find((p) => p.id === searchParams.get('project')) ?? projects[0];

  return (
    <div className="space-y-6">
      <ProjectSwitcher
        projects={projects}
        selectedProjectId={selectedProject.id}
        onChange={(project) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('project', project.id);
          router.replace(`${pathname}?${params}`, { scroll: false });
        }}
      />
      {children}
    </div>
  );
}
