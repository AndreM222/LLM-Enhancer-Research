'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, AlertTriangle, Settings, Archive, Inbox, Command } from 'lucide-react';
import { FaCircle } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Kbd, KbdGroup } from './ui/kbd';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

type notification = {
  id: number;
  title: string;
  env: string;
  date: string;
  tone: string;
  space: string;
};

const data: notification[] = [
  {
    id: 1,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jul 9',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 2,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Production',
    date: 'Jun 30',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 3,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 4,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 5,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 6,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 7,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 8,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
  {
    id: 9,
    title: 'llm-enhancer-research failed to deploy',
    env: 'Preview',
    date: 'Jun 29',
    tone: 'warning',
    space: 'Inbox',
  },
];

const INBOX_KEYBOARD_SHORTCUT = 'n';

type Notification = (typeof data)[number];
type Tab = 'Inbox' | 'Archive';

export default function Notifications() {
  const [tab, setTab] = useState<Tab>('Inbox');
  const [enableRequest, setEnableRequest] = useState(true);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(data);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [archivingId, setArchivingId] = useState<number | null>(null);

  const filteredNotifications = useMemo(
    () => notifications.filter((item) => item.space === tab),
    [notifications, tab]
  );

  const toggleNotif = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === INBOX_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleNotif();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleNotif]);

  const archiveNotification = (item: Notification) => {
    setArchivingId(item.id);

    window.setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, space: 'Archive' } : n))
      );
      setArchivingId(null);
      if (tab === 'Inbox') {
        setTab('Inbox');
      }
    }, 260);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <HoverCard>
          <PopoverTrigger asChild>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative size-8 rounded-md border-border/60 bg-background shadow-none hover:bg-muted/40"
              >
                <FaCircle className="absolute -right-0.5 -top-0.5 size-2 text-red-500" />
                <Bell className="size-4" />
                <span className="sr-only">Notifications</span>
              </Button>
            </HoverCardTrigger>
          </PopoverTrigger>

          <HoverCardContent className="w-fit text-xs">
            <KbdGroup>
              Open Inbox
              <Kbd>
                <Command className="size-3" />
              </Kbd>
              <Kbd>n</Kbd>
            </KbdGroup>
          </HoverCardContent>
        </HoverCard>

        <PopoverContent align="end" sideOffset={12} className="w-98 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-1">
            <div className="flex items-center gap-6 text-sm">
              {(['Inbox', 'Archive'] as const).map((item) => (
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

            <Button variant="ghost" className="p-2 text-white/50 hover:bg-white/5 hover:text-white">
              <Settings className="size-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="max-h-130 w-full overflow-y-auto">
              <AnimatePresence initial={false}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: archivingId === item.id ? 0 : 1,
                        x: archivingId === item.id ? 24 : 0,
                        scale: archivingId === item.id ? 0.98 : 1,
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="group flex cursor-pointer items-start gap-4 border-b border-white/10 px-4 py-5 hover:bg-white/3"
                      onClick={() => setActiveNotification(item)}
                    >
                      <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/20">
                        <AlertTriangle className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] leading-6 text-white">
                          <span className="font-semibold">llm-enhancer-research</span> failed to
                          deploy in the <span className="font-semibold">{item.env}</span>{' '}
                          environment
                        </p>
                      </div>

                      <div className="pt-1 text-sm text-white/40">{item.date}</div>

                      <Button
                        variant="ghost"
                        className="ml-1 size-8 p-0 text-white/50 opacity-0 transition group-hover:opacity-100 hover:bg-white/5 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveNotification(item);
                        }}
                        aria-label="Archive notification"
                      >
                        {item.space === 'Archive' ? (
                          <Inbox className="size-4" />
                        ) : (
                          <Archive className="size-4" />
                        )}
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-35">
                    <PopoverDescription className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      {tab === 'Inbox' ? (
                        <Inbox className="size-5" />
                      ) : (
                        <Archive className="size-5" />
                      )}
                      Nothing found in {tab.toLocaleLowerCase()}
                    </PopoverDescription>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={cn(
                'absolute bottom-2 mx-2 space-y-2 rounded-xl border border-white/10 bg-white/3 p-4 backdrop-blur-xl',
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

          <div className="border-t border-white/10 p-2">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10">
                Mark all as read
              </Button>
              <Button className="h-10">Archive all</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={!!activeNotification} onOpenChange={(v) => !v && setActiveNotification(null)}>
        <DialogContent className="sm:max-w-md">
          {activeNotification ? (
            <>
              <DialogHeader>
                <DialogTitle>{activeNotification.title}</DialogTitle>
                <DialogDescription>
                  {activeNotification.env} • {activeNotification.date}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <p>
                  This notification can open a dialog with more details, actions, or a deployment
                  log.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setActiveNotification(null)}>
                    Close
                  </Button>
                  <Button onClick={() => archiveNotification(activeNotification)}>Archive</Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
