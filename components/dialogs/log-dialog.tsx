'use client';

import { CircleAlert, Clock3, Hash, X } from 'lucide-react';

import { Log } from '@/components/tables/logs-columns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/app-navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeBlock } from '@/components/ui/code-block';
import { cn } from '@/lib/utils';

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

export function LogDialog({
  openLog,
  onOpenChange,
}: {
  openLog: Log | null;
  onOpenChange: (v: boolean) => void;
}) {
  if (!openLog) {
    return null;
  }

  return (
    <Dialog
      open={!!openLog}
      onOpenChange={(value) => {
        if (!value) onOpenChange(false);
      }}
    >
      <DialogContent className="p-0 sm:max-w-xl">
        <DialogHeader className="border-b bg-muted/20 px-6 py-5 -mb-4">
          <PageHeader
            setTitle="Request details"
            setDescription="Information about this workspace activity."
            setIcon="Server"
            size="sm"
            iconClassName={
              openLog
                ? [
                    'border-transparent',
                    getStatusTone(openLog.status) === 'success' &&
                      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    getStatusTone(openLog.status) === 'info' &&
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    getStatusTone(openLog.status) === 'warning' &&
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    getStatusTone(openLog.status) === 'error' &&
                      'bg-red-500/10 text-red-600 dark:text-red-400',
                    getStatusTone(openLog.status) === 'default' && 'bg-muted text-muted-foreground',
                  ]
                    .filter(Boolean)
                    .join(' ')
                : undefined
            }
          />
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]" type="scroll">
          <>
            <div className="space-y-6 px-6 py-5">
              <div className="space-y-2">
                <DialogTitle className="text-sm">Request</DialogTitle>

                <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                  <Badge
                    variant={methodVariant(openLog.type)}
                    className="shrink-0 font-mono text-xs"
                  >
                    {openLog.type.toUpperCase()}
                  </Badge>

                  <code className="min-w-0 flex-1 truncate text-sm">{openLog.request}</code>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <CircleAlert className="h-4 w-4" />
                    <p className="text-xs font-medium uppercase tracking-wide">Response status</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold tabular-nums">{openLog.status}</p>

                    <Badge variant="outline" className={statusBadgeClass(openLog.status)}>
                      {statusLabel(openLog.status)}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    <p className="text-xs font-medium uppercase tracking-wide">Timestamp</p>
                  </div>

                  <p className="text-sm font-medium">{formatDate(openLog.time)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-sm">Response body</DialogTitle>
                    <DialogDescription>Data returned by the server.</DialogDescription>
                  </div>
                </div>

                <JsonBlock
                  value={openLog.response}
                  emptyMessage="No response body was recorded for this request."
                />
              </div>

              {openLog.error && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <X className={cn('h-4 w-4', statusIconClass(openLog.status))} />
                    <p
                      className={cn(
                        'text-sm font-medium',
                        openLog.status >= 500
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-amber-700 dark:text-amber-400'
                      )}
                    >
                      Error information
                    </p>
                  </div>

                  <div
                    className={cn(
                      'space-y-4 rounded-lg border p-4',
                      openLog.status >= 500
                        ? 'border-red-500/30 bg-red-500/10'
                        : 'border-amber-500/40 bg-amber-500/10'
                    )}
                  >
                    <div className="space-y-1">
                      <p
                        className={cn(
                          'text-xs font-medium uppercase tracking-wide',
                          openLog.status >= 500
                            ? 'text-red-700/80 dark:text-red-400/80'
                            : 'text-amber-700/80 dark:text-amber-400/80'
                        )}
                      >
                        Message
                      </p>
                      <DialogDescription>{openLog.error.message}</DialogDescription>
                    </div>

                    {openLog.error.code && (
                      <div className="space-y-1">
                        <p
                          className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            openLog.status >= 500
                              ? 'text-red-700/80 dark:text-red-400/80'
                              : 'text-amber-700/80 dark:text-amber-400/80'
                          )}
                        >
                          Error code
                        </p>
                        <code className="text-sm">{openLog.error.code}</code>
                      </div>
                    )}

                    {openLog.error.details !== undefined && (
                      <div className="space-y-2">
                        <p
                          className={cn(
                            'text-xs font-medium uppercase tracking-wide',
                            openLog.status >= 500
                              ? 'text-red-700/80 dark:text-red-400/80'
                              : 'text-amber-700/80 dark:text-amber-400/80'
                          )}
                        >
                          Error details
                        </p>

                        <JsonBlock value={openLog.error.details} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-lg border">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <DialogTitle className="text-sm">Log metadata</DialogTitle>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Log ID</p>
                    <p className="break-all font-mono text-sm">{openLog.id}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Request type</p>
                    <p className="text-sm font-medium">{openLog.type.toUpperCase()}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Recorded at</p>
                    <p className="break-all text-sm">{openLog.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
