'use client';

import { useCallback } from 'react';
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
import { useTheme } from 'next-themes';

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
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) {
  const centerY = (targetY - sourceY) / 2 + sourceY;
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} />;
}

const edgeTypes = { step: StepEdge };

export function edgeInput(
  id: string,
  source: string,
  sh: string,
  target: string,
  th: string,
  animated = true,
  label?: string
): Edge {
  return { id, source, sourceHandle: sh, target, targetHandle: th, type: 'step', animated, label };
}

export default function ActivityCanvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const { resolvedTheme } = useTheme();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ backgroundColor: 'var(--card)' }}
        nodeTypes={nodeTypes}
        fitView
        colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
        className="rounded-3xl border"
        suppressHydrationWarning
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#333" />
        <Panel position="bottom-left">
          <FlowControls />
        </Panel>
      </ReactFlow>
    </div>
  );
}
