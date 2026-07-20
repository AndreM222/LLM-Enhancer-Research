'use client';

import Link from 'next/link';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { IconName } from './dialogs/project-icon';
import { CircularProgress } from './ui/circular-progress';
import { UsageTable } from './tables/usage-table';
import { Usage } from './tables/usage-columns';

export type Project = {
  id: string;
  title: string;
  total: number;
  state: string;
  description: string;
  model: string;
  icon: IconName;
  color: string;
  usage: Usage[];
};

const data: Project[] = [
  {
    id: 'area',
    title: 'Area',
    total: 23,
    state: 'online',
    description: 'Reducing the detection area for focused car inspections.',
    model: 'Gemini',
    icon: 'Folder' as IconName, // ← PascalCase + cast
    color: '#7c3aed',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
  {
    id: 'simple',
    title: 'Simple',
    total: 23,
    state: 'processing',
    description: 'Simple parsing rules for clean, minimal detections.',
    model: 'GPT',
    icon: 'Globe' as IconName,
    color: '#ef4444',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
  {
    id: 'tags',
    title: 'Tags',
    total: 23,
    state: 'online',
    description: 'Uses tags to specialize what the project should look for.',
    model: 'Gemini',
    icon: 'ClipboardList' as IconName,
    color: '#0ea5e9',
    usage: [
      {
        id: '1',
        name: 'Data Usage',
        description: 'Total data usage of the AI model',
        usedData: 1.24,
        maxData: 100,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Image Optimization',
        description:
          'The number of image transformations that were requested from your Deployments.',
        usedData: 12,
        maxData: 100,
        dataType: 'K',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
      {
        id: '1',
        name: 'Fast Memory',
        description: 'Total memory usage for optimization.',
        usedData: 12,
        maxData: 64,
        dataType: 'GB',
      },
    ],
  },
];

export function getProjects(): Project[] {
  return data;
}

const ProjectCard = ({ item }: { item: Project }) => {
  const currState = item.state === 'online';
  const Selected = LucideIcons[item.icon] as React.ComponentType<{ className?: string }>;

  return (
    <Link href={`./${item.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex gap-2 items-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  <Selected />
                </div>

                <CardTitle className="text-xl">{item.title}</CardTitle>
              </div>
              <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>
            </div>

            <CardAction>
              <CircularProgress
                variant="animated"
                size={40}
                strokeWidth={11}
                showLabel
                renderLabel={() => {
                  if (currState) return <LucideIcons.CheckCheck className="size-5" />;

                  return <LucideIcons.CloudSync className="size-5" />;
                }}
                gaugePrimaryColor={currState ? 'var(--color-sky-600)' : 'var(--color-yellow-600)'}
                value={currState ? 100 : 50}
              />
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Detections</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{item.total}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{item.model}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <p className="text-xs text-muted-foreground">Last 30 days</p>
            <UsageTable data={item.usage} onOpen={() => console.log('Open')} />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
          <p className="text-sm text-muted-foreground">Click to open project workspace</p>
          <Button size="sm" variant="secondary">
            Open project
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export function Projects() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <ProjectCard item={item} key={item.id} />
      ))}
    </div>
  );
}
