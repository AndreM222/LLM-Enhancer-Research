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

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // URL sync for opened service drawer
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // if a service is specified in the URL, open that node's drawer
  useEffect(() => {
    const svc = searchParams.get('service');
    if (!svc) return;
    const node = nodes.find((n) => n.id === svc);
    if (node) setSelectedNode(node as Node);
  }, [searchParams, nodes]);

  const selectedLogs = useMemo(() => {
    if (!selectedNode) {
      return [];
    }

    return logs.filter((log) => log.serviceId === selectedNode.id);
  }, [logs, selectedNode]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(normalizedInitialEdges);

    setSelectedNode(null);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
            router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
          } else if (selectedNode) {
            // when opening, ensure url contains service id
            const params = new URLSearchParams(searchParams.toString());
            params.set('service', selectedNode.id as string);
            router.replace(`${pathname}${params.toString() ? `?${params}` : ''}`, { scroll: false });
          }
        }}
        direction="right"
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-3xl">
            <DrawerHeader>
              <DrawerTitle>
                {String(selectedNode?.data?.name ?? selectedNode?.id ?? 'Activity')}
              </DrawerTitle>
              <DrawerDescription>
                Logs created by this service in the current project.
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="max-h-[65vh] px-6 pb-8">
              {selectedLogs.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="font-medium">No logs found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No activity has been recorded for this service.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border p-4 max-w-80 justify-self-center"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <Badge variant="outline">{log.type}</Badge>
                          <code className="truncate text-sm">{log.request}</code>
                        </div>

                        <Badge
                          variant={
                            log.status >= 500
                              ? 'destructive'
                              : log.status >= 400
                                ? 'secondary'
                                : 'default'
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {new Date(log.time).toLocaleString()}
                      </p>

                      {log.response !== undefined && (
                        <>
                          <Separator className="my-4" />
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Response
                          </p>
                          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                            {JSON.stringify(log.response, null, 2)}
                          </pre>
                        </>
                      )}

                      {log.error && (
                        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                          <p className="text-sm font-medium text-destructive">
                            {log.error.code ?? 'Request error'}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">{log.error.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
