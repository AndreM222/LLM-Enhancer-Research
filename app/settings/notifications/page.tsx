'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type ChannelKey = 'email' | 'push' | 'sms';
type EventKey = 'mentions' | 'comments' | 'assignments' | 'dueDates' | 'productUpdates';

type NotificationPreferences = Record<ChannelKey, Record<EventKey, boolean>>;

const EVENT_LABELS: Record<EventKey, string> = {
  mentions: 'Mentions',
  comments: 'Comments on your items',
  assignments: 'Assignments',
  dueDates: 'Due date reminders',
  productUpdates: 'Product updates & announcements',
};

const EVENT_DESCRIPTIONS: Record<EventKey, string> = {
  mentions: 'When someone mentions you in a comment or note.',
  comments: 'When someone comments on an item you follow or own.',
  assignments: 'When you are assigned to a new item or task.',
  dueDates: 'Reminders for upcoming or overdue due dates.',
  productUpdates: 'News about new features, improvements, and changes.',
};

export default function Notifications() {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    email: {
      mentions: true,
      comments: true,
      assignments: true,
      dueDates: true,
      productUpdates: false,
    },
    push: {
      mentions: true,
      comments: true,
      assignments: true,
      dueDates: true,
      productUpdates: false,
    },
    sms: {
      mentions: false,
      comments: false,
      assignments: false,
      dueDates: true,
      productUpdates: false,
    },
  });

  const updatePref = (channel: ChannelKey, event: EventKey, value: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [event]: value,
      },
    }));
  };

  const setChannel = (channel: ChannelKey, value: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      [channel]: {
        mentions: value,
        comments: value,
        assignments: value,
        dueDates: value,
        productUpdates: channel === 'sms' ? false : value,
      },
    }));
  };

  const allEnabled = (channel: ChannelKey) => Object.values(prefs[channel]).every(Boolean);

  const someEnabled = (channel: ChannelKey) =>
    Object.values(prefs[channel]).some(Boolean) && !allEnabled(channel);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div>
                <CardTitle>Notification channels</CardTitle>
                <CardDescription>
                  Choose which channels to use for different events.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  Notifications sent to your registered email address.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {someEnabled('email') && <Badge variant="secondary">Some</Badge>}
              {allEnabled('email') && <Badge variant="secondary">All</Badge>}
              <Switch
                checked={allEnabled('email')}
                onCheckedChange={(v) => setChannel('email', v)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push notifications</p>
                <p className="text-sm text-muted-foreground">
                  In-app and browser push notifications.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {someEnabled('push') && <Badge variant="secondary">Some</Badge>}
              {allEnabled('push') && <Badge variant="secondary">All</Badge>}
              <Switch checked={allEnabled('push')} onCheckedChange={(v) => setChannel('push', v)} />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-muted-foreground">
                  Text messages for critical alerts only.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {someEnabled('sms') && <Badge variant="secondary">Some</Badge>}
              {allEnabled('sms') && <Badge variant="secondary">All</Badge>}
              <Switch checked={allEnabled('sms')} onCheckedChange={(v) => setChannel('sms', v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event notifications</CardTitle>
          <CardDescription>Fine‑tune which events notify you through each channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(EVENT_LABELS) as EventKey[]).map((event) => (
            <div key={event} className="space-y-3">
              <div>
                <p className="font-medium">{EVENT_LABELS[event]}</p>
                <p className="text-sm text-muted-foreground">{EVENT_DESCRIPTIONS[event]}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Switch
                    checked={prefs.email[event]}
                    onCheckedChange={(v) => updatePref('email', event, v)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Push</span>
                  </div>
                  <Switch
                    checked={prefs.push[event]}
                    onCheckedChange={(v) => updatePref('push', event, v)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">SMS</span>
                  </div>
                  <Switch
                    checked={prefs.sms[event]}
                    onCheckedChange={(v) => updatePref('sms', event, v)}
                    disabled={event === 'productUpdates'}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button className="float-end">Save changes</Button>
    </div>
  );
}
