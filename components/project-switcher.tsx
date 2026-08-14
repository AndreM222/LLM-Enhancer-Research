'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Project, ProjectIcon } from './project-cards';
import { ChevronsUpDown, Plus } from 'lucide-react';

type BannerSize = keyof typeof sizeConfig;

const sizeConfig = {
  sm: { avatar: 'h-8 w-8', name: 'text-sm', email: 'text-xs' },
  md: { avatar: 'h-12 w-12', name: 'text-base', email: 'text-sm' },
  lg: { avatar: 'h-16 w-16', name: 'text-xl', email: 'text-base' },
} as const;

export function ProjectBanner({
  project,
  size = 'sm',
  maxDescription,
}: {
  project: Project;
  size?: BannerSize;
  maxDescription?: number;
}) {
  const s = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <ProjectIcon
        icon={project.icon}
        color={project.color}
        className="h-7 w-7 rounded-md"
        iconClassName="h-4 w-4"
      />
      <div className="grid">
        {project.name}
        <span className="text-xs text-muted-foreground">
          {maxDescription ? truncateText(project.description, maxDescription) : project.description}
        </span>
      </div>
    </div>
  );
}

const truncateText = (str: string, limit: number): string => {
  if (str.length <= limit) return str;
  return str.slice(0, limit) + '...';
};

export function ProjectSwitcher({
  projects: projects,
  onChange,
  selectedProjectId,
}: {
  projects: Project[];
  onChange?: (project: Project) => void;
  selectedProjectId?: string;
}) {
  const { isMobile } = useSidebar();
  const [activeProject, setActiveProject] = React.useState(
    projects.find((p) => p.id === selectedProjectId) ?? projects[0]
  );

  React.useEffect(() => {
    if (selectedProjectId) {
      const p = projects.find((p) => p.id === selectedProjectId);
      if (p) setActiveProject(p);
    }
  }, [selectedProjectId, projects]);

  React.useEffect(() => {
    if (onChange && activeProject) onChange(activeProject);
  }, [activeProject, onChange]);

  if (!activeProject) {
    return null;
  }

  return (
    <SidebarMenu className="max-w-70">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <ProjectBanner project={activeProject} maxDescription={30} />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {projects.map((team, index) => {
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveProject(team)}
                  className="gap-2 p-2"
                >
                  <ProjectBanner project={team} maxDescription={30} />
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">New Project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
