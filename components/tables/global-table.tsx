'use client';

import { DataTable } from '@/components/data-table';
import {
  getGlobalActivityColumns,
  getServerActivityColumns,
  GlobeActivity,
  ServerActivity,
} from './global-columns';

export function GlobalActivityTable({ data }: { data: GlobeActivity[] }) {
  return <DataTable columns={getGlobalActivityColumns} data={data} />;
}

export function ServerActivityTable({ data }: { data: ServerActivity[] }) {
  return <DataTable columns={getServerActivityColumns} data={data} />;
}
