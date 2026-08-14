'use client';

import Link from 'next/link';
import { ArrowUpRight, Network } from 'lucide-react';

import LinkGraph from '@/components/linkGraph';
import { getProjectLinks } from '@/lib/mockApi';
import { useParams } from 'next/navigation';
import { navList } from '@/components/app-navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const sectionLabels: Record<string, string> = {
  tags: 'Detection setup',
  layouts: 'Capture workflow',
  roles: 'Access control',
  users: 'Workspace',
  logs: 'Monitoring',
  activity: 'Operations',
};

function getSectionLabel(title: string) {
  const key = title.toLowerCase().replace(/\s+/g, '-');

  return sectionLabels[key] ?? sectionLabels[title.toLowerCase()] ?? 'Project settings';
}

export default function ProjectSettings() {
  const { project } = useParams<{ project: string }>();
  const { nodes, groups, links } = getProjectLinks(project);

  const projectTabs = navList[1]?.tabs ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Project workspace</p>
        <h1 className="text-2xl font-semibold tracking-tight">Project overview</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Configure this project, manage its resources, and inspect how its services and data are
          connected.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Project tools</CardTitle>
            <p className="text-sm text-muted-foreground">
              Open a project area to manage its configuration.
            </p>
          </CardHeader>

          <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
            {projectTabs.map((item) => {
              const title = item.title;
              const section = getSectionLabel(title);

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card
                    className={cn(
                      'relative h-full overflow-hidden transition-all duration-200',
                      'border-border/80 bg-card',
                      'hover:-translate-y-0.5 hover:border-primary/40',
                      'hover:bg-accent/40 hover:shadow-md'
                    )}
                  >
                    <CardContent className="flex min-h-44 flex-col justify-between p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted text-primary transition-colors group-hover:bg-primary/10">
                          <span className="flex h-6 w-6 items-center justify-center">
                            {item.icon}
                          </span>
                        </div>

                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                      </div>

                      <div className="mt-8 space-y-2">
                        <Badge variant="secondary" className="w-fit text-[11px]">
                          {section}
                        </Badge>

                        <h2 className="text-base font-semibold tracking-tight">{item.title}</h2>

                        <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <LinkGraph
          nodes={nodes}
          groups={groups}
          links={links}
          className="min-h-0 rounded-none border-0"
        />
      </div>
    </div>
  );
}
