'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { NavItem, PageHeader } from '@/components/app-navigation';
import * as LucideIcons from 'lucide-react';
import { IconName } from '@/components/dialogs/project-icon';
import { Project } from '@/components/project-cards';
import { getProjectCards } from '@/lib/mockApi';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { project, session } = useParams<{ project: string; session: string }>();

  const projects: Project[] = getProjectCards();
  const currProject: Project | undefined = projects.find((item) => item.id === project);

  const [selectedColor, setSelectedColor] = useState(currProject?.color);
  const [selectedIcon, setSelectedIcon] = useState<IconName>(currProject?.icon as IconName);

  const Selected = LucideIcons[selectedIcon] as React.ComponentType<{ className?: string }>;

  const navTabs: NavItem[] | undefined = session
    ? undefined
    : [
        { title: 'Processed images', url: `/${project}`, isActive: true },
        { title: 'Project settings', url: `/${project}/settings`, isActive: true },
      ];

  return (
    <div className="space-y-6">
      <PageHeader
        setIcon={<Selected />}
        iconBg={selectedColor}
        iconFg={selectedColor}
        setTitle={
          session
            ? session?.length > 0
              ? session.toUpperCase()
              : ''
            : (currProject?.title ?? project?.charAt(0).toUpperCase() + project.slice(1))
        }
        setDescription={
          session
            ? `${session?.toUpperCase()} session image detections from project ${project}`
            : (currProject?.description ?? `${project?.toUpperCase()} project image detections`)
        }
        setSubItem={navTabs}
        useIndex={true}
      />

      {children}
    </div>
  );
}
