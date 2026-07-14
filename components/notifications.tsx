'use client';

import { useState } from 'react';
import { Bell, AlertTriangle, Settings } from 'lucide-react';
import { FaCircle } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const notifications = [
  {
    id: 1,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jul 9',
    tone: 'warning',
  },
  {
    id: 2,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Production',
    date: 'Jun 30',
    tone: 'warning',
  },
  {
    id: 3,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 4,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 5,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 6,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 7,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 8,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
  {
    id: 9,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
  },
];

export default function Notifications() {
  const [tab, setTab] = useState<'Inbox' | 'Archive' | 'Comments'>('Inbox');
  const [enableRequest, setEnableRequest] = useState(true);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-9 rounded-md border-border/60 bg-background shadow-none hover:bg-muted/40"
        >
          <FaCircle className="absolute -right-0.5 -top-0.5 size-2 text-red-500" />
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={12} className="w-105 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-6 text-sm">
            {(['Inbox', 'Archive', 'Comments'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  'text-sm transition',
                  tab === item ? 'text-white' : 'text-white/50 hover:text-white/75'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            className="rounded-md p-2 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <Settings className="size-4" />
          </Button>
        </div>

        <div className="relative">
          <div className="max-h-130 overflow-y-auto">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-4 border-b border-white/10 px-4 py-5',
                  index === notifications.length - 1 && enableRequest && 'mb-34'
                )}
              >
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20">
                  <AlertTriangle className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-6 text-white">
                    <span className="font-semibold">llm-enhancer-research</span> failed to deploy in
                    the <span className="font-semibold">{item.env}</span> environment
                  </p>
                </div>

                <div className="pt-1 text-sm text-white/40">{item.date}</div>
              </div>
            ))}
          </div>
          <div
            className={cn(
              'absolute bottom-2 items-start mx-2 gap-3 rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-xl space-y-2',
              !enableRequest && 'hidden'
            )}
          >
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 size-5 text-blue-400" />
              <PopoverDescription>
                Enable push notifications to receive updates on desktop or mobile
              </PopoverDescription>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10" onClick={() => setEnableRequest(false)}>
                Dismiss
              </Button>
              <Button className="h-10" onClick={() => setEnableRequest(false)}>
                Enable
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4 -mt-3">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-10">
              Mark all as read
            </Button>
            <Button className="h-10">View all</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
