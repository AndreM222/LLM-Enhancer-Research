'use client';

import {
  ArrowLeft,
  Box,
  BriefcaseBusiness,
  ChartArea,
  Database,
  Layers,
  LayoutTemplate,
  Lock,
  Logs,
  Mail,
  MessagesSquare,
  Settings,
  Store,
  Tags,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu } from './ui/sidebar';
import { NavUser } from './user-button';
import { NavContent } from './sidebarContent';
import { usePathname } from 'next/navigation';
import { WorkspaceSwitcher } from './team-switcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';

export type NavItem = {
  title: string;
  description: string;
  url: string;
  icon: React.JSX.Element;
  isActive: boolean;
  iconBg?: string;
  iconFg?: string;
};

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
              icon: <Mail />,
              isActive: true,
            },
            {
              title: 'Roles',
              description: 'Create roles, define permissions, and choose the default invite role.',
              url: '/users/roles',
              icon: <Lock />,
              isActive: true,
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
              icon: <Layers />,
              isActive: true,
            },
            {
              title: 'Workspace',
              description: 'Configure workspace-wide behavior.',
              url: '/settings/workspace',
              icon: <BriefcaseBusiness />,
              isActive: true,
            },
            {
              title: 'Account',
              description: 'Update your personal profile and security settings.',
              url: '/settings/account',
              icon: <User />,
              isActive: true,
            },
            {
              title: 'Templates',
              description: 'Configure templates for project behavior.',
              url: '/settings/templates',
              icon: <LayoutTemplate />,
              isActive: true,
            },
            {
              title: 'Tags',
              description: 'Configure tags for project behavior.',
              url: '/settings/tags',
              icon: <Tags />,
              isActive: true,
            },
          ],
        },
        {
          title: 'Marketplace',
          description:
            'Publish your model mode, tags, rules, and workflow as a reusable starting point for others to clone and customize.',
          url: '/marketplace',
          icon: <Store />,
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
          icon: <ChartArea />,
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
          title: 'Activity',
          description: 'Monitor prompt quality, correction impact, and model performance.',
          url: '/activity',
          icon: <Database />,
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
        {
          title: 'Billing',
          description:
            'Review your current plan, payment method, invoice history, and usage limits in one place.',
          url: '/billing',
          icon: <Wallet />,
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
  href,
}: {
  newTitle?: string;
  newDescription?: string;
  newIcon?: React.JSX.Element;
  className?: string;
  iconBg?: string;
  iconFg?: string;
  href?: string;
}) => {
  let { title, description, icon } = useCurrentPage();

  title = title || newTitle || '';
  description = description || newDescription || '';
  icon = icon || newIcon || undefined;

  const paths = usePathname().split('/').filter(Boolean);

  let previous: string = '';
  if (href) {
    previous = href;
  } else if (paths.length > 1) {
    paths.pop();
    previous = paths.join('/');
  }

  if (title !== '')
    return (
      <div className={`flex w-full justify-between ${className}`}>
        <div className="flex gap-2">
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

        {previous && (
          <Button variant="outline" size="sm" className="mt-auto" asChild>
            <Link href={`/${previous}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return
            </Link>
          </Button>
        )}
      </div>
    );

  return <div className="-m-3" />;
};

export const AppSidebar = () => {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <WorkspaceSwitcher workspaces={data.workspace} />
        </SidebarMenu>
      </SidebarHeader>

      <NavContent items={data.navigation} />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export function getNavigationItems(): {
  group: string;
  tabs: NavItem[];
}[] {
  let items: {
    group: string;
    tabs: NavItem[];
  }[] = [];

  const navData = data.navigation;

  // Sanatize
  navData.map((group) => {
    let currItem: { group: string; tabs: NavItem[] } = {
      group: group.group,
      tabs: [],
    };

    group.tabs.map((item) => {
      currItem.tabs.push(item);

      if (item?.items) {
        item.items.map((subItem) => {
          currItem.tabs.push(subItem);
        });
      }
    });

    items.push(currItem);
  });

  return items;
}

export default function SubNavigator() {
  const items = PageItems();

  return (
    <nav className="flex flex-col gap-2">
      {items?.map((item) => {
        if (!item.isActive) return null;

        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-auto w-full justify-start rounded-xl border p-2 text-left transition-colors',
              'border-primary/20 bg-primary/10 text-primary hover:bg-primary/10'
            )}
          >
            {item.icon && (
              <div className="flex min-h-12 min-w-12 items-center justify-center size-6 rounded-2xl border">
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
