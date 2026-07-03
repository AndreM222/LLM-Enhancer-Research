'use client';

import { type NodeProps } from '@xyflow/react';
import { HardDrive } from 'lucide-react';

type ServiceData = {
  name: string;
  status: 'online' | 'offline' | 'error';
  volume?: string;
  icon: string;
};

export function ServiceNode({ data }: NodeProps) {
  const { name, status, volume, icon } = data as ServiceData;

  const statusColor =
    status === 'online' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-zinc-400';

  return (
    <div className="w-[280px] rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden shadow-xl">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-white text-lg">{name}</span>
        </div>
        <div className={`flex items-center gap-2 text-sm ${statusColor}`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          <span className="capitalize">{status}</span>
        </div>
      </div>

      {volume && (
        <div className="border-t border-zinc-700 px-5 py-3 flex items-center gap-2 text-zinc-400 text-sm">
          <HardDrive size={14} />
          <span>{volume}</span>
        </div>
      )}
    </div>
  );
}
