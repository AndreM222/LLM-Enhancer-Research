'use client';

import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Connection,
  type Edge,
  useReactFlow,
  BaseEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ServiceNode } from './service-node';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import type { Log } from '@/components/tables/logs-columns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { ScrollArea } from '@/components/ui/scroll-area';
import { LogsTable } from './tables/logs-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Field } from './ui/field';
import { Input } from './ui/input';
import { LogDialog } from './dialogs/log-dialog';

const nodeTypes = { service: ServiceNode };

function FlowControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-lg backdrop-blur-md">
      <Button variant="ghost" size="icon" onClick={() => zoomIn()} className="rounded-full">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => zoomOut()} className="rounded-full">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => fitView()} className="rounded-full">
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function StepEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data?: ActivityEdgeData;
}) {
  const centerY = (targetY - sourceY) / 2 + sourceY;

  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${sourceX} ${centerY}`,
    `L ${targetX} ${centerY}`,
    `L ${targetX} ${targetY}`,
  ].join(' ');

  const active = data?.active === true;

  return (
    <BaseEdge
      id={id}
      path={path}
      className={active ? 'activity-edge-active' : undefined}
      style={{
        stroke: active ? '#22c55e' : 'var(--border, #94a3b8)',
        strokeWidth: 3.5,
        strokeOpacity: 1,
      }}
    />
  );
}

const edgeTypes = { step: StepEdge };

export type ActivityEdgeData = {
  active?: boolean;
  label?: string;
};

export function edgeInput(
  id: string,
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
  active = false,
  label?: string
): Edge<ActivityEdgeData> {
  return {
    id,
    source,
    sourceHandle,
    target,
    targetHandle,
    type: 'step',
    animated: active,
    data: {
      active,
      label,
    },
  };
}

export default function ActivityCanvas({
  initialNodes,
  initialEdges,
  logs,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  initialNodes: Node[];
  initialEdges: Edge<ActivityEdgeData>[];
  logs: Log[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const normalizedInitialEdges = initialEdges.map((e) => ({
    ...e,
    type: 'step',
    data: { ...(e.data || {}) },
  }));

  const [edges, setEdges, onEdgesChange] = useEdgesState(normalizedInitialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openLog, setOpenLog] = useState<Log | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? 'none');

  const handleOpen = (id: string) => {
    const log = selectedLogs.find((logItem) => logItem.id === id);

    if (log) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('log', log.id);
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
      setOpenLog(log);
    }
  };

  const selectedLogs = useMemo(() => {
    if (!selectedNode) {
      return [];
    }

    return logs.filter((log) => log.serviceId === selectedNode.id);
  }, [logs, selectedNode]);

  const filtered = selectedLogs.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      l.request.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q) ||
      String(l.status).includes(q);
    const matchesStatus = status === 'none' || String(l.status) === status;
    return matchesSearch && matchesStatus;
  });

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(normalizedInitialEdges);

    setSelectedNode(null);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  useEffect(() => {
    const svc = searchParams.get('service');
    if (!svc) return;
    const node = nodes.find((n) => n.id === svc);
    if (node) setSelectedNode(node as Node);
  }, [searchParams, nodes]);

  useEffect(() => {
    const logId = searchParams.get('log');
    if (!logId) return;
    const log = logs.find((l) => l.id === logId);
    if (log) setOpenLog(log);
  }, [searchParams, logs]);

  return (
    <div className={cn('h-full w-full', className)} {...props}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        style={{ backgroundColor: 'hsl(var(--card))' }}
        fitView
        className="rounded-3xl border"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#333" />

        <Panel position="bottom-left">
          <FlowControls />
        </Panel>
      </ReactFlow>

      <Drawer
        open={!!selectedNode}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNode(null);
            // remove service param when closing
            const params = new URLSearchParams(searchParams.toString());
            params.delete('service');
            router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
              scroll: false,
            });
          } else if (selectedNode) {
            // when opening, ensure url contains service id
            const params = new URLSearchParams(searchParams.toString());
            params.set('service', selectedNode.id as string);
            router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
              scroll: false,
            });
          }
        }}
        direction="right"
      >
        <DrawerContent
          onInteractOutside={(e) => {
            if (
              openLog ||
              (e.target instanceof HTMLElement && e.target.closest('[data-radix-select-viewport]'))
            ) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (openLog) {
              e.preventDefault();
            }
          }}
        >
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader>
              <DrawerTitle>
                {String(selectedNode?.data?.name ?? selectedNode?.id ?? 'Activity')}
              </DrawerTitle>
              <DrawerDescription>
                Logs created by this service in the current project.
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[65vh] px-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-[0.15fr_1.0fr] gap-2">
                  <Select value={status} onValueChange={(v) => setStatus(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent position="popper">
                      <SelectGroup>
                        <SelectItem value="none">All</SelectItem>
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
                      onChange={(e) => {
                        if (!e) {
                          const params = new URLSearchParams(search.toString());
                          params.delete('search');
                          router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
                            scroll: false,
                          });
                          setSearch('');
                        }

                        setSearch(e.target.value);
                      }}
                    />
                  </Field>
                </div>

                <LogsTable data={filtered} pageSize={15} onOpen={handleOpen} />
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>

      <LogDialog
        openLog={openLog}
        onOpenChange={(v) => {
          if (!v) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('log');
            router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, {
              scroll: false,
            });
            setOpenLog(null);
          }
        }}
      />
    </div>
  );
}
