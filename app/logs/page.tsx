'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Log } from '@/components/tables/logs-columns';
import { LogsTable } from '@/components/tables/logs-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogDialog } from '@/components/dialogs/log-dialog';
import { CodeBlock } from '@/components/ui/code-block';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLogs } from '@/lib/mockApi';

const data: Log[] = getLogs();

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function JsonBlock({
  value,
  emptyMessage = 'No response body was recorded.',
}: {
  value: unknown;
  emptyMessage?: string;
}) {
  const code =
    value === undefined || value === null
      ? ''
      : typeof value === 'string'
        ? value
        : JSON.stringify(value, null, 2);

  if (!code) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return <CodeBlock code={code} language="json" />;
}

export function methodVariant(method: string): BadgeVariant {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'default';
    case 'POST':
      return 'secondary';
    case 'PUT':
    case 'PATCH':
      return 'outline';
    case 'DELETE':
      return 'destructive';
    default:
      return 'outline';
  }
}

type StatusTone = 'success' | 'info' | 'warning' | 'error' | 'default';

export function getStatusTone(status: number): StatusTone {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'info';
  if (status >= 200) return 'success';

  return 'default';
}

export function statusBadgeClass(status: number) {
  switch (getStatusTone(status)) {
    case 'success':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';

    case 'info':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400';

    case 'warning':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400';

    case 'error':
      return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400';

    default:
      return 'border-border bg-muted text-muted-foreground';
  }
}

function statusIconClass(status: number) {
  switch (getStatusTone(status)) {
    case 'success':
      return 'text-emerald-600 dark:text-emerald-400';

    case 'info':
      return 'text-blue-600 dark:text-blue-400';

    case 'warning':
      return 'text-amber-600 dark:text-amber-400';

    case 'error':
      return 'text-red-600 dark:text-red-400';

    default:
      return 'text-muted-foreground';
  }
}

function statusLabel(status: number) {
  if (status >= 500) return 'Server error';
  if (status >= 400) return 'Client error';
  if (status >= 300) return 'Redirect';
  if (status >= 200) return 'Successful';
  if (status >= 100) return 'Informational';

  return 'Unknown';
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'long',
  }).format(date);
}

export default function Logs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openLog, setOpenLog] = useState<Log | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set('search', search);
    else params.delete('search');
    if (status && status !== 'none') params.set('status', status);
    else params.delete('status');
    router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
  }, [search, status]);

  useEffect(() => {
    const logId = searchParams.get('log');
    const log = logId ? data.find((logItem) => logItem.id === logId) ?? null : null;
    setOpenLog(log);
    setSearch(searchParams.get('search') ?? '');
    setStatus(searchParams.get('status') ?? 'none');
  }, [searchParams]);

  const handleOpen = (id: string) => {
    const log = data.find((logItem) => logItem.id === id);

    if (log) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('log', log.id);
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
      setOpenLog(log);
    }
  };

  const filtered = data.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      l.request.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      String(l.status).includes(q);
    const matchesStatus = status === 'none' || String(l.status) === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace logs</CardTitle>
          <CardDescription>
            Review requests and actions performed throughout the workspace.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="none">Select status</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Field className="flex-1">
              <Input
                id="log-search"
                placeholder="Search requests, methods, or log IDs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>
          </div>

          <LogsTable data={filtered} pageSize={15} onOpen={handleOpen} />
        </CardContent>
      </Card>

      <LogDialog openLog={openLog} onOpenChange={(v) => !v && setOpenLog(null)} />
    </div>
  );
}
