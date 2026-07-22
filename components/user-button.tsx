'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { LogOut, UserCircle, Wallet } from 'lucide-react';
import { FaGear } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const sizeConfig = {
  sm: { avatar: 'h-8 w-8', name: 'text-sm', email: 'text-xs' },
  md: { avatar: 'h-12 w-12', name: 'text-base', email: 'text-sm' },
  lg: { avatar: 'h-16 w-16', name: 'text-xl', email: 'text-base' },
} as const;

type BannerSize = keyof typeof sizeConfig;

export function pictureFallback(name: string): string {
  let fallback: string = name[0];

  const firstChar: string[] = name
    .split(' ')
    .slice(1)
    .filter((word) => word.length > 0)
    .map((word) => word[0]);

  fallback += firstChar[0] ?? '';

  return fallback;
}

export function AccountBanner({
  user,
  size = 'sm',
}: {
  user: { name: string; email: string; avatar: string };
  size?: BannerSize;
}) {
  const s = sizeConfig[size];

  return (
    <div className="flex gap-2 items-center">
      <Avatar className={cn('rounded-full', s.avatar)}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className={cn('rounded-full', s.name)}>
          {pictureFallback(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left leading-tight">
        <span className={cn('truncate font-medium', s.name)}>{user.name}</span>
        <span className={cn('truncate text-muted-foreground', s.email)}>{user.email}</span>
      </div>
    </div>
  );
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AccountBanner user={user} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {pictureFallback(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings/account">
                  <UserCircle />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <FaGear />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">
                  <Wallet />
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
