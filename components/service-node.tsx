'use client';

import { type NodeProps, Handle, Position } from '@xyflow/react';
import { HardDrive } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ProjectIcon } from './project-cards';
import { IconName } from './dialogs/project-icon';
import { Status, StatusIndicator } from './tables/global-columns';

type ServiceData = {
  name: string;
  status: Status;
  volume?: string;
  icon: IconName;
};

export function ServiceNode({ data }: NodeProps) {
  const { name, status, volume, icon } = data as ServiceData;

  return (
    <Card className="w-70 overflow-hidden shadow-xl contrast-96">
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        className="bg-zinc-900! border-zinc-800! w-3! h-3!"
      />
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        className="bg-zinc-900! border-zinc-800! w-3! h-3!"
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        className="bg-zinc-900! border-zinc-800! w-3! h-3!"
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        className="bg-zinc-900! border-zinc-800! w-3! h-3!"
      />

      <div className="px-3 py-1">
        <CardHeader className="flex items-center px-0 space-y-3">
          <ProjectIcon icon={icon} color="" />
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className={`flex items-center gap-2 text-sm`}>
          <StatusIndicator status={status} />
        </CardContent>
      </div>

      {volume && (
        <CardFooter className="px-5 py-3 flex gap-2 items-center">
          <HardDrive size={14} />
          <span>{volume}</span>
        </CardFooter>
      )}
    </Card>
  );
}
