'use client';

import ActivityCanvas, { edgeInput } from '@/components/activity-canvas';
import { Project } from '@/components/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/mockApi';
import { Edge, Node } from '@xyflow/react';
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
} from 'lucide-react';
import { FaFileExport } from 'react-icons/fa6';
import { getLogs } from '@/lib/mockApi';

const initialEdges: Edge[] = [
  // User uploads photo → Frontend → API
  edgeInput('fe-api', 'frontend', 'right', 'api', 'left', true),
  // Frontend hosts the canvas editor
  edgeInput('fe-canvas', 'frontend', 'bottom', 'canvas', 'top'),
  // Canvas (corrected boxes) → API saves correction
  edgeInput('canvas-api', 'canvas', 'right', 'api', 'left'),
  // API → Detection Service (run detection)
  edgeInput('api-det', 'api', 'bottom', 'detection', 'top'),
  // Detection Service → Gemini Flash (inference)
  edgeInput('det-gemini', 'detection', 'right', 'gemini', 'left'),
  // Gemini Flash → Detection Service (returns bboxes)
  edgeInput('gemini-det', 'gemini', 'bottom', 'llm-optimizer', 'top'),
  // API pulls active prompt from Prompt Engine
  edgeInput('pe-api', 'prompt-engine', 'bottom', 'api', 'top'),
  // Prompt Engine → Gemini Flash (send prompt)
  edgeInput('pe-gemini', 'prompt-engine', 'right', 'gemini', 'left'),
  // API → LLM Optimizer (send A+B for prompt improvement)
  edgeInput('api-llm', 'api', 'right', 'llm-optimizer', 'left'),
  // LLM Optimizer → Prompt Engine (returns improved prompt)
  edgeInput('llm-pe', 'llm-optimizer', 'left', 'prompt-engine', 'right'),
  // LLM Optimizer saves new prompt
  edgeInput('llm-dbp', 'llm-optimizer', 'right', 'db-prompts', 'left'),
  // Prompt Engine reads best/last prompt
  edgeInput('pe-dbp', 'prompt-engine', 'right', 'db-prompts', 'left'),
  // API saves A/B detections
  edgeInput('api-dbd', 'api', 'right', 'db-detections', 'left'),
  // Canvas reads detection results
  edgeInput('dbd-canvas', 'db-detections', 'bottom', 'canvas', 'right'),
  // Image store feeds detection service
  edgeInput('img-det', 'image-store', 'top', 'detection', 'bottom'),
  // API manages image storage
  edgeInput('api-img', 'api', 'bottom', 'image-store', 'top'),
];

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
    data: {
      name: 'Prompt Engine',
      status: 'online',
      icon: <GitBranch />,
      volume: 'prompt optimizer',
    },
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
    data: {
      name: 'Prompts DB',
      status: 'online',
      icon: <ScrollText />,
      volume: 'best + last prompt',
    },
  },
];

export default function Activity() {
  const projects: Project[] = getProjects();
  const logs = getLogs();

  return (
    <div className="h-full w-full space-y-6 overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher projects={projects} />

        <Button variant="outline" title="Export activity">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <ActivityCanvas
        initialEdges={initialEdges}
        initialNodes={initialNodes}
        logs={logs}
        className="h-180"
      />
    </div>
  );
}
