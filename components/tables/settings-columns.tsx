'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { IconName } from '../dialogs/project-icon';

export type SettingKind = 'switch' | 'slider' | 'select' | 'text' | 'toggleGroup';

type BaseSetting = {
  id: string;
  name: string;
  icon?: string;
  description: string;
};

export type SingleSetting =
  | (BaseSetting & {
      type: 'switch';
      value: boolean;
    })
  | (BaseSetting & {
      type: 'slider';
      value: number;
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
    })
  | (BaseSetting & {
      type: 'select';
      value: string;
      options: {
        label: string;
        value: string;
      }[];
    })
  | (BaseSetting & {
      type: 'toggleGroup';
      value: Record<string, boolean>;
      options: {
        label: string;
        icon?: string;
        value: string;
      }[];
    })
  | (BaseSetting & {
      type: 'text';
      value: string;
      placeholder?: string;
    });

export type SettingValue = boolean | number | string | Record<string, boolean>;

type SettingControlProps = {
  setting: SingleSetting;
  onChange: (id: string, value: SettingValue) => void;
};

function SettingControl({ setting, onChange }: SettingControlProps) {
  switch (setting.type) {
    case 'switch':
      return (
        <Switch
          checked={setting.value}
          onCheckedChange={(value) => onChange(setting.id, value)}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Toggle ${setting.name}`}
        />
      );

    case 'slider':
      return (
        <div
          className="flex min-w-40 items-center gap-3"
          onClick={(event) => event.stopPropagation()}
        >
          <Slider
            value={[setting.value]}
            min={setting.min ?? 0}
            max={setting.max ?? 100}
            step={setting.step ?? 1}
            onValueChange={([value]) => onChange(setting.id, value)}
            aria-label={setting.name}
          />

          <span className="w-12 text-right text-sm tabular-nums text-muted-foreground">
            {setting.value}
            {setting.unit ?? ''}
          </span>
        </div>
      );

    case 'select':
      return (
        <div onClick={(event) => event.stopPropagation()}>
          <Select value={setting.value} onValueChange={(value) => onChange(setting.id, value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {setting.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'text':
      return (
        <Input
          value={setting.value}
          placeholder={setting.placeholder}
          onChange={(event) => onChange(setting.id, event.target.value)}
          onClick={(event) => event.stopPropagation()}
          className="w-52"
          aria-label={setting.name}
        />
      );

    case 'toggleGroup':
      return (
        <div onClick={(event) => event.stopPropagation()}>
          <ButtonGroup>
            {setting.options.map((option) => {
              const isEnabled = setting.value[option.value] ?? false;
              const ButtonIcon = LucideIcons[option.icon as IconName] as React.ComponentType<{
                className?: string;
              }>;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isEnabled ? 'default' : 'outline'}
                  aria-pressed={isEnabled}
                  onClick={() => {
                    onChange(setting.id, {
                      ...setting.value,
                      [option.value]: !isEnabled,
                    });
                  }}
                >
                  {option.icon && <ButtonIcon />}
                  {option.label}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
      );

    default:
      return null;
  }
}

export function isToggleGroupValue(value: SettingValue): value is Record<string, boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'boolean')
  );
}

export function updateSettingValue(
  settings: SingleSetting[],
  id: string,
  value: SettingValue
): SingleSetting[] {
  return settings.map((setting) => {
    // Only update the clicked row.
    if (setting.id !== id) {
      return setting;
    }

    switch (setting.type) {
      case 'switch':
        return typeof value === 'boolean' ? { ...setting, value } : setting;

      case 'slider':
        return typeof value === 'number' ? { ...setting, value } : setting;

      case 'select':
      case 'text':
        return typeof value === 'string' ? { ...setting, value } : setting;

      case 'toggleGroup':
        return isToggleGroupValue(value)
          ? {
              ...setting,
              value: {
                ...value,
              },
            }
          : setting;

      default:
        return setting;
    }
  });
}

export function singleSettingsColumns(
  onChange: (id: string, value: SettingValue) => void
): ColumnDef<SingleSetting>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Setting',
      cell: ({ row }) => {
        const { name, description } = row.original;
        const SettingIcon = LucideIcons[row.original.icon as IconName] as React.ComponentType<{
          className?: string;
        }>;

        return (
          <div className="flex items-center gap-2">
            {row.original.icon && <SettingIcon />}
            <div className="min-w-0">
              <p className="font-medium">{name}</p>
              <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'control',
      header: '',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <SettingControl setting={row.original} onChange={onChange} />
          </div>
        );
      },
    },
  ];
}
