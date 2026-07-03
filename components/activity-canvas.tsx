'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ServiceNode } from './service-node';
import { Database, Laptop } from 'lucide-react';

const nodeTypes = {
  service: ServiceNode,
};

const initialNodes: Node[] = [
  {
    id: 'redis',
    type: 'service',
    position: { x: 300, y: 150 },
    data: {
      name: 'Database',
      status: 'online',
      volume: 'database',
      icon: <Database />,
    },
  },
  {
    id: 'front-end',
    type: 'service',
    position: { x: 300, y: 430 },
    data: {
      name: 'Front-End',
      status: 'online',
      icon: <Laptop />,
    },
  },
];

export default function ActivityCanvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#333" />
        <Controls position="bottom-left" style={{ marginBottom: '1rem', marginLeft: '1rem' }} />
      </ReactFlow>
    </div>
  );
}
