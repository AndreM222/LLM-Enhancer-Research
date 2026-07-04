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
import {
  Globe,
  Server,
  Database,
  Brain,
  Cpu,
  GitBranch,
  FileImage,
  Layers,
  ScrollText,
  FlaskConical,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  id, sourceX, sourceY, targetX, targetY,
}: { id: string; sourceX: number; sourceY: number; targetX: number; targetY: number }) {
  const centerY = (targetY - sourceY) / 2 + sourceY;
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} />;
}

const edgeTypes = { step: StepEdge };

// ─── Layout ────────────────────────────────────────────────────────────────
// Col positions
const COL = { ui: 100, api: 500, ai: 900, db: 1300 };
// Row positions
const ROW = { top: 80, mid1: 280, mid2: 480, mid3: 680, bot: 880 };

const initialNodes: Node[] = [
  // ── Frontend ──
  {
    id: 'frontend',
    type: 'service',
    position: { x: COL.ui, y: ROW.mid1 },
    data: { name: 'Next.js Frontend', status: 'online', icon: <Globe /> },
  },
  {
    id: 'canvas',
    type: 'service',
    position: { x: COL.ui, y: ROW.mid3 },
    data: { name: 'Konva Canvas', status: 'online', icon: <Layers />, volume: 'bbox editor' },
  },

  // ── Backend / API ──
  {
    id: 'api',
    type: 'service',
    position: { x: COL.api, y: ROW.mid2 },
    data: { name: 'API Server', status: 'online', icon: <Server /> },
  },
  {
    id: 'detection',
    type: 'service',
    position: { x: COL.api, y: ROW.bot },
    data: { name: 'Detection Service', status: 'online', icon: <FlaskConical /> },
  },
  {
    id: 'prompt-engine',
    type: 'service',
    position: { x: COL.api, y: ROW.top },
    data: { name: 'Prompt Engine', status: 'online', icon: <GitBranch />, volume: 'prompt optimizer' },
  },

  // ── AI Layer ──
  {
    id: 'gemini',
    type: 'service',
    position: { x: COL.ai, y: ROW.top },
    data: { name: 'Gemini Flash', status: 'online', icon: <Brain /> },
  },
  {
    id: 'llm-optimizer',
    type: 'service',
    position: { x: COL.ai, y: ROW.mid2 },
    data: { name: 'LLM Optimizer', status: 'online', icon: <Cpu />, volume: 'gpt / gemini' },
  },
  {
    id: 'image-store',
    type: 'service',
    position: { x: COL.ai, y: ROW.bot },
    data: { name: 'Image Storage', status: 'online', icon: <FileImage />, volume: 'car photos' },
  },

  // ── Database Layer ──
  {
    id: 'db-detections',
    type: 'service',
    position: { x: COL.db, y: ROW.mid1 },
    data: { name: 'Detections DB', status: 'online', icon: <Database />, volume: 'ver A + B' },
  },
  {
    id: 'db-prompts',
    type: 'service',
    position: { x: COL.db, y: ROW.mid3 },
    data: { name: 'Prompts DB', status: 'online', icon: <ScrollText />, volume: 'best + last prompt' },
  },
];

function e(
  id: string,
  source: string,
  sh: string,
  target: string,
  th: string,
  animated = true,
  label?: string,
): Edge {
  return { id, source, sourceHandle: sh, target, targetHandle: th, type: 'step', animated, label };
}

const initialEdges: Edge[] = [
  // User uploads photo → Frontend → API
  e('fe-api',       'frontend',      'right',  'api',           'left'),
  // Frontend hosts the canvas editor
  e('fe-canvas',    'frontend',      'bottom', 'canvas',        'top'),
  // Canvas (corrected boxes) → API saves correction
  e('canvas-api',   'canvas',        'right',  'api',           'left'),
  // API → Detection Service (run detection)
  e('api-det',      'api',           'bottom', 'detection',     'top'),
  // Detection Service → Gemini Flash (inference)
  e('det-gemini',   'detection',     'right',  'gemini',        'left'),
  // Gemini Flash → Detection Service (returns bboxes)
  e('gemini-det',   'gemini',        'bottom', 'llm-optimizer', 'top'),
  // API pulls active prompt from Prompt Engine
  e('pe-api',       'prompt-engine', 'bottom', 'api',           'top'),
  // Prompt Engine → Gemini Flash (send prompt)
  e('pe-gemini',    'prompt-engine', 'right',  'gemini',        'left'),
  // API → LLM Optimizer (send A+B for prompt improvement)
  e('api-llm',      'api',           'right',  'llm-optimizer', 'left'),
  // LLM Optimizer → Prompt Engine (returns improved prompt)
  e('llm-pe',       'llm-optimizer', 'left',   'prompt-engine', 'right'),
  // LLM Optimizer saves new prompt
  e('llm-dbp',      'llm-optimizer', 'right',  'db-prompts',    'left'),
  // Prompt Engine reads best/last prompt
  e('pe-dbp',       'prompt-engine', 'right',  'db-prompts',    'left'),
  // API saves A/B detections
  e('api-dbd',      'api',           'right',  'db-detections', 'left'),
  // Canvas reads detection results
  e('dbd-canvas',   'db-detections', 'bottom', 'canvas',        'right'),
  // Image store feeds detection service
  e('img-det',      'image-store',   'top',    'detection',     'bottom'),
  // API manages image storage
  e('api-img',      'api',           'bottom', 'image-store',   'top'),
];

export default function ActivityCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
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
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        className="rounded-3xl"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#333" />
        <Panel position="bottom-left">
          <FlowControls />
        </Panel>
      </ReactFlow>
    </div>
  );
}
