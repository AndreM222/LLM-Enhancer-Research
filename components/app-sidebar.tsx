'use client';

import { Box, Database, Logs, MessagesSquare, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaGear } from 'react-icons/fa6';
import { IoMdAnalytics } from 'react-icons/io';
import { NavUser } from './user-button';
import { NavContent } from './sidebarContent';
import { usePathname } from 'next/navigation';

const data = {
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
          description: 'Monitor prompt quality, correction impact, and model performance.',
          url: '/users',
          icon: <Users />,
          isActive: true,
          items: [
            {
              title: 'Invitations',
              description: 'Monitor prompt quality, correction impact, and model performance.',
              url: '/users/invitations',
              isActive: true,
            },
            {
              title: 'Roles',
              description: 'Monitor prompt quality, correction impact, and model performance.',
              url: '/users/roles',
              isActive: true,
            },
          ],
        },
        {
          title: 'Settings',
          description: 'Monitor prompt quality, correction impact, and model performance.',
          url: '/settings',
          icon: <FaGear />,
          isActive: true,
          items: [
            {
              title: 'Account',
              description: 'Monitor prompt quality, correction impact, and model performance.',
              url: '/settings/account',
              isActive: true,
            },
            {
              title: 'Roles',
              description: 'Monitor prompt quality, correction impact, and model performance.',
              url: '/settings/roles',
              isActive: true,
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
        };
      }
    }
  }

  return { title: 'Dashboard', description: '' };
}

export const PageHeader = () => {
  const { title, description } = useCurrentPage();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const AppSidebar = () => {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-full gap-3 font-bold" asChild>
              <a href="/">
                <Avatar className="m-[-7]">
                  <AvatarImage src="" alt="shadcn" />
                  <AvatarFallback>DV</AvatarFallback>
                </Avatar>
                <span>Damage Visualizer</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <NavContent items={data.navigation} />

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
