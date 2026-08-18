'use client';

import { useMemo } from 'react';

import { DataTable } from '@/components/data-table';
import {
  SingleSetting,
  SettingValue,
  singleSettingsColumns,
} from '@/components/tables/settings-columns';

type SingleSettingsTableProps = {
  data: SingleSetting[];
  className?: string;
  onChange: (id: string, value: SettingValue) => void;
};

export function SingleSettingsTable({ data, onChange, className }: SingleSettingsTableProps) {
  const columns = useMemo(() => singleSettingsColumns(onChange), [onChange]);

  return <DataTable columns={columns} data={data} hideHeader className={className} />;
}
