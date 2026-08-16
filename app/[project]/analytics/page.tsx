'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import LinkGraph from '@/components/linkGraph';
import { getProjectLinks } from '@/lib/mockApi';
import { useParams } from 'next/navigation';
import { navList } from '@/components/app-navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ProjectBanner } from '@/components/project-switcher';

function ProjectAnalyticsContent() {
  const { project } = useParams<{ project: string }>();
  const { nodes, groups, links } = getProjectLinks(project);

  const projectTabs = navList[1]?.tabs ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="grid gap-3 sm:grid-cols-2">
          {projectTabs.map((item) => {
            return (
              <Link
                key={`${item.url}?project=${project}`}
                href={`${item.url}?project=${project}`}
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
                  <CardContent className="flex min-h-30 flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-4">
                      <ProjectBanner
                        icon={item.icon ?? 'Folder'}
                        name={item.title}
                        description={item.description}
                        color={item.color}
                        maxDescription={30}
                        size="lg"
                      />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <LinkGraph nodes={nodes} groups={groups} links={links} />
      </div>
    </div>
  );
}

export default function ProjectAnalytics() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading analytics...
        </div>
      }
    >
      <ProjectAnalyticsContent />
    </Suspense>
  );
}
