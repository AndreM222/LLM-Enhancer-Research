'use client';

import {
  ArrowLeft,
  Bell,
  Box,
  BriefcaseBusiness,
  ChartArea,
  CirclePile,
  Earth,
  FlaskConical,
  Layers,
  LayoutTemplate,
  Logs,
  MessagesSquare,
  Settings,
  SquareActivity,
  Store,
  Tags,
  User,
  Wallet,
} from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu } from './ui/sidebar';
import { NavUser } from './account-banner';
import { NavContent } from './sidebarContent';
import { usePathname, useRouter } from 'next/navigation';
import { WorkspaceSwitcher } from './team-switcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { getAccountUser, getWorkspace } from '@/lib/mockApi';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export type NavItem = {
  title: string;
  url: string;
  description?: string;
  icon?: React.JSX.Element;
  isActive: boolean;
  iconBg?: string;
  iconFg?: string;
  subItems?: NavItem[];
  items?: NavItem[];
};

const navList: {
  group: string;
  tabs: NavItem[];
}[] = [
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
            title: 'Members',
            description: 'Manage access, roles, members, and account actions.',
            url: '/settings/members',
            icon: <CirclePile />,
            isActive: true,
            subItems: [
              { title: 'Team Members', url: '/settings/members', isActive: true },
              {
                title: 'Pending Invitations',
                url: '/settings/members/invitations',
                isActive: true,
              },
              { title: 'Roles', url: '/settings/members/roles', isActive: true },
            ],
          },
          {
            title: 'Notifications',
            description: 'Configure notifications to keep yourself updated.',
            url: '/settings/notifications',
            icon: <Bell />,
            isActive: true,
          },
          {
            title: 'Layout',
            description: 'Configure session layouts for project behavior.',
            url: '/settings/layouts',
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
        description: 'Monitor detection quality and the model performance overall.',
        url: '/analytics',
        icon: <ChartArea />,
        isActive: true,
      },
      {
        title: 'Activity',
        description: 'Monitor connection activity.',
        url: '/activity',
        icon: <SquareActivity />,
        isActive: true,
      },
      {
        title: 'Global Data',
        description: 'Monitor worlwide activity per country.',
        url: '/global-data',
        icon: <Earth />,
        isActive: true,
      },
      {
        title: 'Logs',
        description: 'See the history of changed made withing this account.',
        url: '/logs',
        icon: <Logs />,
        isActive: true,
      },
      {
        title: 'Experiments',
        url: '/experiments',
        description: 'Monitor experiments activity.',
        icon: <FlaskConical />,
        isActive: true,
        items: [
          {
            title: 'Prompts',
            description:
              'Manage prompt versions generated from image detections and human corrections.',
            url: '/experiments/prompts',
            icon: <MessagesSquare />,
            isActive: true,
          },
        ],
      },
    ],
  },
];

function useCurrentPage() {
  const pathname: string = usePathname();
  const paths: string[] = pathname.split('/');
  paths.pop();
  let prevpath: string = paths.join('/');

  for (const group of navList) {
    for (const tab of group.tabs) {
      if (tab.items) {
        let subMatch = tab.items.find((item) => item.url === pathname);
        if (subMatch) {
          return {
            title: subMatch.title,
            description: subMatch.description,
            icon: subMatch.icon,
            subItems: subMatch.subItems,
          };
        }

        subMatch = tab.items.find((item) => item.url === prevpath);
        if (
          subMatch &&
          subMatch.subItems &&
          subMatch.subItems.find((item) => item.url === pathname)
        ) {
          return {
            title: subMatch.title,
            description: subMatch.description,
            icon: subMatch.icon,
            subItems: subMatch.subItems,
          };
        }
      }
      if (tab.url === pathname) {
        return {
          title: tab.title,
          description: tab.description,
          items: tab.items,
          icon: tab.icon,
          subItems: tab.subItems,
        };
      }

      if (
        tab.url === pathname &&
        tab?.subItems &&
        tab?.subItems?.find((item) => item.url === prevpath)
      ) {
        return {
          title: tab.title,
          description: tab.description,
          icon: tab.icon,
          subItems: tab.subItems,
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
  setTitle,
  setDescription,
  setIcon,
  className,
  iconBg,
  iconFg,
  useIndex = false,
  setSubItem,
}: {
  setTitle?: string;
  setDescription?: string;
  setIcon?: React.JSX.Element;
  className?: string;
  iconBg?: string;
  iconFg?: string;
  useIndex?: boolean;
  setSubItem?: NavItem[];
}) => {
  if (!setTitle) {
    let { title, description, icon, subItems } = useCurrentPage();

    setSubItem = setSubItem || subItems || undefined;
    setTitle = setTitle || title || '';
    setDescription = setDescription || description || '';
    setIcon = setIcon || icon || undefined;
  }

  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    setSubItem?.find((tab) => tab.url === pathname)?.title ?? setSubItem?.[0]?.title;

  let previous: string = '';

  const paths = pathname.split('/');
  if (setSubItem && activeTab !== setSubItem[0].title) paths.pop();
  paths.pop();
  previous = paths.join('/');

  if (setTitle !== '')
    return (
      <div className="w-full space-y-6">
        <div className={`flex w-full justify-between ${className}`}>
          <div className="flex gap-2">
            {setIcon && (
              <div
                className="flex h-16 w-16 items-center justify-center size-6 rounded-2xl border"
                style={{ backgroundColor: `${iconBg}20`, color: iconFg }}
              >
                {setIcon}
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">{setTitle}</h1>
                <p className="text-muted-foreground">{setDescription}</p>
              </div>
            </div>
          </div>

          {(previous || useIndex) && (
            <Button variant="outline" size="sm" className="mt-auto" asChild>
              <Link href={previous || '/'}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return
              </Link>
            </Button>
          )}
        </div>
        {setSubItem && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              const tab = setSubItem.find((t) => t.title === value);
              if (tab) router.push(tab.url);
            }}
          >
            <TabsList>
              {setSubItem.map((tab) => (
                <TabsTrigger key={tab.title} value={tab.title}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
          <WorkspaceSwitcher workspaces={getWorkspace()} />
        </SidebarMenu>
      </SidebarHeader>

      <NavContent items={navList} />

      <SidebarFooter>
        <NavUser user={getAccountUser()} />
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

  const navData = navList;

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
