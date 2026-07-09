'use client';

import {
  Box,
  BriefcaseBusiness,
  Database,
  Layers,
  LayoutTemplate,
  Lock,
  Logs,
  Mail,
  MessagesSquare,
  Settings,
  Tags,
  User,
  Users,
} from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu } from './ui/sidebar';
import { IoMdAnalytics } from 'react-icons/io';
import { NavUser } from './user-button';
import { NavContent } from './sidebarContent';
import { usePathname } from 'next/navigation';
import { TeamSwitcher } from './team-switcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';

const data = {
  workspace: [
    {
      name: 'Acme Inc',
      logo: '',
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: '',
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: '',
      plan: 'Free',
    },
  ],
  user: {
    name: 'Jacke Myres',
    email: 'Jacke@gmail.com',
    avatar: 'https://github.com/shadcn.png',
  },
  navigation: [
    {
      group: 'Platform',
      tabs: [
        {
          title: 'Projects',
          description: 'List of projects with unique setup for different cases.',
          url: '/',
          icon: <Box />,
          isActive: true,
        },
        {
          title: 'Users',
          description: 'Configuration of users list and permissiones by roles.',
          url: '/users',
          icon: <Users />,
          isActive: true,
          items: [
            {
              title: 'Invitations',
              description: 'Manage access, roles, invitations, and account actions.',
              url: '/users/invitations',
              isactive: true,
              icon: <Mail />,
            },
            {
              title: 'Roles',
              description: 'Create roles, define permissions, and choose the default invite role.',
              url: '/users/roles',
              isactive: true,
              icon: <Lock />,
            },
          ],
        },
        {
          title: 'Settings',
          description: 'Configuration of workspace and account.',
          url: '/settings',
          icon: <Settings />,
          isActive: true,
          items: [
            {
              title: 'General',
              description: 'Configure defaults.',
              url: '/settings/general',
              isactive: true,
              icon: <Layers />,
            },
            {
              title: 'Workspace',
              description: 'Configure workspace-wide behavior.',
              url: '/settings/workspace',
              isactive: true,
              icon: <BriefcaseBusiness />,
            },
            {
              title: 'Account',
              description: 'Update your personal profile and security settings.',
              url: '/settings/account',
              isactive: true,
              icon: <User />,
            },
            {
              title: 'Templates',
              description: 'Configure templates for project behavior.',
              url: '/settings/templates',
              isactive: true,
              icon: <LayoutTemplate />,
            },
            {
              title: 'Tags',
              description: 'Configure tags for project behavior.',
              url: '/settings/tags',
              isactive: true,
              icon: <Tags />,
            },
          ],
        },
        {
          title: 'Activity',
          description: 'Monitor prompt quality, correction impact, and model performance.',
          url: '/activity',
          icon: <Database />,
          isActive: true,
        },
      ],
    },
    {
      group: 'Data',
      tabs: [
        {
          title: 'Analytics',
          description: 'Monitor prompt quality, correction impact, and model performance.',
          url: '/analytics',
          icon: <IoMdAnalytics />,
          isActive: true,
        },
        {
          title: 'Logs',
          description: 'Monitor connection activity.',
          url: '/logs',
          icon: <Logs />,
          isActive: true,
        },
        {
          title: 'Prompts',
          description:
            'Manage prompt versions generated from image detections and human corrections.',
          url: '/prompts',
          icon: <MessagesSquare />,
          isActive: true,
        },
      ],
    },
  ],
};

function useCurrentPage() {
  const pathname = usePathname();

  for (const group of data.navigation) {
    for (const tab of group.tabs) {
      if (tab.items) {
        const subMatch = tab.items.find((item) => item.url === pathname);
        if (subMatch) {
          return {
            title: subMatch.title,
            description: subMatch.description,
            icon: subMatch.icon,
          };
        }
      }
      if (tab.url === pathname) {
        return {
          title: tab.title,
          description: tab.description,
          items: tab.items,
          icon: tab.icon,
        };
      }
    }
  }

  return { title: '', description: '', icon: undefined };
}

export function PageItems() {
  const { items } = useCurrentPage();
  return items;
}

export const PageHeader = ({
  newTitle,
  newDescription,
  newIcon,
  className,
  iconBg,
  iconFg,
}: {
  newTitle?: string;
  newDescription?: string;
  newIcon?: React.JSX.Element;
  className?: string;
  iconBg?: string;
  iconFg?: string;
}) => {
  let { title, description, icon } = useCurrentPage();

  title = title || newTitle || '';
  description = description || newDescription || '';
  icon = icon || newIcon || undefined;

  if (title !== '')
    return (
      <div className={`flex gap-2 ${className}`}>
        {icon && (
          <div
            className="flex h-16 w-16 items-center justify-center size-6 rounded-2xl border"
            style={{ backgroundColor: `${iconBg}20`, color: iconFg }}
          >
            {icon}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    );

  return <div className="-m-3" />;
};

export const AppSidebar = () => {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <TeamSwitcher teams={data.workspace} />
        </SidebarMenu>
      </SidebarHeader>

      <NavContent items={data.navigation} />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default function SubNavigator() {
  const items = PageItems();

  return (
    <nav className="flex flex-col gap-2">
      {items?.map((item) => {
        if (!item.isactive) return null;

        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-auto w-full justify-start rounded-xl border px-4 py-3 text-left transition-colors',
              'border-primary/20 bg-primary/10 text-primary hover:bg-primary/10'
            )}
          >
            {item.icon && (
              <div className="flex h-16 w-16 items-center justify-center size-6 rounded-2xl border">
                {item.icon}
              </div>
            )}
            <div className="flex w-full flex-col items-start gap-1">
              <span className="text-sm font-medium">{item.title}</span>
              {item.description ? (
                <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </div>
            <ChevronRight />
          </Link>
        );
      })}
    </nav>
  );
}
