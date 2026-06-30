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
          url: '/',
          icon: <Box />,
          isActive: true,
        },
        {
          title: 'Users',
          url: '/users',
          icon: <Users />,
          isActive: true,
          items: [
            {
              title: 'Invitations',
              url: '/invitations',
              isActive: true,
            },
            {
              title: 'Roles',
              url: '/roles',
              isActive: true,
            },
          ],
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: <FaGear />,
          isActive: true,
          items: [
            {
              title: 'Account',
              url: '/account',
              isActive: true,
            },
            {
              title: 'Roles',
              url: '/roles',
              isActive: true,
            },
          ],
        },
        {
          title: 'Activity',
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
          url: '/analytics',
          icon: <IoMdAnalytics />,
          isActive: true,
        },
        {
          title: 'Logs',
          url: '/logs',
          icon: <Logs />,
          isActive: true,
        },
        {
          title: 'Prompts',
          url: '/prompts',
          icon: <MessagesSquare />,
          isActive: true,
        },
      ],
    },
  ],
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
