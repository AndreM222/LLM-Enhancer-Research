'use client';

import Link from 'next/link';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconName } from './dialogs/project-icon';
import { CircularProgress } from './ui/circular-progress';
import { UsageTable } from './tables/usage-table';
import { Usage } from './tables/usage-columns';
import React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { NameToIcon } from './sidebarContent';
import { CheckCheck, CloudSync } from 'lucide-react';
import { cva, VariantProps } from 'class-variance-authority';
import { ProjectBanner } from './project-switcher';

export type Project = {
  id: string;
  name: string;
  total: number;
  state: string;
  description: string;
  model: string;
  icon: IconName;
  color: string;
  usage: Usage[];
  tagGroupIds?: string[];
  layoutIds?: string[];
  userIds?: string[];
  roleIds?: string[];
  serverIds?: string[];
  linkedProjectIds?: string[];
};

const projectIconVariants = cva('flex items-center justify-center border shrink-0', {
  variants: {
    size: {
      xs: 'h-8 w-8 rounded-lg [&_svg]:size-4',
      sm: 'h-10 w-10 rounded-xl [&_svg]:size-5',
      md: 'h-12 w-12 rounded-2xl [&_svg]:size-6',
      lg: 'h-16 w-16 rounded-2xl [&_svg]:size-8',
      xl: 'h-20 w-20 rounded-3xl [&_svg]:size-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type ProjectIconProps = React.ComponentProps<'div'> &
  VariantProps<typeof projectIconVariants> & {
    icon?: IconName;
    color?: string;
    iconClassName?: string;
  };

export function ProjectIcon({
  icon,
  color,
  size,
  className,
  iconClassName,
  style,
  ...props
}: ProjectIconProps) {
  return (
    <div
      {...props}
      className={cn(projectIconVariants({ size }), className)}
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        color,
        ...style,
      }}
    >
      <NameToIcon
        name={icon}
        className={cn(
          size === 'xs' && 'size-4',
          size === 'sm' && 'size-5',
          size === 'md' && 'size-6',
          size === 'lg' && 'size-8',
          size === 'xl' && 'size-10',
          iconClassName
        )}
      />
    </div>
  );
}

const ProjectCard = ({ item }: { item: Project }) => {
  const currState: boolean = item.state === 'online';
  const pathname: string = usePathname();

  return (
    <Link href={`${pathname}${item.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <ProjectBanner
                icon={item.icon}
                color={item.color}
                name={item.name}
                description={item.description}
                size='md'
              />
            </div>

            <CardAction>
              <CircularProgress
                variant="animated"
                size={40}
                strokeWidth={11}
                showLabel
                renderLabel={() => {
                  if (currState) return <CheckCheck className="size-5" />;

                  return <CloudSync className="size-5" />;
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
            <UsageTable data={item.usage} pageSize={4} />
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

export function Projects({ data }: { data: Project[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <ProjectCard item={item} key={item.id} />
      ))}
    </div>
  );
}
