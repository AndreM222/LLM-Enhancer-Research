'use client';

import { Box, Database, Logs, MessagesSquare, Users } from 'lucide-react';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu } from './ui/sidebar';
import { FaGear } from 'react-icons/fa6';
import { IoMdAnalytics } from 'react-icons/io';
import { NavUser } from './user-button';
import { NavContent } from './sidebarContent';
import { usePathname } from 'next/navigation';
import { WorkspaceButton } from './workspace-banner';

const data = {
  workspace: {
    name: 'Damage Visualizer',
    logo: '',
  },
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
            },
            {
              title: 'Roles',
              description: 'Create roles, define permissions, and choose the default invite role.',
              url: '/users/roles',
              isactive: true,
            },
          ],
        },
        {
          title: 'Settings',
          description: 'Configuration of workspace and account.',
          url: '/settings',
          icon: <FaGear />,
          isActive: true,
          items: [
            {
              title: 'General',
              description: 'configure defaults.',
              url: '/settings/general',
              isactive: true,
            },
            {
              title: 'Workspace',
              description: 'configure workspace-wide behavior.',
              url: '/settings/workspace',
              isactive: true,
            },
            {
              title: 'Templates',
              description: 'configure workspace-wide behavior.',
              url: '/settings/templates',
              isactive: true,
            },
            {
              title: 'Account',
              description: 'update your personal profile and security settings.',
              url: '/settings/account',
              isactive: true,
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
          };
        }
      }
      if (tab.url === pathname) {
        return {
          title: tab.title,
          description: tab.description,
          items: tab.items,
        };
      }
    }
  }

  return { title: '', description: '' };
}

export function PageItems() {
  const { items } = useCurrentPage();
  return items;
}

export const PageHeader = ({
  newTitle,
  newDescription,
}: {
  newTitle?: string;
  newDescription?: string;
}) => {
  let { title, description } = useCurrentPage();

  title = title || newTitle || '';
  description = description || newDescription || '';

  if (title !== '')
    return (
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
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
          <WorkspaceButton workspace={data.workspace} />
        </SidebarMenu>
      </SidebarHeader>

      <NavContent items={data.navigation} />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
