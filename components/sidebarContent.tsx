'use client';

import * as LucideIcons from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavItem } from './app-navigation';
import { IconName } from './dialogs/project-icon';
import { ComponentType } from 'react';

export const NameToIcon = ({ name, ...props }: { name?: IconName } & LucideIcons.LucideProps) => {
  const Icon = (LucideIcons as unknown as Record<string, ComponentType<LucideIcons.LucideProps>>)[
    name ?? 'Folder'
  ];

  return <Icon {...props} />;
};

function Groups({ items }: { items: NavItem[] }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url}>
                <NameToIcon name={item.icon} />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <LucideIcons.ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <NameToIcon name={subItem.icon} />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}

export function NavContent({
  items,
}: {
  items: {
    group: string;
    isActive?: boolean;
    tabs: NavItem[];
  }[];
}) {
  return (
    <SidebarContent>
      {items.map((item) => (
        <SidebarGroup key={item.group}>
          <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
          <Groups items={item.tabs} />
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
