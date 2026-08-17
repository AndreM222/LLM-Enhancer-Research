'use client';

import { ArrowLeft } from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu } from './ui/sidebar';
import { NavUser } from './account-banner';
import { NameToIcon, NavContent } from './sidebarContent';
import { usePathname, useRouter } from 'next/navigation';
import { WorkspaceSwitcher } from './team-switcher';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getAccountUser, getWorkspace } from '@/lib/mockApi';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { IconName } from './dialogs/project-icon';
import { ProjectIcon } from './project-cards';

export type NavItem = {
  title: string;
  url: string;
  description?: string;
  icon?: IconName;
  isActive: boolean;
  color?: string;
  subItems?: NavItem[];
  items?: NavItem[];
};

export const navList: {
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
        icon: 'Box',
        isActive: true,
      },
      {
        title: 'Settings',
        description: 'Configuration of workspace and account.',
        url: '/settings',
        icon: 'Settings',
        isActive: true,
        items: [
          {
            title: 'General',
            description: 'Configure defaults.',
            url: '/settings/general',
            icon: 'Layers',
            isActive: true,
          },
          {
            title: 'Workspace',
            description: 'Configure workspace-wide behavior.',
            url: '/settings/workspace',
            icon: 'BriefcaseBusiness',
            isActive: true,
          },
          {
            title: 'Account',
            description: 'Update your personal profile and security settings.',
            url: '/settings/account',
            icon: 'User',
            isActive: true,
          },
          {
            title: 'Members',
            description: 'Manage access, roles, members, and account actions.',
            url: '/settings/members',
            icon: 'CirclePile',
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
            icon: 'Bell',
            isActive: true,
          },
          {
            title: 'Layout',
            description: 'Configure session layouts for project behavior.',
            url: '/settings/layouts',
            icon: 'LayoutTemplate',
            isActive: true,
          },
          {
            title: 'Tags',
            description: 'Configure tags for project behavior.',
            url: '/settings/tags',
            icon: 'Tags',
            isActive: true,
          },
          {
            title: 'Billing',
            description:
              'Review your current plan, payment method, invoice history, and usage limits in one place.',
            url: '/billing',
            icon: 'Wallet',
            isActive: true,
          },
        ],
      },
      {
        title: 'Marketplace',
        description:
          'Publish your model mode, tags, rules, and workflow as a reusable starting point for others to clone and customize.',
        url: '/marketplace',
        icon: 'Store',
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
        icon: 'ChartArea',
        isActive: true,
      },
      {
        title: 'Activity',
        description: 'Monitor connection activity.',
        url: '/activity',
        icon: 'SquareActivity',
        isActive: true,
      },
      {
        title: 'Global Data',
        description: 'Monitor worlwide activity per country.',
        url: '/global-data',
        icon: 'Earth',
        isActive: true,
        subItems: [
          { title: 'Global Activity', url: '/global-data', isActive: true },
          { title: 'Server Activity', url: '/global-data/servers', isActive: true },
        ],
      },
      {
        title: 'Logs',
        description: 'See the history of changed made withing this account.',
        url: '/logs',
        icon: 'Logs',
        isActive: true,
      },
      {
        title: 'Experiments',
        url: '/experiments',
        description: 'Monitor experiments activity.',
        icon: 'FlaskConical',
        isActive: true,
        items: [
          {
            title: 'Prompts',
            description:
              'Manage prompt versions generated from image detections and human corrections.',
            url: '/experiments/prompts',
            icon: 'MessagesSquare',
            isActive: true,
          },
        ],
      },
    ],
  },
];

function useCurrentPage() {
  const pathname = usePathname();

  for (const group of navList) {
    for (const tab of group.tabs) {
      if (tab.url === pathname) {
        return {
          title: tab.title,
          description: tab.description,
          icon: tab.icon,
          items: tab.items,
          subItems: tab.subItems,
        };
      }

      if (tab.subItems?.some((sub) => sub.url === pathname)) {
        return {
          title: tab.title,
          description: tab.description,
          icon: tab.icon,
          items: tab.items,
          subItems: tab.subItems,
        };
      }

      for (const item of tab.items ?? []) {
        if (item.url === pathname) {
          return {
            title: item.title,
            description: item.description,
            icon: item.icon,
            items: item.items,
            subItems: item.subItems,
          };
        }

        if (item.subItems?.some((sub) => sub.url === pathname)) {
          return {
            title: item.title,
            description: item.description,
            icon: item.icon,
            items: item.items,
            subItems: item.subItems,
          };
        }
      }
    }
  }

  return {
    title: '',
    description: '',
    icon: undefined,
    items: undefined,
    subItems: undefined,
  };
}

export function PageItems() {
  const { items } = useCurrentPage();
  return items;
}

type PageHeaderSize = 'sm' | 'md' | 'lg';

const headerSizeStyles: Record<
  PageHeaderSize,
  {
    wrapper: string;
    content: string;
    title: string;
    description: string;
    gap: string;
    tabs: string;
  }
> = {
  sm: {
    wrapper: 'space-y-4',
    content: 'gap-3',
    title: 'text-xl font-semibold tracking-tight',
    description: 'text-xs text-muted-foreground',
    gap: 'gap-2',
    tabs: 'text-xs',
  },
  md: {
    wrapper: 'space-y-5',
    content: 'gap-3',
    title: 'text-2xl font-semibold tracking-tight',
    description: 'text-sm text-muted-foreground',
    gap: 'gap-3',
    tabs: 'text-sm',
  },
  lg: {
    wrapper: 'space-y-6',
    content: 'gap-4',
    title: 'text-3xl font-semibold tracking-tight',
    description: 'text-base text-muted-foreground',
    gap: 'gap-3',
    tabs: 'text-sm',
  },
};

export const PageHeader = ({
  setTitle,
  setDescription,
  setIcon,
  className,
  color,
  iconClassName,
  useIndex = false,
  setSubItem,
  size = 'lg',
}: {
  setTitle?: string;
  setDescription?: string;
  setIcon?: IconName;
  className?: string;
  iconClassName?: string;
  color?: string;
  useIndex?: boolean;
  setSubItem?: NavItem[];
  size?: PageHeaderSize;
}) => {
  const currentPage = useCurrentPage();
  const pathname = usePathname();
  const router = useRouter();

  const title = setTitle ?? currentPage.title ?? '';
  const description = setDescription ?? currentPage.description ?? '';
  const icon = setIcon ?? currentPage.icon;
  const subItems = setSubItem ?? currentPage.subItems ?? undefined;

  const styles = headerSizeStyles[size];

  if (!title) {
    return <div className="-m-3" />;
  }

  const activeTab = subItems?.find((tab) => tab.url === pathname)?.title ?? subItems?.[0]?.title;

  const paths = pathname.split('/').filter(Boolean);

  if (subItems && activeTab !== subItems[0]?.title) {
    paths.pop();
  }

  paths.pop();

  const previous = `/${paths.join('/')}`.replace('//', '/') || '/';
  const showReturnButton = Boolean(previous !== '/' || useIndex);

  return (
    <div className={cn('w-full', styles.wrapper)}>
      <div className={cn('flex w-full items-start justify-between', styles.content, className)}>
        <div className={cn('flex min-w-0 items-start', styles.gap)}>
          {icon && <ProjectIcon color={color} icon={icon} size={size} className={iconClassName} />}

          <div className="min-w-0">
            <h1 className={cn('truncate', styles.title)}>{title}</h1>

            {description ? <p className={cn('mt-1', styles.description)}>{description}</p> : null}
          </div>
        </div>

        {showReturnButton && (
          <Button variant="outline" size="sm" className="mt-auto shrink-0" asChild>
            <Link href={previous}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return
            </Link>
          </Button>
        )}
      </div>

      {subItems && subItems.length > 0 && activeTab ? (
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const tab = subItems.find((item) => item.title === value);

            if (tab) {
              router.push(tab.url);
            }
          }}
        >
          <TabsList>
            {subItems.map((tab) => (
              <TabsTrigger key={tab.title} value={tab.title} className={styles.tabs}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}
    </div>
  );
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
                <NameToIcon name={item.icon} />
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
