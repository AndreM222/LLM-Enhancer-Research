'use client';

import { useState } from 'react';
import { Check, CircleAlert, Clock3, Copy, Hash, Server, X } from 'lucide-react';

import { Log } from '@/components/tables/logs-columns';
import { LogsTable } from '@/components/tables/logs-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { getLogs } from '@/lib/mockApi';
import { PageHeader } from '@/components/app-navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

const data: Log[] = getLogs();

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function JsonBlock({
  value,
  emptyMessage = 'No response body was recorded.',
}: {
  value: unknown;
  emptyMessage?: string;
}) {
  const [copied, setCopied] = useState(false);

  const json =
    value === undefined || value === null
      ? ''
      : typeof value === 'string'
        ? value
        : JSON.stringify(value, null, 2);

  const copyJson = async () => {
    if (!json) return;

    await navigator.clipboard.writeText(json);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  if (!json) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <p className="font-mono text-xs text-zinc-400">JSON</p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={copyJson}
          className="h-7 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Copy className="mr-2 h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <pre className="max-h-64 overflow-auto p-4 font-mono text-xs leading-5">
        <code>{json}</code>
      </pre>
    </div>
  );
}

function methodVariant(method: string): BadgeVariant {
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

function statusVariant(status: number): BadgeVariant {
  if (status >= 500) return 'destructive';
  if (status >= 400) return 'secondary';
  if (status >= 300) return 'outline';
  if (status >= 200) return 'default';

  return 'outline';
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
  const [openLog, setOpenLog] = useState<Log | null>(null);

  const handleOpen = (id: string) => {
    const log = data.find((logItem) => logItem.id === id);

    if (log) {
      setOpenLog(log);
    }
  };

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
            <Select defaultValue="none">
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
              <Input id="log-search" placeholder="Search requests, methods, or log IDs..." />
            </Field>
          </div>

          <LogsTable data={data} pageSize={15} onOpen={handleOpen} />
        </CardContent>
      </Card>

      <Dialog
        open={!!openLog}
        onOpenChange={(value) => {
          if (!value) setOpenLog(null);
        }}
      >
        <DialogContent className="p-0 sm:max-w-xl">
          <DialogHeader className="border-b bg-muted/20 px-6 py-5">
            <PageHeader
              setTitle="Request details"
              setDescription="Information about this workspace activity."
              setIcon={<Server />}
              size="sm"
              iconClassName={
                openLog?.status && openLog.status >= 400
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-primary'
              }
            />
          </DialogHeader>

          <ScrollArea className="max-h-[80vh] ">
            {openLog && (
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
                        <p className="text-xs font-medium uppercase tracking-wide">
                          Response status
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold tabular-nums">{openLog.status}</p>

                        <Badge variant={statusVariant(openLog.status)}>
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
                        <X className="h-4 w-4 text-destructive" />
                        <p className="text-sm font-medium text-destructive">Error information</p>
                      </div>

                      <div className="space-y-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-destructive/80">
                            Message
                          </p>
                          <DialogDescription>{openLog.error.message}</DialogDescription>
                        </div>

                        {openLog.error.code && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-destructive/80">
                              Error code
                            </p>
                            <code className="text-sm">{openLog.error.code}</code>
                          </div>
                        )}

                        {openLog.error.details !== undefined && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-destructive/80">
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
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
