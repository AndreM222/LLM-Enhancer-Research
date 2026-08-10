'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SettingValue,
  SingleSetting,
  updateSettingValue,
} from '@/components/tables/settings-columns';

import { SingleSettingsTable } from '@/components/tables/settings-table';
import { notificationAllOptions, notificationSettingsOptions } from '@/lib/mockApi';

type ChannelKey = 'email' | 'push' | 'sms';

const CHANNEL_BY_ID: Record<string, ChannelKey> = {
  'channel-email': 'email',
  'channel-push': 'push',
  'channel-sms': 'sms',
};

type ToggleGroupSetting = Extract<SingleSetting, { type: 'toggleGroup' }>;

function getEventSettings(settings: SingleSetting[]) {
  return settings.filter(
    (setting): setting is ToggleGroupSetting => setting.type === 'toggleGroup'
  );
}

function isToggleGroupValue(value: SettingValue): value is Record<string, boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'boolean')
  );
}

function getChannelStatus(
  channel: ChannelKey,
  eventSettings: ToggleGroupSetting[]
): 'all' | 'some' | 'none' {
  const values = eventSettings.map((setting) => setting.value[channel] ?? false);

  if (values.length > 0 && values.every(Boolean)) {
    return 'all';
  }

  if (values.some(Boolean)) {
    return 'some';
  }

  return 'none';
}

function updateNotificationSetting(
  previous: SingleSetting[],
  id: string,
  value: SettingValue
): SingleSetting[] {
  const changedSetting = previous.find((setting) => setting.id === id);

  if (!changedSetting) {
    return previous;
  }

  let next = updateSettingValue(previous, id, value);

  if (changedSetting.type === 'switch' && typeof value === 'boolean') {
    const channel = CHANNEL_BY_ID[id];

    if (!channel) {
      return next;
    }

    return next.map((setting) => {
      if (setting.type !== 'toggleGroup') {
        return setting;
      }

      return {
        ...setting,
        value: {
          ...setting.value,
          [channel]: value,
        },
      };
    });
  }

  if (changedSetting.type === 'toggleGroup' && isToggleGroupValue(value)) {
    const eventSettings = getEventSettings(next);

    return next.map((setting) => {
      if (setting.type !== 'switch') {
        return setting;
      }

      const channel = CHANNEL_BY_ID[setting.id];

      if (!channel) {
        return setting;
      }

      const status = getChannelStatus(channel, eventSettings);

      return {
        ...setting,
        value: status === 'all',
        status,
      };
    });
  }

  return next;
}

export default function Notifications() {
  const [settings, setSettings] = useState<SingleSetting[]>(() => [
    ...notificationAllOptions(),
    ...notificationSettingsOptions(),
  ]);

  const eventSettings = useMemo(() => getEventSettings(settings), [settings]);

  const channelSettings = useMemo(() => {
    return settings
      .filter(
        (setting): setting is Extract<SingleSetting, { type: 'switch' }> =>
          setting.type === 'switch'
      )
      .map((setting) => {
        const channel = CHANNEL_BY_ID[setting.id];

        return {
          ...setting,
          status: channel ? getChannelStatus(channel, eventSettings) : 'none',
        };
      });
  }, [settings, eventSettings]);

  const handleSettingChange = (id: string, value: SettingValue) => {
    setSettings((previous) => updateNotificationSetting(previous, id, value));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification channels</CardTitle>
          <CardDescription>Choose which channels to use for different events.</CardDescription>
        </CardHeader>

        <CardContent>
          <SingleSettingsTable data={channelSettings} onChange={handleSettingChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event notifications</CardTitle>
          <CardDescription>Fine-tune which events notify you through each channel.</CardDescription>
        </CardHeader>

        <CardContent>
          <SingleSettingsTable data={eventSettings} onChange={handleSettingChange} />
        </CardContent>
      </Card>
    </div>
  );
}
